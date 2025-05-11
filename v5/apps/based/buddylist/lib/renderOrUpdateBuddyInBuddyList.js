let buddyTimeoutsInterval = 60000; // 60 seconds

export default function renderOrUpdateBuddyInBuddyList(data) {
  let bp = this.bp;
  let buddyname = data.name;
  let buddydata = data.profile;

  this.bp.buddyTimeouts = this.bp.buddyTimeouts || {};

  console.log('renderOrUpdateBuddyInBuddyList', buddyname, data);

  // Track previous connection status to detect changes
  let buddyListItems = document.querySelectorAll('.buddylist li');
  let existingBuddy = Array.from(buddyListItems).find(el => el.dataset.buddy === buddyname);
  let wasConnected = existingBuddy ? existingBuddy.querySelector('.buddy-status').textContent.includes('🟢') : false;

  // Handle status update only if status field is present
  if (buddydata.hasOwnProperty('status')) {
    if (buddydata.status === 'online') {
      buddydata.isConnected = true;
    } else {
      buddydata.isConnected = false;
    }

    // Clear the timeout if it exists
    if (this.bp.buddyTimeouts[buddyname]) {
      clearTimeout(this.bp.buddyTimeouts[buddyname]);
      delete this.bp.buddyTimeouts[buddyname];
    }

    let now = new Date().getTime();
    let diff = now - buddydata.utime;
    if (now - buddydata.utime > buddyTimeoutsInterval) {
      buddydata.isConnected = false;
    }

    // Set a timeout to mark buddy as offline if they are currently connected
    if (buddydata.isConnected) {
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
        renderOrUpdateBuddyInBuddyList.call(this, _data, false);
      }, buddyTimeoutsInterval * 1.5);
    }

    // Play sound based on status change
    // Don't play sound if buddy is me
    if (buddyname !== this.bp.me) {
      if (buddydata.isConnected && !wasConnected) {
        bp.play('desktop/assets/audio/BUDDY-IN.wav'); // Buddy comes online
      } else if (!buddydata.isConnected && wasConnected) {
        // Remark: Removed the signout sound as it was too loud / jarring
        // bp.play('desktop/assets/audio/BUDDY-OUT.wav'); // Buddy goes offline
      }
    }
  }

  // Use existing isConnected if available, otherwise derive from DOM state
  let isConnected = buddydata.hasOwnProperty('isConnected') ? buddydata.isConnected : wasConnected;

  if (buddydata.newMessages) {
    isConnected = true;
    this.bp.apps.buddylist.openChatWindow({ context: buddyname, type: 'buddy' });
  }

  let connectedStatusIcon = isConnected ? '🟢' : '🟠';
  let isCalling = buddydata.isCalling ? '<span>📞</span>' : '';
  let newMessages = buddydata.newMessages ? '<span>💬</span>' : '';



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

  // Update or create buddy list item
  let buddyListItemEl;
  if (existingBuddy) {
    // Update existing element to prevent flicker
    buddyListItemEl = existingBuddy;
    buddyListItemEl.dataset.utime = buddydata.utime;
    buddyListItemEl.title = lastSeenString;
    buddyListItemEl.querySelector('.buddy-status').innerHTML = `${newMessages}${connectedStatusIcon}${isCalling}`;
    buddyListItemEl.querySelector('.message-buddy').textContent = buddyname;
    buddyListItemEl.style.display = buddydata.status === 'hidden' ? 'none' : '';
  } else {
    // Create new element if buddy doesn't exist
    let buddyListItem = `<li data-buddy="${buddyname}" data-utime="${buddydata.utime}" class="buddy-message-sender" title="${lastSeenString}">
                          <span class="buddy-status">${newMessages}${connectedStatusIcon}${isCalling}</span> 
                          <a data-buddy="${buddyname}" class="message-buddy" href="#" draggable="false">${buddyname}</a>
                        </li>`;
    buddyListItemEl = document.createElement('div');
    buddyListItemEl.innerHTML = buddyListItem;
    buddyListItemEl = buddyListItemEl.firstChild;

    if (buddydata.status === 'hidden') {
      buddyListItemEl.style.display = 'none';
    }
  }

  if (buddydata.utime) {
    let formattedDate = DateFormat.format.date(buddydata.utime, 'E MMMM dd, hh:mm:ss a');
    $(buddyListItemEl).find('.buddy-status').attr('title', formattedDate);
  }

  // Append new buddy or ensure existing one is in the list
  if (!existingBuddy) {
    $('.buddylist').append(buddyListItemEl);
  }

  // Re-sort the entire buddy list
  this.sortBuddyList();

  // Add context menu functionality
  attachContextMenu.call(this, buddyListItemEl);
}

function attachContextMenu(buddyElement) {
  $(buddyElement).on('contextmenu', (e) => {
    e.preventDefault();
    let buddyName = e.target.closest('li').dataset.buddy;
    this.showContextMenu(e.pageX, e.pageY, buddyName);
  });
}