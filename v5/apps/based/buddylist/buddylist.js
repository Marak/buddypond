import processBuddylist from "./lib/processProfile.js";
import renderOrUpdateBuddyInBuddyList from "./lib/renderOrUpdateBuddyInBuddyList.js";
import renderChatMessage from "./lib/renderChatMessage.js";
import renderBuddyRequests from "./lib/renderBuddyRequests.js";
import buddylistUIEvents from "./lib/buddylistUIEvents.js";
import openChatWindow from "./lib/openChatWindow.js";

// TODO: import { v4 as uuid } from 'uuid';
// TODO: why does client care about making UUID at all?
// this should be responsibility of the server
function uuid() {
    return new Date().getTime();
}

export default class BuddyList {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.data = {
            processedMessages: {},
            profileState: {
                me: null,
                updates: {}
            }
        };
        this.subscribedBuddies = [];
        this.subscribedPonds = [];
        this.options = options;
        this.opened = false;
        this.showingIsTyping = this.showingIsTyping || {};

    }

    async init() {

    }

    async open(config = { type: 'buddylist-profile' }) {

        // buddylist supports (2) window types for bp.open('buddylist, { type: 'buddylist-profile' })
        // 'buddylist-profile' - the default buddylist window
        // 'buddylist-chat' - a chat window


        if (typeof config.type !== 'string') {
            config.type = 'buddylist-profile';
        }

        if (config.type === 'buddylist-profile') {


            if (this.opened) {
                this.buddyListWindow.open();
                this.bp.apps.ui.windowManager.focusWindow(this.buddyListWindow);
                return 'buddylist already open';
            }

            this.opened = true;

            const htmlStr = await this.bp.fetchHTMLFragment('/v5/apps/based/buddylist/buddylist.html');
            this.messageTemplateString = await this.bp.fetchHTMLFragment('/v5/apps/based/buddylist/message.html');
            this.bp.appendCSS('/v5/apps/based/buddylist/buddylist.css');

            // await this.bp.importModule('https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm', {}, false)

            // loads affirmations messages via the affirmations app
            let affirmations = await this.bp.importModule('affirmations');

            const buddyListWindow = this.createBuddyListWindow();
            buddyListWindow.content.appendChild(this.createHTMLContent(htmlStr));
            this.buddyListWindow = buddyListWindow;
            this.registerEventHandlers();
            this.handleAuthentication();
            this.buddylistUIEvents();
            $('.loggedIn', buddyListWindow.container).flexHide();


            // needs to check if logged in again after lazy loading pond...
            //$('.loggedIn').flexHide();
            //$('.loggedOut').flexShow();
  

            return 'hello buddyList';
        }

        // Remark: is this code still used? can we remove? handled by openChatWindow
        // called from elsewhere?
        if (config.type === 'pond') {
            // the type of window is a chat window
            // we *don't* need to re-render the buddylist-profile 
            this.openChatWindow(config);
        }


        if (config.type === 'chat') {
            // the type of window is a chat window
            // we *don't* need to re-render the buddylist-profile 
            this.openChatWindow(config);
        }

    }

    createBuddyListWindow() {

        // calculate right side of screen
        let x = window.innerWidth - 350;

        return this.bp.apps.ui.windowManager.createWindow({
            app: 'buddylist',
            type: 'buddylist-profile',
            title: 'Buddy List',
            icon: '/desktop/assets/images/icons/icon_profile_64.png',
            id: 'buddyListWindow',
            parent: this.bp.apps.ui.parent,
            width: 250,
            height: 500,
            x: x,
            y: 75,
            onClose: () => this.bp.log('buddyListWindow onClose'),
        });

    }

    registerEventHandlers() {
        this.bp.on('auth::qtoken', 'handle-auth-success', qtoken => this.handleAuthSuccess(qtoken));
        this.bp.on('client::websocketConnected', 'get-latest-messages', ws => this.getLatestMessages());
        this.bp.on('profile::buddylist', 'process-buddylist', ev => this.processBuddylist(ev.data));

        //this.bp.on('profile::buddy::in', 'render-or-update-buddy-in-buddylist', data => this.renderOrUpdateBuddyInBuddyList(data));
        //this.bp.on('profile::buddy::out', 'render-or-update-buddy-in-buddylist', data => this.renderOrUpdateBuddyInBuddyList(data));


        this.bp.on('profile::buddy::in', 'play-buddy-in-sound', data => bp.play('desktop/assets/audio/BUDDY-IN.wav'));
        this.bp.on('profile::buddy::out', 'play-buddy-out-sound', data => bp.play('desktop/assets/audio/BUDDY-OUT.wav'));
        this.bp.on('buddy::message::processed', 'play-im-sound', data => {
            // only play sounds for recent messages
            let messageTime = new Date(data.ctime);
            let now = new Date().getTime();
            //console.log("messageTime", messageTime);
            //console.log("now", new Date());
            if (now - messageTime.getTime() < 5000) {
                bp.play('desktop/assets/audio/IM.wav');
            }
        });

        this.bp.on('profile::buddy::newmessage', 'open-chat-window', data => this.openChatWindow(data));
        this.bp.on('profile::buddy::newmessage', 'mark-messages-as-read', data => this.buddyReadNewMessages(data));

        this.bp.on('profile::buddy::calling', 'start-call', data => {
            // legacy BP API
            console.log("profile::buddy::calling", data);
            desktop.app.videochat.startCall(false, data.name, function (err, re) {
                console.log('startCall callback', err, re);
            });

        });

        this.bp.on('profile::status', 'update-profile-status', status => status === 'signout' && this.logout());

        this.bp.on('buddy::messages', 'render-chat-message', data => this.handleChatMessages(data));
        this.bp.on('buddy::sendMessage', 'send-buddy-message-to-server', data => this.sendMessageToServer(data));
        this.bp.on('pond::sendMessage', 'send-pond-message-to-server', data => this.sendPondMessageToServer(data));

        this.bp.on('buddy::sendMessage', 'process-buddymessage-bs', data => this.bp.apps.buddyscript.parseCommand(data.text));
        this.bp.on('pond::sendMessage', 'process-pondmessage-bs', data => this.bp.apps.buddyscript.parseCommand(data.text));

        // remote isTyping event from server
        // TODO: move to separate file
        this.bp.on("buddy::isTyping", "show-is-typing-message", message => {

            // TODO: move to separate file
            // TODO: move this to a separate file / function
            // Handling typing message display
            if (message.isTyping === true) {
                // check to see if message.from is the same as the current user
                // if so, ignore the message
                if (message.from === this.bp.me) {
                    return;
                }

                // check the ctime of the message
                // console.log("isTyping message", message);
                let messageTime = new Date(message.ctime);
                // console.log("messageTime", messageTime.getTime());
                let now = new Date().getTime();
                let selector = `#${message.type}_message_-${message.from}`;
                // alert(selector);
                let chatWindow = $(selector);
                // don't process isTyping messages over 3 seconds old
                if (now - messageTime.getTime() > 3000) {
                    // console.log("isTyping message too old", message);
                    return;
                }

                let typingIndicatorId = `typing-${message.from}`;
                let typingMessage = `${message.from} is typing...`;

                // Check if the typing indicator for this user already exists
                let typingIndicator = $(`.aim-typing span[data-user="${message.from}"]`, chatWindow.content);
                if (typingIndicator.length === 0) {
                    // If it does not exist, create a new span and append it to the .aim-typing area
                    typingIndicator = $('<span></span>')
                        .attr('data-user', message.from)
                        .text(typingMessage)
                        .appendTo($('.aim-typing', chatWindow.content));
                } else {
                    // If it exists, just update the text
                    typingIndicator.text(typingMessage);
                }

                // Clear any existing timeout for this user
                // console.log("CLEARING OLD TIMER")
                if (this.showingIsTyping[typingIndicatorId]) {
                    clearTimeout(this.showingIsTyping[typingIndicatorId]);
                }

                // console.log("CREATING NEW TIMER")
                // Set a new timeout to remove the typing message after very short pause
                // since there already is a delay from the server
                this.showingIsTyping[typingIndicatorId] = setTimeout(() => {
                    typingIndicator.remove();
                }, 500);
                return;
            }
        })

        // local typing event TOOD: better name
        // when buddy is typing send a message to the ws server
        this.bp.on('buddy::typing', 'send-typing-message-to-server', data => {
            // we don't want to spam typing messages, so we will only send a message every 2 seconds
            this.lastTypingMessage = this.lastTypingMessage || 0;
            if (new Date().getTime() - this.lastTypingMessage < 2000) {
                // return;
            }
            this.lastTypingMessage = new Date().getTime();


            if (data.type === 'pond') {
                this.sendPondMessageToServer(data, false);
            } else {
                this.sendMessageToServer(data, false);
            }
            // this.bp.apps.client.sendMessage({ id: uuid(), method: 'sendMessage', data: data });


        });

        // TODO: this handler could instead bind to bp.apps.system.messages
        // a System allows for sending and receiving messages to a sequence of handlers
        /*
        */
        // the buddylist registers with the "messages" system
        // in order to receive messages from other systems
        /*
        // this will get or create a system called "messages"
        // the send and recieve handlers should get ordered in the order they are registered
        // unless the order is specified, which should put the system in the correct order by number values and then undefined last
        bp.apps.system.registerSystem('messages', {
            registrant: 'buddylist',
            send: {
                // since send is missing name and handler, it will be ignored
            },
            receive: {
                name: 'buddylist-processes-messages',
                order: 2, // we can stack multiple systems in order
                handler: (message) => {
                    console.log('buddylist-processes-messages', message);
                }
            }
        });
        // this event can be anywhere, doesn't have to be in the buddylist
        // prob should be though :-D
        // by sending the events to the messages system, they will 
        // go through the processing chain ( if any exists for that system )
        // and then we recieved via the receive handler
        this.bp.on(
            'buddy::messages',
            'send-messages-to-messages-system',
            data => this.bp.apps.systems.messages.send({
                name: 'buddylist-processes-messages',
                data: data
        }));
       // example of another app which filters messages

        bp.apps.system.registerSystem('messages', {
            registrant: 'shorten-text',
            send: {
                // since send is missing name and handler, it will be ignored
            },
            receive: {
                name: 'shorten-text',
                order: 1, // we can stack multiple systems in order
                handler: (message) => {
                    console.log('shorten text', message);
                    return message.text.substr(0, 1);
                }
            }
        });
        */

    }

    createHTMLContent(htmlStr) {
        const html = document.createElement('div');
        html.innerHTML = htmlStr;
        $('.loginForm input[name="username"]').focus();
        return html;
    }

    getLatestMessages() {
        const data = {
            buddyname: this.subscribedBuddies.join(','),
            pondname: this.subscribedPonds.join(','),
            me: this.bp.me
        };
        this.bp.apps.client.sendMessage({ id: uuid(), method: 'getMessages', data: data });
    }

    buddyReadNewMessages(data) {
        this.bp.log("BuddyReadNewMessages", data);
        const buddyName = data.name;
    }

    async handleChatMessages(data) {
        for (const message of data.result.messages) {
            await this.renderChatMessage(message);
        }
    }

    sendMessageToServer(data, emitLocal = false) {
        this.bp.log('buddy::sendMessage', data);
        data.uuid = uuid();
        // so confusing client.sendMessage....maybe should be sendWorkerMessage...dunno
        this.bp.apps.client.sendMessage({ id: data.uuid, method: 'sendMessage', data: data });
        data.name = data.to;
        if (emitLocal) {
            data.ctime = new Date().getTime();
            if (this.data.profileState) {
                data.location = this.data.profileState.location || 'outer space';
            }
            const chatWindow = this.openChatWindow(data);
            this.renderChatMessage(data, chatWindow);
        }
    }

    sendPondMessageToServer(data, emitLocal = false) {
        data.type = 'pond';
        this.bp.log('pond::sendMessage', data);
        data.uuid = uuid();
        data.pondname = data.to;
        // console.log('sendPondMessageToServer', data);
        this.bp.apps.client.sendMessage({ id: data.uuid, method: 'sendMessage', data: data });
        if (emitLocal) {
            data.ctime = new Date().getTime();
            if (this.data.profileState) {
                data.location = this.data.profileState.location || 'outer space';
            }
            const chatWindow = this.openChatWindow(data);
            this.renderChatMessage(data, chatWindow);
        }
    }

    handleAuthentication() {
        const api = this.bp.apps.client.api;
        const localToken = localStorage.getItem('qtokenid');
        const me = localStorage.getItem('me');

        if (!localToken) return;
        // console.log('localToken', localToken, me);
        api.verifyToken(me, localToken, (err, data) => {
            if (err) {
                console.error('Failed to verify token:', err);
                $('.loginForm .error').text('Failed to authenticate buddy');
                return;
            }

            this.bp.log('verified token', data);
            if (data.success) {
                this.bp.emit('auth::qtoken', { qtokenid: localToken, me: me });
                //                $('.loggedIn').addClass('show');
                $('.loggedIn').flexShow();

            } else {
                $('.loginForm .error').text('Failed to authenticate buddy');
                console.error('Failed to authenticate buddy:');
            }
        });
    }

    async handleAuthSuccess(qtoken) {
        this.bp.me = qtoken.me;
        this.data.profileState.me = this.bp.me;
        $('.onlineStatusSelect').val('online');
        $('.loggedOut').flexHide();
        this.openChatWindow({ pondname: 'Buddy' });
        /*
        await bp.load('pond', {
            window: {
                preventOverlap: false
            }
        });
        */

    }
}

BuddyList.prototype.renderOrUpdateBuddyInBuddyList = renderOrUpdateBuddyInBuddyList;
BuddyList.prototype.renderChatMessage = renderChatMessage;
BuddyList.prototype.renderBuddyRequests = renderBuddyRequests;
BuddyList.prototype.processBuddylist = processBuddylist;
BuddyList.prototype.buddylistUIEvents = buddylistUIEvents;
BuddyList.prototype.openChatWindow = openChatWindow;

BuddyList.prototype.logout = function () {
    // close any open chat windows
    $('.chatWindow').remove(); // maybe, they could stay open as well
    // disconnect the client
    this.bp.apps.client.disconnect();
    $('.password').val('');
    $('.loggedIn').flexHide();
    $('.loggedOut').flexShow();
    localStorage.removeItem('qtokenid');
    localStorage.removeItem('me');
    this.data.profileState = null;
    this.bp.play('desktop/assets/audio/GOODBYE.wav');
}
