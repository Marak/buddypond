// import AutoComplete from '../../ui/AutoComplete/AutoComplete.js'; // using jquery autocomplete ( for now )
import ChatWindowButtonBar from "./ChatWindowButtonBar.js";
export default function openChatWindow(data) {
    this.bp.emit('client::requestWebsocketConnection', 'buddylist');

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

    let chatWindow = this.bp.apps.ui.windowManager.findWindow(windowIdPrefix + contextName);
    if (chatWindow) {
        return chatWindow;
    }

    let iconImagePath = windowType === 'buddy' ? '' : 'desktop/assets/images/icons/icon_pond_64.png';

    chatWindow = this.bp.apps.ui.windowManager.createWindow({
        app: 'buddylist',
        id: windowIdPrefix + contextName,
        title: contextName + ' ' + windowTitle,
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
            //console.log('client', client);
            //console.log('client.subscriptions', client.subscriptions);
            
            client.addSubscription(windowType, contextName);
            
            const _data = { me: this.bp.me };
            if (windowType === 'pond') {
                _data.pondname = contextName;
            } else {
                _data.buddyname = contextName;
            }
            
            this.data.processedMessages[contextName] = this.data.processedMessages[contextName] || [];
            await this.bp.load('emoji-picker');
            
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
            $('.aim-input', _window.content).focus();

        },
        onClose: () => {
            client.removeSubscription(windowType, contextName);
        }
    });

    setupChatWindow.call(this, windowType, contextName, chatWindow);
    return chatWindow;
}


function setupChatWindow (windowType, contextName, chatWindow) {

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
        const chatWindowButtonBar = new ChatWindowButtonBar(this.bp, {
            context: contextName,
            type: windowType,
            buttons: this.options.chatWindowButtons
        });
        $('.aim-message-controls', chatWindow.content).prepend(chatWindowButtonBar.container);

    }

    $('.message_form .aim-to', chatWindow.content).val(contextName);

    // TODO: move this to sendMessage.js()
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
    
        // TODO: move file upload code to separate function
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
                    console.log('is there a filepath?', file.filePath);
                    console.log('this is the file', file);
                    file.filePath = file.filePath || file.name;

                    // we are going to perform some basic file organization and routing here
                    // when the user uploads files via the chat window, we are going to store them
                    // in the user's directory on the CDN
                    // to help out the user, will perform mime type / file ext detection here in order to upload
                    // the file to the appropriate directory such as images, audio, videos, etc
                    let supportedImageTypesExt = ['jpeg', 'png', 'gif', 'webp', 'svg']; // same as server ( for now )
                    let supportedAudioTypesExt = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

                    // check to see if the file.name has an extension included in the supportedImageTypesExt array
                    let fileExt = file.name.split('.').pop().toLowerCase();
                    if (supportedImageTypesExt.includes(fileExt)) {
                        file.filePath = 'images/' + file.filePath;
                    }
                    if (supportedAudioTypesExt.includes(fileExt)) {
                        file.filePath = 'audio/' + file.filePath;
                    }


                    console.log('assigning file path', file.filePath);
                    let fileUrl = await this.bp.apps.client.api.uploadFile(file, (progress) => {
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
            _data.type = 'pond';
        } else {
            _data.type = 'buddy';
        }

        // TODO: move all message preprocessing to a separate function
        if (_data.text.startsWith('/image')) {
            _data.text = await this.bp.searchImage(_data.text.replace('/image', ''));
            _data.card = {
                type: 'image',
                url: _data.text
            };
        }

        this.bp.emit('buddy::sendMessage', _data);
    
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