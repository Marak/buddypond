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

//
// Original JQDX document.ready handler ( this can be removed soon )
//
jQuery(document).ready(function () {
  JQDX.bindDocumentEventHandlers();
  JQDX.frame_breaker();
  desktop.setClock();
});

// extended JDQ functions added by Marak
// eslint-disable-next-line no-redeclare
const JQDX = {};
JQDX.loading = {};

//
// Zero out window z-index.
//
JQDX.window_flat = function window_flat () {
  $('div.window').removeClass('window_stack');
};

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

desktop.ui.windowResizeEventHandler = function windowResizeEventHandler (forceUpdate) {
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
      $('.window_content').css('top', 33);
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
  console.log('win', win)
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

JQDX.bindDocumentEventHandlers = function bindDocumentEventHandlers () {
  
  let d = $(document);

  d.on('keydown', function (event) {
    if (event.key == 'Escape') {
      // find active open window and close it
      let topWindow = $('.window_stack').attr('id');
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

  d.on('click', 'a.openIDC', function (ev) {
    let videoId = $(this).data('videoid');
    let start = $(this).data('videot');
    if (start) {
      desktop.ui.openWindow('interdimensionalcable', { videoId: videoId, start: start });
    } else {
      desktop.ui.openWindow('interdimensionalcable', { videoId: videoId });
    }
  });

  d.on('click', 'a.openSound', function (ev) {
    let soundUrl = $(this).data('soundurl');
    desktop.ui.openWindow('soundrecorder', { soundUrl: soundUrl });
  });

  d.on('click', 'a.openApp', function (ev) {
    let appName = $(this).data('app');
    let context =  $(this).data('context');
    let params = {};
    if (context) {
      params.context = context;
    }
    desktop.ui.openWindow(appName, params);
  });

  d.on('click', 'button.openApp', function (ev) {
    let appName = $(this).data('app');
    let context =  $(this).data('context');
    let params = {};
    if (context) {
      params.context = context;
    }
    desktop.ui.openWindow(appName, params);
  });

  d.on('click', 'button.addApp', function (ev) {
    let appName = $(this).data('app');
    let context =  $(this).data('context');
    let params = {
      appStoreInstall: true,
      version: '4.20.69'
    };
    if (context) {
      params.context = context;
    }
    let el = this;
    if ($(el).html() === 'Remove') {
      $(el).html('Adding');
      $(el).attr('disabled', 'DISABLED');
      desktop.app.appstore.removeApp(appName, params, function (err, result) {
        $(el).attr('disabled', null);
        $(el).html('Add');
      });
    } else {
      $(el).html('Adding');
      $(el).attr('disabled', 'DISABLED');
      desktop.app.appstore.addApp(appName, params, function (err, result) {
        $(el).html('Remove');
        $(el).attr('disabled', null);
      });
    }
  });

  function runBuddyScript (coode, params) {
    coode = coode.substr(1, coode.length - 1);
    desktop.log('Attempting to eval() string ' + coode, 'with params', params);
    desktop.app.console.evalCoode(coode, params);
  }

  d.on('click', '.runBuddyScript', function (ev) {
    // Remark It's not code yet, it's "coode"
    let holder = $(this).parent().parent();
    let coode = $('.buddyScript', holder).html();
    let win = $(this).closest('div.window');
    runBuddyScript(coode, { windowId: '#' + win.attr('id') });
    return false;
  });

  d.on('click', '.buddyScript', function (ev) {
    // Remark It's not code yet, it's "coode"
    let holder = $(this).parent().parent();
    let coode = $('.buddyScript', holder).html();
    runBuddyScript(coode);
    return false;
  });

  d.on('click', '.getHelp', function () {
    // Remark: Closest active chat window is the context for help to show in
    let win = $(this).closest('div.window');
    let windowId = '#' + win.attr('id');
    desktop.commands.chat.help({ windowId: windowId });
  });

  d.on('click', '.hidesHelp', function (ev) {
    let holder = $(this).parent();
    holder.hide();
    return false;
  });

  d.on('click', 'tr.openApp', function (ev) {
    let appName = $(this).data('app');
    desktop.ui.openWindow(appName);
  });

  // Relative or remote links?
  d.on('click', 'a', function (ev) {
    let url = $(this).attr('href');
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

  /*
  d.on('click', '.desktopImage', function (ev) {
    // find the parent <a> tag and us its href
    let url = $(this).parent().attr('href');
    let img = $(this).attr('src');
  });
  */

  // Make top menus active.
  d.on('mousedown', 'a.menu_trigger', function () {
    if ($(this).next('ul.menu').is(':hidden')) {
      JQDX.clear_active();
      $(this).addClass('active').next('ul.menu').show();
    }
    else {
      JQDX.clear_active();
    }
  });

  // Transfer focus, if already open.
  d.on('mouseenter', 'a.menu_trigger', function () {
    if ($('ul.menu').is(':visible')) {
      JQDX.clear_active();
      $(this).addClass('active').next('ul.menu').show();
    }
  });

  // Hide top nav drop down menu if Buddy moves mouse away from active / open menu
  d.on('mouseenter', 'ul.menu', function () {
  });

  d.on('mouseleave', 'ul.menu', function () {
    if ($('ul.menu').is(':visible')) {
      JQDX.clear_active();
      $('ul.menu').hide();
    }
  });

  // Cancel single-click.
  d.on('mousedown', 'div.icon', function () {
    // Highlight the icon.
    JQDX.clear_active();
    //$(this).addClass('active');
  });

  // Click remix paint icon to remix images in Paint App
  d.on('mousedown', 'img.remixPaint, img.remixMeme', function () {
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
  d.on('mousedown', 'img.remixGif', function (ev) {
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

  // App icons are double click on to open on desktop
  let eventName = 'dblclick';

  if (desktop.ui.view === 'Mobile') {
    // Single click to open Apps icons on mobile
    eventName = 'click';
  }

  // clicking on an icon opens the window
  d.on(eventName, '.icon a', function () {
    let iconDock = $(this).attr('href');
    let appName = iconDock.replace('#icon_dock_', '');
    if (appName === 'download_buddypond') {
      window.open('https://github.com/marak/buddypond', '_blank');
      return;
    }
    if (appName === 'logout') {
      desktop.app.login.logoutDesktop();
      return;
    }
    JQDX.openWindow(appName);
  });

  d.on('mousedown', '.startNewGif', function () {
    desktop.app.gifstudio.insertMode = 'insert';
    JQDX.openWindow('paint', {
      output: 'gifstudio',
      context: 'new-gif'
    });
    return false;
  });

  // Make icons draggable.
  d.on('mouseenter', 'div.icon', function () {
    $(this).off('mouseenter').draggable({
      revert: false,
      containment: 'none',
      stop: function () {
        // desktop.ui.getDesktopIconPositions();
      }
    });
  });

  // to build a contextmenu like this add this to your html (styles are applied globally):
  // <div id="your context menu id" class="context-menu" style="display: none">
  //   <ul id="your context list id" class="context-list"></ul>
  // </div>
  d.on('contextmenu', 'a.messageBuddy', function (ev) {
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
              $('#panel_buddy_profile').addClass('window_stack');
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
  d.on('mouseleave', '#panel_buddy_profile', function () {
    // TODO: move this out of this file?
    $('#panel_buddy_profile').hide();
    $('#panel_buddy_profile').removeClass('window_stack');
  });

  // Clicking on the dock icon
  d.on('click', '#dock a', function () {
    JQDX.maxWindow(this);
  });

  // Focus active window.
  d.on('mousedown', 'div.window', function () {
    // Bring window to front.
    JQDX.window_flat();
    $(this).addClass('window_stack');
  });

  // Make windows draggable.
  d.on('mouseenter', 'div.window', function () {
    $(this).off('mouseenter').draggable({
      // Confine to desktop.
      // Movable via top bar only.
      cancel: 'a',
      containment: 'parent',
      handle: 'div.window_top',
      stop: function (ev) {
        // desktop.ui.getDesktopIconPositions();
        let win = $(this);
        let windowId =  '#' + win.attr('id');
        let appName = win.data('app');
        let context = win.data('context');
        desktop.ui.openWindows[windowId] = {
          open: true,
          app: appName,
          context: context,
          width: win.css('width'),
          height: win.css('height'),
          top: win.css('top'),
          left: win.css('left')
        }
        desktop.set('windows_open', desktop.ui.openWindows);
      }
    }).resizable({
      containment: 'parent',
      minWidth: 220,
      minHeight: 110
    });
  });

  // Double-click top bar to resize, ala Windows OS.
  d.on('dblclick', 'div.window_top', function () {
    JQDX.window_resize(this);
  });

  // Double click top bar icon to close, ala Windows OS.
  d.on('dblclick', 'div.window_top img', function () {
    // Traverse to the close button, and hide its taskbar button.
    $($(this).closest('div.window_top').find('a.window_close').attr('href')).hide('fast');

    // Close the window itself.
    $(this).closest('div.window').hide();

    // Stop propagation to window's top bar.
    return false;
  });

  // Minimize the window.
  d.on('click', 'a.window_min', function () {
    JQDX.minWindow(this);
  });
  d.on('click', 'a.minWindow', function () {
    JQDX.minWindow(this);
  });


  // Maximize or restore the window.
  d.on('click', 'a.window_resize', function () {
    JQDX.window_resize(this);
  });
  d.on('click', 'a.maxWindow', function () {
    JQDX.window_resize(this);
  });

  // Close the window.
  d.on('click', 'a.window_close', function () {
    JQDX.closeWindow(this);
  });
  d.on('click', 'a.exitWindow', function () {
    JQDX.closeWindow(this);
  });

  d.on('mousedown', '#show_desktop', function () {
    desktop.ui.toggleDisplayMode();
  });

  // this needs to re-trigger on re-renders
  $('table.data').each(function () {
    // Add zebra striping, ala Mac OS X.
    $(this).find('tbody tr:odd').addClass('zebra');
  });

  d.on('mousedown', 'table.data tr', function () {
    // Clear active state.
    JQDX.clear_active();

    // Highlight row, ala Mac OS X.
    $(this).closest('tr').addClass('active');
  });

  d.on('click', '#clock', function () {
    const format = desktop.app.localstorage.get('clock');
    // clear before we switch to a new format

    if (desktop.clockTimeout) {
      clearTimeout(desktop.clockTimeout);
    }

    // switch clock format depending on what is set
    if (format && format === 'dd-mm-yyyy') {
      desktop.app.localstorage.set('clock', 'mm-dd-yyyy');
      desktop.setClock();
    } else {
      desktop.app.localstorage.set('clock', 'dd-mm-yyyy');
      desktop.setClock();
    }
  });
};

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
  desktop.load.remoteJS([`desktop/apps/desktop.${appName}/desktop.${appName}.js` ], function () {
    /* TODO: support N app dep, currently hard-coded to 1
    desktop.app[appName].depends_on.forEach(function(appDep){
      desktop.preloader.push(appDep);
    });
    */
    if (desktop.app[appName] && desktop.app[appName].depends_on && desktop.app[appName].depends_on.length > 0) {
      // TODO: can we remove this and just use call load.remoteJS() from inside the app.load ( like other deps )
      let depName = desktop.app[appName].depends_on[0];
      desktop.log('Loading: App.' + depName);
      desktop.load.remoteJS([ `desktop/apps/desktop.${depName}/desktop.${desktop.app[appName].depends_on[0]}.js` ], function () {
        desktop.log('Ready: App.' + depName);
        let depApp = desktop.app[appName].depends_on[0];
        desktop.app[depApp].load(params, function () {
          desktop.app[appName].load(params, function () {
            desktop.log('Ready: App.' + appName);
            /*
            document.querySelectorAll('*').forEach(function (node) {
              node.style.cursor = 'pointer';
            });
            */
            callback();
          });
        });
      });
    } else {
      desktop.app[appName].load(params, function () {
        desktop.log('Ready: App.' + appName);
        /*
        document.querySelectorAll('*').forEach(function (node) {
          node.style.cursor = 'pointer';
        });
        */
        callback();
      });
    }
  });
};

// will show an existing window that is already in the DOM
// the window might be hidden or minimized
JQDX.showWindow = function showWindow (appName, params) {
  params = params || {};
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
    // Show the taskbar button.
    if ($(iconDock).is(':hidden')) {
      $(iconDock).remove().appendTo('#dock');
      $(iconDock).show('fast');
    }
  }

  JQDX.window_flat();
  $(appWindow).addClass('window_stack').show();

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
  desktop.ui.windowResizeEventHandler(true);

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
    /*
    document.querySelectorAll('*').forEach(function (node) {
      node.style.cursor = 'progress';
    });
    */
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
    /*
    // TODO: spinning progress notifications should be per `App` and not a global state
    document.querySelectorAll('*').forEach(function (node) {
      node.style.cursor = 'progress';
    });
    */
    JQDX.loadWindow(appName, params, function () {
      desktop.ui.renderDockIcon(appName);
      JQDX.showWindow(appName, params);
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

// TODO: move this into separate app with timezones and better clock / date format / calendar
desktop.setClock = function setClock () {
  const clock = $('#clock');

  if (!clock.length) {
    return;
  }

  let format;

  if (desktop.app.localstorage) {
    format = desktop.app.localstorage.get('clock');
  }


  // Date variables.
  const date_obj = new Date();
  let hour = date_obj.getHours();
  let minute = date_obj.getMinutes();
  const day = date_obj.getDate();
  const year = date_obj.getFullYear();

  // Array for weekday.
  let weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // Array for month.
  let month = [
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

  // Leading zero, if needed.
  if (minute < 10) {
    minute = '0' + minute;
  }

  if (!format || format === 'mm-dd-yyyy') {
    let suffix = 'AM';
    // default to US time format with 12h

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

    // Build two HTML strings.
    const clock_time = weekday + ' ' + hour + ':' + minute + ' ' + suffix;
    const clock_date = month + ' ' + day + ', ' + year;

    // Shove in the HTML.
    clock.html(clock_time).attr('title', clock_date);

    // Update every 60 seconds.
    desktop.clockTimeout = setTimeout(desktop.setClock, 60000);
  } else {
    if (hour < 12) {
      hour = '0' + hour;
    }

    // Build two HTML strings.
    const clock_time = weekday + ' ' + hour + ':' + minute;
    const clock_date = day + ' ' + month + ', ' + year;

    // Shove in the HTML.
    clock.html(clock_time).attr('title', clock_date);

    // Update every 60 seconds.
    desktop.clockTimeout = setTimeout(desktop.setClock, 60000);
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

desktop.ui.cards = {}
desktop.ui.cards.renderGbpCard = function renderGbpCard (message) {
  let currentValue = 'NO VALUE';
  if (message.card.value) {
    currentValue = `<em>ESTIMATED VALUE: ${desktop.utils.usdFormatSmall.format(message.card.value)}</em><br/>`;
  }
  if (message.card.action === 'got') {
    return `
      <div class="message pointsCard">
        <strong>${message.card.from} gave Good Buddy Points to ${message.card.to}</strong><br/>
        <strong>${desktop.utils.numberFormat.format(message.card.amount)} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `;
  } else {
    let balance = desktop.utils.numberFormat.format(message.card.balance);
    if (message.card.balance === 0) {
      balance = 'ZERO';
    }
    return `
      <div class="message pointsCard">
        <strong>${message.card.buddyname}</strong><br/>
        <strong>${balance} GOOD BUDDY POINTS</strong><br/>
        ${currentValue}
      </div>
      <br/>
    `;
  }

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
          <img class="emojiIcon" src="desktop/assets/images/icons/icon_${app.icon || appName}_64.png" />
          <span class="title">
            ${app.label || appName}
          </span>
        </a>
      </div>
    `);
  }
}

desktop.ui.renderDesktopShortCuts = function renderDesktopShortCuts () {
  $('.desktop-shortcuts-container').html('');
  for (let appName in desktop.settings.apps_installed) {
    let app = desktop.app.appstore.apps[appName];
    desktop.ui.renderDesktopShortCut(appName, app);
  }

  desktop.ui.renderDesktopShortCut('download', {
    name: 'download',
    href: 'https://github.com/marak/buddypond',
    label: 'Download Buddy Pond',
    icon: 'drive'
  });

  desktop.ui.renderDesktopShortCut('appstore', {
    name: 'appstore', label: 'App Store'
  });

  desktop.ui.renderDesktopShortCut('login', {
    name: 'login', label: 'Login', icon: 'login', class: 'loginIcon loginShortcut'
  });

  desktop.ui.renderDesktopShortCut('logout', {
    name: 'logout', label: 'Logout', icon: 'login', class: 'loggedIn logoutShortcut'
  });

  setTimeout(function(){
    desktop.ui.windowResizeEventHandler(true); // adjusts shortcut padding if needed
  }, 333)


}