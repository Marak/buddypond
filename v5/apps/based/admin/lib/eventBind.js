import recentLogins from './commands/recentLogins.js';
import userByIP from './commands/userByIP.js';
import buddyProfile from './commands/buddyProfile.js';
import banList from './commands/banList.js';
import banBuddy from './commands/banBuddy.js';
import unbanBuddy from './commands/unbanBuddy.js';
import destroyBuddy from './commands/destroyBuddy.js';
import resetPassword from './commands/resetPassword.js';
import addAdmin from './commands/addAdmin.js';
import listAdmins from './commands/listAdmins.js';

import listRules from './commands/firewall/listRules.js';
import addRule from './commands/firewall/addRule.js';

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
            case '#admin-add-admin':
                console.log('admin-add-admin');
                let adminName = document.querySelector('#admin-username').value.trim();
                let ip = document.querySelector('#admin-ip').value.trim();
                listAdmins.call(this);
                // addAdmin.call(this, adminName, ip);
            case '#admin-firewall':
                console.log('admin-firewall');
                // list firewall rules
                listRules.call(this);
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

    // add admin button handler
    document.querySelector('#add-admin-button').addEventListener('click', () => {
        let buddyname = document.querySelector('#admin-username').value.trim();
        let ip = document.querySelector('#admin-ip').value.trim();
        if (!buddyname) {
            alert('No buddyname provided');
            return;
        }
        if (buddyname) {
            addAdmin.call(this, buddyname, ip);
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

    // reset-buddy-password-button
    document.querySelector('#reset-buddy-password-button').addEventListener('click', () => {
        let confirmed = confirm('Are you sure you want to reset this buddy\'s password?');
        if (!confirmed) {
            return;
        }

        let newPassword = prompt('Enter new password for buddy:', '');
        if (!newPassword) {
            newPassword = buddyname; // use buddyname as default if no password provided
        }

        let buddyname = document.querySelector('#profile-input').value.trim();
        if (!buddyname) {
            alert('No buddyname provided');
            return;
        }
        console.log('Resetting password for buddy:', buddyname, 'to new password:', newPassword);
        if (buddyname) {
            // this.bp.apps.buddylist.resetPassword(buddyname);
            // this.bp.apps.buddyscript.executeCommand('reset-password', { buddyname });
            resetPassword.call(this, buddyname, newPassword);
        }
    });

    // #login-as-user-button
    // #super-admin-token
    // if click on login-as-user-button, make fetch request to '/api/v6/auth' setting x-admin-token from input
    $('#login-as-user-button').on('click', async () => {
        let token = $('#super-admin-token').val().trim();
        let buddyname = $('#profile-input').val().trim();
        if (!token) {
            alert('No token provided');
            return;
        }
        console.log('Logging in as user with token:', buddyname, token);
        try { 
            let response = await fetch(buddypond.endpoint + '/auth', {
                method: 'POST',
                body: JSON.stringify({ buddyname }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                }
            });
            let data = await response.json();
            if (data.success) {
                alert('Logged in as user successfully');
                // set the qtoken to localStorage

                localStorage.setItem('qtokenid', data.qtokenid);
                localStorage.setItem('me', buddyname);

                // Optionally, you can redirect or refresh the page
                window.location.reload();
            } else {
                alert('Failed to log in as user: ' + data.message);
            }
        } catch (error) {
            console.error('Error logging in as user:', error);
            alert('Error logging in as user: ' + error.message);
        }
    });

    $('#firewall-rule-form').on('submit', async (e) => {
        e.preventDefault();
        let ruleAction = $('#firewall-rule-action').val();
        let ruleIP = $('#firewall-rule-ip').val().trim();
        console.log('Adding firewall rule:', ruleAction, ruleIP);

        if (!ruleIP) {
            alert('No IP address provided');
            return;
        }

        // TODO: swap action to delete if ruleAction is not add
        await addRule.call(this, ruleIP);

    });
        
}