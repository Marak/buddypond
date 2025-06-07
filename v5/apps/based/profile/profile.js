import wallpapers from './lib/wallpapers.js';
import audioSettings from './lib/audio-settings.js';
import userSettings from './lib/user-settings.js';
import PadEditor from '../pad/PadEditor.js';
// import LoadingContainer from '../ui/LoadingContainer/LoadingContainer.js';
import updateProfilePicture from './lib/updateProfilePicture.js';
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

            wallpapers.legacyWallpapers(bp);

            const profilePictureInput = document.getElementById('profile-picture-input');
            const profilePictureImg = document.querySelector('.aim-profile-picture-img');
            // const removeButton = document.querySelector('.aim-profile-picture-remove');

            $('.aim-set-password-email').on('click', (e) => {
                this.tabs.navigateToTab('#tabs-3');
            });

            // Handle file selection
            profilePictureInput.addEventListener('change', async (event) => {
                updateProfilePicture.call(this, event, profilePictureImg);
            });
            /*
            // Handle remove button click
            removeButton.addEventListener('click', () => {
                // Reset to default avatar

                // This is done by calling setStatus profile.profilePicture = '';
                // await this.bp.apps.client.api.uploadProfilePicture(resizedFile);

                // profilePictureImg.src = '/default-avatar.png';

                // Stub for removing profile picture API call
                // TODO: Replace with actual API call
                console.log('Removing profile picture');
                // Example: removeProfilePicture().then(() => {
                //     profilePictureImg.src = '/default-avatar.png';
                // }).catch(error => {
                //     console.error('Remove failed:', error);
                // });
            });
            */

            // check if user profile has a profilePicture
            let profilePicture = this.bp.apps.buddylist.data.profileState.profilePicture;
            let profilePicturePreview = $('.aim-profile-picture-preview');

            if (profilePicture) {

                // profilePicture is a url, set the profilePicturePreview to the url
                // create a new img element inside .aim-profile-picture-preview
                let img = document.createElement('img');
                img.src = profilePicture;
                img.classList.add('aim-profile-picture-img');
                profilePicturePreview.append(img);


            } else {
                const avatar = this.bp.vendor.dicebear.createAvatar(this.bp.vendor.dicebearAvatars, {
                    seed: this.bp.me, // Username as seed for consistent avatar
                    size: 128, // Avatar size in pixels
                    backgroundColor: ["#f0f0f0"], // Optional: Customize background
                });

                // Convert avatar to SVG string
                const svg = avatar.toString();
                console.log('Avatar SVG:', svg);

                profilePicturePreview.html(svg);

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

        // TODO: add these back
        //audioSettings(bp);
        userSettings(bp);


        let padEditorHolder = $('.pad-editor-holder', this.profileWindow.content)[0];
        // padEditorHolder.className = 'pad-editor-holder';

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

        if (!this.browser) {
            this.browser = new this.bp.apps.browser.BrowserWindow(this.bp, padEditorHolder, profileUrl);

        }

        let yourProfile = $('#your-profile', this.profileWindow.content);
        this.bp.on('file-explorer::update', 'update-profile-preview-if-profile-index', (data) => {
            // check if data.path is /index.html
            // if so, we wish to reload the browser window
            this.browser.navigate(profileUrl);
        });

        yourProfile.append(padEditorHolder);

        // TODO: navigate to tabs? this.tabs.showTab(options.context);
        if (options.context && options.context === 'themes') {
            $('.themesLink').click();
        }

        $('.me').html(this.bp.me);

        if (options && options.type === 'settings') {
            // if type is user-settings, show the user settings tab
            this.tabs.showTab('#tabs-3');
        }

        if (options && options.type === 'themes') {
            // if type is user-settings, show the user settings tab
            this.tabs.showTab('#tabs-2');
        }


        $('.themeSelect', this.profileWindow.content).on('change', (e) => {
            let val = $(e.target).val();
            if (val === 'Custom') {
                // do nothing
                return;
            }
            this.bp.apps.themes.applyTheme(val); // Apply selected theme

            let themeData = this.bp.apps.themes.themes[val];
            let themeStyles = themeData.styles || {};
            let themeStylesTable = $('.theme-styles', this.profileWindow.content);
            themeStylesTable.html(''); // clear table

            // Create a deep copy so edits don't mutate original
            let editableTheme = JSON.parse(JSON.stringify(themeData));

            for (let styleName in themeStyles) {
                let styleValue = themeStyles[styleName];
                let row = $('<tr></tr>');
                let propsCell = $('<td colspan="2"></td>');

               propsCell.append(`<div class="style-block"><div class="style-title">${styleName}</div>`);

for (let prop in styleValue) {
    let val = styleValue[prop];
    let inputId = `input_${styleName}_${prop}`.replace(/\W+/g, '_');

    let colorInput = '';
    if (isColorProperty(prop, val)) {
        let safeColor = val.startsWith('#') ? val : '#ffffff';
        colorInput = `<input type="color" value="${safeColor}" data-style="${styleName}" data-prop="${prop}" class="color-picker" />`;
    }

    propsCell.append(`
        <div class="prop-row">
            <label class="prop-name">${prop}:</label>
            <input type="text" id="${inputId}" value="${val}" data-style="${styleName}" data-prop="${prop}" />
            ${colorInput}
        </div>
    `);
    //  <button class="remove-prop-btn" data-style="${styleName}" data-prop="${prop}">✕</button>

}

/*
propsCell.append(`
    <div class="prop-row">
        <label class="prop-name">+</label>
        <input type="text" class="new-prop-name" placeholder="property" data-style="${styleName}" />
        <input type="text" class="new-prop-value" placeholder="value" data-style="${styleName}" />
        <button class="add-prop-btn" data-style="${styleName}">Add</button>
    </div>
</div>`);
*/


                row.append(propsCell);
                themeStylesTable.append(row);
            }

            // 🔁 Listen to changes and update theme live
            themeStylesTable.on('input', 'input[type="text"], input.color-picker', function (e) {
                // set dropdown to Custom
                $('.themeSelect', this.profileWindow.content).val('Custom');
                let style = $(e.target).data('style');
                let prop = $(e.target).data('prop');
                console.log('style', style, 'prop', prop);
                if (!style || !prop) return;

                let newValue = $(e.target).val();
                editableTheme.styles[style][prop] = newValue;
                console.log('editableTheme.styles', editableTheme);
                this.bp.apps.themes.applyTheme(editableTheme); // re-apply updated theme
            }.bind(this));

            // ➕ Add new property
            themeStylesTable.on('click', '.add-prop-btn', function (e) {
                let style = $(e.target).data('style');
                let row = $(e.target).closest('div');
                let propInput = row.find('.new-prop-name');
                let valInput = row.find('.new-prop-value');

                let newProp = propInput.val().trim();
                let newVal = valInput.val().trim();

                if (newProp && newVal) {
                    editableTheme.styles[style][newProp] = newVal;
                    $('.themeSelect', this.profileWindow.content).trigger('change'); // re-render
                }
            }.bind(this));

            // ❌ Remove property
            themeStylesTable.on('click', '.remove-prop-btn', function (e) {
                let style = $(e.target).data('style');
                let prop = $(e.target).data('prop');
                delete editableTheme.styles[style][prop];
                $('.themeSelect', this.profileWindow.content).trigger('change'); // re-render
            }.bind(this));

            console.log('themeData', themeData);
        });

        // set value of themeSelect to current theme
        let currentTheme = this.bp.get('active_theme') || 'Light';
        $('.themeSelect', this.profileWindow.content).val(currentTheme);
        // trigger change to apply the theme
        $('.themeSelect', this.profileWindow.content).trigger('change');

        this.bp.on('settings::active_theme', 'update-dropdown', (data) => {
            // Update the dropdown to reflect the new active theme
            let activeTheme = this.bp.get('active_theme') || 'Light';
            //$('.themeSelect', this.profileWindow.content).val(activeTheme);
            //$('.themeSelect', this.profileWindow.content).trigger('change');
        });

        return this.profileWindow;


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

function isColorProperty(prop, value) {
    const colorProps = [
        'color', 'background', 'background-color', 'border-color',
        'outline-color', 'text-decoration-color', 'column-rule-color',
        'fill', 'stroke'
    ];

    const isColorKey = colorProps.includes(prop.toLowerCase());

    const colorRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
        || /^rgba?\(.+\)$/i
        || /^hsla?\(.+\)$/i
        || /^[a-z]+$/i; // named colors

    const isColorValue = colorRegex.test(value);

    return isColorKey || isColorValue;
}
