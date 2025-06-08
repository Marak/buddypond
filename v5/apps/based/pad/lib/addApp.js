let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function addApp(appName, app) {
    console.log(`Stub: Adding app ${app} to desktop`);
    this.bp.play('desktop/assets/audio/APP-ADD.wav');
    let installedApps = this.bp.settings.apps_installed || {};
    // TODO: lookup actual app object from appstore.apps
    installedApps[appName] = app;
    this.bp.set('apps_installed', installedApps);
    this.bp.apps.desktop.addShortCut({
        name: appName,
        icon: `desktop/assets/images/icons/icon_${appName}_64.png`,
        label: app.label || appName,
    }, {
        onClick: () => {
            desktop.ui.openWindow(appName);
        }
    });
    // this.bp.apps.desktop.hideLoadingProgressIndicator();
    this.bp.apps.desktop.arrangeShortcuts();
    await sleep(777); // Simulate delay for UI update
}
