export default function loadUserApps() {
    // TODO: load from saved profile
    if (this.bp.me === 'Marak') {
        this.bp.apps.desktop.addShortCut({
            name: 'admin',
            icon: `desktop/assets/images/icons/icon_audio-player_64.png`,
            label: 'Admin',
        }, {
            onClick: () => {
                bp.open('admin', {
                    context: null
                });
            }
        });

        window.arrangeDesktop();
    
    }

}