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

    // perform a fire-and-forget operation to increment the app install count
    this.client.incrementAppInstallCount(appName);

    // update the local app count immediately
    // find element with data-app attribute matching appName
    this.bp.apps.pad.data.appStats[appName] = this.bp.apps.pad.data.appStats[appName] || {};
    this.bp.apps.pad.data.appStats[appName].installCount = (this.bp.apps.pad.data.appStats[appName]?.installCount || 0) + 1;

    // console.log(`Stub: Adding app ${app} to desktop`);
    this.bp.play('desktop/assets/audio/APP-ADD.wav', { tryHard: 1 });
    let installedApps = this.bp.settings.apps_installed || {};
    // TODO: lookup actual app object from appstore.apps
    installedApps[appName] = app;
    this.bp.set('apps_installed', installedApps);
    this.bp.apps.desktop.addShortCut({
        name: appName,
        ...app
        //icon: app.icon,
        //label: app.label || appName,
    }, {
        onClick: () => {
            // console.log(`Opening app: ${appName}`, app);
            this.bp.open(app.app || appName, { context: app.context });
        }
    });
    // this.bp.apps.desktop.hideLoadingProgressIndicator();
    this.bp.apps.desktop.arrangeShortcuts();
    await sleep(777); // Simulate delay for UI update
}
