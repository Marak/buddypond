import Commands from './commands/defaultCommands.js';

export default class BuddyScript {
    constructor(bp, options = {}) {

        this.bp = bp;
        this.commandActions = {};

        this.commands = this.commandActions;


    }

    init() {
        let defaultCommands = new Commands(this.bp);
        // merge defaultCommands onto this.commandActions
        Object.assign(this.commands, defaultCommands.commands);
        // console.log("Merged commands", this.commands);

    }

    isValidBuddyScript(command) {
        // console.log("Checking if valid command", command, this.commands);
        return this.commands[command];
    }

    parseCommand(input, options = {}) {
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
            // alert('reverse command')
            if (this.isValidBuddyScript(commands[0])) {
                // console.log('running command', commands);
                let commandData = this.commands[commands[0]];
                // reverse shell commands will show the bs-card such that users can click on the command
                // TODO: allow marak / admins to open apps remotely 
                return { command: commands.join(' '), type: 'show-card', input: input, commandData, options };
            } else {
                this.alertInvalidCommand();
                return { type: 'invalid' };
            }
        }

        if (firstChar === '/') {
            // console.log('Handling pipes');
            let commandData = this.commands[commands[0]];
            // console.log('return pipe Running command', commands, commandData, options);
            // instead of running handlePipes here, return an object that indicates the command is a pipable command
            return { pipe: (options) => {
                // console.log('pipe options', options);
                return this.handlePipes(input, options);
            }, command: commands.join(' '), type: 'execute', input: input, commandData, options };
            // return this.handlePipes(input);
        }

        return false; // If no valid starting character, ignore
    }

    executeCommand(command, context, options = {}) {
        if (this.commandActions[command]) {
            // console.log("Executing command action", command, context, this.commandActions[command]);
            context.data = this.commandActions[command]; // maybe?
            if (this.commandActions[command].fn) {
                return this.commandActions[command].fn.call(this, context, options);
            }
            return this.commandActions[command].call(this, context, options);
        } else {
            // console.log(`Executing command: ${command}`);
            console.log(command, context);
            return true; // Default action if command is recognized but has no specific handler
        }
    }

    handlePipes(input, options = {}) {
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
                results.push(this.executeCommand(command, commandArgs, options));
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
        console.log('Adding command', name, action);
        this.commandActions[name] = {
            fn: action,
            //            object: { command: name }
        };
    }

    removeCommand(name) {
        delete this.commands[name];
    }
}
