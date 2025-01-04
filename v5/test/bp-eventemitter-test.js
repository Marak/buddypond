import tape from 'tape';
import bp from '../bp.js';

// Clearing up before each test to ensure isolation
function setup() {
    bp._emitters = {}; // Reset the events
}


tape('bp can load and has expected methods', (t) => {
    t.equal(typeof bp.emit, 'function');
    t.equal(typeof bp.on, 'function');
    t.equal(typeof bp.off, 'function');
    t.equal(typeof bp._emitters, 'object');
    t.end();
});



tape('bp event emitter functionality', (t) => {
    setup();

    let dataReceived = null;
    const eventName = 'update::test';
    const testData = 'Test Data';

    // Test registering an event and emitting it
    bp.on(eventName, 'register-test', (data) => {
        dataReceived = data;
    });

    bp.emit(eventName, testData);
    t.equal(dataReceived, testData, 'Should receive the correct data from emit');

    // Test removing an event listener
    dataReceived = null; // Reset received data
    bp.off(eventName, 'register-test');

    bp.emit(eventName, 'New Data');
    t.notEqual(dataReceived, 'New Data', 'Data should not be received after listener is removed');

    t.end();
});

// Test multiple listeners for the same event
tape('bp handles multiple listeners for the same event correctly', (t) => {
    setup();

    let firstListenerReceived = null;
    let secondListenerReceived = null;
    const eventName = 'multi::test';
    const testData = 'Multi Test Data';

    bp.on(eventName, 'first-listener', (data) => {
        firstListenerReceived = data;
    });

    bp.on(eventName, 'second-listener', (data) => {
        secondListenerReceived = data;
    });

    bp.emit(eventName, testData);
    t.equal(firstListenerReceived, testData, 'First listener should receive the correct data');
    t.equal(secondListenerReceived, testData, 'Second listener should receive the correct data');

    // Remove first listener and test again
    bp.off(eventName, 'first-listener');
    firstListenerReceived = null; // Reset first listener data

    bp.emit(eventName, 'New Multi Test Data');
    t.equal(firstListenerReceived, null, 'First listener should not receive data after being removed');
    t.equal(secondListenerReceived, 'New Multi Test Data', 'Second listener should still receive data');

    t.end();
});

// Test emitting events with no listeners
tape('bp emits events with no listeners', (t) => {
    setup();

    const eventName = 'no-listener::test';
    // Attempting to emit an event without listeners should not cause errors
    t.doesNotThrow(() => {
        bp.emit(eventName, 'Data for no one');
    }, 'Emitting an event without listeners should not throw an error');

    t.end();
});
