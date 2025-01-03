// TODO: convert this to API class which can communicate either via REST
// or via websockets messages with simple RPC format ( JSON )

let buddypond = {}

buddypond.mode = 'prod';

// check localStorage for qtokenid
buddypond.qtokenid = localStorage.getItem('qtokenid');

buddypond.supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
buddypond.supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
buddypond.supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];


// legacy v4 API
let desktop = { settings: {}};

if (document.location.protocol === 'https:') {
  buddypond.endpoint = 'https://api.buddypond.com/api/v3';
  // buddypond.endpoint = 'https://137.184.116.145/api/v3';

} else {
  buddypond.endpoint = 'http://137.184.116.145/api/v3';
}

if (buddypond.mode === 'dev') {
  // buddypond.endpoint = document.location.protocol + '//dev.buddypond.com/api/v3';
  buddypond.endpoint = 'http://192.168.200.59/api/v3';
}

buddypond.authBuddy = function authBuddy (me, password, cb) {
  apiRequest('/auth', 'POST', {
    buddyname: me,
    buddypassword: password
  }, function(err, data){
    if (data && data.success) {
      buddypond.me = me;
      buddypond.qtokenid = data.qtokenid;
      localStorage.setItem('qtokenid', data.qtokenid);
      localStorage.setItem('me', buddypond.me);
    }
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

// Legacy REST method for getting / setting buddy profile in one call
buddypond.getBuddyProfile = function getBuddyProfile (profileUpdates, cb) {
  apiRequest('/buddies', 'POST', profileUpdates, function(err, data){
    cb(err, data);
  })
}

// Newer v5 getProfile ( read only )
buddypond.getProfile = async function getProfile(buddyname) {
  return new Promise((resolve, reject) => {
    apiRequest('/buddies/' + buddyname, 'GET', {}, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}



// Create a new Pad
buddypond.createPad = async function (padData) {
  return new Promise((resolve, reject) => {
    apiRequest('/pads', 'POST', padData, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Retrieve a specific Pad by key
buddypond.getPad = async function (key) {
  return new Promise((resolve, reject) => {
    apiRequest('/pads' + key, 'GET', {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

buddypond.getPads = async function (params) {
  return new Promise((resolve, reject) => {
    apiRequest('/pads', 'GET', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Update a specific Pad by key
buddypond.updatePad = async function (key, padUpdates) {
  return new Promise((resolve, reject) => {
    apiRequest('/pads' + key, 'POST', padUpdates, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Delete a specific Pad by key
buddypond.deletePad = async function (key) {
  return new Promise((resolve, reject) => {
    apiRequest('/pads' + key, 'DELETE', {}, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
};




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

buddypond.removeMessage = async function removeMessage ({from, to, type, uuid}) {
  return new Promise((resolve, reject) => {
    apiRequest('/messages/remove', 'POST', {
      from: from,
      to: to,
      type: type,
      uuid: uuid
    }, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

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

// Helper function to check file types
buddypond.getFileCategory = function getFileCategory(fileType) {
  if (buddypond.supportedImageTypes.includes(fileType)) {
    return 'image';
  }
  if (buddypond.supportedAudioTypes.includes(fileType)) {
    return 'audio';
  }
  if (buddypond.supportedVideoTypes.includes(fileType)) {
    return 'video';
  }
  return 'binary';
}

buddypond.getFiles = async function getFiles (owner) {
  return new Promise((resolve, reject) => {
    apiRequest(`/files/${buddypond.me}`, 'GET', {}, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

buddypond.sendFile = async function sendFile({ type, name, text, file, delay }) {
  return new Promise((resolve, reject) => {
    const fileCategory = buddypond.getFileCategory(file.type);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const base64Data = reader.result.split(',')[1]; // Remove data URL prefix
        
        switch (fileCategory) {
          case 'image': {
            // Handle images as snaps
            const snapsJSON = JSON.stringify(base64Data);
            
            buddypond.sendSnaps(type, name, text, snapsJSON, delay, (err, data) => {
              if (err) reject(err);
              else resolve(data);
            });
            break;
          }
          
          case 'audio': {
            // Handle audio files
            const audioJSON = JSON.stringify({
              data: base64Data,
              type: file.type,
              name: file.name
            });
            
            buddypond.sendAudio(type, name, text, audioJSON, (err, data) => {
              if (err) reject(err);
              else resolve(data);
            });
            break;
          }
          
          case 'video':
          case 'binary': {
            // Handle video and other binary files
            const fileJSON = JSON.stringify({
              data: base64Data,
              type: file.type,
              name: file.name,
              size: file.size
            });
            
            buddypond.sendBinaryFile(type, name, text, fileJSON, (err, data) => {
              if (err) reject(err);
              else resolve(data);
            });
            break;
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    console.log('ffff', file);
    // Start reading the file
    // get the blob from the file
    // let blob = ???;
    // file.src is an object URL
    // how to gert blob?
    reader.readAsDataURL(file);
  });
}

buddypond.sendBinaryFile = function sendBinaryFile(type, name, text, fileJSON, cb) {
  let x = (new TextEncoder().encode(fileJSON)).length;
  console.log('File', `About to send a file: ${x} bytes -> ${type}/${name}`);
  
  const payload = {
    type: type,
    card: {
      type: 'file',
      file: fileJSON
    }
  };
  
  // Add type-specific fields
  if (type === 'pond') {
    payload.pondname = name;
    payload.pondtext = text;
  } else if (type === 'buddy') {
    payload.buddyname = name;
    payload.text = text;
  }
  
  apiRequest(`/messages/${type}/${name}`, 'POST', payload, function(err, data) {
    cb(err, data);
  });
}


buddypond.sendSnaps = function pondSendMessage (type, name, text, snapsJSON, delay, cb) {
  let x = (new TextEncoder().encode(snapsJSON)).length;
  console.log('Snaps', `About to send a Snap: ${x} bytes -> ${type}/${name}`);
  console.log('type', type, 'name', name, 'text', text, 'snapsJSON', snapsJSON, 'delay', delay);
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
      console.log("callback from sendSnaps", err, data);
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


buddypond.setPowerLevel = function setPowerLevel (buddyName, level) {
  apiRequest('/buddies/' + buddyName + '/powerlevel', 'POST', {
    level: level
  }, function(err, data){
    console.log('setPowerLevel', err, data);
  })
  
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

buddypond.logout = function logout () {
  localStorage.removeItem('qtokenid');
  localStorage.removeItem('me');
  buddypond.me = null;
  buddypond.qtokenid = null;
}


//
// end methods for tracking API request performance
//


function apiRequest(uri, method, data, cb) {
  let url = buddypond.endpoint + uri;

  // console.log("making apiRequest", url, method, data);
  let headers = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8"
  };

  if (buddypond.qtokenid) {
      data = data || {};
      data.qtokenid = buddypond.qtokenid;
      headers['qtokenid'] = buddypond.qtokenid;
  }

  let body = method === "POST" ? JSON.stringify(data) : undefined;

  // Prepare fetch options
  const options = {
      method: method,
      headers: headers,
      body: body
  };

  // Handling fetch timeout manually
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second for timeout

  buddypond.incrementPackets('packetsSent');
  let perf = {};
  perf.start = new Date();

  // TODO: this should be fetch-in-worker
  fetch(url, { ...options, signal: controller.signal })
      .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) {
              throw new Error(response.statusText);
          }
          return response.json();
      })
      .then(data => {
          buddypond.incrementPackets('packetsReceived');
          perf.end = new Date();
          buddypond.addPerfTime(perf);
          cb(null, data);
      })
      .catch(error => {
          let msg = 'Fetch connection error. Retrying request shortly.';
          console.log(error)
          if (error.name === "AbortError") {
              msg = 'Fetch request timeout';
          } else if (error.message === 'Payload Too Large') {
              msg = 'File upload was too large for server. Try a smaller file.';
          } else {
            msg = error.message;
          }
          cb(new Error(msg), null);
      });
}


//export default buddypond;