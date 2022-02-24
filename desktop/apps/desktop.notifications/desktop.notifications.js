desktop.notifications = {};
desktop.notifications.label = "Notifications";
desktop.notifications.browserHasPermission = false;
desktop.notifications.emitToDesktop = false;

desktop.notifications.load = function loadnotificationsGames () {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications");
  }
  return true;
};

desktop.notifications.notifyBuddy = function notifyBuddy (text) {
  text = text || "default message senpai";

  if (desktop.settings.notifications_audio_enabled) {
    var audio = new Audio('desktop/assets/audio/IM.wav');
    audio.play();
  }

  if (desktop.settings.notifications_web_enabled) {
    let notification = new Notification(text);
  }

}

desktop.notifications.openWindow = function openWindow () {
};

desktop.notifications.closeWindow = function closeWindow () {
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