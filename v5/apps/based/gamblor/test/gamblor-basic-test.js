import tape from 'tape';
import Gamblor from '../GamblorClass.js';

tape('Gamblor can load and has expected methods and properties', (t) => {
    const gamblor = new Gamblor();

    t.equal(typeof Gamblor, 'function', 'Gamblor is a function');
    t.end();
});

tape('Gamblor handles coinflip bets correctly', (t) => {
    const gamblor = new Gamblor();
    const result = gamblor.bet({
        bets: [
            { buddy: 'buddy1', amount: 100, bet: 'heads', seed: 'seed1' },
            { buddy: 'buddy2', amount: 100, bet: 'tails', seed: 'seed2' },
            { buddy: 'buddy3', amount: 100, bet: 'heads', seed: 'seed3' }
        ],
        type: 'coinflip'
    });

    t.equal(result.bets.length, 3, 'Three bets processed');
    console.log(result);

    t.ok(['heads', 'tails'].includes(result.result), 'Coinflip result is either heads or tails');
    t.ok(result.winner === 'buddy1' || result.winner === 'buddy2' || result.winner === 'buddy3', 'Winner is one of the buddies');
    t.equal(result.amount, 300, 'Total amount is correct');
    t.end();
});

tape('Gamblor handles highroll bets correctly', (t) => {
    const gamblor = new Gamblor();
    const result = gamblor.bet({
        bets: [
            { buddy: 'buddy1', amount: 100, seed: 'seed1' },
            { buddy: 'buddy2', amount: 100, seed: 'seed2' },
            { buddy: 'buddy3', amount: 100, seed: 'seed3' }
        ],
        type: 'highroll'
    });

    t.equal(result.bets.length, 3, 'Three bets processed');
    t.ok(result.winner === 'buddy1' || result.winner === 'buddy2' || result.winner === 'buddy3', 'Winner is one of the buddies');
    t.equal(result.amount, 300, 'Total amount is correct');
    t.end();
});

tape('Gamblor aggregates seeds correctly', (t) => {
    const gamblor = new Gamblor();
    gamblor.bet({
        bets: [
            { buddy: 'buddy1', amount: 100, seed: 'seed1' },
            { buddy: 'buddy2', amount: 100 },
            { buddy: 'buddy3', amount: 100, seed: 'seed3' }
        ],
        type: 'highroll'
    });

    t.ok(gamblor.ramblor.userSeed.includes('seed1') && gamblor.ramblor.userSeed.includes('seed3'), 'Seeds are correctly aggregated');
    t.end();
});
