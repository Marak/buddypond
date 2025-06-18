import userSettings from './user-settings.js';
import updateProfilePicture from './updateProfilePicture.js';
//import audioSettings from './audio-settings.js';
//import PadEditor from '../../pad/PadEditor.js';

export default function bindUIEvents(options = {}) {

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
        profilePicturePreview.html(img);


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
            // get the custom theme styles
            //let customTheme = this.bp.settings.custom_theme;
            //this.bp.apps.themes.applyTheme(customTheme); // Apply selected theme
            // do nothing
            return;
        }
        this.bp.apps.themes.applyTheme(val); // Apply selected theme
        this.themeEditor(val);
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

    if (this.bp.me !== 'Guest') {
        this.apiKeys();
    }

    $('.loggedIn', this.profileWindow).hide();
    // $('.loggedIn').hide();




}