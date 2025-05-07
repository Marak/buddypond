export default function sortBuddyList() {
    let buddyItems = Array.from(document.querySelectorAll('.buddylist li')); // TODO: more specific selector?
  
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