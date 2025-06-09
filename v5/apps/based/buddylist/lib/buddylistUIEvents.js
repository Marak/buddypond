export default function buddylistUIEvents() {
  let api = this.bp.apps.client.api;
  let affirmations = this.bp.apps.affirmations.affirmations;

  // bind events
  $('.loginForm').submit((e) => {
    e.preventDefault();

    // disable the login button
    $('.loginButton').prop('disabled', true);
    $('.loginButton').addClass('disabled');

    let username = $('.loginForm input[name="username"]').val();
    let password = $('.loginForm input[name="password"]').val();
    if (!password) {
      password = username;
    }

    api.authBuddy(username, password, function (err, result) {
      console.log('authBuddy', err, result);
      if (err) {
        if (result && result.error) {
          $('.loginStatus').html(result.error);
          if (result.error === 'Incorrect password.') {
            $('.resetPasswordLink').show();
          }
        } else {
          if (err.message === 'Failed to fetch') {
            $('.loginStatus').text('Failed to connect to Buddy Pond');
          } else {
            $('.loginStatus').html(err.message || 'Failed to authenticate buddy');
          }
        }
        $('.loginButton').prop('disabled', false);
        $('.loginButton').removeClass('disabled');

        $('.password').show();
        console.error('Failed to authenticate buddy:', err);

        return;
      }
      if (result.success) {
        // attempt to connect for events after getting auth token
        //console.log('connecting with valid qtokenid', api.qtokenid);
        result.me = username;
        // The user has logged in password or signed up successfully, emit the auth event
        bp.emit('auth::qtoken', result);
        // $('.loggedIn').flexShow();
        $('.loginForm .error').text('');

      } else {
        // re-enable the login button
        $('.loginButton').prop('disabled', false);
        $('.loginButton').removeClass('disabled');
        if (username === password) {
          $('.password').show();
          $('.password').focus();
          return;
        }
        $('.loginForm .error').text('Failed to authenticate buddy');
        $('.password').show();
        console.error('Failed to authenticate buddy:');
      }
    });
    return false;
  });

  $('.onlineStatusSelect').change((e) => {
    let status = $(e.target).val();
    console.log('status', status);
    bp.emit('profile::status', status);
  });

  $('.forgot-password').on('click', (ev) => {
    $('.loginForm').flexHide();
    $('.forgot-password-modal').flexShow();
    $('.tos-checkbox').flexHide();
    $('.loginStatus').html('');
    $('.resetPasswordLink').flexHide();
  });

  $('.closeForgotPassword').on('click', (ev) => {
    $('.forgot-password-modal').flexHide();
    $('.loginForm').flexShow();
    $('.tos-checkbox').flexShow();
    $('.resetPasswordLink').flexShow();
  });

  $('.resetPasswordButton').on('click', (ev) => {
    ev.preventDefault();
    let email = $('.resetPasswordEmail').val();
    if (!email) {
      $('.resetPasswordEmail').addClass('error');
      return;
    }
    $('.resetPasswordEmail').removeClass('error');
    $('.loginStatus').html('Sending password reset email...');

    api.sendPasswordResetEmail(email, (err, data) => {
      console.log('sendPasswordResetEmail', err, data);
      if (err || !data.success) {
        $('.loginStatus').html('Failed to send password reset email.');
        console.error(err || data);
        return;
      }
      $('.loginStatus').removeClass('error').html(data.message);
    });
  });

  $('.buddylist').click((e) => {
    // check if element has a data-buddy attribute
    if (!$(e.target).closest('.buddy-message-sender').data('buddy')) {
      return
    }
    let buddyname = $(e.target).closest('.buddy-message-sender').data('buddy');
    console.log('message-buddy', buddyname);
    this.openChatWindow({ name: buddyname });
  });

  // Send a buddy request form
  $('.sendBuddyRequest').on('click', (ev) => {
    ev.preventDefault();
    let buddyName = $('.buddy_request_name').val();
    if (!buddyName) {
      $('.buddy_request_name').addClass('error');
      return;
    }

    $('.you_have_no_buddies').html('Buddy Request Sent!');
    $('.buddy_request_name').removeClass('error');
    $('.buddy_request_name').val('');
    // $('.pendingOutgoingBuddyRequests').append('<li>' + buddyName + '</li>');
    this.bp.log('buddypond.addBuddy ->', buddyName);

    this.client.addBuddy(buddyName, (err, data) => {
      console.log('buddypond.addBuddy <-', err, data);
      if (data.error) {
        $('.you_have_no_buddies').html(data.error);
        console.error(data);
        return;
      }
      if (!data.success) {
        $('.you_have_no_buddies').html(data.message)
        console.error(data);
        return;
      }
      this.bp.log('buddypond.addBuddy <-', data);
    });

  });

  // Initially disable the login button
  $('.loginButton').prop('disabled', true);
  $('.loginButton').addClass('disabled');

  // Toggle the login button based on the checkbox status
  $('#tosAgree').change(function () {
    if ($(this).is(':checked')) {
      $('.loginButton').prop('disabled', false);
      $('.loginButton').removeClass('disabled');
    } else {
      $('.loginButton').prop('disabled', true);
      $('.loginButton').addClass('disabled');
    }
  });

  /*
  // TODO: create context meny for buddy-message-sender
  $(document).on('click', (e) => {
    // delegate based on if e.target is a .buddy-message-sender
    // if so, open profile for that buddy
    //alert(e.target.classList)
    if ($(e.target).hasClass('buddy-message-sender')) {
      alert('buddy-message-sender');
      let buddyName = $(e.target).text();
      if (this.bp.admin) {
        // roles are handled server-side, this is a simple UI route for the implied role access
        // loading admin-profile from another user won't return admin data
        this.bp.open('admin-profile', { context: buddyName });
      } else {
        // this.bp.open('user-profile', { context: buddyName });
      }
    }
  });
  */

  // Append a custom context menu to the body (hidden initially)
  // $('body').append('<div id="customContextMenu" class="removeMessage" style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #ccc; padding: 10px;">Remove Message</div>');

  // Right-click event on elements with class .buddy-message-sender
  /*
  $(document).on('contextmenu', function (e) {

    if (!$(e.target).hasClass('buddy-message-sender')) {
      return true;
    }

    e.preventDefault(); // Prevent default context menu
    let chatMessage = $(e.target).closest('.chatMessage'); // Get the chat message element
    console.log('using chatMessage', chatMessage.html());
    if (api.me !== 'Marak') { // could also allow users to remove their own messages
       // set the removeMessage to disabled class
      $('#customContextMenu').addClass('disabled');
    }

    let from = chatMessage.attr('data-from');
    let to = chatMessage.attr('data-to');
    let uuid = chatMessage.attr('data-uuid');
    let type = chatMessage.attr('data-type');

    console.log('type', type, 'from', from, 'uuid', uuid);

    // Position the custom context menu at the mouse coordinates
    $('#customContextMenu').css({
      top: e.pageY + 'px',
      left: e.pageX + 'px',
      display: 'block'
    });

    $('#customContextMenu').off('click').on('click', async () => {
      // Replace 'openProfile' with your actual function to open the profile
      //openProfile(buddyName);

      let context = to;

      await api.removeMessage({type, from, to, uuid});
      // $(this).hide(); // Hide the context menu after click
    });
  });
  */

  // Hide context menu when clicking anywhere else on the document
  /*
  $(document).on('click', function (e) {
    if (!$(e.target).hasClass('buddy-message-sender')) {
      $('#customContextMenu').hide();
    }
  });
  */

  // Invite a buddy link ( opens twitter with a random message )
  $('.inviteBuddy').on('click', () => {
    let randomInviteMessages = [
      `Find me as "${this.bp.me}" on https://buddypond.com and let's start a conversation that could last a lifetime.`,
      `I've taken my conversations to the cloud! Reach me at "${this.bp.me}" on https://buddypond.com where the future of messaging unfolds.`,
      `Wave goodbye to the old and hello to the old! I'm waiting at "${this.bp.me}" on https://buddypond.com. Let's catch up!`,
      `Missing chat sessions? They're back and better than ever at "${this.bp.me}" on https://buddypond.com. Join me and let's reconnect!`,
      `Taking conversations to the next level. Find me at "${this.bp.me}" on https://buddypond.com and let's dive into new topics together!`,
      `Remember the ease of old-school messaging? Experience it again with a twist! I'm "${this.bp.me}" at https://buddypond.com. Chat soon?`,
      `I'm charting new territories in the world of digital communication. Join me as "${this.bp.me}" on https://buddypond.com and let's explore together!`,
      `Just like the good old days but better! Find me on "${this.bp.me}" at https://buddypond.com and let's keep the conversations flowing.`,
    ];
    let inviteMessage = randomInviteMessages[Math.floor(Math.random() * randomInviteMessages.length)];
    window.open(`https://twitter.com/intent/tweet?url=${inviteMessage}`);
    return false;
  });

  function updatePositiveAffirmation() {
    let key = affirmations[Math.floor(Math.random() * affirmations.length)];
    $('.positiveAffirmation').html(key);
  }

  // update the positive affirmation on an interval
  setInterval(function () {
    $('.positiveAffirmation').fadeOut({
      duration: 4444,
      complete: function () {
        updatePositiveAffirmation();
        $('.positiveAffirmation').fadeIn({
          duration: 4444,
          complete: function () { }
        });
      }
    });
  }, 199800); // 3 minutes, 33 seconds

  updatePositiveAffirmation();

  $('.positiveAffirmation').on('click', function () {
    updatePositiveAffirmation();
  });


}