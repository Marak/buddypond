/*

  Buddy Pond Desktop Client

*/

const desktop = {};

// time the desktop object was created in browser
desktop.ctime = new Date();

desktop.apps = {};
desktop.apps.loading = [];
desktop.apps.loaded = [];
desktop.apps.deferred = [];
desktop.apps.mostRecentlyLoaded = [];
desktop.apps.loadingStartedAt = 0;
desktop.apps.loadingEndedAt = 0;

// default timeout when calling desktop.use()
// Remark: Counts for all apps being chained by .use() at once, not the individual app loading times
//         Currently set to Infinity since we expect everything to always load ( for now )
desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME = Infinity;

// default timeout between AJAX requests ( 1 seconds )
desktop.DEFAULT_AJAX_TIMER = 1000;

// keep a cache object for buddylist data and messages to prevent re-renders
// this is garbage collected on every updated run, so it should never grow
// TODO: can we now remove this due to processedMessages?
desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
// TODO: Have the desktop trim desktop.processedMessages if processed messages exceeds MAX_ALLOWED_PROCESSED_MESSAGES
desktop.processedMessages = [];

// windowIndex is used to keep track of all created windows
desktop.windowIndex = {};

// openWindows is used to keep track of currently open windows
desktop.openWindows = {
  buddy_message: {},
  pond_message: {}
};

// windowPool is used to keep track of pre-created windows
desktop.windowPool = {}
desktop.windowPool['buddy_message'] = [];
desktop.windowPool['pond_message'] = [];

// set the default desktop.log() method to use console.log
desktop.log = console.log;

desktop.images = {};
desktop.images.preloaded = false;

// add an event handler to each image's load event in the current document and wait until all images are loaded
// this will prevent Desktop.ready from firing before all required images are ready ( no image flicking on load )
// this also means that the entire Desktop is blocked from being ready until *all* document images are loaded
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
  desktop.loadRemoteAssets(scriptArr, function(){
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

  if (!desktop[app]) {
    throw new Error('Invalid App Name: "' + app + '"');
  }
  if (!desktop[app].load || typeof desktop[app].load !== 'function') {
    throw new Error(app + '.load is not a valid function');
  }
  if (params.lazy) {
    // Remark: Right now we are actually only doing *deferred loading* and not true *lazy loading*
    //         A deferred load is a load automatically executed after Desktop Ready
    //         A true lazy load would be in response to a User Interaction ( like Desktop Icon double click )
    //
    // TODO: Implement lazy loading in addition to defered loading ( calling App.load() in response to click )
    desktop[app].lazyLoad = true;
    desktop[app].deferredLoad = true;
    desktop.apps.deferred.push(app);
    return this;
  }

  desktop.apps.loading.push({ name: app, params: params });
  desktop.log("Loading", 'App.' + app);

  // Remark: sync App.load *must* return a value or Desktop.ready will never fire
  let result = desktop[app].load(params, function(err, re){
    desktop.renderDockIcon(app);
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
    desktop.renderDockIcon(app);
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
    desktop.apps.deferred.forEach(function(app){
      // fire and forget them all
      // check is made in JQDX.openWindow to see if `App.deferredLoad` is true
      desktop[app].load({}, function lazyNoop(){
        desktop[app].deferredLoad = false;
        if (desktop[app].openWhenLoaded) {
          if (desktop[app].openWindow) {
            desktop[app].openWindow(app);
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
      })
    });
    desktop.apps.deferred = [];
    finish(null, desktop.loaded);
  }
  return this;

}

desktop.loadRemoteAssets = function loadRemoteAssets (assetArr, final) {

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

  desktop.loadRemoteJS(assets.script, function(err) {
    desktop.loadRemoteCSS(assets.css, function(err) {
      desktop.loadRemoteAppHtml(assets.appHTML[0], function(responseText, textStatus, jqXHR) {
        final(responseText, textStatus, jqXHR);
      });
    });
  });

}

/*
  desktop.loadRemoteAppHtml() takes in an appName and constructs a uri from appName
  the uri is then loaded with jQuery.load()
  the results of this jQuery.load() are injected into a hidden shadow DOM and then appended into #desktop
  this is very useful for lazy loading App assets so that the main application load size
  does not grow as you install more Apps into the desktop
*/
desktop.loadRemoteAppHtml = function loadRemoteAppHtml (appName, cb) {
  if (!appName) {
    return cb(null);
  }
  $('#shadowRender').append(`<div class="${appName}WindowHolder"></div>`)
  $(`.${appName}WindowHolder`).load(`desktop/apps/desktop.${appName}/desktop.${appName}.html`, function (responseText, textStatus, jqXHR) {
    $('#desktop').append($(`.${appName}WindowHolder`).html())
    cb(responseText, textStatus, jqXHR);
  });
}

desktop.loadRemoteJS = function loadRemoteJS (scriptsArr, final) {

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

desktop.loadRemoteCSS = function loadRemoteCSS (cssArr, final) {

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
  desktop.updateBuddyList();
  desktop.updateMessages();
}

//
//
// desktop.openWindow() function is used to create instances of a window class
// this allows for multiple window instances to share the same logic
// as of today, windowType can be "buddy_message" or "pond_message"
// this implies there are already HTML elements named window_buddy_message_0 and window_pond_message_0
// these will be incremented by 1 for each window , etc window_buddy_message_1, window_buddy_message_2
// in the future we can have other windowTypes
// for most applications you won't need this method and you can just 
// use $(window_id).hide() or $(window_id).show() instead
//
//

desktop.openWindow = function openWindow (windowType, context, position) {

  let windowTypes = ['buddy_message', 'pond_message']

  desktop.openWindows = desktop.openWindows || {};
  desktop.openWindows[windowType] = desktop.openWindows[windowType] || {};

  desktop.windowIndex = desktop.windowIndex || {};
  desktop.windowIndex[windowType] = desktop.windowIndex[windowType] || {};

  let windowKey;

  if (desktop.openWindows[windowType][context]) {
    // console.log('window already open, doing nothing', desktop.openWindows[windowType][context])
    // if the window is open and not visible, it means it is minimized
    let el = ('#' + desktop.openWindows[windowType][context]);
    let dockEl = ('#' + desktop.openWindows[windowType][context]).replace('window_', 'icon_dock_');
    if (!$(el).is(':visible')) {
      $('.dock_title', dockEl).addClass('rainbow');
    } else {
      $('.dock_title', dockEl).removeClass('rainbow');
    }
    return desktop.openWindows[windowType][context];
  }

  desktop.log(`desktop.openWindow("${windowType}", "${context}")`);

  if (desktop.windowIndex[windowType][context]) {
    let windowId = desktop.windowIndex[windowType][context];
    windowKey = '#' + windowId;
    // console.log('reopening window id', windowId)
    // TODO: check to see if window is min, if so, open it from dock
    // desktop.renderDockElement(windowType + '_' + window_id, context);
    JQD.util.window_flat();
    $(windowKey).show().addClass('window_stack');
  } else {
    // TODO: max windows message
    windowKey = desktop.windowPool[windowType].pop();
    if (!windowKey) {
      alert('Too many chat windows. Please close some windows.');
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
    // for example: desktop.windowIndex['buddy_message']['Marak] = '#window_buddy_message_0';
    //
    desktop.windowIndex[windowType][context] = windowId;

    // render the bottom bar dock element
    desktop.renderDockElement(windowKey.replace('window_', ''), context);

    // a new window is being opened, figure out where it should be positioned next to
    // default position is next to the buddylist
    let openNextTo = "#window_buddylist";

    // gather all open buddy_messsage windows and find the first one
    // if the first one exists, assign that to open next to
    
    let first = Object.keys(desktop.openWindows.buddy_message)[0];
    if (desktop.openWindows.buddy_message[first]) {
      openNextTo = '#' + desktop.openWindows.buddy_message[first];
    } else {
      // do nothing
    }

    position = position || {}
    position.my = position.my || "left top",
    position.at = position.at || 'right top',
    position.of = position.of || openNextTo

    $(windowId).position(position);
    
    if (windowType === 'buddy_message') {

      // invalidate previous processed messages for this buddy
      desktop.processedMessages = desktop.processedMessages.filter(function(uuid){
        if (desktop.buddyMessageCache[buddypond.me + '/' + context]) {
          if (desktop.buddyMessageCache[buddypond.me + '/' + context].indexOf(uuid) !== -1) {
            return false
          }
        }
        return true;
      });
      desktop.buddylist.onWindowOpen(windowId, context);
    }

  }

  // the window is now open ( either its new or it's been re-opened )
  // assign this window key into desktop.openWindows
  desktop.openWindows[windowType][context] = windowKey;

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
  }

  if (windowType === 'pond_message') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.openWindows[windowType]))
  }

  return windowKey;
}

//
// desktop.closeWindow() function is used to close instanced windows
// in most cases you can just use $(window_id).hide()
// The current logic here is for ensuring subscribed buddies and pond lists
// are updated when the user closes the window in the UI
// This is to ensure UI is only polling for messages on windows that are actually open
//
desktop.closeWindow = function openWindow (windowType, context) {
  desktop.openWindows = desktop.openWindows || {};
  desktop.openWindows[windowType] = desktop.openWindows[windowType] || {};

  // console.log('pushing window back into pool', desktop.openWindows[windowType][context])

  // Since the window is now closed, we can push it back into the windowPool,
  // based on it's windowType and context
  // for example: desktop.windowPool['buddy_message'].push(desktop.openWindows['buddy_message']['Marak'])
  desktop.windowPool[windowType].push(desktop.openWindows[windowType][context])

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
    // remove newMessages notification for this buddy
    // TODO: move this to buddylist.closeWindw()
    desktop.buddylistProfileState.updates["buddies/" + context] = desktop.buddylistProfileState.updates["buddies/" + context] || {};
    desktop.buddylistProfileState.updates["buddies/" + context].newMessages = false;
    $('.chat_messages', '#' + desktop.openWindows[windowType][context]).html('');
  }

  if (windowType === 'pond_message') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.openWindows[windowType]))
  }

  // TODO: replace delete statements?
  //
  // Remove the closed window from openWindows and windowIndex ( as it's no longer being tracked )
  //
  delete desktop.openWindows[windowType][context];
  delete desktop.windowIndex[windowType][context];

}

//
// desktop.updateMessages() queries the server for new messages and then
// delegates those messages to any applications which expose an App.updateMessaegs() function 
// currently hard-coded to pond, and buddylist apps. Can easily be refactored and un-nested.
//

desktop.updateMessages = function updateMessages () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateMessages();
    }, 10);
  } else {

    //
    // first, calculate list of subscribed buddies and subscribed ponds
    //
    var subscribedBuddies = Object.keys(desktop.openWindows['buddy_message'])
    var subscribedPonds = Object.keys(desktop.openWindows['pond_message'])

    if (subscribedBuddies.length === 0 && subscribedPonds.length === 0) {
      setTimeout(function(){
        desktop.updateMessages();
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
          desktop.updateMessages();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }
      let newMessages = [];
      // console.log('buddypond.getMessages', err, data)
      data.messages.forEach(function(message){
        if (desktop.processedMessages.indexOf(message.uuid) === -1) {
          newMessages.push(message)
        }
      });

      // console.log(data.messages.length, ' messages came in');
      // console.log(newMessages.length, ' are being rendered');

      //
      // Filter out any messaages which have already been processed by uuid
      // The deskop UX will only process each message once as to not re-render / flicker elements and message events

      data.messages = newMessages;
      // TODO: call all update message functions that are available instead of hard-coded list

        //
        // once we have the messages data, call desktop.buddylist.updateMessages() 
        // to delegate message data to app's internal updateMessages() function
        //
        // console.log('calling, buddylist.updateMessages');
        desktop.buddylist.updateMessages(data, function(err){
          // console.log('calling back, buddylist.updateMessages');
          if (err) {
            throw err;
          }

          //console.log('buddylist.updateMessages finished render', err)

          //
          // now that buddy messages have completed rendering, repeat the process for desktop.pond.updateMessages() 
          //
          // Remark: In the future we could iterate through all Apps .updateMessages() functions
          //         instead of having two hard-coded loops here
          // console.log('calling, pond.updateMessages');
          desktop.pond.updateMessages(data, function(err){
            // console.log('calling back, pond.updateMessages');
            if (err) {
              throw err;
            }

            //console.log('pond.updateMessages finished render', err)

            //
            // All apps have completed rendering messages, set a timer and try again shortly
            //
            setTimeout(function(){
              desktop.updateMessages();
            }, desktop.DEFAULT_AJAX_TIMER);
          });
        });

    });
    return;
    // TODO: check if subscribers is empty for either, if so, don't call
  }
}

// creates icon for dock bar ( min / max )
desktop.renderDockIcon = function (app) {
  // Remark: temp conditional, remove later
  if (desktop.isMobile) {
    return false;
  }
  let html = `
    <li id="icon_dock_${app}">
      <a href="#window_${app}">
        <img class="emojiIcon" src="desktop/assets/images/icons/icon_${desktop[app].icon || app}_64.png" />
        <span class="dock_title">
          ${desktop[app].label || app }
        </span>
      </a>
    </li>
  `;
  $('#dock').append(html);
};

desktop.renderDesktopIcon = function () {}; // creates desktop icon ( double click to start app )
desktop.renderWindow = function () {};   // creates new "#window_foo" DOM elements ( single instance, not openWindow() )

desktop.removeDockElement = function (windowType, context) {
  var dockElement = '#icon_dock_' + windowType;
  $(dockElement).hide();
  return;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}

desktop.renderDockElement = function (key, context) {
  var dockElement = '#icon_dock_' + key;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}