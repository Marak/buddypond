desktop.app.notifications = {};
desktop.app.notifications.label = "Notifications";
desktop.app.notifications.browserHasPermission = false;
desktop.app.notifications.emitToDesktop = false;

desktop.app.notifications.load = function loadnotificationsGames (params, cb) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications");
  }
  cb(null, true);
};

desktop.app.notifications.notifyBuddy = function notifyBuddy (text) {
  text = text || "default message senpai";

  if (desktop.settings.notifications_audio_enabled) {
    desktop.play('IM.wav')
  }

  if (desktop.settings.notifications_web_enabled) {
    // Remark: Only show web notifications if window is hidden
    if (document.visibilityState === 'hidden') {
      let notification = new Notification(text);
    }
  }

}

desktop.app.notifications.openWindow = function openWindow () {
};

desktop.app.notifications.closeWindow = function closeWindow () {
};

/*

if (typeof Notification !== 'undefined') {
  alert('Please us a modern version of Chrome, Firefox, Opera or Safari.');
  return;
}

Notification.requestPermission(function (permission) {
  if (permission !== 'granted') return;

  var notification = new Notification('Here is the title', {
    icon: 'http://path.to/my/icon.png',
    body: 'Some body text',
  });

  notification.onclick = function () {
    window.focus();
  };
});
*/