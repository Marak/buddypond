// TODO: convert this to API class which can communicate either via REST
// or via websockets messages with simple RPC format ( JSON )

let buddypond = {}

buddypond.mode = 'prod';

// check localStorage for qtokenid
buddypond.qtokenid = localStorage.getItem('qtokenid');
buddypond.me = localStorage.getItem('me');

buddypond.supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
buddypond.supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
buddypond.supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];


// legacy v4 API
let desktop = { settings: {} };

if (document.location.protocol === 'https:') {
  buddypond.endpoint = 'https://api.buddypond.com/api/v3';
  buddypond.uploadsEndpoint = 'https://uploads.buddypond.com';
  // buddypond.endpoint = 'https://137.184.116.145/api/v3';

} else {
  buddypond.endpoint = 'http://137.184.116.145/api/v3';
}

if (buddypond.mode === 'dev') {
  // buddypond.endpoint = document.location.protocol + '//dev.buddypond.com/api/v3';
  buddypond.endpoint = 'http://192.168.200.59/api/v3';
}

buddypond.authBuddy = function authBuddy(me, password, cb) {
  apiRequest('/auth', 'POST', {
    buddyname: me,
    buddypassword: password
  }, function (err, data) {
    if (data && data.success) {
      buddypond.me = me;
      buddypond.qtokenid = data.qtokenid;
      localStorage.setItem('qtokenid', data.qtokenid);
      localStorage.setItem('me', buddypond.me);
    }
    cb(err, data);
  })
}

buddypond.verifyToken = function verifyToken(me, qtokenid, cb) {
  apiRequest('/verifyToken', 'POST', {
    buddyname: me,
    qtokenid: qtokenid
  }, function (err, data) {
    buddypond.me = me;
    cb(err, data);
  })
}

buddypond.addBuddy = function addBuddy(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/addbuddy', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.removeBuddy = function removeBuddy(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/remove', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.approveBuddy = function approveBuddy(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/approve', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.denyBuddy = function denyBuddy(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/deny', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.banBuddy = function banBuddy(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/ban', 'POST', {
  }, function (err, data) {
    cb(err, data);
  })
}

// Legacy REST method for getting / setting buddy profile in one call
buddypond.getBuddyProfile = function getBuddyProfile(profileUpdates, cb) {
  apiRequest('/buddies', 'POST', profileUpdates, function (err, data) {
    cb(err, data);
  })
}

// Newer v5 getProfile ( read only )
buddypond.getProfile = async function getProfile(buddyname) {
  return new Promise((resolve, reject) => {
    apiRequest('/buddies/' + buddyname, 'GET', {}, function (err, data) {
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




buddypond.updateBuddyProfile = function updateBuddyProfile(profileUpdates, cb) {
  apiRequest('/buddies/' + buddypond.me + '/updateProfile', 'POST', profileUpdates, function (err, data) {
    cb(err, data);
  })
}

// TODO: pass card values to sendMessage fn scope
buddypond.sendMessage = function sendMessage(buddyName, text, cb) {
  apiRequest('/messages/buddy/' + buddyName, 'POST', {
    buddyname: buddyName,
    text: text,
    geoflag: desktop.settings.geo_flag_hidden,
    card: {
      voiceIndex: desktop.settings.tts_voice_index
    }
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.removeMessage = async function removeMessage({ from, to, type, uuid }) {
  return new Promise((resolve, reject) => {
    apiRequest('/messages/remove', 'POST', {
      from: from,
      to: to,
      type: type,
      uuid: uuid
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

}

// TODO: pass card values to pondSendMessage fn scope
buddypond.pondSendMessage = function pondSendMessage(pondname, pondtext, cb) {
  apiRequest('/messages/pond/' + pondname, 'POST', {
    pondname: pondname,
    pondtext: pondtext,
    geoflag: desktop.settings.geo_flag_hidden,
    card: {
      voiceIndex: desktop.settings.tts_voice_index
    }
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.castSpell = function castSpell(buddyName, spellName, cb) {
  cb = cb || function noop(err, re) {
    console.log('buddyPond.castSpell completed noop', err, re);
  };
  apiRequest('/messages/buddy/' + buddyName, 'POST', {
    buddyname: buddyName,
    text: spellName,
    type: 'agent'
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.sendBuddySignal = function sendBuddySignal(buddyname, signal, cb) {
  apiRequest('/buddies/' + buddyname + '/signal', 'POST', {
    data: signal
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.getBuddySignal = function getBuddySignal(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/signal', 'GET', {}, function (err, data) {
    cb(err, data);
  })
}

buddypond.callBuddy = function callBuddy(buddyName, text, cb) {
  apiRequest('/buddies/' + buddyName + '/call', 'POST', {
    buddyname: buddyName,
    text: text
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.endBuddyCall = function endBuddyCall(buddyName, cb) {
  apiRequest('/buddies/' + buddyName + '/endcall', 'POST', {
    buddyname: buddyName,
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.endCall = function endCall(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/endcall', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.declineCall = function declineCall(buddyname, cb) {
  apiRequest('/buddies/' + buddyname + '/declinecall', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

buddypond.getMessages = function getMessages(params, cb) {
  apiRequest('/messages/getMessages', 'POST', params, function (err, data) {
    cb(err, data);
  })
}

buddypond.getGbpMarket = function getGbpMarket(cb) {
  apiRequest('/gbp/market', 'GET', {}, function (err, data) {
    cb(err, data);
  })
}

buddypond.purchaseGbp = function purchaseGbp(params, cb) {
  apiRequest('/gbp/purchase', 'POST', params, function (err, data) {
    cb(err, data);
  })
}

buddypond.giveGbp = function giveGbp(params, cb) {
  apiRequest('/gbp/send', 'POST', params, function (err, data) {
    cb(err, data);
  })
}

buddypond.getGbpBalance = function purchaseGbp(params, cb) {
  apiRequest('/gbp/balance', 'GET', params, function (err, data) {
    cb(err, data);
  })
}

buddypond.getGbpRecentTransactions = function recentGbpTransactions(params, cb) {
  apiRequest('/gbp/recent', 'GET', params, function (err, data) {
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

buddypond.getFiles = async function getFiles(owner) {
  return new Promise((resolve, reject) => {
    apiRequest(`/files/${buddypond.me}`, 'GET', {}, function (err, data) {
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
    reader.onload = async function () {
      try {
        const base64Data = reader.result.split(',')[1]; // Remove data URL prefix

        switch (fileCategory) {
          case 'image': {
            // Handle images as snaps
            const snapsJSON = JSON.stringify(base64Data);

            buddypond.sendSnaps(type, name, text, snapsJSON, delay, 'paint', (err, data) => {
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

  apiRequest(`/messages/${type}/${name}`, 'POST', payload, function (err, data) {
    cb(err, data);
  });
}


// Remark: 1/6/2025 - buddypond.sendSnaps() is now considered legacy function
//                    and should be replaced with buddypond.uploadFile()
//                    This function is still used by legacy: desktop.paint, desktop.gifstudio, desktop.mirror
//                    TODO: port all those apps to new v5 API     
buddypond.sendSnaps = function pondSendMessage(type, name, text, snapsJSON, delay, source, cb) {
  let x = (new TextEncoder().encode(snapsJSON)).length;
  console.log('Snaps', `About to send a Snap: ${x} bytes -> ${type}/${name}`);
  console.log('type', type, 'name', name, 'text', text, 'snapsJSON', snapsJSON, 'delay', delay);

  // snapsJSON is a stringified JSON of a single base64 encoded png file or gif file
  // we wish to use our new buddypond.uploadFile() API to send this file

  // Convert the data URI to Blob
  let parts = snapsJSON.split(',')[1];
  console.log("FARTS", parts);
  // bad fart from somewhere, remove the last char if its a "
  if (parts[parts.length - 1] === '"') {
    parts = parts.substring(0, parts.length - 1);
  }
  const byteString = atob(parts);
  console.log('byteString', byteString)
  const mimeString = snapsJSON.split(',')[0].split(':')[1].split(';')[0];
  console.log('mimeString', mimeString)
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });


  // we need to generate a unique file name here
  // since we can't come up with any good options, just use date time
  let fileName;
  let filePath;
  // alert(source)

  // route based on the source of the file
  if (source === 'paint') {
    // Paints are stored in the paints folder
    fileName = `${new Date()}.png`;
    filePath = `paints/${fileName}`;
  }

  if (source === 'camera') {
    // need to check if gif or png?
    fileName = `${new Date()}.gif`;
    // Camera shots are stored in the pictures folder
    filePath = `pictures/${fileName}`;
  }

  if (source === 'gif-studio') {
    // Gifs are stored in the gifs folder
    fileName = `${new Date()}.gif`;
    filePath = `animations/${fileName}`;
  }
  console.log(`constructed new file: ${fileName}`);
  const file = new File([blob], fileName, { type: mimeString });
  file.filePath = filePath;

  // file.filePath = `paints/${fileName}`; // root snaps into paints folder ( also need pictures folder for camera shots)
  console.log(`assigned filePath to file: ${file.filePath}`);
  console.log('uploading file via legacy code path', file);

  // Wrap uploadFile in a promise and handle the callback
  return new Promise((resolve, reject) => {
    buddypond.uploadFile(file, (progress) => {
      console.log('Upload progress:', progress);
    }).then(fileUrl => {
      console.log('File uploaded and available at:', fileUrl);
      cb(null, fileUrl); // Use callback to return success
      resolve(fileUrl); // Resolve the promise with the URL
    }).catch(error => {
      console.error('Failed to upload file:', error);
      cb(error); // Use callback to return error
      reject(error); // Reject the promise with the error
    });
  });


  return;

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
    }, function (err, data) {
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
    }, function (err, data) {
      console.log("callback from sendSnaps", err, data);
      cb(err, data);
    });
  }
}

buddypond.sendAudio = function pondSendMessage(type, name, text, audioJSON, cb) {
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
    }, function (err, data) {
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
    }, function (err, data) {
      cb(err, data);
    });
  }
}

buddypond.listFiles = async function listFiles(prefix = '', depth = 1) {

  let url = `${buddypond.uploadsEndpoint}/getFileList?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&userFolder=${buddypond.me}&prefix=${prefix}&depth=${depth}`;

  console.log("fetching files from", url);
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to list files: ${await response.text()}`);
  }

  return await response.json();

}

buddypond.getFileUsage = async function getFileUsage() {

  const url = `${buddypond.uploadsEndpoint}/getUsage?me=${buddypond.me}&qtokenid=${buddypond.qtokenid}`;

  console.log('Requesting file usage from Worker:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get file usage: ${await response.text()}`);
    }
    return await response.json();
  }
  catch (err) {
    console.error('Error getting file usage:', err);
    throw err; // Rethrow for external handling
  }

}

buddypond.removeFile = async function removeFile(fileName) {

  // instead of signed url to delete, we will simply call the worker to delete the file
  const url = `${buddypond.uploadsEndpoint}/deleteFiles?prefix=${fileName}&me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&userFolder=${buddypond.me}&depth=6`;

  console.log("fetching delete url", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${await response.text()}`);
    }
    return fileName;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err; // Rethrow for external handling
  }

};


// Remark: We could ignore files and directories at the api client level
// Currently this is handled in the application level with the UploadOverlayPanel
let ignoredFiles = ['.DS_Store', '.git', '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.npmignore', '.npmrc', '.yarnignore', '.yarnrc', '.editorconfig', '.eslint'];
let ignoredDirs = ['.git', 'node_modules'];

buddypond.uploadFile = async function uploadFile(file, onProgress) {

  onProgress = onProgress || function noop() { };

  console.log("buddypond.uploadFile", file);
  // Construct the URL for the Worker to generate the signed URL
  let fileName = encodeURIComponent(file.webkitRelativePath || file.name);
  let filePath = file.filePath || '';
  console.log("using filePath", filePath);


  // check to see if filePath starts with a /, if so, remove it
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
    console.log("removed leading / from filePath", filePath);
  }

  const fileSize = file.size; // Get the size of the file
  const userFolder = buddypond.me; // Define the user folder path appropriately
  // TODO: we may need to add paths here if uploading directories / etc
  //fileName = 'test/' + fileName;
  console.log('fileName', fileName, 'fileSize', fileSize, 'userFolder', userFolder, 'filePath', filePath);

  const signedUrlRequest = `${buddypond.uploadsEndpoint}/generate-signed-url?fileName=${filePath}&fileSize=${fileSize}&userFolder=${userFolder}&qtokenid=${buddypond.qtokenid}&me=${buddypond.me}`;

  console.log('Requesting signed URL from Worker:', signedUrlRequest);

  try {
    const signedUrlResponse = await fetch(signedUrlRequest);
    if (!signedUrlResponse.ok) {
      throw new Error(`Failed to get signed URL: ${await signedUrlResponse.text()}`);
    }

    const { signedUrl } = await signedUrlResponse.json();
    console.log('Received signed URL:', signedUrl);


    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error(`HTTP error during file upload: ${await uploadResponse.text()}`);
    }

    // lets return the new file url for the file
    // its not the signed url, its the constructed url on the CDN with userFolder and fileName
    let fileUrl = `https://files.buddypond.com/${userFolder}/${filePath}`; // Remark: This was fileName...filePath is probalby correct?
    console.log('File uploaded successfully:', fileUrl);
    console.log('Upload successful, server responded with:', await uploadResponse.text());
    return fileUrl;
  } catch (error) {
    console.error('Error during file upload process:', error);
    //return error;
    throw error;
  }


}

buddypond.uploadFiles = async function uploadFiles(files, onProgress) {
  if (!files.length) {
    alert('Please select a directory.');
    return;
  }
  // Define the base URL of your Cloudflare Worker

  // Loop through all files and upload them one by one
  for (let file of files) {

    await buddypond.uploadFile(file, onProgress);

  }
}

buddypond.getFileMetadata = async function (fileName) {
  const url = `${buddypond.uploadsEndpoint}/get-metadata?fileName=${encodeURIComponent(fileName)}&me=${buddypond.me}&qtokenid=${buddypond.qtokenid}&userFolder=${buddypond.me}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get metadata: ${await response.text()}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Error getting file metadata:', err);
    throw err; // Rethrow for external handling
  }
};


buddypond.setPowerLevel = function setPowerLevel(buddyName, level) {
  apiRequest('/buddies/' + buddyName + '/powerlevel', 'POST', {
    level: level
  }, function (err, data) {
    console.log('setPowerLevel', err, data);
  })

}


//
// "Packet" tracking here is just used for aestic purposes and not for any real calculations
//              ( they just for decoration )
//
buddypond.packetsSent = 0;
buddypond.packetsReceived = 0;

buddypond.incrementPackets = function incrementPackets(key) {
  if (buddypond[key] > 999999) {
    buddypond[key] = 0;
  }
  buddypond[key]++;
}

//
// Methods for tracking performance of API requests being made from Buddy Pond Client
//
buddypond.recentResponseTimes = [];

buddypond.addPerfTime = function addPerfTime(perf) {
  if (buddypond.recentResponseTimes.length > 55) {
    buddypond.recentResponseTimes.shift();
  }
  buddypond.recentResponseTimes.push(perf);
}

buddypond.averageResponseTime = function averageResponseTime() {
  let mean = 0;
  buddypond.recentResponseTimes.forEach(function (perf) {
    let elapsed = perf.end.getTime() - perf.start.getTime();
    mean += elapsed;
  });
  let average = mean / buddypond.recentResponseTimes.length;
  return Math.floor(average) + 'ms';
}

buddypond.lastResponseTime = function averageResponseTime() {
  let perf = buddypond.recentResponseTimes[buddypond.recentResponseTimes.length - 1];
  let elapsed = perf.end.getTime() - perf.start.getTime();
  return elapsed + 'ms';
}

buddypond.logout = function logout() {
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