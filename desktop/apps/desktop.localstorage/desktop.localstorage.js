desktop.app.localstorage = {};
desktop.app.localstorage.label = "localstorage";

desktop.app.localstorage.prefix = '_buddypond_desktop_';

desktop.app.localstorage.set = function setLocalStorage (key, val) {
  // in addition to updating the localstorage, update desktop.settings
  // Remark: desktop.settings is booted from localstorage on load
  desktop.settings[key] = val;
  val = JSON.stringify(val);
  localStorage.setItem(desktop.app.localstorage.prefix + key, val);
}

desktop.app.localstorage.get = function getLocalStorage (key) {
  let parsed;
  let data = localStorage.getItem(desktop.app.localstorage.prefix + key);
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    alert('Error parsing localstorage JSON. Did you store bad JSON?');
  }
  return parsed;
}

desktop.app.localstorage.removeItem = function removeLocalStorage (key) {
  localStorage.removeItem(desktop.app.localstorage.prefix + key);
}

desktop.app.localstorage.load = function loadLocalStorage () {
  // boot all localstorage data into local settings
  for (var key in localStorage){
    if (key.search(desktop.app.localstorage.prefix) !== -1) {
      let param = key.replace(desktop.app.localstorage.prefix, '');
      try {
        desktop.settings[param] = JSON.parse(localStorage[key]);
      } catch (err) {
        desktop.settings[param] = localStorage[key];
      }
    }
  }

  return true;
};
