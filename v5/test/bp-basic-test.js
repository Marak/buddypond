import tape from 'tape';
import bp from '../bp.js';

tape('bp can load and has expected methods and properties', (t) => {
    t.equal(typeof bp.load, 'function');
    t.equal(typeof bp.on, 'function');
    t.equal(typeof bp.emit, 'function');
    t.equal(typeof bp.importModule, 'function');
    t.equal(typeof bp.appendCSS, 'function');
    t.equal(typeof bp.appendScript, 'function');
    t.equal(typeof bp.fetchHTMLFragment, 'function');
    t.equal(typeof bp.apps, 'object');
    t.equal(typeof bp.get, 'function');
    t.equal(typeof bp.set, 'function');
    t.end();
});
