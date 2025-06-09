export default function renameShortCut(appName, titleElement) {
    
    const newName = prompt('Enter new shortcut name:', titleElement.textContent);

    if (!newName || newName.trim() === '') {
        // console.warn('Renaming cancelled or invalid name provided.');
        return;
    }

    // TODO: forbidden Note check goes here ( no bad names in shortcuts )
    let shortcut = $(`.bp-desktop-shortcut[data-app="${appName}"]`);
    console.log(`Renaming shortcut ${shortcut} to ${newName}`);
    console.log(`Shortcut element:`, shortcut);

    /*
    // Update the shortcut name
    shortcut.name = newName;
    
    // Update the label if it exists
    if (shortcut.label) {
        shortcut.label = newName;
    }
        */
    
    //let titleElement = shortcut.find('.title');
    // Update the title element's text content
    titleElement.textContent = newName;

    let installed_apps = this.bp.get('apps_installed') || {};
    // Update the app label in the installed apps
    if (installed_apps[appName]) {
        installed_apps[appName].label = newName;
        this.bp.set('apps_installed', installed_apps);
    } else {
        console.warn(`App ${appName} not found in installed apps.`);
    }

    // Update the icon's title text
    /*
    const iconElement = document.querySelector(`.bp-desktop-shortcut[data-app="${shortcut.name}"] .title`);
    if (iconElement) {
        iconElement.textContent = newName;
    } else {
        console.warn(`Shortcut element for ${shortcut.name} not found.`);
    }
    */
    
    // Optionally, you can also update the app settings or any other related data
    //this.bp.set(`apps_installed.${shortcut.name}`, shortcut);
    
    // Play a sound effect for renaming
    //this.bp.play('desktop/assets/audio/APP-RENAME.wav');
    
    // Optionally, you can rearrange shortcuts if needed
    // this.bp.apps.desktop.arrangeShortcuts();
    
    console.log(`Shortcut renamed to ${newName}`);
};