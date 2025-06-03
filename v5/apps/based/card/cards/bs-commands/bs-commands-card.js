// TODO: this shows all bs commands
// TODO: the bs card should probably be for running a bs command, not listing them
// TODO: we could use the same card for both, switching on the context
// TODO: might want to create a separate card bs-command, and not use bp-app ( for now )
// we could add a conditional to see if the bs command is an app or a script, not that important ( possibly )
export default function applyData(el, data, cardClass, parent) {

    // this is bs-card, no apps-card
    //const apps = this.bp.apps.desktop.apps;
    //const commandSet = Object.keys(apps).sort();
    let bsCommands = this.bp.apps.buddyscript.commands;
    const commandSet = Object.keys(bsCommands);

    const $el = $(el);
    const appsCommands = $el.find('.card-bs-commands-commands');
    console.log('commandSet', commandSet);
    //console.log('apps', apps);
    //let action = data.context.action || 'list-all';
    //let bsInput = data.context.input || '';
    // alert(action)

    commandSet.sort();
    $el.find('.card-bs-app').remove();
    // Add command elements
    commandSet.forEach(command => {
        //let app = apps[command];
        const commandText = `${command}`;
        let _command = bsCommands[command];
        if (!_command || _command?.object.display === false) {
            //console.warn(`Command ${command} not found in bsCommands`);
            return; // Skip if command is not found
        }
        let commandDescription = bsCommands[command]?.object?.description || '';
        console.log('commandText', commandText, 'commandDescription', commandDescription, bsCommands[command]);
        //const appsText = command.appsText;
        const commandDiv = document.createElement('div');
        commandDiv.className = 'card-bs-commands-command';
        commandDiv.innerHTML = `
            <span class="card-bs-commands-command-text">/${commandText}</span>
            <span class="card-bs-commands-command-description">${commandDescription}</span>
        `;

        // <span class="card-bs-commands-command-apps">${appsText}</span>
        // Add click handler for commands
        commandDiv.addEventListener('click', () => {
            // Stub action: Log command execution (replace with actual command execution logic)
            console.log(`Executing command: ${commandText}`);
            // Optional: Trigger a visual feedback
            commandDiv.classList.add('card-bs-commands-clicked');

            // TODO: run bs command with chatWindow as context?
            this.bp.apps.buddyscript.executeCommand(command, { chatWindow: this.bp.apps.buddyscript.chatWindow });
            //this.bp.open(command);
            setTimeout(() => commandDiv.classList.remove('card-bs-commands-clicked'), 200);
        });
        // console.log('commandDiv', commandDiv);
        appsCommands.append(commandDiv);
    });

    // Add close button functionality
    $el.find('.card-bs-commands-close-btn').on('click', () => {
        $el.hide(); // Hide the apps card (replace with your preferred close logic)
    });

}