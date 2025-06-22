export default class Emulator {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.emulator = null;
        this.romData = null;
        // this.gameUrl = '';
        // this.gameIsRunning = false;
        this.emulatorWindows = {}; // Track open windows per context

        this.emulatorIcons = {
            nes: '/desktop/assets/images/icons/icon_nes_64.png',
            sega: '/desktop/assets/images/icons/icon_sega_64.png',
            snes: '/desktop/assets/images/icons/icon_snes_64.png',
            atari2600: '/desktop/assets/images/icons/icon_atari2600_64.png',
            n64: '/desktop/assets/images/icons/icon_n64_64.png',
        };

        return this;
    }

    async open({ context = 'nes' }) {


        if (!this.emulatorWindows[context]) {
            this.emulatorWindows[context] = [];
        }

        // Find an unused window slot or create a new one
        const windowIndex = this.emulatorWindows[context].length;
        const windowId = `emulators-${context}-${windowIndex + 1}`;

        // Prevent duplicates: check if a window with this ID exists and is still open
        if (this.emulatorWindows[context].some(w => w.id === windowId)) {
            console.log(`Emulator window already exists: ${windowId}`);
            return;
        }

        const emulatorWindow = this.createEmulatorWindow(context, windowId);
        this.emulatorWindows[context].push({ id: windowId, win: emulatorWindow });




        const content = emulatorWindow.content;
        const logo = document.createElement('img');
        logo.id = `emulator-logo-${context}`;
        logo.src = this.emulatorIcons[context] || this.emulatorIcons.nes;
        logo.style.position = 'absolute';
        logo.style.top = '50%';
        logo.style.left = '50%';
        logo.style.transform = 'translate(-50%, -50%)';
        logo.style.zIndex = '1000'; // Ensure it floats above the iframe
        // logo.style.display = 'none'; // Initially hidden until emulator is ready
        logo.style.opacity = '0.8'; // Optional: slight transparency
        logo.style.maxWidth = '50%'; // Adjust size as needed
        logo.style.maxHeight = '50%';

        // on click logo trigger randomGameButton click
        logo.onclick = () => {
            if (emulatorWindow.randomGameButton) {
                emulatorWindow.randomGameButton.click();
                logo.style.display = 'none'; // Hide after first click
            } else {
                console.warn('Random game button not found');
            }
        };

        logo.style.cursor = 'pointer'; // Change cursor to pointer for better UX
        console.log('Adding logo to emulator window:', logo);
        emulatorWindow.logo = logo; // Store reference to logo for later use
        // content.parentNode.style.position = 'relative'; // Ensure parent can position the logo
        content.parentNode.appendChild(emulatorWindow.logo);

        // Load game list based on context
        const games = await this.bp.load(`${cdnUrl}/${context}.json`);
        this.setupGameSelector(emulatorWindow, games, context);
        this.setupSearchInput(emulatorWindow, games, context);
        this.setupRandomGameButton(emulatorWindow, games, context);
    }

    createEmulatorWindow(context, windowId) {
        const emulatorTitles = {
            nes: 'NES',
            sega: 'Sega Genesis',
            n64: 'Nintendo 64',
            snes: 'Super Nintendo',
            atari2600: 'Atari 2600'
        };

        return this.bp.apps.ui.windowManager.createWindow({
            id: windowId, // Use passed-in ID
            app: 'emulator', // Use context to differentiate apps
            title: emulatorTitles[context] || 'Emulator',
            // label: emulatorTitles[context] || 'Emulator',
            x: 50,
            y: 100,
            width: 600,
            height: 500,
            minWidth: 600,
            minHeight: 500,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/emulator/emulator-js/index.html',
            icon: this.emulatorIcons[context] || this.emulatorIcons.nes,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onClose: () => {
                // on close we need to set this.emulatorWindows context to null
                this.emulatorWindows[context] = this.emulatorWindows[context]
                    .filter(w => w.id !== windowId);
            },
            onMessage: message => {
                console.log('Emulator Message:', message);
                if (message.event === 'ready') {
                    console.log('Emulator is ready');
                    //this.logo.style.display = 'block'; // Show logo when emulator is ready
                }
            },
            onLoad: win => {
                if (win.gameUrl) {
                    win.sendMessage({
                        event: 'startGame',
                        message: 'Hello from Emulator',
                        gameSystem: context, // Dynamically assign game system
                        gameUrl: win.gameUrl
                    });
                    win.gameIsRunning = true;
                    win.logo.style.display = 'none'; // Show logo when emulator is ready

                }
            }
        });
    }

    setupGameSelector(emulatorWindow, games, context) {
        const content = emulatorWindow.content;
        const gameSelector = document.createElement('div');
        gameSelector.classList.add('menu-bars');
        gameSelector.innerHTML = '<select id="loadROM">Load ROM</select>';
        content.parentNode.insertBefore(gameSelector, content);

        games.forEach(game => {
            if (context === 'sega') {
                $('#loadROM').append(`<option value="${cdnUrl}/${context}/${game}">${game}</option>`);

            } else {
                // nes legacy /roms/ subfolder
                $('#loadROM').append(`<option value="${cdnUrl}/${context}/roms/${game}">${game}</option>`);

            }
        });

        $(gameSelector).hide();
        $('#loadROM').on('change', e => {
            emulatorWindow.sendMessage({
                event: 'unloadGame',
                gameSystem: context,
                gameUrl: e.target.value
            });
            emulatorWindow.gameUrl = e.target.value;
            emulatorWindow.gameIsRunning = false;
        });
    }

    setupSearchInput(emulatorWindow, games, context) {
        const content = emulatorWindow.content;
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchInput';
        searchInput.placeholder = `Search for a ${context.toUpperCase()} game`;
        searchInput.style = 'font-size: 2.5em; background-color: black; color: white;';
        content.parentNode.insertBefore(searchInput, content);

        $(searchInput).autocomplete({
            source: games,
            select: (e, ui) => this.handleGameSelection(ui.item.value, emulatorWindow, context)
        }).data('ui-autocomplete')._renderItem = (ul, item) => {
            const prettyLabel = item.label.replace(/_/g, ' ').replace(/\.(nes|zip|smd|bin)/, '');
            return $("<li>")
                .attr("data-value", item.value)
                .append($("<div>").text(prettyLabel))
                .appendTo(ul);
        };
    }

    setupRandomGameButton(emulatorWindow, games, context) {
        const content = emulatorWindow.content;
        const randomGameButton = document.createElement('button');
        randomGameButton.innerHTML = 'Random Game';
        randomGameButton.classList.add('button');
        randomGameButton.style.width = '100%';
        randomGameButton.onclick = () => this.handleRandomGame(games, emulatorWindow, context);

        emulatorWindow.randomGameButton = randomGameButton; // Store reference for later use

        content.parentNode.insertBefore(randomGameButton, content);
    }

    handleGameSelection(gameName, emulatorWindow, context) {
        let gameUrl = `${cdnUrl}/${context}/roms/${gameName}`;
        if (context === 'sega') {
            gameUrl = `${cdnUrl}/${context}/${gameName}`;
        }
        emulatorWindow.gameUrl = gameUrl;
        emulatorWindow.gameIsRunning = false;

        emulatorWindow.sendMessage({
            event: 'unloadGame',
            gameSystem: context,
            gameUrl: gameUrl
        });
        // emulatorWindow.randomGameButton.style.display = 'none'; // Hide random game button when a game is selected
        emulatorWindow.logo.style.display = 'block'; // Show logo while loading game
        setTimeout(() => {
            emulatorWindow.sendMessage({
                event: 'startGame',
                message: 'Hello from Emulator',
                gameSystem: context,
                gameUrl: emulatorWindow.gameUrl
            });
            emulatorWindow.gameIsRunning = true;

        }, 200);

        // this.logo.style.display = 'none'; // Show logo when emulator is ready

    }

    handleRandomGame(games, emulatorWindow, context) {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        emulatorWindow.logo.style.display = 'none'; // Show logo while loading game
        this.handleGameSelection(randomGame, emulatorWindow, context);
    }

    async loadROM(url) {
        try {
            const response = await fetch(url);
            this.romData = new Uint8Array(await response.arrayBuffer());
            this.bp.log('ROM loaded successfully');
        } catch (error) {
            this.bp.log('Error loading ROM:', error);
        }
    }

    startEmulator() {
        if (this.romData) {
            this.emulator.loadROM(this.romData);
            this.emulator.start();
            this.bp.log('Emulator started');
        } else {
            this.bp.log('No ROM loaded');
        }
    }

    stopEmulator() {
        if (this.emulator) {
            this.emulator.stop();
            this.bp.log('Emulator stopped');
        }
    }
}

let cdnBase64 = 'aHR0cDovL2tyYW1lcmljYS1pbmR1c3RyaWVzLmItY2RuLm5ldA==';
cdnBase64 = 'aHR0cHM6Ly9rcmFtZXJpY2EtaW5kdXN0cmllcy5iLWNkbi5uZXQ=';
const cdnUrl = atob(cdnBase64);
