import recentLogins from './commands/recentLogins.js';
import userByIP from './commands/userByIP.js';
import buddyProfile from './commands/buddyProfile.js';
import banList from './commands/banList.js';
import banBuddy from './commands/banBuddy.js';
import unbanBuddy from './commands/unbanBuddy.js';
import destroyBuddy from './commands/destroyBuddy.js';

export default function eventBind(adminWindow) {
    // Tab manager handles tab switching
    this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', adminWindow.content);

    // onTab callback
    this.tabs.onTab((tabId) => {
        console.log('tabId', tabId);

        switch (tabId) {
            case '#admin-recent-logins':
                console.log('admin-recent-logins');
                recentLogins.call(this);
                break;
            case '#admin-userbyIP':
                console.log('admin-userbyIP');
                document.querySelector('#ip-input').value = '';
                userByIP.call(this, '192.168.200.59');
                break;
            case '#admin-buddyProfile':
                console.log('admin-buddyProfile');
                let buddyname = document.querySelector('#profile-input').value.trim();
                buddyProfile.call(this, buddyname);
                break;
            case '#admin-banlist':
                console.log('admin-banlist');
                banList.call(this);
                break;
            default:
                console.warn('Unknown tabId:', tabId);
        }
    });

    // navigate to the first tab
    this.tabs.navigateToTab('#admin-recent-logins');

    // Event handlers
    document.querySelector('#ip-search-button').addEventListener('click', () => {
        const ip = document.querySelector('#ip-input').value.trim();
        if (ip) {
            userByIP.call(this, ip);
        }
    });

    // ip-ban-button handler
    document.querySelector('#ip-ban-button').addEventListener('click', () => {
        // TODO: alert confirmation
        // let confirmed = confirm('Are you sure you want to ban this buddies IP?');
        let confirmed = true;
        if (!confirmed) {
            return;
        }
        let buddyname = document.querySelector('#profile-input').value.trim();
        let banType = document.querySelector('#ban-type').value;
        let banLength = document.querySelector('#ban-length').value; // in minutes
        buddyname = buddyname;
        if (!buddyname) {
            alert('No buddyname provided');
            return;
        }
        if (buddyname) {
            banBuddy.call(this, buddyname, banType, banLength);
        }
    });

    document.querySelector('#profile-search-button').addEventListener('click', () => {
        const username = document.querySelector('#profile-input').value.trim();
        if (username) {
            buddyProfile.call(this, username);
        }
    });

    // Handle username clicks in recent logins table
    document.querySelector('#recent-logins-table').addEventListener('click', (e) => {
        const usernameLink = e.target.closest('.admin-username-link');
        if (usernameLink) {
            const username = usernameLink.dataset.username;
            document.querySelector('#profile-input').value = username;
            this.tabs.navigateToTab('#admin-buddyProfile');
            buddyProfile.call(this, username);
        }
    });

    // Handle username clicks in user-by-IP table
    document.querySelector('#user-by-ip-table').addEventListener('click', (e) => {
        const usernameLink = e.target.closest('.admin-username-link');
        if (usernameLink) {
            const username = usernameLink.dataset.username;
            document.querySelector('#profile-input').value = username;
            this.tabs.navigateToTab('#admin-buddyProfile');
            buddyProfile.call(this, username);
        }
    });

      // Handle username clicks in user-by-IP table
      document.querySelector('#admin-banlist').addEventListener('click', (e) => {
        const usernameLink = e.target.closest('.admin-username-link');
        if (usernameLink) {
            const username = usernameLink.dataset.username;
            document.querySelector('#profile-input').value = username;
            this.tabs.navigateToTab('#admin-buddyProfile');
            buddyProfile.call(this, username);
        }
    });


    // Handle unban button clicks
    document.querySelector('#admin-banlist').addEventListener('click', (e) => {
        const unbanButton = e.target.closest('.admin-remove-ban-link');
        if (unbanButton) {
            console.log('unbanButtonunbanButtonunbanButtonunbanButton', unbanButton);
            const buddyname = unbanButton.dataset.username;
            const curseType = unbanButton.dataset.curse;
            unbanBuddy.call(this, buddyname, curseType);
        }
    });

    // delete-buddy-button
    document.querySelector('#delete-buddy-button').addEventListener('click', () => {
        let confirmed = confirm('Are you sure you want to delete this buddy?');
        if (!confirmed) {
            return;
        }

        let buddyname = document.querySelector('#profile-input').value.trim();
        if (!buddyname) {
            alert('No buddyname provided');
            return;
        }
        if (buddyname) {
            // this.bp.apps.buddylist.removeBuddy(buddyname);
            destroyBuddy.call(this, buddyname);
        }
    });


    
}