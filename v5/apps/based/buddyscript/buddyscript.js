import Commands from './commands/defaultCommands.js';

export default class BuddyScript {
    constructor(bp, options = {}) {

        this.bp = bp;
        this.commandActions = {
            give: (context) => {
                console.log('Giving:', context);
                return false;
            },
            points: (context) => {
                console.log('Points:', context);
                return true;
            }
        };

        this.commands = this.commandActions;


    }

    init () {
        let defaultCommands = new Commands(this.bp);
        // merge defaultCommands onto this.commandActions
        Object.assign(this.commands, defaultCommands.commands);
        // console.log("Merged commands", this.commands);

    }

    isValidBuddyScript(command) {
        console.log("Checking if valid command", command, this.commands);
        return this.commands[command];
    }

    parseCommand(input) {
        if (!input || input.length < 2) {
            // console.log('Invalid command length');
            return false; // Ignore empty or too short commands
        }
        // alert(input)
        let firstChar = input.substr(0, 1);
        let commands = input.split(' ');
        commands[0] = commands[0].substr(1); // Remove the first slash or backslash
        // console.log('Parsing command', input, firstChar, commands);
        if (firstChar === '\\') {
            if (this.isValidBuddyScript(commands[0])) {
                console.log('running command', commands);
                return { command: commands.join(' '), type: 'execute' };
            } else {
                this.alertInvalidCommand();
                return { type: 'invalid' };
            }
        }

        if (firstChar === '/') {
            // console.log('Handling pipes');
            return this.handlePipes(input);
        }

        return false; // If no valid starting character, ignore
    }

    executeCommand(command, context) {
       // console.log('Executing command', command, context);
        if (this.commandActions[command]) {
            //console.log("Executing command action", command, context, this.commandActions[command].toString());
            return this.commandActions[command](context);
        } else {
            // console.log(`Executing command: ${command}`);
            console.log(command, context);
            return true; // Default action if command is recognized but has no specific handler
        }
    }

    handlePipes(input) {
        let parts = input.split('|');
        let results = [];
        let context = {}; // could also build a context object here
        // console.log("Handling pipes", parts);
        for (let part of parts) {
            let commandParts = part.trim().split(' ');
            let command = commandParts[0].substr(1);
            let commandArgs = commandParts.slice(1);
            // console.log("aaCommand parts", command, commandParts, commandArgs);
            if (this.isValidBuddyScript(command)) {
                results.push(this.executeCommand(command, commandArgs));
            } else {
                this.alertInvalidCommand();
                return { type: 'invalid' };
            }
        }

        return results;
    }

    alertInvalidCommand() {
        console.log('Invalid BuddyScript. Will not send.');
    }

    addCommand(name, action) {
        this.commandActions[name] = action;
    }

    removeCommand(name) {
        delete this.commands[name];
    }
}
