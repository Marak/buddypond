export default function renderOrUpdateBuddyInBuddyList (data) {
    // console.log('renderOrUpdateBuddyInBuddyList', data)
    let buddyname = data.name;
    let buddydata = data.buddydata;
  
    let connectedStatusIcon = '🟠';
    if (buddydata.isConnected) {
      connectedStatusIcon = '🟢';
    }
  
    // phone call icon next to buddy name
    let isCalling = '';
    if (buddydata && buddydata.isCalling) {
      isCalling = '<span>📞</span>';
    }
  
    // new messages chat icon next to buddy name
    let newMessages = '';
    if (buddydata && buddydata.newMessages) {
      newMessages = '<span>💬</span>';
    }
  
    // see if this buddy is already rendered
    let exists = false;

    // get all .buddylist li elements
    let buddyListItems = document.querySelectorAll('.buddylist li');

    buddyListItems.forEach((el, i) => {
      if (el.dataset.buddy === buddyname) {
        exists = el;
      }
    });
  
    if (exists) {
      exists.remove();
    }
  
    let buddyListItem = `<li data-buddy="${buddyname}"><span>${newMessages}${connectedStatusIcon}${isCalling}</span> <a data-buddy="${buddyname}" class="message-buddy" href="#">${buddyname}</a></li>`;
    let buddyListItemEl = document.createElement('div');
    buddyListItemEl.innerHTML = buddyListItem;
    if (buddydata.isConnected) {
      $('.buddylist').prepend(buddyListItemEl);
    } else {
      $('.buddylist').append(buddyListItemEl);
    }
  
  }