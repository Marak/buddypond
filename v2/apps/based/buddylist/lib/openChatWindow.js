import { v4 as uuid } from 'uuid';

export default function openChatWindow (data) {
    console.log('tttt', this.bp)
    this.bp.emit('client::requestWebsocketConnection', 'buddylist');

    let chatWindow = this.bp.apps.ui.windowManager.findWindow('buddy_message_-' + data.name);


    if (!chatWindow) {

        // get the base html template for the chat window
        let chatWindowTemplate = this.messageTemplateString;
        // create new element from HTML string
        let cloned = document.createElement('div');
        cloned.innerHTML = chatWindowTemplate;

        // create a new UI window to hold the buddy list
        chatWindow = this.bp.apps.ui.windowManager.createWindow({
            id: 'buddy_message_-' + data.name,
            title: 'Chat with ' + data.name,
            parent: this.bp.apps.ui.parent,
            width: 600,
            height: 500,
            onOpen: () => {
                console.log('chatWindow onOpen');
                this.subscribedBuddies.push(data.name);
                console.log('subscribedBuddies', this.subscribedBuddies);
                let _data = { buddyname: this.subscribedBuddies.join(','), me: this.bp.me };
                //this.bp.apps.client.ws.send(JSON.stringify({ id: new Date().getTime(), method: 'getMessages', data: _data }));
                this.bp.apps.client.sendMessage({ id: uuid(), method: 'getMessages', data: _data });

            },
            onClose: () => {
                console.log('buddyListWindow onClose');
            }
        });

        chatWindow.content.appendChild(cloned);


        $('.message_form .buddy_message_to').val(data.name);

        $('.message_form', chatWindow.content).submit((e) => {
            e.preventDefault();
            let message = $('.message_form .buddy_message_text').val();
            let to = $('.message_form .buddy_message_to').val();
            let from = bp.me;
            let ctime = Date.now();
            let text = message;
            let data = { to, from, message, ctime, text };
            console.log('buddy_send_message_form', data);
            this.bp.emit('chat::sendMessage', data);
            return false;
        });
         return chatWindow; 

        // chatWindow.open();
    }
}