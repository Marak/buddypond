/*
jQuery Desktop is licensed as GPL v3, and is a Copyright of Nathan Smith
see: https://github.com/nathansmith/jQuery-Desktop
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
          JDQX.openWindow(this)
        });

        // Make icons draggable.
        d.on('mouseenter', 'a.icon', function() {
          $(this).off('mouseenter').draggable({
            revert: false,
            containment: 'parent'
          });
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
JDQX.openWindow = function openWindow (context) {
  var iconDock = $(context).attr('href');
  var appName = iconDock.replace('#icon_dock_', '');
  let appWindow = '#window_' + appName;
  // console.log('JDQX appName', appName, 'iconDock', iconDock, 'appWindow', appWindow);

  // check to see if the `App` is trying to load, but is currently deffered
  // if so, put a spinning icon on the mouse cursor
  // we set the `openWhenLoaded` flag on the `App` and this will cause the `App` window to open when it's ready
  if (desktop[appName] && desktop[appName].deferredLoad) {
    // set global cursor to spinning progress icon
    // TODO: spinning progress notifications should be per `App` and not a global state
    document.querySelectorAll('*').forEach(function(node) {
      node.style.cursor = 'progress';
    });
    // set a flag to indicate this App should open when defered loading completes
    desktop[appName].openWhenLoaded = true;
    return;
  }

  // if the `App` has `lazy` set, we need to put a spinning icon on the mouse cursor...
  // ...and then call this app's `App.load()` function and wait until it's ready...
  // once the `App` is ready, we open it's window
  if (desktop[appName] && desktop[appName].lazyLoad && desktop.apps.lazy.indexOf(appName) !== -1) {
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
    desktop[appName].load({}, function ready (){
      JDQX.openWindow(context)
      document.querySelectorAll('*').forEach(function(node) {
        node.style.cursor = 'pointer';
      });
    })
    return;
  }

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
  if (desktop[appName] && desktop[appName].openWindow) {
    desktop[appName].openWindow();
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
    desktop.closeWindow(windowType, windowContext);
  }

  // check to see if the App which made this window supports a .closeWindow() method
  // this covers Apps which are not instanced
  if (desktop[windowId] && desktop[windowId].closeWindow) {
    desktop[windowId].closeWindow();
  }

  $('#icon_dock_' + windowId).hide('fast');

  // console.log('JDQX.closeWindow', windowId, windowType, windowContext);

  // this calls close events for instaniated window types( which require a context )

}