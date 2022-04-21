let buddypond = {}

buddypond.mode = 'prod';

let desktop = { settings: {}};

if (document.location.protocol === 'https:') {
  buddypond.endpoint = 'https://api.buddypond.com/api/v3';
} else {
  buddypond.endpoint = 'https://api.buddypond.com/api/v3';
}

if (buddypond.mode === 'dev') {
  buddypond.endpoint = document.location.protocol + '//dev.buddypond.com/api/v3';
}

buddypond.authBuddy = function authBuddy (me, password, cb) {
  apiRequest('/auth', 'POST', {
    buddyname: me,
    buddypassword: password
  }, function(err, data){
    buddypond.me = me;
    cb(err, data);
  })
}

buddypond.verifyToken = function verifyToken (me, qtokenid, cb) {
  apiRequest('/verifyToken', 'POST', {
    buddyname: me,
    qtokenid: qtokenid
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

buddypond.banBuddy = function banBuddy (buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/ban', 'POST', {
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.getBuddyProfile = function getBuddyProfile (profileUpdates, cb) {
  apiRequest('/buddies', 'POST', profileUpdates, function(err, data){
    cb(err, data);
  })
}

buddypond.updateBuddyProfile = function updateBuddyProfile (profileUpdates, cb) {
  apiRequest('/buddies/' + buddypond.me + '/updateProfile', 'POST', profileUpdates, function(err, data){
    cb(err, data);
  })
}

// TODO: pass card values to sendMessage fn scope
buddypond.sendMessage = function sendMessage (buddyName, text, cb) {
  apiRequest('/messages/buddy/' + buddyName, 'POST', {
    buddyname: buddyName,
    text: text,
    geoflag: desktop.settings.geo_flag_hidden,
    card: {
      voiceIndex: desktop.settings.tts_voice_index
    }
  }, function(err, data){
    cb(err, data);
  })
}

// TODO: pass card values to pondSendMessage fn scope
buddypond.pondSendMessage = function pondSendMessage (pondname, pondtext, cb) {
  apiRequest('/messages/pond/' + pondname, 'POST', {
    pondname: pondname,
    pondtext: pondtext,
    geoflag: desktop.settings.geo_flag_hidden,
    card: {
      voiceIndex: desktop.settings.tts_voice_index
    }
  }, function(err, data){
    cb(err, data);
  })
}

buddypond.castSpell = function castSpell (buddyName, spellName, cb) {
  cb = cb || function noop (err, re) {
    console.log('buddyPond.castSpell completed noop', err, re);
  };
  apiRequest('/messages/buddy/' + buddyName, 'POST', {
    buddyname: buddyName,
    text: spellName,
    type: 'agent'
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

buddypond.getGbpMarket = function getGbpMarket (cb) {
  apiRequest('/gbp/market', 'GET', {}, function(err, data){
    cb(err, data);
  })
}

buddypond.purchaseGbp = function purchaseGbp (params, cb) {
  apiRequest('/gbp/purchase', 'POST', params, function(err, data){
    cb(err, data);
  })
}

buddypond.giveGbp = function giveGbp (params, cb) {
  apiRequest('/gbp/send', 'POST', params, function(err, data){
    cb(err, data);
  })
}

buddypond.getGbpBalance = function purchaseGbp (params, cb) {
  apiRequest('/gbp/balance', 'GET', params, function(err, data){
    cb(err, data);
  })
}

buddypond.getGbpRecentTransactions = function recentGbpTransactions (params, cb) {
  apiRequest('/gbp/recent', 'GET', params, function(err, data){
    cb(err, data);
  })
}

buddypond.sendSnaps = function pondSendMessage (type, name, text, snapsJSON, delay, cb) {
  let x = (new TextEncoder().encode(snapsJSON)).length;
  console.log('Snaps', `About to send a Snap: ${x} bytes -> ${type}/${name}`);
  if (type === 'pond') {
    apiRequest('/messages/pond/' + name, 'POST', {
      pondname: name,
      pondtext: text,
      type: 'pond',
      card: {
        type: 'snaps',
        snaps: snapsJSON,
        delay: delay
      }
    }, function(err, data){
      cb(err, data);
    });
  }
  if (type === 'buddy') {
    apiRequest('/messages/buddy/' + name, 'POST', {
      buddyname: name,
      text: text,
      type: 'buddy',
      card: {
        type: 'snaps',
        snaps: snapsJSON,
        delay: delay
      }
    }, function(err, data){
      cb(err, data);
    });
  }
}

buddypond.sendAudio = function pondSendMessage (type, name, text, audioJSON, cb) {
  let x = (new TextEncoder().encode(audioJSON)).length;
  console.log('Sounds', `About to send a Audio: ${x} bytes -> ${type}/${name}`);
  if (type === 'pond') {
    apiRequest('/messages/pond/' + name, 'POST', {
      pondname: name,
      pondtext: text,
      type: 'pond',
      card: {
        type: 'audio',
        audio: audioJSON
      }
    }, function(err, data){
      cb(err, data);
    });
  }
  if (type === 'buddy') {
    apiRequest('/messages/buddy/' + name, 'POST', {
      buddyname: name,
      text: text,
      type: 'buddy',
      card: {
        type: 'audio',
        audio: audioJSON
      }
    }, function(err, data){
      cb(err, data);
    });
  }
}

//
// "Packet" tracking here is just used for aestic purposes and not for any real calculations
//              ( they just for decoration )
//
buddypond.packetsSent = 0;
buddypond.packetsReceived = 0;

buddypond.incrementPackets = function incrementPackets (key) {
  if (buddypond[key] > 999999) {
    buddypond[key] = 0;
  }
  buddypond[key]++;
}

//
// Methods for tracking performance of API requests being made from Buddy Pond Client
//
buddypond.recentResponseTimes = [];

buddypond.addPerfTime = function addPerfTime (perf) {
  if (buddypond.recentResponseTimes.length > 55) {
    buddypond.recentResponseTimes.shift();
  }
  buddypond.recentResponseTimes.push(perf);
}

buddypond.averageResponseTime = function averageResponseTime () {
  let mean = 0;
  buddypond.recentResponseTimes.forEach(function(perf){
    let elapsed = perf.end.getTime() - perf.start.getTime();
    mean += elapsed;
  });
  let average = mean / buddypond.recentResponseTimes.length;
  return Math.floor(average) + 'ms';
}

buddypond.lastResponseTime = function averageResponseTime () {
  let perf = buddypond.recentResponseTimes[buddypond.recentResponseTimes.length - 1];
  let elapsed = perf.end.getTime() - perf.start.getTime();
  return elapsed + 'ms';
}
//
// end methods for tracking API request performance
//

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
  let perf = {};
  perf.start = new Date();
  buddypond.incrementPackets('packetsSent');
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
    error: function (err, data, res){
      let msg = 'ajax connection error. retrying request shortly.'
      if (res === 'Payload Too Large') {
        msg = 'File upload was too large for server. Try a smaller file.';
      }
      cb(new Error(msg), data, res);
    },
    timeout: function(err, res){
      cb(new Error('AJAX timeout'), res);
    },
    success: function (data){
      buddypond.incrementPackets('packetsReceived');
      perf.end = new Date();
      buddypond.addPerfTime(perf);
      cb(null, data)
    }
  });
}