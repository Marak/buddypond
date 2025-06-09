let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function removeApp(appName, app) {

    this.bp.play('desktop/assets/audio/APP-REMOVE.wav');

    let installedApps = this.bp.settings.apps_installed || {};
    delete installedApps[appName];
    this.bp.set('apps_installed', installedApps);
    //desktop.ui.renderDesktopShortCuts();

    // alert('removing ' + appName);
    this.bp.apps.desktop.removeShortCut(appName);

    // desktop.ui.hideLoadingProgressIndicator();
    this.bp.apps.desktop.arrangeShortcuts();
    await sleep(777); // Simulate delay for UI update

}