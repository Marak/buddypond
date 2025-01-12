import wallpapers from './lib/wallpapers.js';
import audioSettings from './lib/audio-settings.js';
import userSettings from './lib/user-settings.js';
import PadEditor from '../pad/PadEditor.js';
import LoadingContainer from '../ui/LoadingContainer/LoadingContainer.js';
let defaultFileContent = {};


export default class Profile {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/profile/profile.css');
        await this.bp.load('/v5/apps/based/ui/LoadingContainer/LoadingContainer.css');
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

        let buddyProfile = await this.bp.apps.client.api.getProfile(buddyname);
        if (buddyname == this.bp.me) {
            buddyProfile.localState = this.bp.apps.buddylist.data.profileState;
        }

        // Create main content div and setup for tabs
        let contentDiv = document.createElement('div');
        contentDiv.classList.add('customProfile');


        // create a new element from the html string
        let profileContent = document.createElement('div');
        profileContent.innerHTML = this.html;
        //contentDiv.append($(buddyProfilePad.content).html());
        //$(contentDiv).html(buddyProfilePad.content);
        $('.myProfile', profileContent).html(contentDiv);
        //profileContent.append(contentDiv);

        // Initialize tabs
        if (!this.profileWindow) {
            this.profileWindow = this.bp.apps.ui.windowManager.createWindow({
                id: 'profile',
                title: 'Profile - ' + buddyname,
                x: 50,
                y: 100,
                width: 1000,
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
            new this.bp.apps.ui.Tabs('.tabs-container', '#' + this.profileWindow.id); // Initialize the tab functionality

            wallpapers.legacyWallpapers(bp);


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
            renderProfileApp(appName, $('.yourApps')[0]);
        }

        //$('.profileContent .ctime', this.profileWindow.content).html(buddyProfile.ctime);
        //console.log('buddyProfile', buddyProfile);
        //$('.buddyname', this.profileWindow.content).html(buddyProfile.buddyProfile.me);

        // set the liveProfileLink
        let liveLink = this.bp.config.host + '/' + this.bp.me
        $('.liveProfileLink', this.profileWindow.content).attr('href', liveLink);
        $('.liveProfileLink', this.profileWindow.content).html(liveLink);


        $('.editProfileButton', this.profileWindow.content).on('click', () => {
            // show the profile editor
            $('.profileEditor', this.profileWindow.content).flexShow();
            // hide the profile content
            $('.customProfile', this.profileWindow.content).flexHide();
            $('.updateProfileHtml', this.profileWindow.content).flexShow();
            $('.cancelProfileEdit', this.profileWindow.content).flexShow();
        });

        //        $('.profileEditor', this.profileWindow.content).appendTo(this.profileWindow.content);

        // $('.profileHtml', this.profileWindow.content).val(buddyProfilePad.content);
       
        $('.cancelProfileEdit', this.profileWindow.content).on('click', () => {
            // hide the profile editor
            $('.profileEditor', this.profileWindow.content).flexHide();
            // show the profile content
            $('.customProfile', this.profileWindow.content).flexShow();
            $('.updateProfileHtml', this.profileWindow.content).flexHide();
            $('.cancelProfileEdit', this.profileWindow.content).flexHide();
        });

        $('.updateProfileHtml').flexHide();
        $('.cancelProfileEdit').flexHide();

        audioSettings(bp);
        userSettings(bp);


        let padEditorHolder = document.createElement('div');
        padEditorHolder.className = 'pad-editor-holder';

        /*
        let fileExplorer = await this.bp.apps['file-explorer'].create();
        console.log('fffff', fileExplorer.fileExplorer.container)
        padEditorHolder.append(fileExplorer.fileExplorer.container);
        profileContent.append(padEditorHolder);
        */

        let profileUrl = this.bp.config.host + '/' + this.bp.me;
        // check if this.bp.config.host contains buddypond.com, if not append /index.html
        if (this.bp.config.host.indexOf('buddypond.com') === -1) {
            profileUrl = profileUrl + '/index.html';
        }

        this.browser = new this.bp.apps.browser.BrowserWindow(this.bp, padEditorHolder, profileUrl);

        let yourProfile = $('#your-profile', this.profileWindow.content);
        this.bp.on('file-explorer::update', 'update-profile-preview-if-profile-index', (data) => {
            // check if data.path is /index.html
            // if so, we wish to reload the browser window
            this.browser.navigate(profileUrl);
        });

        yourProfile.append(padEditorHolder);

        if (options.context && options.context === 'themes') {
            $('.themesLink').click();
        }


    }
}

function renderProfileApp(appName, container) {
    //app = desktop.app.appstore.apps[appName]
    let app = bp.apps.appstore.apps[appName];
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