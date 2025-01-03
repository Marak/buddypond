class SimpleRouter {
    constructor() {
        this.routes = [];
        this.routeHandlingComplete = null; // Callback to run after route handling
    }

    get(path, callback) {
        // Convert path to a RegExp and store the original path and callback
        const paramNames = [];
        let regexPath = path.replace(/:([^\/]+)/g, function (full, key) {
            paramNames.push(key);
            return "([^/]+)";
        });

        regexPath = `^${regexPath}$`; // Ensure the path matches exactly
        this.routes.push({ regex: new RegExp(regexPath), callback, paramNames });
    }

    async resolve() {
        const path = window.location.pathname;
        let routeFound = false;
    
        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                await route.callback(params); // Pass extracted parameters to the callback
                routeFound = true;
                break; // Stop checking after the first match
            }
        }
    
        // If no route matches, handle using not found
        if (!routeFound && this.routes['*']) {
            await this.routes['*']();
        }
    
        // Execute any additional handling after route is processed
        if (this.routeHandlingComplete) {
            this.routeHandlingComplete();
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
