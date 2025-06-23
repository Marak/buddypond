// Buddy Pond - Window.js - Marak Squires 2023
// A simple window class for creating draggable, resizable windows
// Remark: WindowManager interface is optional and will be stubbed out if not provided
let idCounter = 0;

class Window {
    constructor(options = {}, windowManager) {
        const {
            title = "Window", // Title of the window
            width = '400px', // Default width
            height = '300px', // Default height
            app = 'default', // default app
            type = 'singleton', // Default type ( intended to not have siblings )
            context = 'default', // Default context
            content = '', // Default content
            iframeContent = false,
            icon = '', // Default icon
            x = 50, // Default x position
            y = 50, // Default y position
            z = 99, // Default z-index
            parent = window.document.body, // Parent element to append to
            id = `window-${idCounter}`, // Unique ID for the panel
            onFocus = () => { }, // Callback when the window is focused
            onClose = () => { }, // Callback when the window is closed
            onOpen = () => { }, // Callback when the window is opened
            onMessage = () => { }, // Callback when the window receives a message
            onLoad = () => { }, // Callback when the window is loaded ( remote content )
            className = '', // Custom classes for styling
            resizeable = true, // Enable resizable feature
            preventOverlap = true, // prevents direct overlap with other windows
            canBeBackground = false // Can be set as background
        } = options;

        this.windowManager = windowManager;

        // ensure that no other window has the same id
        // we could check the windowManger.windows array for this
        // we will check the document ( in case another system has created a window )
        let existingWindow = document.getElementById(id);
        if (existingWindow) {
            console.log('Window with id already exists', id);
            return existingWindow;
        }

        this.title = title;
        this.icon = icon;
        this.width = width;
        this.height = height;

        if (app !== 'default') {
            this.app = app;
        } else {
            this.app = id;
        }

        
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = 99;
        this.context = context;
        this.parent = parent;
        this.id = id;
        this.isMaximized = false;
        this.isMinimized = false;
        this.container = null;
        this.content = null;
        this.iframeContent = iframeContent;
        this.contentValue = content;
        this.isActive = false;
        this.className = className;
        this.resizeable = resizeable;
        this.preventOverlap = preventOverlap;
        this.canBeBackground = canBeBackground;

        windowManager = windowManager || {
            windows: [],
            saveWindowsState: () => { },
            removeWindow: () => { },

        };

        this.bp = options.bp;

        this.onFocus = onFocus;
        this.onClose = onClose;
        this.onOpen = onOpen;
        this.onLoad = onLoad;
        this.onMessage = onMessage;

        this.startDrag = this.startDrag.bind(this);
        this.drag = this.drag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);


        this.createWindow();
        this.open();

        return this;
    }

    createWindow() {
        // Create the main window container
        this.container = document.createElement("div");
        this.container.classList.add("window-container");

        // add dataset for app, type, context
        this.container.dataset.app = this.app;
        this.container.dataset.type = this.type;
        this.container.dataset.context = this.context;

        if (this.className) {
            this.container.classList.add(this.className);
        }

        if (!this.resizeable) {
            this.container.classList.add("window-not-resizeable");
        }


        // Helper function to check if two rectangles overlap
        function checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2, buffer = 10) {
            // console.log('checkOverlap', x1, y1, w1, h1, x2, y2, w2, h2, buffer);
            w1 = parseInt(w1);
            h1 = parseInt(h1);
            w2 = parseInt(w2);
            h2 = parseInt(h2);
            return (
                x1 < x2 + w2 + buffer &&
                x1 + w1 + buffer > x2 &&
                y1 < y2 + h2 + buffer &&
                y1 + h1 + buffer > y2
            );
        }

        // Function to adjust position to prevent overlap
        function adjustPosition(newWindow, windows, screenWidth, screenHeight, buffer = 10) {
            let adjustedX = newWindow.x;
            let adjustedY = newWindow.y;

            // Check overlap with other windows
            windows.forEach((win) => {
                if (checkOverlap(adjustedX, adjustedY, newWindow.width, newWindow.height, win.x, win.y, win.width, win.height, buffer)) {
                    // console.log('OVERLAP DETECTED');
                    adjustedX += buffer; // Move slightly to the right
                    // adjustedY += buffer; // Move slightly down
                }
            });

            // Check screen boundaries
            if (adjustedX + newWindow.width + buffer > screenWidth) {
                adjustedX = screenWidth - newWindow.width - buffer; // Move to the left
            }
            if (adjustedY + newWindow.height + buffer > screenHeight) {
                adjustedY = screenHeight - newWindow.height - buffer; // Move up
            }
            if (adjustedX < buffer) {
                adjustedX = buffer; // Move to the right
            }
            if (adjustedY < buffer) {
                adjustedY = buffer; // Move down
            }

            return { x: adjustedX, y: adjustedY };
        }

        // Main Window Creation Logic
        this.container.id = this.id;
        this.container.style.width = `${this.width}px`;
        this.container.style.height = `${this.height}px`;
        this.container.style.position = "absolute";

        // Assume screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        /*
        // Remark: We could perform a general zoom scale for mobile devices
        if (screenWidth <= 980) {
            // this.container.style.zoom = 1.5; // Adjust zoom for mobile
        } else {
            // do nothing
        }
        */

        // Adjust position to prevent overlap
        let adjustedPosition = {
            x: this.x,
            y: this.y,
        };

        if (this.preventOverlap) {
            adjustedPosition = adjustPosition(
                { x: this.x, y: this.y, width: this.width, height: this.height },
                this.windowManager.windows,
                screenWidth,
                screenHeight,
                32
            );
        }


        // Apply adjusted position
        this.x = adjustedPosition.x;
        this.y = adjustedPosition.y;
        this.container.style.top = `${this.y}px`;
        this.container.style.left = `${this.x}px`;

        this.container.style.zIndex = 99;

        // add a mousedown handler to container itself to set 'window-active' status
        this.container.addEventListener('mousedown', () => {
            // set all windows to inactive
            document.querySelectorAll('.window-container').forEach((window) => {
                window.classList.remove('window-active');
                window.isActive = false;
            });
            // set this window to active
            this.container.classList.add('window-active');
            this.isActive = true;
        });

        // same for touchstart
        this.container.addEventListener('touchstart', () => {
            // set all windows to inactive
            document.querySelectorAll('.window-container').forEach((window) => {
                window.classList.remove('window-active');
                window.isActive = false;
            });
            // set this window to active
            this.container.classList.add('window-active');
            this.isActive = true;
        });

        // Create the title bar
        this.titleBar = document.createElement("div");
        this.titleBar.classList.add("window-title-bar");

        if (this.bp.isMobile()) {
            this.titleBar.onclick = () => {
                console.log('titleBar clicked on mobile');
                this.minimize();
                return;
                if (!this.isMinimized) {
                    this.minimize(true); // force minimize on mobile
                } else {
                    this.restore(); // restore on mobile
                }
            }
        }

        // on double click maximize
        this.titleBar.ondblclick = () => this.maximize();

        if (this.icon) {
            let iconTitleBar = document.createElement("img");
            iconTitleBar.src = this.icon;
            iconTitleBar.classList.add("window-icon");
            this.titleBar.appendChild(iconTitleBar);
        }

        let titleBarSpan = document.createElement("span");
        titleBarSpan.classList.add("window-title-text");
        titleBarSpan.textContent = this.title;
        this.titleBarSpan = titleBarSpan;

        // Drag functionality
        // Add mouse and touch event listeners to the titleBar
        this.titleBar.addEventListener('mousedown', this.startDrag);
        this.titleBar.addEventListener('touchstart', this.startDrag, { passive: false });

        // Touch events for mobile


        // Create control buttons (Minimize, Maximize, Close)
        const controls = document.createElement("div");
        controls.classList.add("window-controls");

        if (!this.bp.isMobile()) {
            this.minimizeButton = document.createElement("button");
            this.minimizeButton.innerHTML = "&#x1F7E1;"; // Yellow circle
            this.minimizeButton.classList.add("minimize-button");
            this.minimizeButton.title = "Minimize";
            this.minimizeButton.onclick = () => this.minimize();

            controls.appendChild(this.minimizeButton);


        }


        this.maximizeButton = document.createElement("button");
        this.maximizeButton.innerHTML = "&#x1F7E2;"; // Green circle
        this.maximizeButton.classList.add("maximize-button");
        this.maximizeButton.title = "Maximize";
        this.maximizeButton.onclick = () => this.maximize();

        controls.appendChild(this.maximizeButton);


        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "&#x1F534;"; // Red circle
        this.closeButton.classList.add("close-button");
        this.closeButton.title = "Close";
        this.closeButton.onclick = () => this.close();

        controls.appendChild(this.closeButton);

        this.titleBar.appendChild(titleBarSpan);
        this.titleBar.appendChild(controls);

        this.initContentArea();

        // Append components
        this.container.appendChild(this.titleBar);
        this.container.appendChild(this.content);

        if (this.parent) {
            this.parent.appendChild(this.container);
        }

        // Resizing
        if (this.resizeable) {
            this.addResizeHandles();
        }

        if (this.canBeBackground) {
            // get the menubar-set-window-as-background element and remove disabled class
            let el = document.getElementById('menubar-set-window-as-background');
            if (el) {
                el.classList.remove('disabled');
            }
        }


        return this.container;
    }


    initContentArea() {
        if (typeof this.iframeContent === 'boolean' && this.iframeContent) {
            this.content = document.createElement("iframe");
            this.content.classList.add("bp-window-content");
            document.body.appendChild(this.content);
            this.content.src = 'about:blank';
            this.content.onload = () => {
                let iframeDoc = this.content.contentDocument || this.content.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(this.contentValue);
                iframeDoc.close();
                this.setupMessageHandling();
            };
        } else if (typeof this.iframeContent === 'string' && this.iframeContent.length) {
            this.content = document.createElement("iframe");
            this.content.classList.add("bp-window-content");
            this.content.src = this.iframeContent;

            // Remark: This is legacy settings for iframe message handling bootstrapping
            // In more modern applications, we use broadcast channels or other methods
            // It's important we don't attempt to setup message handling for iframes that are not from the same origin
            let currentOrigin = window.location.origin;
            let iframeOrigin = this.content.src;
            // check if currentOrigin can be found in iframeOrigin
            if (iframeOrigin.indexOf(currentOrigin) !== -1) {
                this.content.onload = () => this.setupMessageHandling();
            } else {
                // console.log('not setting up legacy iframe message handling, as the iframe origin does not match current origin');
            }
        } else {
            this.content = document.createElement("div");
            this.content.classList.add("bp-window-content");
            if (typeof this.contentValue === 'string') {
                this.content.innerHTML = this.contentValue;
            } else {
                this.content.appendChild(this.contentValue);
            }
        }
    }

    // TODO: migrate away from iframe messages and use BroadcastChannel instead
    setupMessageHandling() {
        // iframe is loaded by now
        this.onLoad(this);
        const iframeWindow = this.content.contentWindow;

        // Inject a script into the iframe to listen for the ESC key
        const iframeDoc = this.content.contentDocument || this.content.contentWindow.document;
        const script = iframeDoc.createElement("script");
        script.type = "text/javascript";
        script.textContent = `
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    window.parent.postMessage({ event: 'ESC_KEY_PRESSED' }, '*');
                }
            });
        `;
        //alert(script.textContent)
        iframeDoc.body.appendChild(script);

        // Set the message event listener on the iframe's window
        window.addEventListener('message', this.receiveMessage.bind(this), false);
    }


    sendMessage(message) {
        if (this.content && this.content.contentWindow) {
            this.content.contentWindow.postMessage(message, '*'); // Consider specifying an origin here instead of '*'
        }
    }

    receiveMessage(event) {
        // Ensure security by checking the event.origin, if possible
        if (typeof event.data === 'object' && event.data.event) {
            if (event.data.event === 'ESC_KEY_PRESSED') {
                console.log('ESC key pressed inside iframe. Closing window...');
                this.close();
            } else {
                this.handleReceivedMessage(event.data);
            }
        }
    }

    handleReceivedMessage(data) {
        //console.log('Handled Received message:', data, this.onMessage);
        if (this.onMessage) {
            this.onMessage(data);
        }
    }


    move(x, y) {
        this.x = x;
        this.y = y;
        this.container.style.top = `${this.y}px`;
        this.container.style.left = `${this.x}px`;
        this.windowManager.saveWindowsState();
    }

    serialize() {

        // we need an xpath selector for this.parent
        let parentXpath = getXPathForElement(this.parent);
        // console.log('parentXpath', parentXpath);
        return {
            title: this.title,
            width: this.width,
            height: this.height,
            type: this.type,
            app: this.app,
            x: this.x,
            y: this.y,
            z: this.z,
            context: this.context,
            parent: parentXpath,
            id: this.id,
            onClose: this.onClose,
            onOpen: this.onOpen,
            className: this.className,
            resizeable: this.resizeable,
            canBeBackground: this.canBeBackground
        };
    }

    hydrate(data) {
        console.log('hydrate', data);
        this.title = data.title;
        this.width = data.width;
        this.height = data.height;
        this.app = data.app;
        this.type = data.type;
        this.x = data.x;
        this.y = data.y;
        this.z = Number(data.z);
        this.context = data.context;
        // TODO: some of these are constructor...maybe all?
        // this.parent = document.querySelector(data.parent);
        this.id = data.id;
        this.onClose = data.onClose;
        this.onOpen = data.onOpen;
        this.onMessage = data.onMessage;
        this.className = data.className;
        this.resizeable = data.resizeable;
        this.canBeBackground = data.canBeBackground;

        this.updateWindow();
    }

    updateWindow() {
        this.container.style.width = `${this.width}px`;
        this.container.style.height = `${this.height}px`;
        this.container.style.top = `${this.y}px`;
        this.container.style.left = `${this.x}px`;
        this.container.style.zIndex = this.z;
        // console.log('updateWindow', this);
    }

    setDepth(depth) {
        this.z = depth;
        this.container.style.zIndex = depth;
        // console.log('container depth was set to', this.id, depth);
        this.windowManager.saveWindowsState();
    }

    setAsBackground() {
        console.log('setAsBackground', this.windowManager.windows);
        if (!this.canBeBackground) {
            console.log('This window cannot be set as background. Try setting canBeBackground:true in the Window declaration');
            return;
        }
        // check other api.ui.windowManager.windows and restore them if isBackground is true
        this.windowManager.windows.forEach((window) => {
            if (window.isBackground) {
                window.restoreWindowFromBackground();
            }
        });

        this.container.style.zIndex = -1;

        // make full window size
        this.container.style.width = "100%";
        this.container.style.height = "100%";

        // set top and left to 0
        this.container.style.top = "0";
        this.container.style.left = "0";

        this.isBackground = true;
        this.isActive = false;
    }

    restoreWindowFromBackground() {

        this.isBackground = false;

        // reset the z-index
        this.container.style.zIndex = 11000;

        // reset the window size
        this.container.style.width = `${this.width}`;
        this.container.style.height = `${this.height}`;

        // put window back to original position
        this.container.style.top = `${this.y}px`;
        this.container.style.left = `${this.x}px`;

        // get the menubar-restore-background-window element and add disabled class
        let el = document.getElementById('menubar-restore-background-window');
        if (el) {
            el.classList.add('disabled');
        }

    }

    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = "grabbing";

        // Disable pointer events on iframe
        const iframes = this.container.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.style.pointerEvents = 'none';
        });

        // Get coordinates from mouse or touch event
        const { clientX, clientY } = this.getEventCoordinates(e);
        this.offsetX = clientX - this.container.offsetLeft;
        this.offsetY = clientY - this.container.offsetTop;

        // Add event listeners for both mouse and touch events
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('touchmove', this.drag, { passive: false });
        document.addEventListener('mouseup', this.stopDrag);
        document.addEventListener('touchend', this.stopDrag);
    }

    drag(e) {
        if (!this.isDragging) return;

        // Prevent default behavior for touchmove to avoid scrolling
        e.preventDefault();

        // Get coordinates from mouse or touch event
        const { clientX, clientY } = this.getEventCoordinates(e);

        // Update container position
        // Ensure window does not drag off the screen
        let menuBarHeight = 42;
        let bottomLimit = window.innerHeight - 52; // 50px from bottom
        if (clientY > menuBarHeight && clientY < bottomLimit) {
            this.container.style.top = `${clientY - this.offsetY}px`;
        }
        let leftLimit = 52; // 0px from left
        let rightLimit = window.innerWidth - 52; // 0px from right
        if (clientX > leftLimit && clientX < rightLimit) {
            this.container.style.left = `${clientX - this.offsetX}px`;
        }
    }

    stopDrag() {
        this.isDragging = false;
        this.container.style.cursor = "default";

        // Restore pointer events on iframe
        const iframes = this.container.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.style.pointerEvents = 'auto';
        });

        // Remove event listeners
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('touchmove', this.drag);
        document.removeEventListener('mouseup', this.stopDrag);
        document.removeEventListener('touchend', this.stopDrag);

        // Save window state
        this.x = this.container.offsetLeft;
        this.y = this.container.offsetTop;
        this.z = Number(this.container.style.zIndex);
        if (this.windowManager) {
            this.windowManager.saveWindowsState();
        } else {
            console.warn('windowManager is not defined');
        }
    }

    getEventCoordinates(e) {
        let clientX, clientY;
        if (e.type.startsWith('touch')) {
            // Use the first touch point for dragging
            const touch = e.touches[0] || e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }
        return { clientX, clientY };
    }

    minimize(force = false) {
        // console.log('minimize', this.isMinimized);
        if (this.bp.isMobile()) {

            if (this.isMinimized && !force) {
                this.restore();
                // this.content.style.display = "block"; // Show content area
            } else {
                // Minimize the window
                // this.container.style.display = "none";  // Hide content area
                // hides the `bp-window-content` area
                //this.content.style.display = "none";  // Hide content area
                // set the window-container height to 50px
                this.container.style.height = "120px"; // Set height to 50px

                this.isMinimized = true;
            }

            this.windowManager.arrangeVerticalStacked();

        } else {
            if (this.isMinimized && !force) {
                this.restore();
            } else {
                // Minimize the window
                this.container.style.display = "none";  // Hide content area
                this.isMinimized = true;
            }
        }
        // TODO: save the window state
    }

    // Restore the window
    restore() {
        // console.log('restore', this)
        // Restore the window's content and original size
        this.container.style.display = "flex";

        //this.container.style.top = this.y + 'px';
        //this.container.style.left = this.x + 'px';

        // Mark as not minimized
        this.isMinimized = false;
        // TODO: save the window state

        if (this.bp.isMobile()) {
            this.windowManager.arrangeVerticalStacked();
        }
    }

    maximize() {

        // offset the top position by $('.desktop-menu-bar').height()
        // so that on smaller devices the window is not hidden behind the menubar
        if (this.isMaximized) {
            if (this.bp.isMobile()) {
                //this.container.style.width = "100vw";
                //this.container.style.height = "100vh";
                //this.container.style.top = "0";
                //this.container.style.left = "0";
                this.windowManager.arrangeVerticalStacked();

            } else {
                this.container.style.width = `${this.width}px`;
                this.container.style.height = `${this.height}px`;
                this.container.style.top = "50px";
                this.container.style.left = "50px";
                this.isMaximized = false;

            }
        } else {
            let normalMenuBarHeight = 21;
            let currentMenuBarHeight = $('.desktop-menu-bar').height() || normalMenuBarHeight;
            let diff = currentMenuBarHeight - normalMenuBarHeight;
            diff += (normalMenuBarHeight + 2); // add 2px for border
            let pixelOffset = diff + 'px';

            if (this.bp.isMobile()) {
                this.container.style.width = "100vw";
                this.container.style.height = "100vh";
                this.container.style.top = pixelOffset;
                this.container.style.left = "0";

            } else {
                this.container.style.width = "100vw";
                this.container.style.height = "calc(100vh - 104px)";
                this.container.style.top = pixelOffset;
                this.container.style.left = "0";

            }
            this.isMaximized = true;
        }
        // TODO: save the window state

    }

    focus(propigate = true) {
        // console.log('on focus called from Window.js')
        if (propigate) {
            this.windowManager.focusWindow(this);
        }

        this.onFocus(this);

        let appData = this.bp.apps.desktop.appList[this.id];
        let pushStateId = this.id;
        if (appData && appData.alias) {
            // get the first entry in the alias array
            let alias = appData.alias[0];
            pushStateId = alias; // use the id if it exists, otherwise use the alias string
        }
        // history.pushState({ appId: pushStateId }, this.title, `/app/${pushStateId}`);
        DelayedPushState.push({ appId: pushStateId }, this.title, `/app/${pushStateId}`);

    }

    open() {
        // set focus to this window ( first )
        this.focus();

        try {
            // onOpen may have additional focus events
            this.onOpen(this);
        } catch (err) {
            console.error(err);
        }
        // TODO: save the window state ???
        // ???? this.parent.appendChild(this.container);

        if (this.bp.isMobile()) {
            // this.minimizeAllWindows(true);
            // alert('opening window on mobile');
            setTimeout(() => {
                this.windowManager.arrangeVerticalStacked();
            }, 100);
        }

        this.bp.emit('window::open', this);

        // console.log('Window opened:', this);
        let _app = {
            id: this.id,
            app: this.app,
            label: this.title,
            icon: this.icon,
            // app: this.app,
            type: this.type,
            context: this.context
        };
        // console.log('openWindow openItem', _app);
        this.bp.apps.ui.windowManager.taskBar.openItem(_app);

        // add the items to this.bp.apps.ui.recentApps
        // TODO: truncate the array to a maximum of 10 items, newest first
        this.bp.apps.ui.recentApps = this.bp.apps.ui.recentApps || this.bp.settings.recentApps || [];

        // remove items with the same id if already exists
        this.bp.apps.ui.recentApps = this.bp.apps.ui.recentApps.filter(app => app.id !== this.id);
        
        this.bp.apps.ui.recentApps.unshift({
            id: this.id,
            app: this.app,
            label: this.label || this.title,
            icon: this.icon,
            type: this.type
        });

        // update the recentApps localStorage
        this.bp.apps.ui.recentApps = this.bp.apps.ui.recentApps.slice(-10); // keep only the last 10 items
        this.bp.set('recentApps', this.bp.apps.ui.recentApps);

        // update the url bar push state with app id
        // modify the url to include the app id
        // load app data to find any aliases
        let appData = this.bp.apps.desktop.appList[this.id];
        let pushStateId = this.id;
        if (appData && appData.alias) {
            // get the first entry in the alias array
            let alias = appData.alias[0];
            pushStateId = alias; // use the id if it exists, otherwise use the alias string
        }

        // history.pushState({ appId: pushStateId }, this.title, `/app/${pushStateId}`);
        DelayedPushState.push({ appId: pushStateId }, this.title, `/app/${pushStateId}`);

    }
    close() {

        if (this.parent) {
            // check first to see if child is in parent
            if (this.container.parentElement && this.container.parentElement === this.parent) {
                this.parent.removeChild(this.container);
            }
        } else {
            this.container.parentElement.removeChild(this.container);
        }

        // check to see if this is an iframe and remove event listener
        if (this.content && this.content.contentWindow) {
            this.content.contentWindow.removeEventListener('message', this.receiveMessage.bind(this), false);
        }
        if (this.content) {
            if (this.content.parentNode) {
                this.content.parentNode.removeChild(this.content);
            }
            this.content = null;
        }

        // check to see if no more windows
        // TODO: remove this code from Window.js class ( it should not know about menubar )
        // if window count is 0 get the menubar-set-window-as-background element and add disabled class
        let windowCount = this.windowManager.windows.length;
        if (windowCount === 0) {
            let el = document.getElementById('menubar-set-window-as-background');
            if (el) {
                el.classList.add('disabled');
            }
        }
        // console.log('removeWindow', this.id);
        this.windowManager.removeWindow(this.id);


        if (this.windowManager.taskBar) {
            // remove the chat window from the taskbar
            this.windowManager.taskBar.closeItem(this.id);
        }

        // TODO: save the window state ??? removeWindow could do it..?

        this.onClose(this);
        this.bp.emit('window::close', this);

        if (this.bp.isMobile()) {
            // this.minimizeAllWindows(true);
            //this.windowManager.arrangeVerticalStacked();
            setTimeout(() => {
                this.windowManager.arrangeVerticalStacked();
            }, 100);
        }

        // clear the current pushState
        // history.pushState({}, '', '/');
        DelayedPushState.push({}, '', '/');

    }

    addResizeHandles() {
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        this.container.appendChild(resizeHandle);
        resizeHandle.addEventListener("mousedown", (e) => this.startResize(e), { passive: false });
        resizeHandle.addEventListener("touchstart", (e) => {
            e.preventDefault(); // Prevent default touch behavior
            this.startResize(e.touches[0]);
        }, { passive: false });
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.container.style.width = `${this.width}`;
        this.container.style.height = `${this.height}`;
        // save the window state
        this.windowManager.saveWindowsState();
    }

    startResize(e) {
        const container = this.container;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = container.offsetWidth;
        const startHeight = container.offsetHeight;

        const onMove = (moveEvent) => {
            const clientX = moveEvent.clientX || moveEvent.touches[0].clientX;
            const clientY = moveEvent.clientY || moveEvent.touches[0].clientY;
            const newWidth = startWidth + (clientX - startX);
            const newHeight = startHeight + (clientY - startY);

            // Apply new dimensions, respecting min/max constraints
            container.style.width = `${Math.max(100, newWidth)}px`; // Example min-width
            container.style.height = `${Math.max(100, newHeight)}px`; // Example min-height
        };

        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onUp);
    }

    resize(e) {
        if (!this.isResizing) return;
        const newWidth = this.startWidth + (e.clientX - this.startX);
        const newHeight = this.startHeight + (e.clientY - this.startY);

        this.container.style.width = `${newWidth}px`;
        this.container.style.height = `${newHeight}px`;
    }

    stopResize() {
        this.isResizing = false;
        // TODO: save the window state

    }

    setTitle(title) {
        this.title = title;
        this.titleBarSpan.textContent = title;
        // save the window state
        this.windowManager.saveWindowsState();
    }

    setContent(content) {
        this.contentValue = content;
        this.content.innerHTML = content;
        // save the window state
        this.windowManager.saveWindowsState();
    }
}

export default Window;


function getXPathForElement(element) {
    const fullPath = (el) => {
        let names = [];
        while (el.parentNode) {
            if (el.id) { // If the element has an ID, use it as a unique identifier
                names.unshift('#' + el.id);
                break;
            } else {
                let e = el, sibling, count = 1;
                while (sibling = e.previousSibling) {
                    if (sibling.nodeType === 1 && sibling.tagName === e.tagName) { count++; }
                    e = sibling;
                }
                const tagName = el.tagName.toLowerCase();
                const nth = count > 1 ? `:nth-of-type(${count})` : '';
                names.unshift(`${tagName}${nth}`);
                el = el.parentNode;
            }
        }
        return names.length ? names.join(' > ') : null;
    };
    return fullPath(element);
}
