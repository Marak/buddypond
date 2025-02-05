export default class Emulator {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.emulator = null;
        this.romData = null;
        this.gameUrl = '';
        this.gameIsRunning = false;
        return this;
    }

    async open({ context = 'nes' }) {
        const emulatorWindow = this.createEmulatorWindow(context);
        //alert(context); // Debugging purpose to check the context
       
        // Load game list based on context
        const games = await this.bp.load(`${cdnUrl}/${context}.json`);
        this.setupGameSelector(emulatorWindow, games, context);
        this.setupSearchInput(emulatorWindow, games, context);
        this.setupRandomGameButton(emulatorWindow, games, context);
    }

    createEmulatorWindow(context) {
        const emulatorTitles = {
            nes: 'NES',
            sega: 'Sega Genesis'
        };

        const emulatorIcons = {
            nes: '/desktop/assets/images/icons/icon_nes_64.png',
            sega: '/desktop/assets/images/icons/icon_sega_64.png'
        };

        return this.bp.apps.ui.windowManager.createWindow({
            id: `emulators-${context}`,
            title: emulatorTitles[context] || 'Emulator',
            x: 50,
            y: 100,
            width: 600,
            height: 500,
            minWidth: 600,
            minHeight: 500,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/emulator/emulator-js/index.html',
            icon: emulatorIcons[context] || emulatorIcons.nes,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {},
            onMessage: message => {
                console.log('Emulator Message:', message);
                if (message.event === 'ready') {
                    console.log('Emulator is ready');
                }
            },
            onLoad: win => {
                if (this.gameUrl) {
                    win.sendMessage({
                        event: 'startGame',
                        message: 'Hello from Emulator',
                        gameSystem: context, // Dynamically assign game system
                        gameUrl: this.gameUrl
                    });
                    this.gameIsRunning = true;
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
            this.gameUrl = e.target.value;
            this.gameIsRunning = false;
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
        content.parentNode.insertBefore(randomGameButton, content);
    }

    handleGameSelection(gameName, emulatorWindow, context) {
        let gameUrl = `${cdnUrl}/${context}/roms/${gameName}`;
        if (context === 'sega') {
            gameUrl = `${cdnUrl}/${context}/${gameName}`;
        }
        this.gameUrl = gameUrl;
        this.gameIsRunning = false;
        
        emulatorWindow.sendMessage({
            event: 'unloadGame',
            gameSystem: context,
            gameUrl: gameUrl
        });

        setTimeout(() => {
            emulatorWindow.sendMessage({
                event: 'startGame',
                message: 'Hello from Emulator',
                gameSystem: context,
                gameUrl: this.gameUrl
            });
            this.gameIsRunning = true;
        }, 200);
    }

    handleRandomGame(games, emulatorWindow, context) {
        const randomGame = games[Math.floor(Math.random() * games.length)];
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
