//import uuid from 'https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm'
import AutoComplete from '../../ui/AutoComplete/AutoComplete.js';
import ChatWindowButtonBar from "./ChatWindowButtonBar.js";

function uuid () {
    return new Date().getTime();
}
export default function openChatWindow(data) {
    this.bp.emit('client::requestWebsocketConnection', 'buddylist');
    console.log("openChatWindow", data);
    let windowType = data.pondname ? 'pond' : 'buddy';
    let contextName = data.pondname || data.name;
    let windowIdPrefix = windowType === 'pond' ? 'pond_message_-' : 'buddy_message_-';
    let subscribedList = windowType === 'pond' ? this.subscribedPonds : this.subscribedBuddies;
    let windowTitle = windowType === 'pond' ? 'Pond' : '';
    let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowIdPrefix + contextName);
    if (!chatWindow) {
        const chatWindowTemplate = this.messageTemplateString;
        const cloned = document.createElement('div');
        cloned.innerHTML = chatWindowTemplate;

        // No group video calls ( for now )
        if (windowType === 'pond') {
            $('.startVideoCall', cloned).remove();
        }

        chatWindow = this.bp.apps.ui.windowManager.createWindow({
            app: 'buddylist',
            id: windowIdPrefix + contextName,
            title: contextName + ' ' + windowTitle,
            type: windowType,
            parent: this.bp.apps.ui.parent,
            className: 'chatWindow',
            width: 600,
            height: 500,
            onOpen: () => {
                if (!subscribedList.includes(contextName)) {
                    subscribedList.push(contextName);
                }
                // console.log('subscribedList', subscribedList);
                const _data = { me: this.bp.me };
                if (windowType === 'pond') {
                    _data.pondname = contextName;
                } else {
                    _data.buddyname = contextName;
                }
                this.bp.apps.client.sendMessage({ id: uuid(), method: 'getMessages', data: _data });
            },
            onClose: () => {
                subscribedList = subscribedList.filter(name => name !== contextName);
            }
        });

        chatWindow.content.appendChild($('.aim-window', cloned)[0]);

        new AutoComplete('.aim-input', chatWindow.content, this.options.autocomplete);
        const chatWindowButtonBar = new ChatWindowButtonBar(this.bp, {
            context: contextName,
            type: windowType,
            buttons: this.options.chatWindowButtons
        });

        $('.aim-message-controls', chatWindow.content).prepend(chatWindowButtonBar.container);

        $('.message_form .aim-to', chatWindow.content).val(contextName);

        $('.message_form', chatWindow.content).submit((e) => {
            e.preventDefault();
            const message = $('.aim-input', chatWindow.content).val();
            const _data = {
                to: $('.aim-to', chatWindow.content).val(),
                type: windowType,
                from: this.bp.me,
                message,
                ctime: Date.now(),
                text: message
            };
            // console.log('message_form submit', _data);
            if (windowType === 'pond') {
                this.bp.emit('pond::sendMessage', _data);
            } else {
                this.bp.emit('buddy::sendMessage', _data);
            }
            $('.aim-input', chatWindow.content).val('');
            return false;
        });

        $('.aim-input', chatWindow.content).keydown((e) => {
            if (e.which === 13) {
                $('.message_form', chatWindow.content).submit();
            }
        });
    }
    return chatWindow;
}
