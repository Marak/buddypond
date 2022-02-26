/*
jQuery Desktop is licensed as GPL v3, and is a Copyright of Nathan Smith
see: https://github.com/nathansmith/jQuery-Desktop
*/


/*

  TODO: add these methods to jQuery prototype:

   $.openWindow()
   $.closeWindow()
   $.cloneWindow()
   $.minimizeWindow();
   $.maximizeWindow();
   $.positionWindow();

*/

//
// Namespace - Module Pattern.
//
var JQD = (function($, window, document, undefined) {

  // Expose innards of JQD.
  return {
    go: function() {
      for (var i in JQD.init) {
        JQD.init[i]();
      }
    },
    init: {
      frame_breaker: function() {
        if (window.location !== window.top.location) {
          window.top.location = window.location;
        }
      },
      //
      // Initialize the clock.
      //
      clock: function() {
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
        setTimeout(JQD.init.clock, 60000);
      },
      //
      // Initialize the desktop.
      //
      desktop: function() {
        // Alias to document.
        var d = $(document);

        d.on('keydown', function(event) {
          if(event.key == "Escape") {
            // find active open window and close it
            let topWindow = $('.window_stack').attr('id')
            JDQX.closeWindow('#' + topWindow);
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
              JQD.util.clear_active();
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

        // Relative or remote links?
        d.on('click', 'a', function(ev) {
          var url = $(this).attr('href');
          this.blur();

          if (url.match(/^#/)) {
            ev.preventDefault();
            ev.stopPropagation();
          }
          else {
            $(this).attr('target', '_blank');
          }
        });

        // Make top menus active.
        d.on('mousedown', 'a.menu_trigger', function() {
          if ($(this).next('ul.menu').is(':hidden')) {
            JQD.util.clear_active();
            $(this).addClass('active').next('ul.menu').show();
          }
          else {
            JQD.util.clear_active();
          }
        });

        // Transfer focus, if already open.
        d.on('mouseenter', 'a.menu_trigger', function() {
          if ($('ul.menu').is(':visible')) {
            JQD.util.clear_active();
            $(this).addClass('active').next('ul.menu').show();
          }
        });

        // Cancel single-click.
        d.on('mousedown', 'a.icon', function() {
          // Highlight the icon.
          JQD.util.clear_active();
          $(this).addClass('active');
        });

        // Respond to double-click.
        d.on('dblclick', 'a.icon', function() {
          var iconDock = $(this).attr('href');
          var appName = iconDock.replace('#icon_dock_', '');
          JDQX.openWindow(appName)
        });

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
        // TODO: JDQX.maxWindow
        d.on('click', '#dock a', function() {
          JDQX.maxWindow(this);
        });

        // Focus active window.
        d.on('mousedown', 'div.window', function() {
          // Bring window to front.
          JQD.util.window_flat();
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
          JQD.util.window_resize(this);
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
          JDQX.minWindow(this);
        });

        // Maximize or restore the window.
        d.on('click', 'a.window_resize', function() {
          JQD.util.window_resize(this);
        });

        // Close the window.
        d.on('click', 'a.window_close', function() {
          JDQX.closeWindow(this);
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

        $('table.data').each(function() {
          // Add zebra striping, ala Mac OS X.
          $(this).find('tbody tr:odd').addClass('zebra');
        });

        d.on('mousedown', 'table.data tr', function() {
          // Clear active state.
          JQD.util.clear_active();

          // Highlight row, ala Mac OS X.
          $(this).closest('tr').addClass('active');
        });
      },
      wallpaper: function() {
        /*
        // Add wallpaper last, to prevent blocking.
        if ($('#desktop').length) {
          $('body').prepend('');
        }
        */
      }
    },
    util: {
      //
      // Clear active states, hide menus.
      //
      clear_active: function() {
        $('a.active, tr.active').removeClass('active');
        $('ul.menu').hide();
      },
      //
      // Zero out window z-index.
      //
      window_flat: function() {
        $('div.window').removeClass('window_stack');
      },
      //
      // Resize modal window.
      //
      window_resize: function(el) {
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
        JQD.util.window_flat();
        win.addClass('window_stack');
      }
    }
  };
// Pass in jQuery.
})(jQuery, this, this.document);

//
// Kick things off.
//
jQuery(document).ready(function() {
  JQD.go();
});


// extended JDQ functions added by Marak
var JDQX = {};
// TODO: this should be renamed to loadWindow() ?
JDQX.openWindow = function openWindow (appName) {
  let appWindow = '#window_' + appName;
  let iconDock = '#icon_dock_' + appName
  // console.log('JDQX appName', appName, 'iconDock', iconDock, 'appWindow', appWindow);

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

  // if the `App` has `lazy` set, we need to put a spinning icon on the mouse cursor...
  // ...and then call this app's `App.load()` function and wait until it's ready...
  // once the `App` is ready, we open it's window
  if (desktop.app[appName] && desktop.app[appName].lazyLoad && desktop.apps.lazy.indexOf(appName) !== -1) {
    // remove this `App` from the array of registered lazy apps
    desktop.apps.lazy = desktop.apps.lazy.filter(function(app){
      if (app === appName) {
        return false;
      }
      return true;
    });
    // set global cursor to spinning progress icon
    // TODO: spinning progress notifications should be per `App` and not a global state
    document.querySelectorAll('*').forEach(function(node) {
      node.style.cursor = 'progress';
    });

    // TODO: check if `App.depends_on` has required Apps that *must* be loaded first
    desktop.app[appName].load({}, function ready (){
      _windowLoaded();
    })

    function _windowLoaded () {
      desktop.apps.loaded.push(appName);
      desktop.ui.renderDockIcon(appName);
      JDQX.openWindow(appName)
      document.querySelectorAll('*').forEach(function(node) {
        node.style.cursor = 'pointer';
      });
      _showWindow();
    }
    
  } else {
    // this window appName has no associated apps waiting to be loaded,
    // check to see if there is an associated window_* id to show,
    // if not, assume user is trying to load an app which is not loaded yet
    let windowExists = $(appWindow).length;
    if (windowExists === 0) {

      // TODO: spinning progress notifications should be per `App` and not a global state
      document.querySelectorAll('*').forEach(function(node) {
        node.style.cursor = 'progress';
      });

      desktop.load.remoteJS([`desktop/apps/desktop.${appName}/desktop.${appName}.js`], function () {
        /* TODO: support N app dep, currently hard-coded to 1
        desktop.app[appName].depends_on.forEach(function(appDep){
          desktop.preloader.push(appDep);
        });
        */
        if (desktop.app[appName].depends_on && desktop.app[appName].depends_on.length > 0) {
          desktop.load.remoteJS([`desktop/apps/desktop.${desktop.app[appName].depends_on[0]}/desktop.${desktop.app[appName].depends_on[0]}.js`], function () {
            let depApp = desktop.app[appName].depends_on[0];
            desktop.app[depApp].load({}, function(){
              desktop
                .use(appName)
                .ready(function(err, apps){
                  desktop.log('Ready:', appName);
                  document.querySelectorAll('*').forEach(function(node) {
                    node.style.cursor = 'pointer';
                  });
                  _showWindow();
                });
            })
          });
        } else {
          desktop
            .use(appName)
            .ready(function(err, apps){
              desktop.log('Ready:', appName);
              document.querySelectorAll('*').forEach(function(node) {
                node.style.cursor = 'pointer';
              });
              _showWindow();
            });
        }
      })
    } else {
      _showWindow();
    }
  }

  function _showWindow() {
    // Show the taskbar button.
    if ($(iconDock).is(':hidden')) {
      $(iconDock).remove().appendTo('#dock');
      $(iconDock).show('fast');
    }

    // Bring window to front.
    JQD.util.window_flat();
    $(appWindow).addClass('window_stack').show();

    // check to see if desktop[appName].openWindow method is available,
    // if so, call this method
    // this is used to allow apps to have custom openWindow events 
    if (desktop.app[appName] && desktop.app[appName].openWindow) {
      desktop.app[appName].openWindow();
    }
    
  }
};

JDQX.minWindow = function minWindow (el) {
  $(el).closest('div.window').hide();
}

JDQX.maxWindow = function maxWindow (el) {
  // Get the link's target.
  var x = $($(el).attr('href'));

  // Hide, if visible.
  if (x.is(':visible')) {
    x.hide();
  }
  else {
    // Bring window to front.
    JQD.util.window_flat();
    x.show().addClass('window_stack');
  }
}

JDQX.closeWindow = function closeWindow (el) {
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

  // console.log('JDQX.closeWindow', windowId, windowType, windowContext);

  // this calls close events for instaniated window types( which require a context )

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

  // if the incoming windowType is not a registered window type, assume it's a non-instanistanble window
  // these are used for almost all applications, since most applications require N windows ( like chat )
  if (windowTypes.indexOf(windowType) === -1) {
    JDQX.openWindow(windowType);
    return;
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
