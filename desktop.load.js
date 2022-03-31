desktop.load = {};

desktop.load.remoteAssets = function loadRemoteAssets (assetArr, final) {

  // console.log('desktop.load.remoteAssets', assetArr)
  const assets = {
    script: [],
    css: [],
    appHTML: []
  };

  assetArr.forEach(function (asset) {

    if (asset.split('.').pop() === 'js') {
      assets.script.push(asset);
      return;
    }

    if (asset.split('.').pop() === 'css') {
      assets.css.push(asset);
      return;
    }

    // single word, for example: 'console' or 'profile'
    if (asset.split('.').length === 1) {
      assets.appHTML.push(asset);
      return;
    }

    // could not detect asset type by file extension, assume its a JS script tag
    // this style is used by youtube for iframe embeds
    assets.script.push(asset);

  });

  desktop.load.remoteJS(assets.script, function (err) {
    desktop.load.remoteCSS(assets.css, function (err) {
      desktop.load.remoteAppHtml(assets.appHTML[0], function (responseText, textStatus, jqXHR) {
        final(responseText, textStatus, jqXHR);
      });
    });
  });

};

// keep track of all external JS, CSS, and HTML files that have been pulled in
desktop.loaded = {};
desktop.loaded.scripts = [];
desktop.loaded.css = [];
desktop.loaded.appsHTML = {};

/*
  desktop.load.remoteAppHtml() takes in an appName and constructs a uri from appName
  the uri is then loaded with jQuery.load()
  the results of this jQuery.load() are injected into a hidden shadow DOM and then appended into #desktop
  this is very useful for lazy loading App assets so that the main application load size
  does not grow as you install more Apps into the desktop
*/
desktop.load.remoteAppHtml = function loadRemoteAppHtml (appName, cb) {
  if (!appName) {
    return cb(null);
  }
  $('#shadowRender').append(`<div class="${appName}WindowHolder"></div>`);
  $(`.${appName}WindowHolder`).load(`desktop/apps/desktop.${appName}/desktop.${appName}.html`, function (responseText, textStatus, jqXHR) {
    const html = $(`.${appName}WindowHolder`).html();
    desktop.loaded.appsHTML[appName] = html;
    $('#desktop').append(html);
    $(`.${appName}WindowHolder`, '#shadowRender').remove();
    cb(responseText, textStatus, jqXHR);
  });
};

desktop.load.remoteJS = function loadRemoteJS (scriptsArr, final) {

  // filter out already injected scripts
  const existingScripts =  $('script');

  scriptsArr = scriptsArr.filter(function (script) {
    let scriptNeedsInjection = true;
    existingScripts.each(function (i, existingScript) {
      if (existingScript.src.search(script) !== -1) {
        scriptNeedsInjection = false;
        console.log('Notice: Ignoring duplicate script injection for ' + script);
      }
    });
    return scriptNeedsInjection;
  });

  const total = scriptsArr.length;
  let completed = 0;

  // if total is zero here, it means that all requested scripts have already been loaded and cached
  if (total === 0) {
    return final();
  }

  scriptsArr.forEach(function (scriptPath) {
    // before injecting this script into the document, lets check if its already injected
    // by doing this, we allow Apps to reinject the same deps multiple times without reloads
    const tag = document.createElement('script');
    tag.src = scriptPath;
    desktop.loaded.scripts.push(scriptPath);
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = function () {
      completed++;
      if (completed === total) {
        final();
      }
    };
  });

};

desktop.load.remoteCSS = function loadRemoteCSS (cssArr, final) {

  const total = cssArr.length;
  let completed = 0;

  // if total is zero here, it means that all requested scripts have already been loaded and cached
  if (total === 0) {
    return final();
  }
  cssArr.forEach(function (cssPath) {
    // before injecting this script into the document, lets check if its already injected
    // by doing this, we allow Apps to reinject the same deps multiple times without reloads
    const tag = document.createElement('link');
    tag.href = cssPath;
    tag.rel = 'stylesheet';
    desktop.loaded.css.push(cssPath);
    const firstLinkTag = document.getElementsByTagName('link')[0];
    firstLinkTag.parentNode.insertBefore(tag, firstLinkTag);
    tag.onload = function () {
      completed++;
      if (completed === total) {
        final();
      }
    };
  });
};