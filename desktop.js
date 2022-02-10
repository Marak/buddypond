/*

  Buddy Pond Desktop Client

*/

let desktop = {};
// time the desktop object was created in browser
desktop.ctime = new Date();

// default timeout between AJAX requests ( 3 seconds )
desktop.DEFAULT_AJAX_TIMER = 3000;

// keep a cache object for buddylist data and messages to prevent re-renders
// this is garbage collected on every updated run, so it should never grow
desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

// messages are processed locally by unique uuid
// processedMessage[] is used to stored message ids which have already been processed by Desktop Client
desktop.processedMessages = [];

// windowIndex is used to keep track of all created windows
desktop.windowIndex = {};

// openWindows is used to keep track of currently open windows
desktop.openWindows = {
  buddy_message: {},
  pond_message: {}
};

// windowPool is used to keep track of pre-created windows
desktop.windowPool = {}
desktop.windowPool['buddy_message'] = [];
desktop.windowPool['pond_message'] = [];


// set the default desktop.log() method to use console.log
desktop.log = console.log;

// calling desktop.load() will start the Buddy Pond Desktop Client
desktop.load = function loadDesktop() {

  // cancel all form submits
  $('form').on('submit', function(){
    return false;
  });

  // if user clicks login button, attempt to auth with server
  $('.loginButton').on('click', function(){
    desktop.login.auth($('#buddyname').val());
  });

  // if user clicks on top left menu, focus on login form
  $('.loginLink').on('click', function(){
    $('#window_login').show();
    $('#buddyname').focus();
  });

  // if user clicks logout link on top left menu, logout the user
  $('.logoutLink').on('click', function(){
    desktop.login.logoutDesktop()
  });

}

desktop.refresh = function refreshDesktop () {
  desktop.updateBuddyList();
  desktop.updateMessages();
}

//
//
// desktop.openWindow() function is used to create instances of a window class
// this allows for multiple window instances to share the same logic
// as of today, windowType can be "buddy_message" or "pond_message"
// this implies there are already HTML elements named window_buddy_message_0 and window_pond_message_0
// these will be incremented by 1 for each window , etc window_buddy_message_1, window_buddy_message_2
// in the future we can have other windowTypes
// for most applications you won't need this method and you can just 
// use $(window_id).hide() or $(window_id).show() instead
//
//

desktop.openWindow = function openWindow (windowType, context, position) {

  let windowTypes = ['buddy_message', 'pond_message']
  desktop.log('desktop.openWindow', windowType, context)

  desktop.openWindows = desktop.openWindows || {};
  desktop.openWindows[windowType] = desktop.openWindows[windowType] || {};

  desktop.windowIndex = desktop.windowIndex || {};
  desktop.windowIndex[windowType] = desktop.windowIndex[windowType] || {};

  let windowKey;

  if (desktop.openWindows[windowType][context]) {
    console.log('window already open, doing nothing', desktop.openWindows[windowType][context])
    // if the window is open and not visible, it means it is minimized
    let el = ('#' + desktop.openWindows[windowType][context]);
    let dockEl = ('#' + desktop.openWindows[windowType][context]).replace('window_', 'icon_dock_');
    if (!$(el).is(':visible')) {
      $('.dock_title', dockEl).addClass('rainbow');
    } else {
      $('.dock_title', dockEl).removeClass('rainbow');
    }
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
    windowKey = desktop.windowPool[windowType].pop();
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
    
    if (windowType === 'buddy_message') {

      // TODO: move this to buddylist.openWindow function
      $('.buddy_message_text', windowId).focus();
      $('.buddy_message_to', windowId).val(context)
      $('.buddy_message_from', windowId).val(buddypond.me);
      desktop.buddylistProfileState.updates["buddies/" + context] = desktop.buddylistProfileState.updates["buddies/" + context] || {};
      desktop.buddylistProfileState.updates["buddies/" + context].newMessages = false;
    }

  }

  // the window is now open ( either its new or it's been re-opened )
  // assign this window key into desktop.openWindows
  desktop.openWindows[windowType][context] = windowKey;

  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
  }

  if (windowType === 'pond_message') {
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



  if (windowType === 'buddy_message') {
    desktop.log('Subscribed Buddies: ', Object.keys(desktop.openWindows[windowType]))
    // remove newMessages notification for this buddy
    // TODO: move this to buddylist.closeWindw()
    desktop.buddylistProfileState.updates["buddies/" + context] = desktop.buddylistProfileState.updates["buddies/" + context] || {};
    desktop.buddylistProfileState.updates["buddies/" + context].newMessages = false;
    $('.chat_messages', '#' + desktop.openWindows[windowType][context]).html('');
  }

  if (windowType === 'pond_message') {
    desktop.log('Subscribed Ponds: ', Object.keys(desktop.openWindows[windowType]))
  }

  // TODO: replace delete statements ?
  //
  // Remove the closed window from openWindows and windowIndex ( as it's no longer being tracked )
  //
  delete desktop.openWindows[windowType][context];
  delete desktop.windowIndex[windowType][context];

}

//
// desktop.updateMessages() queries the server for new messages and then
// delegates those messages to any applications which expose an App.updateMessaegs() function 
// currently hard-coded to pond, and buddylist apps. Can easily be refactored and un-nested.
//
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
    // console.log('calling, buddylist.getMessages', params);
    buddypond.getMessages(params, function(err, data){
      // console.log('calling back, buddylist.getMessages', err, data);
      if (err) {
        console.log('error in getting messages', err)
        // if an error has occured, give up on processing messages
        // and retry again shortly
        setTimeout(function(){
          desktop.updateMessages();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }
      // console.log('buddypond.getMessages', err, data)
      let newMessages = [];
      data.messages.forEach(function(message){
        if (desktop.processedMessages.indexOf(message.uuid) === -1) {
          newMessages.push(message)
        }
      });

      // console.log(data.messages.length, ' messages came in');
      // console.log(newMessages.length, ' are being rendered');

      //
      // Filter out any messaages which have already been processed by uuid
      // The deskop UX will only process each message once as to not re-render / flicker elements and message events
      

      data.messages = newMessages;
      
      // TODO: call all update message functions that are available instead of hard-coded list

        //
        // once we have the messages data, call desktop.buddylist.updateMessages() 
        // to delegate message data to app's internal updateMessages() function
        //
        // console.log('calling, buddylist.updateMessages');
        desktop.buddylist.updateMessages(data, function(err){
          // console.log('calling back, buddylist.updateMessages');
          if (err) {
            throw err;
          }

          //console.log('buddylist.updateMessages finished render', err)

          //
          // now that buddy messages have completed rendering, repeat the process for desktop.pond.updateMessages() 
          //
          // Remark: In the future we could iterate through all Apps .updateMessages() functions
          //         instead of having two hard-coded loops here
          // console.log('calling, pond.updateMessages');
          desktop.pond.updateMessages(data, function(err){
            // console.log('calling back, pond.updateMessages');
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

// TODO: implement these methods
desktop.renderDockIcon = function () {}; // creates icon for dock bar ( min / max )
desktop.renderDesktopIcon = function () {}; // creates desktop icon ( double click to start app )
desktop.renderWindow = function () {};   // creates new "#window_foo" DOM elements ( single instance, not openWindow() )

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
  var dockElement = '#icon_dock_' + key;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}