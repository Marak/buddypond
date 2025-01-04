import tape from 'tape';
import Gamblor from '../GamblorClass.js';

tape('Gamblor can load and has expected methods and properties', (t) => {
    const gamblor = new Gamblor();

    t.equal(typeof Gamblor, 'function', 'Gamblor is a function');
    t.equal(typeof gamblor.bet, 'function', 'bet function exists');
    t.equal(typeof gamblor.prove, 'function', 'prove function exists');
    t.end();
});

tape('Gamblor prove function validates a correct bet result', (t) => {
    const gamblor = new Gamblor();
    const betResult = gamblor.bet({
        bets: [
            { buddy: 'buddy1', amount: 100, seed: 'seed1', bet: 'heads' },
            { buddy: 'buddy2', amount: 100, seed: 'seed2', bet: 'tails' }
        ],
        type: 'coinflip'
    });

    const isValid = gamblor.prove(betResult);
    t.ok(isValid, 'The bet result is valid when conditions are reproduced exactly');
    t.end();
});

tape('Gamblor prove function rejects an incorrect bet result', (t) => {
    const gamblor = new Gamblor();
    const betResult = gamblor.bet({
        bets: [
            { buddy: 'buddy1', amount: 100, seed: 'seed1', bet: 'heads' },
            { buddy: 'buddy2', amount: 100, seed: 'seed2', bet: 'tails' }
        ],
        type: 'coinflip'
    });

    // Manipulate the result to test failure
    betResult.result = 'tails';  // Change result to the incorrect one
    console.log('betResult', betResult);
    const isValid = gamblor.prove(betResult.ramblorResult);
    t.notOk(isValid, 'The bet result is invalid when the result has been tampered with');
    t.end();
});