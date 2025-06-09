export default function loadUserApps() {
    // TODO: load from saved profile
    if (this.bp.me === 'Marak') { // TODO: admin rbac checks
        // install Admin if not already installed
        let installedApps = this.bp.settings.apps_installed || {};
        console.log('installedApps', installedApps);
        if (!installedApps['admin']) {
            this.bp.apps.desktop.addApp('admin');
        }
        window.arrangeDesktop();
    }
}