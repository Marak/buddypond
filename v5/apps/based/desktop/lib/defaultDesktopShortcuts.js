export default function defaultDesktopShortcuts() {

    // check if we have default apps, if not initialize them
    let installedApps = this.bp.settings.apps_installed || {};
    let installedTaskBarApps = this.bp.settings.taskbar_apps || {};

    // check for legacy v4 versions, may have malformed data for new UI
    // best way to check is if all .icon fields are missing from every entry
    let isLegacySettings = false;
    if (Object.keys(installedApps).length > 0) {
        console.log('Checking for legacy settings...', installedApps);
        isLegacySettings = Object.values(installedApps).every(app => !app.icon);
    }
    if (isLegacySettings) {
        installedApps = {};
    }


    console.log('installedTaskBarApps from settings', installedTaskBarApps)

    if (Object.keys(installedTaskBarApps).length === 0) {
        let defaultTaskBarApps = [
            'file-explorer',
            'pad',
            'buddylist',
            // 'pond',
            'portfolio',
        ];
        defaultTaskBarApps.forEach(appName => {
            let app = this.bp.apps.desktop.appList[appName];
            if (app) {
                console.log(`Adding default taskbar app: ${appName}`);
                installedTaskBarApps[appName] = {
                    app: app.app || appName,
                    context: app.context || 'default',
                    label: app.label || appName,
                    icon: app.icon || ''
                };
            } else {
                console.warn(`App ${appName} not found in desktop app list.`);
            }
        });
    }



    Object.keys(installedTaskBarApps).forEach(appName => {
        console.log('Adding taskbar app', appName);
        console.log(this.bp.apps.desktop.appList)
        let app = this.bp.apps.desktop.appList[appName];
        console.log('found app', app);
        app.id = appName; // ensure the app has an id for taskbar
        app.app = app.app || appName; // ensure the app has an app property
        // create new app object with necessary properties
        let _app = {
            ...app
        }
        /*
        _app.onClick = async (ev) => {
            let win = await this.bp.open(app.app || appName, { context: app.context });
            console.log('TaskBar.onClick', win);
            if (win.isMinimized) {
                win.restore();
                win.focus();
            } else {
                win.minimize();
            }
            ev.stopPropagation();
        }
            */

        if (_app) {
            console.log(`Adding default taskbar app: ${appName}`, _app);
            console.log(_app.onClick)
            this.bp.apps.ui.windowManager.taskBar.addItem(_app);

        } else {
            console.warn(`App ${appName} not found in desktop app list.`);
        }
    });


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