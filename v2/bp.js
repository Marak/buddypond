// very thin wrapper to establish bp namespace and ability to load apps dynamically
const bp = {};
window.bp = bp;

bp.log = console.log;
bp.log = function noop() { }
bp.error = console.error;

bp.apps = {};
bp.data = {};

bp.start = async function start(apps = []) {
    for (let app of apps) {
        if (typeof app === 'string') {
            bp.log('loading async import app', app);
            await bp.importModule(app, {}, true);
        }
        if (typeof app === 'object') {
            bp.log('loading async import app', app.name);
            await bp.importModule(app.name, app, true);
        }
    }
}

let bpHost = 'http://192.168.200.59:5174';


bp.importModule = async function importModule(app, config, buddypond = true) {

    
    let modulePath = bpHost + `/v2/apps/based/${app}/${app}.js`;

    if (!buddypond) {
        modulePath = app;
    }
    try {
        bp.log('modulePath', modulePath)
        let module = await import(/* @vite-ignore */modulePath);
        if (buddypond) {
            bp.apps[app] = new module.default(bp, config);
            await bp.apps[app].init();
            bp.log('init complete', app);
    
        }
    } catch (error) {
        bp.error('Failed to load module:', app, error);
        delete bp.apps[app]; // just in case
    }

}


bp.fetchHTMLFragment = function fetchHTMLFragment(url) {
    let fullUrl = `${bpHost}${url}`;
    return fetch(fullUrl).then(response => response.text());
}

bp.appendCSS = function appendCSS(url) {
    let fullUrl = `${bpHost}${url}`;

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
        fullUrl = `${bpHost}${url}`;
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
    let fullUrl = `${bpHost}/v2${url}`;
    
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

