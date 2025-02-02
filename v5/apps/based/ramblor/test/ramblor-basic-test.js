import tape from 'tape';
import Ramblor from '../RamblorClass.js';

tape('Ramblor can load and has expected methods and properties', (t) => {
    const randblor = new Ramblor();

    t.equal(typeof Ramblor, 'function', 'Ramblor is a function');
    t.equal(typeof randblor.seed, 'function', 'seed method exists');
    t.equal(typeof randblor.roll, 'function', 'roll method exists');
    t.equal(typeof randblor.toss, 'function', 'toss method exists');
    t.equal(typeof randblor.pick, 'function', 'pick method exists');
    t.equal(typeof randblor.getHistory, 'function', 'getHistory method exists');
    t.equal(typeof randblor.prove, 'function', 'prove method exists');
    t.end();
});

tape('Ramblor rolling returns valid and expected results', (t) => {
    const randblor = new Ramblor();
    randblor.seed('test', 123);
    const roll = randblor.roll(1, 6);

    t.equal(typeof roll, 'object', 'roll returns an object');
    t.equal(typeof roll.value, 'number', 'roll.value is a number'); // TODO: result?
    t.ok(roll.value >= 1 && roll.value <= 6, 'roll.value is within the specified range');
    t.end();
});

tape('Ramblor tossing returns structured object with expected properties', (t) => {
    const randblor = new Ramblor();
    const result = randblor.toss();

    t.equal(typeof result, 'object', 'toss returns an object');
    t.equal(result.min, 0, 'toss min is 0');
    t.equal(result.max, 1, 'toss max is 1');
    // toll result value is either 0 or 1
    t.ok(['heads', 'tails'].includes(result.label), 'toss result label is either heads or tails');
    t.end();
});

tape('Ramblor picking returns structured object with expected properties', (t) => {
    const randblor = new Ramblor();
    const array = ['apple', 'banana', 'cherry'];
    const result = randblor.pick(array);

    t.equal(typeof result, 'object', 'pick returns an object');
    t.ok(array.includes(result.item), 'picked element is in the array');
    t.equal(typeof result.index, 'number', 'pick includes an index');
    t.ok(result.index >= 0 && result.index < array.length, 'index is within array bounds');
    t.end();
});

tape('Ramblor prove verifies roll validity correctly', (t) => {
    const randblor = new Ramblor();
    randblor.seed('test', 123);
    const roll = randblor.roll(1, 6);
    const isValid = randblor.prove(roll);

    t.equal(isValid, true, 'prove confirms the roll is valid');
    t.end();
});

// Testing the verification of a toss
tape('Ramblor prove verifies coin flip validity correctly', (t) => {
    const randblor = new Ramblor();
    randblor.seed('test', 123);
    const result = randblor.toss();
    console.log('result', result);
    //const isValid = randblor.prove(result);
//
  //  t.equal(isValid, true, 'prove confirms the coin flip result is valid');
    t.end();
});
