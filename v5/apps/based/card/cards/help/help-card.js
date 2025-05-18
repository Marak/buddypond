const commandSet = [
    {
        command: '/apps',
        additional: '',
        helpText: 'Lists all installed apps',
        card: 'apps'
    },
    /*
    {
        command: '/bs',
        additional: '',
        helpText: 'Shows all available BuddyScript Commands'
    },
    */
    /*
    {
        command: '/meme',
        helpText: 'Sends Mnemosyne A.I. Powered meme'
    },
    {
        command: '/meme',
        additional: ' cool',
        helpText: 'A.I. Powered meme search'
    },
    */
    {
        command: '/say',
        additional: ' hello world',
        helpText: 'Speaks "hello world" to the chat'
    },
    /*
    {
        command: '/say',
        additional: ' 😇',
        helpText: 'Speaks localized "smiling face with halo"'
    },
    */
    /*
    {
        command: '/points',
        additional: '',
        helpText: 'Shows your current Good Buddy Points'
    },
    {
        command: '/points',
        additional: ' Randolph',
        helpText: 'Shows how many Good Buddy Points Randolph has'
    },
    {
        command: '/give',
        additional: ' Randolph 10',
        helpText: 'Gives Randolph 10 Good Buddy Points'
    },
    */
    {
        command: '/roll',
        additional: ' 20',
        helpText: 'Rolls a d20 dice'
    },
    /*
    {
        command: '/quit',
        additional: ' message',
        helpText: 'Logs out of BuddyPond Desktop'
    },
    */
    {
        command: '/help',
        helpText: 'Shows this help message'
    }
];

export default function applyData(el, data, cardClass, parent) {
    const $el = $(el);
    const helpCommands = $el.find('.card-help-commands');
    // get the closest .chatWindow
    console.log('eeeee', cardClass, parent);
    const chatWindow = $el.closest('.chatWindow');

    // Add command elements
    commandSet.forEach(command => {
        const commandText = `${command.command}${command.additional ? ' ' + command.additional : ''}`;
        const helpText = command.helpText;
        const commandDiv = document.createElement('div');
        commandDiv.className = 'card-help-command';
        commandDiv.innerHTML = `
            <span class="card-help-command-text">${commandText}</span>
            <span class="card-help-command-help">${helpText}</span>
        `;
        // Add click handler for commands
        commandDiv.addEventListener('click', () => {
            // Stub action: Log command execution (replace with actual command execution logic)
            console.log(`Executing command: ${commandText}`);
            // Optional: Trigger a visual feedback
            commandDiv.classList.add('card-help-clicked');
            console.log('pppp', parent);
            this.bp.apps.buddylist.showCard({ chatWindow: parent, cardName: 'apps'})
            // TODO: run bs command with chatWindow as context?

            setTimeout(() => commandDiv.classList.remove('card-help-clicked'), 200);
        });
        helpCommands.append(commandDiv);
    });

    // Add close button functionality
    $el.find('.card-help-close-btn').on('click', () => {
        $el.hide(); // Hide the help card (replace with your preferred close logic)
    });
}