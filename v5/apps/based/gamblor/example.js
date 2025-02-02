import Gamblor from './GamblorClass.js';


let gamblor = new Gamblor();

let betTypes = [
    'highroll',
    'lowroll',
    'coinflip'


]


// basic bet with buddies all betting same amount
// all seeds will combine using RamblorClass
let result = gamblor.bet({
    bets: [
        {
            buddy: 'buddy1',
            amount: 1000,
            bet: 'heads',
            seed: '1234567890'
        },
        {
            buddy: 'buddy2',
            amount: 1000,
            bet: 'tails',
            // seed is optional
        },
        {
            buddy: 'buddy3',
            amount: 1000,
            bet: 'heads',
            seed: '123456ww0'
        },
    ],
    type: 'coinflip',
})

console.log(result);

/*
    result = {
        winner: 'buddy1',
        amount: 3000,
        ramblorResult: a ramblorResultObject from RamblorClass ( contains seed )
        bets: [
            {
                buddy: 'buddy1',
                amount: 1000,
                bet: 'heads'
            },
            {
                buddy: 'buddy2',
                amount: 1000,
                bet: 'tails'
            },
            {
                buddy: 'buddy3',
                amount: 1000,
                bet: 'heads'
            },
        ]
    }

*/

// highroll wins
let highRoll = gamblor.bet({
    bets: [
        {
            buddy: 'buddy1',
            amount: 1000,
            seed: '1234567890'
        },
        {
            buddy: 'buddy2',
            amount: 1000,
        },
        {
            buddy: 'buddy3',
            amount: 1000,
        }
    ]
});

console.log(highRoll);

/* 
    highRoll = {
        winner: 'buddy1',
        amount: 3000,
        ramblorResult: a ramblorResultObject from RamblorClass ( contains seed )
        bets: [
            {
                buddy: 'buddy1',
                amount: 1000,
            },
            {
                buddy: 'buddy2',
                amount: 1000,
            },
            {
                buddy: 'buddy3',
                amount: 1000,
            }
        ]
    }

*/
