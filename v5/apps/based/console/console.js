export default class Console {
    constructor(bp, options = {}) {
        this.bp = bp;
        return this;
    }

    async init() {
        this.bp.log('Hello from Console');


        await this.bp.load('buddyscript');

        // we can load modules or html fragments or css files here
        // using this.bp.load() method

        // injects CSS link tag into the head of document
        await this.bp.load('/v5/apps/based/console/console.css');

        // fetches html from the fragment and returns it as a string
        this.html = await this.bp.load('/v5/apps/based/console/console.html');


        
        $(document).on('keydown', (e) => {

            if (event.which == 192 ) {
                this.open();
                return false;
              }
          

        })

        return 'loaded Console';
    }

    async open () {


        let consoleWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'console',
            title: 'Console',
            x: 50,
            y: 100,
            width: 800,
            height: 400,
            minWidth: 200,
            minHeight: 200,
            parent: $('#desktop')[0],
            content: this.html,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            focusable: true,
            maximized: false,
            minimized: false,
            onOpen : () => {
                // set focus to the input
                $('.console_message_text', this.content).focus();
            }
        });

        this.consoleWindow = consoleWindow;

        // add a "/" to each command for consistency
        let sourceCommands = Object.keys(this.bp.apps.buddyscript.commands).map((command) => {
            return '/' + command;
        });


        $('.console_message_text', consoleWindow.content).autocomplete({
            source: sourceCommands
        }); 

        $('.console_send_message_form', consoleWindow.content).on('submit', (e) => {
            e.preventDefault();
            //this.bp.apps.buddyscript.parseCommand(val);
            return false;
        });

        // on enter key or clicking .consoleMessageSubmit, send the message
        $('.consoleMessageSubmit', consoleWindow.content).on('click', () => {
            let val = $('.console_message_text', consoleWindow.content).val();
            this.bp.apps.buddyscript.parseCommand(val);
            this.log(val);
            // empty the input
            $('.console_message_text', consoleWindow.content).val('');
            e.preventDefault();
            return false;
        });

        $('.console_message_text', consoleWindow.content).on('keypress', (e) => {
            if (e.which === 13) {
                let val = $('.console_message_text', consoleWindow.content).val();
                this.bp.apps.buddyscript.parseCommand(val);
                $('.console_message_text', consoleWindow.content).val('');
                this.log(val);
                e.preventDefault();
                return false;

            }
        });

    }

    log (val) {
        let consoleItems = $('.console li').length;
        if (consoleItems > 10) {
          $('.console li').get(0).remove();
        }
        let output = val;
        let now = new Date();
        let dateString = DateFormat.format.date(new Date(), 'HH:mm:ss');
        $('.console').append('<li>' + dateString + ': ' + output + '</li>');
        
    }
}


