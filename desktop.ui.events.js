/* desktop.ui.events.js - Legacy BP Desktop UI Event Handlers */
/* Being phased out in favor of bp.js v5 */
/* This entire file will be removed in v6 */

jQuery(document).ready(function () {
  // binds the event handlers as soon as the document is ready according to jQuery
  JQDX.bindDocumentEventHandlers();
  // JQDX.frame_breaker();
});

JQDX.bindDocumentEventHandlers = function bindDocumentEventHandlers () {

  let d = $(document);

  d.on('keydown', function (event) {
    if (event.key == 'Escape') {
      // find active open window and close it
      let topWindow = $('.window_stack').attr('id');
      JQDX.closeWindow('#' + topWindow);
    }
    // "`" key
    if (event.which == 192 ) {
      //desktop.ui.openWindow('console');
      //return false;
    }
    /*
    if (event.which == 77 && event.ctrlKey) {
      alert('toggle spotlight')
    }
    */
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

  // TODO: seperate core events from features
  // core events are related only to windowing, layout, icons
  // maybe just move all events first
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

  d.on('click', '.setFullscreen', function (ev) {
    JQDX.openFullscreen($('body').get(0))
    return false;
  });

  d.on('click', '.hideAllWindows', function (ev) {
    desktop.ui.displayMode = 'min';
    // If any windows are visible, hide all.
    $('div.window').hide();
    return false;
  });

  d.on('click', '.setWindowAsWallpaper', function (ev) {
    if (!desktop.ui.wallpaperWindow) {
      desktop.ui.wallpaperWindow = true;
      desktop.ui.removeWindowWallpaper()
      desktop.ui.setActiveWindowAsWallpaper();
      $('.setWindowAsWallpaper').html('Remove Window as Wallpaper');
    } else {
      desktop.ui.wallpaperWindow = false;
      desktop.ui.removeWindowWallpaper();
      $('.setWindowAsWallpaper').html('Set Active Window to Wallpaper');
    }
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

  // TODO: move event handlers to appropiate apps ( messages.js )
  // Click remix paint icon to remix images in Paint App
  d.on('mousedown', 'img.remixPaint, img.remixMeme', function () {

    
    let form = $(this).parent();
    let url = $('.image', form).attr('src');
    let output = $(this).data('output');
    let context = $(this).data('context');


    let cardContainer =  $(this).parent().parent();
    console.log('cardContainer', cardContainer);
    url = $('.snap-image', cardContainer).attr('src');
    url = buddypond.host + url;
    console.log('remixPaint', url, output, context);

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



    let cardContainer =  $(this).parent().parent();
    console.log('cardContainer', cardContainer);
    url = $('.snap-image', cardContainer).attr('src');
    url = buddypond.host + url;
    console.log('remixGif', url, output, context);



    // -1 or undefined as frame index indicates create new gif
    desktop.ui.openWindow('gifstudio', {
      src: url,
      output: output,
      context: context,
      frameIndex: desktop.app.gifstudio.currentFrameIndex || 0
    });
    JQDX.window_front('#window_gifstudio');
    ev.preventDefault();
    ev.stopPropagation();
  });

  // App icons are double click on to open on desktop
  // Remark: Switched to single click by default
  let eventName = 'click';

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
    // New v5 API
    // TODO: remove this, use a unique class name for bp?
    // anything to separate code paths
    if (appName === 'buddylist') {
      bp.open('buddylist');
      return;
    }
    if (appName === 'pond') {
      bp.open('pond');
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


  // Apply the draggable functionality to icons
  d.on('mouseenter', 'div.icon', function () {
    //var $this = $(this);
    //$this.off('mouseenter'); // Ensure this only runs once per element
    //makeSimpleDraggable($this);
  });
  
  // to build a contextmenu like this add this to your html (styles are applied globally):
  // <div id="your context menu id" class="context-menu" style="display: none">
  //   <ul id="your context list id" class="context-list"></ul>
  // </div>
  /*
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
  */

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
    console.log( $(this).attr('id'))
    // manually click the window to trigger v5 bridge code to focus
    desktop.emit('window::dragstart', { windowId: '#' + $(this).attr('id') });

  });

  // Make windows draggable.
  d.on('mouseenter', 'div.window', function () {

    $(this).off('mouseenter').draggable({
      // Confine to desktop.
      // Movable via top bar only.
      cancel: 'a',
      containment: 'parent',
      handle: 'div.window_top',
      start: function () {
       //  desktop.emit('window::dragstart', { windowId: '#' + $(this).attr('id') });
      },
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
        desktop.emit('window::dragged', { windowId, appName, context });
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