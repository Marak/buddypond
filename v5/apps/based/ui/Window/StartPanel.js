/* StartPanel.js - Marak Squires 2025 - BuddyPond */
export default class StartPanel {
    constructor({ onAppLaunch, bp } = {}) {
        this.onAppLaunch = onAppLaunch || function () { };
        this.bp = bp;
        this.panelElement = null;
    }

    open() {
        if (this.panelElement) {
            this.close();
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'start-panel';
        panel.style.display = 'none'; // hide initially for animation

        const searchInput = document.createElement('input');
        searchInput.id = 'start-panel-search';
        searchInput.className = 'start-panel-search';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search apps...';
        searchInput.autocomplete = 'off';

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
        // Animate it in
        $(panel).css({
            display: 'block',
            opacity: 1,
            transform: 'translateY(100%)',
            transition: 'all 300ms ease-out'
        });

        requestAnimationFrame(() => {
            $(panel).css({
                opacity: 1,
                transform: 'translateY(0)'
            });
        });

        const recentApps = (window.bp?.apps?.ui?.recentApps || []).slice(0, 10);
        recentApps.forEach(appData => {
            const app = this.createAppTile(appData);
            recentGrid.appendChild(app);
        });

        const appList = window.bp?.apps?.desktop?.appList || {};
        const allAppEntries = Object.entries(appList);
        allAppEntries.forEach(([appName, appData]) => {
            if (appData.adminOnly && this.bp.me !== 'Marak') return;
            appData.app = appData.app || appName;
            appData.id = appData.id || appName;
            const app = this.createAppTile(appData, appData.icon);
            allGrid.appendChild(app);
        });

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();

            recentSection.style.display = query.length > 0 ? 'none' : '';
            allGrid.querySelectorAll('.start-panel-app').forEach(el => {
                const label = el.dataset.name.toLowerCase();
                const _app = this.bp.apps.desktop.appList[el.dataset.id];
                let showResult = label.includes(query);
                if (!showResult && _app?.categories) {
                    showResult = _app.categories.some(cat => cat.toLowerCase().includes(query));
                }
                el.style.display = showResult ? 'flex' : 'none';
            });
        });

        this.closeEventHandler = (event) => {
            if ($(event.target).hasClass('taskbar-item')) return;
            if (this.panelElement && !this.panelElement.contains(event.target) && event.target !== searchInput) {
                this.close();
            }
        };

        document.addEventListener('click', this.closeEventHandler);
        if (!this.bp.isMobile()) {
            // Remark: We don't want to focus the search input on mobile devices, since this brings up the keyboard
            searchInput.focus();
        }
    }


    close() {
        if (this.panelElement) {
            const $panel = $(this.panelElement);

            $panel.css({
                transform: 'translateY(0)',
                opacity: 1,
                transition: 'all 300ms ease-in'
            });

            requestAnimationFrame(() => {
                $panel.css({
                    transform: 'translateY(100%)',
                    opacity: 1
                });

                setTimeout(() => {
                    $panel.remove();
                    this.panelElement = null;
                }, 300); // match transition duration
            });
        }

        if (this.closeEventHandler) {
            document.removeEventListener('click', this.closeEventHandler);
            this.closeEventHandler = null;
        }
    }

    createAppTile(appData, icon) {
        // console.log('Creating app tile for:', appData);
        let name = appData.id || appData.appName || appData.name || appData.label || 'Unknown App';
        icon = appData.icon || icon;
        const tile = document.createElement('div');
        tile.className = 'start-panel-app';
        tile.dataset.name = name;
        tile.dataset.id = appData.id || appData.app || name;
        tile.dataset.app = appData.app || appData.id || name;
        if (!icon && appData.type === 'buddy' && this.bp.apps.buddylist) {
            // Remark: special case for default dicebar avatars for buddies
            let defautSvgAvatar = this.bp.apps.buddylist.defaultAvatarSvg(appData.id.replace('messages/', ''));
            const svgContainer = document.createElement('div');
            svgContainer.className = 'start-panel-app-icon';
            svgContainer.innerHTML = defautSvgAvatar;
            tile.appendChild(svgContainer);
        } else {
            const img = document.createElement('img');
            img.src = icon;
            img.alt = name;
            tile.appendChild(img);
        }

        const label = document.createElement('div');
        label.textContent = appData.label || name;

        tile.appendChild(label);

        tile.onclick = async () => {
            // TODO: this should be handled when adding the item to the recent apps list
            if (appData.type === 'buddy' && appData.app === 'buddylist') {
                appData.context = appData.id.replace('messages/', '');
            }
            let win = await this.bp.open(appData.app || appData.id, { context: appData.context, type: appData.type });
            this.onAppLaunch(name);
            this.close();
        };

        return tile;
    }
}

// Enable keyboard navigation for the start panel
StartPanel.prototype.enableKeyboardNavigation = function (panel, searchInput) {
    // Add keyboard navigation
    let currentIndex = -1;
    let appTiles = [];

    function updateTilesList() {
        appTiles = Array.from(panel.querySelectorAll('.start-panel-app'))
            .filter(el => el.style.display !== 'none');
    }
    updateTilesList();

    // Add highlight class
    function focusTile(index) {
        console.log('Focusing tile at index:', index);
        appTiles.forEach((el, i) => {
            el.classList.toggle('focused', i === index);
            if (i === index) el.scrollIntoView({ block: 'nearest' });
        });
        currentIndex = index;
    }

    // Clear highlight
    function clearFocus() {
        appTiles.forEach(el => el.classList.remove('focused'));
        currentIndex = -1;
    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            updateTilesList();
            if (appTiles.length > 0) {
                focusTile(0);
                e.preventDefault();
            }
        }
    });

    let ROW_LENGTH = 5;

    panel.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
        if (appTiles.length === 0) return;


        // tab key should select the first tile
        if (e.key === 'Tab') {
            // TODO: shift tab should select the last tile
            if (currentIndex === -1) {
                focusTile(0);
            } else {
                // Move to next tile
                let nextIndex = currentIndex + 1;
                if (nextIndex < appTiles.length) {
                    focusTile(nextIndex);
                } else {
                    // Stay on last tile if next tile is out of bounds
                    focusTile(appTiles.length - 1);
                }
            }
            e.preventDefault();
            return;
        }

        if (e.key === 'ArrowDown') {
            // ✅ If nothing is focused, focus first tile
            if (currentIndex === -1) {
                focusTile(0);
            } else {
                // ✅ Move down one row
                let nextIndex = currentIndex + ROW_LENGTH;
                if (nextIndex < appTiles.length) {
                    focusTile(nextIndex);
                } else {
                    // Stay on last tile if next row is out of bounds
                    focusTile(appTiles.length - 1);
                }
            }
            e.preventDefault();
        }

        if (e.key === 'ArrowUp') {
            if (currentIndex === -1) {
                focusTile(0);
            } else {
                // ✅ Move up one row
                let prevIndex = currentIndex - ROW_LENGTH;
                if (prevIndex >= 0) {
                    focusTile(prevIndex);
                } else {
                    // Stay on first tile if already in top row
                    focusTile(0);
                }
            }
            e.preventDefault();
        }

        if (e.key === 'ArrowRight') {
            if (currentIndex === -1) {
                focusTile(0);
            } else {
                focusTile(Math.min(currentIndex + 1, appTiles.length - 1));
            }
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft') {
            if (currentIndex === -1) {
                focusTile(0);
            } else {
                focusTile(Math.max(currentIndex - 1, 0));
            }
            e.preventDefault();
        }

        if (e.key === 'Enter' && currentIndex >= 0) {
            appTiles[currentIndex].click();
            e.preventDefault();
        }

        if (e.key === 'Escape') {
            clearFocus();
            searchInput.focus();
        }
    });
}