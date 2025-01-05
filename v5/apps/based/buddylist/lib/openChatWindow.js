//import uuid from 'https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm'
import AutoComplete from '../../ui/AutoComplete/AutoComplete.js';
import ChatWindowButtonBar from "./ChatWindowButtonBar.js";

function uuid() {
    return new Date().getTime();
}
export default function openChatWindow(data) {
    this.bp.emit('client::requestWebsocketConnection', 'buddylist');
    // console.log("openChatWindow", data);

    let windowType = data.pondname ? 'pond' : 'buddy';
    let contextName = data.pondname || data.name;
    let windowIdPrefix = windowType === 'pond' ? 'pond_message_-' : 'buddy_message_-';
    let windowTitle = windowType === 'pond' ? 'Pond' : '';

    // Reference directly to the specific list depending on windowType
    let subscribedList = windowType === 'pond' ? this.subscribedPonds : this.subscribedBuddies;

    let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowIdPrefix + contextName);
    if (chatWindow) {
        // just show it
        chatWindow.open();
        return chatWindow;
    }

    const chatWindowTemplate = this.messageTemplateString;
    const cloned = document.createElement('div');
    cloned.innerHTML = chatWindowTemplate;

    // No group video calls (for now)
    if (windowType === 'pond') {
        $('.startVideoCall', cloned).remove();
    }

    let iconImagePath = 'desktop/assets/images/icons/icon_pond_64.png';

    if (windowType === 'buddy') {
        iconImagePath = '';
    }
    chatWindow = this.bp.apps.ui.windowManager.createWindow({
        app: 'buddylist',
        id: windowIdPrefix + contextName,
        title: contextName + ' ' + windowTitle,
        icon: iconImagePath,
        type: windowType,
        context: contextName,
        parent: this.bp.apps.ui.parent,
        className: 'chatWindow',
        x: 175,
        y: 75,
        width: 600,
        height: 500,
        onOpen: async (_window) => {
            if (!subscribedList.includes(contextName)) {
                subscribedList.push(contextName);
            }
            const _data = { me: this.bp.me };
            if (windowType === 'pond') {
                _data.pondname = contextName;
            } else {
                _data.buddyname = contextName;
            }
            this.data.processedMessages[contextName] = this.data.processedMessages[contextName] || [];
            // reprocess any local messages ( window was closed and then opened again )

            // lazy load the emoji-picker ( its 225 kb )
            // it is safe to call multiple times since bp.load will cache the module
            await this.bp.load('emoji-picker');


            // create a new object to store all the previously processed messages
            let rerenderMessages = [];

            for (const message of this.data.processedMessages[contextName]) {
                // console.log('reprocessing message', message);
                rerenderMessages.push(message);
            }

            // clear the processedMessages array
            this.data.processedMessages[contextName] = [];

            // re-render all the messages
            for (const message of rerenderMessages) {
                // console.log('rendering message', message);
                // console.log('rendering message', message);
                try {
                    // TODO: this may need to become async / await
                    // in order to load remote cards, etc
                    await this.renderChatMessage(message, _window, true);
                } catch (err) {
                    // console.error('Error rendering message', err);

                }
            }

            // Remark: Is this not needed? Double getMessages was messing up the pondPopularity count?
            // That shouldn't be possible, is due to two getMessages happening at same time?
            //console.log('sending the getMessages request', _data);
            // console.log('calling sendMessage getMessages', _data);
            this.bp.apps.client.sendMessage({ id: uuid(), method: 'getMessages', data: _data });
        },
        onClose: () => {

            if (windowType === 'pond') {
                this.subscribedPonds = this.subscribedPonds.filter(name => name !== contextName);
            } else {
                this.subscribedBuddies = this.subscribedBuddies.filter(name => name !== contextName);
            }

            // needs to tell server we unsubscribed from this chat
            // calling getLatestMessages() at this stage will send updated arrays for both buddies and ponds
            // this tells the server we are no longer interested in messages for this chat
            // if another chat window is open, we'll get a double getLatestMessages() call ( which should be okay )
            // TODO: we could check to see if this was the last open window and then call getLatestMessages()
            this.getLatestMessages();

            // clear the locally processed messages for this window
            // this.data.processedMessages[contextName] = [];

            // check to see if this was the last open chat window ( for buddy or pond )
            // if so, we need to create a timer to close the websocket connection
            // this timer should be cleared if another chat window is opened
            let noOpenChatWindows = false;

            if (this.subscribedPonds.length === 0 && this.subscribedBuddies.length === 0) {
                noOpenChatWindows = true;
            }

            if (noOpenChatWindows) {

                if (this.closingWebsocketTimer) {
                    clearTimeout(this.closingWebsocketTimer);
                }
                console.log("no remaining chat windows, closing websocket connection in 10 seconds");
                this.closingWebsocketTimer = setTimeout(() => {
                    //console.log('closing websocket connection');

                    // emitting this messsage will tell the client to close the websocket connection
                    // the SSE connection will remain open with profile updates, such as newMessages flag,
                    // which will open the a chat window and re-establish the websocket connection
                    // the goal here is to only use the websocket connection when needed ( open active chats )
                    // we still get chat alerts from SSE updates on eventsource


                    this.bp.apps.client.releaseWebsocketConnection('buddylist');
                }, 5000); // TODO: 10 seconds
            }

        }
    });

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
        const chatWindowButtonBar = new ChatWindowButtonBar(this.bp, {
            context: contextName,
            type: windowType,
            buttons: this.options.chatWindowButtons
        });
        $('.aim-message-controls', chatWindow.content).prepend(chatWindowButtonBar.container);

    }


    $('.message_form .aim-to', chatWindow.content).val(contextName);

    $('.message_form', chatWindow.content).submit(async (e) => {
        e.preventDefault();
        const message = $('.aim-input', chatWindow.content).val();
        const _data = {
            to: $('.aim-to', chatWindow.content).val(),
            type: windowType,
            from: this.bp.me,
            message,
            ctime: Date.now(),
            text: message,
            files: [],
        };
    
        // Get file previews
        const filePreviews = $('.file-preview', chatWindow.content);
        const files = [];
    
        // Collect all files first
        filePreviews.each((_, filePreview) => {
            $('.file-content', filePreview).each((_, fileContent) => {
                const file = this.bp.apps['file-viewer'].getFile(fileContent);
                if (file) {
                    files.push({
                        file,
                        element: fileContent
                    });
                }
            });
        });
    
        // Create status indicators for each file
        files.forEach(({file, element}) => {
            const statusDiv = $('<div>', {
                class: 'upload-status',
                css: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }
            }).text('Waiting...');
            
            $(element).css('position', 'relative').append(statusDiv);
        });
    
        // Process files sequentially
        try {
            for (const {file, element} of files) {
                const statusDiv = $(element).find('.upload-status');
                statusDiv.text('Uploading...');
                
                try {
                    let fileUrl = await buddypond.uploadFile(file, (progress) => {
                        statusDiv.text('Uploading: ' + progress + '%');
                        
                    });

                    // now that we have the url, just send a regular message with the url
                    // the card type should automatically be detected by the server
                    // the the body of the message will be the url with extension of image, video, etc
                    let message = {
                        to: _data.to,
                        from: _data.from,
                        type: _data.type,
                        text: fileUrl
                    };
                    console.log("sending multimedia message", message);
                    this.bp.emit('buddy::sendMessage', message);
                    
                    // Fade out and remove the uploaded file preview
                    await $(element).fadeOut(300);
                    $(element).remove();
                    
                } catch (error) {
                    console.error('Error uploading file:', error);
                    statusDiv.text('Failed!')
                        .css('background', 'rgba(255, 0, 0, 0.7)');
                    
                    // Keep failed uploads visible for 2 seconds then fade out
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await $(element).fadeOut(300);
                    $(element).remove();
                }
            }
        } catch (error) {
            console.error('Error in file upload process:', error);
        }
    
        // Remove empty file preview containers
        filePreviews.each((_, container) => {
            if ($(container).children().length === 0) {
                $(container).remove();
            }
        });

        $('.file-preview', chatWindow.content).remove();
    
        // Send the regular message
        if (windowType === 'pond') {
            this.bp.emit('pond::sendMessage', _data);
        } else {
            this.bp.emit('buddy::sendMessage', _data);
        }
    
        // Clear input
        $('.aim-input', chatWindow.content).val('');
    });
    
    // Hitting enter key will send the message
    $('.aim-input', chatWindow.content).keydown((e) => {
        if (e.which === 13) {
            $('.message_form', chatWindow.content).submit();
            e.preventDefault();
            return false;
        }
    });




    // Buddy "is typing" event on message_text input
    $('.aim-input').on('keypress', () => {
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



    return chatWindow;
}
