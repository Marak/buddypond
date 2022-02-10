let buddypond = {}

buddypond.endpoint = 'https://buddypond.com/api/v3';

buddypond.authBuddy = function authBuddy (me, password, cb) {
  apiRequest('/auth', 'POST', {
    buddyname: me,
    buddypassword: password
  }, function(err, data){
    buddypond.me = me;
    cb(err, data);
  })
}

buddypond.addBuddy = function addBuddy (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/addbuddy', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.removeBuddy = function removeBuddy (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/remove', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.approveBuddy = function approveBuddy (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/approve', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.denyBuddy = function denyBuddy (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/deny', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.getBuddyList = function getBuddyList (profileUpdates, cb) {
  apiRequest('/buddies', 'POST', profileUpdates, function(err, data){
    cb(err, data);
  })
}

buddypond.sendMessage = function sendMessage (buddyName, text, cb) {
  apiRequest('/messages/buddy/' + buddyName, 'POST', {
    buddyname: buddyName,
    text: text
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.sendBuddySignal = function sendBuddySignal (buddyname, signal, cb) {
  apiRequest('/buddies/' + buddyname + '/signal', 'POST', {
    data: signal
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.getBuddySignal = function getBuddySignal (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/signal', 'GET', {}, function(err, data){
    cb(err, data);
  })
}

buddypond.callBuddy = function callBuddy (buddyName, text, cb) {
  apiRequest('/buddies/' + buddyName + '/call', 'POST', {
    buddyname: buddyName,
    text: text
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.endBuddyCall = function endBuddyCall (buddyName, cb) {
  apiRequest('/buddies/' + buddyName + '/endcall', 'POST', {
    buddyname: buddyName,
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.endCall = function endCall (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/endcall', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.declineCall = function declineCall (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/declinecall', 'POST', {
    buddyname: buddyname
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.getMessages = function getMessages (params, cb) {
  apiRequest('/messages/getMessages', 'POST', params, function(err, data){
    cb(err, data);
  })
}

buddypond.pondSendMessage = function pondSendMessage (pondname, pondtext, cb) {
  apiRequest('/messages/pond/' + pondname, 'POST', {
    pondname: pondname,
    pondtext: pondtext
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.getHandshake = function getHandShake (handshakename, cb) {
  apiRequest('/handshakes/' + handshakename, 'GET', {
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.offerHandshake = function offerHandshake (handshakename, data, cb) {
  apiRequest('/handshakes/' + handshakename + '/offer', 'POST', {
    offer: data
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.answerHandshake = function answerHandshake (handshakename, data, cb) {
  apiRequest('/handshakes/' + handshakename + '/answer', 'POST', {
    answer: data
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.clearHandshake = function clearHandshake (handshakename, cb) {
  apiRequest('/handshakes/' + handshakename + '/clear', 'POST', {
  }, function(err, data){
    cb(err, data);
  })
}

function apiRequest (uri, method, data, cb) {
  let url = buddypond.endpoint + uri;
  let headers = {
     "accept": "application/json"
  };
  if (buddypond.qtokenid) {
    data = data || {};
    data.qtokenid = buddypond.qtokenid;
  }
  if (method === "POST") {
    data = JSON.stringify(data);
  }
  $.ajax({
    "headers": {
       "accept": "application/json"
    },
    crossDomain: true,
    url: url,
    data: data,
    method: method,
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    timeout: 7,
    error: function (data, res){
      cb(new Error('ajax connection error. retrying request shortly.'), data);
    },
    timeout: function(err, res){
      cb(new Error('AJAX timeout'), res);
    },
    success: function (data){
      cb(null, data)
    }
  });
}