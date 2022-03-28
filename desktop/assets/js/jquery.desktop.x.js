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

//
// Resize modal window.
//
JQDX.window_resize = function window_resize (el) {
  // Nearest parent window.
  var win = $(el).closest('div.window');

  // TODO: App.resizeWindow() ??

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

  // Cancel right-click.
  d.on('contextmenu', function() {
    // console.log('right click is disabled in jquery.desktop.js file. you can turn it back on for fun.');
    //return false;
  });

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

  // Respond to double-click.
  d.on('dblclick', 'a.icon', function() {
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

  // Mouse over buddy name to see profile preview
  d.on('mouseenter', 'a.messageBuddy', function() {
    // TODO: move this out of this file?
    let buddyName = $(this).html();
    let buddyProfileText = desktop.buddyListData.buddylist['buddies/' + buddyName].myProfile || '';
    // console.log('buddyName', buddyName, 'buddyProfileText', buddyProfileText);
    if (buddyProfileText) {
      // show buddy profile panel
      $('#panel_buddy_profile').html(buddyProfileText);
      $('#panel_buddy_profile').show();
      $('.window').removeClass('window_stack');
      $('#panel_buddy_profile').addClass('window_stack');
    }
  });

  // mouse out of buddy name to hide profile preview
  d.on('mouseleave', 'a.messageBuddy', function() {
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
JQDX.showWindow = function showWindow(appName, params) {

  let appWindow = '#window_' + appName;
  let iconDock = '#icon_dock_' + appName

  // Show the taskbar button.
  if ($(iconDock).is(':hidden')) {
    $(iconDock).remove().appendTo('#dock');
    $(iconDock).show('fast');
  }

  // TODO: why this no work on gif studio load
  // Bring window to front.
  // $('.window_stack').remove('window_stack')
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

  let appWindow = '#window_' + appName;

  params = params || {};

  if (!JQDX.loading[appName]) {
    JQDX.loading[appName] = true;
  } else {
    console.log('Warning: Will not open window which is already loading.')
    return;
  }
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

  let windowType = $(closestWindow).attr('data-window-type');
  let windowContext = $(closestWindow).attr('data-window-context');
  let windowId = $(closestWindow).attr('id').replace('window_', '');

  if (windowType && windowContext) {
    desktop.ui.closeWindow(windowType, windowContext);
  }

  // check to see if the App which made this window supports a .closeWindow() method
  // this covers Apps which are not instanced
  if (desktop.app[windowId] && desktop.app[windowId].closeWindow) {
    desktop.app[windowId].closeWindow();
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
desktop.ui.windowTypes = ['buddy_message', 'pond_message'];

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

  // if the incoming windowType is not a registered window type, assume it's a non-instanistanble window
  // these are used for almost all applications, since most applications do not require N windows ( like chat )
  if (desktop.ui.windowTypes.indexOf(windowType) === -1) {
    // TODO: needs to keep track of static windows as well?
    JQDX.openWindow(windowType, context, position);
    return true;
  }

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
    //JQDX.maxWindow(false, $(el));
    return desktop.ui.openWindows[windowType][context];
  }

  desktop.log(`desktop.ui.openWindow("${windowType}", "${context}")`);

  if (desktop.ui.windowIndex[windowType][context]) {
    let windowId = desktop.ui.windowIndex[windowType][context];
    windowKey = '#' + windowId;
    // console.log('reopening window id', windowId)
    // TODO: check to see if window is min, if so, open it from dock
    // desktop.ui.renderDockElement(windowType + '_' + window_id, context);
    JQDX.window_flat();
    $(windowKey).show().addClass('window_stack');
    return windowKey;
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
    
    // TODO: viewPort mode values? specific values for mobile?
    $(windowId).css('width', '44vw');
    $(windowId).css('height', '66vh');
    $(windowId).css('top', '9vh');
    $(windowId).css('left', '13vw');


    // bring newly opened window to front
    JQDX.window_flat();
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
      // console.log('Warning: Error in showing ' + windowId, err);
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

  // if the incoming windowType is not a registered window type, assume it's a non-instanistanble window
  // these are used for almost all applications, since most applications require N windows ( like chat )
  if (desktop.ui.windowTypes.indexOf(windowType) === -1) {
    // TODO: needs to keep track of static windows as well?
    JQDX.closeWindow($('#window_' + windowType));
    return;
  }

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

desktop.ui.positionWindow = function positionWindow (windowId, position) {
  position = position || 'right';
  let windowWidth =  $(windowId).width() / 2;
  let windowPadding = 32;
  if (position === 'left') {
    $(windowId).position({
      my: "left top",
      at: "left"  + ' top+' + windowPadding,
      of: 'body'
    });
  }
  if (position === 'right') {
    $(windowId).position({
      my: "right top",
      at: "right-" + (windowWidth + windowPadding) + ' top+' + windowPadding,
      of: 'body'
    });
  }
}

/*

  refactor openWindow and openWindowInstance to JQDX
  have desktop.ui = JQDX;, one-liner in desktop.js

*/

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