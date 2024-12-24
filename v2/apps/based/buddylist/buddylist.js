import processBuddylist from "./lib/processProfile";
import renderOrUpdateBuddyInBuddyList from "./lib/renderOrUpdateBuddyInBuddyList";
import renderChatMessage from "./lib/renderChatMessage";
import renderBuddyRequests from "./lib/renderBuddyRequests";
export default class BuddyList {

    constructor(bp) {
        this.bp = bp;
        this.data = {};
        return this;
    }

    async init() {
        let htmlStr = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/buddylist.html');
        this.messageTemplateString = await this.bp.fetchHTMLFragment('/v2/apps/based/buddylist/message.html');
        console.log('ttt', this.bp)

        this.bp.appendCSS('/v2/apps/based/buddylist/buddylist.css');

        // create a new UI window to hold the buddy list
        let buddyListWindow = this.bp.apps.ui.windowManager.createWindow({
            title: 'Buddy List',
            parent: this.bp.apps.ui.parent,
            width: 300,
            height: 500
        });

        this.bp.on('profile::buddy::in', 'render-or-update-buddy-in-buddylist', (data) => {
            console.log('profile::buddy::in', data);
            this.renderOrUpdateBuddyInBuddyList(data);
        });

        this.bp.on('profile::buddy::newmessage',  'open-message-window', (ev) => {
            // maybe open the window instead of immediately rendering the message?
            // we don't have the message now? only event?
            console.log('profile::buddy::newmessage', ev);
            //this.renderChatMessage(ev.data);
            /*
            desktop.on('profile::buddy::newmessage', 'open-message-window', function(data){
                desktop.ui.openWindow('buddylist', { context: data.name });
              });

            */
            // this.renderOrUpdateBuddyInBuddyList(ev.data);
        });

   
        this.bp.on('profile::buddylist', 'process-buddylist', (ev) => {
            this.processBuddylist(ev.data);
        });

        let html = document.createElement('div');
        html.innerHTML = htmlStr;

        buddyListWindow.content.appendChild(html);

        // focus on username input
        $('.loginForm input[name="username"]').focus();

        this.bp.on('auth::qtoken', 'hide-logged-out-elements-on-auth', (qtoken) => {
            $('.loggedOut').hide();
        });

        let api = this.bp.apps.client.api;
        let bp = this.bp;

        let localToken = localStorage.getItem('qtokenid');
        let me = localStorage.getItem('me');
        if (localToken) {
          api.verifyToken(me, localToken, function (err, data) {
            if (err) {
              console.error('Failed to verify token:', err);
              $('.loginForm .error').text('Failed to authenticate buddy');
              return;
            }
            console.log('verified token', data);
            if (data.success) {
              // attempt to connect for events after getting auth token
              //console.log('connecting with valid qtokenid', api.qtokenid);
              bp.emit('auth::qtoken', { qtokenid: localToken, me: me });
              $('.loggedIn').show();
            } else {
              $('.loginForm .error').text('Failed to authenticate buddy');
              console.error('Failed to authenticate buddy:');
            }
          });
        }

        // bind events
        $('.loginForm').submit((e) => {
            e.preventDefault();
            let username = $('.loginForm input[name="username"]').val();
            let password = $('.loginForm input[name="password"]').val();
            if (!password) {
                password = username;
            }
            api.authBuddy(username, password, function (err, result) {
                if (err) {
                    $('.loginForm .error').text('Failed to authenticate buddy');
                    console.error('Failed to authenticate buddy:', err);
                    return;
                }
                console.log('authBuddy', err, result);
                if (result.success) {
                    // attempt to connect for events after getting auth token
                    //console.log('connecting with valid qtokenid', api.qtokenid);
                    bp.emit('auth::qtoken', result.qtokenid);
                    $('.loggedIn').show();
                } else {


                    if (username === password) {
                        $('.password').show();
                        return;
                    }

                    $('.loginForm .error').text('Failed to authenticate buddy');
                    console.error('Failed to authenticate buddy:');
                }
            });
            return false;
        });

        $('.loggedIn').hide();

        // this.bp.apps.ui.parent.appendChild(html);
        console.log(html);
        return 'hello buddyList';
    }

};

BuddyList.prototype.renderOrUpdateBuddyInBuddyList = renderOrUpdateBuddyInBuddyList;
BuddyList.prototype.renderChatMessage = renderChatMessage;
BuddyList.prototype.renderBuddyRequests = renderBuddyRequests;
BuddyList.prototype.processBuddylist = processBuddylist;

BuddyList.prototype.logout = function() {
    localStorage.removeItem('qtokenid');
    localStorage.removeItem('me');
    $('.loggedIn').hide();
    $('.loggedOut').show();
}

function fetchHTMLFragment(url) {
    // TODO: this folder path is in our project root
    // our index.html is in the public folder and doesn't ahve access to the root
    //let url = `/v2/apps/based/buddylist/buddylist.html`;
    // fetches the URL as html and returns a promise
    return fetch(url).then(response => response.text());
}