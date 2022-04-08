/*

  Buddy Pond Desktop Client

*/

// eslint-disable-next-line no-redeclare
const desktop = {};

// time the desktop object was created in browser
desktop.ctime = new Date();
desktop.mode = 'production';

// desktop.origin is used as the root path for all buddy uploaded multimedia assets ( Snaps, Paints, Sounds )
desktop.origin = 'https://buddypond.com';

// desktop.mode = 'dev';
// if the desktop is in dev mode, use the browser's origin for all multimedia assets ( localhost )
if (desktop.mode === 'dev') {
  desktop.origin = window.origin;
}

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

// Adds jquery.dateformat to desktop.dateformat scope ( if available )
if (typeof DateFormat === 'object') {
  desktop.DateFormat = DateFormat;
}

desktop.dateTimeFormat = 'E MMMM dd yyyy hh:mm:ss a';

// `desktop.ui` scope is used to handle all window related events ( open / close / min / max / drag )
// this scope if populated by the `jquery.desktop.x.js` file
desktop.ui = {};

desktop.messages = {};
// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
// TODO: Have the desktop trim desktop.messages._processed if processed messages exceeds MAX_ALLOWED_PROCESSED_MESSAGES
desktop.messages._processed = [];
desktop.messages._processedCards = [];


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
      scriptArr.push(`desktop/apps/desktop.${app.appName}/desktop.${app.appName}.js`);
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
        scriptArr.push(`desktop/apps/desktop.${app.name}/desktop.${app.name}.js`);
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
              desktop.app[app].openWindow(app.name);
              let key = '#window_' + app.name;
              $(key).show();
              JQDX.window_flat();
              $(key).show().addClass('window_stack');
              // TODO: loading status cursor indicator should be per App, not global
              document.querySelectorAll('*').forEach(function (node) {
                node.style.cursor = 'pointer';
              });
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

desktop.refresh = function refreshDesktop () {
  if (desktop.app.buddylist) {
    desktop.app.buddylist.updateBuddyList();
    desktop.messages.process(desktop.apps.loaded);
  } else {
    setTimeout(function () {
      refreshDesktop();
    }, 10);
  }
};

//
// desktop.messages.process() queries the server for new messages and then
// delegates those messages to any applications which expose an App.processMessages() function
//
desktop.messages.process = function processMessages (apps) {
  apps = apps || desktop.apps.loaded;
  if (!buddypond.qtokenid) {
    // no session, wait a short tick and try again
    // this most likely indicates login is in progress
    setTimeout(function () {
      desktop.messages.process();
    }, 10);
  } else {

    //
    // calculate list of subscribed buddies and subscribed ponds
    //
    let subscribedBuddies = [];
    let subscribedPonds = [];

    if (desktop.app.buddylist) {
      subscribedBuddies= desktop.app.buddylist.subscribedBuddies;
    }

    if (desktop.app.pond) {
      subscribedPonds = desktop.app.pond.subscribedPonds;
    }

    // TODO: Configure desktop.messages.process() to still check for agent and systems messages here
    if (subscribedBuddies.length === 0 && subscribedPonds.length === 0) {
      setTimeout(function () {
        desktop.messages.process();
      }, 10);
      return;
    }

    let params = {
      buddyname: desktop.app.buddylist.subscribedBuddies.toString(),
      pondname: desktop.app.pond.subscribedPonds.toString(),
      ignoreMessages: desktop.messages._processedCards
    };

    //
    // call buddypond.getMessages() to get buddy messages data
    //
    // console.log('sending params', params)
    // console.log('calling, buddylist.getMessages', params);
    buddypond.getMessages(params, function (err, data) {
      // console.log('calling back, buddylist.getMessages', err, data);
      if (err) {
        console.log('error in getting messages', err);
        // TODO: show disconnect error in UX
        // if an error has occured, give up on processing messages
        // and retry again shortly
        setTimeout(function () {
          desktop.messages.process();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }


      //
      // filter out any messaages which have already been processed by uuid
      // the deskop UX will only process each message once as to not re-render / flicker elements and message events
      let newMessages = [];
      data.messages.forEach(function (message) {
        if (desktop.messages._processed.indexOf(message.uuid) === -1) {
          newMessages.push(message);
        }
      });

      data.messages = newMessages;

      // iterate through every app that is loaded and see if it exports `App.processMessages` function
      // currently we processMessages for: `App.buddylist`, `App.pond`, and `App.automaton`
      let appNameProcessMessagesList = [];
      apps.forEach(function (app) {
        if (typeof desktop.app[app].processMessages === 'function') {
          appNameProcessMessagesList.push(desktop.app[app].processMessages);
        }
      });

      //
      // once we have the message data and know which Apps have `App.processMessages` available...
      // delegate the message data to each App's internal processMessages() function
      //
      desktop.utils.asyncApplyEach(
        appNameProcessMessagesList,
        data,
        function done (err, results) {
          // `App.processMessages` should return `true`
          // ignore all the errors and results for now
          // console.log(err, results);
          //
          // All apps have completed rendering messages, set a timer and try again shortly
          //
          setTimeout(function () {
            desktop.messages.process(desktop.apps.loaded);
          }, desktop.DEFAULT_AJAX_TIMER);
        });
    });
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

desktop.commands = {};
desktop.commands.chatCommands = ['/quit', '/help', '/points']

desktop.commands.preProcessMessage = function processInternalMessage (message, windowId) {
  // don't process the message on the server if it's the help command
  // instead capture it and send back the immediate response text
  let command = message.text.split(' ');
  if (command[0] === '/give') {
    let to = message.text.split(' ')[1];
    let amount = message.text.split(' ')[2];
    let text = message.text.split(' ')[3] || '';
    
    let yorn = confirm(`Give ${amount} to ${to}?\nPlease double check name and amount`);
    if (!yorn) {
      return true;
    }
    buddypond.giveGbp({ buddyname: to, amount: amount, text: text }, function (err, transfer){
      let points = 0;
      if (transfer.error) {
        alert(transfer.error.message);
        return;
      }
    });
    return false;
  }

  if (command[0] === '/points' && command.length === 1) {

    buddypond.getGbpBalance({ buddyname: buddypond.me}, function (err, balance){
      console.log(err, balance)
      let points = 0;
      let value = 0;
      if (!balance.error) {
        points = balance.gbp;
        value = balance.expectedValue;
      }
      const pointsText = `
        <div class="help">
          <h3>Your current Good Buddy Points</h3>
          <span><a class="openApp" data-app="gbp" href="#openGBP">Show Market Data</a> | <a class="openApp" data-app="gbp" href="#openGBP">Show Balance</a> | <a class="openApp" data-app="gbp" href="#openGBP">Show Recent Transactions</a></span>
          <p>
            Current Good Buddy Points: ${desktop.utils.numberFormat.format(points)}
          </p
          <p>
            Estimated Value: ${desktop.utils.usdFormat.format(value)}
          </p
            
        <div>
      `;

      $('.chat_messages', windowId).append(`<div class="chatMessage">${pointsText}</div>`);
      $('.no_chat_messages', windowId).hide();

      let el = $('.window_content', windowId);
      $(el).scrollTop(999999);
    });
    // Remark: Must return true or /points message will get sent to server
    return true;

  }

  if (command[0] === '/help') {
    const commandSet = [
      {
        command: '/meme',
        helpText: '- sends random meme'
      },
      {
        command: '/meme',
        additional: ' cool',
        helpText: '- searches all memes for "cool beans"'
      },
      {
        command: '/say',
        additional: ' hello world',
        helpText: '- sends random meme'
      },
      {
        command: '/say',
        additional: ' 😇',
        helpText: '- Speaks "smiling face with halo" ( translated to browser language )'
      },
      {
        command: '/roll',
        additional: ' 20',
        helpText: '- Rolls a d20 dice'
      },
      {
        command: '/quit',
        helpText: '- Logs you out of here'
      },
      {
        command: '/help',
        helpText: '- Shows this message'
      },
    ];

    const helpText = `
      <div class="help">
        <h3>Welcome to Buddy Pond my good Buddy!</h3>
        <span>This chat area supports both text and multimedia ( Paints, Snaps, Sounds )</span>
        <p>
          As of right now, the following chat text commands are available:
        </p>
        ${commandSet.map(item => `
          <div class="help-text">
            <div class="help-command">
              <i>${item.command}</i>${item.additional || ''}
            </div>
            <span class="help-description">${item.helpText}</span>
          </div>
        `).join('')}
      <div>
    `;

    $('.chat_messages', windowId).append(`<div class="chatMessage">${helpText}</div>`);
    $('.no_chat_messages', windowId).hide();

    let el = $('.window_content', windowId);
    $(el).scrollTop(999999);

    return true;
  }

  return false;
};

// processes a message which was just sent for any potential local desktop commands ( such as /quit )
desktop.commands.postProcessMessage = function postProcessMessage (message) {
  // Check if user wants to quit then log the user out
  const text = message.text.split(' ')[0];
  if (text === desktop.commands.chatCommands.QUIT) {
    desktop.app.login.logoutDesktop();
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

desktop.utils.isValidYoutubeID  = function isValidYoutubeID (str) {
  /* 
    youtube id can only have: 
    - Lowercase Letters (a-z) 
    - Uppercase Letters (a-z) 
    - Numbers (0-9)
    - Underscores (_)
    - Dashes (-)
  */
  /* eslint-disable-next-line */
  const res = /^[a-zA-Z0-9_\-]+$/.exec(str);
  const valid = !!res;
  return valid;
};

desktop.utils.isValidYoutubeTime  = function isValidYoutubeTime (str) {
  /* 
    youtube time (T) can only: 
    - Start by "?t=" or by "&t="
    - Be followed by Numbers (0-9)
    - Finish by "s"
  */
  const res = /^&amp;t=\d+s|\?t=\d+$/.exec(str);
  const valid = !!res;
  return valid;
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

desktop.smartlinks = {};
desktop.smartlinks.replaceYoutubeLinks = function (el) {
  let cleanText = el.html();

  if (cleanText) {
    let searchYouTubeLongLink = cleanText.search('https://www.youtube.com/watch?');
    let searchYouTubeShortLink = cleanText.search('https://youtu.be/');
    let youtubeLinkWithTime = '0';

    // if a youtube link was found, replace it with a link to open IDC with the video id
    if (searchYouTubeLongLink !== -1) {
      //If the youtube link is a Long link i.e., https://www.youtube.com/watch?
      let youtubeId = cleanText.substr(searchYouTubeLongLink + 32, 11);
      let youtubeVideoTime = cleanText.substr(searchYouTubeLongLink + 43, 13).split(' ')[0];
      let isValidYoutubeId = desktop.utils.isValidYoutubeID(youtubeId);
      let isValidYoutubeTime = desktop.utils.isValidYoutubeTime(youtubeVideoTime);

      if (isValidYoutubeTime) {
        /*
        if there is a time t. Format it to extract the numbers only. And fuse it in youtubeLinkWithTime
        >>> &amp;t=345s
        >  345
        */
        youtubeLinkWithTime = youtubeId + youtubeVideoTime;
        youtubeVideoTime = youtubeVideoTime.slice(7,-2);
      } else {
        youtubeLinkWithTime = youtubeId;
      }
      
      if (isValidYoutubeId) {
        /*
        replace the youtube URL by a hyperlink that open IDC.
        >>> https://www.youtube.com/watch?v1K4EAXe2oo&t=345s
        > youtube: v1K4EAXe2oo@345
        */
        let str = 'https://www.youtube.com/watch?v=' + youtubeLinkWithTime;
        cleanText = cleanText.replace(str, `<a title="Open Youtube IDC" class="openIDC youtubeSmartLink" href="#open_IDC" data-videoid="${youtubeId}" data-videot="${youtubeVideoTime}"><img alt="Youtube" title="Youtube" src="desktop/assets/images/icons/youtube-logo.png"/>${youtubeId}@${youtubeVideoTime}</a>`);
        el.last().html(cleanText);
      }
      return;
    }

    
    if (searchYouTubeShortLink !== -1) {
      //If the youtube link is Short i.e, https://youtu.be
      /*
      check if there is a time (t)
      and replace it with a link to open IDC with the video id and the start time t
      https://youtu.be/v1K4EAXe2oo?t=26
      */
      let youtubeId = cleanText.substr(searchYouTubeShortLink + 17, 11);
      let youtubeVideoTime = cleanText.substr(searchYouTubeShortLink + 28, 10).replace(/[\n\r]+/g, '').split(' ')[0];
      let isValidYoutubeId = desktop.utils.isValidYoutubeID(youtubeId);
      let isValidYoutubeTime = desktop.utils.isValidYoutubeTime(youtubeVideoTime);

      if (isValidYoutubeTime) {
        /*
        if there is a time t. Format it to extract the numbers only. And fuse it in youtubeLinkWithTime
        >>> ?=t345
        >  345
        */
        youtubeLinkWithTime = youtubeId + youtubeVideoTime;
        youtubeVideoTime = youtubeVideoTime.substring(3);
      } else {
        youtubeLinkWithTime = youtubeId;
      }
      if (isValidYoutubeId) {
        /*
        Replace the youtube URL by a hypelink that open IDC instead.
        >>> https://youtu.be/v1K4EAXe2oo?t=26
        > youtube: v1K4EAXe2oo 26
        */
        let str = 'https://youtu.be/' + youtubeLinkWithTime;
        cleanText = cleanText.replace(str, `<a title="Open Youtube IDC" class="openIDC youtubeSmartLink" href="#open_IDC" data-videoid="${youtubeId}" data-videot="${youtubeVideoTime}"><img alt="Youtube" title="Youtube" src="desktop/assets/images/icons/youtube-logo.png"/>${youtubeId}@${youtubeVideoTime}</a>`);
        el.last().html(cleanText);
      }
    }
  }
};

// formats numbers into USD currency locale
desktop.utils.usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

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
