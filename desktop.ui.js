/*

Buddy Pond
desktop.ui.js

jQuery Desktop X is licensed as AGPL and is a Copyright of Marak Squires
see: https://github.com/marak/buddypond

jQuery Desktop X is originally based on jQuery Desktop
jQuery Desktop is licensed as GPL v3, and is a Copyright of Nathan Smith
see: https://github.com/nathansmith/jQuery-Desktop

*/

//
// First thing desktop must do is calculate current viewport height and width to determine
// which desktop.ui.view value will be used to initially render ( Mobile / Normal / MegaDesk )
// These view modes are used to conditionally render specific UI and UX experiences.
// The majority of the layout uses `vh` and `vw` values and doesn't depend on desktop.ui.view
//
let width = Math.max(
  document.documentElement['clientWidth'],
  document.body['scrollWidth'],
  document.documentElement['scrollWidth'],
  document.body['offsetWidth'],
  document.documentElement['offsetWidth']
);

if (width <= 980) {
  desktop.ui.view = 'Mobile';
}

if (width > 980 && width < 2600) {
  desktop.ui.view = 'Normal';
}

if (width >= 2600) {
  desktop.ui.view = 'MegaDesk';
}

// "displayMode" is used to switch between display modes of desktop ( not views )
// "windows" displayMode is default display state ( normal window behavior in desktop or mobile )
// could also be: "min" ( min all windows ) or "profile" ( show profile page)
desktop.ui.displayMode = 'windows';

// extended JDQ functions added by Marak
// eslint-disable-next-line no-redeclare
const JQDX = {};
JQDX.loading = {};

// indicator could be mouse cursor or actual loading graphic ( depending on view mode )
JQDX.showLoadingProgressIndicator = function showLoadingProgressIndicator () {
  if (desktop.ui.view === 'Mobile') {
    $('.mobileLoadingOverlay').show();
    $('.mobileLoadingOverlay').css('z-index', 421);
  }
  $('html,body').addClass('progress');
  $('div.window').addClass('progress');
  $('a').addClass('progress');
  $('button').addClass('progress');
}

JQDX.hideLoadingProgressIndicator = function showLoadingProgressIndicator () {
  $('.mobileLoadingOverlay').hide();
  $('html,body').removeClass('progress');
  $('div.window').removeClass('progress');
  $('a').removeClass('progress');
  $('button').removeClass('progress');
  $('html,body').addClass('defaultCursor');
}

desktop.ui.showLoadingProgressIndicator = JQDX.showLoadingProgressIndicator;
desktop.ui.hideLoadingProgressIndicator = JQDX.hideLoadingProgressIndicator;

//
// Zero out window z-index.
//
JQDX.window_flat = function window_flat () {
  $('div.window').removeClass('window_stack');
};

JQDX.window_front = function window_front (win) {
  JQDX.window_flat();
  $(win).addClass('window_stack');
}

//
// Clear active states, hide menus.
//
JQDX.clear_active = function clear_active () {
  $('a.active, tr.active, div.active').removeClass('active');
  $('ul.menu').hide();
};

JQDX.frame_breaker = function frame_breaker () {
  if (window.location !== window.top.location) {
    window.top.location = window.location;
  }
};

desktop.ui.getActiveWindow = function getActiveWindow () {
  let el = $('.window_stack');
  return el;
};

// TODO: App.resizeWindow() ??
// TODO: desktop.ui.onresize = function () { // array of event handlers, etc use jquery ?}


desktop.ui.goMobile = function () {
  return;
  $('.desktopOnly').hide();
  $('.maxWindow').hide();
  // $('.emojiPicker').hide();

  // makes bottom bar larger and increases bottom bar icon sizes
  $('#bar_bottom').addClass('mobile_bar_bottom');
  $('#show_desktop img').addClass('mobile_show_desktop_img');

  // hides the text label for icons
  // $('.dock_title').hide();

  // increases font size for most thigns
  $('body').addClass('mobile_larger_font');
  //$('span').addClass('mobile_larger_font');
  $('input').addClass('mobile_larger_font');

  $('a').addClass('mobile_larger_font');
  $('textarea').addClass('mobile_larger_font');
  //$('.datetime').addClass('mobile_datetime');

  // increase all the embedded icon sizes and chat control icons
  $('#dock .emojiIcon').addClass('mobile_larger_icons');
  $('#desktop .emojiIcon').addClass('mobile_larger_icons');
  $('.chatControl').addClass('mobile_chatControl');

  $('.welcomePonds').addClass('mobile_larger_font');

  // hides the entire top navigation bar including clock and menus ( for now )
  $('#bar_top').hide();
  /*
  $('.desktop-shortcuts-container').css('width', '100%');
  $('.desktop-shortcuts-container').css('overflow', 'auto');
  $('.desktop-shortcuts-container').css('top', '0px');
  */
  $('.desktop-shortcuts-container .shortcut').hide();
  $('.window_top').css('padding-left', 22);
  $('.window_top').css('padding-right', 22);
  $('.window_top').css('padding-top', 22);
  $('.window_top').css('padding-bottom', 22);
  $('.trafficLight a').addClass('mobile_traffic_lights');

  $('.window_content').css('top', '76px');
  $('.window_content').css('height', '80%');

  // TODO: remove these lines
  $('#window_mirror .window_content').css('height', '50vh');
  $('.emojiTitleBar').css('padding-top', 32);

  $('.desktop-shortcuts-container').css('margin-left', '32px');
  $('.desktop-shortcuts-container').css('row-gap', '222px');
  $('.sendBuddyMessage').css('width', '33vw');
  $('.sendPondMessage').css('width', '33vw');

  $('.selectMirrorFilter').addClass('mobile_larger_font');
  $('.selectMirrorCamera').addClass('mobile_larger_font');

  // find active window stack, maximize

  // TODO: bottom bar with four large icons ( BuddyList / Ponds / Entertainment / Settings )
  // TODO: circular "home" button which opens navigation overlay with all Apps on a 4/4 grid with horizontal scroll
  // show home button and bottom nav bar
  // take the current active window and max it
  // minimize all open windows
  let activeWindow = desktop.ui.getActiveWindow();
  JQDX.window_maximize(activeWindow);

};

desktop.ui.exitMobile = function () {

  $('.desktopOnly').show();
  $('.maxWindow').show();
  //  $('.emojiPicker').show();

  // TODO: remember resize max positions and size of windows from data() and resume

  // restore bottom bar sizes ( shrinks )
  $('#bar_bottom').removeClass('mobile_bar_bottom');
  $('#show_desktop img').removeClass('mobile_show_desktop_img');

  // restores bottom bar labels
  $('.dock_title').show();
  $('#dock').removeClass('mobile_dock_bar');

  // removes all emoji icons and chat controls
  $('.chatControl').removeClass('mobile_chatControl');
  $('.emojiIcon').removeClass('mobile_larger_icons');

  // restores font sizes to last setting
  $('body').removeClass('mobile_larger_font');
  $('span').removeClass('mobile_larger_font');
  $('input').removeClass('mobile_larger_font');
  $('select').removeClass('mobile_larger_font');
  $('textarea').removeClass('mobile_larger_font');

  $('a').removeClass('mobile_larger_font');

  $('.window_top').css('padding-top', 0);
  $('.window_top').css('padding-bottom', 0);
  $('#bar_top').show();

  // TODO: remove these lines
  $('.emojiTitleBar').css('padding-top', 10);
  $('.sendBuddyMessage').css('width', '9vw');
  $('.sendPondMessage').css('width', '9vw');
  //$('.desktop-shortcuts-container').css('width', '22vw');

  return;
};

desktop.ui.windowResizeEventHandler = function windowResizeEventHandler (e, forceUpdate) {
  // Remark: jQuery resizable events will also trigger window.resize event
  if (e && $(e.target).hasClass('ui-resizable')) {
    // do not call entire window resize event for inner resizable windows
    return false;
  }

  let currentView = desktop.ui.view || 'calculating';
  // TODO: better magic numbers for view mode sizes
  // TODO: move magic numbers into variables

  let width = $(document).width();

  if (width <= 980) {
    desktop.ui.view = 'Mobile';
  }

  if (width > 980 && width < 2600) {
    desktop.ui.view = 'Normal';
  }

  if (width >= 2600) {
    desktop.ui.view = 'MegaDesk';
  }

  // Remark: It's not neccesary to re-run the hard-coded view logic if ui.view has not actually changed
  //.        Here we check current calculated view against ui.view to see if the view mode has changed
  //         We only run the transformations if view mode has actually changed
  //         Setting `forceUpdate` parameter will force re-run of transformation logic...
  //         this is used when a new App is opened to immediately resize its height / width to current view mode
  if (forceUpdate || (currentView !== desktop.ui.view)) {
    toggleView();
  }

  function toggleView () {
    if (desktop.ui.view === 'Mobile') {
      desktop.ui.goMobile();
    } else {
      desktop.ui.exitMobile();
    }

    if (desktop.ui.view === 'Normal') {
      $('.window_top').css('height', 30);
      $('.window_top').css('padding-top', 0);
      $('.window_content').css('top', 30);
      $('.window_top img').css('width', 16);
      $('.window_top img').css('height', 16);

      // set icons back to regular size
      $('.icon img').css('height', 32);
      $('.icon img').css('width', 32);
      $('.icon').css('font-size', 12);

      /*
      $('.icon').each(function(e, i){
        let el = $(this);
        el.css('left', Number(el.css('left').replace('px', '')) * -1.33)
        el.css('top', Number(el.css('top').replace('px', '')) * -1.33)
      })
      */

      $('.pond_send_message_form').css('padding-bottom', 0);
      $('.buddy_send_message_form').css('padding-bottom', 0);
      $('.pond_message_text').css('margin-top', 6);
      $('.pond_message_text').css('margin-bottom', 6);
      $('.buddy_message_text').css('margin-top', 6);
      $('.buddy_message_text').css('margin-bottom', 6);
      $('.sendPondMessage').css('margin', 5);
      $('.recentTransactions').css('font-size', 16);

    }

    if (desktop.ui.view === 'MegaDesk') {
      $('.window_top').css('height', 40);
      $('.window_top').css('padding-top', 10);
      $('.window_content').css('top', 53);

      $('.window_top img').css('width', 24);
      $('.window_top img').css('height', 24);
      // TODO: add this so we can have larger desktop button
      // Remark: Needs to resize image? Probably best to slice up buttons into three images ( six with hover state )
      //$('.window_min, .window_resize, .window_close').css('width', 56);
      //$('.window_min, .window_resize, .window_close').css('height', 30);

      $('.icon img').css('height', 64);
      $('.icon img').css('width', 64);
      $('.icon').css('font-size', 28);
      $('.icon a').addClass('mobile_larger_font');
      $('.desktop-shortcuts-container').css('width', '20vw');
      $('.icon').css('width', 145);
      $('.pond_send_message_form').css('padding-bottom', 12);
      $('.buddy_send_message_form').css('padding-bottom', 12);

      // increase all the embedded icon sizes and chat control icons
      //$('#dock .emojiIcon').addClass('mobile_larger_icons');
      //$('#desktop .emojiIcon').addClass('mobile_larger_icons');
      $('.chatControl').addClass('mobile_chatControl');
      // $('#bar_bottom').addClass('mobile_bar_bottom');

      // TODO: remove these line
      $('.pond_message_text').css('margin', 16);
      $('.buddy_message_text').css('margin', 16);
      $('.getHelp').css('right', '44px');
      $('.getHelp').css('padding-top', '16px');

      $('.sendPondMessage').css('margin', 16);
      $('.recentTransactions').css('font-size', 32);

    }
  }


  // $('.debugWindow').html(width + ' '  + height + ' ' + desktop.ui.view);
};

window.onresize = desktop.ui.windowResizeEventHandler;

JQDX.window_maximize = function window_maximize (win, opts) {
  if (desktop.ui.view === 'Mobile') {
    JQDX.minAllWindows();
    win.attr({
      // Save window position.
      'data-t': win.css('top'),
      'data-l': win.css('left'),
      'data-r': win.css('right'),
      'data-b': win.css('bottom'),
      'data-w': win.css('width'),
      'data-h': win.css('height')
    }).addClass('window_full_mobile').css({
      // Maximize dimensions.
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'width': '100%',
      'height': '77%'
    });
  } else {
    win.attr({
      // Save window position.
      'data-t': win.css('top'),
      'data-l': win.css('left'),
      'data-r': win.css('right'),
      'data-b': win.css('bottom'),
      'data-w': win.css('width'),
      'data-h': win.css('height')
    }).addClass('window_full').css({
      // Maximize dimensions.
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'width': '100%',
      'height': '100%'
    });
  }

  // Bring window to front.
  JQDX.window_flat();
  win.show();
  win.addClass('window_stack');

};

//
// Resize modal window.
//
JQDX.window_resize = function window_resize (el) {
  // Nearest parent window.
  let win = $(el).closest('div.window');

  // Is it maximized already?
  if (win.hasClass('window_full')) {
    // Restore window position.
    win.removeClass('window_full').css({
      'top': win.attr('data-t'),
      'left': win.attr('data-l'),
      'right': win.attr('data-r'),
      'bottom': win.attr('data-b'),
      'width': win.attr('data-w'),
      'height': win.attr('data-h')
    });
  }
  else {
    JQDX.window_maximize(win);
  }

  // Bring window to front.
  JQDX.window_flat();
  win.addClass('window_stack');
  /* TODO: windows_open should remember if window min or max
  let openWindows = desktop.settings.windows_open || {};
  openWindows[win.attr('id')] = {
    open: true,
    app: win.data('app'),
    context: win.data('context'),
    width: win.css('width'),
    height: win.css('height'),
    top: win.css('top'),
    left: win.css('left')
  }
  desktop.ui.openWindows = openWindows;
  desktop.set('windows_open', desktop.ui.openWindows);
  */

};

JQDX.openFullscreen = function openFullscreen (elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

// Remark: JQDX.loadWindow has similiar code to desktop.use()
//         Most likely we can refactor both of these methods into single smaller function
JQDX.loadWindow = function loadWindow (appName, params, callback) {

  let alreadyLoading = false;
  desktop.apps.loading.forEach(function(app){
    if (app.name === appName) {
      alreadyLoading = true;
    }
  });

  if (alreadyLoading) {
    desktop.log(`Already opening ${appName}. Will not attempt re-load`);
    return false;
  }

  desktop.apps.loading.push({ name: appName, params: params });

  let appRootPath = 'desktop/based';
  if (desktop.basedApps.indexOf(appName) === -1) {
    appRootPath = 'desktop/appstore';
  }

  desktop.load.remoteJS([`${appRootPath}/desktop.${appName}/desktop.${appName}.js` ], function () {
    /* TODO: support N app dep, currently hard-coded to 1
    desktop.app[appName].depends_on.forEach(function(appDep){
      desktop.preloader.push(appDep);
    });
    */
    if (desktop.app[appName] && desktop.app[appName].depends_on && desktop.app[appName].depends_on.length > 0) {
      // TODO: can we remove this and just use call load.remoteJS() from inside the app.load ( like other deps )
      let depName = desktop.app[appName].depends_on[0];
      desktop.log('Loading: App.' + depName);
      desktop.load.remoteJS([ `desktop/based/desktop.${depName}/desktop.${desktop.app[appName].depends_on[0]}.js` ], function () {
        desktop.log('Ready: App.' + depName);
        let depApp = desktop.app[appName].depends_on[0];
        desktop.app[depApp].load(params, function () {
          desktop.app[appName].load(params, function () {
            desktop.log('Ready: App.' + appName);
            desktop.ui.hideLoadingProgressIndicator();
            callback();
          });
        });
      });
    } else {
      desktop.app[appName].load(params, function () {
        desktop.log('Ready: App.' + appName);
        desktop.ui.hideLoadingProgressIndicator();
        callback();
      });
    }
  });
};

// will show an existing window that is already in the DOM
// the window might be hidden or minimized
JQDX.showWindow = function showWindow (appName, params) {
  params = params || {};

  if (params.windowless) {
    return false;
  }

  // console.log('JQDX.showWindow', appName, params);
  let appWindow = '#window_' + appName;

  if (appName === 'pond' && params.context) {
    appWindow = '#window_pond_message_' + params.context;
  }

  // TODO: rename "buddylist" app to "buddy"
  if (appName === 'buddylist' && params.context) {
    appWindow = '#window_buddy_message_' + params.context;
  }

  let iconDock = '#icon_dock_' + appName;

  if (params.noDockIcon) {
    
  } else {
    /*
    // Show the taskbar button.
    if ($(iconDock).is(':hidden')) {
      $(iconDock).remove().appendTo('#dock');
      $(iconDock).show('fast');
    }
      */


    // before creating a new dock icon, check to see if it already exists
    let dockIconExists =  bp.apps.ui.windowManager.taskBar.getItem(appName)

    if (!dockIconExists) {

      bp.apps.ui.windowManager.taskBar.addItem({

        id: appName,
        title: appName,
        icon: 'desktop/assets/images/icons/icon_' + appName + '_64.png',
        onClick: () => {
            // console.log("open window", appName);
    
            if (appName === 'download_buddypond') {
              window.open('https://github.com/marak/buddypond', '_blank');
              return;
            }
            if (appName === 'logout') {
              desktop.app.login.logoutDesktop();
              return;
            }
    
            // check to see if visible, if so, minimize
            if ($(appWindow).is(':visible')) {
              JQDX.minWindow(appWindow);
    
            } else {
              JQDX.openWindow(appName);
    
            }
    
    
          
        }
    });
    




      
    }


    // manually click the window to trigger v5 bridge code to focus
    desktop.emit('window::dragstart', { windowId: appWindow });
      $('.window_bottom', appWindow).html(''); // clear bottom bar
    // v5 fix ( for now )
    setTimeout(function(){
      //window.arrangeDesktop();

    }, 1300)

  }

  JQDX.clear_active();
  $(appWindow).show();
  JQDX.window_front(appWindow);

  $(appWindow).data('app', appName);
  $(appWindow).data('context', params.context);

  if (desktop.ui.view === 'Mobile') {
    JQDX.window_maximize($(appWindow));
  }

  // check to see if desktop[appName].openWindow method is available,
  // if so, call this method
  // this is used to allow apps to have custom openWindow events 
  if (desktop.app[appName] && desktop.app[appName].openWindow) {
    desktop.app[appName].openWindow(params);
  }

  JQDX.loading[appName] = false;

  // new windows must be immediately resized to current view
  desktop.ui.windowResizeEventHandler(null, true);

  let win = $(appWindow);
  desktop.ui.openWindows[appWindow] = {
    open: true,
    app: win.data('app'),
    context: win.data('context'),
    width: win.css('width'),
    height: win.css('height'),
    top: win.css('top'),
    left: win.css('left')
  }



  desktop.set('windows_open', desktop.ui.openWindows);
  // win.focus();
  /* Remark: Does this function need a callback? Does App.openWindow() require callback?
  if (typeof cb === 'function') {
    cb(null);
  }
  */
};

// attempts to open a window based on name and parameters
// will attempt to JQDX.loadWindow() if no window is found
JQDX.openWindow = function openWindow (appName, params, cb) {
  // console.log('JQDX.openWindow', appName, params, cb)
  //alert('replace')
  // console.log('JQDX.openWindow', appName, params)
  params = params || {};
  cb = cb || function noop () {};

  let appWindow = '#window_' + appName;

  // windowTypes is used to store instance window types, currently just chat windows "buddy_message" and "pond_message"
  if (desktop.ui.windowTypes.indexOf(appName) !== -1) {
    // this is either buddy_message or pond_message
    // do not attempt to load any apps ( buddylist and ponds should already be loaded )
    JQDX.showWindow(appName, params);
    cb();
    return;
  }

  //
  // Remark: Can this block be removed? is it no longer being called?
  //
  // check to see if the `App` is trying to load, but is currently deffered
  // if so, put a spinning icon on the mouse cursor
  // we set the `openWhenLoaded` flag on the `App` and this will cause the `App` window to open when it's ready
  if (desktop.app[appName] && desktop.app[appName].deferredLoad) {
    // set global cursor to spinning progress icon
    // TODO: spinning progress notifications should be per `App` and not a global state
    desktop.ui.showLoadingProgressIndicator();
    // set a flag to indicate this App should open when defered loading completes
    desktop.app[appName].openWhenLoaded = true;
    return;
  }
  //
  //
  //

  // this window appName has no associated apps waiting to be loaded,
  // check to see if there is an associated window_* id to show,
  // if not, assume user is trying to load an app which is not loaded yet
  let windowExists = $(appWindow).length;
  if (windowExists === 0) {
    desktop.ui.showLoadingProgressIndicator();
    JQDX.loadWindow(appName, params, function () {
      desktop.ui.renderDockIcon(appName);
      if (!params.windowless) {
        JQDX.showWindow(appName, params);
      }
      cb();
    });
  } else {

    // TODO: buddy message window should not pop-up if mimized,
    // instead it's suppose to add rainbow class to indicate alert ( regression 3/30 )
    // if the window is open and not visible, it means it is minimized
    /*
    let el = $(appWindow);
    let dockEl = (appWindow).replace('window_', 'icon_dock_');
    if (!$(el).is(':visible')) {
      // check to see if subscribed to context, if so that means window is minimized
      $('.dock_title', dockEl).addClass('rainbow');
    } else {
      $('.dock_title', dockEl).removeClass('rainbow');
    }
    */

    JQDX.showWindow(appName, params);
    cb();

  }
};

JQDX.minWindow = function minWindow (el) {
  $(el).closest('div.window').removeClass('window_stack').hide();
};

JQDX.minAllWindows = function minWindow (el) {
  $('div.window').hide();
};

// TODO: toggleMaxWindow? its doing two states min and max
JQDX.maxWindow = function maxWindow (el, $el) {

  let windowId = $(el).attr('href');
  // desktop.log('JQDX.maxWindow', windowId)

  // Get the link's target.
  let x = $(windowId);

  if ($el) {
    x = $el;
  }
  // Remark: Always brings the window to the front after maximize
  //         Previous JQD behavior was to toggle visible status here after clicking dockbar icon
  //         Instead, this could be done elsewhere in the code
  // check to see if window is already active, if so min it
  if (x.hasClass('window_stack')) {
    x.removeClass('window_stack');
    x.hide();
  } else {
    JQDX.window_flat();
    x.addClass('window_stack');
    x.show();
  }

};

JQDX.closeWindow = function closeWindow (el) {
  // TODO: clean-up these selectors
  let closestWindow = $(el).closest('div.window');

  if (!closestWindow.length) {
    return;
  }

  closestWindow.hide();
  $($(el).attr('href')).hide('fast');

  let type = $(closestWindow).data('type');
  let appName = $(closestWindow).data('app');
  let context = $(closestWindow).data('context');

  let windowId = $(closestWindow).attr('id').replace('window_', '');
  delete desktop.ui.openWindows['#' + $(closestWindow).attr('id')];
  desktop.set('windows_open', desktop.ui.openWindows);

  // it's expected app window html has data-app="appName" attribute
  // if there is no data-app attribute, default to window_* name
  // this will work for most apps which do not require contextual window instances
  if (!appName) {
    appName = windowId;
  }

  // check to see if the App which made this window supports a .closeWindow() method
  // this covers Apps which are not instanced
  if (desktop.app[appName] && desktop.app[appName].closeWindow) {
    desktop.app[appName].closeWindow({
      type: type,
      context: context
    });
  }

  $('#icon_dock_' + windowId).hide('fast');

  let dockIconExists =  bp.apps.ui.windowManager.taskBar.getItem(appName)
  if (dockIconExists) {
    bp.apps.ui.windowManager.taskBar.removeItem(appName)
  }

  

};

// creates icon for dock bar ( min / max )
desktop.ui.renderDockIcon = function (app) {
  let html = `
    <li id="icon_dock_${app}">
      <a href="#window_${app}">
        <img class="emojiIcon" src="desktop/assets/images/icons/icon_${desktop.app[app].icon || app}_64.png" />
        <div class="dock_title">
          ${desktop.app[app].label || app }
        </div>
      </a>
    </li>
  `;
  $('#dock').append(html);
};

// TODO: these functions
// desktop.renderDesktopIcon = function () {}; // creates desktop icon ( double click to start app )
// desktop.renderWindow = function () {};   // creates new "#window_foo" DOM elements ( single instance, not openWindow() )

desktop.ui.removeDockElement = function (windowType, context) {
  let dockElement = '#icon_dock_' + windowType;
  $(dockElement).hide();
  /*
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
  */
};

desktop.ui.renderDockElement = function (key, context) {
  let dockElement = '#icon_dock_' + key;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
};

// windowIndex is used to keep track of all open windows
desktop.ui.openWindows = {};

// special mapping for pond and buddylist, which allow N windows to open based on context
// all other apps are currently set to 1 window only
// TODO: remove `desktop.ui.windowTypes` from API and have more intelligent openWindow()
desktop.ui.windowTypes = [ 'buddy_message', 'pond_message' ];

// maps to JQDX.openWindow
desktop.ui.openWindow = JQDX.openWindow;

// maps to JQDX.showWindow
desktop.ui.showWindow = JQDX.showWindow;

//
// desktop.ui.closeWindow() function is used to close instanced windows
// in most cases you can just use $(window_id).hide()
// The current logic here is for ensuring subscribed buddies and pond lists
// are updated when the user closes the window in the UI
// This is to ensure UI is only polling for messages on windows that are actually open
//
desktop.ui.closeWindow = function openWindow (windowType, context) {
  // if the incoming windowType is not a registered window type, assume it's a non-instanistanble window
  // these are used for almost all applications, since most applications require N windows ( like chat )
  // TODO: can we remove all this code and map desktop.ui.closeWindow -> JQDX.closeWindow
  if (desktop.ui.windowTypes.indexOf(windowType) === -1) {
    // TODO: needs to keep track of static windows as well?
    JQDX.closeWindow($('#window_' + windowType));
    return;
  }
};

desktop.ui.buildContextMenu = function buildContextMenu (config) {
  if (!config) {
    return;
  }

  const {
    listId,
    menuItems,
  } = config;

  let renderedItemsLength = 0;

  
  for (const item of menuItems) {
    const {
      id,
      text,
      renderItem,
      clickHandler,
    } = item;

    if (renderItem()) {
      renderedItemsLength++;
      const menuItem = $('<li>', {
        class: 'context-menu-item',
        id: id,
        text: text,
        click: clickHandler || function () {},
      });
      
      $(listId).append(menuItem);
    }
  }

  return renderedItemsLength;
};

desktop.ui.clearContextMenu = function clearContextMenu (listId) {
  desktop.ui.contextMenu = {};
  $(listId).children().remove();
};

desktop.ui.buildContextMenuEventListener = function buildContextMenuEventListener (contextListId) {
  const contextListener = (event) => {
    const isClickedOutsideOfContainer = !$(contextListId).is(event.target) && $(contextListId).has(event.target).length === 0;

    if (isClickedOutsideOfContainer) {
      desktop.ui.clearContextMenu(contextListId);
      document.removeEventListener('click', contextListener);
    }
  };

  return contextListener;
};

desktop.ui.previewWindow = function previewWindow () {
  
}

// TODO: make switching display mode and view mode event emitter events, much cleaner, such wow
desktop.ui.toggleDisplayMode = function toggleDisplayMode () {
  
  if (desktop.ui.view === 'Mobile') {
    $('.desktop-shortcuts-container .shortcut').hide();
    if (buddypond.me) {
      $('.logoutShortcut').show();
    } else {
      $('.loginShortcut').show();
    }
  }
  
  
  // toggle between three states: open windows, min windows, profile page
  if (desktop.ui.displayMode === 'windows') {
    desktop.ui.displayMode = 'profile';
    desktop.ui.openWindow('profile', { noDockIcon: true });
  }
  else if (desktop.ui.displayMode === 'profile') {
    desktop.ui.closeWindow('profile');
    desktop.ui.displayMode = 'min';
    // If any windows are visible, hide all.
    $('div.window').hide();
  }
  else if (desktop.ui.displayMode === 'min') {
    desktop.ui.displayMode = 'windows';
    // show all windows that are invisible
    $('#dock li:visible a').each(function () {
      $($(this).attr('href')).show();
    });
  }
}

desktop.ui.openWindowsFromSavedSettings = function openWindowsFromSavedSettings () {
  let previouslyOpenWindows = desktop.get('windows_open');
  for (let key in previouslyOpenWindows) {
    let win = previouslyOpenWindows[key];
    desktop.ui.openWindow(win.app, { context: win.context }, function(){
      $(key).css('top', win.top);
      $(key).css('left', win.left);
      $(key).css('width', win.width);
      $(key).css('height', win.height);
    });
  }
}


desktop.ui.renderDesktopShortCut = function renderDesktopShortCut (appName, app) {
  if (app.placeholder) {
    $('.desktop-shortcuts-container').prepend(`
      <div class="icon shortcut">
      </div>
    `);
  } else {
    let href = `#icon_dock_${appName}`;
    if (app.href) {
      href = app.href;
    }
    $('.desktop-shortcuts-container').append(`
      <div class="icon shortcut ${app.class}">
        <a href="${href}">
          <img loading="lazy" class="emojiIcon" src="desktop/assets/images/icons/icon_${app.icon || appName}_64.png" />
          <span class="title">
            ${app.label || appName}
          </span>
        </a>
      </div>
    `);
  }
}

// TODO: remove and move to desktop.js app in v5
// desktop.js will be responsible for managing the desktop state
desktop.ui.renderDesktopShortCuts = function renderDesktopShortCuts () {
  
  $('.desktop-shortcuts-container').html('');

  for (let appName in desktop.settings.apps_installed) {
    let app = desktop.app.appstore.apps[appName];
    desktop.ui.renderDesktopShortCut(appName, app);
  }

  desktop.ui.renderDesktopShortCut('merlin', {
    name: 'merlin', label: 'Merlin Automated Assistant'
  });

  desktop.ui.renderDesktopShortCut('download', {
    name: 'download',
    href: 'https://github.com/marak/buddypond',
    label: 'Download Buddy Pond',
    icon: 'drive'
  });

  /*
  desktop.ui.renderDesktopShortCut('appstore', {
    name: 'appstore', label: 'App Store'
  });
  */

  desktop.ui.renderDesktopShortCut('login', {
    name: 'login', label: 'Login', icon: 'login', class: 'loginIcon loginShortcut'
  });

  desktop.ui.renderDesktopShortCut('logout', {
    name: 'logout', label: 'Logout', icon: 'login', class: 'loggedIn logoutShortcut'
  });

  setTimeout(function(){
    desktop.ui.windowResizeEventHandler(null, true); // adjusts shortcut padding if needed
  }, 333)

}

desktop.ui.setActiveWindowAsWallpaper = function setActiveWindowAsWallpaper () {
  let activeWin = desktop.ui.getActiveWindow();
  desktop.ui.setWindowAsWallpaper(activeWin);
}

desktop.ui.removeWindowWallpaper = function removeWindowWallpaper () {
  let windowWallpaper = $(".window_wallpaper");
  desktop.ui.removeWindowAsWallpaper(windowWallpaper)
}

desktop.ui.setWindowAsWallpaper = function setWindowAsWallpaper (id) {
  $(id).removeClass('window');
  $(id).removeClass('ui-draggable');
  $(id).removeClass('ui-resizable');
  $(id).removeClass('window_stack');
  $(id).addClass('wallpaper');
  $(id).addClass('window_wallpaper');
  $(id).css('height', '90%');
  $('.window_top', id).hide();
  $('.window_bottom', id).hide();
  // in case app.wallpaper is using canvas
  // TODO: better API integration into app.wallpaper
  $('.canvasBackground').hide();
}

desktop.ui.removeWindowAsWallpaper = function removeWindowAsWallpaper (id) {
  $(id).addClass('window');
  $(id).addClass('ui-draggable');
  $(id).addClass('ui-resizable');
  $(id).addClass('window_stack');
  $(id).removeClass('wallpaper');
  $(id).removeClass('window_wallpaper');
  $('.window_top', id).show();
  $('.window_bottom', id).show();
  // in case app.wallpaper is using canvas
  // TODO: better API integration into app.wallpaper
  $('.canvasBackground').show();
}