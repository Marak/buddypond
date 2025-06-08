export default function createShortcut() {
    if (!this.createShortCutWindow) {
        let shortCutHtml = `
        <div class="bp-create-shortcut-container">
            <h2>Create Shortcut</h2>
            <form id="create-shortcut-form" action="#" method="post">
                <div class="bp-form-group">
                    <label>Shortcut Type:</label>
                    <div class="bp-shortcut-type">
                        <label><input type="radio" name="shortcut-type" value="url" checked> URL</label>
                        <label><input type="radio" name="shortcut-type" value="app"> App</label>
                        <label><input type="radio" name="shortcut-type" value="buddyscript"> Buddyscript</label>
                    </div>
                </div>
                <div class="bp-form-group">
                    <label for="shortcut-name">Shortcut Name:</label>
                    <input type="text" id="shortcut-name" name="shortcut-name" required>
                </div>
                <div class="bp-form-group bp-app-select-group" style="display: none;">
                    <label for="shortcut-apps">Select App:</label>
                    <select id="shortcut-apps" name="shortcut-apps">
                        <option value="">Select App</option>
                        ${Object.keys(this.bp.apps.desktop.appList).map(appName => `<option value="${appName}">${this.bp.apps.desktop.appList[appName].label || appName}</option>`).join('')}
                    </select>
                </div>
                <div class="bp-form-group bp-command-group">
                    <label for="shortcut-command">Command:</label>
                    <input type="text" id="shortcut-command" name="shortcut-command" required>
                </div>
                <div class="bp-form-group">
                    <label for="shortcut-icon">Icon URL:</label>
                    <input type="text" id="shortcut-icon" name="shortcut-icon" placeholder="Optional">
                </div>
                <div class="bp-form-group">
                    <label for="shortcut-description">Description:</label>
                    <textarea id="shortcut-description" name="shortcut-description" placeholder="Optional"></textarea>
                </div>
                <div class="bp-form-group bp-form-actions">
                    <button type="submit" class="bp-btn bp-btn-primary bp-create-shortcut-btn">Create Shortcut</button>
                    <button type="button" class="bp-btn bp-btn-secondary" id="cancel-shortcut">Cancel</button>
                </div>
            </form>
        </div>`;

        this.createShortCutWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'create-shortcut',
            title: 'Create Shortcut',
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 250,
            y: 75,
            width: 600,
            height: 400,
            minWidth: 400,
            minHeight: 300,
            parent: $('#desktop')[0],
            content: shortCutHtml,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                // Clean up if needed
            }
        });

        // Toggle app dropdown visibility based on shortcut type
        $('#create-shortcut-form input[name="shortcut-type"]').on('change', (e) => {
            const shortcutType = e.target.value;
            const appSelectGroup = $('.bp-app-select-group');
            const commandGroup = $('.bp-command-group');
            if (shortcutType === 'app') {
                appSelectGroup.show();
                commandGroup.hide();
                $('#shortcut-command').prop('required', false);
                $('#shortcut-apps').prop('required', true);
            } else {
                appSelectGroup.hide();
                commandGroup.show();
                $('#shortcut-command').prop('required', true);
                $('#shortcut-apps').prop('required', false);
            }
        });

        $('#create-shortcut-form').on('submit', (e) => {
            e.preventDefault();
            return false;
        });

        $('.bp-create-shortcut-btn').on('click', (e) => {
            e.preventDefault();
            const shortcutType = $('input[name="shortcut-type"]:checked').val();
            const name = $('#shortcut-name').val().trim();
            const appName = $('#shortcut-apps').val();
            const command = $('#shortcut-command').val().trim();
            const icon = $('#shortcut-icon').val().trim();
            const description = $('#shortcut-description').val().trim();

            // Validation
            if (!name) {
                alert('Shortcut Name is required.');
                return;
            }
            if (shortcutType === 'app' && !appName) {
                alert('Please select an app.');
                return;
            }
            if ((shortcutType === 'url' || shortcutType === 'buddyscript') && !command) {
                alert('Command is required for URL or Buddyscript shortcuts.');
                return;
            }

            // Create the shortcut object
            const shortcut = {
                name: name,
                label: name,
                shortcutType: shortcutType,
                icon: icon || 'desktop/assets/images/icons/icon_default_64.png', // Default icon if none provided
                description: description || '',
                target: shortcutType === 'app' ? this.bp.apps.desktop.appList[appName]?.onClick || `bp.open('${appName}')` : command,
                parameters: {
                    icon: icon || '',
                    description: description || ''
                }
            };

            try {
                saveShortCut.call(this, shortcut);
            } catch (error) {
                console.error('Error creating shortcut:', error);
                alert('Failed to create shortcut. Please check the console for details.');
            }
            return false;
        });

        $('#cancel-shortcut').on('click', () => {
            this.createShortCutWindow.close();
        });
    } else {
        this.createShortCutWindow.focus();
        this.createShortCutWindow.restore();
    }
}

function saveShortCut(shortcut) {
    console.log('Saving shortcut:', shortcut);
    // Save to localStorage
    const shortcuts = JSON.parse(localStorage.getItem('bp-shortcuts') || '{}');
    shortcuts[shortcut.name] = {
        label: shortcut.label,
        shortcutType: shortcut.shortcutType,
        target: shortcut.target,
        icon: shortcut.icon,
        description: shortcut.parameters.description
    };
    localStorage.setItem('bp-short великйцут', JSON.stringify(shortcuts));

    // Call addShortCut to create the shortcut on the desktop
    this.bp.apps.desktop.addShortCut({
        name: shortcut.name,
        label: shortcut.label,
        icon: shortcut.icon,
        description: shortcut.description,
        onClick: shortcut.shortcutType === 'url' ? () => window.open(shortcut.target, '_blank') :
                 shortcut.shortcutType === 'app' ? shortcut.target :
                 () => eval(shortcut.target), // Note: eval for buddyscript; replace with safer execution
        textIcon: !shortcut.icon ? shortcut.label.charAt(0).toUpperCase() : null
    });

    // Close the window
    this.createShortCutWindow.close();
}