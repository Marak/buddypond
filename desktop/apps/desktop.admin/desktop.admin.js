desktop.app.admin = {}; // since localStorage is loaded first and already populated desktop.admin scope
desktop.app.admin.icon = "folder";
desktop.app.admin.label = 'admin';

desktop.app.admin.load = function loadadmin (params, next) {

  desktop.load.remoteAssets([
    'admin' // this loads the sibling desktop.admin.html file into <div id="window_admin"></div>
  ], function (err) {

    $('#window_admin').css('width', '36vw');
    $('#window_admin').css('height', '77vh');
    $('#window_admin').css('top', '9vh');
    $('#window_admin').css('left', '3vw');


    desktop.on('desktop.settings', 'update-admin-form', function () {
      desktop.app.admin.renderAlladminForm($('.desktopadminTable tbody'));
    });

    // desktop.ui.setDesktopIconPositions();

    desktop.app.admin.renderAlladminForm($('.desktopadminTable tbody'));

    function saveadmin () {
      // serialize form and apply each setting to localstorage
      // this will also set the desktop.admin scope
      let updated = {};
      for (let key in desktop.admin) {
        let val = desktop.admin[key];
        let formVal = $('#' + desktop.app.localstorage.prefix + key).val();
        try {
          updated[key] = JSON.parse(formVal);
        } catch (err) {
          updated[key] = formVal;
        }
      }
      desktop.set(updated);
    }

 
    $('#adminTabs').tabs({
      activate: function (event ,ui) {
        if (ui.newTab.index() === 0) {
          /*
            setTimeout(function(){
              $('.simpleColorDisplay').trigger('click');
            }, 1); // move to next tick, could also be zero ( unsure if browsers complain )
            */
        }
      }
    });

    next();
  });

};

// Remark: _ scope is used here since we assume all admin.* properties are actual admin 
//.          ( except admin.load, admin.openWindow, etc)
desktop.app.admin.renderAlladminForm = function renderDesktopadminForm (el) {
  $('.desktopadminTable tbody').html('');
  let keys = Object.keys(desktop.settings).sort();
  keys.forEach(function (key) {
    let val = desktop.settings[key];
    let actualKey = desktop.app.localstorage.prefix + key;
    
    if (typeof val === 'object') {
      //val = JSON.stringify(val, true, 2);
    } else {
      el.append(`
          <tr>
            <td>${key}:</td>
            <td><input name="${actualKey}" id="${actualKey}" type="text" value="${val}"/></td>
          </tr>
      `);
    }
  });

  $('.desktopadminTable').each(function () {
    // Add zebra striping, ala Mac OS X.
    $(this).find('tbody tr:odd').addClass('zebra');
  });

};

desktop.app.admin.openWindow = function openWindow () {
  // $('.simpleColorDisplay').trigger('click');
  return true;
};

desktop.app.admin.closeWindow = function closeWindow () {
  return true;
};