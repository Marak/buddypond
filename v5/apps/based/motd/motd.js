export default class Motd {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Example');
        console.log('motd is: under construction');

        let today = DateFormat.format.date(new Date(), 'MM/dd/yy');
        let motdWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'motd',
            title: 'Today: ' + today,
            icon: 'desktop/assets/images/icons/icon_console_64.png',
            x: 250,
            y: 75,
            width: 400,
            height: 300,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: '<h1>Message of the Day</h1><p>Under construction</p>',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onclose: () => {
                this.bp.ui.windowManager.destroyWindow('motd');
            }
        });

        motdWindow.content.innerHTML = '';

        let motdContent = document.createElement('div');

        motdContent.style.display = 'flex';
        motdContent.style.flexDirection = 'row';
        motdContent.style.justifyContent = 'center';
        motdContent.style.alignItems = 'center';
        motdContent.style.padding = '20px';


        // header image
        let imageGuyLeft = document.createElement('img');
        imageGuyLeft.src = 'v5/assets/guy-left.gif';
        motdContent.appendChild(imageGuyLeft);
        let imageContruction = document.createElement('img');
        imageContruction.src = 'v5/assets/construction.gif';
        motdContent.appendChild(imageContruction);
        let imageGuyRight = document.createElement('img');
        imageGuyRight.src = 'v5/assets/guy-right.gif';
        motdContent.appendChild(imageGuyRight);

        motdWindow.content.appendChild(motdContent);

        // message
        let message = document.createElement('div');
        message.style.textAlign = 'center';
        message.style.fontSize = '1.5em';
        message.style.fontWeight = 'bold';
        message.style.padding = '20px';
        message.innerHTML = 'We are in the process of upgrading to the new BuddyPond v5. <br/><br/> Level 2 users may join the chat.';

        motdWindow.content.appendChild(message);


        motdWindow.open();


        return 'loaded Example';
    }
}