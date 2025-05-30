
export default function applyData(el, data) {

  const apps = this.bp.apps.desktop.apps;
  let commandSet = [];

  // iterate through all the desktop.apps and index by .name property
  Object.keys(apps).forEach(appName => {
    const app = apps[appName];
    commandSet.push(app);
  });

  const $el = $(el);
  const appsCommands = $el.find('.card-apps-commands');

  // sort commandSet by label or name
  commandSet.sort((a, b) => {
    const labelA = a.label || a.name;
    const labelB = b.label || b.name;
    return labelA.localeCompare(labelB);
  });

  // Add command elements
  commandSet.forEach(app => {

    let command = app.name;
    const commandText = `${app.label || command}`;
    const appsText = app.label;
    const commandDiv = document.createElement('div');
    commandDiv.className = 'card-apps-command';
    commandDiv.innerHTML = `
            <span class="card-apps-command-text">${commandText}</span>
        `;

    // Add click handler for commands
    commandDiv.addEventListener('click', () => {
      // Stub action: Log command execution (replace with actual command execution logic)
      // console.log(`Executing command: ${commandText}`);
      // Optional: Trigger a visual feedback
      commandDiv.classList.add('card-apps-clicked');
      // console.log('binding command', command, app);
      // TODO: run bs command with chatWindow as context?
      this.bp.open(command, { context: app.options.context });
      setTimeout(() => commandDiv.classList.remove('card-apps-clicked'), 200);
    });
    appsCommands.append(commandDiv);
  });

  // Add close button functionality
  $el.find('.card-apps-close-btn').on('click', () => {
    $el.hide(); // Hide the apps card (replace with your preferred close logic)
  });

}