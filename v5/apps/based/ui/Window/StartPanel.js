/* StartPanel.js - Marak Squires 2025 - BuddyPond */
export default class StartPanel {
    constructor({ onAppLaunch, bp } = {}) {
        this.onAppLaunch = onAppLaunch || function () { };
        this.bp = bp;
        this.panelElement = null;
    }

    open() {
        console.log('Opening start panel', this.panelElement);
        if (this.panelElement) {
            // if the panel is already open, close it first
            this.close();
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'start-panel';

        const searchInput = document.createElement('input');
        searchInput.id = 'start-panel-search';
        searchInput.className = 'start-panel-search';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search apps...';

        const recentSection = document.createElement('div');
        recentSection.className = 'start-panel-section';
        recentSection.innerHTML = `<h3>Recent Apps</h3>`;
        const recentGrid = document.createElement('div');
        recentGrid.className = 'start-panel-grid';
        recentSection.appendChild(recentGrid);

        const allSection = document.createElement('div');
        allSection.className = 'start-panel-section';
        allSection.innerHTML = `<h3>All Apps</h3>`;
        const allGrid = document.createElement('div');
        allGrid.className = 'start-panel-grid';
        allSection.appendChild(allGrid);

        panel.appendChild(searchInput);
        panel.appendChild(recentSection);
        panel.appendChild(allSection);

        document.body.appendChild(panel);
        this.panelElement = panel;

        // Populate recent apps (stub)
        const recentApps = (window.bp?.apps?.ui?.recentApps || []).slice(0, 10);
        console.log('Recent apps:', recentApps);
        recentApps.forEach(appData => {
            //appData.app = appData.app || appName; // Ensure appName is available
            //appData.id = appData.id || appName; // Ensure id is available
            console.log('Adding recent app:', appData);
            const app = this.createAppTile(appData);
            recentGrid.appendChild(app);
        });

        // Populate all apps (stub)
        const appList = window.bp?.apps?.desktop?.appList || {};

        // TODO: we should have a sort on here, maybe preserve appList order itself to keep it simple
        const allAppEntries = Object.entries(appList);
        allAppEntries.forEach(([appName, appData]) => {
            appData.app = appData.app || appName; // Ensure appName is available
            appData.id = appData.id || appName; // Ensure id is available
            const app = this.createAppTile(appData, appData.icon);
            allGrid.appendChild(app);
        });

        // Live search filtering
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            allGrid.querySelectorAll('.start-panel-app').forEach(el => {
                const label = el.dataset.name.toLowerCase();
                let _app = this.bp.apps.desktop.appList[el.dataset.id];
                console.log('Searching app:', el.dataset.app, _app);
                let showResult = false;
                if (_app) {
                    console.log('Found app in appList', _app);
                    // first search the label
                    if (label.includes(query)) {
                        showResult = true;
                    }
                    // then search the category
                    if (!showResult && _app.categories) {
                        console.log('App has categories', _app.categories);
                        // _app.category is an array of strings, so we need to check if any of them match
                        showResult = _app.categories.some(cat => cat.toLowerCase().includes(query));
                    }
                }

                console.log('el.dataset.name', el.dataset, 'query', query);
                if (showResult) {
                    el.style.display = 'flex'
                } else {
                    el.style.display = 'none';
                }
                // el.style.display = label.includes(query) ? '' : 'none';
            });
        });

        this.closeEventHandler = (event) => {
            // console.log('click event target', event.target);
            if ($(event.target).hasClass('taskbar-item')) {
                // If the click is inside the panel or on the search input, do nothing
                return;
            }
            // close the panel if it exists
            if (this.panelElement && !this.panelElement.contains(event.target) && event.target !== searchInput) {
                this.close();
            }
            // If the click is outside the panel and not on the search input, close the panel
            // .taskbar-item, .taskbar-container
        }
        // add event listener to close panel on click outside
        document.addEventListener('click', this.closeEventHandler);

        // focus on the start-panel-search input
        searchInput.focus();

    }

    close() {
        if (this.panelElement) {
            console.log('Closing start panel');
            this.panelElement.remove();
            this.panelElement = null;
        }
        // remove the event listener for closing the panel
        if (this.closeEventHandler) {
            document.removeEventListener('click', this.closeEventHandler);
            this.closeEventHandler = null;
        }
    }

    createAppTile(appData, icon = 'icons/default.png') {
        console.log('Creating app tile for:', appData);
        let name = appData.id || appData.appName || appData.name || appData.label || 'Unknown App';
        icon = appData.icon || icon || 'icons/default.png';
        const tile = document.createElement('div');
        tile.className = 'start-panel-app';
        tile.dataset.name = name;
        tile.dataset.id = appData.id || appData.app || name;
        tile.dataset.app = appData.app || appData.id || name;

        const img = document.createElement('img');
        img.src = icon;
        img.alt = name;

        const label = document.createElement('div');
        label.textContent = appData.label || name;

        tile.appendChild(img);
        tile.appendChild(label);

        tile.onclick = async () => {
            console.log('Launching app:', appData);
            let win = await this.bp.open(appData.app || appData.id, { context: appData.context });
            this.onAppLaunch(name);
            this.close();
        };

        return tile;
    }
}

