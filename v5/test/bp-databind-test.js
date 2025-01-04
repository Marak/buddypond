import tape from 'tape';
import bp from '../bp.js';

tape('bp can load and has expected methods', (t) => {
    t.equal(typeof bp.get, 'function');
    t.equal(typeof bp.set, 'function');
    t.equal(typeof bp.data, 'object');
    t.end();
});

// Clearing up before each test to ensure isolation
function setup() {
    bp.data = {}; // Reset the data object
    bp._emitters = {}; // Reset the events
}

// Register and unregister event listeners for tests
function registerEventListener(event, name, callback) {
    bp.on(event, name, callback);
    return () => bp.off(event, callback);
}

tape('bp.set() and bp.get() basic functionality', (t) => {
    setup();

    bp.set('user.name', 'John Doe');
    t.equal(bp.get('user.name'), 'John Doe', 'Should retrieve the correct user name');
    t.equal(bp.data.user.name, 'John Doe', 'Should set the correct user name in data object');
    bp.set('user.age', 30);
    t.equal(bp.data.user.age, 30, 'Should set the correct user age in data object');
    t.equal(bp.get('user.age'), 30, 'Should retrieve the correct user age');

    t.end();
});

tape('bp.set() and bp.get() with nested object paths', (t) => {
    setup();

    bp.set('user.details.address.city', 'New York');
    t.equal(bp.get('user.details.address.city'), 'New York', 'Should set and get the city correctly');
    t.equal(bp.data.user.details.address.city, 'New York', 'Should set the city correctly in data object');

    t.end();
});

tape('bp.set() should emit events correctly', (t) => {
    setup();

    let expectedData = '123-456-7890';
    const unregister = registerEventListener('data::user.details.phone', 'test-event', (data) => {
        t.equal(data, expectedData, 'Event emitted with correct data for user phone number');
        unregister(); // Clean up the event listener
        t.end();
    });

    bp.set('user.details.phone', expectedData);
});

tape('bp.get() on non-existent keys', (t) => {
    setup();

    t.equal(bp.get('non.existent.key'), undefined, 'Should return undefined for non-existent keys');
    t.end();
});
tape('bp.get() on non-existent keys', (t) => {
    t.equal(bp.get('non.existent.key'), undefined, 'Should return undefined for non-existent keys');

    t.end();
});
