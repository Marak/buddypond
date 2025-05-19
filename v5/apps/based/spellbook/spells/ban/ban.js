export default function ban (data) {
    this.bp.logout();

    //let duration = data.expiry - data.ctime;
    //let formattedDuration = new Date(duration).toISOString().substr(11, 8); // Format as HH:MM:SS

    alert('You have been banned from BuddyPond.');



}