(function () {
  'use strict';

  let _WINDOW = {};
  let _DOCUMENT = {};
  try {
    if (typeof window !== 'undefined') _WINDOW = window;
    if (typeof document !== 'undefined') _DOCUMENT = document;
  } catch (e) {}
  const {
    userAgent = ''
  } = _WINDOW.navigator || {};
  const WINDOW = _WINDOW;
  const DOCUMENT = _DOCUMENT;
  const IS_BROWSER = !!WINDOW.document;
  const IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
  const IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }

  var S = {
      classic: {
        fa: "solid",
        fas: "solid",
        "fa-solid": "solid",
        far: "regular",
        "fa-regular": "regular",
        fal: "light",
        "fa-light": "light",
        fat: "thin",
        "fa-thin": "thin",
        fab: "brands",
        "fa-brands": "brands"
      },
      duotone: {
        fa: "solid",
        fad: "solid",
        "fa-solid": "solid",
        "fa-duotone": "solid",
        fadr: "regular",
        "fa-regular": "regular",
        fadl: "light",
        "fa-light": "light",
        fadt: "thin",
        "fa-thin": "thin"
      },
      sharp: {
        fa: "solid",
        fass: "solid",
        "fa-solid": "solid",
        fasr: "regular",
        "fa-regular": "regular",
        fasl: "light",
        "fa-light": "light",
        fast: "thin",
        "fa-thin": "thin"
      },
      "sharp-duotone": {
        fa: "solid",
        fasds: "solid",
        "fa-solid": "solid",
        fasdr: "regular",
        "fa-regular": "regular",
        fasdl: "light",
        "fa-light": "light",
        fasdt: "thin",
        "fa-thin": "thin"
      }
    };
  var s = "classic";
  var G = {
      classic: {
        900: "fas",
        400: "far",
        normal: "far",
        300: "fal",
        100: "fat"
      },
      duotone: {
        900: "fad",
        400: "fadr",
        300: "fadl",
        100: "fadt"
      },
      sharp: {
        900: "fass",
        400: "fasr",
        300: "fasl",
        100: "fast"
      },
      "sharp-duotone": {
        900: "fasds",
        400: "fasdr",
        300: "fasdl",
        100: "fasdt"
      }
    };
  var xt = {
      classic: {
        solid: "fas",
        regular: "far",
        light: "fal",
        thin: "fat",
        brands: "fab"
      },
      duotone: {
        solid: "fad",
        regular: "fadr",
        light: "fadl",
        thin: "fadt"
      },
      sharp: {
        solid: "fass",
        regular: "fasr",
        light: "fasl",
        thin: "fast"
      },
      "sharp-duotone": {
        solid: "fasds",
        regular: "fasdr",
        light: "fasdl",
        thin: "fasdt"
      }
    };
  var St = {
      kit: {
        fak: "kit",
        "fa-kit": "kit"
      },
      "kit-duotone": {
        fakd: "kit-duotone",
        "fa-kit-duotone": "kit-duotone"
      }
    };
  var Ct = {
    kit: {
      "fa-kit": "fak"
    },
    "kit-duotone": {
      "fa-kit-duotone": "fakd"
    }
  };
  var Wt = {
      kit: {
        fak: "fa-kit"
      },
      "kit-duotone": {
        fakd: "fa-kit-duotone"
      }
    };
  var Et = {
      kit: {
        kit: "fak"
      },
      "kit-duotone": {
        "kit-duotone": "fakd"
      }
    };

  var ua = {
      classic: {
        "fa-brands": "fab",
        "fa-duotone": "fad",
        "fa-light": "fal",
        "fa-regular": "far",
        "fa-solid": "fas",
        "fa-thin": "fat"
      },
      duotone: {
        "fa-regular": "fadr",
        "fa-light": "fadl",
        "fa-thin": "fadt"
      },
      sharp: {
        "fa-solid": "fass",
        "fa-regular": "fasr",
        "fa-light": "fasl",
        "fa-thin": "fast"
      },
      "sharp-duotone": {
        "fa-solid": "fasds",
        "fa-regular": "fasdr",
        "fa-light": "fasdl",
        "fa-thin": "fasdt"
      }
    },
    ga = {
      classic: {
        fab: "fa-brands",
        fad: "fa-duotone",
        fal: "fa-light",
        far: "fa-regular",
        fas: "fa-solid",
        fat: "fa-thin"
      },
      duotone: {
        fadr: "fa-regular",
        fadl: "fa-light",
        fadt: "fa-thin"
      },
      sharp: {
        fass: "fa-solid",
        fasr: "fa-regular",
        fasl: "fa-light",
        fast: "fa-thin"
      },
      "sharp-duotone": {
        fasds: "fa-solid",
        fasdr: "fa-regular",
        fasdl: "fa-light",
        fasdt: "fa-thin"
      }
    };

  const NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
  const PRODUCTION = (() => {
    try {
      return "production" === 'production';
    } catch (e$$1) {
      return false;
    }
  })();
  function familyProxy(obj) {
    // Defaults to the classic family if family is not available
    return new Proxy(obj, {
      get(target, prop) {
        return prop in target ? target[prop] : target[s];
      }
    });
  }
  const _PREFIX_TO_STYLE = _objectSpread2({}, S);

  // We changed FACSSClassesToStyleId in the icons repo to be canonical and as such, "classic" family does not have any
  // duotone styles.  But we do still need duotone in _PREFIX_TO_STYLE below, so we are manually adding
  // {'fa-duotone': 'duotone'}
  _PREFIX_TO_STYLE[s] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, {
    'fa-duotone': 'duotone'
  }), S[s]), St['kit']), St['kit-duotone']);
  const PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
  const _STYLE_TO_PREFIX = _objectSpread2({}, xt);

  // We changed FAStyleIdToShortPrefixId in the icons repo to be canonical and as such, "classic" family does not have any
  // duotone styles.  But we do still need duotone in _STYLE_TO_PREFIX below, so we are manually adding {duotone: 'fad'}
  _STYLE_TO_PREFIX[s] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, {
    duotone: 'fad'
  }), _STYLE_TO_PREFIX[s]), Et['kit']), Et['kit-duotone']);
  const STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
  const _PREFIX_TO_LONG_STYLE = _objectSpread2({}, ga);
  _PREFIX_TO_LONG_STYLE[s] = _objectSpread2(_objectSpread2({}, _PREFIX_TO_LONG_STYLE[s]), Wt['kit']);
  const PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
  const _LONG_STYLE_TO_PREFIX = _objectSpread2({}, ua);
  _LONG_STYLE_TO_PREFIX[s] = _objectSpread2(_objectSpread2({}, _LONG_STYLE_TO_PREFIX[s]), Ct['kit']);
  const LONG_STYLE_TO_PREFIX = familyProxy(_LONG_STYLE_TO_PREFIX);
  const _FONT_WEIGHT_TO_PREFIX = _objectSpread2({}, G);
  const FONT_WEIGHT_TO_PREFIX = familyProxy(_FONT_WEIGHT_TO_PREFIX);

  function bunker(fn) {
    try {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      fn(...args);
    } catch (e) {
      if (!PRODUCTION) {
        throw e;
      }
    }
  }

  const w = WINDOW || {};
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w[NAMESPACE_IDENTIFIER];

  function normalizeIcons(icons) {
    return Object.keys(icons).reduce((acc, iconName) => {
      const icon = icons[iconName];
      const expanded = !!icon.icon;
      if (expanded) {
        acc[icon.iconName] = icon.icon;
      } else {
        acc[iconName] = icon;
      }
      return acc;
    }, {});
  }
  function defineIcons(prefix, icons) {
    let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      skipHooks = false
    } = params;
    const normalized = normalizeIcons(icons);
    if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
      namespace.hooks.addPack(prefix, normalizeIcons(icons));
    } else {
      namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
    }

    /**
     * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
     * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
     * for `fas` so we'll ease the upgrade process for our users by automatically defining
     * this as well.
     */
    if (prefix === 'fas') {
      defineIcons('fa', icons);
    }
  }

  var icons = {
    
    "album-collection": [512,512,[],"f8a0",["M.4 214l32 256c3 24 23.4 42 47.6 42l352 0c24.2 0 44.6-18 47.6-42l32-256c.2-2 .4-4 .4-6c0-11.6-4.2-22.9-12-31.8c-9.1-10.3-22.2-16.2-36-16.2L48 160c-13.8 0-26.9 5.9-36 16.2S-1.3 200.3 .4 214zM72 344c0-75.1 82.4-136 184-136s184 60.9 184 136s-82.4 136-184 136S72 419.1 72 344z","M32 24c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L56 0C42.7 0 32 10.7 32 24zM256 480c101.6 0 184-60.9 184-136s-82.4-136-184-136S72 268.9 72 344s82.4 136 184 136zm0-104c-17.7 0-32-10.7-32-24s14.3-24 32-24s32 10.7 32 24s-14.3 24-32 24zM40 80c-13.3 0-24 10.7-24 24s10.7 24 24 24l432 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L40 80z"]],
    "border-center-v": [448,512,[],"f89d",["M0 64a32 32 0 1 0 64 0A32 32 0 1 0 0 64zm0 96a32 32 0 1 0 64 0A32 32 0 1 0 0 160zm0 96a32 32 0 1 0 64 0A32 32 0 1 0 0 256zm0 96a32 32 0 1 0 64 0A32 32 0 1 0 0 352zm0 96a32 32 0 1 0 64 0A32 32 0 1 0 0 448zM96 64a32 32 0 1 0 64 0A32 32 0 1 0 96 64zm0 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM288 64a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM384 64a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0z","M224 480c-17.7 0-32-14.3-32-32l0-384c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32z"]],
    "cassette-tape": [576,512,["128429"],"f8ab",["M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-28.9 0-36.3-96.9c-7-18.7-24.9-31.1-44.9-31.1l-227.6 0c-20 0-37.9 12.4-44.9 31.1L92.9 480 64 480c-35.3 0-64-28.7-64-64L0 96zM80 208c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80s-35.8-80-80-80l-256 0c-44.2 0-80 35.8-80 80zm47.1 272l32.1-85.6c2.3-6.2 8.3-10.4 15-10.4l227.6 0c6.7 0 12.6 4.1 15 10.4L448.9 480l-321.8 0z","M240 208c0 11.4-2.4 22.2-6.7 32l109.3 0c-4.3-9.8-6.7-20.6-6.7-32s2.4-22.2 6.7-32l-109.3 0c4.3 9.8 6.7 20.6 6.7 32zm176 80l-256 0c-44.2 0-80-35.8-80-80s35.8-80 80-80l256 0c44.2 0 80 35.8 80 80s-35.8 80-80 80zM160 224a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm272-16a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"]],
    "folder-music": [512,512,[],"e18d",["M0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L288 96c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32L64 32C28.7 32 0 60.7 0 96zM128 384c0-17.7 21.5-32 48-32c5.6 0 11 .6 16 1.8l0-81.8 0-32c0-6.7 4.1-12.6 10.4-15l128-48c4.9-1.8 10.4-1.2 14.7 1.8s6.9 7.9 6.9 13.2l0 32 0 128c0 17.7-21.5 32-48 32s-48-14.3-48-32s21.5-32 48-32c5.6 0 11 .6 16 1.8l0-74.7-96 36L224 384c0 17.7-21.5 32-48 32s-48-14.3-48-32z","M345.1 178.8c4.3 3 6.9 7.9 6.9 13.2l0 32 0 128c0 17.7-21.5 32-48 32s-48-14.3-48-32s21.5-32 48-32c5.6 0 11 .6 16 1.8l0-74.7-96 36L224 384c0 17.7-21.5 32-48 32s-48-14.3-48-32s21.5-32 48-32c5.6 0 11 .6 16 1.8l0-81.8 0-32c0-6.7 4.1-12.6 10.4-15l128-48c4.9-1.8 10.4-1.2 14.7 1.8z"]],
    "frog": [576,512,[],"f52e",["M0 416c0 35.3 28.7 64 64 64l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-90.2 0 37.1-37.1c3.4-3.4 6.4-7.1 9-10.9c18.7-28 15.7-66.2-9-90.9c-24.6-24.6-62.6-27.7-90.5-9.2c-4 2.6-7.8 5.7-11.3 9.2c-.2 .2-.2 .2-.3 .3L123 347.6c-6.4 6.1-16.5 5.8-22.6-.6s-5.8-16.5 .6-22.6l73.6-70.1c40.6-40.5 106.4-40.4 146.9 .1c28.6 28.6 37.1 69.7 25.4 105.7L457.4 470.6c6 6 14.1 9.4 22.6 9.4l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-50.7 0-92.5-92.5 144.5-82.1c18.9-10.8 30.7-30.9 30.7-52.7c0-26.6-17.3-50.1-42.8-57.9l-85.6-26.3c.2 2.5 .3 5 .3 7.5c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-1.2 0-2.5 .1-3.7s.1-2.5 .3-3.7c.2-2.4 .6-4.8 1-7.2C127 112.9 0 249.6 0 416z","M368 192a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-104a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]],
    "gamepad-modern": [640,512,["63676","127918","gamepad-alt"],"e5a2",["M0 369.4c0-6.3 .5-12.5 1.6-18.7L34.3 159.8c8.6-50.2 40.9-93.2 90.3-105.5C170.5 42.9 236.2 32 320 32s149.5 10.9 195.3 22.3c49.4 12.3 81.7 55.3 90.3 105.5l32.7 190.9c1.1 6.2 1.6 12.4 1.6 18.7l0 2.8C640 431.7 591.7 480 532.2 480c-49.5 0-92.6-33.7-104.6-81.7L424 384l-208 0-3.6 14.3c-12 48-55.1 81.7-104.6 81.7C48.3 480 0 431.7 0 372.2l0-2.8zM112 224c0 13.3 10.7 24 24 24l32 0 0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 32 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-32 0 0-32c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 32-32 0c-13.3 0-24 10.7-24 24zm280 48a40 40 0 1 0 80 0 40 40 0 1 0 -80 0zm64-96a40 40 0 1 0 80 0 40 40 0 1 0 -80 0z","M192 144c13.3 0 24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32c0-13.3 10.7-24 24-24z"]],
    "head-side-gear": [512,512,[],"e611",["M0 224.2c0 49.9 16.6 98.2 46.9 137.3c10.2 13.2 17.1 29 17.1 45.8L64 480c0 17.7 14.3 32 32 32l192 0c17.7 0 32-14.3 32-32l0-32 64 0c35.3 0 64-28.7 64-64l0-64 20.2 0c24.2 0 43.8-19.6 43.8-43.8c0-10-3.4-19.6-9.6-27.4l-42-52.6c-8.3-10.3-12.8-23-15.1-36C429.2 69.3 343.2 0 248 0L224 0C100.2 0 0 100.6 0 224.2zM104.5 178c2.1-5.5 4.6-10.8 7.4-15.9l2.3-3.9c3.1-5.1 6.5-10 10.2-14.6c4.6-5.7 12.7-6.7 19-3l2.9 1.7c9.2 5.3 20.4 4 29.6-1.3s16.1-14.5 16.1-25.1l0-3.4c0-7.3 4.9-13.8 12.1-14.9c6.5-1 13.1-1.5 19.9-1.5s13.4 .5 19.9 1.5c7.2 1.1 12.1 7.6 12.1 14.9l0 3.4c0 10.6 6.9 19.8 16.1 25.1s20.4 6.6 29.6 1.3l2.9-1.7c6.3-3.6 14.4-2.6 19 3c3.7 4.6 7.1 9.5 10.2 14.5l2.3 4c2.8 5.1 5.3 10.4 7.4 15.9c2.6 6.8-.5 14.3-6.8 18l-3 1.7c-9.2 5.3-13.7 15.8-13.7 26.4s4.5 21.1 13.7 26.4l3 1.7c4.8 2.8 7.8 7.8 7.8 13c0 1.7-.3 3.3-.9 5c-2.1 5.5-4.6 10.7-7.4 15.8l-2.4 4.2c-3 5.1-6.4 9.9-10.1 14.5c-4.6 5.7-12.7 6.7-19 3l-2.9-1.7c-9.2-5.3-20.4-4-29.6 1.3s-16.1 14.5-16.1 25.1l0 3.4c0 7.3-4.9 13.8-12.1 14.9c-6.5 1-13.1 1.5-19.9 1.5s-13.4-.5-19.9-1.5c-7.2-1.1-12.1-7.6-12.1-14.9l0-3.4c0-10.6-6.9-19.8-16.1-25.1s-20.4-6.6-29.6-1.3l-2.9 1.7c-6.3 3.6-14.4 2.6-19-3c-3.7-4.6-7.1-9.4-10.1-14.5l-2.4-4.1c-2.8-5.1-5.3-10.4-7.4-15.8c-2.6-6.8 .5-14.3 6.8-18l3-1.7c9.2-5.3 13.7-15.8 13.7-26.4s-4.5-21.1-13.7-26.4l-2.9-1.7c-6.3-3.6-9.5-11.1-6.8-18z","M343.5 178c2.6 6.8-.5 14.3-6.8 18l-3 1.7c-9.2 5.3-13.7 15.8-13.7 26.4s4.5 21.1 13.7 26.4l3 1.7c6.3 3.6 9.5 11.1 6.8 18c-2.1 5.5-4.6 10.7-7.4 15.8l-2.4 4.2c-3 5.1-6.4 9.9-10.1 14.5c-4.6 5.7-12.7 6.7-19 3l-2.9-1.7c-9.2-5.3-20.4-4-29.6 1.3s-16.1 14.5-16.1 25.1l0 3.4c0 7.3-4.9 13.8-12.1 14.9c-6.5 1-13.1 1.5-19.9 1.5s-13.4-.5-19.9-1.5c-7.2-1.1-12.1-7.6-12.1-14.9l0-3.4c0-10.6-6.9-19.8-16.1-25.1s-20.4-6.6-29.6-1.3l-2.9 1.7c-6.3 3.6-14.4 2.6-19-3c-3.7-4.6-7.1-9.4-10.1-14.5l-2.4-4.1c-2.8-5.1-5.3-10.4-7.4-15.8c-2.6-6.8 .5-14.3 6.8-18l3-1.7c9.2-5.3 13.7-15.8 13.7-26.4s-4.5-21.1-13.7-26.4l-2.9-1.7c-6.3-3.6-9.5-11.1-6.8-18c2.1-5.5 4.6-10.8 7.4-15.9l2.3-3.9c3.1-5.1 6.5-10 10.2-14.6c4.6-5.7 12.7-6.7 19-3l2.9 1.7c9.2 5.3 20.4 4 29.6-1.3s16.1-14.5 16.1-25.1l0-3.4c0-7.3 4.9-13.8 12.1-14.9c6.5-1 13.1-1.5 19.9-1.5s13.4 .5 19.9 1.5c7.2 1.1 12.1 7.6 12.1 14.9l0 3.4c0 10.6 6.9 19.8 16.1 25.1s20.4 6.6 29.6 1.3l2.9-1.7c6.3-3.6 14.4-2.6 19 3c3.7 4.6 7.1 9.5 10.2 14.5l2.3 4c2.8 5.1 5.3 10.4 7.4 15.9zM224 264a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"]],
    "list-music": [512,512,[],"f8c9",["M0 96C0 78.3 14.3 64 32 64l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 224c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 256c-17.7 0-32-14.3-32-32zM0 352c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32z","M512 32c0-10.3-4.9-19.9-13.3-26s-19.1-7.7-28.8-4.4l-96 32C360.8 38 352 50.2 352 64l0 64 0 231.7c-14.5-4.9-30.8-7.7-48-7.7c-61.9 0-112 35.8-112 80s50.1 80 112 80s112-35.8 112-80l0-280.9 74.1-24.7C503.2 122 512 109.8 512 96l0-64z"]],
    "microphone-lines": [384,512,["127897","microphone-alt"],"f3c9",["M16 216l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24zM192 112c0 8.8 7.2 16 16 16l80 0 0-32-80 0c-8.8 0-16 7.2-16 16zm0 64c0 8.8 7.2 16 16 16l80 0 0-32-80 0c-8.8 0-16 7.2-16 16zm0 64c0 8.8 7.2 16 16 16l80 0 0-32-80 0c-8.8 0-16 7.2-16 16z","M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-32-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-32-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0c0-53-43-96-96-96z"]],
    "music": [512,512,["127925"],"f001",["M128 128l0 72 0 156.6c37.3 11 64 40.6 64 75.4l0-208.2L448 147l0 145.5c37.3 11 64 40.6 64 75.4l0-264 0-72c0-10.1-4.8-19.6-12.9-25.7C493.5 2.2 486.8 0 480 0c-3.1 0-6.2 .4-9.2 1.3l-320 96C137.3 101.4 128 113.9 128 128z","M416 448c53 0 96-35.8 96-80s-43-80-96-80s-96 35.8-96 80s43 80 96 80zM96 512c53 0 96-35.8 96-80s-43-80-96-80s-96 35.8-96 80s43 80 96 80z"]],
    "piano-keyboard": [576,512,["127929"],"f8d5",["M0 224l64 0 0 160 80 0 0-68.3c2.4 1.4 4.9 2.4 7.6 3.2c1.3 .4 2.7 .6 4.1 .8c.7 .1 1.4 .2 2.1 .2s1.4 .1 2.2 .1c5.8 0 11.3-1.6 16-4.3l0 68.3 96 0 0-68.3c2.4 1.4 4.9 2.4 7.6 3.2c1.3 .4 2.7 .6 4.1 .8c.7 .1 1.4 .2 2.1 .2s1.4 .1 2.2 .1c5.8 0 11.3-1.6 16-4.3l0 68.3 96 0 0-68.3c2.4 1.4 4.9 2.4 7.6 3.2c1.3 .4 2.7 .6 4.1 .8c.7 .1 1.4 .2 2.1 .2s1.4 .1 2.2 .1c5.8 0 11.3-1.6 16-4.3l0 68.3 80 0 0-160 64 0 0 160c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 224z","M64 64C28.7 64 0 92.7 0 128l0 96 128 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 128 0 0-96c0-35.3-28.7-64-64-64L64 64z"]],
    "play": [384,512,["9654"],"f04b",["","M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"]],
    "play-pause": [640,512,[],"e22f",["M384 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32zm128 0l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32z","M116.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S64 83.6 64 96l0 320c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4l192-160c7.3-6.1 11.5-15.1 11.5-24.6s-4.2-18.5-11.5-24.6l-192-160z"]],
    "qrcode": [448,512,[],"f029",["M0 80l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48L48 32C21.5 32 0 53.5 0 80zM0 336l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-96 0c-26.5 0-48 21.5-48 48zM64 96l64 0 0 64-64 0 0-64zm0 256l64 0 0 64-64 0 0-64zM256 80l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-96 0c-26.5 0-48 21.5-48 48zm64 16l64 0 0 64-64 0 0-64z","M256 464l0-160c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16l0 96c0 8.8-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm128 0a16 16 0 1 1 -32 0 16 16 0 1 1 32 0zm64 0a16 16 0 1 1 -32 0 16 16 0 1 1 32 0z"]],
    "stop": [384,512,["9209"],"f04d",["M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z",""]]

  };
  var prefixes = [null    ,'fad',
    ,'fa-duotone'
];
  bunker(() => {
    for (const prefix of prefixes) {
      if (!prefix) continue;
      defineIcons(prefix, icons);
    }
  });

}());