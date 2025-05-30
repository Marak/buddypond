// import AutoComplete from '../../ui/AutoComplete/AutoComplete.js'; // using jquery autocomplete ( for now )
import ChatWindowButtonBar from "./ChatWindowButtonBar.js";
export default function openChatWindow(data) {
    // this.bp.emit('client::requestWebsocketConnection', 'buddylist');

    // attempt to subscribe / open websocket connection to messages ws server

    let windowType = data.pondname ? 'pond' : 'buddy';
    let contextName = data.pondname || data.name;
    let windowTitle = windowType === 'pond' ? 'Pond' : '';

    if (data.context) {
        contextName = data.context;
    }

    if (data.type) {
        windowType = data.type;
    }

    let windowIdPrefix = windowType === 'pond' ? 'pond_message_-' : 'buddy_message_-';
    let client = this.bp.apps.client;

    let windowId = windowIdPrefix + contextName;
    // console.log('opening chat window ', windowId)
    let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowId);
    if (chatWindow) {
        chatWindow.focus();
        return chatWindow;
    }

    let iconImagePath = windowType === 'buddy' ? '' : 'desktop/assets/images/icons/icon_pond_64.png';

    if (windowType === 'buddy') {

        if (
            this.bp.apps.buddylist.data.profileState &&
            this.bp.apps.buddylist.data.profileState.buddylist &&
            this.bp.apps.buddylist.data.profileState.buddylist[contextName] &&
            this.bp.apps.buddylist.data.profileState.buddylist[contextName].profile_picture) {
            iconImagePath = this.bp.apps.buddylist.data.profileState.buddylist[contextName].profile_picture;
        }


    }

    chatWindow = this.bp.apps.ui.windowManager.createWindow({
        app: 'buddylist',
        id: windowIdPrefix + contextName,
        title: contextName + ' ' + windowTitle,
        // title: '<img src="' + iconImagePath + '" class="window-icon" /> ' + contextName + ' ' + windowTitle,
        icon: iconImagePath,
        type: windowType,
        context: contextName,
        parent: this.bp.apps.ui.parent,
        className: 'chatWindow',
        x: data.x || 175,
        y: 75,
        width: 600,
        height: 500,
        onOpen: async (_window) => {

            // console.log('calling onOpen for new chat window', _window);
            setupChatWindow.call(this, windowType, contextName, _window);

            client.addSubscription(windowType, contextName);

            // If when the buddy chat window is opened, the buddy has new messages, we need to set the newMessages flag to false
            if (windowType === 'buddy') {
                // check to see if we have newMessages state for this buddy, if so set newMessages to false
                if (this.data.profileState && this.data.profileState.buddylist && this.data.profileState.buddylist[contextName] && this.data.profileState.buddylist[contextName].newMessages) {
                    this.data.profileState.buddylist[contextName].newMessages = false;
                    this.client.receivedInstantMessage(contextName, function (err, re) {
                        // console.log('receivedInstantMessage', err, re);
                    });
                }
            }


            const _data = { me: this.bp.me };
            if (windowType === 'pond') {
                _data.pondname = contextName;
            } else {
                _data.buddyname = contextName;
            }

            this.data.processedMessages[contextName] = this.data.processedMessages[contextName] || [];
            // await this.bp.load('emoji-picker');

            let rerenderMessages = [...this.data.processedMessages[contextName]];
            this.data.processedMessages[contextName] = [];

            for (const message of rerenderMessages) {
                try {
                    await this.renderChatMessage(message, _window, true);
                } catch (err) {
                    console.error('Error rendering message', message, err, _window);
                }
            }

            // now focus on the .aim-input field
            // console.log('focus on input', $('.aim-input', _window.content).length);
            // console.log('_window.content', _window.content);

            function focusOnInput() {
                let aimInput = $('.aim-input', _window.content);
                if (aimInput.length === 0) {
                    setTimeout(() => {
                        console.log('focus on input', $('.aim-input', _window.content).length);
                        console.log('_window.content', _window.content);
                        focusOnInput();
                    }
                        , 100);
                }
                $('.aim-input', _window.content).focus();
            }

            focusOnInput();


        },
        onClose: () => {
            client.removeSubscription(windowType, contextName);
        }
    });

    chatWindow.loggedIn = true;

    // this.bp.apps.themes.applyTheme(this.bp.settings.active_theme);


    return chatWindow;
}

// TODO: move to separate file, rename bindChatWindowEvents
function setupChatWindow(windowType, contextName, chatWindow) {

    const chatWindowTemplate = this.messageTemplateString;

    const cloned = document.createElement('div');
    cloned.innerHTML = chatWindowTemplate;

    // console.log('setupChatWindow', chatWindow, this.options);
    chatWindow.container.classList.add('has-droparea');
    chatWindow.content.appendChild($('.aim-window', cloned)[0]);

    if (this.options.autocomplete) {
        let keys = Object.keys(this.options.autocomplete);

        // add a "/" to each command for consistency
        let sourceCommands = keys.map((command) => {
            return '/' + command;
        });

        // new AutoComplete('.aim-input', chatWindow.content, this.options.autocomplete);
        // alert(JSON.stringify(this.options.autocomplete));
        $('.aim-input', chatWindow.content).autocomplete({
            source: sourceCommands,
            search: function (event, ui) {
                // only trigger autocomplete searches if user has started message with oper code ( / or \ )
                let opers = ['/', '\\'];
                let firstChar = event.target.value.substr(0, 1);
                if (opers.indexOf(firstChar) === -1) {
                    return false;
                }
                return true;
            }
        });
    }

    if (this.options.chatWindowButtons) {
        // copy the options
        let chatWindowButtons = this.options.chatWindowButtons.slice();
        if (windowType === 'pond') {
            // filter out any this.options.chatWindowButtons that are buddy specific
            chatWindowButtons = chatWindowButtons.filter((button) => {
                return button.type !== 'buddy-only';
            });
        }

        // check if env is iOS, if so, remove any 'desktop-only' buttons

        function isIOS() {
            return (
                /iPad|iPhone|iPod/.test(navigator.userAgent) && ('ontouchend' in document)
            );
        }
        if (isIOS()) {
            chatWindowButtons = chatWindowButtons.filter((button) => {
                return button.env !== 'desktop-only';
            });
        }

        const chatWindowButtonBar = new ChatWindowButtonBar(this.bp, {
            context: contextName,
            type: windowType,
            buttons: chatWindowButtons
        });
        $('.aim-message-controls', chatWindow.content).prepend(chatWindowButtonBar.container);

    }

    $('.message_form .aim-to', chatWindow.content).val(contextName);

    // TODO: move this to sendMessage.js()
    $('.message_form', chatWindow.content).submit(async (e) => {
        e.preventDefault();
        await this.sendMessageHandler(e, chatWindow, windowType, contextName);
    });

    // Hitting enter key will send the message
    $('.aim-input', chatWindow.content).keydown((e) => {

        // allow shift + enter to add a new line
        if (e.which === 13 && e.shiftKey) {
            // insert new line to the textarea
            let $input = $(e.target);
            let inputValue = $input.val();
            let cursorPosition = $input[0].selectionStart;
            let newValue = inputValue.slice(0, cursorPosition) + '\n' + inputValue.slice(cursorPosition);
            $input.val(newValue);
            $input[0].setSelectionRange(cursorPosition + 1, cursorPosition + 1);

            // check if the message is empty
            return false;
        }

        if (e.which === 13) {
            // this.bp.ignoreUIControlKeys = true;
            if (this.bp.ignoreUIControlKeys) {
                // return false;
            }
            // replace /n with <br>
            let message = $(e.target).val();
            message = message.replace(/\n/g, '<br>');
            $(e.target).val(message);
            $('.message_form', chatWindow.content).submit();
            e.preventDefault();
            return false;
        }
    });

    // Buddy "is typing" event on message_text input
    $('.aim-input').on('keyup', (e) => {
        // check value of the input field, if not empty, set opacity to 1
        let inputValue = $(e.target).val();
        let $sendButton = $('.aim-send-btn', chatWindow.content);
        if (inputValue.length > 0) {
            $sendButton.css('opacity', 1);
        } else {
            $sendButton.css('opacity', 0.5);
        }
    });

    // Buddy "is typing" event on message_text input
    $('.aim-input').on('keypress', (e) => {

        return;
        let buddyName = this.bp.me;
        let context = contextName;
        // console.log('typing', buddyName, context);
        this.bp.emit('buddy::typing', {
            from: buddyName,
            to: context,
            type: windowType,
            isTyping: true,
            ctime: Date.now()
        });
    });




}