export default function defaultDesktopShortcuts() {

    // check if we have default apps, if not initialize them
    let installeApps = this.bp.settings.apps_installed || {};
    if (Object.keys(installeApps).length === 0) {
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
                installeApps[appName] = app;

                // this.bp.apps.desktop.addShortCut(app);
            } else {
                console.warn(`App ${appName} not found in desktop app list.`);
            }
        });

        this.bp.set('apps_installed', installeApps);

        // update the count of installed apps
        this.client.incrementAppInstallCount(Object.keys(installeApps));

    }

    let installedApps = bp.settings.apps_installed || {};
    if (Object.keys(installedApps).length > 0) {
        Object.keys(installedApps).forEach(appName => {
            let app = installedApps[appName];
            if (app) {
                bp.apps.desktop.addShortCut({
                    name: appName,
                    icon: app.icon || `desktop/assets/images/icons/icon_app_64.png`,
                    label: app.label || appName,
                    description: app.description || 'No description available'
                }, {
                    onClick: () => {
                        bp.open(app.app || appName, { context: app.context });
                    }
                });
            }
        });

    }

}