let bp = {};

const axios = require('axios');

const util = require('util');

bp.mode = 'dev';

if (bp.mode === 'dev') {
  bp.endpoint = 'http://dev.buddypond.com/api/v3';
} else {
  bp.endpoint = 'https://api.buddypond.com/api/v3';
}

bp.Client = function BuddyPondClient (config) {
  let self = this;
  
  return self;
}

bp.Client.prototype.authBuddy = async function authBuddy (me, password, cb) {
  let res = await this.apiRequest('/auth', {
    buddyname: me,
    buddypassword: password
  });

  bp.qtokenid = res.qtokenid;
  return res;
}

bp.Client.prototype.pondSendMessage = async function pondSendMessage (pondname, pondtext, cb) {
  let res = await this.apiRequest('/messages/pond/' + pondname, {
    pondname: pondname,
    pondtext: pondtext
  });
  return res;
}

bp.Client.prototype.buddySendMessage = async function buddySendMessage (buddyname, buddytext, cb) {
  let res = await this.apiRequest('/messages/buddy/' + buddyname, {
    buddyname: buddyname,
    text: buddytext
  });
  return res;
}

bp.Client.prototype.apiRequest = async function apiRequest (uri, data, cb) {
  let url = bp.endpoint + uri;

  if (bp.qtokenid) {
    data = data || {};
    data.qtokenid = bp.qtokenid;
  }

  let res = await axios.post(url, data);
  return res.data;

}

module.exports = bp;