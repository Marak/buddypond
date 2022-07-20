/*

  Buddy Pond Desktop Client

*/

if (typeof desktop === 'undefined') {
  const desktop = {};
}

// time the desktop object was created in browser
desktop.ctime = new Date();
desktop.mode = 'production';

// desktop.origin is used as the root path for all buddy uploaded multimedia assets ( Snaps, Paints, Sounds )
desktop.origin = 'https://buddypond.com';
desktop.filesEndpoint = 'https://files.buddypond.com'

// desktop.mode = 'dev';
// if the desktop is in dev mode, use the browser's origin for all multimedia assets ( localhost )
if (desktop.mode === 'dev') {
  desktop.origin = window.origin;
  desktop.filesEndpoint = window.origin;
}

// apps which are considered "required" for Buddy Pond to work
desktop.basedApps = ['admin', 'appstore', 'automaton', 'audioplayer', 'buddylist', 'clock', 'console', 'faq', 'localstorage', 'login', 'messages', 'midi', 'mirror', 'notifications', 'pond', 'profile', 'settings', 'spellbook', 'themes', 'tts', 'videochat', 'videoplayer', 'wallpaper'];

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

// Adds jquery.dateformat to desktop.dateformat scope ( if available )
if (typeof DateFormat === 'object') {
  desktop.DateFormat = DateFormat;
}

desktop.dateTimeFormat = 'E MMMM dd yyyy hh:mm:ss a';

// `desktop.ui` scope is used to handle all window related events ( open / close / min / max / drag )
// this scope if populated by the `jquery.desktop.x.js` file
desktop.ui = {};

// set the default desktop.log() method to use console.log
desktop.log = console.log;

desktop.images = {};
desktop.images.preloaded = false;

// add an event handler to each image's load event in the current document and wait until all images are loaded
// this will prevent Desktop.ready from firing before all required images are ready ( no image flicking on load )
// this also means that the entire Desktop is blocked from being ready until all current document images are loaded
// TODO: We could add this same code inside desktop.load.remoteAssets()
//       to ensure images in injected HTML fragments block App injection until loaded
let imgs = document.images,
  totalNewImages = imgs.length,
  totalNewLoadedImages = 0;

[].forEach.call(imgs, function (img) {
  if (img.complete) {
    imageLoaded();
  } else {
    img.addEventListener( 'load', imageLoaded, false );
  }
});

function imageLoaded () {
  totalNewLoadedImages++;
  if (totalNewLoadedImages === totalNewImages) {
    // all new images have loaded
    desktop.images.preloaded = true;
  }
}

desktop.preloader = [];
desktop.use = function use (app, params) {
  // queue arguments for preloader
  params = params || {};
  if (typeof app === 'function') {
    desktop.preloader.push(app);
  } else {
    desktop.preloader.push({ appName: app, params: params });
  }
  return this;
};

desktop.ready = function ready (finish) {
  // preload all the App folders which were requested by desktop.use()
  let scriptArr = [];
  desktop.preloader.forEach(function (app) {
    if (typeof app === 'object' && !app.params.defer) {
      let appRootPath = 'desktop/based';
      if (desktop.basedApps.indexOf(app.appName) === -1) {
        appRootPath = 'desktop/appstore';
      }
      scriptArr.push(`${appRootPath}/desktop.${app.appName}/desktop.${app.appName}.js`);
    }
  });
  desktop.load.remoteAssets(scriptArr, function () {
    desktop.preloader.forEach(function (app) {
      if (typeof app === 'function') {
        app();
      } else {
        desktop._use(app.appName, app.params);
      }
    });
    // desktop is ready, clear out preloader ( it could be used again )
    desktop.preloader = [];
    desktop._ready(finish);
  });
  return this;
};

desktop._use = function _use (app, params) {

  params = params || {};
  if (desktop.apps.loading.length === 0) {
    desktop.apps.mostRecentlyLoaded = [];
    desktop.apps.loadingStartedAt = new Date();
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
    desktop.apps.deferred.push({ name: app, params: params });
    return this;
  }

  desktop.apps.loading.push({ name: app, params: params });
  desktop.log('Loading', 'App.' + app);

  if (desktop.apps.loaded.indexOf(app) !== -1) {
    desktop.log('Cached', 'App.' + app);
    return this;
  }

  // Remark: async `App.load` *must* continue with a callback or `Desktop.ready` will never fire
  desktop.app[app].load(params, function (err, re) {
    desktop.ui.renderDockIcon(app);
    desktop.apps.loaded.push(app);
    desktop.apps.mostRecentlyLoaded.push(app);
    desktop.apps.loading = desktop.apps.loading.filter(function (a) {
      if (a.name === app) {
        return false;
      }
      return true;
    });
  });

  return this;

};

desktop._ready = function _ready (finish) {

  if (!desktop.images.preloaded || desktop.apps.loading.length > 0) {
    setTimeout(function () {
      if (new Date().getTime() - desktop.apps.loadingStartedAt.getTime() > desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME) {
        throw new Error('desktop.use() took over ' + desktop.DESKTOP_DOT_USE_MAX_LOADING_TIME / 1000 + ' seconds and gave up. Check that all App.load functions are returning values OR firing provided callbacks. If you are loading new assets in your App check Network Tab to ensure all assets are actually returning.');
      }
      desktop._ready(finish);
    }, 10);
  } else {
    desktop.apps.loadingEndedAt = new Date();
    // all Desktop.use() that are *not* deferred have been loaded
    // call finish for Desktop.ready(), then continue to proess the deffered Apps
    finish(null, desktop.loaded);
    // now that all Apps and their assets have loaded, lets load any deferred Apps
    desktop.log('Now loading deferred apps');
    // Remark: we might have to put a concurrency limit here
    // TODO: Investigate what will happen if there are 1,000 deferred scripts
    //       Will the browser complain or be able to queue them up?
    let scriptArr = [];
    desktop.apps.deferred.forEach(function (app) {
      if (typeof app === 'object') {
        let appRootPath = 'desktop/based';
        if (desktop.basedApps.indexOf(app.name) === -1) {
          appRootPath = 'desktop/appstore';
        }
        
        scriptArr.push(`${appRootPath}/desktop.${app.name}/desktop.${app.name}.js`);
      }
    });

    desktop.load.remoteAssets(scriptArr, function () {
      desktop.apps.deferred.forEach(function (app) {
        desktop.app[app.name].deferredLoad = true;
        function _open () {
          desktop.apps.loaded.push(app.name);
          desktop.ui.renderDockIcon(app.name);
          desktop.app[app.name].deferredLoad = false;
          if (desktop.app[app.name].openWhenLoaded) {
            if (desktop.app[app.name].openWindow) {
              desktop.app[app.name].openWindow({});
              let key = '#window_' + app.name;
              $(key).show();
              JQDX.window_flat();
              $(key).show().addClass('window_stack');
              desktop.ui.hideLoadingProgressIndicator();
            } else {
              desktop.log('Error:', 'attempted to open a deffered window ( openWhenLoaded ) but could not find ' + app.name +'.openWindow');
            }
          }
        }

        if (desktop.apps.loaded.indexOf(app) !== -1) {
          desktop.log('Cached', 'App.' + app);
          // desktop.ui.openWindow(app);
          finish(null, desktop.loaded);
          return this;
        }
        desktop.log('Loading App.' + app.name);
        desktop.app[app.name].load(app.params, function lazyNoop () {
          _open();
        });

      });
      desktop.apps.deferred = [];
    });
  }
  return this;

};

//
// Routes the desktop basic on browser's location.hash
// Will attempt to convert incoming hash structure to BuddyScript ( `bs` )
//
desktop.routeFromHash = function routeFromHash () {
  

/*
  
    // first, replace the "#" with a "/"

    // now take the route and parse out the appName and context
    // appName is always the first item in the route
    // context is concatted by "/" until end of string


    // now that appName and context have been establised, look for query string params

    // search for the "?" symbol
    // if not found, there are no query string params
    // if "?" is found take everything to the right of it and parse it as a query string
    // take the query string values and use them as params

    TODO: routeFromHash should be able to support query string parameters
          the easiest way to do this will be having the following format:

          /appName/context?param1=abc&param2=123

      Example:

          /paint/pond/Lily?embed=true
          /av
          /av?embed=true


*/
  
  // TODO: replace with `bs` script commands
  // TODO: validate incoming hash to ensure isValidBuddyScript
  let bs = location.hash.replace('#', '/');
  // TODO: desktop.app.console.isValidBuddyScript
  bs = bs.split('/');
  let appName = bs[1];
  let context = bs[2];
  // TODO: params.size: 'Max'

  desktop.hashMode = true;
  // TODO: remove this line
  $('.mobile_bar_bottom').hide();

  desktop.ui.openWindow(appName, {
    context: context
  }, function(){
    // TODO: rename pond_message -> pond
    // TODO: remove this flag and if statement
    if (appName === 'pond') {
      appName = 'pond_message';
    }
    //JQDX.window_maximize($('#window_pond_message_futureisnow'));
    if (context) {
      JQDX.window_maximize($(`#window_${appName}_${context}`));
    } else {
      JQDX.window_maximize($(`#window_${appName}`));
    }

  });
}

window.addEventListener('hashchange', function() {
  desktop.routeFromHash();
}, false);


desktop.refresh = function refreshDesktop () {
  if (desktop.app.buddylist) {
    desktop.app.buddylist.updateBuddyList();
    // TODO: move messages to separate app and use EE
    desktop.messages.process(desktop.apps.loaded);
  } else {
    setTimeout(function () {
      refreshDesktop();
    }, 10);
  }
};

desktop._events = {};


/*

    ## Event Emitters

    The Desktop support event emitters with the following methods:

    **Register a new event**

    desktop.on(eventName, label, fn)

    `eventName` is the name of the event which will be emitted
    `label` is arbtitrary unique string that describes the action which will happen when the event emits

    desktop.on('alarm', 'play-nyan-cat', function doStuff (data){
      // your custom code here
      console.log(data);
    });

    **Emitting data to that event**
    desktop.emit(eventName, data)

    `eventName` is the name of the event to emit to
    `data` is any JSON data

    // will trigger:
    desktop.emit('alarm', {
      videoId: 123,
      autoplay: true
    });

    **Unbind all handlers from event**

    desktop.unbind(eventName)

    **Unbind single handler from event**

    desktop.unbind(eventName, label)

*/

// when registering an event emitter, you *must* specify a `eventLabel` label
// this can be used later to remove the custom eventHandler by name
desktop.on = function desktopEventEmitterOn (eventName, eventLabel, fn) {
  desktop._events[eventName] = desktop._events[eventName] || [];
  // console.log('adding event', eventName, eventLabel, fn)
  desktop._events[eventName].push({
    eventLabel: eventLabel,
    fn: fn
  });
};

desktop.emit = function desktopEventEmitterEmit (eventName, data) {
  // find all listening events
  if (desktop._events[eventName] && desktop._events[eventName].length) {
    desktop._events[eventName].forEach(function (_event) {
      // console.log('calling event', eventName, _event.eventLabel, data)
      _event.fn(data);
    });
  }
};

desktop.off = function desktopEventEmitterOff (eventName, eventLabel) {
  if (typeof eventLabel === 'undefined') {
    desktop._events[eventName] = [];
    // remove all events for eventName
    return;
  }
  if (desktop._events[eventName] &&  desktop._events[eventName].length) {
    desktop._events[eventName] = desktop._events[eventName].filter(function (_event) {
      if (_event.eventLabel === eventLabel) {
        return false;
      }
      return true;
    });
  }
};

// desktop can play multimedia files with simple desktop.play(fileName) commands
desktop.play = function desktopPlay (soundFx, tryHard, callback) {
  callback = callback || function noop () {

  };
  if (desktop.app.audioplayer && desktop.app.audioplayer.play) {
    desktop.app.audioplayer.play('desktop/assets/audio/' + soundFx, tryHard, callback);
  } else {
    console.log('App.AudioPlayer was not detected. Is it ready? Was it loaded?');
    callback(null, false);
  }
};

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
  fns.forEach(function (fn) {
    fn(data, function (err, result) {
      results.push(err, result);
      completed++;
      if (completed === fns.length) {
        finish(null, results);
      }
    });
  });
};

desktop.utils.parseQueryString = function parseQueryString (queryString) {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};

// formats numbers into USD currency locale
desktop.utils.usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// formats numbers into USD currency locale with 8 decimals places
desktop.utils.usdFormatSmall = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 8

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


// formats numbers into USD currency locale
desktop.utils.numberFormat = new Intl.NumberFormat('en-US', {
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});