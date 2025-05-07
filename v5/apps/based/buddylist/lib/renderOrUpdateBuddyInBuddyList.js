// TODO: we may need a timer here client-side to check now - buddydata.utime is too long
// which indicates the buddy is offline and stopped sending keepAlives
let buddyTimeoutsInterval = 60000; // 60 seconds

export default function renderOrUpdateBuddyInBuddyList(data, buddy_added = false) {
  let bp = this.bp;
  let buddyname = data.name;
  let buddydata = data.profile;

  this.bp.buddyTimeouts = this.bp.buddyTimeouts || {};

  // console.log('renderOrUpdateBuddyInBuddyList', buddy_added, buddyname, buddydata);

  if (buddydata.status === 'online') {
    buddydata.isConnected = true;
  }

  // clear the timeout if it exists
  if (this.bp.buddyTimeouts[buddyname]) {
    clearTimeout(this.bp.buddyTimeouts[buddyname]);
    delete this.bp.buddyTimeouts[buddyname];
  }

  let now = new Date().getTime();
  let diff = now - buddydata.utime;
  console.log('checking timeout', buddyname, buddydata.utime, diff);
  if (now - buddydata.utime > buddyTimeoutsInterval) { // --2 keepAlives + buffer ( for now )
    console.log('buddy has timed out', buddyname, buddydata.utime, diff);
    buddydata.isConnected = false;
  }

  // set a timeout to remove the buddy from the list if they are offline
  if (buddydata.isConnected) {
    console.log('buddy is connected, creating timeout', buddyname, buddydata.utime, diff);
    // clear the timeout if it exists
    if (this.bp.buddyTimeouts[buddyname]) {
      clearTimeout(this.bp.buddyTimeouts[buddyname]);
      delete this.bp.buddyTimeouts[buddyname];
    }
    this.bp.buddyTimeouts[buddyname] = setTimeout(() => {
      let _data = {
        name: buddyname,
        profile: {
          buddyname: buddyname,
          isConnected: false,
          status: 'offline',
          utime: new Date().getTime(),
          dtime: new Date().getTime(),
          newMessages: false
        }
      };
      console.log('buddy has timed out, calling renderOrUpdateBuddyInBuddyList', buddyname, _data);
      renderOrUpdateBuddyInBuddyList.call(this, _data, false);
    }, buddyTimeoutsInterval * 1.5);
  }

  let connectedStatusIcon = buddydata.isConnected ? '🟢' : '🟠';
  let isCalling = buddydata.isCalling ? '<span>📞</span>' : '';
  let newMessages = buddydata.newMessages ? '<span>💬</span>' : '';

  if (buddydata.newMessages) {
    this.bp.apps.buddylist.openChatWindow({ context: buddyname, type: 'buddy' });
  }

  let buddyListItems = document.querySelectorAll('.buddylist li');
  let exists = Array.from(buddyListItems).find(el => el.dataset.buddy === buddyname);

  if (exists) {
    exists.remove();
  }

  let lastSeen = buddydata.utime ? buddydata.utime : 0;
  let lastSeenDate = new Date(lastSeen);
  let lastSeenString = '';
  
  try {
    lastSeenString = 'Last seen: ' + lastSeenDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (err) {
    console.log('Error formatting last seen date', err);
  }

  let buddyListItem = `<li data-buddy="${buddyname}" data-utime="${buddydata.utime}" class="buddy-message-sender" title="${lastSeenString}">
                          <span class="buddy-status">${newMessages}${connectedStatusIcon}${isCalling}</span> 
                          <a data-buddy="${buddyname}" class="message-buddy" href="#" draggable="false">${buddyname}</a>
                        </li>`;
  let buddyListItemEl = document.createElement('div');
  buddyListItemEl.innerHTML = buddyListItem;
  buddyListItemEl = buddyListItemEl.firstChild;

  if (buddydata.status === 'hidden') {
    buddyListItemEl.style.display = 'none';
  }

  if (buddydata.utime) {
    let formattedDate = DateFormat.format.date(buddydata.utime, 'E MMMM dd, hh:mm:ss a');
    $(buddyListItemEl).find('.buddy-status').attr('title', formattedDate);
  }

  // Append to the buddy list temporarily
  $('.buddylist').append(buddyListItemEl);

  // Re-sort the entire buddy list
  sortBuddyList();

  // Add context menu functionality
  attachContextMenu(buddyListItemEl);
}

function sortBuddyList() {
  let buddyItems = Array.from(document.querySelectorAll('.buddylist li'));

  buddyItems.sort((a, b) => {
    // Sort by status (online 🟢 first)
    let aStatus = a.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;
    let bStatus = b.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;

    if (aStatus !== bStatus) {
      return aStatus - bStatus; // Online first
    }

    // Sort by utime (most recent first)
    let aUtime = parseInt(a.dataset.utime || 0);
    let bUtime = parseInt(b.dataset.utime || 0);
    console.log('sorting by utime', a.dataset.buddy, aUtime, b.dataset.buddy, bUtime);
    if (aUtime !== bUtime) {
      return bUtime - aUtime; // Higher utime (more recent) first
    }

    // Sort by name (alphabetical)
    return a.dataset.buddy.localeCompare(b.dataset.buddy);
  });

  let buddyList = document.querySelector('.buddylist');
  buddyList.innerHTML = '';
  buddyItems.forEach(item => buddyList.appendChild(item));
}

function attachContextMenu(buddyElement) {
  $(buddyElement).on('contextmenu', function (e) {
    e.preventDefault();
    let buddyName = e.target.closest('li').dataset.buddy;
    showContextMenu(e.pageX, e.pageY, buddyName);
  });
}

function showContextMenu(x, y, buddyName) {
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
    $('<li>').text('View Profile').on('click', () => openProfile(buddyName))
  ));

  function openProfile(buddyName) {
    console.log('Opening profile for ' + buddyName);
    if (bp.admin) {
      bp.open('admin-profile', { context: buddyName });
    } else {
      bp.open('user-profile', { context: buddyName });
    }
  }

  $('#customContextMenu').remove();
  $('body').append($menu);

  $(document).one('click', function () {
    $('#customContextMenu').remove();
  });
}
