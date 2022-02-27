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

// `desktop.ui` scope is used to handle all window related events ( open / close / min / max / drag )
// this scope if populated by the `jquery.desktop.x.js` file
desktop.ui = {};

desktop.messages = {};
// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
// TODO: Have the desktop trim desktop.messages._processed if processed messages exceeds MAX_ALLOWED_PROCESSED_MESSAGES
desktop.messages._processed = [];


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
  if (typeof app === 'function') {
    desktop.preloader.push(app);
  } else {
    desktop.preloader.push({ appName: app, params: params });
  }
  return this;
}

desktop.ready = function ready (finish) {
  // preload all the App folders which were requested by desktop.use()
  let scriptArr = [];
  desktop.preloader.forEach(function(app){
    if (typeof app === 'object') {
      scriptArr.push(`desktop/apps/desktop.${app.appName}/desktop.${app.appName}.js`)
    }
  });
  desktop.load.remoteAssets(scriptArr, function(){
    desktop.preloader.forEach(function(app){
      if (typeof app === 'function') {
        app();
      } else {
        desktop._use(app.appName, app.params);
      }
    });
    // desktop is ready, clear out preloader ( it could be used again )
    desktop.preloader = [];
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
    console.log('Invalid App Name: "' + app + '"');
    return;
  }

  if (!desktop.app[app].load || typeof desktop.app[app].load !== 'function') {
    console.log(app + '.load is not a valid function');
    return;
  }

  /*
     Buddy Pond Desktop supports both `sync` and `defer` loading loading of `App`

     Apps load in this order:

     1.  desktop.use(appName)

         Sync style blocking loads ( Desktop will not be Ready until all are completed )
         Calling desktop.use(appName) with no params should be used only for mission-critical Apps

     2. desktop.use(appName, { defer: true })

        Async style non-blocking loads ( Desktop will be Ready before all these load )
        `defer` indicates the `App` should load *immediately* after the Desktop is ready
        `defer` param should be used for Apps that are non-critical, but frequently used


  */

  if (params.defer) {
    // The Desktop will call `App.load()` *immediately* after the Desktop is ready
    desktop.app[app].deferredLoad = true;
    desktop.apps.deferred.push({ name: app, params: params });
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

  // TODO: we can remove support for this style and only use *async*
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
        desktop.apps.loaded.push(app.name);
        desktop.ui.renderDockIcon(app.name);
        desktop.app[app.name].deferredLoad = false;
        if (desktop.app[app.name].openWhenLoaded) {
          if (desktop.app[app.name].openWindow) {
            desktop.app[app].openWindow(app.name);
            let key = '#window_' + app.name;
            $(key).show();
            JQD.util.window_flat();
            $(key).show().addClass('window_stack');
            // TODO: loading status cursor indicator should be per App, not global
            document.querySelectorAll('*').forEach(function(node) {
              node.style.cursor = 'pointer';
            });
          } else {
            desktop.log('Error:', 'attempted to open a deffered window ( openWhenLoaded ) but could not find ' + app.name +'.openWindow')
          }
        }
      }

      // fire and forget them all. provide a noop function for next
      // Remark: the lazyNoop will NOT be executed for *sync* style `App.load` ( see below )
      // check is made in JQDX.openWindow to see if `App.deferredLoad` is true
      let result = desktop.app[app.name].load(app.params, function lazyNoop(){
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

// desktop.load.app(appName, callback) is used to load apps *after* the desktop is up and running
desktop.load.app = function loadDesktopApp (appName, ready) {
  ready = ready || function readyNOOP () {
    // do nothing
  }
  desktop
    .use(appName)
    .ready(function(err, apps){
      ready(err, apps);
      desktop.log('Ready:', 'LYTE Buddy Pond', 'v4.20.69');
    });
}

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