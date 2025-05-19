import createWebSocketClient from './createWebSocketClient.js';

export default class Client {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.config = {
      host: "",
      api: "",
    };

    this.api = buddypond;

    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 999999; // Set to a high number for unlimited attempts
    this.maxBackoffDelay = 10000; // 10 seconds
    this.isIntentionallyClosed = false; // Flag to track intentional closure

    return this;
  }
}

Client.prototype.connect = async function connectBuddyListWs() {
  console.log("Connecting to BuddyList WebSocket...");
  let wsClient = await this.createWebSocketClient();
  console.log("Connected to BuddyList WebSocket:", wsClient);
  // TODO: needs to return / await the connection event
  // TODO: should emit buddylist::connected event ( not auth::qtokenid event )
  this.bp.emit('buddylist::connected', wsClient);
}

Client.prototype.disconnect = async function disconnectBuddyListWs() {
  console.log("Disconnecting from BuddyList WebSocket...");
}

Client.prototype.addBuddy = async function addBuddy(buddyname, cb) {
  console.log("NEW Calling addBuddy", this, buddyname);

  apiRequest('/buddylist/' + this.bp.me + '/add-buddy', 'POST', {
    buddyname: buddyname
  }, function (err, data) {
    cb(err, data);
  })
}

Client.prototype.receivedInstantMessage = async function receivedInstantMessage(buddyName, cb) {
  console.log("NEW Calling receivedInstantMessage", this, buddyName);

  apiRequest('/buddylist/' + this.bp.me + '/receivedInstantMessage', 'POST', {
    buddyname: buddyName,
    newMessages: false,
  }, function (err, data) {
    cb(err, data);
  })
}

Client.prototype.setStatus = async function setStatus(buddyName, update, cb) {
  console.log("NEW Calling setStatus", buddyName, update);

  apiRequest('/buddylist/' + buddyName + '/setStatus', 'POST', {
    buddyname: buddyName,
    status: update.status,
    profilePicture: update.profilePicture,
  }, function (err, data) {
    cb(err, data);
  })
};


/*

buddypond.setStatus = function setStatus(buddyName, update, cb) {
  // TODO: status becomes profile object with profile.status and profile.profilePicture
  // apiRequest('/messages/buddy/' + buddyName, 'POST', {
  buddypond.status = status;
  apiRequest('/buddylist/' + buddyName + '/setStatus', 'POST', {
    buddyname: buddyName, // should this be bp.me?, prob not for admin actions
    status: update.status,
    profilePicture: update.profilePicture,
  }, function (err, data) {
    cb(err, data);
  })
}
*/



Client.prototype.createWebSocketClient = createWebSocketClient;


function apiRequest(uri, method, data, cb) {
  let url;

  url = 'http://192.168.200.59:8787' + '/api/v6' + uri;

  console.log("making apiRequest", url, method, data);

  let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8"
  };

  if (buddypond.qtokenid) {
    headers["Authorization"] = `Bearer ${buddypond.qtokenid}`; // ✅ Use Authorization header
  }

  let body = method === "POST" ? JSON.stringify(data) : undefined;

  // Prepare fetch options
  const options = {
    method: method,
    headers: headers,
    body: body,
    // credentials: "include",  // ✅ Allow CORS with cookies/auth headers
  };

  // Handling fetch timeout manually
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

  buddypond.incrementPackets("packetsSent");
  let perf = { start: new Date() };
  console.log("apiRequest", url, options);
  fetch(url, { ...options, signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        // Parse JSON for non-2xx responses
        return response.json().then(errorData => {
          // Create a custom error with status and JSON data
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          error.data = errorData; // Attach JSON payload
          throw error;
        });
      }
      return response.json();
    })
    .then(data => {
      buddypond.incrementPackets("packetsReceived");
      perf.end = new Date();
      buddypond.addPerfTime(perf);
      cb(null, data);
    })
    .catch(error => {
      let msg = "Fetch connection error. Retrying shortly.";
      if (error.name === "AbortError") {
        msg = "Fetch request timeout";
      } else if (error.message.includes("Payload Too Large")) {
        msg = "File upload was too large. Try a smaller file.";
      } else if (error.status === 400 && error.data) {
        // Use the JSON payload from the 400 error
        msg = error.data.error || error.data.message || "Invalid input. Please try again.";
      } else {
        msg = error.message;
      }
      console.error("❌ API Request Failed:", error);
      cb(new Error(msg), error.data || null);
    });
}