// TODO: replace usage of api.windows scope with a WindowsManager class
// WindowsManager will be a small class that will hold references to all the windows
// In the future we can use this class for more advanced window management features
// such as window stacking, window grouping, etc.
// lets keep the user api such they developers will create new Window() and *not* have to call anything like WindowsManager.createWindow()

let idCounter = 0;

class Window {
    constructor(options = {}, windowManager) {
        const {
            title = "Window", // Title of the window
            width = '400px', // Default width
            height = '300px', // Default height
            x = 50, // Default x position
            y = 50, // Default y position
            parent = null, // Parent element to append to
            id = `window-${idCounter}`, // Unique ID for the panel
            onClose = () => { }, // Callback when the window is closed
            onOpen = () => { }, // Callback when the window is opened
            className = '', // Custom classes for styling
            resizeable = true, // Enable resizable feature
            canBeBackground = false // Can be set as background
        } = options;

        this.title = title;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.id = id;
        this.isMaximized = false;
        this.isMinimized = false;
        this.container = null;
        this.content = null;
        this.isActive = false;
        this.className = className;
        this.resizeable = resizeable;
        this.canBeBackground = canBeBackground;

        this.windowManager = windowManager;

        this.onClose = onClose;
        this.onOpen = onOpen;

        this.createWindow();
        this.open();

        return this;
    }

    createWindow() {
        // Create the main window container
        this.container = document.createElement("div");
        this.container.classList.add("window-container");

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

        this.container.style.zIndex = 11000;


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
        this.minimizeButton.title = "Minimize";
        this.minimizeButton.onclick = () => this.minimize();

        this.maximizeButton = document.createElement("button");
        this.maximizeButton.innerHTML = "&#x1F7E2;"; // Green circle
        this.maximizeButton.title = "Maximize";
        this.maximizeButton.onclick = () => this.maximize();

        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "&#x1F534;"; // Red circle
        this.closeButton.title = "Close";
        this.closeButton.onclick = () => this.close();

        controls.appendChild(this.closeButton);
        controls.appendChild(this.minimizeButton);
        controls.appendChild(this.maximizeButton);

        this.titleBar.appendChild(controls);
        this.titleBar.appendChild(titleBarSpan);

        // Create content area
        this.content = document.createElement("div");
        this.content.classList.add("window-content");
        // this.content.innerHTML = this.content;

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
    }
    minimize() {
        if (this.isMinimized) {
            // Restore window to its original size
            this.content.style.display = "block";  // Show content again
            this.container.style.height = `${this.height}px`;  // Restore height
            this.container.style.top = `${this.y}px`;  // Restore position
            this.isMinimized = false;

            // Restore the taskbar placeholder
            this.taskbarPlaceholder.style.display = "none";
        } else {
            // Minimize the window
            this.content.style.display = "none";  // Hide content area
            this.container.style.height = "30px";  // Set height to just the title bar
            this.container.style.bottom = "10px";  // Remove top position (let taskbar handle it)
            this.container.style.top = "auto";  // Remove top position (let taskbar handle it)
            this.isMinimized = true;

            // Create taskbar placeholder if not already created
            if (!this.taskbarPlaceholder) {
                this.createTaskbarPlaceholder();
            }

            // Show taskbar placeholder and position it at the bottom
            this.taskbarPlaceholder.style.display = "block";
            this.taskbarPlaceholder.style.left = `${this.x}px`;  // Keep the x position
        }
    }

    // Create a taskbar placeholder element
    createTaskbarPlaceholder() {
        this.taskbarPlaceholder = document.createElement("div");
        this.taskbarPlaceholder.classList.add("taskbar-placeholder");
        this.taskbarPlaceholder.textContent = this.title;

        // Add click event to restore the window
        this.taskbarPlaceholder.addEventListener("click", () => this.restoreWindow());

        // Append to the body (taskbar at the bottom)
        document.body.appendChild(this.taskbarPlaceholder);
    }

    // Restore the window from the taskbar placeholder
    restoreWindow() {
        // Hide the taskbar placeholder
        this.taskbarPlaceholder.style.display = "none";

        // Restore the window's content and original size
        this.content.style.display = "block";
        this.container.style.height = `${this.height}px`;
        this.container.style.top = `${this.y}px`;

        // Mark as not minimized
        this.isMinimized = false;
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
    }

    open() {
        this.onOpen();
        // this.parent.appendChild(this.container);
    }
    close() {
        this.onClose();

        if (this.parent) {
            // check first to see if child is in parent
            if (this.container.parentElement && this.container.parentElement === this.parent) {
                this.parent.removeChild(this.container);

            }

        } else {
            this.container.parentElement.removeChild(this.container);

        }

        // check to see if no more windows
        // if window count is 0 get the menubar-set-window-as-background element and add disabled class
        let windowCount = api.ui.windowManager.windows.length;
        if (windowCount === 0) {
            let el = document.getElementById('menubar-set-window-as-background');
            if (el) {
                el.classList.add('disabled');
            }
        }

        this.windowManager.removeWindow(this.id);

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
    }
}

export default Window;