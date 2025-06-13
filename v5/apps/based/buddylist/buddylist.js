// TODO: decouple Buddylist class from Message Class
// TODO: formalize Message class

import processBuddylist from "./lib/processProfile.js";
import renderOrUpdateBuddyInBuddyList from "./lib/renderOrUpdateBuddyInBuddyList.js";
import createChatMessageElement from "./lib/message/createChatMessageElement.js";
import renderChatMessage from "./lib/message/renderChatMessage.js";
import renderBuddyRequests from "./lib/renderBuddyRequests.js";
import buddylistUIEvents from "./lib/buddylistUIEvents.js";
import openChatWindow from "./lib/openChatWindow.js";
import generateDefaultProfile from "./lib/generateDefaultProfile.js";
import requestDefaultCoinAllocations from "./lib/requestDefaultCoinAllocations.js";
import defaultChatWindowButtons from "./lib/defaultChatWindowButtons.js";
import sortBuddyList from "./lib/sortBuddyList.js";
// buddylist context menu
import showContextMenu from "./lib/showContextMenu.js";
// chat message context menu
import bindMessageContextMenu from "./lib/message/bindMessageContextMenu.js";
import createMessageContextMenu from "./lib/message/createMessageContextMenu.js";
import loadUserApps from "./lib/loadUserApps.js";

import sendMessageHandler from "./lib/message/sendMessageHandler.js";
import showCard from "./lib/message/showCard.js";
import scrollToBottom from "./lib/message/scrollToBottom.js";

import defaultAvatarSvg from "./lib/buddy/defaultAvatarSvg.js";



// new ws api
import Client from './lib/ws/Client.js';

// TODO: why does client care about making UUID at all?
// this is the responsibility of the server
// TODO: remove uuid(), is most likely used for local render of message before server confirms ( which is removed atm )
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
                status: null, // are these used?
                profilePicture: null, // are these used?
                updates: {}
            },
            avatarCache: new Map()
        };

        this.defaultPond = 'Buddy';
        this.subscribedBuddies = [];
        this.subscribedPonds = [];
        this.options = options;
        this.showedHelp = false;

        // alias global logout to the buddylist logout
        // buddylist logout will handle both buddylist and message logout
        this.bp.logout = this.logout.bind(this);

        // pull in the default button
        this.options.chatWindowButtons = this.options.chatWindowButtons || defaultChatWindowButtons(this.bp);

        // add any active buttons that have been added in this session
        // add the this.bp.apps.desktop.enabledChatWindowButtons array to this.options.chatWindowButtons

        let enabledChatWindowButtons = this.bp.apps.desktop.enabledChatWindowButtons;
        // iterate through each button and fetch the appList data.chatButton data ( hydrate the button )
        if (enabledChatWindowButtons && Array.isArray(enabledChatWindowButtons)) {
            enabledChatWindowButtons.forEach(buttonMeta => {
                let app = this.bp.apps.desktop.appList[buttonMeta.name];
                if (app && app.chatButton) {
                    this.options.chatWindowButtons.push(app.chatButton);
                }
            });
        }

        this.opened = false;
        this.showingIsTyping = this.showingIsTyping || {};

        this.activeMessageContextMenu = null;

        this.faucetAttempts = 0;

    }

    async init() {
        // Add event when user closes browser window or navigates away
        window.addEventListener('beforeunload', (event) => {
            // Show warning message
            //event.preventDefault();
            //event.returnValue = "Are you sure you want to leave? Your status will be set to offline.";
            // Attempt to set status to offline (you may need a sync alternative)
            // if page has quickly refreshed, client might be defined yet or connected
            if (this.client) {
                this.client.setStatus(this.bp.me, {
                    status: 'offline'
                }, function (err, re) {
                    console.log('buddypond.setStatus', err, re);
                });

            }
            //return event.returnValue;
        });
        // this.bp.load('ramblor');

        await this.bp.appendScript('/v5/apps/based/buddylist/vendor/marked.min.js');

        // TODO: we can load this lazier
        this.bp.vendor.dicebear = await this.bp.importModule('/v5/apps/based/buddylist/vendor/dicebear.core.js', {}, false);
        this.bp.vendor.dicebearAvatars = await this.bp.importModule('/v5/apps/based/buddylist/vendor/dicebear.identicon.js', {}, false);
        //console.log('LOADED dicebear', this.dicebear);
        //console.log('LOADED dicebearAvatars', this.dicebearAvatars);

        this.bindMessageContextMenu();

        // TODO: probably should remove this event and just use handleAuthSuccess handler?
        /*
        this.bp.on('auth::qtoken', 'connect-to-websocket-server', (qtoken) => {
            //this.qtokenid = qtoken.qtokenid;
            //this.api.qtokenid = this.qtokenid;
            //this.api.me = qtoken.me;
            //this.me = qtoken.me;
            //this.bp.me = this.me;
            //this.bp.qtokenid = this.qtokenid;
            //this.client = new this.Client(bp);
            //this.client.connect();
        });
        */

    }

    async open(config = { type: 'buddylist-profile' }) {
        // buddylist supports (2) window types for bp.open('buddylist, { type: 'buddylist-profile' })
        // 'buddylist-profile' - the default buddylist window
        // 'buddylist-chat' - a chat window
        // console.log('BuddyList open config', config)

        if (typeof config.type !== 'string') {
            config.type = 'buddylist-profile';
        }

        if (config.type === 'buddylist-profile') {

            // TODO: have the ability to close and re-open the buddylist gracefully

            if (this.opened) {
                this.buddyListWindow.open();
                this.bp.apps.ui.windowManager.focusWindow(this.buddyListWindow);
                this.buddyListWindow.restore();
                $('.loginForm input[name="username"]').focus();
                return 'buddylist already open';
            }

            this.opened = true;

            const htmlStr = await this.bp.fetchHTMLFragment('/v5/apps/based/buddylist/buddylist.html');
            this.messageTemplateString = await this.bp.fetchHTMLFragment('/v5/apps/based/buddylist/message.html');
            this.bp.appendCSS('/v5/apps/based/buddylist/buddylist.css');
            this.bp.appendCSS('/v5/apps/based/buddylist/messages.css');

            // this.bp.apps.themes.applyTheme(this.bp.settings.active_theme);


            // await this.bp.importModule('https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm', {}, false)

            // loads affirmations messages via the affirmations app
            let affirmations = await this.bp.importModule('affirmations');

            const buddyListWindow = this.createBuddyListWindow();
            buddyListWindow.content.appendChild(this.createHTMLContent(htmlStr));
            this.buddyListWindow = buddyListWindow;
            this.registerEventHandlers();
            this.handleAuthentication();
            this.buddylistUIEvents();
            return 'hello buddyList';
        }

        // Remark: is this code still used? can we remove? handled by openChatWindow
        // called from elsewhere?
        if (config.type === 'pond') {
            console.log('BuddyList open config.type is pond', config);
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
            onOpen: () => {

                // Remark: We seeing a race condition where the input field is not focusable
                // Most likely due to element being hidden / shown
                // We hooked into window focus events and everything appeared OK in regards to conflicting focus() calls
                // The issue is most likely due to the element being hidden
                // This still doesn't work as intended since the element might actually be hidden
                // TODO: find a better way to handle this
                function focusOnInput() {
                    const $loginInput = $('.loginForm input[name="username"]');
                    console.log('focusOnInput: Found elements:', $loginInput.length, $loginInput);

                    // If the element doesn’t exist, retry after a delay
                    if ($loginInput.length === 0) {
                        console.log('Input not found, retrying in 100ms');
                        setTimeout(focusOnInput, 100);
                        return;
                    }

                    // Check if the element is focusable
                    const input = $loginInput[0]; // Get the raw DOM element
                    const isFocusable = input.offsetParent !== null && // Visible in the DOM
                        !input.disabled && // Not disabled
                        input.tabIndex !== -1 && // Focusable via tab
                        getComputedStyle(input).visibility !== 'hidden' && // Not hidden
                        getComputedStyle(input).display !== 'none'; // Not display: none

                    if (!isFocusable) {
                        console.log('Input is not focusable yet, retrying in 100ms', {
                            isVisible: input.offsetParent !== null,
                            isEnabled: !input.disabled,
                            tabIndex: input.tabIndex,
                            visibility: getComputedStyle(input).visibility,
                            display: getComputedStyle(input).display
                        });
                        setTimeout(focusOnInput, 100);
                        return;
                    }

                    // Attempt to focus and verify
                    $loginInput.focus();
                    setTimeout(() => {
                        if (document.activeElement === input) {
                            console.log('Focus successful on:', input);
                        } else {
                            console.warn('Focus failed, active element is:', document.activeElement);
                            // Optionally retry
                            setTimeout(focusOnInput, 100);
                        }
                    }, 0); // Check focus in the next tick
                }
                // focusOnInput();
                // if we call this in console after load, it works
                $('.loginForm input[name="username"]').focus();

            },
            onClose: () => {
                this.opened = false;
            }
        });

    }

    registerEventHandlers() {

        this.bp.on('auth::qtoken', 'handle-auth-success', qtoken => this.handleAuthSuccess(qtoken));

        // On auth success, load user specific apps ( TODO: should pull from DB )
        this.bp.on('auth::qtoken', 'load-user-apps', qtoken => this.loadUserApps());

        // Generate default profile files ( TODO: don't run this each time, keep track on profile state if users generated default profile )
        this.bp.on('auth::qtoken', 'generate-default-profile-files', qtoken => {
            // give the app a moment to load messages and open windows before generating default profile
            // TODO: we could do this server-side instead
            setTimeout(() => {
                try {
                    // alert('Generating default profile files');
                    this.generateDefaultProfile(qtoken)

                } catch (err) {
                    console.error('generate-default-profile-files', err);
                }
            }, 6000);

        });

        this.bp.on('buddylist-websocket::connected', 'update-buddylist-connected', ws => {
            // sets buddylist status to online
            $('.onlineStatusSelect').val('online');
            $('.loggedOut').flexHide();
            $('.loggedIn').flexShow();

            this.bp.apps.buddylist.client.wsClient.send(JSON.stringify({
                action: 'getCoinBalance',
                buddyname: this.bp.me,
                qtokenid: this.bp.qtokenid,
            }));

            //$('.loggedIn').addClass('show');
        });

        // Remark: This has been removed in favor of letting windows manage their own state
        // If the buddylist emits newMessages: true for a buddy, the window will open automatically calling getMessages
        //this.bp.on('client::websocketConnected', 'get-latest-messages', ws => this.getLatestMessages());

        this.bp.on('profile::buddylist', 'process-buddylist', ev => this.processBuddylist(ev.data));

        this.bp.on('profile::buddy::in', 'render-or-update-buddy-in-buddylist', data => this.renderOrUpdateBuddyInBuddyList(data));
        this.bp.on('profile::buddy::out', 'remove-buddy-from-buddylist', data => {
            console.log('profile::buddy::out', data);
            const buddyName = data.name;
            let buddyListItem = $(`li[data-buddy="${buddyName}"]`, '.buddylist');
            console.log('buddyListItem', buddyListItem);
            buddyListItem.remove();
        });

        this.bp.on('profile::fullBuddyList', 'render-or-update-buddy-in-buddylist', data => {
            let buddylist = data.buddylist || {};
            console.log('profile::buddy::full_profile', data);
            for (let b in buddylist) {
                let buddy = {
                    name: b,
                    profile: buddylist[b]
                }
                this.data.profileState = this.data.profileState || {};
                this.data.profileState.buddylist = this.data.profileState.buddylist || {};

                this.data.profileState.buddylist[b] = buddy.profile;
                // console.log('renderOrUpdateBuddyInBuddyList', buddy);
                this.renderOrUpdateBuddyInBuddyList(buddy);
            }

            if (buddylist[this.bp.me]) {
                // for now...needs to change shape of server response to include root fields?
                if (buddylist[this.bp.me].profile_picture) {
                    // console.log('setting profilePicture', buddylist[this.bp.me].profile_picture);
                    this.data.profileState.profilePicture = buddylist[this.bp.me].profile_picture;
                }
                if (buddylist[this.bp.me].status) {
                    // console.log('setting status', buddylist[this.bp.me].status);
                    this.data.profileState.status = buddylist[this.bp.me].status;
                }
            }

            if (data.email) {
                this.data.profileState.email = data.email;
                // update the email input field
                $('.buddy_email').val(data.email);
            }

            if (typeof data.emailVerified === 'boolean') {
                this.data.profileState.emailVerified = data.emailVerified;
                // update the email verified checkbox
                // $('.buddy_email_verified').prop('checked', data.emailVerified);
                if (data.emailVerified) {
                    $('.buddy_email_verified_text').html('Email Verified');
                } else {
                    $('.buddy_email_verified_text').html('Email Not Verified');
                }
            }

            // iterate through all buddies and call renderOrUpdateBuddyInBuddylist

        });




        // Remark: removing buddy-in sound because Marak account is friends without everyone is is constantly triggering the sound
        // We'll have to be smarter about when to play sounds and limit the amount of BUDDY-IN a single buddy can trigger
        // total amount of buddy-in sounds per time window ( in case of 100s of buddies, etc )
        // this.bp.on('profile::buddy::in', 'play-buddy-in-sound', data => bp.play('desktop/assets/audio/BUDDY-IN.wav'));

        // Remark: buddy-out sound disabled until new client connection logic with backend is fully tested 
        //         ( was triggering too many sounds too often )
        //this.bp.on('profile::buddy::out', 'play-buddy-out-sound', data => bp.play('desktop/assets/audio/BUDDY-OUT.wav'));
        this.bp.on('buddy::message::processed', 'play-im-sound', data => {
            if (data.noAlert) {
                // don't play sound if noAlert is set by server
                return;
            }
            // only play sounds for recent messages
            let messageTime = new Date(data.ctime);
            let now = new Date().getTime();
            //console.log("messageTime", messageTime);
            //console.log("now", new Date());
            if (now - messageTime.getTime() < 5000) {
                bp.play('desktop/assets/audio/IM.wav');
            }
        });

        this.bp.on('profile::buddy::newmessage', 'open-chat-window', data => {
            // open the new chat window only if not already open
            let windowId = `buddy_message_-` + data.name;
            let win = this.bp.apps.ui.windowManager.getWindow(windowId);
            if (!win) {
                this.openChatWindow(data)
            }
        });

        this.bp.on('profile::buddy::newmessage', 'mark-messages-as-read', data => this.buddyReadNewMessages(data));

        this.bp.on('profile::buddy::calling', 'start-call', data => {
            // legacy BP API
            // console.log("profile::buddy::calling", data);
            desktop.app.videochat.startCall(false, data.name, function (err, re) {
                console.log('startCall callback', err, re);
            });

        });

        // buddylist should not respond to auth::logout 
        // this.bp.on('auth::logout', 'logout', () => this.logout());

        this.bp.on('profile::status', 'update-profile-status', status => {
            if (status === 'signout') {
                this.logout()
            }
            this.client.setStatus(this.bp.me, { status }, function (err, re) {
                if (err) {
                    console.error('error setting status', err);
                }
                // console.log('setStatus', err, re);
            });
            /*
            buddypond.setStatus(this.bp.me, { status }, function(err, re){
                // console.log('errrrr', err, re);
            });
            */

        });

        this.bp.on('buddy::messages', 'render-chat-message', data => this.handleChatMessages(data));
        this.bp.on('buddy::sendMessage', 'send-buddy-message-to-server', data => this.sendMessageToServer(data));
        // this.bp.on('pond::sendMessage', 'send-pond-message-to-server', data => this.sendPondMessageToServer(data));

        //this.bp.on('buddy::sendMessage', 'process-buddymessage-bs', data => this.bp.apps.buddyscript.parseCommand(data.text));
        //this.bp.on('pond::sendMessage', 'process-pondmessage-bs', data => this.bp.apps.buddyscript.parseCommand(data.text));

        // remote isTyping event from server
        // TODO: move to separate file
        this.bp.on("buddy::isTyping", "show-is-typing-message", message => {
            // console.log('show-is-typing-message', message);
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
                let windowId;
                if (message.type === 'buddy') {
                    if (message.to === this.bp.me) {
                        windowId = `buddy_message_-${message.from}`;
                    } else {
                        windowId = `buddy_message_-${message.to}`;
                    }
                }

                if (message.type === 'pond') {
                    // windowId = `pond_message_-${message.to}`;
                    windowId = 'pond_message_main';
                }

                let chatWindow = this.bp.apps.ui.windowManager.getWindow(windowId);
                // don't process isTyping messages over 3 seconds old
                if (now - messageTime.getTime() > 3000) {
                    // console.log("isTyping message too old", message);
                    // return;
                }

                // console.log('typing message', message);

                let typingIndicatorId = `typing-${message.from}`;
                let typingMessage = `${message.from} is typing...`;

                if (message.type === 'pond') {
                    // we need to determine if the current open pond aim-messages-container matches the message.to
                    if (chatWindow.currentActiveContext !== message.to) {
                        console.log('pond chat window is not active for this pond', message.to);
                        return;
                    }
                }


                // Check if the typing indicator for this user already exists
                let typingIndicator = $(`.aim-typing span[data-user="${message.from}"]`, chatWindow.content);
                // console.log('typingIndicator', typingIndicator);
                // console.log('typingMessage', typingMessage);
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
            // console.log('buddy::typing', data);

            let chatId = '';

            if (data.type === 'buddy') {
                let buddyNames = [data.from, data.to].sort();
                chatId = 'buddy/' + buddyNames.join('/');
            }

            if (data.type === 'pond') {
                chatId = 'pond/' + data.to;
            }

            bp.apps.client.sendWsMessage(chatId, {
                action: 'send',
                chatId: chatId,
                buddyname: buddypond.me,
                qtokenid: buddypond.qtokenid,
                message: {
                    ...data,
                    chatId,
                    isTyping: true
                }
            });
            /*
            if (data.type === 'pond') {
                this.sendPondMessageToServer(data, false);
            } else {
                this.sendMessageToServer(data, false);
            }
            */
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
        this.bp.on('buddylist-websocket::reward', 'update-local-coin-balance', data => {
            // TODO: move this into rewards app
            //$('#menu-bar-coin-balance').text(data.message.newBalance);
            if (!data.success) {
                console.log(data.message);
                return;
            }
            window.rollToNumber($('#menu-bar-coin-balance'), data.message.newBalance)

            // TODO: better condition to check if portfolio app is loaded and ready
            if (this.bp.apps.portfolio && this.bp.apps.portfolio.portfolioWindow && this.bp.apps.portfolio.portfolioWindow.content && this.bp.apps.portfolio.portfolioData) {

                this.bp.apps.portfolio.updateCoinRow(data.message.symbol, {
                    symbol: data.message.symbol,
                    amount: data.message.newBalance,
                    available: data.message.newBalance,
                    price: 0.001,
                    cost: 0.001 * data.message.newBalance
                });

                let coinSendSelector = $('#coin-send-name');
                let coinSendBalance = $('#current-balance');

                // if coinSendSelector value is "GBP"
                if (coinSendSelector.val() === 'GBP') {
                    // set the coin balance to the new balance
                    // window.rollToNumber(coinSendBalance, data.message.newBalance)
                    const formattedValue = data.message.newBalance.toLocaleString('en-US');

                    coinSendBalance.text(formattedValue);
                }
            }
        });

        this.bp.on('buddylist-websocket::coinBalance', 'update-local-coin-balance', async (data) => {
            console.log('buddylist-websocket::coinBalance', data);
            if (typeof data.message.balance === 'number') {
                window.rollToNumber($('#menu-bar-coin-balance'), data.message.balance)
            } else {
                this.faucetAttempts++;
                // should work on 1, adds safe guard in case service is down
                // we don't want to spam the faucet service or getCoinBalance
                if (this.faucetAttempts < 3) {
                    // request initial coin balance, null indicates no portfolio entry for GBP
                    // if no portfolio entry, request the default coin allocations
                    await this.requestDefaultCoinAllocations();
                    // make another request to get the coin balance
                    this.bp.apps.buddylist.client.wsClient.send(JSON.stringify({
                        action: 'getCoinBalance',
                        buddyname: this.bp.me,
                        qtokenid: this.bp.qtokenid,
                    }));
                } else {
                    console.warn('BuddyList: Too many faucet attempts, not requesting balance again this session');
                }

            }

        })
    }

    createHTMLContent(htmlStr) {
        const html = document.createElement('div');
        html.innerHTML = htmlStr;
        $('.loginForm input[name="username"]').focus();
        return html;
    }

    getLatestMessages() {
        // This can also be called when closing a chat window to let the server
        // know we are no longer interested in messages from that buddy or pond
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
        // console.log('handleChatMessages', data);
        let windowsToUpdate = new Set();
        for (const message of data.result.messages) {
            try {
                // check to see if we have newMessages in local profile for message.from
                // if so, send buddypond.receiveInstantMessage(message.from)
                if (message.from && this.data.profileState && this.data.profileState.buddylist && this.data.profileState.buddylist[message.from] && this.data.profileState.buddylist[message.from].newMessages) {
                    // console.log("SENDING READ NEWMESSAGES ALERT");
                    this.data.profileState.buddylist[message.from].newMessages = false;
                    this.client.receivedInstantMessage(message.from, function (err, re) {
                        console.log('receivedInstantMessage', err, re);
                    });
                }
                // console.log('handleChatMessages message', message);
                // return the chatWindow which the message was rendered in
                let chatWindow = await this.renderChatMessage(message);
                windowsToUpdate.add(chatWindow);

            } catch (err) {
                console.log('error rendering chat message', message, err)
            }
        }
        for (const chatWindow of windowsToUpdate) {
            if (chatWindow && chatWindow.content) {
                this.scrollToBottom(chatWindow.content);
            }
        }

        // show help card if local storage does not have the card shown
        // TODO: remove false
        // if (true || !this.bp.settings['viewed-help-card']) {
        if (!this.showedHelp) {
            let chatWindow = windowsToUpdate.values().next().value;
            this.showCard({
                chatWindow,
                cardName: 'help'
            });
            // console.log('showing help card', chatWindow);
            this.showedHelp = true;
        }

        /*
        if (!localStorage.getItem('buddylist-help-card-shown')) {
            localStorage.setItem('buddylist-help-card-shown', true);
        }
        */

    }

    sendMessageToServer(data, emitLocal = false) {
        this.bp.log('buddy::sendMessage', data);
        data.uuid = uuid();

        if (data.text === '') {
            console.log('will not sendMessageToServer: no text');
            return;
        }

        // so confusing client.sendMessage....maybe should be sendWorkerMessage...dunno
        if (data.type === 'pond') {
            console.log('sendMessageToServer', data);
            buddypond.pondSendMessage(data.to, data.text, data, function (err, result) {
                console.log('pondSendMessage', err, result)
                console.log(err, result)
            })

        }
        if (data.type === 'buddy') {
            console.log('sendMessageToServer', data);
            buddypond.sendMessage(data.to, data.text, data, function (err, result) {
                console.log('pondSendMessage', err, result)
                console.log(err, result)
            });
        }
        /*
        this.bp.apps.client.sendMessage({ id: data.uuid, method: 'sendMessage', data: data });
        data.name = data.to;
        if (emitLocal) {
            data.ctime = new Date().getTime();
            if (this.data.profileState) {
                data.location = this.data.profileState.location || 'outer space';
            }
            this.renderChatMessage(data);
        }
        */
    }

    /*
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
            this.renderChatMessage(data);
        }
    }
    */

    // called on open to verify token ( if exists )
    // signup / login logic is in buddylistUIEvents.js
    handleAuthentication() {
        const api = this.bp.apps.client.api;
        const localToken = localStorage.getItem('qtokenid');
        const me = localStorage.getItem('me');
        if (!localToken) return;
        // console.log('localToken', localToken, me);
        api.verifyToken(me, localToken, (err, data) => {
            if (err) {
                console.error('Failed to verify token:', err);
                $('.password').show();
                $('.loginForm .error').text('Failed to authenticate buddy');
                return;
            }
            console.log('verified token', data);
            if (data.success) {
                // A pre-existing token was found and verified, emit the auth event
                this.bp.emit('auth::qtoken', { qtokenid: localToken, me: me, hasPassword: data.user.hasPassword });
                $('.loggedIn').flexShow();
                $('.loggedOut').flexHide();
                if (!data.user.hasPassword) {
                    this.bp.open('pincode');
                }

            } else {
                $('.loginForm .error').text('Failed to authenticate buddy');
                $('.password').show();
                console.error('Failed to authenticate buddy:');
            }
        });

    }

    // TODO: this event should only set the qtokenid and local settings?
    // it could open the chat window?
    // maybe also could connect to the websocket server for buddylist?
    // opening the default window initializes the messages client
    async handleAuthSuccess(qtoken) {
        // console.log('handleAuthSuccess', qtoken);
        if (this.client) {
            console.error('buddylist websocket client already exists and has not been closed. This should not happen');
            return;
        }

        this.bp.me = qtoken.me;
        this.bp.qtokenid = qtoken.qtokenid;
        this.data.profileState = this.data.profileState || {};
        this.data.profileState.me = this.bp.me;

        $('#me_title').html('Welcome ' + this.bp.me);

        // TODO: connect-to-websocket-server should happen here
        // plays welcome message
        this.bp.play('desktop/assets/audio/WELCOME.mp3', { tryHard: Infinity });


        // this will eventually trigger the buddylist::connected event
        this.client = new this.Client(bp);
        let connected = await this.client.connect();

        if (!qtoken.hasPassword) {
            // if the user does not have a password, open the pincode window
            this.bp.open('pincode');
        }

        // wait until buddylist is connected and then opens default chat window if defined
        if (this.defaultPond) {
            setTimeout(() => {
                let chatWindow = this.openChatWindow({ pondname: this.defaultPond });
                // loads the hotpond client that populates room lists
                bp.load('pond');


            }, 100);
        }

    }
}

BuddyList.prototype.renderOrUpdateBuddyInBuddyList = renderOrUpdateBuddyInBuddyList;
BuddyList.prototype.createChatMessageElement = createChatMessageElement;
BuddyList.prototype.renderChatMessage = renderChatMessage;
BuddyList.prototype.renderBuddyRequests = renderBuddyRequests;
BuddyList.prototype.processBuddylist = processBuddylist;
BuddyList.prototype.buddylistUIEvents = buddylistUIEvents;
BuddyList.prototype.openChatWindow = openChatWindow;
BuddyList.prototype.generateDefaultProfile = generateDefaultProfile;
BuddyList.prototype.requestDefaultCoinAllocations = requestDefaultCoinAllocations;
BuddyList.prototype.sortBuddyList = sortBuddyList;
BuddyList.prototype.showContextMenu = showContextMenu;

BuddyList.prototype.createMessageContextMenu = createMessageContextMenu;
BuddyList.prototype.bindMessageContextMenu = bindMessageContextMenu;
BuddyList.prototype.loadUserApps = loadUserApps;
BuddyList.prototype.sendMessageHandler = sendMessageHandler;
BuddyList.prototype.showCard = showCard;
BuddyList.prototype.scrollToBottom = scrollToBottom;

BuddyList.prototype.defaultAvatarSvg = defaultAvatarSvg;


// new API
BuddyList.prototype.Client = Client;


BuddyList.prototype.logout = function () {
    // set status to online

    $('.loginButton').prop('disabled', false);
    $('.loginButton').removeClass('disabled');
    $('#menu-bar-coin-balance').text('0');

    this.client.setStatus(this.bp.me, {
        status: 'offline'
    }, (err, re) => {
        console.log('buddypond.setStatus', err, re);
        // close any open chat windows
        $('.chatWindow').remove(); // maybe, they could stay open as well
        // disconnect the client
        // this.bp.apps.client.logout();
        $('.password').val('');
        $('.loggedIn').flexHide();
        $('.loggedOut').flexShow();

        this.data.profileState = null;
        this.bp.play('desktop/assets/audio/GOODBYE.wav');
        // TODO can we now remove bp.apps.client.logout()?
        this.bp.apps.client.logout();
        this.client.disconnect();
        this.client = null;
        // clear out the local .data scope
        // TODO: only declare this once ( code is repeated in constructor )
        this.data = {
            processedMessages: {},
            profileState: {
            },
            activeUsersInContext: {},
            activeUsers: [],
            activePonds: [],
            avatarCache: new Map()
        };
        // empty the buddylist
        $('.buddylist').empty();

        // hide any .dialog
        $('.dialog').remove();

    });
}