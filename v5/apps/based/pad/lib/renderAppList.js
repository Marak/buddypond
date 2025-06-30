import appList from '../../desktop/lib/appList.js';

export default function renderAppList(appStats = {}) {
    const appContainer = $('.bp-pads-grid');
    const categoryContainer = $('.bp-pads-category-list');
    const isMobile = typeof bp !== 'undefined' && bp.isMobile && bp.isMobile();

    // appsInstalled is an object that holds installed apps
    let appsInstalled = this.bp?.settings?.apps_installed || {};

    // filter out any adminOnly: true apps if not admin
    if (!this.bp?.me?.isAdmin) {
        Object.keys(appList).forEach(appName => {
            if (appList[appName].adminOnly) {
                delete appList[appName];
            }
        });
    }

    // Get unique categories from appList
    let categories = new Set();
    Object.values(appList).forEach(app => {
        if (app.categories) {
            app.categories.forEach(category => categories.add(category));
        }
    });

    // empty the categoryContainer
    categoryContainer.empty();

    // Populate category buttons
    // TODO: sort categories alphabetically
    categories = Array.from(categories).sort();
    categories.forEach(category => {
        categoryContainer.append(`
            <button class="bp-pads-category-btn" data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `);
    });

    // Function to render a single app card
    function renderAppCard(name, app) {
        const isInstalled = !!appsInstalled[name];
        const primaryButtonText = isInstalled ? 'Open' : 'Install';
        const primaryButtonClass = isInstalled ? 'bp-pads-btn-open' : 'bp-pads-btn-install';
        const uninstallButton = isInstalled
            ? `<button class="bp-pads-btn bp-pads-btn-uninstall" data-app="${name}">Uninstall</button>`
            : '';

        let author = app.author || 'BuddyPond';
        if (app.authorUrl) {
            author = `<a href="${app.authorUrl}" target="_blank" rel="noopener noreferrer">${author}</a>`;
        }
        return `
            <div class="bp-pads-app" data-app="${name}">
                <img src="${app.icon}" alt="${app.label} icon" class="bp-pads-app-icon">
                <div class="bp-pads-app-info">
                    <h4 class="bp-pads-app-label">${app.label}</h4>
                    <p class="bp-pads-app-description">${app.description}</p>
                    <div class="bp-pads-app-actions">
                        <button class="bp-pads-btn ${primaryButtonClass}" data-app="${name}">${primaryButtonText}</button>
                        ${uninstallButton}
                    </div>
                    <div class="bp-pads-app-metadata">
                        <div class="bp-pads-app-author">
                            <span class="bp-pads-app-author-label">Author:</span>
                            <span class="bp-pads-app-author-value">${author}</span>
                        </div>
                        <div class="bp-pads-app-install-count">
                            <span class="bp-pads-app-install-count-label">Downloads:</span>
                            <span class="bp-pads-app-install-count-value">${appStats[name]?.installCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to update button to loading state
    function setButtonLoading(button, action) {
        const isInstall = action === 'install';
        button.addClass('bp-pads-btn-loading');
        button.text(isInstall ? 'Installing...' : 'Uninstalling...');
        button.css('cursor', 'wait');
        // Force repaint to ensure cursor updates
        button[0].offsetHeight; // Accessing offsetHeight triggers reflow
    }

    // Function to reset button state
    function resetButtonState(button, isInstalled) {
        button.removeClass('bp-pads-btn-loading');
        button.text(isInstalled ? 'Open' : 'Install');
        button.removeClass('bp-pads-btn-install bp-pads-btn-open');
        button.addClass(isInstalled ? 'bp-pads-btn-open' : 'bp-pads-btn-install');
        button.css('cursor', '');
    }

    // Function to render apps based on selected category
    function renderApps(selectedCategory = 'all') {
        appContainer.empty(); // Clear existing apps
        let appsToRender = Object.entries(appList);

        // Filter apps by category
        if (selectedCategory !== 'all' && selectedCategory !== 'installed') {
            appsToRender = appsToRender.filter(([_, app]) => app.categories && app.categories.includes(selectedCategory));
        }

        if (selectedCategory === 'installed') {
            appsToRender = appsToRender.filter(([name]) => appsInstalled[name]);
        }

        // Filter out desktop-only apps on mobile
        if (isMobile) {
            appsToRender = appsToRender.filter(([_, app]) => !app.desktopOnly);
        }

        // Render apps
        // sort appsToRender by label
        appsToRender.sort((a, b) => a[1].label.localeCompare(b[1].label));
        appsToRender.forEach(([name, app]) => {
            appContainer.append(renderAppCard(name, app));
        });
    }

    // Initial render
    let currentCategory = 'all';
    renderApps(currentCategory);

    // Handle category button clicks
    categoryContainer.on('click', '.bp-pads-category-btn', (ev) => {
        $('.bp-pads-category-btn').removeClass('bp-pads-category-active');
        $(ev.target).addClass('bp-pads-category-active');
        currentCategory = $(ev.target).data('category');
        renderApps(currentCategory);
        // scroll to top of app container
        $(this.padWindow.content).scrollTop(0);
    });

    // Handle app action button clicks
    appContainer.on('click', '.bp-pads-btn', async (ev) => {
        const button = $(ev.target);
        const appName = button.data('app');
        const app = appList[appName];
        if (!app) {
            console.warn(`App ${appName} not found in appList`);
            return;
        }

        const isInstalled = !!appsInstalled[appName];
        if (button.hasClass('bp-pads-btn-install')) {
            // Install action
            console.log(`Stub: Installing app ${appName}`);
            setButtonLoading(button, 'install');
            // this.bp.apps.desktop.showLoadingProgressIndicator(); // Use existing method
            // Simulate async operation (replace with actual addApp implementation)
            await this.bp.apps.desktop.addApp(appName, app);
            appsInstalled[appName] = app; // Update local state
            resetButtonState(button, true);
            // this.bp.apps.desktop.hideLoadingProgressIndicator();
            // Re-render app card to show Uninstall button
            $(`.bp-pads-app[data-app="${appName}"]`).replaceWith(renderAppCard(appName, app));
        } else if (button.hasClass('bp-pads-btn-open')) {
            // Open action
            console.log(`Stub: Opening app ${appName}`);
            //if (app.onClick) {
            try {
                // eval(app.onClick); // Note: eval is used for simplicity; replace with safer execution
                console.log(`Executing onClick for ${appName}`, app);

                if (app.app) {
                    // may have custom defined app name with context
                    // for example, emulator app uses this to open with context of system
                    this.bp.open(app.app, {
                        context: app.context || {},
                    });

                } else {

                    this.bp.open(appName);
                }

            } catch (e) {
                console.error(`Error executing onClick for ${appName}:`, e);
            }
        } else if (button.hasClass('bp-pads-btn-uninstall')) {
            // Uninstall action
            console.log(`Stub: Uninstalling app ${appName}`);
            setButtonLoading(button, 'uninstall');
            // this.bp.apps.desktop.showLoadingProgressIndicator();
            // Simulate async operation (replace with actual removeApp implementation)
            // remove the open button immediately
            // $(`.bp-pads-app[data-app="${appName}"]`).replaceWith(renderAppCard(appName, app)); // Update UI to show loading state
            let closestOpenButton = button.parent().find('.bp-pads-btn-open');
            console.log(closestOpenButton)
            closestOpenButton.remove();
            await this.bp.apps.desktop.removeApp(appName, app);
            delete appsInstalled[appName]; // Update local state
            resetButtonState(button, false);
            // this.bp.apps.desktop.hideLoadingProgressIndicator();
            // Re-render app card to hide Uninstall button
            $(`.bp-pads-app[data-app="${appName}"]`).replaceWith(renderAppCard(appName, app));
        }
    });
}