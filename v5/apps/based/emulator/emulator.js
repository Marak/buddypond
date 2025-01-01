export default class Emulator {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.emulator = null;
        this.romData = null;
        this.gameUrl = '';
        this.gameIsRunning = false;
        return this;
    }

    async open() {
        const emulatorWindow = this.createEmulatorWindow();
        const games = await this.bp.load(`${cdnUrl}/nes.json`);
        this.setupGameSelector(emulatorWindow, games);
        this.setupSearchInput(emulatorWindow, games);
        this.setupRandomGameButton(emulatorWindow, games);
    }

    createEmulatorWindow() {
        return this.bp.apps.ui.windowManager.createWindow({
            id: 'emulators',
            title: 'NES',
            x: 50,
            y: 100,
            width: 600,
            height: 500,
            minWidth: 600,
            minHeight: 500,
            parent: $('#desktop')[0],
            iframeContent: '/v5/apps/based/emulator/emulator-js/index.html',
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
                    alert('Emulator is ready');
                }
            },
            onLoad: win => {
                if (this.gameUrl) {
                    win.sendMessage({
                        event: 'startGame',
                        message: 'Hello from Emulator',
                        gameSystem: 'nes',
                        gameUrl: this.gameUrl
                    });
                    this.gameIsRunning = true;
                }
            }
        });
    }

    setupGameSelector(emulatorWindow, games) {
        const content = emulatorWindow.content;
        const gameSelector = document.createElement('div');
        gameSelector.classList.add('menu-bars');
        gameSelector.innerHTML = '<select id="loadROM">Load ROM</select>';
        content.parentNode.insertBefore(gameSelector, content);
        games.forEach(game => {
            $('#loadROM').append(`<option value="${cdnUrl}/nes/roms/${game}">${game}</option>`);
        });
        $(gameSelector).hide();
        $('#loadROM').on('change', e => {
            emulatorWindow.sendMessage({
                event: 'unloadGame',
                gameSystem: 'nes',
                gameUrl: e.target.value
            });
            this.gameUrl = e.target.value;
            this.gameIsRunning = false;
        });
    }

    setupSearchInput(emulatorWindow, games) {
        const content = emulatorWindow.content;
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchInput';
        searchInput.placeholder = 'Search for a game';
        searchInput.style = 'font-size: 2.5em; background-color: black; color: white;';
        content.parentNode.insertBefore(searchInput, content);
        $(searchInput).autocomplete({
            source: games,
            select: (e, ui) => this.handleGameSelection(ui.item.value, emulatorWindow)
        }).data('ui-autocomplete')._renderItem = (ul, item) => {
            const prettyLabel = item.label.replace(/_/g, ' ').replace('.nes', '').replace('.zip', '');
            return $("<li>")
                .attr("data-value", item.value)
                .append($("<div>").text(prettyLabel))
                .appendTo(ul);
        };
    }

    setupRandomGameButton(emulatorWindow, games) {
        const content = emulatorWindow.content;
        const randomGameButton = document.createElement('button');
        randomGameButton.innerHTML = 'Random Game';
        randomGameButton.classList.add('button');
        randomGameButton.style.width = '100%';
        randomGameButton.onclick = () => this.handleRandomGame(games, emulatorWindow);
        content.parentNode.insertBefore(randomGameButton, content);
    }

    handleGameSelection(gameName, emulatorWindow) {
        const gameUrl = `${cdnUrl}/nes/roms/${gameName}`;
        this.gameUrl = gameUrl;
        this.gameIsRunning = false;
        emulatorWindow.sendMessage({
            event: 'unloadGame',
            gameSystem: 'nes',
            gameUrl: gameUrl
        });
        setTimeout(() => {
            emulatorWindow.sendMessage({
                event: 'startGame',
                message: 'Hello from Emulator',
                gameSystem: 'nes',
                gameUrl: this.gameUrl
            });
            this.gameIsRunning = true;
        }, 200);
    }

    handleRandomGame(games, emulatorWindow) {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        this.handleGameSelection(randomGame, emulatorWindow);
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
cdnBase64 = 'aHR0cHM6Ly9rcmFtZXJpY2EtaW5kdXN0cmllcy5iLWNkbi5uZXQvbmVzLmpzb24=';
const cdnUrl = atob(cdnBase64);