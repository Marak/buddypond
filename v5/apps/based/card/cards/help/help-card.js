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
        helpText: 'Lists all available BuddyScript Commands',
        card: 'bs-commands'
    },
    */
    /*
    {
        command: '/console',
        additional: '',
        helpText: 'Opens the Buddy Pond Console',
        onClick: function () {
            this.bp.open('console');
        }
    },
    */
    {
        command: '/cast',
        onClick: function () {
            // TODO: why this is undefined here
            console.log('this', this);
            this.bp.open('spellbook');            
        },
        helpText: 'Opens the Spellbook to cast spells',
        card: 'spellbook'
    },
    {
        command: '/markdown',
        helpText: 'Shows markdown and color formatting options',
        card: 'markdown'
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
    const chatWindow = $el.closest('.chatWindow');

    // Add command elements
    commandSet.forEach(command => {
        const commandText = `${command.command}${command.additional ? ' ' + command.additional : ''}`;
        const helpText = command.helpText;
        const commandDiv = document.createElement('div');
        commandDiv.className = 'card-help-command';
        commandDiv.setAttribute('data-app', command.card || 'none');
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

            if (command.onClick) {
                // not really needed, let bs handle it
                //command.onClick.call(this);
                //return; // Exit if onClick is defined
            }

            // Remark: should run bs script command
            // this.bp.apps.buddylist.showCard({ chatWindow: parent, cardName: 'apps'})
            // this doesn't work for /roll...since its a message
            // maybe just put in text to input and send it?
            let aimInput = parent.content.querySelector('.aim-input');
            let sendButton = parent.content.querySelector('.aim-send-btn');
            if (aimInput) {
                aimInput.value = commandText;
                aimInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
            }
            if (sendButton) {
                sendButton.click(); // Simulate button click
            }
            //this.bp.apps.buddyscript.executeCommand(command, chatWindow);
            // Remark: run bs command with chatWindow as context?

            setTimeout(() => commandDiv.classList.remove('card-help-clicked'), 200);
        });
        helpCommands.append(commandDiv);
    });

    // Add close button functionality
    $el.find('.card-help-close-btn').on('click', () => {
        $el.hide(); // Hide the help card (replace with your preferred close logic)
        // set local storage 'viewed-help-card' to true
        this.bp.set('viewed-help-card', true);
    });
}