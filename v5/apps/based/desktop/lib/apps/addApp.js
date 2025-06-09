let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function addApp(appName, app) {

    if (!appName) {
        console.error('No app name provided');
        return;
    }

    if (!app) {
        console.log('this.bp.apps.desktop', this.bp.apps.desktop)
        // if no app is provided, look up the app in the appstore
        app = this.bp.apps.desktop.appList[appName];
    }

    if (!app) {
        console.error(`App ${appName} not found in appstore`);
        return;
    }
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
            this.bp.open(appName);
        }
    });
    // this.bp.apps.desktop.hideLoadingProgressIndicator();
    this.bp.apps.desktop.arrangeShortcuts();
    await sleep(777); // Simulate delay for UI update
}
