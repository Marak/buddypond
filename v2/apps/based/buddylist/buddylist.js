import processBuddylist from "./lib/processProfile";
import renderOrUpdateBuddyInBuddyList from "./lib/renderOrUpdateBuddyInBuddyList";
import renderChatMessage from "./lib/renderChatMessage";
import renderBuddyRequests from "./lib/renderBuddyRequests";
import buddylistUIEvents from "./lib/buddylistUIEvents";
import openChatWindow from "./lib/openChatWindow";
import { v4 as uuid } from 'uuid';

export default class BuddyList {
    constructor(bp) {
        this.bp = bp;
        this.data = {
            processedMessages: [],
        };
        this.subscribedBuddies = [];
        this.subscribedPonds = [];
    }

    async init() {
        const htmlStr = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/buddylist.html');
        this.messageTemplateString = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/message.html');
        this.bp.appendCSS('/v2/apps/based/buddylist/buddylist.css');
        
        const buddyListWindow = this.createBuddyListWindow();
        buddyListWindow.content.appendChild(this.createHTMLContent(htmlStr));

        this.registerEventHandlers();
        this.handleAuthentication();
        this.buddylistUIEvents();

        $('.loggedIn').hide();
        console.log(htmlStr);
        return 'hello buddyList';
    }

    createBuddyListWindow() {
        return this.bp.apps.ui.windowManager.createWindow({
            title: 'Buddy List',
            parent: this.bp.apps.ui.parent,
            width: 300,
            height: 500,
            onClose: () => console.log('buddyListWindow onClose'),
        });
    }

    registerEventHandlers() {
        this.bp.on('auth::qtoken',               'hide-logged-out-elements-on-auth', qtoken => this.handleAuthSuccess());
        this.bp.on('client::websocketConnected', 'get-latest-messages', ws => this.getLatestMessages());
        this.bp.on('profile::buddylist',         'process-buddylist', ev => this.processBuddylist(ev.data));
        this.bp.on('profile::buddy::in',         'render-or-update-buddy-in-buddylist', data => this.renderOrUpdateBuddyInBuddyList(data));
        this.bp.on('profile::buddy::newmessage', 'open-chat-window', data => this.openChatWindow(data));
        this.bp.on('profile::status',            'update-profile-status', status => status === 'signout' && this.logout());
        this.bp.on('buddy::messages',            'render-chat-message', data => this.handleChatMessages(data));
        this.bp.on('chat::sendMessage',          'send-message-to-server', data => this.sendMessageToServer(data));
    }

    createHTMLContent(htmlStr) {
        const html = document.createElement('div');
        html.innerHTML = htmlStr;
        $('.loginForm input[name="username"]').focus();
        return html;
    }

    getLatestMessages() {
        const data = { buddyname: this.subscribedBuddies.join(','), me: this.bp.me };
        this.bp.apps.client.sendMessage({ id: uuid(), method: 'getMessages', data: data });
    }

    handleChatMessages(data) {
        const chatWindow = this.openChatWindow(data);
        console.log('buddy::messages', data);
        data.result.messages.forEach(message => this.renderChatMessage(message, chatWindow));
    }

    sendMessageToServer(data) {
        console.log('chat::sendMessage', data);
        data.uuid = uuid();
        this.bp.apps.client.sendMessage({ id: uuid(), method: 'sendMessage', data: data });
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

            console.log('verified token', data);
            if (data.success) {
                this.bp.emit('auth::qtoken', { qtokenid: localToken, me: me });
                $('.loggedIn').show();
            } else {
                $('.loginForm .error').text('Failed to authenticate buddy');
                console.error('Failed to authenticate buddy:');
            }
        });
    }

    handleAuthSuccess() {
        $('.onlineStatusSelect').val('online');
        $('.loggedOut').hide();
    }
}

BuddyList.prototype.renderOrUpdateBuddyInBuddyList = renderOrUpdateBuddyInBuddyList;
BuddyList.prototype.renderChatMessage = renderChatMessage;
BuddyList.prototype.renderBuddyRequests = renderBuddyRequests;
BuddyList.prototype.processBuddylist = processBuddylist;
BuddyList.prototype.buddylistUIEvents = buddylistUIEvents;
BuddyList.prototype.openChatWindow = openChatWindow;
BuddyList.prototype.logout = function () {
    localStorage.removeItem('qtokenid');
    localStorage.removeItem('me');
    $('.password').val('');
    $('.loggedIn').hide();
    $('.loggedOut').show();
}
