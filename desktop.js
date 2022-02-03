
/*

  Buddy Pond Desktop Client

*/

let desktop = {};

desktop.buddyListDataCache = {};
desktop.buddyMessageCache = {};

desktop.windowIndex = {};

desktop.openChats = {};

desktop.MAX_CONSOLE_OUTPUT = 5;
desktop.DEFAULT_AJAX_TIMER = 1000;

desktop.log = function logDesktop () {
  let consoleItems = $('.console li').length;
  if (consoleItems > desktop.MAX_CONSOLE_OUTPUT) {
    $('.console li').get(0).remove();
    // $('.console').html(consoleContent);
  }
  let output = '';
  arguments[0] = '<span class="purple">' + arguments[0] + '</span>';
  for (let arg in arguments) {
    let str = arguments[arg];
    if (typeof str === 'object') {
      str = JSON.stringify(str, true, 2)
    }
    output += (str + ', '); 
  }
  output = output.substr(0, output.length - 2);
  let now = new Date();
  let dateString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  $('.console').append('<li>' + dateString + ': ' + output + '</li>');
  //let el = $('.console_holder')
  //$(el).scrollTop($(el).scrollHeight);
}

desktop.load = function loadDesktop() {
  // desktop.loadYoutubeEmbeds();

  // clone window_buddy_message_0 ten times
  // clone icon_dock_buddy_message_0 ten times 
  // this creates 10 windows available for chatting with buddies
  let clone = $('#window_buddy_message_0').html();
  let dockItemClone = $('#icon_dock_buddy_message_0').html();

  for (let i = 1; i<11; i++) {
    let buddyChatStr = '<div id="window_buddy_message_' + i +'" class="abs window buddy_message" data-window-index="' + i + '">' + clone.replace('icon_dock_buddy_message_0', 'icon_dock_buddy_message_' + i) + '</div>'
    $('#desktop').append(buddyChatStr);
    let dockStr = dockItemClone.replace('window_buddy_message_0', 'window_buddy_message_' + i)
    dockStr = '<li id="icon_dock_buddy_message_' + i +'">' + dockStr + '</li>'
    $('#desktop').append(buddyChatStr);
    $('#dock').append(dockStr);
  }

  $('.logoutLink').hide();

  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);

  $('#window_login').show();
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);

  $('#window_mtv').css('width', 644);
  $('#window_mtv').css('height', 666);

  $('#window_interdemoncable').css('width', 644);
  $('#window_interdemoncable').css('height', 666);

  $('#window_interdemoncable').css('left', 777);
  $('#window_interdemoncable').css('top', 30);

  desktop.renderDockElement('login');

  $('#buddyname').focus();

  $('form').on('submit', function(){
    return false;
  });

  $('.loginButton').on('click', function(){
    desktop.auth($('#buddyname').val());
  });

  $('.sendBuddyMessage').on('click', function(){
    desktop.sendBuddyMessage(this)
  });

  $('.sendBuddyRequest').on('click', function(){
    var buddyName = $('.buddy_request_name').val();
    $('.buddy_request_name').val('');
    desktop.log('buddypond.addBuddy ->', buddyName)
    buddypond.addBuddy(buddyName, function(err, data){
      desktop.log('buddypond.addBuddy <-', data)
      console.log("buddypond.addBuddy returns", err, data);
      console.log(err, data)
    });
  });

  $('.loginLink').on('click', function(){
    $('#window_login').show();
    $('#buddyname').focus();
  });

  $('.logoutLink').on('click', function(){
    document.location = 'index.html';
  });

  $('.inviteBuddy').on('click', function(){
    alert('TODO: Add Import Buddies from Twitter feature');
    return false;
  });

  $('.ponderMTV').on('click', function(){
    desktop.playRandomVideo(mtvPlayer, desktop.ytPlaylist);
  });

  $('.ponderInterdemoncable').on('click', function(){
    desktop.playRandomVideo(interDemonCableplayer, desktop.interdemoncable);
  });

  $('.buddy_message_text').bind("enterKey",function(e){
    desktop.sendBuddyMessage(this)
  });

  $('.buddy_message_text').keyup(function(e){
      if (e.shiftKey==1) {
        return false;
      }
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });
  $('.buddyListHolder').hide();
  $('#logout_desktop_icon').hide();
}

desktop.refresh = function refreshDesktop () {

  desktop.updateBuddyList();
  desktop.updateMessages();
}

desktop.openWindow = function openWindow (windowType, context) {
  
  desktop.openChats[context] = true;
  if (desktop.windowIndex[context]) {
    let window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('reopen window id', window_id)
    // TODO: check to see if window is min, if so, open it from dock
    // $('#window_buddy_message_' + window_id).show();
    let chat_window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('chat_window_id', chat_window_id)

    desktop.renderDockElement('buddy_message_' + chat_window_id, context);
    JQD.util.window_flat();
    $('#window_buddy_message_' + window_id).show().addClass('window_stack');
  } else {
    var windowKey = '#window_buddy_message_' + Object.keys(desktop.windowIndex).length;
    console.log('showing window', windowKey)
    $('.window-context-title', windowKey).html(context);

    //JDQX.openWindow($(windowKey));
    $(windowKey).show();
    $(windowKey).css('width', 600)
    $(windowKey).css('height', 440)

    desktop.windowIndex[context] = windowType;

    let chat_window_id = Object.keys(desktop.windowIndex).indexOf(context);
    console.log('chat_window_id', chat_window_id)

    desktop.renderDockElement('buddy_message_' + chat_window_id, context);

    $('.buddy_message_to', windowKey).val(context)

    // TODO: buddypond.me
    $('.buddy_message_from', windowKey).val(buddypond.me);

    let rightPadding = chat_window_id * 10;
    let topPadding = chat_window_id * 10;
    // TODO: dynamic position, pick a spot
    $(windowKey).position({
      my: "left top",
      at: 'right+' + rightPadding + ' top+' + topPadding,
      of: "#window_buddylist"
    });

  }

}

desktop.auth = function authDesktop (buddyname) {
  desktop.log('buddypond.authBuddy ->', buddyname);
  $('#buddypassword').removeClass('error');
  buddypond.authBuddy(buddyname, $('#buddypassword').val(), function(err, data){
    console.log("Buddy pond api returns", err, data);

    if (err) {
      alert('server is down. please try again in a moment.');
      return;
    }

    if (data === false) {
      $('#buddypassword').addClass('error');
      return;
    }
    $('#me_title').html('Welcome - ' + buddyname);
    $('.logoutLink').show();
    $('.loginLink').hide();

    desktop.log('buddypond.authBuddy <-', data);
    $('.console').val()
    $('.qtokenid').val(data);
    if (data === false) {
      // TODO: alert UI, try again
    } else {
      buddypond.qtokenid = data;
      $('#window_login').hide();
      $('#login_desktop_icon').hide();
      $('#logout_desktop_icon').show();
      $('#window_buddylist').show();
      $('#window_buddylist').css('width', 220)
      $('#window_buddylist').css('height', 440)
      $('#window_buddylist').css('left', 666)
      $('#window_buddylist').css('top', 111)
      desktop.renderDockElement('buddylist');
      desktop.removeDockElement('login')
    }
    console.log(err, data)
  });
}

desktop.sendBuddyMessage = function sendBuddyMessage (context) {
  let message = {};
  var form = $(context).parent();
  message.text = $('.buddy_message_text', form).val();
  message.to = $('.buddy_message_to', form).val();
  message.from = $('.buddy_message_from', form).val();
  if (message.text.trim() === "") {
    return;
  }

  console.log('send the buddy message', message);
  // TODO: have console display more info about event
  $('.console').val(JSON.stringify(message, true, 2));

  // empty text area input
  $('.buddy_message_text', form).val('');
  buddypond.sendMessage(message.to, message.text, function(err, data){
    console.log("buddypond.sendMessage returns", err, data);
    console.log(err, data)
  });
}

desktop.updateBuddyList = function updateBuddyList () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateBuddyList();
    }, 10);
  } else {
    desktop.log('buddypond.getBuddyList -> ' + buddypond.me);
    // update buddylist html
    $('.buddy_list_not_connected').hide();
    $('.buddyListHolder').show();
    buddypond.getBuddyList(function(err, data){
      if (err) {
        desktop.log(err);
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
        return;
      }
      let str = JSON.stringify(data);
      desktop.log('buddypond.getBuddyList <-', str);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyListDataCache[str]) {
        setTimeout(function(){
          desktop.updateBuddyList();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }

      if (data.buddylist.length > 0) {
        $('.you_have_no_buddies').hide();
      }
      // a buddy request counts as a buddy in UX ( for now )
      if (Object.keys(data.buddyrequests).length > 0) {
        $('.you_have_no_buddies').hide();
      }
      $('.buddylist').html('');
      $('.loading').remove();
      if (data.buddylist) {
        if (data.buddylist.length === 0) {
          $('.buddylist').html('No buddies yet');
        } else {
          desktop.buddyListDataCache[str] = true;
          data.buddylist.forEach(function(buddy){
            $('.buddylist').append('<li><a class="messageBuddy" href="#">' + buddy + '</a></li>')
          })
          $('.apiResult').val(JSON.stringify(data, true, 2))
          // render buddy list
          $('.messageBuddy').on('click', function(){
            let context = $(this).html();
            desktop.openWindow('chat', context)
          });
        }
      }

      if (data.buddyrequests) {

        // desktop.buddyListDataCache[str] = true;
        $('.pendingIncomingBuddyRequests').html('');
        $('.pendingOutgoingBuddyRequests').html('');
        $('.loading').remove();

        for (let buddy in data.buddyrequests) {
          let buddyrequest = data.buddyrequests[buddy];
          // console.log('buddyrequest', buddy, buddyrequest)
          buddyrequest = JSON.parse(buddyrequest);
          // TODO: top list is buddies, button list is requests ( with buttons )
          if (buddyrequest.to === buddypond.me) {
            $('.pendingIncomingBuddyRequests').append('<li>' + buddyrequest.from + ' - <a href="#" class="approveBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Approve</a> / <a href="#" class="denyBuddyRequest pointer" data-buddyname="' + buddyrequest.from +'">Deny</a> </li>')
          } else {
            $('.pendingOutgoingBuddyRequests').append('<li>' + buddyrequest.to + '</li>')
          }
        }

        $('.apiResult').val(JSON.stringify(data, true, 2))

        if ($('.pendingIncomingBuddyRequests li').length == 0) {
          $('.pendingIncomingBuddyRequestsHolder').hide();
        } else {
          $('.pendingIncomingBuddyRequestsHolder').show();
        }

        if ($('.pendingOutgoingBuddyRequests li').length == 0) {
          $('.pendingOutgoingBuddyRequestsHolder').hide();
        } else {
          $('.pendingOutgoingBuddyRequestsHolder').show();
        }

        // TODO: remove links in real-time from client for approve / deny ( no lags or double clicks )
        $('.denyBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          $(this).parent().hide();
          buddypond.denyBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });

        $('.approveBuddyRequest', '.pendingIncomingBuddyRequests').on('click', function(){
          $(this).parent().hide();
          buddypond.approveBuddy($(this).attr('data-buddyname'), function(err, data){
            $('.apiResult').val(JSON.stringify(data, true, 2))
          });
          return false;
        });
      }

      setTimeout(function(){
        desktop.updateBuddyList();
      }, desktop.DEFAULT_AJAX_TIMER);

    });

  }

}

desktop.updateMessages = function updateMessages () {

  if (!buddypond.qtokenid) {
    // no session, wait five seconds and try again
    setTimeout(function(){
      desktop.updateMessages();
    }, 10);
  } else {
    var subscribedBuddies = Object.keys(desktop.openChats)
    if (subscribedBuddies.length === 0) {
      setTimeout(function(){
        desktop.updateMessages();
      }, 10);
      return;
    }
    // console.log('subscribedBuddies', subscribedBuddies.toString())
    desktop.log('buddypond.getMessages ->', subscribedBuddies.toString());
    buddypond.getMessages(subscribedBuddies.toString(), function(err, data){

      if (err) {
        desktop.log(err);
        setTimeout(function(){
          desktop.updateMessages();
        }, desktop.DEFAULT_AJAX_TIMER); // TODO: expotential backoff algo
        return;
      }

      desktop.log('buddypond.getMessages <-', data);

      let str = JSON.stringify(data);
      // TODO: use key count for garbage collection and trim if size grows
      if (desktop.buddyMessageCache[str]) {
        setTimeout(function(){
          desktop.updateMessages();
        }, desktop.DEFAULT_AJAX_TIMER);
        return;
      }
      //console.log('Rendering Messages List');
      //console.log(data)
      // $('.buddylist').html('');
      desktop.updateMessages[str] = true;
      let html = {};

      // TODO: this should apply per conversation, not global for all users
      if (data.messages.length === 0) {
        $('.chat_messages').hide();
      } else {
        $('.no_chat_messages').hide();
        $('.chat_messages').show();
      }

      data.messages.forEach(function(message){
        var keys = Object.keys(desktop.openChats);
        // get context window index
        let buddyKey = message.from;
        if (buddyKey === buddypond.me) {
          buddyKey = message.to;
        }
        let index = keys.indexOf(buddyKey);
        var windowKey = '#window_buddy_message_' + index;

        //console.log('writting message to ', windowKey, message)
        html[windowKey] = html[windowKey] || '';
        
        if (message.from === buddypond.me) {
          html[windowKey] += '<span class="datetime">' + message.ctime + ' </span><span>' + message.from + ': ' + message.text + '</span><br/>';
        } else {
          html[windowKey] += '<span class="datetime">' + message.ctime + ' </span><span class="purple">' + message.from + ': ' + message.text + '</span><br/>';
        }
      });

      for (let key in html) {
        $('.chat_messages', key).html('');
        $('.chat_messages', key).append(html[key]);
        // scrolls to bottom of messages on new messages
        let el = $('.chat_messages', key)
        $(el).scrollTop($(el)[0].scrollHeight);
      }

      setTimeout(function(){
        desktop.updateMessages();
      }, desktop.DEFAULT_AJAX_TIMER);
      
    });

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

desktop.renderDockElement = function (windowType, context) {
  var dockElement = '#icon_dock_' + windowType;
  if ($(dockElement).is(':hidden')) {
    $(dockElement).remove().appendTo('#dock');
    $(dockElement).show('fast');
  }
  if (context) {
    $('.dock_title', dockElement).html(context);
  }
}

desktop.playRandomVideo = function playRandomVideo(_player, playlist) {

  let keys = playlist;
  let key =   keys[Math.floor(Math.random() * keys.length)];

  if (_player) {
    let yt_id = key;
    desktop.log('Playing Youtube ID: ', yt_id)
    _player.loadVideoById(yt_id);
    setTimeout(function(){
      if (_player.play) {
        _player.play();
      }
    }, 5000)
    // CURRENT_VIDEO_URL = result.youtube.url;
  }
};

desktop.loadYoutubeEmbeds = function loadYoutubeEmbeds () {


};


let interDemonCableplayer, mtvPlay;

// Remark: youtube embed client REQUIRES the following methods be public
// TODO: better control and exports of pubic methods here to desktop
function onPlayerReady(event) {
  // event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(mtvPlayer, desktop.ytPlaylist)
  }
}
function stopVideo() {
  mtvPlayer.stopVideo();
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady2(event) {
  // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange2(event) {
  if (event.data == 0) {
    desktop.playRandomVideo(interDemonCableplayer, desktop.interdemoncable)
  }
}
function stopVideo2() {
  interDemonCableplayer.stopVideo();
}

function onYouTubeIframeAPIReady() {

  mtvPlayer = new YT.Player('mtvPlayer', {
    height: '390',
    width: '640',
    videoId: 'rZhbnty03U4',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    host: 'http://www.youtube.com',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    origin: window.document.location.origin
  });

  interDemonCableplayer = new YT.Player('interDemonCableplayer', {
    height: '390',
    width: '640',
    videoId: 'rZhbnty03U4',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    host: 'http://www.youtube.com',
    events: {
      'onReady': onPlayerReady2,
      'onStateChange': onPlayerStateChange2
    },
    origin: window.document.location.origin
  });
}
