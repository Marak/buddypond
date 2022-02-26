/*

  Buddy Pond Desktop Client

*/

const desktop = {};

// time the desktop object was created in browser
desktop.ctime = new Date();

// `desktop.app` scope is used to keep track of whole `App` instances that are loaded into memory
desktop.app = {};

// `desktop.apps` scope is loaded to store metadata about apps which the desktop is aware of
desktop.apps = {};
desktop.apps.loading = [];
desktop.apps.loaded = [];
desktop.apps.deferred = [];
desktop.apps.lazy = [];
desktop.apps.mostRecentlyLoaded = [];
desktop.apps.loadingStartedAt = 0;
desktop.apps.loadingEndedAt = 0;

// `desktop.settings` scope is used for configurable settings in the desktop
// `desktop.settings` scope will populate it values from what is stored in localstorage
desktop.settings = {};

// default timeout when calling desktop.use()
// Remark: Counts for all apps being chained by .use() at once, not the individual app loading times
//         Currently set to Infinity since we expect everything to always load ( for now )
desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME = Infinity;

// default timeout between AJAX requests ( 1 seconds )
desktop.DEFAULT_AJAX_TIMER = 1000;

// keep a cache object for buddylist data and messages to prevent re-renders
// this is garbage collected on every updated run, so it should never grow
// TODO: can we now remove this due to processedMessages?
desktop.cache = {};
desktop.cache.buddyListDataCache = {};
desktop.cache.buddyMessageCache = {};

desktop.ui = {};

desktop.messages = {};
// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
// TODO: Have the desktop trim desktop.messages._processed if processed messages exceeds MAX_ALLOWED_PROCESSED_MESSAGES
desktop.messages._processed = [];

// windowIndex is used to keep track of all created windows
desktop.ui.windowIndex = {};

// openWindows is used to keep track of currently open windows
desktop.ui.openWindows = {
  buddy_message: {},
  pond_message: {}
};

// windowPool is used to keep track of pre-created windows
// windowPool is only used for App's which require multiple window instances ( like chats )
// most Apps will not require the window pool as they load with a static window HTML fragment
desktop.ui.windowPool = {}
desktop.ui.windowPool['buddy_message'] = [];
desktop.ui.windowPool['pond_message'] = [];

// set the default desktop.log() method to use console.log
desktop.log = console.log;

desktop.images = {};
desktop.images.preloaded = false;

// add an event handler to each image's load event in the current document and wait until all images are loaded
// this will prevent Desktop.ready from firing before all required images are ready ( no image flicking on load )
// this also means that the entire Desktop is blocked from being ready until all current document images are loaded
// TODO: We could add this same code inside desktop.load.remoteAssets()
//       to ensure images in injected HTML fragments block App injection until loaded
var imgs = document.images,
    totalNewImages = imgs.length,
    totalNewLoadedImages = 0;

[].forEach.call(imgs, function(img) {
  if (img.complete) {
    imageLoaded();
  } else {
    img.addEventListener( 'load', imageLoaded, false );
  }
});

function imageLoaded() {
  totalNewLoadedImages++;
  if (totalNewLoadedImages === totalNewImages) {
    // all new images have loaded
    desktop.images.preloaded = true;
  }
}

desktop.preloader = [];
desktop.use = function use(app, params) {
  // queue arguments for preloader
  desktop.preloader.push({ appName: app, params: params });
  return this;
}

desktop.ready = function ready (finish) {
  // preload all the App folders which were requested by desktop.use()
  let scriptArr = [];
  desktop.preloader.forEach(function(app){
    scriptArr.push(`desktop/apps/desktop.${app.appName}/desktop.${app.appName}.js`)
  });
  desktop.load.remoteAssets(scriptArr, function(){
    desktop.preloader.forEach(function(app){
      desktop._use(app.appName, app.params);
    })
    desktop._ready(finish)
  })
  return this;
}

desktop._use = function _use (app, params) {

  params = params || {};
  if (desktop.apps.loading.length === 0) {
    desktop.apps.mostRecentlyLoaded = [];
    desktop.apps.loadingStartedAt = new Date();
  }

  if (!desktop.app[app]) {
    throw new Error('Invalid App Name: "' + app + '"');
  }
  if (!desktop.app[app].load || typeof desktop.app[app].load !== 'function') {
    throw new Error(app + '.load is not a valid function');
  }

  /*
     Buddy Pond Desktop supports both `defer` loading and `lazy` loading of `App`

     Apps load in this order:

     1.  desktop.use(appName)

         Sync style blocking loads ( Desktop will not be Ready until all are completed )
         Calling desktop.use(appName) with no params should be used only for mission-critical Apps

     2. desktop.use(appName, { defer: true })

        Async style non-blocking loads ( Desktop will be Ready before all these load )
        `defer` indicates the `App` should load *immediately* after the Desktop is ready
        `defer` param should be used for Apps that are non-critical, but frequently used

     2. desktop.use(appName, { lazy: true })

        Async style non-blocking loads ( Desktop will be Ready before all these load )
        `lazy` indicates the `App` should load only when the Buddy tries to open it
        `lazy` param should be used for Apps that are non-critical or large ( such as Games )

    Note: If you choose both `lazy` and `defer` options, only `lazy` will be applied.

  */

  if (params.lazy) {
    // The Desktop will call `App.load()` after the Buddy tries to open the `App`
    desktop.app[app].lazyLoad = true;
    desktop.apps.lazy.push(app);
    return this;
  }

  if (params.defer) {
    // The Desktop will call `App.load()` *immediately* after the Desktop is ready
    desktop.app[app].deferredLoad = true;
    desktop.apps.deferred.push(app);
    return this;
  }

  desktop.apps.loading.push({ name: app, params: params });
  desktop.log("Loading", 'App.' + app);

  // Remark: sync `App.load *must* return a value or `Desktop.ready` will never fire
  //         async `App.load` *must* continue with a callback or `Desktop.ready` will never fire
  let result = desktop.app[app].load(params, function(err, re){
    desktop.ui.renderDockIcon(app);
    desktop.apps.loaded.push(app);
    desktop.apps.mostRecentlyLoaded.push(app);
    desktop.apps.loading = desktop.apps.loading.filter(function(a){
      if (a.name === app) {
        return false;
      }
      return true;
    });
  });

  // if the result is not undefined, we can assume no callback was used in App.load
  if (typeof result !== 'undefined') {
    // Remark: dock icon is *not* rendered for sync `App.load` at the moment ( no HTML window has been created )
    desktop.apps.loaded.push(app);
    desktop.apps.mostRecentlyLoaded.push(app);
    desktop.apps.loading = desktop.apps.loading.filter(function(a){
      if (a.name === app) {
        return false;
      }
      return true;
    });
  }

  return this;

}

desktop._ready = function _ready (finish) {

  if (!desktop.images.preloaded || desktop.apps.loading.length > 0) {
    setTimeout(function(){
      if (new Date().getTime() - desktop.apps.loadingStartedAt.getTime() > desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME) {
        throw new Error('desktop.use() took over ' + desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME / 1000 + ' seconds and gave up. Check that all App.load functions are returning values OR firing provided callbacks. If you are loading new assets in your App check Network Tab to ensure all assets are actually returning.')
      }
      desktop._ready(finish);
    }, 10)
  } else {
    desktop.apps.loadingEndedAt = new Date();
    desktop.log("Loaded", desktop.apps.loaded);
    // now that all Apps and their assets have loaded, lets load any deferred Apps
    desktop.log("Loading Deferred Apps", desktop.apps.deferred);
    // Remark: we might have to put a concurrency limit here
    // TODO: Investigate what will happen if there are 1,000 deferred scripts
    //       Will the browser complain or be able to queue them up?
    desktop.apps.deferred.forEach(function(app){

      function _open () {
        desktop.apps.loaded.push(app);
        desktop.ui.renderDockIcon(app);
        desktop.app[app].deferredLoad = false;
        if (desktop.app[app].openWhenLoaded) {
          if (desktop.app[app].openWindow) {
            desktop.app[app].openWindow(app);
            let key = '#window_' + app;
            $(key).show();
            JQD.util.window_flat();
            $(key).show().addClass('window_stack');
            // TODO: loading status cursor indicator should be per App, not global
            document.querySelectorAll('*').forEach(function(node) {
              node.style.cursor = 'pointer';
            });
          } else {
            desktop.log('Error:', 'attempted to open a deffered window ( openWhenLoaded ) but could not find ' + app +'.openWindow')
          }
        }
      }

      // fire and forget them all. provide a noop function for next
      // Remark: the lazyNoop will NOT be executed for *sync* style `App.load` ( see below )
      // check is made in JQDX.openWindow to see if `App.deferredLoad` is true
      let result = desktop.app[app].load({}, function lazyNoop(){
        _open();
      });

      // this indicates App.load was a *sync* style function and the callback was never fired
      if (typeof result !== 'undefined') {
        _open();
      }

    });
    desktop.apps.deferred = [];
    finish(null, desktop.loaded);
  }
  return this;

}

desktop.load = {};

desktop.load.remoteAssets = function loadRemoteAssets (assetArr, final) {

  let assets = {
    script: [],
    css: [],
    appHTML: []
  };

  assetArr.forEach(function(asset){

    if (asset.split('.').pop() === 'js') {
      assets.script.push(asset);
      return;
    }

    if (asset.split('.').pop() === 'css') {
      assets.css.push(asset);
      return;
    }

    // single word, for example: 'console' or 'profile'
    if (asset.split('.').length === 1) {
      assets.appHTML.push(asset);
      return;
    }

    // could not detect asset type by file extension, assume its a JS script tag
    // this style is used by youtube for iframe embeds
    assets.script.push(asset);

  });

  desktop.load.remoteJS(assets.script, function(err) {
    desktop.load.remoteCSS(assets.css, function(err) {
      desktop.load.remoteAppHtml(assets.appHTML[0], function(responseText, textStatus, jqXHR) {
        final(responseText, textStatus, jqXHR);
      });
    });
  });

}

// keep track of all external JS, CSS, and HTML files that have been pulled in
desktop.loaded = {};
desktop.loaded.scripts = [];
desktop.loaded.css = [];
desktop.loaded.appsHTML = {};

/*
  desktop.load.remoteAppHtml() takes in an appName and constructs a uri from appName
  the uri is then loaded with jQuery.load()
  the results of this jQuery.load() are injected into a hidden shadow DOM and then appended into #desktop
  this is very useful for lazy loading App assets so that the main application load size
  does not grow as you install more Apps into the desktop
*/
desktop.load.remoteAppHtml = function loadRemoteAppHtml (appName, cb) {
  if (!appName) {
    return cb(null);
  }
  $('#shadowRender').append(`<div class="${appName}WindowHolder"></div>`)
  $(`.${appName}WindowHolder`).load(`desktop/apps/desktop.${appName}/desktop.${appName}.html`, function (responseText, textStatus, jqXHR) {
    let html = $(`.${appName}WindowHolder`).html();
    desktop.loaded.appsHTML[appName] = html;
    $('#desktop').append(html);
    $(`.${appName}WindowHolder`, '#shadowRender').remove();
    cb(responseText, textStatus, jqXHR);
  });
}

desktop.load.remoteJS = function loadRemoteJS (scriptsArr, final) {

  // filter out already injected scripts
  let existingScripts =  $('script');

  scriptsArr = scriptsArr.filter(function(script){
    let scriptNeedsInjection = true;
    existingScripts.each(function(i, existingScript){
      if (existingScript.src.search(script) !== -1) {
        scriptNeedsInjection = false;
        console.log('Notice: Ignoring duplicate script injection for ' + script);
      }
    });
    return scriptNeedsInjection;
  });

  let total = scriptsArr.length;
  let completed = 0;

  // if total is zero here, it means that all requested scripts have already been loaded and cached
  if (total === 0) {
    return final();
  }

  scriptsArr.forEach(function (scriptPath) {
    // before injecting this script into the document, lets check if its already injected
    // by doing this, we allow Apps to reinject the same deps multiple times without reloads
    var tag = document.createElement('script');
    tag.src = scriptPath;
    desktop.loaded.scripts.push(scriptPath);
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = function () {
      completed++;
      if (completed === total) {
        final();
      }
    }
  });

}

desktop.load.remoteCSS = function loadRemoteCSS (cssArr, final) {

  let total = cssArr.length;
  let completed = 0;

  // if total is zero here, it means that all requested scripts have already been loaded and cached
  if (total === 0) {
    return final();
  }
  cssArr.forEach(function (cssPath) {
    // before injecting this script into the document, lets check if its already injected
    // by doing this, we allow Apps to reinject the same deps multiple times without reloads
    var tag = document.createElement('link');
    tag.href = cssPath;
    tag.rel = "stylesheet";
    desktop.loaded.css.push(cssPath);
    var firstLinkTag = document.getElementsByTagName('link')[0];
    firstLinkTag.parentNode.insertBefore(tag, firstLinkTag);
    tag.onload = function () {
      completed++;
      if (completed === total) {
        final();
      }
    }
  });
}

desktop.refresh = function refreshDesktop () {
  if (desktop.app.buddylist) {
    desktop.app.updateBuddyList();
    desktop.messages.process(desktop.apps.loaded);
  }
}

//
//
// desktop.ui.openWindow() function is used to create instances of a window class
// this allows for multiple window instances to share the same logic
// as of today, windowType can be "buddy_message" or "pond_message"
// this implies there are already HTML elements named window_buddy_message_0 and window_pond_message_0
// these will be incremented by 1 for each window , etc window_buddy_message_1, window_buddy_message_2
// in the future we can have other windowTypes
// for most applications you won't need this method and you can just 
// use $(window_id).hide() or $(window_id).show() instead
//
//

desktop.ui.openWindow = function openWindow (windowType, context, position) {

  let windowTypes = ['buddy_message', 'pond_message']

  desktop.ui.openWindows = desktop.ui.openWindows || {};
  desktop.ui.openWindows[windowType] = desktop.ui.openWindows[windowType] || {};

  desktop.ui.windowIndex = desktop.ui.windowIndex || {};
  desktop.ui.windowIndex[windowType] = desktop.ui.windowIndex[windowType] || {};

  let windowKey;

  if (desktop.ui.openWindows[windowType][context]) {
    // console.log('window already open, doing nothing', desktop.ui.openWindows[windowType][context])
    // if the window is open and not visible, it means it is minimized
    let el = ('#' + desktop.ui.openWindows[windowType][context]);
    let dockEl = ('#' + desktop.ui.openWindows[windowType][context]).replace('window_', 'icon_dock_');
    if (!$(el).is(':visible')) {
      $('.dock_title', dockEl).addClass('rainbow');
    } else {
      $('.dock_title', dockEl).removeClass('rainbow');
    }
    return desktop.ui.openWindows[windowType][context];
  }

  desktop.log(`desktop.ui.openWindow("${windowType}", "${context}")`);

  if (desktop.ui.windowIndex[windowType][context]) {
    let windowId = desktop.ui.windowIndex[windowType][context];
    windowKey = '#' + windowId;
    // console.log('reopening window id', windowId)
    // TODO: check to see if window is min, if so, open it from dock
    // desktop.ui.renderDockElement(windowType + '_' + window_id, context);
    JQD.util.window_flat();
    $(windowKey).show().addClass('window_stack');
  } else {
    // TODO: max windows message
    windowKey = desktop.ui.windowPool[windowType].pop();
    if (!windowKey) {
      alert(`No windows available in windowPool["${windowType}"]\n\n Are too many chat windows open?`);
      return;
    }

    let windowId = '#' + windowKey;
    // console.log('allocating window from pool', windowId)
    $('.window-context-title', windowId).html(context);
    $('.window-context-title', windowId).html(context);
    $(windowId).attr('data-window-context', context);

    $(windowId).show();
    $(windowId).css('width', 600)
    $(windowId).css('height', 440)

    // bring newly opened window to front
    JQD.util.window_flat();
    $(windowId).addClass('window_stack').show();

    // assign window id from pool into windowIndex
    //
    // for example: desktop.ui.windowIndex['buddy_message']['Marak] = '#window_buddy_message_0';
    //
    desktop.ui.windowIndex[windowType][context] = windowId;

    // render the bottom bar dock element
    desktop.ui.renderDockElement(windowKey.replace('window_', ''), context);

    // a new window is being opened, figure out where it should be positioned next to
    // default position is next to the buddylist
    let openNextTo = "#window_buddylist";

    // gather all open buddy_messsage windows and find the first one
    // if the first one exists, assign that to open next to
    
    let first = Object.keys(desktop.ui.openWindows.buddy_message)[0];
    if (desktop.ui.openWindows.buddy_message[first]) {
      openNextTo = '#' + desktop.ui.openWindows.buddy_message[first];
    } else {
      // do nothing
    }

    position = position || {}
    position.my = position.my || "left top",
    position.at = position.at || 'right top',
    position.of = position.of || openNextTo

    // TODO: this shouldn't happen. refactor chat window positioning to not depend on buddylist being visible
    try {
      $(windowId).position(position);
    } catch (err) {
      console.log('Warning: Error in showing ' + windowId, err);
    }
    
    if (windowType === 'buddy_message') {

      // invalidate previous processed messages for this buddy
      desktop.messages._processed = desktop.messages._processed.filter(function(uuid){
        if (desktop.cache.buddyMessageCache[buddypond.me + '/' + context]) {
          if (desktop.cache.buddyMessageCache[buddypond.me + '/' + context].indexOf(uuid) !== -1) {
            return false
          }
        }
        return true;
      });
      desktop.app.buddylist.onWindowOpen(windowId, context);
    }

  }

  // the window is now open ( either its new or it's been re-opened )
  // assign this window key into desktop.ui.openWindows
  desktop.ui.openWindows[windowType][context] = windowKey;

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.ui.openWindows[windowType]))
  }

  if (windowType === 'pond_message') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.ui.openWindows[windowType]))
  }

  return windowKey;
}

//
// desktop.ui.closeWindow() function is used to close instanced windows
// in most cases you can just use $(window_id).hide()
// The current logic here is for ensuring subscribed buddies and pond lists
// are updated when the user closes the window in the UI
// This is to ensure UI is only polling for messages on windows that are actually open
//
desktop.ui.closeWindow = function openWindow (windowType, context) {
  desktop.ui.openWindows = desktop.ui.openWindows || {};
  desktop.ui.openWindows[windowType] = desktop.ui.openWindows[windowType] || {};

  // console.log('pushing window back into pool', desktop.ui.openWindows[windowType][context])

  // Since the window is now closed, we can push it back into the windowPool,
  // based on it's windowType and context
  // for example: desktop.ui.windowPool['buddy_message'].push(desktop.ui.openWindows['buddy_message']['Marak'])

  // TODO: check to see if window is actually open before attempting to close
  desktop.ui.windowPool[windowType].push(desktop.ui.openWindows[windowType][context])

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.ui.openWindows[windowType]))
    // remove newMessages notification for this buddy
    // TODO: move this to buddylist.closeWindw()
    desktop.app.buddylist.profileState.updates["buddies/" + context] = desktop.app.buddylist.profileState.updates["buddies/" + context] || {};
    desktop.app.buddylist.profileState.updates["buddies/" + context].newMessages = false;
    $('.chat_messages', '#' + desktop.ui.openWindows[windowType][context]).html('');
  }

  if (windowType === 'pond_message') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.ui.openWindows[windowType]))
  }

  // TODO: replace delete statements?
  //
  // Remove the closed window from openWindows and windowIndex ( as it's no longer being tracked )
  //
  delete desktop.ui.openWindows[windowType][context];
  delete desktop.ui.windowIndex[windowType][context];

}

//
// desktop.messages.process() queries the server for new messages and then
// delegates those messages to any applications which expose an App.processMessages() function
// currently hard-coded to pond, and buddylist apps. Can easily be refactored and un-nested.
//
desktop.messages.process = function processMessages (apps) {
  apps = apps || desktop.apps.loaded;
  if (!buddypond.qtokenid) {
    // no session, wait a short tick and try again
    // this most likely indicates login is in progress
    setTimeout(function(){
      desktop.messages.process();
    }, 10);
  } else {

    //
    // calculate list of subscribed buddies and subscribed ponds
    //
    var subscribedBuddies = Object.keys(desktop.ui.openWindows['buddy_message'])
    var subscribedPonds = Object.keys(desktop.ui.openWindows['pond_message'])

    // TODO: Configure desktop.messages.process() to still check for agent and systems messages here
    if (subscribedBuddies.length === 0 && subscribedPonds.length === 0) {
      setTimeout(function(){
        desktop.messages.process();
      }, 10);
      return;
    }

    let params = {
      buddyname: subscribedBuddies.toString(),
      pondname: subscribedPonds.toString()
    };

    //
    // call buddypond.getMessages() to get buddy messages data
    //
    // console.log('sending params', params)
    // console.log('calling, buddylist.getMessages', params);
    buddypond.getMessages(params, function(err, data){
      // console.log('calling back, buddylist.getMessages', err, data);
      if (err) {
        console.log('error in getting messages', err);
        // TODO: show disconnect error in UX
        // if an error has occured, give up on processing messages
        // and retry again shortly
        setTimeout(function(){
          desktop.messages.process();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }


      //
      // filter out any messaages which have already been processed by uuid
      // the deskop UX will only process each message once as to not re-render / flicker elements and message events
      let newMessages = [];
      data.messages.forEach(function(message){
        if (desktop.messages._processed.indexOf(message.uuid) === -1) {
          newMessages.push(message)
        }
      });
      // console.log(data.messages.length, ' messages came in');
      // console.log(newMessages.length, ' are being rendered');
      data.messages = newMessages;

      // iterate through every app that is loaded and see if it exports `App.processMessages` function
      // currently we processMessages for: `App.buddylist`, `App.pond`, and `App.automaton`
      let appNameProcessMessagesList = [];
      apps.forEach(function(app){
        if (typeof desktop.app[app].processMessages === 'function') {
          appNameProcessMessagesList.push(desktop.app[app].processMessages)
        }
      })

      //
      // once we have the message data and know which Apps have `App.processMessages` available...
      // delegate tge message data to each App's internal processMessages() function
      //
      desktop.utils.asyncApplyEach(
        appNameProcessMessagesList,
        data,
        function done (err, results) {
          // `App.processMessages` should return `true`
          // just ignore all the errors and results for now
          // console.log(err, results);
          //
          // All apps have completed rendering messages, set a timer and try again shortly
          //
          setTimeout(function(){
            desktop.messages.process(desktop.apps.loaded);
          }, desktop.DEFAULT_AJAX_TIMER);
      });
    });
  }
}

desktop.utils = {};

/* untested, made the wrong one oops
desktop.utils.asyncForEach = function asyncForEach(arr, fn, finish) {
  let completed = 0;
  let results = [];
  arr.forEach(function(data){
    fn(data, function _asyncForEachContinue(err, result){
      completed++;
      results.push(result);
      if (completed === arr.length) {
        finish(null, results)
      }
    })
  })
}
*/

desktop.utils.asyncApplyEach = function asyncApplyEach (fns, data, finish) {
  let completed = 0;
  let results = [];
  fns.forEach(function(fn){
    fn(data, function (err, result) {
      results.push(err, result);
      completed++;
      if (completed === fns.length) {
        finish(null, results)
      }
    })
  })
}