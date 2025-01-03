class SimpleRouter {
    constructor() {
        this.routes = {};
        this.routeHandlingComplete = null; // Callback to run after route handling
    }

    get(path, callback) {
        this.routes[path] = callback;
    }

    async resolve() {
        const path = window.location.pathname;
        const callback = this.routes[path];

        if (callback) {
            await callback(); // Ensure the callback is awaited if it's asynchronous
        } else {
            if (this.routes['*']) {
                await this.routes['*']();
            }
        }

        if (this.routeHandlingComplete) {
            this.routeHandlingComplete(); // Execute any additional handling after route is processed
        }
    }

    notFound(callback) {
        this.routes['*'] = callback;
    }

    init() {
        window.addEventListener('popstate', () => this.resolve());
        this.resolve();
    }

    onComplete(callback) {
        this.routeHandlingComplete = callback; // Setup a callback for after route handling
    }
}

