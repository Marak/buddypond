/*

  Buddy Pond Desktop Client

*/

let desktop = {};
desktop.DEFAULT_AJAX_TIMER = 1000;

desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

// this scope should be openWindows instead of windowIdex
desktop.windowIndex = {};
desktop.openWindows = {
  buddy_message: {},
  pond_message: {}
};

// set default logger
desktop.log = console.log;

desktop.load = function loadDesktop() {

  $('.desktopConnected').hide();

  $('form').on('submit', function(){
    return false;
  });

  $('.logoutLink').hide();

  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);
  $('#window_login').show();
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);
  desktop.renderDockElement('login');

  $('.loginButton').on('click', function(){
    desktop.login.auth($('#buddyname').val());
  });

  $('.loginLink').on('click', function(){
    $('#window_login').show();
    $('#buddyname').focus();
  });

  $('.logoutLink').on('click', function(){
    document.location = 'index.html';
  });

  $('#logout_desktop_icon').hide();
}

desktop.refresh = function refreshDesktop () {
  desktop.updateBuddyList();
  desktop.updateMessages();
}

//
//
// desktop.openWindow() function is used to create instances of a window class
// this allows for multiple window instances to share the same logic
// as of today, windowType can be "buddy_message" or "pond_chat"
// this implies there are already HTML elements named window_buddy_message_0 and window_pond_chat_0
// these will be incremented by 1 for each window , etc window_buddy_message_1, window_buddy_message_2
// in the future we can have other windowTypes
// for most applications you won't need this method and you can just 
// use $(window_id).hide() or $(window_id).show() instead
//
//
desktop.windowPool = {}
desktop.windowPool['buddy_message'] = [];
desktop.windowPool['pond_chat'] = [];

desktop.openWindow = function openWindow (windowType, context, position) {

  let windowTypes = ['buddy_message', 'pond_chat']
  desktop.log('desktop.openWindow', windowType, context)

  desktop.openWindows = desktop.openWindows || {};
  desktop.openWindows[windowType] = desktop.openWindows[windowType] || {};

  desktop.windowIndex = desktop.windowIndex || {};
  desktop.windowIndex[windowType] = desktop.windowIndex[windowType] || {};

  let windowKey;

  if (desktop.openWindows[windowType][context]) {
    return desktop.openWindows[windowType][context];
  }

  if (desktop.windowIndex[windowType][context]) {
    let windowId = desktop.windowIndex[windowType][context];
    windowKey = '#' + windowId;
    console.log('reopening window id', windowId)
    // TODO: check to see if window is min, if so, open it from dock
    // desktop.renderDockElement(windowType + '_' + window_id, context);
    JQD.util.window_flat();
    $(windowKey).show().addClass('window_stack');
  } else {
    // TODO: max windows message
    windowKey = desktop.windowPool['buddy_message'].pop();
    if (!windowKey) {
      alert('Too many chat windows. Please close some windows.');
      return;
    }

    let windowId = '#' + windowKey;
    console.log('allocating window from pool', windowId)
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
    // for example: desktop.windowIndex['buddy_message']['Marak] = '#window_buddy_message_0';
    //
    desktop.windowIndex[windowType][context] = windowId;

    // render the bottom bar dock element
    desktop.renderDockElement(windowKey.replace('window_', ''), context);

    // a new window is being opened, figure out where it should be positioned next to
    // default position is next to the buddylist
    let openNextTo = "#window_buddylist";

    // gather all open buddy_messsage windows and find the first one
    // if the first one exists, assign that to open next to
    
    let first = Object.keys(desktop.openWindows.buddy_message)[0];
    if (desktop.openWindows.buddy_message[first]) {
      openNextTo = '#' + desktop.openWindows.buddy_message[first];
    } else {
      
    }
    console.log('first', first)
    console.log('openNextTo', openNextTo)

    position = position || {}
    position.my = position.my || "left top",
    position.at = position.at || 'right top',
    position.of = position.of || openNextTo

    console.log("using position", windowId, position)
    $(windowId).position(position);

  }

  // the window is now open ( either its new or it's been re-opened )
  // assign this window key into desktop.openWindows
  desktop.openWindows[windowType][context] = windowKey;

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
  }

  if (windowType === 'pond_chat') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.openWindows[windowType]))
  }

  return windowKey;
}

//
// desktop.closeWindow() function is used to close instanced windows
// in most cases you can just use $(window_id).hide()
// The current logic here is for ensuring subscribed buddies and pond lists
// are updated with the user closes the window in the UI
// This is to ensure UI is only polling for messages for windows that are actually open
//
desktop.closeWindow = function openWindow (windowType, context) {
  desktop.openWindows = desktop.openWindows || {};
  desktop.openWindows[windowType] = desktop.openWindows[windowType] || {};

  console.log('pushing window back into pool', desktop.openWindows[windowType][context])

  // Since the window is now closed, we can push it back into the windowPool,
  // based on it's windowType and context
  // for example: desktop.windowPool['buddy_message'].push(desktop.openWindows['buddy_message']['Marak'])
  desktop.windowPool[windowType].push(desktop.openWindows[windowType][context])

  // TODO: replace delete statements ???
  //
  // Remove the closed window from openWindows and windowIndex ( as it's no longer being tracked )
  //
  delete desktop.openWindows[windowType][context];
  delete desktop.windowIndex[windowType][context]

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
  }

  if (windowType === 'pond_chat') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.openWindows[windowType]))
  }
}

desktop.updateMessages = function updateMessages () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateMessages();
    }, 10);
  } else {

    //
    // first, calculate list of subscribed buddies and subscribed ponds
    //
    var subscribedBuddies = Object.keys(desktop.openWindows['buddy_message'])
    var subscribedPonds = Object.keys(desktop.openWindows['pond_message'])

    if (subscribedBuddies.length === 0 && subscribedPonds.length === 0) {
      setTimeout(function(){
        desktop.updateMessages();
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
    buddypond.getMessages(params, function(err, data){

      if (err) {
        throw err;
      }
      // console.log('buddypond.getMessages', err, data)

      //
      // once we have the messages data, call desktop.buddylist.updateMessages() 
      // to delegate message data to app's internal updateMessages() function
      //
      desktop.buddylist.updateMessages(data, function(err){

        if (err) {
          throw err;
        }

        //console.log('buddylist.updateMessages finished render', err)

        //
        // now that buddy messages have completed rendering, repeat the process for desktop.pond.updateMessages() 
        //
        // Remark: In the future we could iterate through all Apps .updateMessages() functions
        //         instead of having two hard-coded loops here
        desktop.pond.updateMessages(data, function(err){

          if (err) {
            throw err;
          }

          //console.log('pond.updateMessages finished render', err)

          //
          // All apps have completed rendering messages, set a timer and try again shortly
          //
          setTimeout(function(){
            desktop.updateMessages();
          }, desktop.DEFAULT_AJAX_TIMER);
        });
      });

    });
    return;
    // TODO: check if subscribers is empty for either, if so, don't call
  }
}

desktop.removeDockElement = function (windowType, context) {
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

desktop.renderDockElement = function (key, context) {
  console.log('rendering dock element', key, context)
  var dockElement = '#icon_dock_' + key;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}