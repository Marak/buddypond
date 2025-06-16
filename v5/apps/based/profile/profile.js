import wallpapers from './lib/wallpapers.js';
import themeEditor from './lib/theme-editor.js';
import apiKeys from './lib/api-keys.js';
import bindUIEvents from './lib/bindUIEvents.js';
// import LoadingContainer from '../ui/LoadingContainer/LoadingContainer.js';
let defaultFileContent = {};


export default class Profile {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/profile/profile.css');
        // await this.bp.load('/v5/apps/based/ui/LoadingContainer/LoadingContainer.css');
        await this.bp.load('browser');
        await this.bp.appendScript('/desktop/assets/js/jquery.simple-color.js');

        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v5/apps/based/profile/profile.html');

        return 'loaded Profile';
    }

    async open(options = {}) {

        let buddyname = this.bp.me || options.context;
        buddyname = buddyname.replace(":", ""); // remove any colons for now
        buddyname = buddyname.replace(" ", ""); // remove any spaces for now

        // Create main content div and setup for tabs
        let contentDiv = document.createElement('div');
        contentDiv.classList.add('customProfile');

        // create a new element from the html string
        let profileContent = document.createElement('div');
        profileContent.innerHTML = this.html;
        //contentDiv.append($(buddyProfilePad.content).html());
        //$(contentDiv).html(buddyProfilePad.content);
        // $('.myProfile', profileContent).html(contentDiv);
        //profileContent.append(contentDiv);

        // Initialize tabs
        if (!this.profileWindow) {
            this.profileWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'profile',
                title: 'Profile - ' + buddyname,
                x: 50,
                y: 100,
                width: 800,
                height: 500,
                minWidth: 200,
                minHeight: 200,
                parent: $('#desktop')[0],
                icon: '/desktop/assets/images/icons/icon_profile_64.png',
                context: buddyname || 'default',
                content: profileContent,
                resizable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                focusable: true,
                maximized: false,
                minimized: false,
                onClose: () => {
                    this.profileWindow = null;
                }
            });
            this.profileWindow.loggedIn = true;
            this.tabs = new this.bp.apps.ui.Tabs('.tabs-container', '#' + this.profileWindow.id); // Initialize the tab functionality

            this.tabs.onTab(async (tabId) => {
                if (this.bp.me !== 'Guest') {
                    $('.loggedIn', this.profileWindow.content).flexShow();
                    $('.loggedOut', this.profileWindow.content).flexHide();

                } else {
                    $('.loggedIn', this.profileWindow.content).flexHide();
                    $('.loggedOut', this.profileWindow.content).flexShow();

                }
            });

            wallpapers.legacyWallpapers(bp);

            this.bindUIEvents(options);


            if (this.bp.me !== 'Guest') {
                $('.loggedIn', this.profileWindow.content).flexShow();
                $('.loggedOut', this.profileWindow.content).flexHide();

            } else {
                $('.loggedIn', this.profileWindow.content).flexHide();
                $('.loggedOut', this.profileWindow.content).flexShow();
                // navigate to themes tag by default if not logged in
                this.tabs.showTab('#tab-themes');
            }


        } else {
            // this.profileWindow.content.innerHTML = '';
            // If the window exists and the context has changed, re-render the content
            this.profileWindow.content = contentDiv;
            if (this.profileWindow.context !== buddyname) {
                this.profileWindow.context = buddyname;
                $(this.profileWindow.content).html(contentDiv.innerHTML);
                this.profileWindow.setTitle('Profile - ' + buddyname);
                new this.bp.apps.ui.Tabs('#' + this.profileWindow.id); // Re-initialize the tab functionality
                // this.profileWindow.render(); Uncomment if there's a render method to refresh the window
            }
        }

        $('.yourApps tbody', this.profileWindow.content).html('');
        for (let appName in bp.settings.apps_installed) {
            // renderProfileApp(appName, $('.yourApps')[0]);
        }

        //$('.profileContent .ctime', this.profileWindow.content).html(buddyProfile.ctime);
        //console.log('buddyProfile', buddyProfile);
        //$('.buddyname', this.profileWindow.content).html(buddyProfile.buddyProfile.me);

        // set the liveProfileLink
        let liveLink = this.bp.config.host + '/' + this.bp.me
        $('.liveProfileLink', this.profileWindow.content).attr('href', liveLink);
        $('.liveProfileLink', this.profileWindow.content).html(liveLink);

        $('.loggedIn', this.profileWindow).hide();
        // $('.loggedIn').hide();


        return this.profileWindow;

    }
}

function renderProfileApp(appName, container) {
    //app = desktop.app.appstore.apps[appName]
    let app = bp.apps.desktop.appsList[appName];
    //console.log('renderProfileApp', appName, app);

    //console.log('renderProfileApp', appName, app);
    // don't show Profile App itself in Profile App List
    if (appName === 'profile') {
        return;
    }
    let str = `
      <tr class="open-app" data-app="${appName}">
        <td>
          <img class="appStoreIcon float-left" src="desktop/assets/images/icons/icon_${app.icon || appName}_64.png" />
        </td>
        <td>
         ${app.description || app.label || appName}
        </td>
    </tr>`;
    let el = document.createElement('tr');
    el.classList.add('open-app');
    el.setAttribute('data-app', appName);
    el.innerHTML = str;
    container.append(el);
    return str;
}

Profile.prototype.bindUIEvents = bindUIEvents;
Profile.prototype.themeEditor = themeEditor;
Profile.prototype.apiKeys = apiKeys;