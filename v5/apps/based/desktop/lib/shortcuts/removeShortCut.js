export default function removeShortCut(appName, app) {
    console.log(`Removing shortcut for app: ${appName}`, app);
    // Find and remove a shortcut based on the app name
    const shortcuts = Array.from(this.shortCutsContainer.children);
    const shortcut = shortcuts.find(el => $(el).data('app') === appName);
    if (shortcut) {
        this.shortCutsContainer.removeChild(shortcut);
    }

    // TODO: add config option when removing to either target desktop or chatWindowButtons, or both
    // deleting a shortcut from the desktop should not remove it from chat windows
    // deleting a shortcut from chat windows should not remove it from the desktop
    // uninstalling from appstore should remove it from both
    if (app.chatWindowButton) {
        // removes the shortcut from chat windows
        if (this.bp.apps.desktop.enabledChatWindowButtons) {
            // iterate the enabledChatWindowButtons and remove any entries where app.label matches button.text
            this.bp.apps.desktop.enabledChatWindowButtons = this.bp.apps.desktop.enabledChatWindowButtons.filter(button => button.text !== app.label);
            //this.bp.apps.desktop.enabledChatWindowButtons.push(chatButton);
        }
        // removes the shortcut from buddylist chat windows
        if (this.bp.apps.buddylist.options.chatWindowButtons) {
            // iterate the chatWindowButtons and remove any entries where app.label matches button.text
            this.bp.apps.buddylist.options.chatWindowButtons = this.bp.apps.buddylist.options.chatWindowButtons.filter(button => button.text !== app.label);
            //this.bp.apps.buddylist.options.chatWindowButtons.push(chatButton);
        }

        let chatWindows = this.bp.apps.ui.windowManager.findWindows({
            app: 'buddylist',
            type: app.chatWindowButton
        });

        // removes from open windows
        chatWindows.forEach((chatWindow) => {
            if (chatWindow.buttonBar) {
                chatWindow.buttonBar.removeButton(app.label);
            } else {
                console.warn('No buttonBar found for pond chat window', chatWindow);
            }
        });
    }


}