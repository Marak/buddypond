desktop.localstorage = {};
desktop.localstorage.label = "localstorage";

desktop.localstorage.prefix = '_buddypond_desktop_';

desktop.localstorage.set = function setLocalStorage (key, val) {
  // in addition to updating the localstorage, update desktop.settings
  // Remark: desktop.settings is booted from localstorage on load
  desktop.settings[key] = val;
  val = JSON.stringify(val);
  localStorage.setItem(desktop.localstorage.prefix + key, val);
}

desktop.localstorage.get = function getLocalStorage (key) {
  let parsed;
  let data = localStorage.getItem(desktop.localstorage.prefix + key);
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    alert('Error parsing localstorage JSON. Did you store bad JSON?');
  }
  return parsed;
}

desktop.localstorage.removeItem = function removeLocalStorage (key) {
  localStorage.removeItem(desktop.localstorage.prefix + key);
}

desktop.getDesktopIconPositions = function getDesktopIconPositions () {
  let elements = [];
  $('a.icon').each(function(i, item){
    let el = {};
    // TODO: unique IDs might be required for syncing window position
    // el.id = $(this).attr('id');
    el.href = $(this).attr('href');
    el.left = $(item).css('left');
    el.right = $(item).css('right');
    el.top = $(item).css('top');
    elements.push(el);
  });
  desktop.localstorage.set('desktop_icon_positions', elements);
}
desktop.setDesktopIconPositions = function getDesktopIconPositions () {
  let elements = desktop.settings.desktop_icon_positions || [];
  elements.forEach(function(el){
    let _el = $(`a.icon[href=${el.href}]`)
    _el.css('left', el.left);
    _el.css('right', el.right);
    _el.css('top', el.top);
  });
}

desktop.localstorage.load = function loadLocalStorage () {
  // boot all localstorage data into local settings
  for (var key in localStorage){
    if (key.search(desktop.localstorage.prefix) !== -1) {
      let param = key.replace(desktop.localstorage.prefix, '');
      try {
        desktop.settings[param] = JSON.parse(localStorage[key]);
      } catch (err) {
        desktop.settings[param] = localStorage[key];
      }
    }
  }

  // Remark: Here we can add defaults for required local storage desktop.settings
  if (typeof desktop.settings.notifications_audio_enabled === 'undefined') {
    desktop.settings.notifications_audio_enabled = true;
  }

  desktop.setDesktopIconPositions();

  return true;
};
