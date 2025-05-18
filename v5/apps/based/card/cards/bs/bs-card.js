// TODO: this shows all bs commands
// TODO: the bs card should probably be for running a bs command, not listing them
// TODO: we could use the same card for both, switching on the context
// TODO: might want to create a separate card bs-command, and not use bp-app ( for now )
         // we could add a conditional to see if the bs command is an app or a script, not that important ( possibly )
export default function applyData(el, data) {

  // this is bs-card, no apps-card
  const apps = this.bp.apps.desktop.apps;
  //const commandSet = Object.keys(apps).sort();
  const commandSet = Object.keys(this.bp.apps.buddyscript.commands);
  console.log('commandSet', commandSet);

  const $el = $(el);
  const appsCommands = $el.find('.card-apps-commands');


  // Add command elements
  commandSet.forEach(command => {
    //let app = apps[command];
    const commandText = `${command}`;
    //const appsText = command.appsText;
    const commandDiv = document.createElement('div');
    commandDiv.className = 'card-apps-command';
    commandDiv.innerHTML = `
            <span class="card-apps-command-text">/${commandText}</span>
        `;

    // <span class="card-apps-command-apps">${appsText}</span>
    // Add click handler for commands
    commandDiv.addEventListener('click', () => {
      // Stub action: Log command execution (replace with actual command execution logic)
      console.log(`Executing command: ${commandText}`);
      // Optional: Trigger a visual feedback
      commandDiv.classList.add('card-apps-clicked');

      // TODO: run bs command with chatWindow as context?
      this.bp.apps.buddyscript.executeCommand(command, { chatWindow: this.bp.apps.buddyscript.chatWindow });
      //this.bp.open(command);
      setTimeout(() => commandDiv.classList.remove('card-apps-clicked'), 200);
    });
    console.log('commandDiv', commandDiv);
    appsCommands.append(commandDiv);
  });

  // Add close button functionality
  $el.find('.card-apps-close-btn').on('click', () => {
    $el.hide(); // Hide the apps card (replace with your preferred close logic)
  });
}