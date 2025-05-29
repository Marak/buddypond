// TODO: this shows all bs commands
// TODO: the bs card should probably be for running a bs command, not listing them
// TODO: we could use the same card for both, switching on the context
// TODO: might want to create a separate card bs-command, and not use bp-app ( for now )
// we could add a conditional to see if the bs command is an app or a script, not that important ( possibly )
export default function applyData(el, data, cardClass, parent) {

    // this is bs-card, no apps-card
    const apps = this.bp.apps.desktop.apps;
    console.log('dddd card', data)
    let bs = this.bp.apps.buddyscript.parseCommand(data.command);
    console.log('bs', bs);
    /*
    console.log('icon', icon);
    */
    let commandData = bs.commandData.object || {};
    console.log('commandData', commandData);
    let icon = commandData.icon || 'fa fa-terminal';
    let iconPath = `/desktop/assets/images/icons/icon_${icon}_64.png`
    

    //const commandSet = Object.keys(apps).sort();
    const commands = this.bp.apps.buddyscript.commands;

    const commandSet = Object.keys(commands);
    console.log("commands", commands);
    console.log('commandSet', commandSet);

    const $el = $(el);

    let bsInput = bs.command || '';
    // alert(action)
    // hide the apps commands

    // set .card-bs-app-image src to iconPath
    $el.find('.card-bs-app-image').attr('src', iconPath);

    // TODO: click on image should run the command
    $el.find('.card-bs-app-image').on('click', (e) => {
        e.stopPropagation(); // Prevent the click from propagating to the card
        e.preventDefault(); // Prevent default action

        let aimInput = parent.content.querySelector('.aim-input');
        let sendButton = parent.content.querySelector('.aim-send-btn');
        console.log('aimInput', aimInput, sendButton);
        if (aimInput) {
            aimInput.value = data.command;
            aimInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
        }
        if (sendButton) {
            sendButton.click(); // Simulate button click
        }
    });


    // renders a form to execute a single command
    // replace the first \ with /
    bsInput = bsInput.replace(/\\/g, '/');
    $el.find('.card-bs-app-text-command').text(data.command);

    // add a click handler to the input
    $el.find('.card-bs-app-submit').on('click', (e) => {
        e.stopPropagation(); // Prevent the click from propagating to the card
        e.preventDefault(); // Prevent default action


        let aimInput = parent.content.querySelector('.aim-input');
        let sendButton = parent.content.querySelector('.aim-send-btn');
        console.log('aimInput', aimInput, sendButton);
        if (aimInput) {
            aimInput.value = data.command;
            aimInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
        }
        if (sendButton) {
            sendButton.click(); // Simulate button click
        }



    });


}