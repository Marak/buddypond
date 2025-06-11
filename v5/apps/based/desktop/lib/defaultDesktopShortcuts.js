export default function defaultDesktopShortcuts() {

    // check if we have default apps, if not initialize them
    let installedApps = this.bp.settings.apps_installed || {};
    if (Object.keys(installedApps).length === 0) {
        let defaultAppList = [
            'profile',
            'buddylist',
            'pad',
            'pond',
            'file-explorer',
            'youtube',
            'fluid-simulation',
            'coin',
            'portfolio',
        ];

        defaultAppList.forEach(appName => {
            let app = this.bp.apps.desktop.appList[appName];
            if (app) {
                console.log(`Adding default app shortcut: ${appName}`);
                // console.log(app);
                installedApps[appName] = app;

                // this.bp.apps.desktop.addShortCut(app);
            } else {
                console.warn(`App ${appName} not found in desktop app list.`);
            }
        });

        this.bp.set('apps_installed', installedApps);

        // update the count of installed apps
        this.client.incrementAppInstallCount(Object.keys(installedApps));

    }

    // let installedApps = bp.settings.apps_installed || {};
    if (Object.keys(installedApps).length > 0) {
        Object.keys(installedApps).forEach(appName => {
            let app = installedApps[appName];
            if (app) {
                // console.log(`Adding shortcut for installed app: ${appName}`, app);
                bp.apps.desktop.addShortCut({
                    name: appName,
                    ...app
                }, {
                    onClick: () => {
                        bp.open(app.app || appName, { context: app.context });
                    }
                });
            }
        });

    }

}