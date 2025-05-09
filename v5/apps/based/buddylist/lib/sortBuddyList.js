export default function sortBuddyList() {

  let buddyList = document.querySelector('.buddylist');
  if (!buddyList) {
    console.log('Buddy list not found, unable to sort');
    return;
  }

  let buddyItems = Array.from(document.querySelectorAll('.buddylist li')); // TODO: more specific selector?

  buddyItems.sort((a, b) => {
    // Sort by status (online 🟢 first)
    let aStatus = a.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;
    let bStatus = b.querySelector('.buddy-status').textContent.includes('🟢') ? 0 : 1;

    if (aStatus !== bStatus) {
      return aStatus - bStatus; // Online first
    }

    // If both are online, sort alphabetically by name
    if (aStatus === 0 && bStatus === 0) {
      return a.dataset.buddy.localeCompare(b.dataset.buddy);
    }

    // If both are offline, sort by utime (most recent first), then by name
    let aUtime = parseInt(a.dataset.utime || 0);
    let bUtime = parseInt(b.dataset.utime || 0);
    if (aUtime !== bUtime) {
      return bUtime - aUtime; // Higher utime (more recent) first
    }

    return a.dataset.buddy.localeCompare(b.dataset.buddy);
  });


  buddyList.innerHTML = '';
  buddyItems.forEach(item => buddyList.appendChild(item));
}