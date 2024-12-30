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
            app = 'ui', // default app
            type = 'singleton', // Default type ( intended to not have siblings )
            context = '<default>', // Default context
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
        this.app = app;
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
        this.canBeBackground = canBeBackground;

        windowManager = windowManager || {
            windows: [],
            saveWindowsState: () => { },
            removeWindow: () => { },

        };

        this.onFocus = onFocus;
        this.onClose = onClose;
        this.onOpen = onOpen;
        this.onLoad = onLoad;
        this.onMessage = onMessage;


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
                    console.log('OVERLAP DETECTED');
                    adjustedX += buffer; // Move slightly to the right
                    adjustedY += buffer; // Move slightly down
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

        // Adjust position to prevent overlap
        const adjustedPosition = adjustPosition(
            { x: this.x, y: this.y, width: this.width, height: this.height },
            this.windowManager.windows,
            screenWidth,
            screenHeight,
            32
        );

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

        // Create the title bar
        this.titleBar = document.createElement("div");
        this.titleBar.classList.add("window-title-bar");

        if (this.icon) {
            let iconTitleBar = document.createElement("img");
            iconTitleBar.src = this.icon;
            iconTitleBar.classList.add("window-icon");
            this.titleBar.appendChild(iconTitleBar);
        }

        let titleBarSpan = document.createElement("span");
        titleBarSpan.textContent = this.title;

        // Drag functionality
        this.titleBar.onmousedown = (e) => this.startDrag(e);
        document.onmouseup = () => this.stopDrag();
        document.onmousemove = (e) => this.drag(e);

        // Create control buttons (Minimize, Maximize, Close)
        const controls = document.createElement("div");
        controls.classList.add("window-controls");

        this.minimizeButton = document.createElement("button");
        this.minimizeButton.innerHTML = "&#x1F7E1;"; // Yellow circle
        this.minimizeButton.classList.add("minimize-button");
        this.minimizeButton.title = "Minimize";
        this.minimizeButton.onclick = () => this.minimize();

        this.maximizeButton = document.createElement("button");
        this.maximizeButton.innerHTML = "&#x1F7E2;"; // Green circle
        this.maximizeButton.classList.add("maximize-button");
        this.maximizeButton.title = "Maximize";
        this.maximizeButton.onclick = () => this.maximize();

        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "&#x1F534;"; // Red circle
        this.closeButton.classList.add("close-button");
        this.closeButton.title = "Close";
        this.closeButton.onclick = () => this.close();

        controls.appendChild(this.minimizeButton);
        controls.appendChild(this.maximizeButton);
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
            this.content.onload = () => this.setupMessageHandling();
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

    setupMessageHandling() {
        // iframe is loaded by now
        this.onLoad(this);
        // Set the message event listener directly on the iframe's window
        this.content.contentWindow.addEventListener('message', this.receiveMessage.bind(this), false);
    }


    sendMessage(message) {
        if (this.content && this.content.contentWindow) {
            this.content.contentWindow.postMessage(message, '*'); // Consider specifying an origin here instead of '*'
        }
    }

    receiveMessage(event) {
        console.log('Received message: ' + JSON.stringify(event.data));
        // Implement security checks here, e.g., event.origin
        if (typeof event.data === 'object' && event.data.event) {
            console.log('Received:', event.data);
            // Handle the message based on event.data.event and event.data.data
            this.handleReceivedMessage(event.data);
        }
    }

    handleReceivedMessage(data) {
        console.log('Handled Received message:', data, this.onMessage);
        if (this.onMessage) {
            this.onMessage(data);
        }
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
        console.log('updateWindow', this);
    }

    setDepth(depth) {
        this.z = depth;
        this.container.style.zIndex = depth;
        console.log('container depth was set to', this.id, depth);
        this.windowManager.saveWindowsState();
    }

    setAsBackground() {
        console.log('setAsBackground', this.windowManager.windows);
        if (!this.canBeBackground) {
            console.log('This window cannot be set as background');
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
        this.offsetX = e.clientX - this.container.offsetLeft;
        this.offsetY = e.clientY - this.container.offsetTop;
        this.container.style.cursor = "grabbing";
        // Prevent default behavior to avoid browser actions interfering with drag
        e.preventDefault();

        // Add mousemove and mouseup events to the document
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
    }

    drag(e) {
        if (!this.isDragging) return;
        this.container.style.left = `${e.clientX - this.offsetX}px`;
        this.container.style.top = `${e.clientY - this.offsetY}px`;
    }

    stopDrag() {
        this.isDragging = false;
        this.container.style.cursor = "default";

        // Remove the mousemove and mouseup event listeners from the document
        document.removeEventListener('mousemove', this.drag.bind(this));
        document.removeEventListener('mouseup', this.stopDrag.bind(this));

        this.x = this.container.offsetLeft;
        this.y = this.container.offsetTop;
        // console.log('saving window state', this.x, this.y);
        this.z = Number(this.container.style.zIndex);
        // TODO: save the window state
        // needs a reference to windowsmanager??? cannot save locally??/
        this.windowManager.saveWindowsState();



    }


    minimize(force = false) {
        console.log('minimize', this.isMinimized);
        if (this.isMinimized && !force) {
            this.restore();
        } else {
            // Minimize the window
            this.container.style.display = "none";  // Hide content area
            this.isMinimized = true;
        }

        // TODO: save the window state

    }


    // Restore the window
    restore() {
        console.log('restore', this)
        // Restore the window's content and original size
        this.container.style.display = "flex";

        //this.container.style.top = this.y + 'px';
        //this.container.style.left = this.x + 'px';

        // Mark as not minimized
        this.isMinimized = false;
        // TODO: save the window state

    }

    maximize() {
        if (this.isMaximized) {
            this.container.style.width = `${this.width}px`;
            this.container.style.height = `${this.height}px`;
            this.container.style.top = "50px";
            this.container.style.left = "50px";
            this.isMaximized = false;
        } else {
            this.container.style.width = "100vw";
            this.container.style.height = "100vh";
            this.container.style.top = "0";
            this.container.style.left = "0";
            this.isMaximized = true;
        }
        // TODO: save the window state

    }

    focus(propigate = true) {
        console.log('on focus called from Window.js')
        this.onFocus(this);
    }

    open() {
        try {
            this.onOpen(this);
        } catch (err) {
            console.error(err);


        }
        // TODO: save the window state ???
        // ???? this.parent.appendChild(this.container);
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
        console.log('removeWindow', this.id);
        this.windowManager.removeWindow(this.id);


        if (this.windowManager.taskBar) {
            // remove the chat window from the taskbar
            this.windowManager.taskBar.removeItem(this.id);
        }

        // TODO: save the window state ??? removeWindow could do it..?

        this.onClose();

    }

    addResizeHandles() {
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        this.container.appendChild(resizeHandle);

        resizeHandle.onmousedown = (e) => this.startResize(e);
        document.onmouseup = () => this.stopResize();
        document.onmousemove = (e) => this.resize(e);
    }

    startResize(e) {
        this.isResizing = true;
        this.startWidth = this.container.offsetWidth;
        this.startHeight = this.container.offsetHeight;
        this.startX = e.clientX;
        this.startY = e.clientY;
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
