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

        let profilePadKey = '/' + this.bp.me + '/myprofile';
        // currently returns postgres document for the pad ( not redis )
        // we will want to store the keys in redis for quick access ( loading pad pages )

        // No longer creating default pad, instead of create default index.html on login

        /*
        let buddyProfilePad;

        try {
            console.log('buddyProfilePad', buddyProfilePad);

            buddyProfilePad = await this.bp.apps.client.api.getPad(profilePadKey);

            console.log('buddyProfilePad', buddyProfilePad);
        } catch (err) {


            try {
                let newPad = await this.bp.apps.client.api.createPad({
                    title: 'myprofile',
                    content: 'This is profile. There are many like it, but this one is mine.'
                });

                buddyProfilePad = newPad;

            } catch (err) {
                buddyProfilePad = {
                    content: 'This is profile. There are many like it, but this one is mine.'
                };

            }

        }
        console.log('buddyProfilePad', buddyProfilePad);
        defaultFileContent['/myprofile/index.html'] = buddyProfilePad.content;
        */


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

        wallpapers.legacyWallpapers();
        audioSettings();
        userSettings(bp);


        let padEditorHolder = document.createElement('div');
        padEditorHolder.className = 'pad-editor-holder';

        /*
        let fileExplorer = await this.bp.apps['file-explorer'].create();
        console.log('fffff', fileExplorer.fileExplorer.container)
        padEditorHolder.append(fileExplorer.fileExplorer.container);
        profileContent.append(padEditorHolder);
        */

        this.browser = new this.bp.apps.browser.BrowserWindow(padEditorHolder, 'https://buddypond.com/' + this.bp.me);

        this.bp.on('file-explorer::update', 'update-profile-preview-if-profile-index', (data) => {
            // check if data.path is /index.html
            // if so, we wish to reload the browser window
            this.browser.navigate('https://buddypond.com/' + this.bp.me);
        });

        profileContent.append(padEditorHolder);


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

// Example data structure
const defaultFiles = [
    {
        type: 'folder',
        name: 'myprofile',
        path: '/myprofile',
        children: [
            {
                type: 'file',
                name: 'index.html',
                path: '/myprofile/index.html'
            },
            /*
            {
                type: 'file',
                name: 'pad.js',
                path: '/myprofile/pad.js'
            },
            {
                type: 'file',
                name: 'style.css',
                path: '/myprofile/style.css'
            }
            */

        ]
    }
]


