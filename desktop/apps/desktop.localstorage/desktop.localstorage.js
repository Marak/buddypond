desktop.app.localstorage = {};
desktop.app.localstorage.icon = 'folder';
desktop.app.localstorage.label = 'localstorage';

desktop.app.localstorage.prefix = '_buddypond_desktop_';

desktop.app.localstorage.set = function setLocalStorage (key, val) {
  // in addition to updating the localstorage, update desktop.settings
  // Remark: desktop.settings is booted from localstorage on load
  
  if (typeof key === 'object') {
    // batch update with multple key / values
    const obj = key;
    for (const k in obj) {
      // TODO: check previous prop and only emit event if prop has actually changed
      desktop.settings[k] = obj[k];
      const val = JSON.stringify(obj[k]);
      localStorage.setItem(desktop.app.localstorage.prefix + k, val);
      desktop.emit('desktop.settings.' + k, desktop.settings[k]);
    }
  } else {
    // single key / value update
    desktop.settings[key] = val;
    val = JSON.stringify(val);
    localStorage.setItem(desktop.app.localstorage.prefix + key, val);
    desktop.emit('desktop.settings.' + key, desktop.settings[key]);
  }

  desktop.emit('desktop.settings', desktop.settings);

};

desktop.app.localstorage.get = function getLocalStorage (key) {
  let parsed;
  const data = localStorage.getItem(desktop.app.localstorage.prefix + key);
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    alert('Error parsing localstorage JSON. Did you store bad JSON?');
  }
  return parsed;
};

desktop.app.localstorage.removeItem = function removeLocalStorage (key) {
  localStorage.removeItem(desktop.app.localstorage.prefix + key);
};

desktop.app.localstorage.sync = function syncSettings () {
  // syncs all data from localStorage into `desktop.settings`
  // attempts to JSON.parse() each localStorage value if possible
  for (const key in localStorage) {
    if (key.search(desktop.app.localstorage.prefix) !== -1) {
      const param = key.replace(desktop.app.localstorage.prefix, '');
      try {
        desktop.settings[param] = JSON.parse(localStorage[key]);
      } catch (err) {
        desktop.settings[param] = localStorage[key];
      }
    }
  }
};

desktop.app.localstorage.load = function loadLocalStorage (param, next) {
  desktop.app.localstorage.sync();
  next();
};

// map and export helper methods to to level desktop object
desktop.set = desktop.app.localstorage.set;
desktop.get = desktop.app.localstorage.get;
desktop.removeItem = desktop.app.localstorage.removeItem;