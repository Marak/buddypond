import Ramblor from "../ramblor/RamblorClass.js";

export default class Gamblor {
    constructor() {
        this.ramblor = new Ramblor();
    }

    bet({ bets, type = 'highroll' }) {
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const seeds = bets.map(bet => bet.seed || '').filter(Boolean);

        // Seed Ramblor with combined seeds if any
        if (seeds.length) {
            this.ramblor.seed(...seeds);
        }

        let winnerIndex, gameResult;
        switch (type) {
            case 'coinflip':
                gameResult = this._handleCoinFlip(bets);
                winnerIndex = bets.findIndex(bet => bet.bet === gameResult);
                break;
            case 'highroll':
            default:
                gameResult = this._handleHighRoll(bets);
                winnerIndex = gameResult.index;
                gameResult = gameResult.roll;  // set the actual roll value
                break;
        }

        const winner = bets[winnerIndex];
        const lastResult = this.ramblor.getHistory(-1);

        return {
            winner: winner.buddy,
            result: gameResult,
            amount: totalAmount,
            ramblorResult: lastResult,
            bets
        };
    }

    _handleCoinFlip(bets) {
        const result = this.ramblor.toss() ? 'heads' : 'tails';
        return result;
    }

    _handleHighRoll(bets) {
        const results = bets.map((_, index) => ({
            index,
            roll: this.ramblor.roll(1, 100).value
        }));
        results.sort((a, b) => b.roll - a.roll);
        return results[0];
    }

    prove(betResult) {
        console.log('Gamblor.prove', betResult);
        return this.ramblor.prove(betResult.ramblorResult);
    }
}
