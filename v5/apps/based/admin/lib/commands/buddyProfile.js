// get buddy profile from database and durable object
export default async function buddyProfile(buddyname) {

    let buddyProfiles = await this.client.apiRequest(`/super-admin/buddy-profile?buddyname=${buddyname}`, 'GET');
    console.log('buddyProfiles', buddyProfiles);

    let databaseProfile = buddyProfiles.database;
    let durableObjectProfile = buddyProfiles.durableObject;
    let curses = buddyProfiles.curses;

    const databaseProfileDisplay = document.querySelector('#profile-display-database');
    if (databaseProfile) {
        databaseProfileDisplay.textContent = JSON.stringify(databaseProfile, null, 2);
    } else {
        databaseProfileDisplay.textContent = 'No database profile found';
    }

    const durableObjectProfileDisplay = document.querySelector('#profile-display-durable');
    if (durableObjectProfile) {
        durableObjectProfileDisplay.textContent = JSON.stringify(durableObjectProfile, null, 2);
    } else {
        durableObjectProfileDisplay.textContent = 'No durable object cachedProfile found';
    }

    const cursesDisplay = document.querySelector('#profile-display-curses');
    if (curses && curses.length > 0) {
        cursesDisplay.textContent = JSON.stringify(curses, null, 2);
    } else {
        cursesDisplay.textContent = 'No curses found';
    }

}