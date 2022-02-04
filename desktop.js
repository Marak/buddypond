
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

  $('.logoutLink').hide();

  $('#window_login').css('width', 800);
  $('#window_login').css('height', 400);

  $('#window_login').show();
  $('#window_login').css('left', 222);
  $('#window_login').css('top', 111);

  desktop.renderDockElement('login');

  $('form').on('submit', function(){
    return false;
  });

  $('.loginButton').on('click', function(){
    desktop.auth($('#buddyname').val());
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

// let interDemonCableplayer, mtvPlayer;
