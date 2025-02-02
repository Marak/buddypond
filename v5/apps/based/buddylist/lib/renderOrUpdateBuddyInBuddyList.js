export default function renderOrUpdateBuddyInBuddyList(data) {

  console.log('renderOrUpdateBuddyInBuddyList', data);
  let bp = this.bp;
  let buddyname = data.name;
  let buddydata = data.profile;
  console.log('buddydata', buddydata)
  //console.log(buddydata.isConnected, buddyname, buddydata);


  // 1/10/25 - Legacy guard for when isConnected was not a boolean
  //           Can remove this after a few releases 
  if (buddydata.ctime > buddydata.dtime) {
    buddydata.isConnected = false;
  }

  if (buddydata.status === 'online') {
    buddydata.isConnected = true;
  }

  let connectedStatusIcon = buddydata.isConnected ? '🟢' : '🟠';



  let isCalling = buddydata.isCalling ? '<span>📞</span>' : '';
  let newMessages = buddydata.newMessages ? '<span>💬</span>' : '';


  if (buddydata.newMessages) {
    // open the window
    // bp.emit('chat::openChatWindow', { name: buddyname });
    console.log('buddynamebuddynamebuddyname', buddyname)
    //bp.open('buddylist', { context: buddyname, type: 'buddy' });
    this.bp.apps.buddylist.openChatWindow({ context: buddyname, type: 'buddy' }); // legacy API
  }

  let buddyListItems = document.querySelectorAll('.buddylist li');
  let exists = Array.from(buddyListItems).find(el => el.dataset.buddy === buddyname);

  if (exists) {
    exists.remove();
  }

  let buddyListItem = `<li data-buddy="${buddyname}" class="buddy-message-sender"><span>${newMessages}${connectedStatusIcon}${isCalling}</span> <a data-buddy="${buddyname}" class="message-buddy" href="#">${buddyname}</a></li>`;
  let buddyListItemEl = document.createElement('div');
  buddyListItemEl.innerHTML = buddyListItem;
  buddyListItemEl = buddyListItemEl.firstChild;

  if (buddydata.status === 'hidden') {
    buddyListItemEl.style.display = 'none';
  }

  if (buddydata.isConnected) {
    $('.buddylist').prepend(buddyListItemEl);
  } else {
    $('.buddylist').append(buddyListItemEl);
  }

  // Add context menu functionality
  attachContextMenu(buddyListItemEl);
}

// Function to attach the context menu to a buddy list item
function attachContextMenu(buddyElement) {
  $(buddyElement).on('contextmenu', function (e) {
    e.preventDefault();
    let buddyName = e.target.closest('li').dataset.buddy;
    showContextMenu(e.pageX, e.pageY, buddyName);
  });
}

// Function to display the context menu
function showContextMenu(x, y, buddyName) {
  // Create the menu
  const $menu = $('<div>', {
    id: 'customContextMenu',
    css: {
      position: 'absolute',
      top: y,
      left: x,
      zIndex: 99999,
      display: 'block',
      background: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      cursor: 'pointer'
    }
  }).append($('<ul>').append(
    $('<li>').text('View Profile').on('click', () => openProfile(buddyName)),
    // $('<li>').text('Send Message').on('click', () => sendMessage(buddyName)),
    // $('<li>').text('Start Call').on('click', () => startCall(buddyName))
  ));


  // Define these functions as per your application's functionality
  function openProfile(buddyName) {
    console.log('Opening profile for ' + buddyName);
    if (bp.admin) {
      // roles are handled server-side, this is a simple UI route for the implied role access
      // loading admin-profile from another user won't return admin data
      bp.open('admin-profile', { context: buddyName });
    } else {
      bp.open('user-profile', { context: buddyName });
    }
  }

  function sendMessage(buddyName) {
    console.log('Sending message to ' + buddyName);
    bp.open('buddylist', { context: buddyName, type: 'buddy' });
  }


  // Remove existing context menu if any and append new one
  $('#customContextMenu').remove();
  $('body').append($menu);

  // Hide the context menu on click anywhere
  $(document).one('click', function () {
    $('#customContextMenu').remove();
  });
}


function startCall(buddyName) {
  console.log('Starting call with ' + buddyName);
}
