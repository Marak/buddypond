//import uuid from 'https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm'


import processBuddylist from "./lib/processProfile.js";
import renderOrUpdateBuddyInBuddyList from "./lib/renderOrUpdateBuddyInBuddyList.js";
import renderChatMessage from "./lib/renderChatMessage.js";
import renderBuddyRequests from "./lib/renderBuddyRequests.js";
import buddylistUIEvents from "./lib/buddylistUIEvents.js";
import openChatWindow from "./lib/openChatWindow.js";

// import { v4 as uuid } from 'uuid';
function uuid() {
    return new Date().getTime();
}

export default class BuddyList {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.data = {
            processedMessages: [],
            profileState: {
                me: null,
                updates: {}
            }
        };
        this.subscribedBuddies = [];
        this.subscribedPonds = [];
        this.options = options;
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
            const htmlStr = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/buddylist.html');
            this.messageTemplateString = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/message.html');
            this.bp.appendCSS('/v2/apps/based/buddylist/buddylist.css');

            // await this.bp.importModule('https://cdn.jsdelivr.net/npm/uuid@11.0.3/+esm', {}, false)

            // loads affirmations messages via the affirmations app
            let affirmations = await this.bp.importModule('affirmations');

            const buddyListWindow = this.createBuddyListWindow();
            buddyListWindow.content.appendChild(this.createHTMLContent(htmlStr));

            this.registerEventHandlers();
            this.handleAuthentication();
            this.buddylistUIEvents();

            $('.loggedIn').hide();
            return 'hello buddyList';
        }

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

        return this.bp.apps.ui.windowManager.createWindow({
            app: 'buddylist',
            type: 'buddylist-profile',
            title: 'Buddy List',
            id: 'buddyListWindow',
            parent: this.bp.apps.ui.parent,
            width: 300,
            height: 500,
            x: 800,
            onClose: () => this.bp.log('buddyListWindow onClose'),
        });

    }

    registerEventHandlers() {
        this.bp.on('auth::qtoken', 'handle-auth-success', qtoken => this.handleAuthSuccess(qtoken));
        this.bp.on('client::websocketConnected', 'get-latest-messages', ws => this.getLatestMessages());
        this.bp.on('profile::buddylist', 'process-buddylist', ev => this.processBuddylist(ev.data));
        this.bp.on('profile::buddy::in', 'render-or-update-buddy-in-buddylist', data => this.renderOrUpdateBuddyInBuddyList(data));
        this.bp.on('profile::buddy::newmessage', 'open-chat-window', data => this.openChatWindow(data));
        this.bp.on('profile::buddy::newmessage', 'mark-messages-as-read', data => this.buddyReadNewMessages(data));

        this.bp.on('profile::status', 'update-profile-status', status => status === 'signout' && this.logout());
        this.bp.on('buddy::messages', 'render-chat-message', data => this.handleChatMessages(data));
        this.bp.on('buddy::sendMessage', 'send-buddy-message-to-server', data => this.sendMessageToServer(data));
        this.bp.on('pond::sendMessage', 'send-pond-message-to-server', data => this.sendPondMessageToServer(data));
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
        this.data.profileState.updates['buddies/' + buddyName] = {
            newMessages: false
        };
    }

    handleChatMessages(data) {

        /*
        if (data.name.includes(',')) {
            let subscribedBuddies = data.name.split(',');
            subscribedBuddies.forEach(buddy => {
                const chatWindow = this.openChatWindow({ name: buddy });
                data.result.messages.forEach(message => this.renderChatMessage(message, chatWindow));
            });
        } else {
            const chatWindow = this.openChatWindow(data);
            this.bp.log('buddy::messages', data, chatWindow);
            data.result.messages.forEach(message => this.renderChatMessage(message, chatWindow));
        }*/
        data.result.messages.forEach(message => this.renderChatMessage(message));


    }

    sendMessageToServer(data) {
        this.bp.log('buddy::sendMessage', data);
        data.uuid = uuid();
        // so confusing client.sendMessage....maybe should be sendWorkerMessage...dunno
        this.bp.apps.client.sendMessage({ id: data.uuid, method: 'sendMessage', data: data });
        data.name = data.to;
        const chatWindow = this.openChatWindow(data);
        //this.bp.log("LOCALRENDER", data, chatWindow);
        this.renderChatMessage(data, chatWindow);
    }

    sendPondMessageToServer(data) {
        data.type = 'pond';
        this.bp.log('pond::sendMessage', data);
        data.uuid = uuid();
        data.pondname = data.to;

        this.bp.apps.client.sendMessage({ id: data.uuid, method: 'sendMessage', data: data });
        const chatWindow = this.openChatWindow(data);
        this.renderChatMessage(data, chatWindow);
    }

    handleAuthentication() {
        const api = this.bp.apps.client.api;
        const localToken = localStorage.getItem('qtokenid');
        const me = localStorage.getItem('me');

        if (!localToken) return;

        api.verifyToken(me, localToken, (err, data) => {
            if (err) {
                console.error('Failed to verify token:', err);
                $('.loginForm .error').text('Failed to authenticate buddy');
                return;
            }

            this.bp.log('verified token', data);
            if (data.success) {
                this.bp.emit('auth::qtoken', { qtokenid: localToken, me: me });
                $('.loggedIn').show();
            } else {
                $('.loginForm .error').text('Failed to authenticate buddy');
                console.error('Failed to authenticate buddy:');
            }
        });
    }

    handleAuthSuccess(qtoken) {
        this.bp.me = qtoken.me;
        this.data.profileState.me = this.bp.me;
        $('.onlineStatusSelect').val('online');
        $('.loggedOut').hide();
        this.openChatWindow({ pondname: 'Lily' });

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
    $('.chatWindow').remove();

    this.bp.apps.client.disconnect();
    $('.password').val('');
    $('.loggedIn').hide();
    $('.loggedOut').show();
    localStorage.removeItem('qtokenid');
    localStorage.removeItem('me');
    // disconnect the client
}
