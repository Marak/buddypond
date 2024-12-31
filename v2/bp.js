// very thin wrapper to establish bp namespace and ability to load apps dynamically
const bp = {};
window.bp = bp;

bp.log = console.log;
bp.log = function noop() { }
bp.error = console.error;


bp.config = {
    host: ""
};

bp.apps = {};
bp.data = {};
bp._modules = {};

bp._cache = {};
bp._cache.css = {};
bp._cache.html = {};
bp._cache.js = {};

bp.setConfig = function setConfig(config, softApply = false) {
    console.log('setConfig', config, softApply);
    if (softApply) {
        bp.config = { ...bp.config, ...config };
    } else {
        bp.config = config;
    }
}

bp.start = async function start(apps = []) {
    for (let app of apps) {
        await bp.importModule(app);
    }
}

// example usage: bp.open(['buddylist', { name: 'clock' }, 'entity']);
bp.open = async function open(app, config = { context: 'default' }) {
    // console.log('bp.open', app, config)
    let appName = app;
    if (typeof app === 'string') {
        // console.log('string loading async import app', appName);
        await bp.importModule(appName, {}, true);

    }
    if (typeof app === 'object') {
        appName = app.name;
        config = app;
        // console.log('object loading async import app', appName, config);
        await bp.importModule(appName, config, true);
    }

    if (typeof bp.apps[appName].open === 'function') {
        // console.log('open', appName, config)
        // console.log('open', appName, config)
        bp.apps[appName].open(config);
    }
}

// bp.load will delegate to correct provider based on resource type
// in most cases this will be by file extension or object shape
bp.load = async function load(resource) {

    // check to see if resource is a string
    if (typeof resource === 'string') {
        if (resource.endsWith('.css')) {
            return bp.appendCSS(resource);
        }
        if (resource.endsWith('.html')) {
            return bp.fetchHTMLFragment(resource);
        }
        if (resource.endsWith('.js')) {
            return bp.appendScript(resource);
        }
        if (resource.endsWith('.json')) {
            return bp.fetchJSON(resource);
        }
        // check to see if there is no file extension
        if (!resource.includes('.')) {
            return bp.importModule(resource);
        }
    }

    console.log('Cannot load unknown resource type', resource);

}

bp.importModule = async function importModule(app, config, buddypond = true) {

    // console.log('importModule', app, config, buddypond);
    let modulePath = bp.config.host + `/v2/apps/based/${app}/${app}.js`;
    let appName = app;

    if (typeof app === 'object') {
        modulePath = bp.config.host + `/v2/apps/based/${app.name}/${app.name}.js`;
        config = app;
        appName = app.name;
    }

    if (!buddypond) {
        modulePath = app;
    }

    // Check if the module has already been loaded
    if (bp._modules[modulePath]) {
        // console.log('module already loaded', app);
        return bp._modules[modulePath];
    }
    try {
        // console.log('attempting to load module', modulePath);
        let module = await import(/* @vite-ignore */modulePath);
        if (buddypond) {
            bp.apps[appName] = new module.default(bp, config);
            await bp.apps[appName].init();
            bp.log('init complete', appName);

        }
        bp._modules[modulePath] = module;
        // console.log('module loaded', module);
        return module;
    } catch (error) {
        bp.error('Failed to load module:', appName, error);
        delete bp.apps[appName]; // just in case
    }

}


bp.fetchHTMLFragment = async function fetchHTMLFragment(url) {
    // TOOD: only use absolute urls here, host should not be needed at this stage
    // TODO: might be best to default to host if no protocol is present
    // TODO: cache request, do not reload unless forced
    let fullUrl = `${bp.config.host}${url}`;
    // console.log('fetchHTMLFragment', fullUrl);
    if (bp._cache.html[fullUrl]) {
        return bp._cache.html[fullUrl];
    }
    bp._cache.html[fullUrl] = await fetch(fullUrl).then(response => response.text());
    return bp._cache.html[fullUrl];
}

bp.fetchJSON = async function fetchJSON(url) {
    // no caching for JSON ( by default )
    // absolute url by default
    return fetch(url).then(response => response.json());
}

bp.appendCSS = function appendCSS(url, forceReload = false) {
    // TODO: cache request, do not reload unless forced
    let fullUrl = url;

    // check if there is no protocol in the URL
    if (!url.includes('http') && !url.includes('blob')) {
        fullUrl = `${bp.config.host}${url}`;
    }

    if (bp._cache.css[fullUrl]) {
        if (!forceReload) {
            return 'cached';
        }
    }

    bp._cache.css[fullUrl] = new Date().getTime();
    // fetching CSS should immediately apply to the document
    // Remark: We could check for duplicates here based on the URL
    // Better in dev mode to always fetch the CSS and write it to the document
    // if (!document.querySelector(`link[href="${url}"]`)) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fullUrl;
    document.head.appendChild(link);
}

bp.appendScript = async function appendScript(url) {
    let fullUrl = url;
    if (!url.includes('http') && !url.includes('blob')) {
        fullUrl = `${bp.config.host}${url}`;
    }

    // fetching JS should immediately apply to the document
    // Remark: We could check for duplicates here based on the URL
    // Better in dev mode to always fetch the JS and write it to the document
    // if (!document.querySelector(`script[src="${url}"]`)) {
    let script = document.createElement('script');
    script.src = fullUrl;
    document.head.appendChild(script);
    // on load resolve promise
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
    });
}

bp.createWorker = async function createWorker(url, config = {}) {
    let fullUrl = `${bp.config.host}/v2${url}`;

    bp.log('createWorker', fullUrl);
    try {
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const workerScriptUrl = URL.createObjectURL(blob);
        let workerConfig = config || {};
        const worker = new Worker(workerScriptUrl, workerConfig);
        bp.log('Local Worker created from:', url);
        return worker;
    } catch (error) {
        console.error('Failed to load worker script:', url, error);
        return null; // Return null if the worker failed to load
    }
}

// Create a simple event emitter on bp
bp._emitters = {};

bp.emit = function emit(event, ...args) {
    // Log the emission of the event with all its arguments
    bp.log('emit', event, ...args);

    // Check if there are any registered emitters for the event
    if (bp._emitters[event]) {
        // Call each registered callback with the provided arguments
        bp._emitters[event].forEach(emitter => {
            if (emitter.callback) {
                emitter.callback(...args);
            }
        });
    }
}

bp.on = function on(event, label, callback) {
    if (!event || !label || !callback) {
        throw new Error('Missing required parameters for on()');
    }
    // Listen for events with a label
    if (!bp._emitters[event]) {
        bp._emitters[event] = [];
    }
    bp._emitters[event].push({ label: label, callback: callback });
    bp.log('on', event, label);
}

bp.off = function off(event, label) {
    // Stop listening for events with a specific label
    bp.log('off', event, label);
    if (bp._emitters[event]) {
        bp._emitters[event] = bp._emitters[event].filter(emitter => emitter.label !== label);
    }
}

// Identify the current user
bp.me = 'Guest'; // Guest user by default // TODO: auth / login

export default bp;


//bp.apps.ui.loadDocumentBody();


/*

Example:

await bp.start(['game', 'system', 'entity']);

let ent = bp.apps.entity.createEntity(config)
also
let ent = bp.createEntity(config);
bp.removeEntity(ent.id)

  bp.make = function() {
    return new game.EntityBuilder(game);
  };


let ent = bp.make()
    .type('MY_TYPE') // Example entity type
    .name('a-thing')
    .kind('Warrior')
    .position(0, 50)
    .startingPosition(0, 0)
    .body(true)
    .velocity(0, -15)
    .rotation(Math.PI / 2) // in Radians
    .angle(45)  // in Degrees
    .mass(10)
    .density(1.2)
    .health(100)
    .score(0)
    .size(32, 32, 32) // Example for 3D game; omit depth for 2D
    .radius(8) // If applicable, for circular entities
    .shape('rectangle') // 'circle', 'polygon', etc.
    .color('red')
    .texture({
      sheet: 'blackMage',
      sprite: 'playerRight',
    })
    .style({ border: '1px solid red' }) // CSS-like style object
    .maxSpeed(10)
    //.owner('player1')
    .hasInventory(false)
    .isSensor(false)
    .isStatic(false)
    .pointerdown(() => updateCounter('pointerdown'))
    .collisionStart(() => updateCounter('collisionStart'))
    .collisionActive(() => updateCounter('collisionActive'))
    .collisionEnd(() => updateCounter('collisionEnd'))
    .onUpdate(() => updateCounter('onUpdate'))
    .meta({ level: 1, faction: 'allies' })
    .text('Hello World')
    .clone(33) // Create 11 clones of the entity with the specified configuration
    
    
  entityConfig.createEntity();

  console.log(bp.data.ents)...



BP.apps.buddylist.sendBuddyRequest('buddy1');
BP.apps.buddylist.acceptBuddyRequest('buddy1');
BP.apps.buddylist.sendMessage('buddy1', 'hello');

BP.apps.buddylist.on('message', (data) => {
    console.log('message', data);
});

BP.apps.buddylist.on('buddyrequest', (data) => {
    console.log('buddyrequest', data);
});

BP.apps.buddylist.on('buddyaccept', (data) => {
    console.log('buddyaccept', data);
});


*/

