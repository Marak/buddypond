export default function createShortcut() {
    if (!this.createShortCutWindow) {
        let shortCutHtml = `
        <div class="bp-create-shortcut-container">
            <form id="create-shortcut-form" action="#" method="post">
                <div class="bp-form-group">
                    <label>Shortcut Type:</label>
                    <div class="bp-shortcut-type">
                        <label><input type="radio" name="shortcut-type" value="url" checked> URL</label>
                        <label><input type="radio" name="shortcut-type" value="app"> App</label>
                        <label><input type="radio" name="shortcut-type" value="buddyscript"> Buddyscript</label>
                    </div>
                </div>
                <div class="bp-form-group bp-shortcut-examples">
                    <!-- radio group of examples -->
                    <label>Examples:</label>
                    <div class="bp-shortcut-examples-list">
                        <label><input type="radio" name="shortcut-example" value="url" checked>Open a Website</label>
                        <label><input type="radio" name="shortcut-example" value="app">Open your own Pond</label>
                        <label><input type="radio" name="shortcut-example" value="buddyscript">Run a Buddyscript</label>
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
                <div class="bp-form-group bp-app-select-group">
                    <!-- context input, type input, output input -->
                    <label for="shortcut-context">Context:</label>
                    <input type="text" id="shortcut-context" name="shortcut-context" placeholder="Optional, e.g. 'chatWindow'" value="">
                    <label for="shortcut-type">Type:</label>
                    <input type="text" id="shortcut-type" name="shortcut-type" placeholder="Optional, e.g. 'pond'" value="pond">
                    <label for="shortcut-output">Output:</label>
                    <input type="text" id="shortcut-output" name="shortcut-output" placeholder="Optional, e.g. 'chat'" value="chat">
                </div>

                <div class="bp-form-group bp-url-group">
                    <label for="shortcut-url">URL:</label>
                    <input type="text" id="shortcut-url" name="shortcut-url" required>
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
            height: 600,
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
            onClose: () => {
                // Clean up if needed
                this.createShortCutWindow = null; // Clear reference on close
            }
        });

        // Toggle app dropdown visibility based on shortcut type
        $('#create-shortcut-form input[name="shortcut-type"]').on('change', (e) => {
            const shortcutType = e.target.value;
            const appSelectGroup = $('.bp-app-select-group');
            const commandGroup = $('.bp-command-group');
            const urlGroup = $('.bp-url-group');
            if (shortcutType === 'app') {
                appSelectGroup.show();
                commandGroup.hide();
                urlGroup.hide();
                $('#shortcut-command').prop('required', false);
                $('#shortcut-apps').prop('required', true);
            }

            if (shortcutType === 'buddyscript') {
                appSelectGroup.hide();
                commandGroup.show();
                urlGroup.hide();
                $('#shortcut-command').prop('required', true);
                $('#shortcut-apps').prop('required', false);
            }

            if (shortcutType === 'url') {
                urlGroup.show();
                appSelectGroup.hide();
                commandGroup.hide();
                $('#shortcut-command').prop('required', false);
                $('#shortcut-apps').prop('required', false);
            }
        });

        $('#create-shortcut-form').on('submit', (e) => {
            e.preventDefault();
            return false;
        });

        $('.bp-create-shortcut-btn').on('click', async (e) => {
            e.preventDefault();
            const shortcutType = $('input[name="shortcut-type"]:checked').val();
            const name = $('#shortcut-name').val().trim();
            const appName = $('#shortcut-apps').val();
            const command = $('#shortcut-command').val().trim();
            let icon = $('#shortcut-icon').val().trim();
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
            if ((shortcutType === 'buddyscript') && !command) {
                alert('Command is required for URL or Buddyscript shortcuts.');
                return;
            }
            if (shortcutType === 'url' && !$('#shortcut-url').val().trim()) {
                alert('URL is required for URL shortcuts.');
                return;
            }

            let onClick = null;

            if (shortcutType === 'app') {

                let context = $('#shortcut-context').val().trim() || '';
                console.log('appNameappName', appName)
                if (!icon) {
                    // attempt default app icon
                    icon = this.bp.apps.desktop.appList[appName]?.icon || 'desktop/assets/images/icons/icon_default_64.png';    
                }
                onClick = () => {
                    bp.open(appName, { context: context });
                }
            }

            if (shortcutType === 'buddyscript') {


                onClick = () => {
                    if (command) {
                        // Execute the Buddyscript command

                        let bs = this.bp.apps.buddyscript.parseCommand(command);
                        console.log('got back buddyscript command', bs);
                        if (bs.pipe) {
                        //if (now - messageTime < 10000) {
                        // pipeable / immediate run commands should only persist for 10 seconds
                            bs.pipe();
                        }

                    } else {
                        alert('Please enter a valid Buddyscript command.');
                    }
                }

            }

            if (shortcutType === 'url') {
                const url = $('#shortcut-url').val().trim();

                /*
                // going to be challeging to pull off with un-auth proxy
                // proxy requires a valid session for security reasons
                // fetch the .ico from url using proxy
                let metadata = null;
                try {
                    metadata = await fetchProxy.call(this, url, true, true);
                } catch (error) {
                    console.error('Error fetching URL metadata:', error);
                    alert('Failed to fetch URL metadata. Please check the console for details.');
                    return;
                }

                console.log('Fetched metadata:', metadata);
                */
                
                onClick = () => {
                    if (url) {
                        window.open(url, '_blank');
                    } else {
                        alert('Please enter a valid URL.');
                    }
                };
            }

            // Create the shortcut object
            const shortcut = {
                name: name,
                label: name,
                shortcutType: shortcutType,
                icon: icon || 'desktop/assets/images/icons/icon_default_64.png', // Default icon if none provided
                description: description || '',
                target: shortcutType === 'app' ? this.bp.apps.desktop.appList[appName]?.onClick || `bp.open('${appName}')` : command,
                onClick: onClick,
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
    // TODO: use app API instead
    // localStorage.setItem('bp-short', JSON.stringify(shortcuts));

    // Call addShortCut to create the shortcut on the desktop
    this.bp.apps.desktop.addShortCut({
        name: shortcut.name,
        label: shortcut.label,
        icon: shortcut.icon,
        description: shortcut.description,
        textIcon: !shortcut.icon ? shortcut.label.charAt(0).toUpperCase() : null
    }, {
      onClick: shortcut.onClick,

    });

    this.arrangeShortcuts(2, {
        rowWidth: 80,
        rowHeight: 100,
        x: 0, // TODO: we should start from the x and y position in our calculations
        y: 0,
        ignoreSavedPosition: false
    });    // Close the window
    this.createShortCutWindow.close();
}


async function fetchProxy(url, parseMetadata, showError) {
    //console.log('Fetching via proxy:', url);
    let proxyUrl = `${buddypond.buddyProxy}/api/fetch-metadata?url=${encodeURIComponent(url)}`;
    console.log('Proxy URL:', proxyUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds

    try {
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            'Authorization': `Bearer ${buddypond.qtokenid}`,
            'x-me': buddypond.me
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        //console.log('Proxy response:', data);
        if (parseMetadata) {
            if (data.metadata) {
                //console.log('Parsed metadata:', data.metadata);
                return data.metadata;
            } else {
                throw new Error('No metadata found in proxy response');
            }
        }
    }
    catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching via proxy:', error);
        if (showError) {
            alert(`Error fetching URL: ${error.message}`);
        }
        throw error; // Re-throw the error for further handling
    }
    return null; // Return null if no metadata is found
                
}