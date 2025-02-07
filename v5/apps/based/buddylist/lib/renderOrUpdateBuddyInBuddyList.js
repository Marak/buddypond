export default function renderOrUpdateBuddyInBuddyList(data) {
  let bp = this.bp;
  let buddyname = data.name;
  let buddydata = data.profile;

  if (buddydata.status === 'online') {
    buddydata.isConnected = true;
  }

  let now = new Date().getTime();
  if (now - buddydata.utime > 40000) {
    buddydata.isConnected = false;
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

  let buddyListItem = `<li data-buddy="${buddyname}" class="buddy-message-sender">
                          <span class="buddy-status">${newMessages}${connectedStatusIcon}${isCalling}</span> 
                          <a data-buddy="${buddyname}" class="message-buddy" href="#">${buddyname}</a>
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
    let aStatus = a.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;
    let bStatus = b.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;

    if (aStatus !== bStatus) {
      return aStatus - bStatus; // Online first
    }

    return a.dataset.buddy.localeCompare(b.dataset.buddy); // Alphabetical order
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
