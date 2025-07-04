
export default function applyData(el, data, cardClass, parent) {

  const apps = this.bp.apps.desktop.appList;
  let commandSet = [];

  // iterate through all the desktop.apps and index by .name property
  Object.keys(apps).forEach(appName => {
    const app = apps[appName];
    app.name = appName; // Ensure app has a name property
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
      // console.log('Opening app', command, 'with context', app.options?.context);
      this.bp.open(app.app || command, {
        context: parent.currentActiveContext || parent.context || app.options?.context,
        output: parent.type
      });
      setTimeout(() => commandDiv.classList.remove('card-apps-clicked'), 200);
    });
    appsCommands.append(commandDiv);
  });

  // Add close button functionality
  $el.find('.card-apps-close-btn').on('click', () => {
    $el.hide(); // Hide the apps card (replace with your preferred close logic)
  });

  if (cardClass.bp && cardClass.bp.apps && cardClass.bp.apps.buddylist) {
    cardClass.bp.apps.buddylist.scrollToBottom(parent.content);
  }

}