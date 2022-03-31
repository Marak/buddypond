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
// Kick things off.
//
jQuery(document).ready(function() {
  JQDX.bindDocumentEventHandlers();
  JQDX.frame_breaker();
  desktop.clock();
});

// extended JDQ functions added by Marak
var JQDX = {};
JQDX.loading = {};

//
// Zero out window z-index.
//
JQDX.window_flat = function window_flat () {
  $('div.window').removeClass('window_stack');
}

//
// Clear active states, hide menus.
//
JQDX.clear_active = function clear_active () {
  $('a.active, tr.active').removeClass('active');
  $('ul.menu').hide();
}

JQDX.frame_breaker = function frame_breaker () {
  if (window.location !== window.top.location) {
    window.top.location = window.location;
  }
}

// TODO: App.resizeWindow() ??
// TODO: desktop.ui.onresize = function () { // array of event handlers, etc use jquery ?}

desktop.ui.view = 'Normal';

window.onresize = function () {
  // TODO: better magic numbers for view mode sizes
  // TODO: move magic numbers into variables
  let width = $(document).width();
  let height = $(document).height();

  if (width <= 699) {
    desktop.ui.view = 'Mobile';
  }

  if (width > 699 && width < 2600) {
    desktop.ui.view = 'Normal';
  }

  if (width >= 2600) {
    desktop.ui.view = 'MegaDesk';
  }

  if (desktop.ui.view === 'Mobile') {
    // TODO: re-arrange windows to mobile view
  }

  if (desktop.ui.view === 'Normal') {
    $('.window_top').css('height', 30);
    $('.window_top').css('padding-top', 0);
    $('.window_content').css('top', 33);
  }

  if (desktop.ui.view === 'MegaDesk') {
    $('.window_top').css('height', 40);
    $('.window_top').css('padding-top', 10);
    $('.window_content').css('top', 53);
  }
  // $('.debugWindow').html(width + ' '  + height + ' ' + desktop.ui.view);
}

//
// Resize modal window.
//
JQDX.window_resize = function window_resize (el) {
  // Nearest parent window.
  var win = $(el).closest('div.window');

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
  win.addClass('window_stack');
}

JQDX.bindDocumentEventHandlers = function bindDocumentEventHandlers () {
  
  var d = $(document);

  d.on('keydown', function(event) {
    if(event.key == "Escape") {
      // find active open window and close it
      let topWindow = $('.window_stack').attr('id')
      JQDX.closeWindow('#' + topWindow);
    }
  });

  // Cancel mousedown.
  /*
  Canceling mousedown has been removed 5/28
  These lines should be able to be removed pending further testing
  d.mousedown(function(ev) {
    var tags = [
      'a',
      'button',
      'input',
      'select',
      'textarea',
      'tr'
    ].join(',');

    if (!$(ev.target).closest(tags).length) {
      if (!$(ev.target).hasClass('chat_messages') && !$(ev.target).hasClass('message')) {
        JQDX.clear_active();
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  });
  */

  // Cancel right-click.
  // d.on('contextmenu', function() {
  //   console.log('right click is disabled in jquery.desktop.js file. you can turn it back on for fun.');
  //   return false;
  // });

  d.on('click', 'a.openIDC', function(ev) {
    let id = $(this).html()
    let videoId = $(this).data('videoid')
    let start = $(this).data('videot')
    if(start){
      desktop.ui.openWindow('interdimensionalcable', { videoId: videoId, start: start });
    } else {
      desktop.ui.openWindow('interdimensionalcable', { videoId: videoId });
    }
  });

  d.on('click', 'a.openSound', function(ev) {
    let id = $(this).html()
    let soundUrl = $(this).data('soundurl')
    desktop.ui.openWindow('soundrecorder', { soundUrl: soundUrl });
  });

  // Relative or remote links?
  d.on('click', 'a', function(ev) {
    var url = $(this).attr('href');
    this.blur();

    if (url.match(/^#/)) {
      ev.preventDefault();
      ev.stopPropagation();
      // TODO: perform routing on certain tags
    }
    else {
      $(this).attr('target', '_blank');
    }
  });

  // Make top menus active.
  d.on('mousedown', 'a.menu_trigger', function() {
    if ($(this).next('ul.menu').is(':hidden')) {
      JQDX.clear_active();
      $(this).addClass('active').next('ul.menu').show();
    }
    else {
      JQDX.clear_active();
    }
  });

  // Transfer focus, if already open.
  d.on('mouseenter', 'a.menu_trigger', function() {
    if ($('ul.menu').is(':visible')) {
      JQDX.clear_active();
      $(this).addClass('active').next('ul.menu').show();
    }
  });

  // Hide top nav drop down menu if Buddy moves mouse away from active / open menu
  d.on('mouseenter', 'ul.menu', function() {
  });

  d.on('mouseleave', 'ul.menu', function() {
    if ($('ul.menu').is(':visible')) {
      JQDX.clear_active();
      $('ul.menu').hide();
    }
  });

  // Cancel single-click.
  d.on('mousedown', 'a.icon', function() {
    // Highlight the icon.
    JQDX.clear_active();
    $(this).addClass('active');
  });

  // Click remix paint icon to remix images in Paint App
  d.on('mousedown', 'img.remixPaint, img.remixMeme', function() {
    let form = $(this).parent();
    let url = $('.image', form).attr('src');
    let output = $(this).data('output');
    let context = $(this).data('context');
    JQDX.openWindow('paint', {
      src: url,
      output: output,
      context: context
    });
  });

  // Click remix GIF icon to remix gifs in Gif Studio App
  d.on('mousedown', 'img.remixGif', function(ev) {
    let form = $(this).parent();
    let url = $('.image', form).attr('src');
    let output = $(this).data('output');
    let context = $(this).data('context');

    // TOOD: get count instead of frame index
    // let frameIndex = $(this).data('frameindex') || 0;
    // TODO: use params here to openWindow instead of localstorage?
    desktop.set('paint_active_type', 'gifstudio');
    desktop.set('paint_active_context', 'making-a-gif');
    
    desktop.app.gifstudio = desktop.app.gifstudio || {};
    // -1 or undefined as frame index indicates create new gif
    JQDX.openWindow('gifstudio', {
      src: url,
      output: output,
      context: context,
      frameIndex: desktop.app.gifstudio.currentFrameIndex || 0
    });
  });

  d.on('mouseover', '.message img', function(){
    let img = $(this);
    let holder = img.parent();
    //img.css('opacity', 0.7777);
    $('.remixGif', holder).show();
    $('.remixPaint', holder).show();
  });

  d.on('mouseleave', '.message img', function(){
    let img = $(this);
    let holder = img.parent();
    //img.css('opacity', 1.0);
    $('.remixGif', holder).hide();
    $('.remixPaint', holder).hide();
  });

  // App icons are double click on to open on desktop
  let eventName = 'dblclick';
  if (isMobile) {
    // Single click to open Apps icons on mobile
    eventName = 'click';
  }
  d.on(eventName, 'a.icon', function() {
    var iconDock = $(this).attr('href');
    var appName = iconDock.replace('#icon_dock_', '');
    JQDX.openWindow(appName)
  });

  d.on('mousedown', '.startNewGif', function(){
    let app = $(this).attr('href');
    app = app.replace('#', '');
    desktop.app.gifstudio.insertMode = 'insert';
    JQDX.openWindow('paint', {
      output: 'gifstudio',
      context: 'new-gif'
    });
    return false;
  })

  // Make icons draggable.
  d.on('mouseenter', 'a.icon', function() {
    $(this).off('mouseenter').draggable({
      revert: false,
      containment: 'parent',
      stop: function() {
        desktop.ui.getDesktopIconPositions();
      }
    });
  });

  // to build a contextmenu like this add this to your html (styles are applied globally):
  // <div id="your context menu id" class="context-menu" style="display: none">
  //   <ul id="your context list id" class="context-list"></ul>
  // </div>
  d.on('contextmenu', 'a.messageBuddy', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const currentBuddy = $(this).html();
    const buddyProfileText = desktop.buddyListData.buddylist['buddies/' + currentBuddy].myProfile || '';

    if (
      desktop.ui.contextMenu &&
      desktop.ui.contextMenu.currentBuddy &&
      desktop.ui.contextMenu.currentBuddy !== currentBuddy
    ) {
      desktop.ui.clearContextMenu('#contextListBuddy');
    }

    if ($('#contextListBuddy').children().length === 0) {
      
      desktop.ui.contextMenu = {
        currentBuddy
      };

      const renderedItemsLength = desktop.ui.buildContextMenu({
        listId: '#contextListBuddy',
        menuItems: [
          {
            id: 'profile',
            text: 'Buddy profile',
            renderItem: () => buddyProfileText.length > 0,
            clickHandler: () => {
              $('#panel_buddy_profile').html(buddyProfileText),
              $('#panel_buddy_profile').show(),
              $('#panel_buddy_profile').addClass('window_stack')
            }
          }
        ]
      });

      if (renderedItemsLength > 0) {
        const rect = $(this).parents('li')[0].getBoundingClientRect();
        $('#contextMenuBuddy').css({
          display: 'block',
          left: ev.clientX - rect.left,
          top: ev.clientY - rect.top / 2.5,
          zIndex: 9999
        });

        document.addEventListener('click', desktop.ui.buildContextMenuEventListener('#contextListBuddy'));
      }
    }
  });

  // mouse out of buddy profile to hide profile preview
  d.on('mouseleave', '#panel_buddy_profile', function() {
    // TODO: move this out of this file?
    $('#panel_buddy_profile').hide();
    $('#panel_buddy_profile').removeClass('window_stack');
  });

  // Taskbar buttons.
  // TODO: JQDX.maxWindow
  d.on('click', '#dock a', function() {
    JQDX.maxWindow(this);
  });

  // Focus active window.
  d.on('mousedown', 'div.window', function() {
    // Bring window to front.
    JQDX.window_flat();
    $(this).addClass('window_stack');
  });

  // Make windows draggable.
  d.on('mouseenter', 'div.window', function() {
    $(this).off('mouseenter').draggable({
      // Confine to desktop.
      // Movable via top bar only.
      cancel: 'a',
      containment: 'parent',
      handle: 'div.window_top'
    }).resizable({
      containment: 'parent',
      minWidth: 220,
      minHeight: 110
    });
  });

  // Double-click top bar to resize, ala Windows OS.
  d.on('dblclick', 'div.window_top', function() {
    JQDX.window_resize(this);
  });

  // Double click top bar icon to close, ala Windows OS.
  d.on('dblclick', 'div.window_top img', function() {
    // Traverse to the close button, and hide its taskbar button.
    $($(this).closest('div.window_top').find('a.window_close').attr('href')).hide('fast');

    // Close the window itself.
    $(this).closest('div.window').hide();

    // Stop propagation to window's top bar.
    return false;
  });

  // Minimize the window.
  d.on('click', 'a.window_min', function() {
    JQDX.minWindow(this);
  });

  // Maximize or restore the window.
  d.on('click', 'a.window_resize', function() {
    JQDX.window_resize(this);
  });

  // Close the window.
  d.on('click', 'a.window_close', function() {
    JQDX.closeWindow(this);
  });

  // Show desktop button, ala Windows OS.
  d.on('mousedown', '#show_desktop', function() {
    // If any windows are visible, hide all.
    if ($('div.window:visible').length) {
      $('div.window').hide();
    }
    else {
      // Otherwise, reveal hidden windows that are open.
      $('#dock li:visible a').each(function() {
        $($(this).attr('href')).show();
      });
    }
  });

  // this needs to re-trigger on re-renders
  $('table.data').each(function() {
    // Add zebra striping, ala Mac OS X.
    $(this).find('tbody tr:odd').addClass('zebra');
  });

  d.on('mousedown', 'table.data tr', function() {
    // Clear active state.
    JQDX.clear_active();

    // Highlight row, ala Mac OS X.
    $(this).closest('tr').addClass('active');
  });

}

JQDX.loadWindow = function loadWindow (appName, params, callback) {
  desktop.load.remoteJS([`desktop/apps/desktop.${appName}/desktop.${appName}.js`], function () {
    /* TODO: support N app dep, currently hard-coded to 1
    desktop.app[appName].depends_on.forEach(function(appDep){
      desktop.preloader.push(appDep);
    });
    */
    if (desktop.app[appName] && desktop.app[appName].depends_on && desktop.app[appName].depends_on.length > 0) {
      let depName = desktop.app[appName].depends_on[0];
      desktop.log('Loading: App.' + depName);
      desktop.load.remoteJS([`desktop/apps/desktop.${depName}/desktop.${desktop.app[appName].depends_on[0]}.js`], function () {
        desktop.log('Ready: App.' + depName);
        let depApp = desktop.app[appName].depends_on[0];
        desktop.app[depApp].load(params, function(){
          desktop.app[appName].load(params, function(){
            desktop.log('Ready: App.' + appName);
            document.querySelectorAll('*').forEach(function(node) {
              node.style.cursor = 'pointer';
            });
            callback();
          });
        })
      });
    } else {
      desktop.app[appName].load(params, function(){
        desktop.log('Ready: App.' + appName);
        document.querySelectorAll('*').forEach(function(node) {
          node.style.cursor = 'pointer';
        });
        callback();
      });
    }
  })
}

// will show an existing window that is already in the DOM
// the window might be hidden or minimized
JQDX.showWindow = function showWindow (appName, params) {

  let appWindow = '#window_' + appName;

  if (appName === 'pond' && params.context) {
    appWindow += '_message_' + params.context;
  }

  // TODO: rename "buddylist" app to "buddy"
  if (appName === 'buddylist' && params.context) {
    appWindow = '#window_buddy_message_' + params.context;
  }

  let iconDock = '#icon_dock_' + appName

  // Show the taskbar button.
  if ($(iconDock).is(':hidden')) {
    $(iconDock).remove().appendTo('#dock');
    $(iconDock).show('fast');
  }

  JQDX.window_flat();
  $(appWindow).addClass('window_stack').show();

  // check to see if desktop[appName].openWindow method is available,
  // if so, call this method
  // this is used to allow apps to have custom openWindow events 
  if (desktop.app[appName] && desktop.app[appName].openWindow) {
    desktop.app[appName].openWindow(params);
  }
  JQDX.loading[appName] = false;
  /* Remark: Does this function need a callback? Does App.openWindow() require callback?
  if (typeof cb === 'function') {
    cb(null);
  }
  */
}

// attempts to open a window based on name and parameters
// will attempt to JQDX.loadWindow() if no window is found
JQDX.openWindow = function openWindow (appName, params, cb) {

  params = params || {};

  let appWindow = '#window_' + appName;

  if (desktop.ui.windowTypes.indexOf(appName) !== -1) {
    JQDX.showWindow(appName, params);
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
      document.querySelectorAll('*').forEach(function(node) {
        node.style.cursor = 'progress';
      });
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
    // TODO: spinning progress notifications should be per `App` and not a global state
    document.querySelectorAll('*').forEach(function(node) {
      node.style.cursor = 'progress';
    });
    desktop.log('Loading: App.' + appName);
    JQDX.loadWindow(appName, params, function(){
      desktop.ui.renderDockIcon(appName);
      JQDX.showWindow(appName, params);
    })
  } else {

    // TODO: buddy message window should not pop-up in mimized,
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

  }
};

JQDX.minWindow = function minWindow (el) {
  $(el).closest('div.window').hide();
}

JQDX.maxWindow = function maxWindow (el, $el) {
  // Get the link's target.
  var x = $($(el).attr('href'));
  if ($el) {
    x = $el;
  }

  // Hide, if visible.
  if (x.is(':visible')) {
    x.hide();
  }
  else {
    // Bring window to front.
    JQDX.window_flat();
    x.show().addClass('window_stack');
  }
}

JQDX.closeWindow = function closeWindow (el) {
  let closestWindow = $(el).closest('div.window');
  closestWindow.hide();
  $($(el).attr('href')).hide('fast');

  let type = $(closestWindow).data('type');
  let appName = $(closestWindow).data('app');
  let context = $(closestWindow).data('context');

  let windowType = $(closestWindow).attr('data-window-type');
  let windowContext = $(closestWindow).attr('data-window-context');
  let windowId = $(closestWindow).attr('id').replace('window_', '');

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

}

// creates icon for dock bar ( min / max )
desktop.ui.renderDockIcon = function (app) {
  // Remark: temp conditional, remove later
  if (desktop.isMobile) {
    return false;
  }
  let html = `
    <li id="icon_dock_${app}">
      <a href="#window_${app}">
        <img class="emojiIcon" src="desktop/assets/images/icons/icon_${desktop.app[app].icon || app}_64.png" />
        <span class="dock_title">
          ${desktop.app[app].label || app }
        </span>
      </a>
    </li>
  `;
  $('#dock').append(html);
};

// TODO: these functions
// desktop.renderDesktopIcon = function () {}; // creates desktop icon ( double click to start app )
// desktop.renderWindow = function () {};   // creates new "#window_foo" DOM elements ( single instance, not openWindow() )

desktop.ui.removeDockElement = function (windowType, context) {
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

desktop.ui.renderDockElement = function (key, context) {
  var dockElement = '#icon_dock_' + key;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}

// windowIndex is used to keep track of all created windows
desktop.ui.windowIndex = {};

// special mapping for pond and buddylist, which allow N windows to open based on context
// all other apps are currently set to 1 window only
// TODO: remove `desktop.ui.windowTypes` from API and have more intelligent openWindow()
desktop.ui.windowTypes = ['buddy_message', 'pond_message'];

// maps to JQDX.openWindow
desktop.ui.openWindow = JQDX.openWindow;

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
}

// TODO: move this into separate app with timezones and better clock / date format / calendar
desktop.clock = function desktopClock () {

  var clock = $('#clock');

  if (!clock.length) {
    return;
  }

  // Date variables.
  var date_obj = new Date();
  var hour = date_obj.getHours();
  var minute = date_obj.getMinutes();
  var day = date_obj.getDate();
  var year = date_obj.getFullYear();
  var suffix = 'AM';

  // Array for weekday.
  var weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Array for month.
  var month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Assign weekday, month, date, year.
  weekday = weekday[date_obj.getDay()];
  month = month[date_obj.getMonth()];

  // AM or PM?
  if (hour >= 12) {
    suffix = 'PM';
  }

  // Convert to 12-hour.
  if (hour > 12) {
    hour = hour - 12;
  }
  else if (hour === 0) {
    // Display 12:XX instead of 0:XX.
    hour = 12;
  }

  // Leading zero, if needed.
  if (minute < 10) {
    minute = '0' + minute;
  }

  // Build two HTML strings.
  var clock_time = weekday + ' ' + hour + ':' + minute + ' ' + suffix;
  var clock_date = month + ' ' + day + ', ' + year;

  // Shove in the HTML.
  clock.html(clock_time).attr('title', clock_date);

  // Update every 60 seconds.
  setTimeout(desktop.clock, 60000);
  
}

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
}

desktop.ui.clearContextMenu = function clearContextMenu (listId) {
  desktop.ui.contextMenu = {};
  $(listId).children().remove();
}

desktop.ui.buildContextMenuEventListener = function buildContextMenuEventListener (contextListId) {
  const contextListener = (event) => {
    const isClickedOutsideOfContainer = !$(contextListId).is(event.target) && $(contextListId).has(event.target).length === 0;

    if (isClickedOutsideOfContainer) {
      desktop.ui.clearContextMenu(contextListId);
      document.removeEventListener('click', contextListener);
    }
  }

  return contextListener;
}