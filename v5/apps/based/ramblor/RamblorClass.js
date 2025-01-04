export default class Ramblor {
    constructor(options = {}) {
        this.algo = options.algo || 'default';
        this.history = [];
        this.userSeed = [];
        this.systemSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    seed(...seeds) {
        this.userSeed = seeds.flat().map(seed => seed.toString());
    }

    roll(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error('Min and max must be numbers');
        }
        if (min > max) {
            throw new Error('Min cannot be greater than max');
        }

        const seedString = this.userSeed.join('|') + '|' + this.systemSeed;
        const randomValue = this.simpleHash(seedString);
        
        // Ensure positive value and proper distribution
        const positiveValue = Math.abs(randomValue);
        const range = max - min + 1;
        const result = min + (positiveValue % range);

        const roll = {
            generation: this.history.length + 1,
            min: min,
            max: max,
            value: result,
            userSeeds: this.userSeed.slice(),
            systemSeed: this.systemSeed
        };

        this.history.push(roll);
        return roll;
    }

    toss() {
        const result = this.roll(0, 1);
        // Repurpose the result object for toss specifics
        return {
            ...result,
            label: result.value === 1 ? 'heads' : 'tails',  // Return 'heads' or 'tails' instead of 0 or 1
            value: result.value  // Return 'heads' or 'tails' instead of 0 or 1
        };
    }
    
    pick(array) {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error('Pick requires a non-empty array');
        }
        const result = this.roll(0, array.length - 1);
        return {
            ...result,
            item: array[result.value],  // Include the selected item in the result
            index: result.value         // Include the index as a specific attribute
        };
    }
    

    getHistory(index = null) {
        if (index === null) return this.history;
        if (index < 0) {
            const actualIndex = this.history.length + index;
            return actualIndex >= 0 ? this.history[actualIndex] : null;
        }
        return this.history[index];
    }

    prove(roll) {
        if (!roll || typeof roll !== 'object') {
            return false;
        }

        const seedString = roll.userSeeds.join('|') + '|' + roll.systemSeed;
        const randomValue = this.simpleHash(seedString);
        const positiveValue = Math.abs(randomValue);
        const range = roll.max - roll.min + 1;
        console.log('proving roll', roll, 'positiveValue', positiveValue, 'range', range);
        const expectedResult = roll.min + (positiveValue % range);
        console.log('expectedResult', expectedResult, 'actualResult', roll.value);
        let result = (expectedResult === roll.value);
        console.log('result', result)
        return result;
    }

    simpleHash(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash + char) | 0;
        }
        return hash;
    }
}