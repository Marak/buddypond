(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("butterchurn", [], factory);
	else if(typeof exports === 'object')
		exports["butterchurn"] = factory();
	else
		root["butterchurn"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ecma-proposal-math-extensions/reference-implementation/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/ecma-proposal-math-extensions/reference-implementation/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


{
  const defineMath = (name, assignment) => {
    var configurable = typeof assignment === "function" ? true : false;
    var writable = typeof assignment === "function" ? true : false;
    var enumerable = typeof assignment === "function" ? true : false;

    Object.defineProperty(Math, name, {
      configurable: configurable,
      enumerable: enumerable,
      writable: writable,
      value: assignment
    });
  };

  defineMath("DEG_PER_RAD", Math.PI / 180);
  defineMath("RAD_PER_DEG", 180 / Math.PI);

  const f32A = new Float32Array(1);

  defineMath("scale", function scale(x, inLow, inHigh, outLow, outHigh) {
    if (arguments.length === 0) {
      return NaN;
    }

    if (Number.isNaN(x) ||
        Number.isNaN(inLow) ||
        Number.isNaN(inHigh) ||
        Number.isNaN(outLow) ||
        Number.isNaN(outHigh)) {
      return NaN;
    }

    if (x === Infinity ||
        x === -Infinity) {
      return x;
    }

    return (x - inLow) * (outHigh - outLow) /
      (inHigh - inLow) + outLow;
  });

  defineMath("fscale", function fscale(x, inLow, inHigh, outLow, outHigh) {
    f32A[0] = Math.scale(x, inLow, inHigh, outLow, outHigh);
    return f32A[0];
  });

  defineMath("clamp", function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  });

  defineMath("radians", function radians(degrees) {
    return degrees * Math.DEG_PER_RAD;
  });

  defineMath("degrees", function degrees(radians) {
    return radians * Math.RAD_PER_DEG;
  });
}


/***/ }),

/***/ "./src/audio/audioLevels.js":
/*!**********************************!*\
  !*** ./src/audio/audioLevels.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AudioLevels; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioLevels =
/*#__PURE__*/
function () {
  function AudioLevels(audio) {
    _classCallCheck(this, AudioLevels);

    this.audio = audio;
    var sampleRate;

    if (this.audio.audioContext) {
      sampleRate = this.audio.audioContext.sampleRate;
    } else {
      sampleRate = 44100;
    }

    var bucketHz = sampleRate / this.audio.fftSize;
    var bassLow = Math.clamp(Math.round(20 / bucketHz) - 1, 0, this.audio.numSamps - 1);
    var bassHigh = Math.clamp(Math.round(320 / bucketHz) - 1, 0, this.audio.numSamps - 1);
    var midHigh = Math.clamp(Math.round(2800 / bucketHz) - 1, 0, this.audio.numSamps - 1);
    var trebHigh = Math.clamp(Math.round(11025 / bucketHz) - 1, 0, this.audio.numSamps - 1);
    this.starts = [bassLow, bassHigh, midHigh];
    this.stops = [bassHigh, midHigh, trebHigh];
    this.val = new Float32Array(3);
    this.imm = new Float32Array(3);
    this.att = new Float32Array(3);
    this.avg = new Float32Array(3);
    this.longAvg = new Float32Array(3);
    this.att.fill(1);
    this.avg.fill(1);
    this.longAvg.fill(1);
  }
  /* eslint-disable camelcase */


  _createClass(AudioLevels, [{
    key: "updateAudioLevels",
    value: function updateAudioLevels(fps, frame) {
      if (this.audio.freqArray.length > 0) {
        var effectiveFPS = fps;

        if (!AudioLevels.isFiniteNumber(effectiveFPS) || effectiveFPS < 15) {
          effectiveFPS = 15;
        } else if (effectiveFPS > 144) {
          effectiveFPS = 144;
        } // Clear for next loop


        this.imm.fill(0);

        for (var i = 0; i < 3; i++) {
          for (var j = this.starts[i]; j < this.stops[i]; j++) {
            this.imm[i] += this.audio.freqArray[j];
          }
        }

        for (var _i = 0; _i < 3; _i++) {
          var rate = void 0;

          if (this.imm[_i] > this.avg[_i]) {
            rate = 0.2;
          } else {
            rate = 0.5;
          }

          rate = AudioLevels.adjustRateToFPS(rate, 30.0, effectiveFPS);
          this.avg[_i] = this.avg[_i] * rate + this.imm[_i] * (1 - rate);

          if (frame < 50) {
            rate = 0.9;
          } else {
            rate = 0.992;
          }

          rate = AudioLevels.adjustRateToFPS(rate, 30.0, effectiveFPS);
          this.longAvg[_i] = this.longAvg[_i] * rate + this.imm[_i] * (1 - rate);

          if (this.longAvg[_i] < 0.001) {
            this.val[_i] = 1.0;
            this.att[_i] = 1.0;
          } else {
            this.val[_i] = this.imm[_i] / this.longAvg[_i];
            this.att[_i] = this.avg[_i] / this.longAvg[_i];
          }
        }
      }
    }
  }, {
    key: "bass",
    get: function get() {
      return this.val[0];
    }
  }, {
    key: "bass_att",
    get: function get() {
      return this.att[0];
    }
  }, {
    key: "mid",
    get: function get() {
      return this.val[1];
    }
  }, {
    key: "mid_att",
    get: function get() {
      return this.att[1];
    }
  }, {
    key: "treb",
    get: function get() {
      return this.val[2];
    }
  }, {
    key: "treb_att",
    get: function get() {
      return this.att[2];
    }
    /* eslint-enable camelcase */

  }], [{
    key: "isFiniteNumber",
    value: function isFiniteNumber(num) {
      return Number.isFinite(num) && !Number.isNaN(num);
    }
  }, {
    key: "adjustRateToFPS",
    value: function adjustRateToFPS(rate, baseFPS, FPS) {
      return Math.pow(rate, baseFPS / FPS);
    }
  }]);

  return AudioLevels;
}();



/***/ }),

/***/ "./src/audio/audioProcessor.js":
/*!*************************************!*\
  !*** ./src/audio/audioProcessor.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AudioProcessor; });
/* harmony import */ var _fft__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fft */ "./src/audio/fft.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var AudioProcessor =
/*#__PURE__*/
function () {
  function AudioProcessor(context) {
    _classCallCheck(this, AudioProcessor);

    this.numSamps = 512;
    this.fftSize = this.numSamps * 2;
    this.fft = new _fft__WEBPACK_IMPORTED_MODULE_0__["default"](this.fftSize, 512, true);

    if (context) {
      this.audioContext = context;
      this.audible = context.createDelay();
      this.analyser = context.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.0;
      this.analyser.fftSize = this.fftSize;
      this.audible.connect(this.analyser); // Split channels

      this.analyserL = context.createAnalyser();
      this.analyserL.smoothingTimeConstant = 0.0;
      this.analyserL.fftSize = this.fftSize;
      this.analyserR = context.createAnalyser();
      this.analyserR.smoothingTimeConstant = 0.0;
      this.analyserR.fftSize = this.fftSize;
      this.splitter = context.createChannelSplitter(2);
      this.audible.connect(this.splitter);
      this.splitter.connect(this.analyserL, 0);
      this.splitter.connect(this.analyserR, 1);
    } // Initialised once as typed arrays
    // Used for webaudio API raw (time domain) samples. 0 -> 255


    this.timeByteArray = new Uint8Array(this.fftSize);
    this.timeByteArrayL = new Uint8Array(this.fftSize);
    this.timeByteArrayR = new Uint8Array(this.fftSize); // Signed raw samples shifted to -128 -> 127

    this.timeArray = new Int8Array(this.fftSize);
    this.timeByteArraySignedL = new Int8Array(this.fftSize);
    this.timeByteArraySignedR = new Int8Array(this.fftSize); // Temporary array for smoothing

    this.tempTimeArrayL = new Int8Array(this.fftSize);
    this.tempTimeArrayR = new Int8Array(this.fftSize); // Undersampled from this.fftSize to this.numSamps

    this.timeArrayL = new Int8Array(this.numSamps);
    this.timeArrayR = new Int8Array(this.numSamps);
  }

  _createClass(AudioProcessor, [{
    key: "sampleAudio",
    value: function sampleAudio() {
      this.analyser.getByteTimeDomainData(this.timeByteArray);
      this.analyserL.getByteTimeDomainData(this.timeByteArrayL);
      this.analyserR.getByteTimeDomainData(this.timeByteArrayR);
      this.processAudio();
    }
  }, {
    key: "updateAudio",
    value: function updateAudio(timeByteArray, timeByteArrayL, timeByteArrayR) {
      this.timeByteArray.set(timeByteArray);
      this.timeByteArrayL.set(timeByteArrayL);
      this.timeByteArrayR.set(timeByteArrayR);
      this.processAudio();
    }
    /* eslint-disable no-bitwise */

  }, {
    key: "processAudio",
    value: function processAudio() {
      for (var i = 0, j = 0, lastIdx = 0; i < this.fftSize; i++) {
        // Shift Unsigned to Signed about 0
        this.timeArray[i] = this.timeByteArray[i] - 128;
        this.timeByteArraySignedL[i] = this.timeByteArrayL[i] - 128;
        this.timeByteArraySignedR[i] = this.timeByteArrayR[i] - 128;
        this.tempTimeArrayL[i] = 0.5 * (this.timeByteArraySignedL[i] + this.timeByteArraySignedL[lastIdx]);
        this.tempTimeArrayR[i] = 0.5 * (this.timeByteArraySignedR[i] + this.timeByteArraySignedR[lastIdx]); // Undersampled

        if (i % 2 === 0) {
          this.timeArrayL[j] = this.tempTimeArrayL[i];
          this.timeArrayR[j] = this.tempTimeArrayR[i];
          j += 1;
        }

        lastIdx = i;
      } // Use full width samples for the FFT


      this.freqArray = this.fft.timeToFrequencyDomain(this.timeArray);
      this.freqArrayL = this.fft.timeToFrequencyDomain(this.timeByteArraySignedL);
      this.freqArrayR = this.fft.timeToFrequencyDomain(this.timeByteArraySignedR);
    }
  }, {
    key: "connectAudio",
    value: function connectAudio(audionode) {
      audionode.connect(this.audible);
    }
  }, {
    key: "disconnectAudio",
    value: function disconnectAudio(audionode) {
      audionode.disconnect(this.audible);
    }
    /* eslint-enable no-bitwise */

  }]);

  return AudioProcessor;
}();



/***/ }),

/***/ "./src/audio/fft.js":
/*!**************************!*\
  !*** ./src/audio/fft.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FFT; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FFT =
/*#__PURE__*/
function () {
  function FFT(samplesIn, samplesOut) {
    var equalize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, FFT);

    this.samplesIn = samplesIn;
    this.samplesOut = samplesOut;
    this.equalize = equalize;
    this.NFREQ = samplesOut * 2;

    if (this.equalize) {
      this.initEqualizeTable();
    }

    this.initBitRevTable();
    this.initCosSinTable();
  }

  _createClass(FFT, [{
    key: "initEqualizeTable",
    value: function initEqualizeTable() {
      this.equalizeArr = new Float32Array(this.samplesOut);
      var invHalfNFREQ = 1.0 / this.samplesOut;

      for (var i = 0; i < this.samplesOut; i++) {
        this.equalizeArr[i] = -0.02 * Math.log((this.samplesOut - i) * invHalfNFREQ);
      }
    }
    /* eslint-disable no-bitwise */

  }, {
    key: "initBitRevTable",
    value: function initBitRevTable() {
      this.bitrevtable = new Uint16Array(this.NFREQ);

      for (var i = 0; i < this.NFREQ; i++) {
        this.bitrevtable[i] = i;
      }

      var j = 0;

      for (var _i = 0; _i < this.NFREQ; _i++) {
        if (j > _i) {
          var temp = this.bitrevtable[_i];
          this.bitrevtable[_i] = this.bitrevtable[j];
          this.bitrevtable[j] = temp;
        }

        var m = this.NFREQ >> 1;

        while (m >= 1 && j >= m) {
          j -= m;
          m >>= 1;
        }

        j += m;
      }
    }
  }, {
    key: "initCosSinTable",
    value: function initCosSinTable() {
      var dftsize = 2;
      var tabsize = 0;

      while (dftsize <= this.NFREQ) {
        tabsize += 1;
        dftsize <<= 1;
      }

      this.cossintable = [new Float32Array(tabsize), new Float32Array(tabsize)];
      dftsize = 2;
      var i = 0;

      while (dftsize <= this.NFREQ) {
        var theta = -2.0 * Math.PI / dftsize;
        this.cossintable[0][i] = Math.cos(theta);
        this.cossintable[1][i] = Math.sin(theta);
        i += 1;
        dftsize <<= 1;
      }
    }
  }, {
    key: "timeToFrequencyDomain",
    value: function timeToFrequencyDomain(waveDataIn) {
      var real = new Float32Array(this.NFREQ);
      var imag = new Float32Array(this.NFREQ);

      for (var i = 0; i < this.NFREQ; i++) {
        var idx = this.bitrevtable[i];

        if (idx < this.samplesIn) {
          real[i] = waveDataIn[idx];
        } else {
          real[i] = 0;
        }

        imag[i] = 0;
      }

      var dftsize = 2;
      var t = 0;

      while (dftsize <= this.NFREQ) {
        var wpr = this.cossintable[0][t];
        var wpi = this.cossintable[1][t];
        var wr = 1.0;
        var wi = 0.0;
        var hdftsize = dftsize >> 1;

        for (var m = 0; m < hdftsize; m++) {
          for (var _i2 = m; _i2 < this.NFREQ; _i2 += dftsize) {
            var j = _i2 + hdftsize;
            var tempr = wr * real[j] - wi * imag[j];
            var tempi = wr * imag[j] + wi * real[j];
            real[j] = real[_i2] - tempr;
            imag[j] = imag[_i2] - tempi;
            real[_i2] += tempr;
            imag[_i2] += tempi;
          }

          var wtemp = wr;
          wr = wtemp * wpr - wi * wpi;
          wi = wi * wpr + wtemp * wpi;
        }

        dftsize <<= 1;
        t += 1;
      }

      var spectralDataOut = new Float32Array(this.samplesOut);

      if (this.equalize) {
        for (var _i3 = 0; _i3 < this.samplesOut; _i3++) {
          spectralDataOut[_i3] = this.equalizeArr[_i3] * Math.sqrt(real[_i3] * real[_i3] + imag[_i3] * imag[_i3]);
        }
      } else {
        for (var _i4 = 0; _i4 < this.samplesOut; _i4++) {
          spectralDataOut[_i4] = Math.sqrt(real[_i4] * real[_i4] + imag[_i4] * imag[_i4]);
        }
      }

      return spectralDataOut;
    }
    /* eslint-enable no-bitwise */

  }]);

  return FFT;
}();



/***/ }),

/***/ "./src/blankPreset.js":
/*!****************************!*\
  !*** ./src/blankPreset.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  'use strict;';

  var pmap = {
    baseVals: {
      gammaadj: 1.25,
      wave_g: 0.5,
      mv_x: 12.0,
      warpscale: 1.0,
      brighten: 0.0,
      mv_y: 9.0,
      wave_scale: 1.0,
      echo_alpha: 0.0,
      additivewave: 0.0,
      sx: 1.0,
      sy: 1.0,
      warp: 0.01,
      red_blue: 0.0,
      wave_mode: 0.0,
      wave_brighten: 0.0,
      wrap: 0.0,
      zoomexp: 1.0,
      fshader: 0.0,
      wave_r: 0.5,
      echo_zoom: 1.0,
      wave_smoothing: 0.75,
      warpanimspeed: 1.0,
      wave_dots: 0.0,
      wave_x: 0.5,
      wave_y: 0.5,
      zoom: 1.0,
      solarize: 0.0,
      modwavealphabyvolume: 0.0,
      dx: 0.0,
      cx: 0.5,
      dy: 0.0,
      darken_center: 0.0,
      cy: 0.5,
      invert: 0.0,
      bmotionvectorson: 0.0,
      rot: 0.0,
      modwavealphaend: 0.95,
      wave_mystery: -0.2,
      decay: 0.9,
      wave_a: 1.0,
      wave_b: 0.5,
      rating: 5.0,
      modwavealphastart: 0.75,
      darken: 0.0,
      echo_orient: 0.0,
      ib_r: 0.5,
      ib_g: 0.5,
      ib_b: 0.5,
      ib_a: 0.0,
      ib_size: 0.0,
      ob_r: 0.5,
      ob_g: 0.5,
      ob_b: 0.5,
      ob_a: 0.0,
      ob_size: 0.0,
      mv_dx: 0.0,
      mv_dy: 0.0,
      mv_a: 0.0,
      mv_r: 0.5,
      mv_g: 0.5,
      mv_b: 0.5,
      mv_l: 0.0
    },
    init_eqs: function init_eqs() {
      var m = {};
      return m;
    },
    frame_eqs: function frame_eqs(m) {
      m.rkeys = ['warp'];
      m.zoom = 1.01 + 0.02 * m.treb_att;
      m.warp = 0.15 + 0.25 * m.bass_att;
      return m;
    },
    pixel_eqs: function pixel_eqs(m) {
      m.warp = m.warp + m.rad * 0.15;
      return m;
    },
    waves: [{
      baseVals: {
        a: 1.0,
        enabled: 0.0,
        b: 1.0,
        g: 1.0,
        scaling: 1.0,
        samples: 512.0,
        additive: 0.0,
        usedots: 0.0,
        spectrum: 0.0,
        r: 1.0,
        smoothing: 0.5,
        thick: 0.0,
        sep: 0.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      },
      point_eqs: ''
    }, {
      baseVals: {
        a: 1.0,
        enabled: 0.0,
        b: 1.0,
        g: 1.0,
        scaling: 1.0,
        samples: 512.0,
        additive: 0.0,
        usedots: 0.0,
        spectrum: 0.0,
        r: 1.0,
        smoothing: 0.5,
        thick: 0.0,
        sep: 0.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      },
      point_eqs: ''
    }, {
      baseVals: {
        a: 1.0,
        enabled: 0.0,
        b: 1.0,
        g: 1.0,
        scaling: 1.0,
        samples: 512.0,
        additive: 0.0,
        usedots: 0.0,
        spectrum: 0.0,
        r: 1.0,
        smoothing: 0.5,
        thick: 0.0,
        sep: 0.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      },
      point_eqs: ''
    }, {
      baseVals: {
        a: 1.0,
        enabled: 0.0,
        b: 1.0,
        g: 1.0,
        scaling: 1.0,
        samples: 512.0,
        additive: 0.0,
        usedots: 0.0,
        spectrum: 0.0,
        r: 1.0,
        smoothing: 0.5,
        thick: 0.0,
        sep: 0.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      },
      point_eqs: ''
    }],
    shapes: [{
      baseVals: {
        r2: 0.0,
        a: 1.0,
        enabled: 0.0,
        b: 0.0,
        tex_ang: 0.0,
        thickoutline: 0.0,
        g: 0.0,
        textured: 0.0,
        g2: 1.0,
        tex_zoom: 1.0,
        additive: 0.0,
        border_a: 0.1,
        border_b: 1.0,
        b2: 0.0,
        a2: 0.0,
        r: 1.0,
        border_g: 1.0,
        rad: 0.1,
        x: 0.5,
        y: 0.5,
        ang: 0.0,
        sides: 4.0,
        border_r: 1.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      }
    }, {
      baseVals: {
        r2: 0.0,
        a: 1.0,
        enabled: 0.0,
        b: 0.0,
        tex_ang: 0.0,
        thickoutline: 0.0,
        g: 0.0,
        textured: 0.0,
        g2: 1.0,
        tex_zoom: 1.0,
        additive: 0.0,
        border_a: 0.1,
        border_b: 1.0,
        b2: 0.0,
        a2: 0.0,
        r: 1.0,
        border_g: 1.0,
        rad: 0.1,
        x: 0.5,
        y: 0.5,
        ang: 0.0,
        sides: 4.0,
        border_r: 1.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      }
    }, {
      baseVals: {
        r2: 0.0,
        a: 1.0,
        enabled: 0.0,
        b: 0.0,
        tex_ang: 0.0,
        thickoutline: 0.0,
        g: 0.0,
        textured: 0.0,
        g2: 1.0,
        tex_zoom: 1.0,
        additive: 0.0,
        border_a: 0.1,
        border_b: 1.0,
        b2: 0.0,
        a2: 0.0,
        r: 1.0,
        border_g: 1.0,
        rad: 0.1,
        x: 0.5,
        y: 0.5,
        ang: 0.0,
        sides: 4.0,
        border_r: 1.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      }
    }, {
      baseVals: {
        r2: 0.0,
        a: 1.0,
        enabled: 0.0,
        b: 0.0,
        tex_ang: 0.0,
        thickoutline: 0.0,
        g: 0.0,
        textured: 0.0,
        g2: 1.0,
        tex_zoom: 1.0,
        additive: 0.0,
        border_a: 0.1,
        border_b: 1.0,
        b2: 0.0,
        a2: 0.0,
        r: 1.0,
        border_g: 1.0,
        rad: 0.1,
        x: 0.5,
        y: 0.5,
        ang: 0.0,
        sides: 4.0,
        border_r: 1.0
      },
      init_eqs: function init_eqs(m) {
        m.rkeys = [];
        return m;
      },
      frame_eqs: function frame_eqs(m) {
        return m;
      }
    }],
    warp: 'shader_body {\nret = texture2D(sampler_main, uv).rgb;\nret -= 0.004;\n}\n',
    comp: 'shader_body {\nret = texture2D(sampler_main, uv).rgb;\nret *= hue_shader;\n}\n'
  };
  return pmap;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* eslint-enable */

/***/ }),

/***/ "./src/equations/presetEquationRunner.js":
/*!***********************************************!*\
  !*** ./src/equations/presetEquationRunner.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PresetEquationRunner; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var PresetEquationRunner =
/*#__PURE__*/
function () {
  function PresetEquationRunner(preset, globalVars, opts) {
    _classCallCheck(this, PresetEquationRunner);

    this.preset = preset;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.qs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].range(1, 33).map(function (x) {
      return "q".concat(x);
    });
    this.ts = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].range(1, 9).map(function (x) {
      return "t".concat(x);
    });
    this.regs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].range(100).map(function (x) {
      if (x < 10) {
        return "reg0".concat(x);
      }

      return "reg".concat(x);
    });
    this.initializeEquations(globalVars);
  }

  _createClass(PresetEquationRunner, [{
    key: "initializeEquations",
    value: function initializeEquations(globalVars) {
      this.runVertEQs = this.preset.pixel_eqs !== '';
      this.mdVSQInit = null;
      this.mdVSRegs = null;
      this.mdVSFrame = null;
      this.mdVSUserKeys = null;
      this.mdVSFrameMap = null;
      this.mdVSShapes = null;
      this.mdVSUserKeysShapes = null;
      this.mdVSFrameMapShapes = null;
      this.mdVSWaves = null;
      this.mdVSUserKeysWaves = null;
      this.mdVSFrameMapWaves = null;
      this.mdVSQAfterFrame = null;
      this.gmegabuf = new Array(1048576).fill(0);
      var mdVSBase = {
        frame: globalVars.frame,
        time: globalVars.time,
        fps: globalVars.fps,
        bass: globalVars.bass,
        bass_att: globalVars.bass_att,
        mid: globalVars.mid,
        mid_att: globalVars.mid_att,
        treb: globalVars.treb,
        treb_att: globalVars.treb_att,
        meshx: this.mesh_width,
        meshy: this.mesh_height,
        aspectx: this.invAspectx,
        aspecty: this.invAspecty,
        pixelsx: this.texsizeX,
        pixelsy: this.texsizeY,
        gmegabuf: this.gmegabuf
      };
      this.mdVS = Object.assign({}, this.preset.baseVals, mdVSBase);
      this.mdVS.megabuf = new Array(1048576).fill(0);
      this.mdVS.rand_start = new Float32Array([Math.random(), Math.random(), Math.random(), Math.random()]);
      this.mdVS.rand_preset = new Float32Array([Math.random(), Math.random(), Math.random(), Math.random()]);
      var nonUserKeys = this.qs.concat(this.regs, Object.keys(this.mdVS));
      var mdVSAfterInit = this.preset.init_eqs(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].cloneVars(this.mdVS)); // qs need to be initialized to there init values every frame

      this.mdVSQInit = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSAfterInit, this.qs);
      this.mdVSRegs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSAfterInit, this.regs);
      var initUserVars = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSAfterInit, Object.keys(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].omit(mdVSAfterInit, nonUserKeys)));
      initUserVars.megabuf = mdVSAfterInit.megabuf;
      initUserVars.gmegabuf = mdVSAfterInit.gmegabuf;
      this.mdVSFrame = this.preset.frame_eqs(Object.assign({}, this.mdVS, this.mdVSQInit, this.mdVSRegs, initUserVars)); // user vars need to be copied between frames

      this.mdVSUserKeys = Object.keys(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].omit(this.mdVSFrame, nonUserKeys)); // Determine vars to carry over between frames

      this.mdVSFrameMap = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSFrame, this.mdVSUserKeys); // qs for shapes

      this.mdVSQAfterFrame = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSFrame, this.qs);
      this.mdVSRegs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSFrame, this.regs);
      this.mdVSWaves = [];
      this.mdVSTWaveInits = [];
      this.mdVSUserKeysWaves = [];
      this.mdVSFrameMapWaves = [];

      if (this.preset.waves && this.preset.waves.length > 0) {
        for (var i = 0; i < this.preset.waves.length; i++) {
          var wave = this.preset.waves[i];
          var baseVals = wave.baseVals;

          if (baseVals.enabled !== 0) {
            var mdVSWave = Object.assign({}, baseVals, mdVSBase);
            var nonUserWaveKeys = this.qs.concat(this.ts, this.regs, Object.keys(mdVSWave));
            Object.assign(mdVSWave, this.mdVSQAfterFrame, this.mdVSRegs);
            mdVSWave.megabuf = new Array(1048576).fill(0);

            if (wave.init_eqs) {
              mdVSWave = wave.init_eqs(mdVSWave);
              this.mdVSRegs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSWave, this.regs); // base vals need to be reset

              Object.assign(mdVSWave, baseVals);
            }

            this.mdVSWaves.push(mdVSWave);
            this.mdVSTWaveInits.push(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSWave, this.ts));
            this.mdVSUserKeysWaves.push(Object.keys(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].omit(mdVSWave, nonUserWaveKeys)));
            this.mdVSFrameMapWaves.push(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSWave, this.mdVSUserKeysWaves[i]));
          } else {
            this.mdVSWaves.push({});
            this.mdVSTWaveInits.push({});
            this.mdVSUserKeysWaves.push([]);
            this.mdVSFrameMapWaves.push({});
          }
        }
      }

      this.mdVSShapes = [];
      this.mdVSTShapeInits = [];
      this.mdVSUserKeysShapes = [];
      this.mdVSFrameMapShapes = [];

      if (this.preset.shapes && this.preset.shapes.length > 0) {
        for (var _i = 0; _i < this.preset.shapes.length; _i++) {
          var shape = this.preset.shapes[_i];
          var _baseVals = shape.baseVals;

          if (_baseVals.enabled !== 0) {
            var mdVSShape = Object.assign({}, _baseVals, mdVSBase);
            var nonUserShapeKeys = this.qs.concat(this.ts, this.regs, Object.keys(mdVSShape));
            Object.assign(mdVSShape, this.mdVSQAfterFrame, this.mdVSRegs);
            mdVSShape.megabuf = new Array(1048576).fill(0);

            if (shape.init_eqs) {
              mdVSShape = shape.init_eqs(mdVSShape);
              this.mdVSRegs = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSShape, this.regs); // base vals need to be reset

              Object.assign(mdVSShape, _baseVals);
            }

            this.mdVSShapes.push(mdVSShape);
            this.mdVSTShapeInits.push(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSShape, this.ts));
            this.mdVSUserKeysShapes.push(Object.keys(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].omit(mdVSShape, nonUserShapeKeys)));
            this.mdVSFrameMapShapes.push(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSShape, this.mdVSUserKeysShapes[_i]));
          } else {
            this.mdVSShapes.push({});
            this.mdVSTShapeInits.push({});
            this.mdVSUserKeysShapes.push([]);
            this.mdVSFrameMapShapes.push({});
          }
        }
      }
    }
  }, {
    key: "updatePreset",
    value: function updatePreset(preset, globalVars) {
      this.preset = preset;
      this.initializeEquations(globalVars);
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
    }
  }, {
    key: "runFrameEquations",
    value: function runFrameEquations(globalVars) {
      this.mdVSFrame = Object.assign({}, this.mdVS, this.mdVSQInit, this.mdVSFrameMap, globalVars);
      this.mdVSFrame = this.preset.frame_eqs(this.mdVSFrame);
      this.mdVSFrameMap = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSFrame, this.mdVSUserKeys);
      this.mdVSQAfterFrame = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSFrame, this.qs);
    }
  }]);

  return PresetEquationRunner;
}();



/***/ }),

/***/ "./src/image/imageTextures.js":
/*!************************************!*\
  !*** ./src/image/imageTextures.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ImageTextures; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ImageTextures =
/*#__PURE__*/
function () {
  function ImageTextures(gl) {
    var _this = this;

    _classCallCheck(this, ImageTextures);

    this.gl = gl;
    this.anisoExt = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    this.samplers = {};
    /* eslint-disable max-len */

    this.clouds2Image = new Image();

    this.clouds2Image.onload = function () {
      _this.samplers.clouds2 = _this.gl.createTexture();

      _this.bindTexture(_this.samplers.clouds2, _this.clouds2Image, 128, 128);
    };

    this.clouds2Image.src = 'data:image/jpeg;base64,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';
    this.emptyImage = new Image();

    this.emptyImage.onload = function () {
      _this.samplers.empty = _this.gl.createTexture();

      _this.bindTexture(_this.samplers.empty, _this.emptyImage, 1, 1);
    };

    this.emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    /* eslint-enable max-len */
  }

  _createClass(ImageTextures, [{
    key: "bindTexture",
    value: function bindTexture(texture, data, width, height) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      if (this.anisoExt) {
        var max = this.gl.getParameter(this.anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }
    }
  }, {
    key: "loadExtraImages",
    value: function loadExtraImages(imageData) {
      var _this2 = this;

      Object.keys(imageData).forEach(function (imageName) {
        var _imageData$imageName = imageData[imageName],
            data = _imageData$imageName.data,
            width = _imageData$imageName.width,
            height = _imageData$imageName.height;

        if (!_this2.samplers[imageName]) {
          var image = new Image();

          image.onload = function () {
            _this2.samplers[imageName] = _this2.gl.createTexture();

            _this2.bindTexture(_this2.samplers[imageName], image, width, height);
          };

          image.src = data;
        }
      });
    }
  }, {
    key: "getTexture",
    value: function getTexture(sampler) {
      var tex = this.samplers[sampler];

      if (tex) {
        return tex;
      }

      return this.samplers.clouds2;
    }
  }]);

  return ImageTextures;
}();



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Butterchurn; });
/* harmony import */ var ecma_proposal_math_extensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ecma-proposal-math-extensions */ "./node_modules/ecma-proposal-math-extensions/reference-implementation/index.js");
/* harmony import */ var ecma_proposal_math_extensions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ecma_proposal_math_extensions__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _presetBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./presetBase */ "./src/presetBase.js");
/* harmony import */ var _presetBase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_presetBase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _visualizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visualizer */ "./src/visualizer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var Butterchurn =
/*#__PURE__*/
function () {
  function Butterchurn() {
    _classCallCheck(this, Butterchurn);
  }

  _createClass(Butterchurn, null, [{
    key: "createVisualizer",
    value: function createVisualizer(context, canvas, opts) {
      return new _visualizer__WEBPACK_IMPORTED_MODULE_2__["default"](context, canvas, opts);
    }
  }]);

  return Butterchurn;
}();



/***/ }),

/***/ "./src/noise/noise.js":
/*!****************************!*\
  !*** ./src/noise/noise.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Noise; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Noise =
/*#__PURE__*/
function () {
  function Noise(gl) {
    _classCallCheck(this, Noise);

    this.gl = gl;
    this.anisoExt = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    this.noiseTexLQ = this.gl.createTexture();
    this.noiseTexLQLite = this.gl.createTexture();
    this.noiseTexMQ = this.gl.createTexture();
    this.noiseTexHQ = this.gl.createTexture();
    this.noiseTexVolLQ = this.gl.createTexture();
    this.noiseTexVolHQ = this.gl.createTexture();
    this.nTexArrLQ = Noise.createNoiseTex(256, 1);
    this.nTexArrLQLite = Noise.createNoiseTex(32, 1);
    this.nTexArrMQ = Noise.createNoiseTex(256, 4);
    this.nTexArrHQ = Noise.createNoiseTex(256, 8);
    this.nTexArrVolLQ = Noise.createNoiseVolTex(32, 1);
    this.nTexArrVolHQ = Noise.createNoiseVolTex(32, 4);
    this.bindTexture(this.noiseTexLQ, this.nTexArrLQ, 256, 256);
    this.bindTexture(this.noiseTexLQLite, this.nTexArrLQLite, 32, 32);
    this.bindTexture(this.noiseTexMQ, this.nTexArrMQ, 256, 256);
    this.bindTexture(this.noiseTexHQ, this.nTexArrHQ, 256, 256);
    this.bindTexture3D(this.noiseTexVolLQ, this.nTexArrVolLQ, 32, 32, 32);
    this.bindTexture3D(this.noiseTexVolHQ, this.nTexArrVolHQ, 32, 32, 32);
    this.noiseTexPointLQ = this.gl.createSampler();
    gl.samplerParameteri(this.noiseTexPointLQ, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.samplerParameteri(this.noiseTexPointLQ, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.samplerParameteri(this.noiseTexPointLQ, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.noiseTexPointLQ, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }

  _createClass(Noise, [{
    key: "bindTexture",
    value: function bindTexture(texture, data, width, height) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      if (this.anisoExt) {
        var max = this.gl.getParameter(this.anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }
    }
  }, {
    key: "bindTexture3D",
    value: function bindTexture3D(texture, data, width, height, depth) {
      this.gl.bindTexture(this.gl.TEXTURE_3D, texture);
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
      this.gl.texImage3D(this.gl.TEXTURE_3D, 0, this.gl.RGBA, width, height, depth, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
      this.gl.generateMipmap(this.gl.TEXTURE_3D);
      this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_R, this.gl.REPEAT);
      this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      if (this.anisoExt) {
        var max = this.gl.getParameter(this.anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.gl.texParameterf(this.gl.TEXTURE_3D, this.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }
    }
  }], [{
    key: "fCubicInterpolate",
    value: function fCubicInterpolate(y0, y1, y2, y3, t) {
      var t2 = t * t;
      var t3 = t * t2;
      var a0 = y3 - y2 - y0 + y1;
      var a1 = y0 - y1 - a0;
      var a2 = y2 - y0;
      var a3 = y1;
      return a0 * t3 + a1 * t2 + a2 * t + a3;
    }
  }, {
    key: "dwCubicInterpolate",
    value: function dwCubicInterpolate(y0, y1, y2, y3, t) {
      var ret = [];

      for (var i = 0; i < 4; i++) {
        var f = Noise.fCubicInterpolate(y0[i] / 255.0, y1[i] / 255.0, y2[i] / 255.0, y3[i] / 255.0, t);
        f = Math.clamp(f, 0, 1);
        ret[i] = f * 255;
      }

      return ret;
    }
  }, {
    key: "createNoiseVolTex",
    value: function createNoiseVolTex(noiseSize, zoom) {
      var nsize = noiseSize * noiseSize * noiseSize;
      var texArr = new Uint8Array(nsize * 4);
      var texRange = zoom > 1 ? 216 : 256;
      var halfTexRange = texRange * 0.5;

      for (var i = 0; i < nsize; i++) {
        texArr[i * 4 + 0] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 1] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 2] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 3] = Math.floor(Math.random() * texRange + halfTexRange);
      }

      var wordsPerSlice = noiseSize * noiseSize;
      var wordsPerLine = noiseSize;

      if (zoom > 1) {
        for (var z = 0; z < noiseSize; z += zoom) {
          for (var y = 0; y < noiseSize; y += zoom) {
            for (var x = 0; x < noiseSize; x++) {
              if (x % zoom !== 0) {
                var baseX = Math.floor(x / zoom) * zoom + noiseSize;
                var baseY = z * wordsPerSlice + y * wordsPerLine;
                var y0 = [];
                var y1 = [];
                var y2 = [];
                var y3 = [];

                for (var _i = 0; _i < 4; _i++) {
                  y0[_i] = texArr[baseY * 4 + (baseX - zoom) % noiseSize * 4 + _i];
                  y1[_i] = texArr[baseY * 4 + baseX % noiseSize * 4 + _i];
                  y2[_i] = texArr[baseY * 4 + (baseX + zoom) % noiseSize * 4 + _i];
                  y3[_i] = texArr[baseY * 4 + (baseX + zoom * 2) % noiseSize * 4 + _i];
                }

                var t = x % zoom / zoom;
                var result = Noise.dwCubicInterpolate(y0, y1, y2, y3, t);

                for (var _i2 = 0; _i2 < 4; _i2++) {
                  var offset = x * 4 + _i2;
                  texArr[z * wordsPerSlice * 4 + y * wordsPerLine * 4 + offset] = result[_i2];
                }
              }
            }
          }
        }

        for (var _z = 0; _z < noiseSize; _z += zoom) {
          for (var _x = 0; _x < noiseSize; _x++) {
            for (var _y = 0; _y < noiseSize; _y++) {
              if (_y % zoom !== 0) {
                var _baseY = Math.floor(_y / zoom) * zoom + noiseSize;

                var baseZ = _z * wordsPerSlice;
                var _y2 = [];
                var _y3 = [];
                var _y4 = [];
                var _y5 = [];

                for (var _i3 = 0; _i3 < 4; _i3++) {
                  var _offset = _x * 4 + baseZ * 4 + _i3;

                  _y2[_i3] = texArr[(_baseY - zoom) % noiseSize * wordsPerLine * 4 + _offset];
                  _y3[_i3] = texArr[_baseY % noiseSize * wordsPerLine * 4 + _offset];
                  _y4[_i3] = texArr[(_baseY + zoom) % noiseSize * wordsPerLine * 4 + _offset];
                  _y5[_i3] = texArr[(_baseY + zoom * 2) % noiseSize * wordsPerLine * 4 + _offset];
                }

                var _t = _y % zoom / zoom;

                var _result = Noise.dwCubicInterpolate(_y2, _y3, _y4, _y5, _t);

                for (var _i4 = 0; _i4 < 4; _i4++) {
                  var _offset2 = _x * 4 + baseZ * 4 + _i4;

                  texArr[_y * wordsPerLine * 4 + _offset2] = _result[_i4];
                }
              }
            }
          }
        }

        for (var _x2 = 0; _x2 < noiseSize; _x2++) {
          for (var _y6 = 0; _y6 < noiseSize; _y6++) {
            for (var _z2 = 0; _z2 < noiseSize; _z2++) {
              if (_z2 % zoom !== 0) {
                var _baseY2 = _y6 * wordsPerLine;

                var _baseZ = Math.floor(_z2 / zoom) * zoom + noiseSize;

                var _y7 = [];
                var _y8 = [];
                var _y9 = [];
                var _y10 = [];

                for (var _i5 = 0; _i5 < 4; _i5++) {
                  var _offset3 = _x2 * 4 + _baseY2 * 4 + _i5;

                  _y7[_i5] = texArr[(_baseZ - zoom) % noiseSize * wordsPerSlice * 4 + _offset3];
                  _y8[_i5] = texArr[_baseZ % noiseSize * wordsPerSlice * 4 + _offset3];
                  _y9[_i5] = texArr[(_baseZ + zoom) % noiseSize * wordsPerSlice * 4 + _offset3];
                  _y10[_i5] = texArr[(_baseZ + zoom * 2) % noiseSize * wordsPerSlice * 4 + _offset3];
                }

                var _t2 = _y6 % zoom / zoom;

                var _result2 = Noise.dwCubicInterpolate(_y7, _y8, _y9, _y10, _t2);

                for (var _i6 = 0; _i6 < 4; _i6++) {
                  var _offset4 = _x2 * 4 + _baseY2 * 4 + _i6;

                  texArr[_z2 * wordsPerSlice * 4 + _offset4] = _result2[_i6];
                }
              }
            }
          }
        }
      }

      return texArr;
    }
  }, {
    key: "createNoiseTex",
    value: function createNoiseTex(noiseSize, zoom) {
      var nsize = noiseSize * noiseSize;
      var texArr = new Uint8Array(nsize * 4);
      var texRange = zoom > 1 ? 216 : 256;
      var halfTexRange = texRange * 0.5;

      for (var i = 0; i < nsize; i++) {
        texArr[i * 4 + 0] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 1] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 2] = Math.floor(Math.random() * texRange + halfTexRange);
        texArr[i * 4 + 3] = Math.floor(Math.random() * texRange + halfTexRange);
      }

      if (zoom > 1) {
        for (var y = 0; y < noiseSize; y += zoom) {
          for (var x = 0; x < noiseSize; x++) {
            if (x % zoom !== 0) {
              var baseX = Math.floor(x / zoom) * zoom + noiseSize;
              var baseY = y * noiseSize;
              var y0 = [];
              var y1 = [];
              var y2 = [];
              var y3 = [];

              for (var z = 0; z < 4; z++) {
                y0[z] = texArr[baseY * 4 + (baseX - zoom) % noiseSize * 4 + z];
                y1[z] = texArr[baseY * 4 + baseX % noiseSize * 4 + z];
                y2[z] = texArr[baseY * 4 + (baseX + zoom) % noiseSize * 4 + z];
                y3[z] = texArr[baseY * 4 + (baseX + zoom * 2) % noiseSize * 4 + z];
              }

              var t = x % zoom / zoom;
              var result = Noise.dwCubicInterpolate(y0, y1, y2, y3, t);

              for (var _z3 = 0; _z3 < 4; _z3++) {
                texArr[y * noiseSize * 4 + x * 4 + _z3] = result[_z3];
              }
            }
          }
        }

        for (var _x3 = 0; _x3 < noiseSize; _x3++) {
          for (var _y11 = 0; _y11 < noiseSize; _y11++) {
            if (_y11 % zoom !== 0) {
              var _baseY3 = Math.floor(_y11 / zoom) * zoom + noiseSize;

              var _y12 = [];
              var _y13 = [];
              var _y14 = [];
              var _y15 = [];

              for (var _z4 = 0; _z4 < 4; _z4++) {
                _y12[_z4] = texArr[(_baseY3 - zoom) % noiseSize * noiseSize * 4 + _x3 * 4 + _z4];
                _y13[_z4] = texArr[_baseY3 % noiseSize * noiseSize * 4 + _x3 * 4 + _z4];
                _y14[_z4] = texArr[(_baseY3 + zoom) % noiseSize * noiseSize * 4 + _x3 * 4 + _z4];
                _y15[_z4] = texArr[(_baseY3 + zoom * 2) % noiseSize * noiseSize * 4 + _x3 * 4 + _z4];
              }

              var _t3 = _y11 % zoom / zoom;

              var _result3 = Noise.dwCubicInterpolate(_y12, _y13, _y14, _y15, _t3);

              for (var _z5 = 0; _z5 < 4; _z5++) {
                texArr[_y11 * noiseSize * 4 + _x3 * 4 + _z5] = _result3[_z5];
              }
            }
          }
        }
      }

      return texArr;
    }
  }]);

  return Noise;
}();



/***/ }),

/***/ "./src/presetBase.js":
/*!***************************!*\
  !*** ./src/presetBase.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint-disable */
var EPSILON = 0.00001;

window.sqr = function sqr(x) {
  return x * x;
};

window.sqrt = function sqrt(x) {
  return Math.sqrt(Math.abs(x));
};

window.log10 = function log10(val) {
  return Math.log(val) * Math.LOG10E;
};

window.sign = function sign(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
};

window.rand = function rand(x) {
  var xf = Math.floor(x);

  if (xf < 1) {
    return Math.random();
  }

  return Math.random() * xf;
};

window.randint = function randint(x) {
  return Math.floor(rand(x));
};

window.bnot = function bnot(x) {
  return Math.abs(x) < EPSILON ? 1 : 0;
};

function isFiniteNumber(num) {
  return isFinite(num) && !isNaN(num);
}

window.pow = function pow(x, y) {
  var z = Math.pow(x, y);

  if (!isFiniteNumber(z)) {
    // mostly from complex results
    return 0;
  }

  return z;
};

window.div = function div(x, y) {
  if (y === 0) {
    return 0;
  }

  return x / y;
};

window.mod = function mod(x, y) {
  if (y === 0) {
    return 0;
  }

  var z = Math.floor(x) % Math.floor(y);
  return z;
};

window.bitor = function bitor(x, y) {
  var z = Math.floor(x) | Math.floor(y);
  return z;
};

window.bitand = function bitand(x, y) {
  var z = Math.floor(x) & Math.floor(y);
  return z;
};

window.sigmoid = function sigmoid(x, y) {
  var t = 1 + Math.exp(-x * y);
  return Math.abs(t) > EPSILON ? 1.0 / t : 0;
};

window.bor = function bor(x, y) {
  return Math.abs(x) > EPSILON || Math.abs(y) > EPSILON ? 1 : 0;
};

window.band = function band(x, y) {
  return Math.abs(x) > EPSILON && Math.abs(y) > EPSILON ? 1 : 0;
};

window.equal = function equal(x, y) {
  return Math.abs(x - y) < EPSILON ? 1 : 0;
};

window.above = function above(x, y) {
  return x > y ? 1 : 0;
};

window.below = function below(x, y) {
  return x < y ? 1 : 0;
};

window.ifcond = function ifcond(x, y, z) {
  return Math.abs(x) > EPSILON ? y : z;
};

window.memcpy = function memcpy(megabuf, dst, src, len) {
  var destOffset = dst;
  var srcOffset = src;
  var copyLen = len;

  if (srcOffset < 0) {
    copyLen += srcOffset;
    destOffset -= srcOffset;
    srcOffset = 0;
  }

  if (destOffset < 0) {
    copyLen += destOffset;
    srcOffset -= destOffset;
    destOffset = 0;
  }

  if (copyLen > 0) {
    megabuf.copyWithin(destOffset, srcOffset, copyLen);
  }

  return dst;
};
/* eslint-enable */

/***/ }),

/***/ "./src/rendering/blendPattern.js":
/*!***************************************!*\
  !*** ./src/rendering/blendPattern.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlendPattern; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BlendPattern =
/*#__PURE__*/
function () {
  function BlendPattern(opts) {
    _classCallCheck(this, BlendPattern);

    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.vertInfoA = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1));
    this.vertInfoC = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1));
    this.createBlendPattern();
  }

  _createClass(BlendPattern, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      var oldMeshWidth = this.mesh_width;
      var oldMeshHeight = this.mesh_height;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;

      if (this.mesh_width !== oldMeshWidth || this.mesh_height !== oldMeshHeight) {
        this.vertInfoA = BlendPattern.resizeMatrixValues(this.vertInfoA, oldMeshWidth, oldMeshHeight, this.mesh_width, this.mesh_height);
        this.vertInfoC = BlendPattern.resizeMatrixValues(this.vertInfoC, oldMeshWidth, oldMeshHeight, this.mesh_width, this.mesh_height);
      }
    }
  }, {
    key: "genPlasma",
    value: function genPlasma(x0, x1, y0, y1, dt) {
      var midx = Math.floor((x0 + x1) / 2);
      var midy = Math.floor((y0 + y1) / 2);
      var t00 = this.vertInfoC[y0 * (this.mesh_width + 1) + x0];
      var t01 = this.vertInfoC[y0 * (this.mesh_width + 1) + x1];
      var t10 = this.vertInfoC[y1 * (this.mesh_width + 1) + x0];
      var t11 = this.vertInfoC[y1 * (this.mesh_width + 1) + x1];

      if (y1 - y0 >= 2) {
        if (x0 === 0) {
          this.vertInfoC[midy * (this.mesh_width + 1) + x0] = 0.5 * (t00 + t10) + (Math.random() * 2 - 1) * dt * this.aspecty;
        }

        this.vertInfoC[midy * (this.mesh_width + 1) + x1] = 0.5 * (t01 + t11) + (Math.random() * 2 - 1) * dt * this.aspecty;
      }

      if (x1 - x0 >= 2) {
        if (y0 === 0) {
          this.vertInfoC[y0 * (this.mesh_width + 1) + midx] = 0.5 * (t00 + t01) + (Math.random() * 2 - 1) * dt * this.aspectx;
        }

        this.vertInfoC[y1 * (this.mesh_width + 1) + midx] = 0.5 * (t10 + t11) + (Math.random() * 2 - 1) * dt * this.aspectx;
      }

      if (y1 - y0 >= 2 && x1 - x0 >= 2) {
        t00 = this.vertInfoC[midy * (this.mesh_width + 1) + x0];
        t01 = this.vertInfoC[midy * (this.mesh_width + 1) + x1];
        t10 = this.vertInfoC[y0 * (this.mesh_width + 1) + midx];
        t11 = this.vertInfoC[y1 * (this.mesh_width + 1) + midx];
        this.vertInfoC[midy * (this.mesh_width + 1) + midx] = 0.25 * (t10 + t11 + t00 + t01) + (Math.random() * 2 - 1) * dt;
        this.genPlasma(x0, midx, y0, midy, dt * 0.5);
        this.genPlasma(midx, x1, y0, midy, dt * 0.5);
        this.genPlasma(x0, midx, midy, y1, dt * 0.5);
        this.genPlasma(midx, x1, midy, y1, dt * 0.5);
      }
    }
  }, {
    key: "createBlendPattern",
    value: function createBlendPattern() {
      var mixType = 1 + Math.floor(Math.random() * 3);

      if (mixType === 0) {
        // not currently used
        var nVert = 0;

        for (var y = 0; y <= this.mesh_height; y++) {
          for (var x = 0; x <= this.mesh_width; x++) {
            this.vertInfoA[nVert] = 1;
            this.vertInfoC[nVert] = 0;
            nVert += 1;
          }
        }
      } else if (mixType === 1) {
        var ang = Math.random() * 6.28;
        var vx = Math.cos(ang);
        var vy = Math.sin(ang);
        var band = 0.1 + 0.2 * Math.random();
        var invBand = 1.0 / band;
        var _nVert = 0;

        for (var _y = 0; _y <= this.mesh_height; _y++) {
          var fy = _y / this.mesh_height * this.aspecty;

          for (var _x = 0; _x <= this.mesh_width; _x++) {
            var fx = _x / this.mesh_width * this.aspectx;
            var t = (fx - 0.5) * vx + (fy - 0.5) * vy + 0.5;
            t = (t - 0.5) / Math.sqrt(2) + 0.5;
            this.vertInfoA[_nVert] = invBand * (1 + band);
            this.vertInfoC[_nVert] = -invBand + invBand * t;
            _nVert += 1;
          }
        }
      } else if (mixType === 2) {
        var _band = 0.12 + 0.13 * Math.random();

        var _invBand = 1.0 / _band;

        this.vertInfoC[0] = Math.random();
        this.vertInfoC[this.mesh_width] = Math.random();
        this.vertInfoC[this.mesh_height * (this.mesh_width + 1)] = Math.random();
        this.vertInfoC[this.mesh_height * (this.mesh_width + 1) + this.mesh_width] = Math.random();
        this.genPlasma(0, this.mesh_width, 0, this.mesh_height, 0.25);
        var minc = this.vertInfoC[0];
        var maxc = this.vertInfoC[0];
        var _nVert2 = 0;

        for (var _y2 = 0; _y2 <= this.mesh_height; _y2++) {
          for (var _x2 = 0; _x2 <= this.mesh_width; _x2++) {
            if (minc > this.vertInfoC[_nVert2]) {
              minc = this.vertInfoC[_nVert2];
            }

            if (maxc < this.vertInfoC[_nVert2]) {
              maxc = this.vertInfoC[_nVert2];
            }

            _nVert2 += 1;
          }
        }

        var mult = 1.0 / (maxc - minc);
        _nVert2 = 0;

        for (var _y3 = 0; _y3 <= this.mesh_height; _y3++) {
          for (var _x3 = 0; _x3 <= this.mesh_width; _x3++) {
            var _t = (this.vertInfoC[_nVert2] - minc) * mult;

            this.vertInfoA[_nVert2] = _invBand * (1 + _band);
            this.vertInfoC[_nVert2] = -_invBand + _invBand * _t;
            _nVert2 += 1;
          }
        }
      } else if (mixType === 3) {
        var _band2 = 0.02 + 0.14 * Math.random() + 0.34 * Math.random();

        var _invBand2 = 1.0 / _band2;

        var dir = Math.floor(Math.random() * 2) * 2 - 1;
        var _nVert3 = 0;

        for (var _y4 = 0; _y4 <= this.mesh_height; _y4++) {
          var dy = (_y4 / this.mesh_height - 0.5) * this.aspecty;

          for (var _x4 = 0; _x4 <= this.mesh_width; _x4++) {
            var dx = (_x4 / this.mesh_width - 0.5) * this.aspectx;

            var _t2 = Math.sqrt(dx * dx + dy * dy) * 1.41421;

            if (dir === -1) {
              _t2 = 1 - _t2;
            }

            this.vertInfoA[_nVert3] = _invBand2 * (1 + _band2);
            this.vertInfoC[_nVert3] = -_invBand2 + _invBand2 * _t2;
            _nVert3 += 1;
          }
        }
      }
    }
  }], [{
    key: "resizeMatrixValues",
    value: function resizeMatrixValues(oldMat, oldWidth, oldHeight, newWidth, newHeight) {
      var newMat = new Float32Array((newWidth + 1) * (newHeight + 1));
      var nVert = 0;

      for (var j = 0; j < newHeight + 1; j++) {
        for (var i = 0; i < newWidth + 1; i++) {
          var x = i / newHeight;
          var y = j / newWidth;
          x *= oldWidth + 1;
          y *= oldHeight + 1;
          x = Math.clamp(x, 0, oldWidth - 1);
          y = Math.clamp(y, 0, oldHeight - 1);
          var nx = Math.floor(x);
          var ny = Math.floor(y);
          var dx = x - nx;
          var dy = y - ny;
          var val00 = oldMat[ny * (oldWidth + 1) + nx];
          var val01 = oldMat[ny * (oldWidth + 1) + (nx + 1)];
          var val10 = oldMat[(ny + 1) * (oldWidth + 1) + nx];
          var val11 = oldMat[(ny + 1) * (oldWidth + 1) + (nx + 1)];
          newMat[nVert] = val00 * (1 - dx) * (1 - dy) + val01 * dx * (1 - dy) + val10 * (1 - dx) * dy + val11 * dx * dy;
          nVert += 1;
        }
      }

      return newMat;
    }
  }]);

  return BlendPattern;
}();



/***/ }),

/***/ "./src/rendering/motionVectors/motionVectors.js":
/*!******************************************************!*\
  !*** ./src/rendering/motionVectors/motionVectors.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MotionVectors; });
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var MotionVectors =
/*#__PURE__*/
function () {
  function MotionVectors(gl, opts) {
    _classCallCheck(this, MotionVectors);

    this.gl = gl;
    this.maxX = 64;
    this.maxY = 48;
    this.positions = new Float32Array(this.maxX * this.maxY * 2 * 3);
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.positionVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(MotionVectors, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aPos;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      out vec4 fragColor;\n                                      uniform vec4 u_color;\n                                      void main(void) {\n                                        fragColor = u_color;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLoc = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.colorLoc = this.gl.getUniformLocation(this.shaderProgram, 'u_color');
    }
  }, {
    key: "getMotionDir",
    value: function getMotionDir(warpUVs, fx, fy) {
      var y0 = Math.floor(fy * this.mesh_height);
      var dy = fy * this.mesh_height - y0;
      var x0 = Math.floor(fx * this.mesh_width);
      var dx = fx * this.mesh_width - x0;
      var x1 = x0 + 1;
      var y1 = y0 + 1;
      var gridX1 = this.mesh_width + 1;
      var fx2;
      var fy2;
      fx2 = warpUVs[(y0 * gridX1 + x0) * 2 + 0] * (1 - dx) * (1 - dy);
      fy2 = warpUVs[(y0 * gridX1 + x0) * 2 + 1] * (1 - dx) * (1 - dy);
      fx2 += warpUVs[(y0 * gridX1 + x1) * 2 + 0] * dx * (1 - dy);
      fy2 += warpUVs[(y0 * gridX1 + x1) * 2 + 1] * dx * (1 - dy);
      fx2 += warpUVs[(y1 * gridX1 + x0) * 2 + 0] * (1 - dx) * dy;
      fy2 += warpUVs[(y1 * gridX1 + x0) * 2 + 1] * (1 - dx) * dy;
      fx2 += warpUVs[(y1 * gridX1 + x1) * 2 + 0] * dx * dy;
      fy2 += warpUVs[(y1 * gridX1 + x1) * 2 + 1] * dx * dy;
      return [fx2, 1.0 - fy2];
    }
  }, {
    key: "generateMotionVectors",
    value: function generateMotionVectors(mdVSFrame, warpUVs) {
      var mvA = mdVSFrame.mv_a;
      var nX = Math.floor(mdVSFrame.mv_x);
      var nY = Math.floor(mdVSFrame.mv_y);

      if (mvA > 0.001 && nX > 0 && nY > 0) {
        var dx = mdVSFrame.mv_x - nX;
        var dy = mdVSFrame.mv_y - nY;

        if (nX > this.maxX) {
          nX = this.maxX;
          dx = 0;
        }

        if (nY > this.maxY) {
          nY = this.maxY;
          dy = 0;
        }

        var dx2 = mdVSFrame.mv_dx;
        var dy2 = mdVSFrame.mv_dy;
        var lenMult = mdVSFrame.mv_l;
        var minLen = 1.0 / this.texsizeX;
        this.numVecVerts = 0;

        for (var j = 0; j < nY; j++) {
          var fy = (j + 0.25) / (nY + dy + 0.25 - 1.0);
          fy -= dy2;

          if (fy > 0.0001 && fy < 0.9999) {
            for (var i = 0; i < nX; i++) {
              var fx = (i + 0.25) / (nX + dx + 0.25 - 1.0);
              fx += dx2;

              if (fx > 0.0001 && fx < 0.9999) {
                var fx2arr = this.getMotionDir(warpUVs, fx, fy);
                var fx2 = fx2arr[0];
                var fy2 = fx2arr[1];
                var dxi = fx2 - fx;
                var dyi = fy2 - fy;
                dxi *= lenMult;
                dyi *= lenMult;
                var fdist = Math.sqrt(dxi * dxi + dyi * dyi);

                if (fdist < minLen && fdist > 0.00000001) {
                  fdist = minLen / fdist;
                  dxi *= fdist;
                  dyi *= fdist;
                } else {
                  dxi = minLen;
                  dxi = minLen;
                }

                fx2 = fx + dxi;
                fy2 = fy + dyi;
                var vx1 = 2.0 * fx - 1.0;
                var vy1 = 2.0 * fy - 1.0;
                var vx2 = 2.0 * fx2 - 1.0;
                var vy2 = 2.0 * fy2 - 1.0;
                this.positions[this.numVecVerts * 3 + 0] = vx1;
                this.positions[this.numVecVerts * 3 + 1] = vy1;
                this.positions[this.numVecVerts * 3 + 2] = 0;
                this.positions[(this.numVecVerts + 1) * 3 + 0] = vx2;
                this.positions[(this.numVecVerts + 1) * 3 + 1] = vy2;
                this.positions[(this.numVecVerts + 1) * 3 + 2] = 0;
                this.numVecVerts += 2;
              }
            }
          }
        }

        if (this.numVecVerts > 0) {
          this.color = [mdVSFrame.mv_r, mdVSFrame.mv_g, mdVSFrame.mv_b, mvA];
          return true;
        }
      }

      return false;
    }
  }, {
    key: "drawMotionVectors",
    value: function drawMotionVectors(mdVSFrame, warpUVs) {
      if (this.generateMotionVectors(mdVSFrame, warpUVs)) {
        this.gl.useProgram(this.shaderProgram);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPosLoc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aPosLoc);
        this.gl.uniform4fv(this.colorLoc, this.color);
        this.gl.lineWidth(1);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.drawArrays(this.gl.LINES, 0, this.numVecVerts);
      }
    }
  }]);

  return MotionVectors;
}();



/***/ }),

/***/ "./src/rendering/renderer.js":
/*!***********************************!*\
  !*** ./src/rendering/renderer.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Renderer; });
/* harmony import */ var _audio_audioLevels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../audio/audioLevels */ "./src/audio/audioLevels.js");
/* harmony import */ var _blankPreset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blankPreset */ "./src/blankPreset.js");
/* harmony import */ var _blankPreset__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_blankPreset__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _equations_presetEquationRunner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../equations/presetEquationRunner */ "./src/equations/presetEquationRunner.js");
/* harmony import */ var _waves_basicWaveform__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./waves/basicWaveform */ "./src/rendering/waves/basicWaveform.js");
/* harmony import */ var _waves_customWaveform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./waves/customWaveform */ "./src/rendering/waves/customWaveform.js");
/* harmony import */ var _shapes_customShape__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shapes/customShape */ "./src/rendering/shapes/customShape.js");
/* harmony import */ var _sprites_border__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sprites/border */ "./src/rendering/sprites/border.js");
/* harmony import */ var _sprites_darkenCenter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sprites/darkenCenter */ "./src/rendering/sprites/darkenCenter.js");
/* harmony import */ var _motionVectors_motionVectors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./motionVectors/motionVectors */ "./src/rendering/motionVectors/motionVectors.js");
/* harmony import */ var _shaders_warp__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shaders/warp */ "./src/rendering/shaders/warp.js");
/* harmony import */ var _shaders_comp__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shaders/comp */ "./src/rendering/shaders/comp.js");
/* harmony import */ var _shaders_output__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shaders/output */ "./src/rendering/shaders/output.js");
/* harmony import */ var _shaders_resample__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./shaders/resample */ "./src/rendering/shaders/resample.js");
/* harmony import */ var _shaders_blur_blur__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shaders/blur/blur */ "./src/rendering/shaders/blur/blur.js");
/* harmony import */ var _noise_noise__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../noise/noise */ "./src/noise/noise.js");
/* harmony import */ var _image_imageTextures__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../image/imageTextures */ "./src/image/imageTextures.js");
/* harmony import */ var _text_titleText__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./text/titleText */ "./src/rendering/text/titleText.js");
/* harmony import */ var _blendPattern__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./blendPattern */ "./src/rendering/blendPattern.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





















var Renderer =
/*#__PURE__*/
function () {
  function Renderer(gl, audio, opts) {
    _classCallCheck(this, Renderer);

    this.gl = gl;
    this.audio = audio;
    this.frameNum = 0;
    this.fps = 30;
    this.time = 0;
    this.presetTime = 0;
    this.lastTime = performance.now();
    this.timeHist = [0];
    this.timeHistMax = 120;
    this.blending = false;
    this.blendStartTime = 0;
    this.blendProgress = 0;
    this.blendDuration = 0;
    this.width = opts.width || 1200;
    this.height = opts.height || 900;
    this.mesh_width = opts.meshWidth || 48;
    this.mesh_height = opts.meshHeight || 36;
    this.pixelRatio = opts.pixelRatio || window.devicePixelRatio || 1;
    this.textureRatio = opts.textureRatio || 1;
    this.outputFXAA = opts.outputFXAA || false;
    this.texsizeX = this.width * this.pixelRatio * this.textureRatio;
    this.texsizeY = this.height * this.pixelRatio * this.textureRatio;
    this.aspectx = this.texsizeY > this.texsizeX ? this.texsizeX / this.texsizeY : 1;
    this.aspecty = this.texsizeX > this.texsizeY ? this.texsizeY / this.texsizeX : 1;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.qs = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(1, 33).map(function (x) {
      return "q".concat(x);
    });
    this.ts = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(1, 9).map(function (x) {
      return "t".concat(x);
    });
    this.regs = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(0, 100).map(function (x) {
      if (x < 10) {
        return "reg0".concat(x);
      }

      return "reg".concat(x);
    });
    this.blurRatios = [[0.5, 0.25], [0.125, 0.125], [0.0625, 0.0625]];
    this.audioLevels = new _audio_audioLevels__WEBPACK_IMPORTED_MODULE_0__["default"](this.audio);
    this.prevFrameBuffer = this.gl.createFramebuffer();
    this.targetFrameBuffer = this.gl.createFramebuffer();
    this.prevTexture = this.gl.createTexture();
    this.targetTexture = this.gl.createTexture();
    this.compFrameBuffer = this.gl.createFramebuffer();
    this.compTexture = this.gl.createTexture();
    this.anisoExt = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    this.bindFrameBufferTexture(this.prevFrameBuffer, this.prevTexture);
    this.bindFrameBufferTexture(this.targetFrameBuffer, this.targetTexture);
    this.bindFrameBufferTexture(this.compFrameBuffer, this.compTexture);
    var params = {
      pixelRatio: this.pixelRatio,
      textureRatio: this.textureRatio,
      texsizeX: this.texsizeX,
      texsizeY: this.texsizeY,
      mesh_width: this.mesh_width,
      mesh_height: this.mesh_height,
      aspectx: this.aspectx,
      aspecty: this.aspecty
    };
    this.noise = new _noise_noise__WEBPACK_IMPORTED_MODULE_14__["default"](gl);
    this.image = new _image_imageTextures__WEBPACK_IMPORTED_MODULE_15__["default"](gl);
    this.warpShader = new _shaders_warp__WEBPACK_IMPORTED_MODULE_9__["default"](gl, this.noise, this.image, params);
    this.compShader = new _shaders_comp__WEBPACK_IMPORTED_MODULE_10__["default"](gl, this.noise, this.image, params);
    this.outputShader = new _shaders_output__WEBPACK_IMPORTED_MODULE_11__["default"](gl, params);
    this.prevWarpShader = new _shaders_warp__WEBPACK_IMPORTED_MODULE_9__["default"](gl, this.noise, this.image, params);
    this.prevCompShader = new _shaders_comp__WEBPACK_IMPORTED_MODULE_10__["default"](gl, this.noise, this.image, params);
    this.numBlurPasses = 0;
    this.blurShader1 = new _shaders_blur_blur__WEBPACK_IMPORTED_MODULE_13__["default"](0, this.blurRatios, gl, params);
    this.blurShader2 = new _shaders_blur_blur__WEBPACK_IMPORTED_MODULE_13__["default"](1, this.blurRatios, gl, params);
    this.blurShader3 = new _shaders_blur_blur__WEBPACK_IMPORTED_MODULE_13__["default"](2, this.blurRatios, gl, params);
    this.blurTexture1 = this.blurShader1.blurVerticalTexture;
    this.blurTexture2 = this.blurShader2.blurVerticalTexture;
    this.blurTexture3 = this.blurShader3.blurVerticalTexture;
    this.basicWaveform = new _waves_basicWaveform__WEBPACK_IMPORTED_MODULE_3__["default"](gl, params);
    this.customWaveforms = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(4).map(function (i) {
      return new _waves_customWaveform__WEBPACK_IMPORTED_MODULE_4__["default"](i, gl, params);
    });
    this.customShapes = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(4).map(function (i) {
      return new _shapes_customShape__WEBPACK_IMPORTED_MODULE_5__["default"](i, gl, params);
    });
    this.prevCustomWaveforms = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(4).map(function (i) {
      return new _waves_customWaveform__WEBPACK_IMPORTED_MODULE_4__["default"](i, gl, params);
    });
    this.prevCustomShapes = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].range(4).map(function (i) {
      return new _shapes_customShape__WEBPACK_IMPORTED_MODULE_5__["default"](i, gl, params);
    });
    this.darkenCenter = new _sprites_darkenCenter__WEBPACK_IMPORTED_MODULE_7__["default"](gl, params);
    this.innerBorder = new _sprites_border__WEBPACK_IMPORTED_MODULE_6__["default"](gl, params);
    this.outerBorder = new _sprites_border__WEBPACK_IMPORTED_MODULE_6__["default"](gl, params);
    this.motionVectors = new _motionVectors_motionVectors__WEBPACK_IMPORTED_MODULE_8__["default"](gl, params);
    this.titleText = new _text_titleText__WEBPACK_IMPORTED_MODULE_16__["default"](gl, params);
    this.blendPattern = new _blendPattern__WEBPACK_IMPORTED_MODULE_17__["default"](params);
    this.resampleShader = new _shaders_resample__WEBPACK_IMPORTED_MODULE_12__["default"](gl);
    this.supertext = {
      startTime: -1
    };
    this.warpUVs = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1) * 2);
    this.warpColor = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1) * 4);
    this.gl.clearColor(0, 0, 0, 1);
    this.blankPreset = _blankPreset__WEBPACK_IMPORTED_MODULE_1___default.a;
    var globalVars = {
      frame: 0,
      time: 0,
      fps: 45,
      bass: 1,
      bass_att: 1,
      mid: 1,
      mid_att: 1,
      treb: 1,
      treb_att: 1
    };
    this.preset = _blankPreset__WEBPACK_IMPORTED_MODULE_1___default.a;
    this.prevPreset = this.preset;
    this.presetEquationRunner = new _equations_presetEquationRunner__WEBPACK_IMPORTED_MODULE_2__["default"](this.preset, globalVars, params);
    this.prevPresetEquationRunner = new _equations_presetEquationRunner__WEBPACK_IMPORTED_MODULE_2__["default"](this.prevPreset, globalVars, params);
    this.regVars = this.presetEquationRunner.mdVSRegs;
  }

  _createClass(Renderer, [{
    key: "loadPreset",
    value: function loadPreset(preset, blendTime) {
      this.blendPattern.createBlendPattern();
      this.blending = true;
      this.blendStartTime = this.time;
      this.blendDuration = blendTime;
      this.blendProgress = 0;
      this.prevPresetEquationRunner = this.presetEquationRunner;
      this.prevPreset = this.preset;
      this.preset = preset;
      this.preset.baseVals.old_wave_mode = this.prevPreset.baseVals.wave_mode;
      this.presetTime = this.time;
      var globalVars = {
        frame: this.frameNum,
        time: this.time,
        fps: this.fps,
        bass: this.audioLevels.bass,
        bass_att: this.audioLevels.bass_att,
        mid: this.audioLevels.mid,
        mid_att: this.audioLevels.mid_att,
        treb: this.audioLevels.treb,
        treb_att: this.audioLevels.treb_att
      };
      var params = {
        pixelRatio: this.pixelRatio,
        textureRatio: this.textureRatio,
        texsizeX: this.texsizeX,
        texsizeY: this.texsizeY,
        mesh_width: this.mesh_width,
        mesh_height: this.mesh_height,
        aspectx: this.aspectx,
        aspecty: this.aspecty
      };
      this.presetEquationRunner = new _equations_presetEquationRunner__WEBPACK_IMPORTED_MODULE_2__["default"](this.preset, globalVars, params);
      this.regVars = this.presetEquationRunner.mdVSRegs;
      var tmpWarpShader = this.prevWarpShader;
      this.prevWarpShader = this.warpShader;
      this.warpShader = tmpWarpShader;
      var tmpCompShader = this.prevCompShader;
      this.prevCompShader = this.compShader;
      this.compShader = tmpCompShader;
      var warpText = this.preset.warp.trim();
      var compText = this.preset.comp.trim();
      this.warpShader.updateShader(warpText);
      this.compShader.updateShader(compText);

      if (warpText.length === 0) {
        this.numBlurPasses = 0;
      } else {
        this.numBlurPasses = Renderer.getHighestBlur(warpText);
      }

      if (compText.length !== 0) {
        this.numBlurPasses = Math.max(this.numBlurPasses, Renderer.getHighestBlur(compText));
      }
    }
  }, {
    key: "loadExtraImages",
    value: function loadExtraImages(imageData) {
      this.image.loadExtraImages(imageData);
    }
  }, {
    key: "setRendererSize",
    value: function setRendererSize(width, height, opts) {
      var oldTexsizeX = this.texsizeX;
      var oldTexsizeY = this.texsizeY;
      this.width = width;
      this.height = height;
      this.mesh_width = opts.meshWidth || this.mesh_width;
      this.mesh_height = opts.meshHeight || this.mesh_height;
      this.pixelRatio = opts.pixelRatio || this.pixelRatio;
      this.textureRatio = opts.textureRatio || this.textureRatio;
      this.texsizeX = width * this.pixelRatio * this.textureRatio;
      this.texsizeY = height * this.pixelRatio * this.textureRatio;
      this.aspectx = this.texsizeY > this.texsizeX ? this.texsizeX / this.texsizeY : 1;
      this.aspecty = this.texsizeX > this.texsizeY ? this.texsizeY / this.texsizeX : 1;

      if (this.texsizeX !== oldTexsizeX || this.texsizeY !== oldTexsizeY) {
        // copy target texture, because we flip prev/target at start of render
        var targetTextureNew = this.gl.createTexture();
        this.bindFrameBufferTexture(this.targetFrameBuffer, targetTextureNew);
        this.bindFrambufferAndSetViewport(this.targetFrameBuffer, this.texsizeX, this.texsizeY);
        this.resampleShader.renderQuadTexture(this.targetTexture);
        this.targetTexture = targetTextureNew;
        this.bindFrameBufferTexture(this.prevFrameBuffer, this.prevTexture);
        this.bindFrameBufferTexture(this.compFrameBuffer, this.compTexture);
      }

      this.updateGlobals(); // rerender current frame at new size

      if (this.frameNum > 0) {
        this.renderToScreen();
      }
    }
  }, {
    key: "setInternalMeshSize",
    value: function setInternalMeshSize(width, height) {
      this.mesh_width = width;
      this.mesh_height = height;
      this.updateGlobals();
    }
  }, {
    key: "setOutputAA",
    value: function setOutputAA(useAA) {
      this.outputFXAA = useAA;
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals() {
      var params = {
        pixelRatio: this.pixelRatio,
        textureRatio: this.textureRatio,
        texsizeX: this.texsizeX,
        texsizeY: this.texsizeY,
        mesh_width: this.mesh_width,
        mesh_height: this.mesh_height,
        aspectx: this.aspectx,
        aspecty: this.aspecty
      };
      this.presetEquationRunner.updateGlobals(params);
      this.prevPresetEquationRunner.updateGlobals(params);
      this.warpShader.updateGlobals(params);
      this.prevWarpShader.updateGlobals(params);
      this.compShader.updateGlobals(params);
      this.prevCompShader.updateGlobals(params);
      this.outputShader.updateGlobals(params);
      this.blurShader1.updateGlobals(params);
      this.blurShader2.updateGlobals(params);
      this.blurShader3.updateGlobals(params);
      this.basicWaveform.updateGlobals(params);
      this.customWaveforms.forEach(function (wave) {
        return wave.updateGlobals(params);
      });
      this.customShapes.forEach(function (shape) {
        return shape.updateGlobals(params);
      });
      this.prevCustomWaveforms.forEach(function (wave) {
        return wave.updateGlobals(params);
      });
      this.prevCustomShapes.forEach(function (shape) {
        return shape.updateGlobals(params);
      });
      this.darkenCenter.updateGlobals(params);
      this.innerBorder.updateGlobals(params);
      this.outerBorder.updateGlobals(params);
      this.motionVectors.updateGlobals(params);
      this.titleText.updateGlobals(params);
      this.blendPattern.updateGlobals(params);
      this.warpUVs = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1) * 2);
      this.warpColor = new Float32Array((this.mesh_width + 1) * (this.mesh_height + 1) * 4);
    }
  }, {
    key: "calcTimeAndFPS",
    value: function calcTimeAndFPS(elapsedTime) {
      var elapsed;

      if (elapsedTime) {
        elapsed = elapsedTime;
      } else {
        var newTime = performance.now();
        elapsed = (newTime - this.lastTime) / 1000.0;

        if (elapsed > 1.0 || elapsed < 0.0 || this.frame < 2) {
          elapsed = 1.0 / 30.0;
        }

        this.lastTime = newTime;
      }

      this.time += 1.0 / this.fps;

      if (this.blending) {
        this.blendProgress = (this.time - this.blendStartTime) / this.blendDuration;

        if (this.blendProgress > 1.0) {
          this.blending = false;
        }
      }

      var newHistTime = this.timeHist[this.timeHist.length - 1] + elapsed;
      this.timeHist.push(newHistTime);

      if (this.timeHist.length > this.timeHistMax) {
        this.timeHist.shift();
      }

      var newFPS = this.timeHist.length / (newHistTime - this.timeHist[0]);

      if (Math.abs(newFPS - this.fps) > 3.0 && this.frame > this.timeHistMax) {
        this.fps = newFPS;
      } else {
        var damping = 0.93;
        this.fps = damping * this.fps + (1.0 - damping) * newFPS;
      }
    }
  }, {
    key: "runPixelEquations",
    value: function runPixelEquations(preset, mdVSFrame, runVertEQs, blending) {
      var gridX = this.mesh_width;
      var gridZ = this.mesh_height;
      var gridX1 = gridX + 1;
      var gridZ1 = gridZ + 1;
      var warpTimeV = this.time * mdVSFrame.warpanimspeed;
      var warpScaleInv = 1.0 / mdVSFrame.warpscale;
      var warpf0 = 11.68 + 4.0 * Math.cos(warpTimeV * 1.413 + 10);
      var warpf1 = 8.77 + 3.0 * Math.cos(warpTimeV * 1.113 + 7);
      var warpf2 = 10.54 + 3.0 * Math.cos(warpTimeV * 1.233 + 3);
      var warpf3 = 11.49 + 4.0 * Math.cos(warpTimeV * 0.933 + 5);
      var texelOffsetX = 0.0 / this.texsizeX;
      var texelOffsetY = 0.0 / this.texsizeY;
      var aspectx = this.aspectx;
      var aspecty = this.aspecty;
      var mdVSVertex = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].cloneVars(mdVSFrame);
      var offset = 0;
      var offsetColor = 0;

      for (var iz = 0; iz < gridZ1; iz++) {
        for (var ix = 0; ix < gridX1; ix++) {
          var x = ix / gridX * 2.0 - 1.0;
          var y = iz / gridZ * 2.0 - 1.0;
          var rad = Math.sqrt(x * x * aspectx * aspectx + y * y * aspecty * aspecty);

          if (runVertEQs) {
            var ang = void 0;

            if (iz === gridZ / 2 && ix === gridX / 2) {
              ang = 0;
            } else {
              ang = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].atan2(y * aspecty, x * aspectx);
            }

            mdVSVertex.x = x * 0.5 * aspectx + 0.5;
            mdVSVertex.y = y * -0.5 * aspecty + 0.5;
            mdVSVertex.rad = rad;
            mdVSVertex.ang = ang;
            mdVSVertex.zoom = mdVSFrame.zoom;
            mdVSVertex.zoomexp = mdVSFrame.zoomexp;
            mdVSVertex.rot = mdVSFrame.rot;
            mdVSVertex.warp = mdVSFrame.warp;
            mdVSVertex.cx = mdVSFrame.cx;
            mdVSVertex.cy = mdVSFrame.cy;
            mdVSVertex.dx = mdVSFrame.dx;
            mdVSVertex.dy = mdVSFrame.dy;
            mdVSVertex.sx = mdVSFrame.sx;
            mdVSVertex.sy = mdVSFrame.sy;
            mdVSVertex = preset.pixel_eqs(mdVSVertex);
          }

          var warp = mdVSVertex.warp;
          var zoom = mdVSVertex.zoom;
          var zoomExp = mdVSVertex.zoomexp;
          var cx = mdVSVertex.cx;
          var cy = mdVSVertex.cy;
          var sx = mdVSVertex.sx;
          var sy = mdVSVertex.sy;
          var dx = mdVSVertex.dx;
          var dy = mdVSVertex.dy;
          var rot = mdVSVertex.rot;
          var zoom2V = Math.pow(zoom, Math.pow(zoomExp, rad * 2.0 - 1.0));
          var zoom2Inv = 1.0 / zoom2V;
          var u = x * 0.5 * aspectx * zoom2Inv + 0.5;
          var v = -y * 0.5 * aspecty * zoom2Inv + 0.5;
          u = (u - cx) / sx + cx;
          v = (v - cy) / sy + cy;

          if (warp !== 0) {
            u += warp * 0.0035 * Math.sin(warpTimeV * 0.333 + warpScaleInv * (x * warpf0 - y * warpf3));
            v += warp * 0.0035 * Math.cos(warpTimeV * 0.375 - warpScaleInv * (x * warpf2 + y * warpf1));
            u += warp * 0.0035 * Math.cos(warpTimeV * 0.753 - warpScaleInv * (x * warpf1 - y * warpf2));
            v += warp * 0.0035 * Math.sin(warpTimeV * 0.825 + warpScaleInv * (x * warpf0 + y * warpf3));
          }

          var u2 = u - cx;
          var v2 = v - cy;
          var cosRot = Math.cos(rot);
          var sinRot = Math.sin(rot);
          u = u2 * cosRot - v2 * sinRot + cx;
          v = u2 * sinRot + v2 * cosRot + cy;
          u -= dx;
          v -= dy;
          u = (u - 0.5) / aspectx + 0.5;
          v = (v - 0.5) / aspecty + 0.5;
          u += texelOffsetX;
          v += texelOffsetY;

          if (!blending) {
            this.warpUVs[offset] = u;
            this.warpUVs[offset + 1] = v;
            this.warpColor[offsetColor + 0] = 1;
            this.warpColor[offsetColor + 1] = 1;
            this.warpColor[offsetColor + 2] = 1;
            this.warpColor[offsetColor + 3] = 1;
          } else {
            var mix2 = this.blendPattern.vertInfoA[offset / 2] * this.blendProgress + this.blendPattern.vertInfoC[offset / 2];
            mix2 = Math.clamp(mix2, 0, 1);
            this.warpUVs[offset] = this.warpUVs[offset] * mix2 + u * (1 - mix2);
            this.warpUVs[offset + 1] = this.warpUVs[offset + 1] * mix2 + v * (1 - mix2);
            this.warpColor[offsetColor + 0] = 1;
            this.warpColor[offsetColor + 1] = 1;
            this.warpColor[offsetColor + 2] = 1;
            this.warpColor[offsetColor + 3] = mix2;
          }

          offset += 2;
          offsetColor += 4;
        }
      }

      this.mdVSVertex = mdVSVertex;
    }
  }, {
    key: "bindFrambufferAndSetViewport",
    value: function bindFrambufferAndSetViewport(fb, width, height) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.gl.viewport(0, 0, width, height);
    }
  }, {
    key: "bindFrameBufferTexture",
    value: function bindFrameBufferTexture(targetFrameBuffer, targetTexture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, targetTexture);
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.texsizeX, this.texsizeY, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(this.texsizeX * this.texsizeY * 4));
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      if (this.anisoExt) {
        var max = this.gl.getParameter(this.anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, targetFrameBuffer);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, targetTexture, 0);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          audioLevels = _ref.audioLevels,
          elapsedTime = _ref.elapsedTime;

      this.calcTimeAndFPS(elapsedTime);
      this.frameNum += 1;

      if (audioLevels) {
        this.audio.updateAudio(audioLevels.timeByteArray, audioLevels.timeByteArrayL, audioLevels.timeByteArrayR);
      } else {
        this.audio.sampleAudio();
      }

      this.audioLevels.updateAudioLevels(this.fps, this.frameNum);
      var globalVars = {
        frame: this.frameNum,
        time: this.time,
        fps: this.fps,
        bass: this.audioLevels.bass,
        bass_att: this.audioLevels.bass_att,
        mid: this.audioLevels.mid,
        mid_att: this.audioLevels.mid_att,
        treb: this.audioLevels.treb,
        treb_att: this.audioLevels.treb_att,
        meshx: this.mesh_width,
        meshy: this.mesh_height,
        aspectx: this.invAspectx,
        aspecty: this.invAspecty,
        pixelsx: this.texsizeX,
        pixelsy: this.texsizeY
      };
      var prevGlobalVars = Object.assign({}, globalVars);
      prevGlobalVars.gmegabuf = this.prevPresetEquationRunner.gmegabuf;
      globalVars.gmegabuf = this.presetEquationRunner.gmegabuf;
      Object.assign(globalVars, this.regVars);
      this.presetEquationRunner.runFrameEquations(globalVars);
      var mdVSFrame = this.presetEquationRunner.mdVSFrame;
      this.runPixelEquations(this.presetEquationRunner.preset, mdVSFrame, this.presetEquationRunner.runVertEQs, false);
      Object.assign(this.regVars, _utils__WEBPACK_IMPORTED_MODULE_18__["default"].pick(this.mdVSVertex, this.regs));
      Object.assign(globalVars, this.regVars);
      var mdVSFrameMixed;

      if (this.blending) {
        this.prevPresetEquationRunner.runFrameEquations(prevGlobalVars);
        this.runPixelEquations(this.prevPresetEquationRunner.preset, this.prevPresetEquationRunner.mdVSFrame, this.prevPresetEquationRunner.runVertEQs, true);
        mdVSFrameMixed = Renderer.mixFrameEquations(this.blendProgress, mdVSFrame, this.prevPresetEquationRunner.mdVSFrame);
      } else {
        mdVSFrameMixed = mdVSFrame;
      }

      var swapTexture = this.targetTexture;
      this.targetTexture = this.prevTexture;
      this.prevTexture = swapTexture;
      var swapFrameBuffer = this.targetFrameBuffer;
      this.targetFrameBuffer = this.prevFrameBuffer;
      this.prevFrameBuffer = swapFrameBuffer;
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.prevTexture);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.bindFrambufferAndSetViewport(this.targetFrameBuffer, this.texsizeX, this.texsizeY);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendEquation(this.gl.FUNC_ADD);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      var _Renderer$getBlurValu = Renderer.getBlurValues(mdVSFrameMixed),
          blurMins = _Renderer$getBlurValu.blurMins,
          blurMaxs = _Renderer$getBlurValu.blurMaxs;

      if (!this.blending) {
        this.warpShader.renderQuadTexture(false, this.prevTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, mdVSFrame, this.warpUVs, this.warpColor);
      } else {
        this.prevWarpShader.renderQuadTexture(false, this.prevTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, this.prevPresetEquationRunner.mdVSFrame, this.warpUVs, this.warpColor);
        this.warpShader.renderQuadTexture(true, this.prevTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, mdVSFrameMixed, this.warpUVs, this.warpColor);
      }

      if (this.numBlurPasses > 0) {
        this.blurShader1.renderBlurTexture(this.targetTexture, mdVSFrame, blurMins, blurMaxs);

        if (this.numBlurPasses > 1) {
          this.blurShader2.renderBlurTexture(this.blurTexture1, mdVSFrame, blurMins, blurMaxs);

          if (this.numBlurPasses > 2) {
            this.blurShader3.renderBlurTexture(this.blurTexture2, mdVSFrame, blurMins, blurMaxs);
          }
        } // rebind target texture framebuffer


        this.bindFrambufferAndSetViewport(this.targetFrameBuffer, this.texsizeX, this.texsizeY);
      }

      this.motionVectors.drawMotionVectors(mdVSFrameMixed, this.warpUVs);

      if (this.preset.shapes && this.preset.shapes.length > 0) {
        this.customShapes.forEach(function (shape, i) {
          shape.drawCustomShape(_this.blending ? _this.blendProgress : 1, globalVars, _this.presetEquationRunner, _this.preset.shapes[i], _this.prevTexture);
        });
      }

      if (this.preset.waves && this.preset.waves.length > 0) {
        this.customWaveforms.forEach(function (waveform, i) {
          waveform.drawCustomWaveform(_this.blending ? _this.blendProgress : 1, _this.audio.timeArrayL, _this.audio.timeArrayR, _this.audio.freqArrayL, _this.audio.freqArrayR, globalVars, _this.presetEquationRunner, _this.preset.waves[i]);
        });
      }

      if (this.blending) {
        if (this.prevPreset.shapes && this.prevPreset.shapes.length > 0) {
          this.prevCustomShapes.forEach(function (shape, i) {
            shape.drawCustomShape(1.0 - _this.blendProgress, prevGlobalVars, _this.prevPresetEquationRunner, _this.prevPreset.shapes[i], _this.prevTexture);
          });
        }

        if (this.prevPreset.waves && this.prevPreset.waves.length > 0) {
          this.prevCustomWaveforms.forEach(function (waveform, i) {
            waveform.drawCustomWaveform(1.0 - _this.blendProgress, _this.audio.timeArrayL, _this.audio.timeArrayR, _this.audio.freqArrayL, _this.audio.freqArrayR, prevGlobalVars, _this.prevPresetEquationRunner, _this.prevPreset.waves[i]);
          });
        }
      }

      this.basicWaveform.drawBasicWaveform(this.blending, this.blendProgress, this.audio.timeArrayL, this.audio.timeArrayR, mdVSFrameMixed);
      this.darkenCenter.drawDarkenCenter(mdVSFrameMixed);
      var outerColor = [mdVSFrameMixed.ob_r, mdVSFrameMixed.ob_g, mdVSFrameMixed.ob_b, mdVSFrameMixed.ob_a];
      this.outerBorder.drawBorder(outerColor, mdVSFrameMixed.ob_size, 0);
      var innerColor = [mdVSFrameMixed.ib_r, mdVSFrameMixed.ib_g, mdVSFrameMixed.ib_b, mdVSFrameMixed.ib_a];
      this.innerBorder.drawBorder(innerColor, mdVSFrameMixed.ib_size, mdVSFrameMixed.ob_size);

      if (this.supertext.startTime >= 0) {
        var progress = (this.time - this.supertext.startTime) / this.supertext.duration;

        if (progress >= 1) {
          this.titleText.renderTitle(progress, true, globalVars);
        }
      } // Store variables in case we need to rerender


      this.globalVars = globalVars;
      this.mdVSFrame = mdVSFrame;
      this.mdVSFrameMixed = mdVSFrameMixed;
      this.renderToScreen();
    }
  }, {
    key: "renderToScreen",
    value: function renderToScreen() {
      if (this.outputFXAA) {
        this.bindFrambufferAndSetViewport(this.compFrameBuffer, this.texsizeX, this.texsizeY);
      } else {
        this.bindFrambufferAndSetViewport(null, this.width, this.height);
      }

      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendEquation(this.gl.FUNC_ADD);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      var _Renderer$getBlurValu2 = Renderer.getBlurValues(this.mdVSFrameMixed),
          blurMins = _Renderer$getBlurValu2.blurMins,
          blurMaxs = _Renderer$getBlurValu2.blurMaxs;

      if (!this.blending) {
        this.compShader.renderQuadTexture(false, this.targetTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, this.mdVSFrame, this.warpColor);
      } else {
        this.prevCompShader.renderQuadTexture(false, this.targetTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, this.prevPresetEquationRunner.mdVSFrame, this.warpColor);
        this.compShader.renderQuadTexture(true, this.targetTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, this.mdVSFrameMixed, this.warpColor);
      }

      if (this.supertext.startTime >= 0) {
        var progress = (this.time - this.supertext.startTime) / this.supertext.duration;
        this.titleText.renderTitle(progress, false, this.globalVars);

        if (progress >= 1) {
          this.supertext.startTime = -1;
        }
      }

      if (this.outputFXAA) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.compTexture);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.bindFrambufferAndSetViewport(null, this.width, this.height);
        this.outputShader.renderQuadTexture(this.compTexture);
      }
    }
  }, {
    key: "launchSongTitleAnim",
    value: function launchSongTitleAnim(text) {
      this.supertext = {
        startTime: this.time,
        duration: 1.7
      };
      this.titleText.generateTitleTexture(text);
    }
  }, {
    key: "toDataURL",
    value: function toDataURL() {
      var _this2 = this;

      var data = new Uint8Array(this.texsizeX * this.texsizeY * 4);
      var compFrameBuffer = this.gl.createFramebuffer();
      var compTexture = this.gl.createTexture();
      this.bindFrameBufferTexture(compFrameBuffer, compTexture);

      var _Renderer$getBlurValu3 = Renderer.getBlurValues(this.mdVSFrameMixed),
          blurMins = _Renderer$getBlurValu3.blurMins,
          blurMaxs = _Renderer$getBlurValu3.blurMaxs;

      this.compShader.renderQuadTexture(false, this.targetTexture, this.blurTexture1, this.blurTexture2, this.blurTexture3, blurMins, blurMaxs, this.mdVSFrame, this.warpColor);
      this.gl.readPixels(0, 0, this.texsizeX, this.texsizeY, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data); // flip data

      Array.from({
        length: this.texsizeY
      }, function (val, i) {
        return data.slice(i * _this2.texsizeX * 4, (i + 1) * _this2.texsizeX * 4);
      }).forEach(function (val, i) {
        return data.set(val, (_this2.texsizeY - i - 1) * _this2.texsizeX * 4);
      });
      var canvas = document.createElement('canvas');
      canvas.width = this.texsizeX;
      canvas.height = this.texsizeY;
      var context = canvas.getContext('2d');
      var imageData = context.createImageData(this.texsizeX, this.texsizeY);
      imageData.data.set(data);
      context.putImageData(imageData, 0, 0);
      this.gl.deleteTexture(compTexture);
      this.gl.deleteFramebuffer(compFrameBuffer);
      return canvas.toDataURL();
    }
  }, {
    key: "warpBufferToDataURL",
    value: function warpBufferToDataURL() {
      var data = new Uint8Array(this.texsizeX * this.texsizeY * 4);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.targetFrameBuffer);
      this.gl.readPixels(0, 0, this.texsizeX, this.texsizeY, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
      var canvas = document.createElement('canvas');
      canvas.width = this.texsizeX;
      canvas.height = this.texsizeY;
      var context = canvas.getContext('2d');
      var imageData = context.createImageData(this.texsizeX, this.texsizeY);
      imageData.data.set(data);
      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }
  }], [{
    key: "getHighestBlur",
    value: function getHighestBlur(t) {
      if (/sampler_blur3/.test(t)) {
        return 3;
      } else if (/sampler_blur2/.test(t)) {
        return 2;
      } else if (/sampler_blur1/.test(t)) {
        return 1;
      }

      return 0;
    }
  }, {
    key: "mixFrameEquations",
    value: function mixFrameEquations(blendProgress, mdVSFrame, mdVSFramePrev) {
      var mix = 0.5 - 0.5 * Math.cos(blendProgress * Math.PI);
      var mix2 = 1 - mix;
      var snapPoint = 0.5;
      var mixedFrame = _utils__WEBPACK_IMPORTED_MODULE_18__["default"].cloneVars(mdVSFrame);
      mixedFrame.decay = mix * mdVSFrame.decay + mix2 * mdVSFramePrev.decay;
      mixedFrame.wave_a = mix * mdVSFrame.wave_a + mix2 * mdVSFramePrev.wave_a;
      mixedFrame.wave_r = mix * mdVSFrame.wave_r + mix2 * mdVSFramePrev.wave_r;
      mixedFrame.wave_g = mix * mdVSFrame.wave_g + mix2 * mdVSFramePrev.wave_g;
      mixedFrame.wave_b = mix * mdVSFrame.wave_b + mix2 * mdVSFramePrev.wave_b;
      mixedFrame.wave_x = mix * mdVSFrame.wave_x + mix2 * mdVSFramePrev.wave_x;
      mixedFrame.wave_y = mix * mdVSFrame.wave_y + mix2 * mdVSFramePrev.wave_y;
      mixedFrame.wave_mystery = mix * mdVSFrame.wave_mystery + mix2 * mdVSFramePrev.wave_mystery;
      mixedFrame.ob_size = mix * mdVSFrame.ob_size + mix2 * mdVSFramePrev.ob_size;
      mixedFrame.ob_r = mix * mdVSFrame.ob_r + mix2 * mdVSFramePrev.ob_r;
      mixedFrame.ob_g = mix * mdVSFrame.ob_g + mix2 * mdVSFramePrev.ob_g;
      mixedFrame.ob_b = mix * mdVSFrame.ob_b + mix2 * mdVSFramePrev.ob_b;
      mixedFrame.ob_a = mix * mdVSFrame.ob_a + mix2 * mdVSFramePrev.ob_a;
      mixedFrame.ib_size = mix * mdVSFrame.ib_size + mix2 * mdVSFramePrev.ib_size;
      mixedFrame.ib_r = mix * mdVSFrame.ib_r + mix2 * mdVSFramePrev.ib_r;
      mixedFrame.ib_g = mix * mdVSFrame.ib_g + mix2 * mdVSFramePrev.ib_g;
      mixedFrame.ib_b = mix * mdVSFrame.ib_b + mix2 * mdVSFramePrev.ib_b;
      mixedFrame.ib_a = mix * mdVSFrame.ib_a + mix2 * mdVSFramePrev.ib_a;
      mixedFrame.mv_x = mix * mdVSFrame.mv_x + mix2 * mdVSFramePrev.mv_x;
      mixedFrame.mv_y = mix * mdVSFrame.mv_y + mix2 * mdVSFramePrev.mv_y;
      mixedFrame.mv_dx = mix * mdVSFrame.mv_dx + mix2 * mdVSFramePrev.mv_dx;
      mixedFrame.mv_dy = mix * mdVSFrame.mv_dy + mix2 * mdVSFramePrev.mv_dy;
      mixedFrame.mv_l = mix * mdVSFrame.mv_l + mix2 * mdVSFramePrev.mv_l;
      mixedFrame.mv_r = mix * mdVSFrame.mv_r + mix2 * mdVSFramePrev.mv_r;
      mixedFrame.mv_g = mix * mdVSFrame.mv_g + mix2 * mdVSFramePrev.mv_g;
      mixedFrame.mv_b = mix * mdVSFrame.mv_b + mix2 * mdVSFramePrev.mv_b;
      mixedFrame.mv_a = mix * mdVSFrame.mv_a + mix2 * mdVSFramePrev.mv_a;
      mixedFrame.echo_zoom = mix * mdVSFrame.echo_zoom + mix2 * mdVSFramePrev.echo_zoom;
      mixedFrame.echo_alpha = mix * mdVSFrame.echo_alpha + mix2 * mdVSFramePrev.echo_alpha;
      mixedFrame.echo_orient = mix * mdVSFrame.echo_orient + mix2 * mdVSFramePrev.echo_orient;
      mixedFrame.wave_dots = mix < snapPoint ? mdVSFramePrev.wave_dots : mdVSFrame.wave_dots;
      mixedFrame.wave_thick = mix < snapPoint ? mdVSFramePrev.wave_thick : mdVSFrame.wave_thick;
      mixedFrame.additivewave = mix < snapPoint ? mdVSFramePrev.additivewave : mdVSFrame.additivewave;
      mixedFrame.wave_brighten = mix < snapPoint ? mdVSFramePrev.wave_brighten : mdVSFrame.wave_brighten;
      mixedFrame.darken_center = mix < snapPoint ? mdVSFramePrev.darken_center : mdVSFrame.darken_center;
      mixedFrame.gammaadj = mix < snapPoint ? mdVSFramePrev.gammaadj : mdVSFrame.gammaadj;
      mixedFrame.wrap = mix < snapPoint ? mdVSFramePrev.wrap : mdVSFrame.wrap;
      mixedFrame.invert = mix < snapPoint ? mdVSFramePrev.invert : mdVSFrame.invert;
      mixedFrame.brighten = mix < snapPoint ? mdVSFramePrev.brighten : mdVSFrame.brighten;
      mixedFrame.darken = mix < snapPoint ? mdVSFramePrev.darken : mdVSFrame.darken;
      mixedFrame.solarize = mix < snapPoint ? mdVSFramePrev.brighten : mdVSFrame.solarize;
      mixedFrame.b1n = mix * mdVSFrame.b1n + mix2 * mdVSFramePrev.b1n;
      mixedFrame.b2n = mix * mdVSFrame.b2n + mix2 * mdVSFramePrev.b2n;
      mixedFrame.b3n = mix * mdVSFrame.b3n + mix2 * mdVSFramePrev.b3n;
      mixedFrame.b1x = mix * mdVSFrame.b1x + mix2 * mdVSFramePrev.b1x;
      mixedFrame.b2x = mix * mdVSFrame.b2x + mix2 * mdVSFramePrev.b2x;
      mixedFrame.b3x = mix * mdVSFrame.b3x + mix2 * mdVSFramePrev.b3x;
      mixedFrame.b1ed = mix * mdVSFrame.b1ed + mix2 * mdVSFramePrev.b1ed;
      return mixedFrame;
    }
  }, {
    key: "getBlurValues",
    value: function getBlurValues(mdVSFrame) {
      var blurMin1 = mdVSFrame.b1n;
      var blurMin2 = mdVSFrame.b2n;
      var blurMin3 = mdVSFrame.b3n;
      var blurMax1 = mdVSFrame.b1x;
      var blurMax2 = mdVSFrame.b2x;
      var blurMax3 = mdVSFrame.b3x;
      var fMinDist = 0.1;

      if (blurMax1 - blurMin1 < fMinDist) {
        var avg = (blurMin1 + blurMax1) * 0.5;
        blurMin1 = avg - fMinDist * 0.5;
        blurMax1 = avg - fMinDist * 0.5;
      }

      blurMax2 = Math.min(blurMax1, blurMax2);
      blurMin2 = Math.max(blurMin1, blurMin2);

      if (blurMax2 - blurMin2 < fMinDist) {
        var _avg = (blurMin2 + blurMax2) * 0.5;

        blurMin2 = _avg - fMinDist * 0.5;
        blurMax2 = _avg - fMinDist * 0.5;
      }

      blurMax3 = Math.min(blurMax2, blurMax3);
      blurMin3 = Math.max(blurMin2, blurMin3);

      if (blurMax3 - blurMin3 < fMinDist) {
        var _avg2 = (blurMin3 + blurMax3) * 0.5;

        blurMin3 = _avg2 - fMinDist * 0.5;
        blurMax3 = _avg2 - fMinDist * 0.5;
      }

      return {
        blurMins: [blurMin1, blurMin2, blurMin3],
        blurMaxs: [blurMax1, blurMax2, blurMax3]
      };
    }
  }]);

  return Renderer;
}();



/***/ }),

/***/ "./src/rendering/shaders/blur/blur.js":
/*!********************************************!*\
  !*** ./src/rendering/shaders/blur/blur.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlurShader; });
/* harmony import */ var _blurVertical__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blurVertical */ "./src/rendering/shaders/blur/blurVertical.js");
/* harmony import */ var _blurHorizontal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blurHorizontal */ "./src/rendering/shaders/blur/blurHorizontal.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var BlurShader =
/*#__PURE__*/
function () {
  function BlurShader(blurLevel, blurRatios, gl) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, BlurShader);

    this.blurLevel = blurLevel;
    this.blurRatios = blurRatios;
    this.gl = gl;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.anisoExt = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    this.blurHorizontalFrameBuffer = this.gl.createFramebuffer();
    this.blurVerticalFrameBuffer = this.gl.createFramebuffer();
    this.blurHorizontalTexture = this.gl.createTexture();
    this.blurVerticalTexture = this.gl.createTexture();
    this.setupFrameBufferTextures();
    this.blurHorizontal = new _blurHorizontal__WEBPACK_IMPORTED_MODULE_1__["default"](gl, this.blurLevel, opts);
    this.blurVertical = new _blurVertical__WEBPACK_IMPORTED_MODULE_0__["default"](gl, this.blurLevel, opts);
  }

  _createClass(BlurShader, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.setupFrameBufferTextures();
    }
  }, {
    key: "getTextureSize",
    value: function getTextureSize(sizeRatio) {
      var sizeX = Math.max(this.texsizeX * sizeRatio, 16);
      sizeX = Math.floor((sizeX + 3) / 16) * 16;
      var sizeY = Math.max(this.texsizeY * sizeRatio, 16);
      sizeY = Math.floor((sizeY + 3) / 4) * 4;
      return [sizeX, sizeY];
    }
  }, {
    key: "setupFrameBufferTextures",
    value: function setupFrameBufferTextures() {
      var srcBlurRatios = this.blurLevel > 0 ? this.blurRatios[this.blurLevel - 1] : [1, 1];
      var dstBlurRatios = this.blurRatios[this.blurLevel];
      var srcTexsizeHorizontal = this.getTextureSize(srcBlurRatios[1]);
      var dstTexsizeHorizontal = this.getTextureSize(dstBlurRatios[0]);
      this.bindFrameBufferTexture(this.blurHorizontalFrameBuffer, this.blurHorizontalTexture, dstTexsizeHorizontal);
      var srcTexsizeVertical = dstTexsizeHorizontal;
      var dstTexsizeVertical = this.getTextureSize(dstBlurRatios[1]);
      this.bindFrameBufferTexture(this.blurVerticalFrameBuffer, this.blurVerticalTexture, dstTexsizeVertical);
      this.horizontalTexsizes = [srcTexsizeHorizontal, dstTexsizeHorizontal];
      this.verticalTexsizes = [srcTexsizeVertical, dstTexsizeVertical];
    }
  }, {
    key: "bindFrambufferAndSetViewport",
    value: function bindFrambufferAndSetViewport(fb, texsize) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.gl.viewport(0, 0, texsize[0], texsize[1]);
    }
  }, {
    key: "bindFrameBufferTexture",
    value: function bindFrameBufferTexture(targetFrameBuffer, targetTexture, texsize) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, targetTexture);
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texsize[0], texsize[1], 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(texsize[0] * texsize[1] * 4));
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      if (this.anisoExt) {
        var max = this.gl.getParameter(this.anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, targetFrameBuffer);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, targetTexture, 0);
    }
  }, {
    key: "renderBlurTexture",
    value: function renderBlurTexture(prevTexture, mdVSFrame, blurMins, blurMaxs) {
      this.bindFrambufferAndSetViewport(this.blurHorizontalFrameBuffer, this.horizontalTexsizes[1]);
      this.blurHorizontal.renderQuadTexture(prevTexture, mdVSFrame, blurMins, blurMaxs, this.horizontalTexsizes[0]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurHorizontalTexture);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.bindFrambufferAndSetViewport(this.blurVerticalFrameBuffer, this.verticalTexsizes[1]);
      this.blurVertical.renderQuadTexture(this.blurHorizontalTexture, mdVSFrame, this.verticalTexsizes[0]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurVerticalTexture);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }
  }]);

  return BlurShader;
}();



/***/ }),

/***/ "./src/rendering/shaders/blur/blurHorizontal.js":
/*!******************************************************!*\
  !*** ./src/rendering/shaders/blur/blurHorizontal.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlurHorizontal; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var BlurHorizontal =
/*#__PURE__*/
function () {
  function BlurHorizontal(gl, blurLevel) {
    _classCallCheck(this, BlurHorizontal);

    this.gl = gl;
    this.blurLevel = blurLevel;
    var w = [4.0, 3.8, 3.5, 2.9, 1.9, 1.2, 0.7, 0.3];
    var w1H = w[0] + w[1];
    var w2H = w[2] + w[3];
    var w3H = w[4] + w[5];
    var w4H = w[6] + w[7];
    var d1H = 0 + 2 * w[1] / w1H;
    var d2H = 2 + 2 * w[3] / w2H;
    var d3H = 4 + 2 * w[5] / w3H;
    var d4H = 6 + 2 * w[7] / w4H;
    this.ws = new Float32Array([w1H, w2H, w3H, w4H]);
    this.ds = new Float32Array([d1H, d2H, d3H, d4H]);
    this.wDiv = 0.5 / (w1H + w2H + w3H + w4H);
    this.positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.vertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(BlurHorizontal, [{
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      const vec2 halfmad = vec2(0.5);\n                                      in vec2 aPos;\n                                      out vec2 uv;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 0.0, 1.0);\n                                        uv = aPos * halfmad + halfmad;\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 uv;\n       out vec4 fragColor;\n       uniform sampler2D uTexture;\n       uniform vec4 texsize;\n       uniform float scale;\n       uniform float bias;\n       uniform vec4 ws;\n       uniform vec4 ds;\n       uniform float wdiv;\n\n       void main(void) {\n         float w1 = ws[0];\n         float w2 = ws[1];\n         float w3 = ws[2];\n         float w4 = ws[3];\n         float d1 = ds[0];\n         float d2 = ds[1];\n         float d3 = ds[2];\n         float d4 = ds[3];\n\n         vec2 uv2 = uv.xy;\n\n         vec3 blur =\n           ( texture(uTexture, uv2 + vec2( d1 * texsize.z,0.0) ).xyz\n           + texture(uTexture, uv2 + vec2(-d1 * texsize.z,0.0) ).xyz) * w1 +\n           ( texture(uTexture, uv2 + vec2( d2 * texsize.z,0.0) ).xyz\n           + texture(uTexture, uv2 + vec2(-d2 * texsize.z,0.0) ).xyz) * w2 +\n           ( texture(uTexture, uv2 + vec2( d3 * texsize.z,0.0) ).xyz\n           + texture(uTexture, uv2 + vec2(-d3 * texsize.z,0.0) ).xyz) * w3 +\n           ( texture(uTexture, uv2 + vec2( d4 * texsize.z,0.0) ).xyz\n           + texture(uTexture, uv2 + vec2(-d4 * texsize.z,0.0) ).xyz) * w4;\n\n         blur.xyz *= wdiv;\n         blur.xyz = blur.xyz * scale + bias;\n\n         fragColor = vec4(blur, 1.0);\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
      this.texsizeLocation = this.gl.getUniformLocation(this.shaderProgram, 'texsize');
      this.scaleLoc = this.gl.getUniformLocation(this.shaderProgram, 'scale');
      this.biasLoc = this.gl.getUniformLocation(this.shaderProgram, 'bias');
      this.wsLoc = this.gl.getUniformLocation(this.shaderProgram, 'ws');
      this.dsLocation = this.gl.getUniformLocation(this.shaderProgram, 'ds');
      this.wdivLoc = this.gl.getUniformLocation(this.shaderProgram, 'wdiv');
    }
  }, {
    key: "getScaleAndBias",
    value: function getScaleAndBias(blurMins, blurMaxs) {
      var scale = [1, 1, 1];
      var bias = [0, 0, 0];
      var tempMin;
      var tempMax;
      scale[0] = 1.0 / (blurMaxs[0] - blurMins[0]);
      bias[0] = -blurMins[0] * scale[0];
      tempMin = (blurMins[1] - blurMins[0]) / (blurMaxs[0] - blurMins[0]);
      tempMax = (blurMaxs[1] - blurMins[0]) / (blurMaxs[0] - blurMins[0]);
      scale[1] = 1.0 / (tempMax - tempMin);
      bias[1] = -tempMin * scale[1];
      tempMin = (blurMins[2] - blurMins[1]) / (blurMaxs[1] - blurMins[1]);
      tempMax = (blurMaxs[2] - blurMins[1]) / (blurMaxs[1] - blurMins[1]);
      scale[2] = 1.0 / (tempMax - tempMin);
      bias[2] = -tempMin * scale[2];
      return {
        scale: scale[this.blurLevel],
        bias: bias[this.blurLevel]
      };
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(texture, mdVSFrame, blurMins, blurMaxs, srcTexsize) {
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.uniform1i(this.textureLoc, 0);

      var _this$getScaleAndBias = this.getScaleAndBias(blurMins, blurMaxs),
          scale = _this$getScaleAndBias.scale,
          bias = _this$getScaleAndBias.bias;

      this.gl.uniform4fv(this.texsizeLocation, [srcTexsize[0], srcTexsize[1], 1.0 / srcTexsize[0], 1.0 / srcTexsize[1]]);
      this.gl.uniform1f(this.scaleLoc, scale);
      this.gl.uniform1f(this.biasLoc, bias);
      this.gl.uniform4fv(this.wsLoc, this.ws);
      this.gl.uniform4fv(this.dsLocation, this.ds);
      this.gl.uniform1f(this.wdivLoc, this.wDiv);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }]);

  return BlurHorizontal;
}();



/***/ }),

/***/ "./src/rendering/shaders/blur/blurVertical.js":
/*!****************************************************!*\
  !*** ./src/rendering/shaders/blur/blurVertical.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlurVertical; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var BlurVertical =
/*#__PURE__*/
function () {
  function BlurVertical(gl, blurLevel) {
    _classCallCheck(this, BlurVertical);

    this.gl = gl;
    this.blurLevel = blurLevel;
    var w = [4.0, 3.8, 3.5, 2.9, 1.9, 1.2, 0.7, 0.3];
    var w1V = w[0] + w[1] + w[2] + w[3];
    var w2V = w[4] + w[5] + w[6] + w[7];
    var d1V = 0 + 2 * ((w[2] + w[3]) / w1V);
    var d2V = 2 + 2 * ((w[6] + w[7]) / w2V);
    this.wds = new Float32Array([w1V, w2V, d1V, d2V]);
    this.wDiv = 1.0 / ((w1V + w2V) * 2);
    this.positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.vertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(BlurVertical, [{
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      const vec2 halfmad = vec2(0.5);\n                                      in vec2 aPos;\n                                      out vec2 uv;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 0.0, 1.0);\n                                        uv = aPos * halfmad + halfmad;\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 uv;\n       out vec4 fragColor;\n       uniform sampler2D uTexture;\n       uniform vec4 texsize;\n       uniform float ed1;\n       uniform float ed2;\n       uniform float ed3;\n       uniform vec4 wds;\n       uniform float wdiv;\n\n       void main(void) {\n         float w1 = wds[0];\n         float w2 = wds[1];\n         float d1 = wds[2];\n         float d2 = wds[3];\n\n         vec2 uv2 = uv.xy;\n\n         vec3 blur =\n           ( texture(uTexture, uv2 + vec2(0.0, d1 * texsize.w) ).xyz\n           + texture(uTexture, uv2 + vec2(0.0,-d1 * texsize.w) ).xyz) * w1 +\n           ( texture(uTexture, uv2 + vec2(0.0, d2 * texsize.w) ).xyz\n           + texture(uTexture, uv2 + vec2(0.0,-d2 * texsize.w) ).xyz) * w2;\n\n         blur.xyz *= wdiv;\n\n         float t = min(min(uv.x, uv.y), 1.0 - max(uv.x, uv.y));\n         t = sqrt(t);\n         t = ed1 + ed2 * clamp(t * ed3, 0.0, 1.0);\n         blur.xyz *= t;\n\n         fragColor = vec4(blur, 1.0);\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
      this.texsizeLocation = this.gl.getUniformLocation(this.shaderProgram, 'texsize');
      this.ed1Loc = this.gl.getUniformLocation(this.shaderProgram, 'ed1');
      this.ed2Loc = this.gl.getUniformLocation(this.shaderProgram, 'ed2');
      this.ed3Loc = this.gl.getUniformLocation(this.shaderProgram, 'ed3');
      this.wdsLocation = this.gl.getUniformLocation(this.shaderProgram, 'wds');
      this.wdivLoc = this.gl.getUniformLocation(this.shaderProgram, 'wdiv');
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(texture, mdVSFrame, srcTexsize) {
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.uniform1i(this.textureLoc, 0);
      var b1ed = this.blurLevel === 0 ? mdVSFrame.b1ed : 0.0;
      this.gl.uniform4fv(this.texsizeLocation, [srcTexsize[0], srcTexsize[1], 1.0 / srcTexsize[0], 1.0 / srcTexsize[1]]);
      this.gl.uniform1f(this.ed1Loc, 1.0 - b1ed);
      this.gl.uniform1f(this.ed2Loc, b1ed);
      this.gl.uniform1f(this.ed3Loc, 5.0);
      this.gl.uniform4fv(this.wdsLocation, this.wds);
      this.gl.uniform1f(this.wdivLoc, this.wDiv);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }]);

  return BlurVertical;
}();



/***/ }),

/***/ "./src/rendering/shaders/comp.js":
/*!***************************************!*\
  !*** ./src/rendering/shaders/comp.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CompShader; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var CompShader =
/*#__PURE__*/
function () {
  function CompShader(gl, noise, image) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, CompShader);

    this.gl = gl;
    this.noise = noise;
    this.image = image;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.compWidth = 32;
    this.compHeight = 24;
    this.buildPositions();
    this.indexBuf = gl.createBuffer();
    this.positionVertexBuf = this.gl.createBuffer();
    this.compColorVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
    this.mainSampler = this.gl.createSampler();
    this.mainSamplerFW = this.gl.createSampler();
    this.mainSamplerFC = this.gl.createSampler();
    this.mainSamplerPW = this.gl.createSampler();
    this.mainSamplerPC = this.gl.createSampler();
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  } // based on https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js


  _createClass(CompShader, [{
    key: "buildPositions",
    value: function buildPositions() {
      var width = 2;
      var height = 2;
      var widthHalf = width / 2;
      var heightHalf = height / 2;
      var gridX = this.compWidth;
      var gridY = this.compHeight;
      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;
      var segmentWidth = width / gridX;
      var segmentHeight = height / gridY;
      var vertices = [];

      for (var iy = 0; iy < gridY1; iy++) {
        var y = iy * segmentHeight - heightHalf;

        for (var ix = 0; ix < gridX1; ix++) {
          var x = ix * segmentWidth - widthHalf;
          vertices.push(x, -y, 0);
        }
      }

      var indices = [];

      for (var _iy = 0; _iy < gridY; _iy++) {
        for (var _ix = 0; _ix < gridX; _ix++) {
          var a = _ix + gridX1 * _iy;
          var b = _ix + gridX1 * (_iy + 1);
          var c = _ix + 1 + gridX1 * (_iy + 1);
          var d = _ix + 1 + gridX1 * _iy;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      this.vertices = new Float32Array(vertices);
      this.indices = new Uint16Array(indices);
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
      this.buildPositions();
    }
  }, {
    key: "createShader",
    value: function createShader() {
      var shaderText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var fragShaderText;
      var fragShaderHeaderText;

      if (shaderText.length === 0) {
        fragShaderText = "float orient_horiz = mod(echo_orientation, 2.0);\n                        float orient_x = (orient_horiz != 0.0) ? -1.0 : 1.0;\n                        float orient_y = (echo_orientation >= 2.0) ? -1.0 : 1.0;\n                        vec2 uv_echo = ((uv - 0.5) *\n                                        (1.0 / echo_zoom) *\n                                        vec2(orient_x, orient_y)) + 0.5;\n\n                        ret = mix(texture(sampler_main, uv).rgb,\n                                  texture(sampler_main, uv_echo).rgb,\n                                  echo_alpha);\n\n                        ret *= gammaAdj;\n\n                        if(fShader >= 1.0) {\n                          ret *= hue_shader;\n                        } else if(fShader > 0.001) {\n                          ret *= (1.0 - fShader) + (fShader * hue_shader);\n                        }\n\n                        if(brighten != 0) ret = sqrt(ret);\n                        if(darken != 0) ret = ret*ret;\n                        if(solarize != 0) ret = ret * (1.0 - ret) * 4.0;\n                        if(invert != 0) ret = 1.0 - ret;";
        fragShaderHeaderText = '';
      } else {
        var shaderParts = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getShaderParts(shaderText);
        fragShaderHeaderText = shaderParts[0];
        fragShaderText = shaderParts[1];
      }

      fragShaderText = fragShaderText.replace(/texture2D/g, 'texture');
      fragShaderText = fragShaderText.replace(/texture3D/g, 'texture');
      this.userTextures = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getUserSamplers(fragShaderHeaderText);
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      const vec2 halfmad = vec2(0.5);\n                                      in vec2 aPos;\n                                      in vec4 aCompColor;\n                                      out vec2 vUv;\n                                      out vec4 vColor;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 0.0, 1.0);\n                                        vUv = aPos * halfmad + halfmad;\n                                        vColor = aCompColor;\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      precision mediump sampler3D;\n\n                                      vec3 lum(vec3 v){\n                                          return vec3(dot(v, vec3(0.32,0.49,0.29)));\n                                      }\n\n                                      in vec2 vUv;\n                                      in vec4 vColor;\n                                      out vec4 fragColor;\n                                      uniform sampler2D sampler_main;\n                                      uniform sampler2D sampler_fw_main;\n                                      uniform sampler2D sampler_fc_main;\n                                      uniform sampler2D sampler_pw_main;\n                                      uniform sampler2D sampler_pc_main;\n                                      uniform sampler2D sampler_blur1;\n                                      uniform sampler2D sampler_blur2;\n                                      uniform sampler2D sampler_blur3;\n                                      uniform sampler2D sampler_noise_lq;\n                                      uniform sampler2D sampler_noise_lq_lite;\n                                      uniform sampler2D sampler_noise_mq;\n                                      uniform sampler2D sampler_noise_hq;\n                                      uniform sampler2D sampler_pw_noise_lq;\n                                      uniform sampler3D sampler_noisevol_lq;\n                                      uniform sampler3D sampler_noisevol_hq;\n\n                                      uniform float time;\n                                      uniform float gammaAdj;\n                                      uniform float echo_zoom;\n                                      uniform float echo_alpha;\n                                      uniform float echo_orientation;\n                                      uniform int invert;\n                                      uniform int brighten;\n                                      uniform int darken;\n                                      uniform int solarize;\n                                      uniform vec2 resolution;\n                                      uniform vec4 aspect;\n                                      uniform vec4 texsize;\n                                      uniform vec4 texsize_noise_lq;\n                                      uniform vec4 texsize_noise_mq;\n                                      uniform vec4 texsize_noise_hq;\n                                      uniform vec4 texsize_noise_lq_lite;\n                                      uniform vec4 texsize_noisevol_lq;\n                                      uniform vec4 texsize_noisevol_hq;\n\n                                      uniform float bass;\n                                      uniform float mid;\n                                      uniform float treb;\n                                      uniform float vol;\n                                      uniform float bass_att;\n                                      uniform float mid_att;\n                                      uniform float treb_att;\n                                      uniform float vol_att;\n\n                                      uniform float frame;\n                                      uniform float fps;\n\n                                      uniform vec4 _qa;\n                                      uniform vec4 _qb;\n                                      uniform vec4 _qc;\n                                      uniform vec4 _qd;\n                                      uniform vec4 _qe;\n                                      uniform vec4 _qf;\n                                      uniform vec4 _qg;\n                                      uniform vec4 _qh;\n\n                                      #define q1 _qa.x\n                                      #define q2 _qa.y\n                                      #define q3 _qa.z\n                                      #define q4 _qa.w\n                                      #define q5 _qb.x\n                                      #define q6 _qb.y\n                                      #define q7 _qb.z\n                                      #define q8 _qb.w\n                                      #define q9 _qc.x\n                                      #define q10 _qc.y\n                                      #define q11 _qc.z\n                                      #define q12 _qc.w\n                                      #define q13 _qd.x\n                                      #define q14 _qd.y\n                                      #define q15 _qd.z\n                                      #define q16 _qd.w\n                                      #define q17 _qe.x\n                                      #define q18 _qe.y\n                                      #define q19 _qe.z\n                                      #define q20 _qe.w\n                                      #define q21 _qf.x\n                                      #define q22 _qf.y\n                                      #define q23 _qf.z\n                                      #define q24 _qf.w\n                                      #define q25 _qg.x\n                                      #define q26 _qg.y\n                                      #define q27 _qg.z\n                                      #define q28 _qg.w\n                                      #define q29 _qh.x\n                                      #define q30 _qh.y\n                                      #define q31 _qh.z\n                                      #define q32 _qh.w\n\n                                      uniform vec4 slow_roam_cos;\n                                      uniform vec4 roam_cos;\n                                      uniform vec4 slow_roam_sin;\n                                      uniform vec4 roam_sin;\n\n                                      uniform float blur1_min;\n                                      uniform float blur1_max;\n                                      uniform float blur2_min;\n                                      uniform float blur2_max;\n                                      uniform float blur3_min;\n                                      uniform float blur3_max;\n\n                                      uniform float scale1;\n                                      uniform float scale2;\n                                      uniform float scale3;\n                                      uniform float bias1;\n                                      uniform float bias2;\n                                      uniform float bias3;\n\n                                      uniform vec4 rand_frame;\n                                      uniform vec4 rand_preset;\n\n                                      uniform float fShader;\n\n                                      float PI = ").concat(Math.PI, ";\n\n                                      ").concat(fragShaderHeaderText, "\n\n                                      void main(void) {\n                                        vec3 ret;\n                                        vec2 uv = vUv;\n                                        vec2 uv_orig = vUv;\n                                        uv.y = 1.0 - uv.y;\n                                        uv_orig.y = 1.0 - uv_orig.y;\n                                        float rad = length(uv - 0.5);\n                                        float ang = atan(uv.x - 0.5, uv.y - 0.5);\n                                        vec3 hue_shader = vColor.rgb;\n\n                                        ").concat(fragShaderText, "\n\n                                        fragColor = vec4(ret, vColor.a);\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.compColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aCompColor');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_main');
      this.textureFWLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_fw_main');
      this.textureFCLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_fc_main');
      this.texturePWLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pw_main');
      this.texturePCLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pc_main');
      this.blurTexture1Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur1');
      this.blurTexture2Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur2');
      this.blurTexture3Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur3');
      this.noiseLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_lq');
      this.noiseMQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_mq');
      this.noiseHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_hq');
      this.noiseLQLiteLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_lq_lite');
      this.noisePointLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pw_noise_lq');
      this.noiseVolLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noisevol_lq');
      this.noiseVolHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noisevol_hq');
      this.timeLoc = this.gl.getUniformLocation(this.shaderProgram, 'time');
      this.gammaAdjLoc = this.gl.getUniformLocation(this.shaderProgram, 'gammaAdj');
      this.echoZoomLoc = this.gl.getUniformLocation(this.shaderProgram, 'echo_zoom');
      this.echoAlphaLoc = this.gl.getUniformLocation(this.shaderProgram, 'echo_alpha');
      this.echoOrientationLoc = this.gl.getUniformLocation(this.shaderProgram, 'echo_orientation');
      this.invertLoc = this.gl.getUniformLocation(this.shaderProgram, 'invert');
      this.brightenLoc = this.gl.getUniformLocation(this.shaderProgram, 'brighten');
      this.darkenLoc = this.gl.getUniformLocation(this.shaderProgram, 'darken');
      this.solarizeLoc = this.gl.getUniformLocation(this.shaderProgram, 'solarize');
      this.texsizeLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize');
      this.texsizeNoiseLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_lq');
      this.texsizeNoiseMQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_mq');
      this.texsizeNoiseHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_hq');
      this.texsizeNoiseLQLiteLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_lq_lite');
      this.texsizeNoiseVolLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noisevol_lq');
      this.texsizeNoiseVolHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noisevol_hq');
      this.resolutionLoc = this.gl.getUniformLocation(this.shaderProgram, 'resolution');
      this.aspectLoc = this.gl.getUniformLocation(this.shaderProgram, 'aspect');
      this.bassLoc = this.gl.getUniformLocation(this.shaderProgram, 'bass');
      this.midLoc = this.gl.getUniformLocation(this.shaderProgram, 'mid');
      this.trebLoc = this.gl.getUniformLocation(this.shaderProgram, 'treb');
      this.volLoc = this.gl.getUniformLocation(this.shaderProgram, 'vol');
      this.bassAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'bass_att');
      this.midAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'mid_att');
      this.trebAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'treb_att');
      this.volAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'vol_att');
      this.frameLoc = this.gl.getUniformLocation(this.shaderProgram, 'frame');
      this.fpsLoc = this.gl.getUniformLocation(this.shaderProgram, 'fps');
      this.blur1MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur1_min');
      this.blur1MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur1_max');
      this.blur2MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur2_min');
      this.blur2MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur2_max');
      this.blur3MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur3_min');
      this.blur3MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur3_max');
      this.scale1Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale1');
      this.scale2Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale2');
      this.scale3Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale3');
      this.bias1Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias1');
      this.bias2Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias2');
      this.bias3Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias3');
      this.randPresetLoc = this.gl.getUniformLocation(this.shaderProgram, 'rand_preset');
      this.randFrameLoc = this.gl.getUniformLocation(this.shaderProgram, 'rand_frame');
      this.fShaderLoc = this.gl.getUniformLocation(this.shaderProgram, 'fShader');
      this.qaLoc = this.gl.getUniformLocation(this.shaderProgram, '_qa');
      this.qbLoc = this.gl.getUniformLocation(this.shaderProgram, '_qb');
      this.qcLoc = this.gl.getUniformLocation(this.shaderProgram, '_qc');
      this.qdLoc = this.gl.getUniformLocation(this.shaderProgram, '_qd');
      this.qeLoc = this.gl.getUniformLocation(this.shaderProgram, '_qe');
      this.qfLoc = this.gl.getUniformLocation(this.shaderProgram, '_qf');
      this.qgLoc = this.gl.getUniformLocation(this.shaderProgram, '_qg');
      this.qhLoc = this.gl.getUniformLocation(this.shaderProgram, '_qh');
      this.slowRoamCosLoc = this.gl.getUniformLocation(this.shaderProgram, 'slow_roam_cos');
      this.roamCosLoc = this.gl.getUniformLocation(this.shaderProgram, 'roam_cos');
      this.slowRoamSinLoc = this.gl.getUniformLocation(this.shaderProgram, 'slow_roam_sin');
      this.roamSinLoc = this.gl.getUniformLocation(this.shaderProgram, 'roam_sin');

      for (var i = 0; i < this.userTextures.length; i++) {
        var userTexture = this.userTextures[i];
        userTexture.textureLoc = this.gl.getUniformLocation(this.shaderProgram, "sampler_".concat(userTexture.sampler));
      }
    }
  }, {
    key: "updateShader",
    value: function updateShader(shaderText) {
      this.createShader(shaderText);
    }
  }, {
    key: "bindBlurVals",
    value: function bindBlurVals(blurMins, blurMaxs) {
      var blurMin1 = blurMins[0];
      var blurMin2 = blurMins[1];
      var blurMin3 = blurMins[2];
      var blurMax1 = blurMaxs[0];
      var blurMax2 = blurMaxs[1];
      var blurMax3 = blurMaxs[2];
      var scale1 = blurMax1 - blurMin1;
      var bias1 = blurMin1;
      var scale2 = blurMax2 - blurMin2;
      var bias2 = blurMin2;
      var scale3 = blurMax3 - blurMin3;
      var bias3 = blurMin3;
      this.gl.uniform1f(this.blur1MinLoc, blurMin1);
      this.gl.uniform1f(this.blur1MaxLoc, blurMax1);
      this.gl.uniform1f(this.blur2MinLoc, blurMin2);
      this.gl.uniform1f(this.blur2MaxLoc, blurMax2);
      this.gl.uniform1f(this.blur3MinLoc, blurMin3);
      this.gl.uniform1f(this.blur3MaxLoc, blurMax3);
      this.gl.uniform1f(this.scale1Loc, scale1);
      this.gl.uniform1f(this.scale2Loc, scale2);
      this.gl.uniform1f(this.scale3Loc, scale3);
      this.gl.uniform1f(this.bias1Loc, bias1);
      this.gl.uniform1f(this.bias2Loc, bias2);
      this.gl.uniform1f(this.bias3Loc, bias3);
    }
  }, {
    key: "generateCompColors",
    value: function generateCompColors(blending, mdVSFrame, warpColor) {
      var hueBase = CompShader.generateHueBase(mdVSFrame);
      var gridX1 = this.compWidth + 1;
      var gridY1 = this.compHeight + 1;
      var compColor = new Float32Array(gridX1 * gridY1 * 4);
      var offsetColor = 0;

      for (var j = 0; j < gridY1; j++) {
        for (var i = 0; i < gridX1; i++) {
          var x = i / this.compWidth;
          var y = j / this.compHeight;
          var col = [1, 1, 1];

          for (var c = 0; c < 3; c++) {
            col[c] = hueBase[0 + c] * x * y + hueBase[3 + c] * (1 - x) * y + hueBase[6 + c] * x * (1 - y) + hueBase[9 + c] * (1 - x) * (1 - y);
          }

          var alpha = 1;

          if (blending) {
            x *= this.mesh_width + 1;
            y *= this.mesh_height + 1;
            x = Math.clamp(x, 0, this.mesh_width - 1);
            y = Math.clamp(y, 0, this.mesh_height - 1);
            var nx = Math.floor(x);
            var ny = Math.floor(y);
            var dx = x - nx;
            var dy = y - ny;
            var alpha00 = warpColor[(ny * (this.mesh_width + 1) + nx) * 4 + 3];
            var alpha01 = warpColor[(ny * (this.mesh_width + 1) + (nx + 1)) * 4 + 3];
            var alpha10 = warpColor[((ny + 1) * (this.mesh_width + 1) + nx) * 4 + 3];
            var alpha11 = warpColor[((ny + 1) * (this.mesh_width + 1) + (nx + 1)) * 4 + 3];
            alpha = alpha00 * (1 - dx) * (1 - dy) + alpha01 * dx * (1 - dy) + alpha10 * (1 - dx) * dy + alpha11 * dx * dy;
          }

          compColor[offsetColor + 0] = col[0];
          compColor[offsetColor + 1] = col[1];
          compColor[offsetColor + 2] = col[2];
          compColor[offsetColor + 3] = alpha;
          offsetColor += 4;
        }
      }

      return compColor;
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(blending, texture, blurTexture1, blurTexture2, blurTexture3, blurMins, blurMaxs, mdVSFrame, warpColor) {
      var compColors = this.generateCompColors(blending, mdVSFrame, warpColor);
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.compColorVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, compColors, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.compColorLocation, 4, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.compColorLocation);
      var wrapping = mdVSFrame.wrap !== 0 ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE;
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_S, wrapping);
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_T, wrapping);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(0, this.mainSampler);
      this.gl.uniform1i(this.textureLoc, 0);
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(1, this.mainSamplerFW);
      this.gl.uniform1i(this.textureFWLoc, 1);
      this.gl.activeTexture(this.gl.TEXTURE2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(2, this.mainSamplerFC);
      this.gl.uniform1i(this.textureFCLoc, 2);
      this.gl.activeTexture(this.gl.TEXTURE3);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(3, this.mainSamplerPW);
      this.gl.uniform1i(this.texturePWLoc, 3);
      this.gl.activeTexture(this.gl.TEXTURE4);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(4, this.mainSamplerPC);
      this.gl.uniform1i(this.texturePCLoc, 4);
      this.gl.activeTexture(this.gl.TEXTURE5);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture1);
      this.gl.uniform1i(this.blurTexture1Loc, 5);
      this.gl.activeTexture(this.gl.TEXTURE6);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture2);
      this.gl.uniform1i(this.blurTexture2Loc, 6);
      this.gl.activeTexture(this.gl.TEXTURE7);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture3);
      this.gl.uniform1i(this.blurTexture3Loc, 7);
      this.gl.activeTexture(this.gl.TEXTURE8);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQ);
      this.gl.uniform1i(this.noiseLQLoc, 8);
      this.gl.activeTexture(this.gl.TEXTURE9);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexMQ);
      this.gl.uniform1i(this.noiseMQLoc, 9);
      this.gl.activeTexture(this.gl.TEXTURE10);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexHQ);
      this.gl.uniform1i(this.noiseHQLoc, 10);
      this.gl.activeTexture(this.gl.TEXTURE11);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQLite);
      this.gl.uniform1i(this.noiseLQLiteLoc, 11);
      this.gl.activeTexture(this.gl.TEXTURE12);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQ);
      this.gl.bindSampler(12, this.noise.noiseTexPointLQ);
      this.gl.uniform1i(this.noisePointLQLoc, 12);
      this.gl.activeTexture(this.gl.TEXTURE13);
      this.gl.bindTexture(this.gl.TEXTURE_3D, this.noise.noiseTexVolLQ);
      this.gl.uniform1i(this.noiseVolLQLoc, 13);
      this.gl.activeTexture(this.gl.TEXTURE14);
      this.gl.bindTexture(this.gl.TEXTURE_3D, this.noise.noiseTexVolHQ);
      this.gl.uniform1i(this.noiseVolHQLoc, 14);

      for (var i = 0; i < this.userTextures.length; i++) {
        var userTexture = this.userTextures[i];
        this.gl.activeTexture(this.gl.TEXTURE15 + i);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.image.getTexture(userTexture.sampler));
        this.gl.uniform1i(userTexture.textureLoc, 15 + i);
      }

      this.gl.uniform1f(this.timeLoc, mdVSFrame.time);
      this.gl.uniform1f(this.gammaAdjLoc, mdVSFrame.gammaadj);
      this.gl.uniform1f(this.echoZoomLoc, mdVSFrame.echo_zoom);
      this.gl.uniform1f(this.echoAlphaLoc, mdVSFrame.echo_alpha);
      this.gl.uniform1f(this.echoOrientationLoc, mdVSFrame.echo_orient);
      this.gl.uniform1i(this.invertLoc, mdVSFrame.invert);
      this.gl.uniform1i(this.brightenLoc, mdVSFrame.brighten);
      this.gl.uniform1i(this.darkenLoc, mdVSFrame.darken);
      this.gl.uniform1i(this.solarizeLoc, mdVSFrame.solarize);
      this.gl.uniform2fv(this.resolutionLoc, [this.texsizeX, this.texsizeY]);
      this.gl.uniform4fv(this.aspectLoc, [this.aspectx, this.aspecty, this.invAspectx, this.invAspecty]);
      this.gl.uniform4fv(this.texsizeLoc, new Float32Array([this.texsizeX, this.texsizeY, 1.0 / this.texsizeX, 1.0 / this.texsizeY]));
      this.gl.uniform4fv(this.texsizeNoiseLQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseMQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseHQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseLQLiteLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform4fv(this.texsizeNoiseVolLQLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform4fv(this.texsizeNoiseVolHQLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform1f(this.bassLoc, mdVSFrame.bass);
      this.gl.uniform1f(this.midLoc, mdVSFrame.mid);
      this.gl.uniform1f(this.trebLoc, mdVSFrame.treb);
      this.gl.uniform1f(this.volLoc, (mdVSFrame.bass + mdVSFrame.mid + mdVSFrame.treb) / 3);
      this.gl.uniform1f(this.bassAttLoc, mdVSFrame.bass_att);
      this.gl.uniform1f(this.midAttLoc, mdVSFrame.mid_att);
      this.gl.uniform1f(this.trebAttLoc, mdVSFrame.treb_att);
      this.gl.uniform1f(this.volAttLoc, (mdVSFrame.bass_att + mdVSFrame.mid_att + mdVSFrame.treb_att) / 3);
      this.gl.uniform1f(this.frameLoc, mdVSFrame.frame);
      this.gl.uniform1f(this.fpsLoc, mdVSFrame.fps);
      this.gl.uniform4fv(this.randPresetLoc, mdVSFrame.rand_preset);
      this.gl.uniform4fv(this.randFrameLoc, new Float32Array([Math.random(), Math.random(), Math.random(), Math.random()]));
      this.gl.uniform1f(this.fShaderLoc, mdVSFrame.fshader);
      this.gl.uniform4fv(this.qaLoc, new Float32Array([mdVSFrame.q1 || 0, mdVSFrame.q2 || 0, mdVSFrame.q3 || 0, mdVSFrame.q4 || 0]));
      this.gl.uniform4fv(this.qbLoc, new Float32Array([mdVSFrame.q5 || 0, mdVSFrame.q6 || 0, mdVSFrame.q7 || 0, mdVSFrame.q8 || 0]));
      this.gl.uniform4fv(this.qcLoc, new Float32Array([mdVSFrame.q9 || 0, mdVSFrame.q10 || 0, mdVSFrame.q11 || 0, mdVSFrame.q12 || 0]));
      this.gl.uniform4fv(this.qdLoc, new Float32Array([mdVSFrame.q13 || 0, mdVSFrame.q14 || 0, mdVSFrame.q15 || 0, mdVSFrame.q16 || 0]));
      this.gl.uniform4fv(this.qeLoc, new Float32Array([mdVSFrame.q17 || 0, mdVSFrame.q18 || 0, mdVSFrame.q19 || 0, mdVSFrame.q20 || 0]));
      this.gl.uniform4fv(this.qfLoc, new Float32Array([mdVSFrame.q21 || 0, mdVSFrame.q22 || 0, mdVSFrame.q23 || 0, mdVSFrame.q24 || 0]));
      this.gl.uniform4fv(this.qgLoc, new Float32Array([mdVSFrame.q25 || 0, mdVSFrame.q26 || 0, mdVSFrame.q27 || 0, mdVSFrame.q28 || 0]));
      this.gl.uniform4fv(this.qhLoc, new Float32Array([mdVSFrame.q29 || 0, mdVSFrame.q30 || 0, mdVSFrame.q31 || 0, mdVSFrame.q32 || 0]));
      this.gl.uniform4fv(this.slowRoamCosLoc, [0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.005), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.008), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.013), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.022)]);
      this.gl.uniform4fv(this.roamCosLoc, [0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.3), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 1.3), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 5.0), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 20.0)]);
      this.gl.uniform4fv(this.slowRoamSinLoc, [0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.005), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.008), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.013), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.022)]);
      this.gl.uniform4fv(this.roamSinLoc, [0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.3), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 1.3), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 5.0), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 20.0)]);
      this.bindBlurVals(blurMins, blurMaxs);

      if (blending) {
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      } else {
        this.gl.disable(this.gl.BLEND);
      }

      this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

      if (!blending) {
        this.gl.enable(this.gl.BLEND);
      }
    }
  }], [{
    key: "generateHueBase",
    value: function generateHueBase(mdVSFrame) {
      var hueBase = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      /* eslint-disable max-len */

      for (var i = 0; i < 4; i++) {
        hueBase[i * 3 + 0] = 0.6 + 0.3 * Math.sin(mdVSFrame.time * 30.0 * 0.0143 + 3 + i * 21 + mdVSFrame.rand_start[3]);
        hueBase[i * 3 + 1] = 0.6 + 0.3 * Math.sin(mdVSFrame.time * 30.0 * 0.0107 + 1 + i * 13 + mdVSFrame.rand_start[1]);
        hueBase[i * 3 + 2] = 0.6 + 0.3 * Math.sin(mdVSFrame.time * 30.0 * 0.0129 + 6 + i * 9 + mdVSFrame.rand_start[2]);
        var maxshade = Math.max(hueBase[i * 3], hueBase[i * 3 + 1], hueBase[i * 3 + 2]);

        for (var k = 0; k < 3; k++) {
          hueBase[i * 3 + k] = hueBase[i * 3 + k] / maxshade;
          hueBase[i * 3 + k] = 0.5 + 0.5 * hueBase[i * 3 + k];
        }
      }
      /* eslint-enable max-len */


      return hueBase;
    }
  }]);

  return CompShader;
}();



/***/ }),

/***/ "./src/rendering/shaders/output.js":
/*!*****************************************!*\
  !*** ./src/rendering/shaders/output.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OutputShader; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var OutputShader =
/*#__PURE__*/
function () {
  function OutputShader(gl, opts) {
    _classCallCheck(this, OutputShader);

    this.gl = gl;
    this.textureRatio = opts.textureRatio;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.vertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);

    if (this.useFXAA()) {
      this.createFXAAShader();
    } else {
      this.createShader();
    }
  }

  _createClass(OutputShader, [{
    key: "useFXAA",
    value: function useFXAA() {
      return this.textureRatio <= 1;
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.textureRatio = opts.textureRatio;
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.gl.deleteProgram(this.shaderProgram);

      if (this.useFXAA()) {
        this.createFXAAShader();
      } else {
        this.createShader();
      }
    } // based on https://github.com/mattdesl/glsl-fxaa

  }, {
    key: "createFXAAShader",
    value: function createFXAAShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n       const vec2 halfmad = vec2(0.5);\n       in vec2 aPos;\n       out vec2 v_rgbM;\n       out vec2 v_rgbNW;\n       out vec2 v_rgbNE;\n       out vec2 v_rgbSW;\n       out vec2 v_rgbSE;\n       uniform vec4 texsize;\n       void main(void) {\n         gl_Position = vec4(aPos, 0.0, 1.0);\n\n         v_rgbM = aPos * halfmad + halfmad;\n         v_rgbNW = v_rgbM + (vec2(-1.0, -1.0) * texsize.zx);\n         v_rgbNE = v_rgbM + (vec2(1.0, -1.0) * texsize.zx);\n         v_rgbSW = v_rgbM + (vec2(-1.0, 1.0) * texsize.zx);\n         v_rgbSE = v_rgbM + (vec2(1.0, 1.0) * texsize.zx);\n       }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 v_rgbM;\n       in vec2 v_rgbNW;\n       in vec2 v_rgbNE;\n       in vec2 v_rgbSW;\n       in vec2 v_rgbSE;\n       out vec4 fragColor;\n       uniform vec4 texsize;\n       uniform sampler2D uTexture;\n\n       #ifndef FXAA_REDUCE_MIN\n         #define FXAA_REDUCE_MIN   (1.0/ 128.0)\n       #endif\n       #ifndef FXAA_REDUCE_MUL\n         #define FXAA_REDUCE_MUL   (1.0 / 8.0)\n       #endif\n       #ifndef FXAA_SPAN_MAX\n         #define FXAA_SPAN_MAX     8.0\n       #endif\n\n       void main(void) {\n         vec4 color;\n         vec3 rgbNW = textureLod(uTexture, v_rgbNW, 0.0).xyz;\n         vec3 rgbNE = textureLod(uTexture, v_rgbNE, 0.0).xyz;\n         vec3 rgbSW = textureLod(uTexture, v_rgbSW, 0.0).xyz;\n         vec3 rgbSE = textureLod(uTexture, v_rgbSE, 0.0).xyz;\n         vec3 rgbM  = textureLod(uTexture, v_rgbM, 0.0).xyz;\n         vec3 luma = vec3(0.299, 0.587, 0.114);\n         float lumaNW = dot(rgbNW, luma);\n         float lumaNE = dot(rgbNE, luma);\n         float lumaSW = dot(rgbSW, luma);\n         float lumaSE = dot(rgbSE, luma);\n         float lumaM  = dot(rgbM,  luma);\n         float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n         float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n         mediump vec2 dir;\n         dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n         dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n         float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                               (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n         float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n         dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n                   max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                   dir * rcpDirMin)) * texsize.zw;\n\n         vec3 rgbA = 0.5 * (\n             textureLod(uTexture, v_rgbM + dir * (1.0 / 3.0 - 0.5), 0.0).xyz +\n             textureLod(uTexture, v_rgbM + dir * (2.0 / 3.0 - 0.5), 0.0).xyz);\n         vec3 rgbB = rgbA * 0.5 + 0.25 * (\n             textureLod(uTexture, v_rgbM + dir * -0.5, 0.0).xyz +\n             textureLod(uTexture, v_rgbM + dir * 0.5, 0.0).xyz);\n\n         float lumaB = dot(rgbB, luma);\n         if ((lumaB < lumaMin) || (lumaB > lumaMax))\n           color = vec4(rgbA, 1.0);\n         else\n           color = vec4(rgbB, 1.0);\n\n         fragColor = color;\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
      this.texsizeLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize');
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n       const vec2 halfmad = vec2(0.5);\n       in vec2 aPos;\n       out vec2 uv;\n       void main(void) {\n         gl_Position = vec4(aPos, 0.0, 1.0);\n         uv = aPos * halfmad + halfmad;\n       }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 uv;\n       out vec4 fragColor;\n       uniform sampler2D uTexture;\n\n       void main(void) {\n         fragColor = vec4(texture(uTexture, uv).rgb, 1.0);\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(texture) {
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.uniform1i(this.textureLoc, 0);

      if (this.useFXAA()) {
        this.gl.uniform4fv(this.texsizeLoc, new Float32Array([this.texsizeX, this.texsizeY, 1.0 / this.texsizeX, 1.0 / this.texsizeY]));
      }

      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }]);

  return OutputShader;
}();



/***/ }),

/***/ "./src/rendering/shaders/resample.js":
/*!*******************************************!*\
  !*** ./src/rendering/shaders/resample.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResampleShader; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var ResampleShader =
/*#__PURE__*/
function () {
  function ResampleShader(gl) {
    _classCallCheck(this, ResampleShader);

    this.gl = gl;
    this.positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.vertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(ResampleShader, [{
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n       const vec2 halfmad = vec2(0.5);\n       in vec2 aPos;\n       out vec2 uv;\n       void main(void) {\n         gl_Position = vec4(aPos, 0.0, 1.0);\n         uv = aPos * halfmad + halfmad;\n       }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 uv;\n       out vec4 fragColor;\n       uniform sampler2D uTexture;\n\n       void main(void) {\n         fragColor = vec4(texture(uTexture, uv).rgb, 1.0);\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(texture) {
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.uniform1i(this.textureLoc, 0);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }]);

  return ResampleShader;
}();



/***/ }),

/***/ "./src/rendering/shaders/shaderUtils.js":
/*!**********************************************!*\
  !*** ./src/rendering/shaders/shaderUtils.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ShaderUtils; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var lineMatcher = /uniform sampler2D sampler_(?:.+?);/g;
var samplerMatcher = /uniform sampler2D sampler_(.+?);/;

var ShaderUtils =
/*#__PURE__*/
function () {
  function ShaderUtils() {
    _classCallCheck(this, ShaderUtils);
  }

  _createClass(ShaderUtils, null, [{
    key: "getShaderParts",
    value: function getShaderParts(t) {
      var sbIndex = t.indexOf('shader_body');

      if (t && sbIndex > -1) {
        var beforeShaderBody = t.substring(0, sbIndex);
        var afterShaderBody = t.substring(sbIndex);
        var firstCurly = afterShaderBody.indexOf('{');
        var lastCurly = afterShaderBody.lastIndexOf('}');
        var shaderBody = afterShaderBody.substring(firstCurly + 1, lastCurly);
        return [beforeShaderBody, shaderBody];
      }

      return ['', t];
    }
  }, {
    key: "getFragmentFloatPrecision",
    value: function getFragmentFloatPrecision(gl) {
      if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
        return 'highp';
      } else if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
        return 'mediump';
      }

      return 'lowp';
    }
  }, {
    key: "getUserSamplers",
    value: function getUserSamplers(text) {
      var samplers = [];
      var lineMatches = text.match(lineMatcher);

      if (lineMatches && lineMatches.length > 0) {
        for (var i = 0; i < lineMatches.length; i++) {
          var samplerMatches = lineMatches[i].match(samplerMatcher);

          if (samplerMatches && samplerMatches.length > 0) {
            var sampler = samplerMatches[1];
            samplers.push({
              sampler: sampler
            });
          }
        }
      }

      return samplers;
    }
  }]);

  return ShaderUtils;
}();



/***/ }),

/***/ "./src/rendering/shaders/warp.js":
/*!***************************************!*\
  !*** ./src/rendering/shaders/warp.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WarpShader; });
/* harmony import */ var _shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var WarpShader =
/*#__PURE__*/
function () {
  function WarpShader(gl, noise, image) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, WarpShader);

    this.gl = gl;
    this.noise = noise;
    this.image = image;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.buildPositions();
    this.indexBuf = gl.createBuffer();
    this.positionVertexBuf = this.gl.createBuffer();
    this.warpUvVertexBuf = this.gl.createBuffer();
    this.warpColorVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
    this.mainSampler = this.gl.createSampler();
    this.mainSamplerFW = this.gl.createSampler();
    this.mainSamplerFC = this.gl.createSampler();
    this.mainSamplerPW = this.gl.createSampler();
    this.mainSamplerPC = this.gl.createSampler();
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFW, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerFC, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerPW, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(this.mainSamplerPC, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  } // based on https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js


  _createClass(WarpShader, [{
    key: "buildPositions",
    value: function buildPositions() {
      var width = 2;
      var height = 2;
      var widthHalf = width / 2;
      var heightHalf = height / 2;
      var gridX = this.mesh_width;
      var gridY = this.mesh_height;
      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;
      var segmentWidth = width / gridX;
      var segmentHeight = height / gridY;
      var vertices = [];

      for (var iy = 0; iy < gridY1; iy++) {
        var y = iy * segmentHeight - heightHalf;

        for (var ix = 0; ix < gridX1; ix++) {
          var x = ix * segmentWidth - widthHalf;
          vertices.push(x, -y, 0);
        }
      }

      var indices = [];

      for (var _iy = 0; _iy < gridY; _iy++) {
        for (var _ix = 0; _ix < gridX; _ix++) {
          var a = _ix + gridX1 * _iy;
          var b = _ix + gridX1 * (_iy + 1);
          var c = _ix + 1 + gridX1 * (_iy + 1);
          var d = _ix + 1 + gridX1 * _iy;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      this.vertices = new Float32Array(vertices);
      this.indices = new Uint16Array(indices);
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
      this.buildPositions();
    }
  }, {
    key: "createShader",
    value: function createShader() {
      var shaderText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var fragShaderText;
      var fragShaderHeaderText;

      if (shaderText.length === 0) {
        fragShaderText = 'ret = texture(sampler_main, uv).rgb * decay;';
        fragShaderHeaderText = '';
      } else {
        var shaderParts = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getShaderParts(shaderText);
        fragShaderHeaderText = shaderParts[0];
        fragShaderText = shaderParts[1];
      }

      fragShaderText = fragShaderText.replace(/texture2D/g, 'texture');
      fragShaderText = fragShaderText.replace(/texture3D/g, 'texture');
      this.userTextures = _shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getUserSamplers(fragShaderHeaderText);
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      const vec2 halfmad = vec2(0.5);\n                                      in vec2 aPos;\n                                      in vec2 aWarpUv;\n                                      in vec4 aWarpColor;\n                                      out vec2 uv;\n                                      out vec2 uv_orig;\n                                      out vec4 vColor;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 0.0, 1.0);\n                                        uv_orig = aPos * halfmad + halfmad;\n                                        uv = aWarpUv;\n                                        vColor = aWarpColor;\n                                      }"));
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      precision mediump sampler3D;\n\n                                      in vec2 uv;\n                                      in vec2 uv_orig;\n                                      in vec4 vColor;\n                                      out vec4 fragColor;\n                                      uniform sampler2D sampler_main;\n                                      uniform sampler2D sampler_fw_main;\n                                      uniform sampler2D sampler_fc_main;\n                                      uniform sampler2D sampler_pw_main;\n                                      uniform sampler2D sampler_pc_main;\n                                      uniform sampler2D sampler_blur1;\n                                      uniform sampler2D sampler_blur2;\n                                      uniform sampler2D sampler_blur3;\n                                      uniform sampler2D sampler_noise_lq;\n                                      uniform sampler2D sampler_noise_lq_lite;\n                                      uniform sampler2D sampler_noise_mq;\n                                      uniform sampler2D sampler_noise_hq;\n                                      uniform sampler2D sampler_pw_noise_lq;\n                                      uniform sampler3D sampler_noisevol_lq;\n                                      uniform sampler3D sampler_noisevol_hq;\n                                      uniform float time;\n                                      uniform float decay;\n                                      uniform vec2 resolution;\n                                      uniform vec4 aspect;\n                                      uniform vec4 texsize;\n                                      uniform vec4 texsize_noise_lq;\n                                      uniform vec4 texsize_noise_mq;\n                                      uniform vec4 texsize_noise_hq;\n                                      uniform vec4 texsize_noise_lq_lite;\n                                      uniform vec4 texsize_noisevol_lq;\n                                      uniform vec4 texsize_noisevol_hq;\n\n                                      uniform float bass;\n                                      uniform float mid;\n                                      uniform float treb;\n                                      uniform float vol;\n                                      uniform float bass_att;\n                                      uniform float mid_att;\n                                      uniform float treb_att;\n                                      uniform float vol_att;\n\n                                      uniform float frame;\n                                      uniform float fps;\n\n                                      uniform vec4 _qa;\n                                      uniform vec4 _qb;\n                                      uniform vec4 _qc;\n                                      uniform vec4 _qd;\n                                      uniform vec4 _qe;\n                                      uniform vec4 _qf;\n                                      uniform vec4 _qg;\n                                      uniform vec4 _qh;\n\n                                      #define q1 _qa.x\n                                      #define q2 _qa.y\n                                      #define q3 _qa.z\n                                      #define q4 _qa.w\n                                      #define q5 _qb.x\n                                      #define q6 _qb.y\n                                      #define q7 _qb.z\n                                      #define q8 _qb.w\n                                      #define q9 _qc.x\n                                      #define q10 _qc.y\n                                      #define q11 _qc.z\n                                      #define q12 _qc.w\n                                      #define q13 _qd.x\n                                      #define q14 _qd.y\n                                      #define q15 _qd.z\n                                      #define q16 _qd.w\n                                      #define q17 _qe.x\n                                      #define q18 _qe.y\n                                      #define q19 _qe.z\n                                      #define q20 _qe.w\n                                      #define q21 _qf.x\n                                      #define q22 _qf.y\n                                      #define q23 _qf.z\n                                      #define q24 _qf.w\n                                      #define q25 _qg.x\n                                      #define q26 _qg.y\n                                      #define q27 _qg.z\n                                      #define q28 _qg.w\n                                      #define q29 _qh.x\n                                      #define q30 _qh.y\n                                      #define q31 _qh.z\n                                      #define q32 _qh.w\n\n                                      uniform vec4 slow_roam_cos;\n                                      uniform vec4 roam_cos;\n                                      uniform vec4 slow_roam_sin;\n                                      uniform vec4 roam_sin;\n\n                                      uniform float blur1_min;\n                                      uniform float blur1_max;\n                                      uniform float blur2_min;\n                                      uniform float blur2_max;\n                                      uniform float blur3_min;\n                                      uniform float blur3_max;\n\n                                      uniform float scale1;\n                                      uniform float scale2;\n                                      uniform float scale3;\n                                      uniform float bias1;\n                                      uniform float bias2;\n                                      uniform float bias3;\n\n                                      uniform vec4 rand_frame;\n                                      uniform vec4 rand_preset;\n\n                                      float PI = ").concat(Math.PI, ";\n\n                                      ").concat(fragShaderHeaderText, "\n\n                                      void main(void) {\n                                        vec3 ret;\n                                        float rad = length(uv_orig - 0.5);\n                                        float ang = atan(uv_orig.x - 0.5, uv_orig.y - 0.5);\n\n                                        ").concat(fragShaderText, "\n\n                                        fragColor = vec4(ret, 1.0) * vColor;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.warpUvLocation = this.gl.getAttribLocation(this.shaderProgram, 'aWarpUv');
      this.warpColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aWarpColor');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_main');
      this.textureFWLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_fw_main');
      this.textureFCLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_fc_main');
      this.texturePWLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pw_main');
      this.texturePCLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pc_main');
      this.blurTexture1Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur1');
      this.blurTexture2Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur2');
      this.blurTexture3Loc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_blur3');
      this.noiseLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_lq');
      this.noiseMQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_mq');
      this.noiseHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_hq');
      this.noiseLQLiteLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noise_lq_lite');
      this.noisePointLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_pw_noise_lq');
      this.noiseVolLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noisevol_lq');
      this.noiseVolHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'sampler_noisevol_hq');
      this.decayLoc = this.gl.getUniformLocation(this.shaderProgram, 'decay');
      this.texsizeLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize');
      this.texsizeNoiseLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_lq');
      this.texsizeNoiseMQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_mq');
      this.texsizeNoiseHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_hq');
      this.texsizeNoiseLQLiteLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noise_lq_lite');
      this.texsizeNoiseVolLQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noisevol_lq');
      this.texsizeNoiseVolHQLoc = this.gl.getUniformLocation(this.shaderProgram, 'texsize_noisevol_hq');
      this.resolutionLoc = this.gl.getUniformLocation(this.shaderProgram, 'resolution');
      this.aspectLoc = this.gl.getUniformLocation(this.shaderProgram, 'aspect');
      this.bassLoc = this.gl.getUniformLocation(this.shaderProgram, 'bass');
      this.midLoc = this.gl.getUniformLocation(this.shaderProgram, 'mid');
      this.trebLoc = this.gl.getUniformLocation(this.shaderProgram, 'treb');
      this.volLoc = this.gl.getUniformLocation(this.shaderProgram, 'vol');
      this.bassAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'bass_att');
      this.midAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'mid_att');
      this.trebAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'treb_att');
      this.volAttLoc = this.gl.getUniformLocation(this.shaderProgram, 'vol_att');
      this.timeLoc = this.gl.getUniformLocation(this.shaderProgram, 'time');
      this.frameLoc = this.gl.getUniformLocation(this.shaderProgram, 'frame');
      this.fpsLoc = this.gl.getUniformLocation(this.shaderProgram, 'fps');
      this.blur1MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur1_min');
      this.blur1MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur1_max');
      this.blur2MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur2_min');
      this.blur2MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur2_max');
      this.blur3MinLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur3_min');
      this.blur3MaxLoc = this.gl.getUniformLocation(this.shaderProgram, 'blur3_max');
      this.scale1Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale1');
      this.scale2Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale2');
      this.scale3Loc = this.gl.getUniformLocation(this.shaderProgram, 'scale3');
      this.bias1Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias1');
      this.bias2Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias2');
      this.bias3Loc = this.gl.getUniformLocation(this.shaderProgram, 'bias3');
      this.randPresetLoc = this.gl.getUniformLocation(this.shaderProgram, 'rand_preset');
      this.randFrameLoc = this.gl.getUniformLocation(this.shaderProgram, 'rand_frame');
      this.qaLoc = this.gl.getUniformLocation(this.shaderProgram, '_qa');
      this.qbLoc = this.gl.getUniformLocation(this.shaderProgram, '_qb');
      this.qcLoc = this.gl.getUniformLocation(this.shaderProgram, '_qc');
      this.qdLoc = this.gl.getUniformLocation(this.shaderProgram, '_qd');
      this.qeLoc = this.gl.getUniformLocation(this.shaderProgram, '_qe');
      this.qfLoc = this.gl.getUniformLocation(this.shaderProgram, '_qf');
      this.qgLoc = this.gl.getUniformLocation(this.shaderProgram, '_qg');
      this.qhLoc = this.gl.getUniformLocation(this.shaderProgram, '_qh');
      this.slowRoamCosLoc = this.gl.getUniformLocation(this.shaderProgram, 'slow_roam_cos');
      this.roamCosLoc = this.gl.getUniformLocation(this.shaderProgram, 'roam_cos');
      this.slowRoamSinLoc = this.gl.getUniformLocation(this.shaderProgram, 'slow_roam_sin');
      this.roamSinLoc = this.gl.getUniformLocation(this.shaderProgram, 'roam_sin');

      for (var i = 0; i < this.userTextures.length; i++) {
        var userTexture = this.userTextures[i];
        userTexture.textureLoc = this.gl.getUniformLocation(this.shaderProgram, "sampler_".concat(userTexture.sampler));
      }
    }
  }, {
    key: "updateShader",
    value: function updateShader(shaderText) {
      this.createShader(shaderText);
    }
  }, {
    key: "bindBlurVals",
    value: function bindBlurVals(blurMins, blurMaxs) {
      var blurMin1 = blurMins[0];
      var blurMin2 = blurMins[1];
      var blurMin3 = blurMins[2];
      var blurMax1 = blurMaxs[0];
      var blurMax2 = blurMaxs[1];
      var blurMax3 = blurMaxs[2];
      var scale1 = blurMax1 - blurMin1;
      var bias1 = blurMin1;
      var scale2 = blurMax2 - blurMin2;
      var bias2 = blurMin2;
      var scale3 = blurMax3 - blurMin3;
      var bias3 = blurMin3;
      this.gl.uniform1f(this.blur1MinLoc, blurMin1);
      this.gl.uniform1f(this.blur1MaxLoc, blurMax1);
      this.gl.uniform1f(this.blur2MinLoc, blurMin2);
      this.gl.uniform1f(this.blur2MaxLoc, blurMax2);
      this.gl.uniform1f(this.blur3MinLoc, blurMin3);
      this.gl.uniform1f(this.blur3MaxLoc, blurMax3);
      this.gl.uniform1f(this.scale1Loc, scale1);
      this.gl.uniform1f(this.scale2Loc, scale2);
      this.gl.uniform1f(this.scale3Loc, scale3);
      this.gl.uniform1f(this.bias1Loc, bias1);
      this.gl.uniform1f(this.bias2Loc, bias2);
      this.gl.uniform1f(this.bias3Loc, bias3);
    }
  }, {
    key: "renderQuadTexture",
    value: function renderQuadTexture(blending, texture, blurTexture1, blurTexture2, blurTexture3, blurMins, blurMaxs, mdVSFrame, warpUVs, warpColor) {
      this.gl.useProgram(this.shaderProgram);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.warpUvVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, warpUVs, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.warpUvLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.warpUvLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.warpColorVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, warpColor, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.warpColorLocation, 4, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.warpColorLocation);
      var wrapping = mdVSFrame.wrap !== 0 ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE;
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_S, wrapping);
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_T, wrapping);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(0, this.mainSampler);
      this.gl.uniform1i(this.textureLoc, 0);
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(1, this.mainSamplerFW);
      this.gl.uniform1i(this.textureFWLoc, 1);
      this.gl.activeTexture(this.gl.TEXTURE2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(2, this.mainSamplerFC);
      this.gl.uniform1i(this.textureFCLoc, 2);
      this.gl.activeTexture(this.gl.TEXTURE3);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(3, this.mainSamplerPW);
      this.gl.uniform1i(this.texturePWLoc, 3);
      this.gl.activeTexture(this.gl.TEXTURE4);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.bindSampler(4, this.mainSamplerPC);
      this.gl.uniform1i(this.texturePCLoc, 4);
      this.gl.activeTexture(this.gl.TEXTURE5);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture1);
      this.gl.uniform1i(this.blurTexture1Loc, 5);
      this.gl.activeTexture(this.gl.TEXTURE6);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture2);
      this.gl.uniform1i(this.blurTexture2Loc, 6);
      this.gl.activeTexture(this.gl.TEXTURE7);
      this.gl.bindTexture(this.gl.TEXTURE_2D, blurTexture3);
      this.gl.uniform1i(this.blurTexture3Loc, 7);
      this.gl.activeTexture(this.gl.TEXTURE8);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQ);
      this.gl.uniform1i(this.noiseLQLoc, 8);
      this.gl.activeTexture(this.gl.TEXTURE9);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexMQ);
      this.gl.uniform1i(this.noiseMQLoc, 9);
      this.gl.activeTexture(this.gl.TEXTURE10);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexHQ);
      this.gl.uniform1i(this.noiseHQLoc, 10);
      this.gl.activeTexture(this.gl.TEXTURE11);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQLite);
      this.gl.uniform1i(this.noiseLQLiteLoc, 11);
      this.gl.activeTexture(this.gl.TEXTURE12);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.noise.noiseTexLQ);
      this.gl.bindSampler(12, this.noise.noiseTexPointLQ);
      this.gl.uniform1i(this.noisePointLQLoc, 12);
      this.gl.activeTexture(this.gl.TEXTURE13);
      this.gl.bindTexture(this.gl.TEXTURE_3D, this.noise.noiseTexVolLQ);
      this.gl.uniform1i(this.noiseVolLQLoc, 13);
      this.gl.activeTexture(this.gl.TEXTURE14);
      this.gl.bindTexture(this.gl.TEXTURE_3D, this.noise.noiseTexVolHQ);
      this.gl.uniform1i(this.noiseVolHQLoc, 14);

      for (var i = 0; i < this.userTextures.length; i++) {
        var userTexture = this.userTextures[i];
        this.gl.activeTexture(this.gl.TEXTURE15 + i);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.image.getTexture(userTexture.sampler));
        this.gl.uniform1i(userTexture.textureLoc, 15 + i);
      }

      this.gl.uniform1f(this.decayLoc, mdVSFrame.decay);
      this.gl.uniform2fv(this.resolutionLoc, [this.texsizeX, this.texsizeY]);
      this.gl.uniform4fv(this.aspectLoc, [this.aspectx, this.aspecty, this.invAspectx, this.invAspecty]);
      this.gl.uniform4fv(this.texsizeLoc, [this.texsizeX, this.texsizeY, 1.0 / this.texsizeX, 1.0 / this.texsizeY]);
      this.gl.uniform4fv(this.texsizeNoiseLQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseMQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseHQLoc, [256, 256, 1 / 256, 1 / 256]);
      this.gl.uniform4fv(this.texsizeNoiseLQLiteLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform4fv(this.texsizeNoiseVolLQLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform4fv(this.texsizeNoiseVolHQLoc, [32, 32, 1 / 32, 1 / 32]);
      this.gl.uniform1f(this.bassLoc, mdVSFrame.bass);
      this.gl.uniform1f(this.midLoc, mdVSFrame.mid);
      this.gl.uniform1f(this.trebLoc, mdVSFrame.treb);
      this.gl.uniform1f(this.volLoc, (mdVSFrame.bass + mdVSFrame.mid + mdVSFrame.treb) / 3);
      this.gl.uniform1f(this.bassAttLoc, mdVSFrame.bass_att);
      this.gl.uniform1f(this.midAttLoc, mdVSFrame.mid_att);
      this.gl.uniform1f(this.trebAttLoc, mdVSFrame.treb_att);
      this.gl.uniform1f(this.volAttLoc, (mdVSFrame.bass_att + mdVSFrame.mid_att + mdVSFrame.treb_att) / 3);
      this.gl.uniform1f(this.timeLoc, mdVSFrame.time);
      this.gl.uniform1f(this.frameLoc, mdVSFrame.frame);
      this.gl.uniform1f(this.fpsLoc, mdVSFrame.fps);
      this.gl.uniform4fv(this.randPresetLoc, mdVSFrame.rand_preset);
      this.gl.uniform4fv(this.randFrameLoc, new Float32Array([Math.random(), Math.random(), Math.random(), Math.random()]));
      this.gl.uniform4fv(this.qaLoc, new Float32Array([mdVSFrame.q1 || 0, mdVSFrame.q2 || 0, mdVSFrame.q3 || 0, mdVSFrame.q4 || 0]));
      this.gl.uniform4fv(this.qbLoc, new Float32Array([mdVSFrame.q5 || 0, mdVSFrame.q6 || 0, mdVSFrame.q7 || 0, mdVSFrame.q8 || 0]));
      this.gl.uniform4fv(this.qcLoc, new Float32Array([mdVSFrame.q9 || 0, mdVSFrame.q10 || 0, mdVSFrame.q11 || 0, mdVSFrame.q12 || 0]));
      this.gl.uniform4fv(this.qdLoc, new Float32Array([mdVSFrame.q13 || 0, mdVSFrame.q14 || 0, mdVSFrame.q15 || 0, mdVSFrame.q16 || 0]));
      this.gl.uniform4fv(this.qeLoc, new Float32Array([mdVSFrame.q17 || 0, mdVSFrame.q18 || 0, mdVSFrame.q19 || 0, mdVSFrame.q20 || 0]));
      this.gl.uniform4fv(this.qfLoc, new Float32Array([mdVSFrame.q21 || 0, mdVSFrame.q22 || 0, mdVSFrame.q23 || 0, mdVSFrame.q24 || 0]));
      this.gl.uniform4fv(this.qgLoc, new Float32Array([mdVSFrame.q25 || 0, mdVSFrame.q26 || 0, mdVSFrame.q27 || 0, mdVSFrame.q28 || 0]));
      this.gl.uniform4fv(this.qhLoc, new Float32Array([mdVSFrame.q29 || 0, mdVSFrame.q30 || 0, mdVSFrame.q31 || 0, mdVSFrame.q32 || 0]));
      this.gl.uniform4fv(this.slowRoamCosLoc, [0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.005), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.008), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.013), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.022)]);
      this.gl.uniform4fv(this.roamCosLoc, [0.5 + 0.5 * Math.cos(mdVSFrame.time * 0.3), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 1.3), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 5.0), 0.5 + 0.5 * Math.cos(mdVSFrame.time * 20.0)]);
      this.gl.uniform4fv(this.slowRoamSinLoc, [0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.005), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.008), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.013), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.022)]);
      this.gl.uniform4fv(this.roamSinLoc, [0.5 + 0.5 * Math.sin(mdVSFrame.time * 0.3), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 1.3), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 5.0), 0.5 + 0.5 * Math.sin(mdVSFrame.time * 20.0)]);
      this.bindBlurVals(blurMins, blurMaxs);

      if (blending) {
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      } else {
        this.gl.disable(this.gl.BLEND);
      }

      this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

      if (!blending) {
        this.gl.enable(this.gl.BLEND);
      }
    }
  }]);

  return WarpShader;
}();



/***/ }),

/***/ "./src/rendering/shapes/customShape.js":
/*!*********************************************!*\
  !*** ./src/rendering/shapes/customShape.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CustomShape; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils.js");
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var CustomShape =
/*#__PURE__*/
function () {
  function CustomShape(index, gl, opts) {
    _classCallCheck(this, CustomShape);

    this.index = index;
    this.gl = gl;
    var maxSides = 101;
    this.positions = new Float32Array((maxSides + 2) * 3);
    this.colors = new Float32Array((maxSides + 2) * 4);
    this.uvs = new Float32Array((maxSides + 2) * 2);
    this.borderPositions = new Float32Array((maxSides + 1) * 3);
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.positionVertexBuf = this.gl.createBuffer();
    this.colorVertexBuf = this.gl.createBuffer();
    this.uvVertexBuf = this.gl.createBuffer();
    this.borderPositionVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_1__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
    this.createBorderShader();
    this.mainSampler = this.gl.createSampler();
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.samplerParameteri(this.mainSampler, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }

  _createClass(CustomShape, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aPos;\n                                      in vec4 aColor;\n                                      in vec2 aUv;\n                                      out vec4 vColor;\n                                      out vec2 vUv;\n                                      void main(void) {\n                                        vColor = aColor;\n                                        vUv = aUv;\n                                        gl_Position = vec4(aPos, 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      uniform sampler2D uTexture;\n                                      uniform float uTextured;\n                                      in vec4 vColor;\n                                      in vec2 vUv;\n                                      out vec4 fragColor;\n                                      void main(void) {\n                                        if (uTextured != 0.0) {\n                                          fragColor = texture(uTexture, vUv) * vColor;\n                                        } else {\n                                          fragColor = vColor;\n                                        }\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
      this.aUvLocation = this.gl.getAttribLocation(this.shaderProgram, 'aUv');
      this.texturedLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTextured');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
    }
  }, {
    key: "createBorderShader",
    value: function createBorderShader() {
      this.borderShaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aBorderPos;\n                                      uniform vec2 thickOffset;\n                                      void main(void) {\n                                        gl_Position = vec4(aBorderPos +\n                                                           vec3(thickOffset, 0.0), 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      out vec4 fragColor;\n                                      uniform vec4 uBorderColor;\n                                      void main(void) {\n                                        fragColor = uBorderColor;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.borderShaderProgram, vertShader);
      this.gl.attachShader(this.borderShaderProgram, fragShader);
      this.gl.linkProgram(this.borderShaderProgram);
      this.aBorderPosLoc = this.gl.getAttribLocation(this.borderShaderProgram, 'aBorderPos');
      this.uBorderColorLoc = this.gl.getUniformLocation(this.borderShaderProgram, 'uBorderColor');
      this.thickOffsetLoc = this.gl.getUniformLocation(this.shaderProgram, 'thickOffset');
    }
  }, {
    key: "drawCustomShape",
    value: function drawCustomShape(blendProgress, globalVars, presetEquationRunner, shapeEqs, prevTexture) {
      if (shapeEqs.baseVals.enabled !== 0) {
        this.setupShapeBuffers(presetEquationRunner.mdVSFrame);
        var mdVSShape = Object.assign({}, presetEquationRunner.mdVSShapes[this.index], presetEquationRunner.mdVSFrameMapShapes[this.index], presetEquationRunner.mdVSQAfterFrame, presetEquationRunner.mdVSTShapeInits[this.index], globalVars);
        var mdVSShapeBaseVals = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].cloneVars(mdVSShape);
        var numInst = Math.clamp(mdVSShape.num_inst, 1, 1024);

        for (var j = 0; j < numInst; j++) {
          mdVSShape.instance = j;
          mdVSShape.x = mdVSShapeBaseVals.x;
          mdVSShape.y = mdVSShapeBaseVals.y;
          mdVSShape.rad = mdVSShapeBaseVals.rad;
          mdVSShape.ang = mdVSShapeBaseVals.ang;
          mdVSShape.r = mdVSShapeBaseVals.r;
          mdVSShape.g = mdVSShapeBaseVals.g;
          mdVSShape.b = mdVSShapeBaseVals.b;
          mdVSShape.a = mdVSShapeBaseVals.a;
          mdVSShape.r2 = mdVSShapeBaseVals.r2;
          mdVSShape.g2 = mdVSShapeBaseVals.g2;
          mdVSShape.b2 = mdVSShapeBaseVals.b2;
          mdVSShape.a2 = mdVSShapeBaseVals.a2;
          mdVSShape.border_r = mdVSShapeBaseVals.border_r;
          mdVSShape.border_g = mdVSShapeBaseVals.border_g;
          mdVSShape.border_b = mdVSShapeBaseVals.border_b;
          mdVSShape.border_a = mdVSShapeBaseVals.border_a;
          mdVSShape.thickoutline = mdVSShapeBaseVals.thickoutline;
          mdVSShape.textured = mdVSShapeBaseVals.textured;
          mdVSShape.tex_zoom = mdVSShapeBaseVals.tex_zoom;
          mdVSShape.tex_ang = mdVSShapeBaseVals.tex_ang;
          mdVSShape.additive = mdVSShapeBaseVals.additive;
          var mdVSShapeFrame = shapeEqs.frame_eqs(mdVSShape);
          var sides = mdVSShapeFrame.sides;
          sides = Math.clamp(sides, 3, 100);
          sides = Math.floor(sides);
          var rad = mdVSShapeFrame.rad;
          var ang = mdVSShapeFrame.ang;
          var x = mdVSShapeFrame.x * 2 - 1;
          var y = mdVSShapeFrame.y * -2 + 1;
          var r = mdVSShapeFrame.r;
          var g = mdVSShapeFrame.g;
          var b = mdVSShapeFrame.b;
          var a = mdVSShapeFrame.a;
          var r2 = mdVSShapeFrame.r2;
          var g2 = mdVSShapeFrame.g2;
          var b2 = mdVSShapeFrame.b2;
          var a2 = mdVSShapeFrame.a2;
          var borderR = mdVSShapeFrame.border_r;
          var borderG = mdVSShapeFrame.border_g;
          var borderB = mdVSShapeFrame.border_b;
          var borderA = mdVSShapeFrame.border_a;
          this.borderColor = [borderR, borderG, borderB, borderA * blendProgress];
          var thickoutline = mdVSShapeFrame.thickoutline;
          var textured = mdVSShapeFrame.textured;
          var texZoom = mdVSShapeFrame.tex_zoom;
          var texAng = mdVSShapeFrame.tex_ang;
          var additive = mdVSShapeFrame.additive;
          var hasBorder = this.borderColor[3] > 0;
          var isTextured = Math.abs(textured) >= 1;
          var isBorderThick = Math.abs(thickoutline) >= 1;
          var isAdditive = Math.abs(additive) >= 1;
          this.positions[0] = x;
          this.positions[1] = y;
          this.positions[2] = 0;
          this.colors[0] = r;
          this.colors[1] = g;
          this.colors[2] = b;
          this.colors[3] = a * blendProgress;

          if (isTextured) {
            this.uvs[0] = 0.5;
            this.uvs[1] = 0.5;
          }

          var quarterPi = Math.PI * 0.25;

          for (var k = 1; k <= sides + 1; k++) {
            var p = (k - 1) / sides;
            var pTwoPi = p * 2 * Math.PI;
            var angSum = pTwoPi + ang + quarterPi;
            this.positions[k * 3 + 0] = x + rad * Math.cos(angSum) * this.aspecty;
            this.positions[k * 3 + 1] = y + rad * Math.sin(angSum);
            this.positions[k * 3 + 2] = 0;
            this.colors[k * 4 + 0] = r2;
            this.colors[k * 4 + 1] = g2;
            this.colors[k * 4 + 2] = b2;
            this.colors[k * 4 + 3] = a2 * blendProgress;

            if (isTextured) {
              var texAngSum = pTwoPi + texAng + quarterPi;
              this.uvs[k * 2 + 0] = 0.5 + 0.5 * Math.cos(texAngSum) / texZoom * this.aspecty;
              this.uvs[k * 2 + 1] = 0.5 + 0.5 * Math.sin(texAngSum) / texZoom;
            }

            if (hasBorder) {
              this.borderPositions[(k - 1) * 3 + 0] = this.positions[k * 3 + 0];
              this.borderPositions[(k - 1) * 3 + 1] = this.positions[k * 3 + 1];
              this.borderPositions[(k - 1) * 3 + 2] = this.positions[k * 3 + 2];
            }
          }

          this.mdVSShapeFrame = mdVSShapeFrame;
          this.drawCustomShapeInstance(prevTexture, sides, isTextured, hasBorder, isBorderThick, isAdditive);
        }

        var mdVSUserKeysShape = presetEquationRunner.mdVSUserKeysShapes[this.index];
        var mdVSNewFrameMapShape = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(this.mdVSShapeFrame, mdVSUserKeysShape); // eslint-disable-next-line no-param-reassign

        presetEquationRunner.mdVSFrameMapShapes[this.index] = mdVSNewFrameMapShape;
      }
    }
  }, {
    key: "setupShapeBuffers",
    value: function setupShapeBuffers(mdVSFrame) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.aPosLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aPosLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.aColorLocation, 4, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aColorLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.uvs, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.aUvLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aUvLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.borderPositionVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.borderPositions, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.aBorderPosLoc, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aBorderPosLoc);
      var wrapping = mdVSFrame.wrap !== 0 ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE;
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_S, wrapping);
      this.gl.samplerParameteri(this.mainSampler, this.gl.TEXTURE_WRAP_T, wrapping);
    }
  }, {
    key: "drawCustomShapeInstance",
    value: function drawCustomShapeInstance(prevTexture, sides, isTextured, hasBorder, isBorderThick, isAdditive) {
      this.gl.useProgram(this.shaderProgram);
      var updatedPositions = new Float32Array(this.positions.buffer, 0, (sides + 2) * 3);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, updatedPositions);
      this.gl.vertexAttribPointer(this.aPosLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aPosLocation);
      var updatedColors = new Float32Array(this.colors.buffer, 0, (sides + 2) * 4);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVertexBuf);
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, updatedColors);
      this.gl.vertexAttribPointer(this.aColorLocation, 4, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.aColorLocation);

      if (isTextured) {
        var updatedUvs = new Float32Array(this.uvs.buffer, 0, (sides + 2) * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVertexBuf);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, updatedUvs);
        this.gl.vertexAttribPointer(this.aUvLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aUvLocation);
      }

      this.gl.uniform1f(this.texturedLoc, isTextured ? 1 : 0);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, prevTexture);
      this.gl.bindSampler(0, this.mainSampler);
      this.gl.uniform1i(this.textureLoc, 0);

      if (isAdditive) {
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
      } else {
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      }

      this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, sides + 2);

      if (hasBorder) {
        this.gl.useProgram(this.borderShaderProgram);
        var updatedBorderPos = new Float32Array(this.borderPositions.buffer, 0, (sides + 1) * 3);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.borderPositionVertexBuf);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, updatedBorderPos);
        this.gl.vertexAttribPointer(this.aBorderPosLoc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aBorderPosLoc);
        this.gl.uniform4fv(this.uBorderColorLoc, this.borderColor); // TODO: use drawArraysInstanced

        var instances = isBorderThick ? 4 : 1;

        for (var i = 0; i < instances; i++) {
          var offset = 2;

          if (i === 0) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, 0]);
          } else if (i === 1) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, 0]);
          } else if (i === 2) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, offset / this.texsizeY]);
          } else if (i === 3) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, offset / this.texsizeY]);
          }

          this.gl.drawArrays(this.gl.LINE_STRIP, 0, sides + 1);
        }
      }
    }
  }]);

  return CustomShape;
}();



/***/ }),

/***/ "./src/rendering/sprites/border.js":
/*!*****************************************!*\
  !*** ./src/rendering/sprites/border.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Border; });
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Border =
/*#__PURE__*/
function () {
  function Border(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Border);

    this.gl = gl;
    this.positions = new Float32Array(72);
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
    this.vertexBuf = this.gl.createBuffer();
  }

  _createClass(Border, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aPos;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos, 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      out vec4 fragColor;\n                                      uniform vec4 u_color;\n                                      void main(void) {\n                                        fragColor = u_color;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLoc = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.colorLoc = this.gl.getUniformLocation(this.shaderProgram, 'u_color');
    }
  }, {
    key: "addTriangle",
    value: function addTriangle(offset, point1, point2, point3) {
      this.positions[offset + 0] = point1[0];
      this.positions[offset + 1] = point1[1];
      this.positions[offset + 2] = point1[2];
      this.positions[offset + 3] = point2[0];
      this.positions[offset + 4] = point2[1];
      this.positions[offset + 5] = point2[2];
      this.positions[offset + 6] = point3[0];
      this.positions[offset + 7] = point3[1];
      this.positions[offset + 8] = point3[2];
    } // based on https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js

  }, {
    key: "generateBorder",
    value: function generateBorder(borderColor, borderSize, prevBorderSize) {
      if (borderSize > 0 && borderColor[3] > 0) {
        var width = 2;
        var height = 2;
        var widthHalf = width / 2;
        var heightHalf = height / 2;
        var prevBorderWidth = prevBorderSize / 2;
        var borderWidth = borderSize / 2 + prevBorderWidth;
        var prevBorderWidthWidth = prevBorderWidth * width;
        var prevBorderWidthHeight = prevBorderWidth * height;
        var borderWidthWidth = borderWidth * width;
        var borderWidthHeight = borderWidth * height; // 1st side

        var point1 = [-widthHalf + prevBorderWidthWidth, -heightHalf + borderWidthHeight, 0];
        var point2 = [-widthHalf + prevBorderWidthWidth, heightHalf - borderWidthHeight, 0];
        var point3 = [-widthHalf + borderWidthWidth, heightHalf - borderWidthHeight, 0];
        var point4 = [-widthHalf + borderWidthWidth, -heightHalf + borderWidthHeight, 0];
        this.addTriangle(0, point4, point2, point1);
        this.addTriangle(9, point4, point3, point2); // 2nd side

        point1 = [widthHalf - prevBorderWidthWidth, -heightHalf + borderWidthHeight, 0];
        point2 = [widthHalf - prevBorderWidthWidth, heightHalf - borderWidthHeight, 0];
        point3 = [widthHalf - borderWidthWidth, heightHalf - borderWidthHeight, 0];
        point4 = [widthHalf - borderWidthWidth, -heightHalf + borderWidthHeight, 0];
        this.addTriangle(18, point1, point2, point4);
        this.addTriangle(27, point2, point3, point4); // Top

        point1 = [-widthHalf + prevBorderWidthWidth, -heightHalf + prevBorderWidthHeight, 0];
        point2 = [-widthHalf + prevBorderWidthWidth, borderWidthHeight - heightHalf, 0];
        point3 = [widthHalf - prevBorderWidthWidth, borderWidthHeight - heightHalf, 0];
        point4 = [widthHalf - prevBorderWidthWidth, -heightHalf + prevBorderWidthHeight, 0];
        this.addTriangle(36, point4, point2, point1);
        this.addTriangle(45, point4, point3, point2); // Bottom

        point1 = [-widthHalf + prevBorderWidthWidth, heightHalf - prevBorderWidthHeight, 0];
        point2 = [-widthHalf + prevBorderWidthWidth, heightHalf - borderWidthHeight, 0];
        point3 = [widthHalf - prevBorderWidthWidth, heightHalf - borderWidthHeight, 0];
        point4 = [widthHalf - prevBorderWidthWidth, heightHalf - prevBorderWidthHeight, 0];
        this.addTriangle(54, point1, point2, point4);
        this.addTriangle(63, point2, point3, point4);
        return true;
      }

      return false;
    }
  }, {
    key: "drawBorder",
    value: function drawBorder(borderColor, borderSize, prevBorderSize) {
      if (this.generateBorder(borderColor, borderSize, prevBorderSize)) {
        this.gl.useProgram(this.shaderProgram);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPosLoc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aPosLoc);
        this.gl.uniform4fv(this.colorLoc, borderColor);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.positions.length / 3);
      }
    }
  }]);

  return Border;
}();



/***/ }),

/***/ "./src/rendering/sprites/darkenCenter.js":
/*!***********************************************!*\
  !*** ./src/rendering/sprites/darkenCenter.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CustomShape; });
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var CustomShape =
/*#__PURE__*/
function () {
  function CustomShape(gl, opts) {
    _classCallCheck(this, CustomShape);

    this.gl = gl;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.generatePositions();
    this.colors = new Float32Array([0, 0, 0, 3 / 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.positionVertexBuf = this.gl.createBuffer();
    this.colorVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(CustomShape, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
      this.generatePositions();
    }
  }, {
    key: "generatePositions",
    value: function generatePositions() {
      var halfSize = 0.05;
      this.positions = new Float32Array([0, 0, 0, -halfSize * this.aspecty, 0, 0, 0, -halfSize, 0, halfSize * this.aspecty, 0, 0, 0, halfSize, 0, -halfSize * this.aspecty, 0, 0]);
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aPos;\n                                      in vec4 aColor;\n                                      out vec4 vColor;\n                                      void main(void) {\n                                        vColor = aColor;\n                                        gl_Position = vec4(aPos, 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      in vec4 vColor;\n                                      out vec4 fragColor;\n                                      void main(void) {\n                                        fragColor = vColor;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
    }
  }, {
    key: "drawDarkenCenter",
    value: function drawDarkenCenter(mdVSFrame) {
      if (mdVSFrame.darken_center !== 0) {
        this.gl.useProgram(this.shaderProgram);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPosLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aPosLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aColorLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aColorLocation);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.positions.length / 3);
      }
    }
  }]);

  return CustomShape;
}();



/***/ }),

/***/ "./src/rendering/text/titleText.js":
/*!*****************************************!*\
  !*** ./src/rendering/text/titleText.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TitleText; });
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var TitleText =
/*#__PURE__*/
function () {
  function TitleText(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TitleText);

    this.gl = gl;
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.buildPositions();
    this.textTexture = this.gl.createTexture();
    this.indexBuf = gl.createBuffer();
    this.positionVertexBuf = this.gl.createBuffer();
    this.vertexBuf = this.gl.createBuffer();
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.texsizeX;
    this.canvas.height = this.texsizeY;
    this.context2D = this.canvas.getContext('2d');
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(TitleText, [{
    key: "generateTitleTexture",
    value: function generateTitleTexture(text) {
      this.context2D.clearRect(0, 0, this.texsizeX, this.texsizeY);
      this.fontSize = Math.floor(16 * (this.texsizeX / 256));
      this.fontSize = Math.max(this.fontSize, 6);
      this.context2D.font = "italic ".concat(this.fontSize, "px Times New Roman");
      var titleText = text;
      var textLength = this.context2D.measureText(titleText).width;

      if (textLength > this.texsizeX) {
        var percentToKeep = 0.91 * (this.texsizeX / textLength);
        titleText = "".concat(titleText.substring(0, Math.floor(titleText.length * percentToKeep)), "...");
        textLength = this.context2D.measureText(titleText).width;
      }

      this.context2D.fillStyle = '#FFFFFF';
      this.context2D.fillText(titleText, (this.texsizeX - textLength) / 2, this.texsizeY / 2);
      var imageData = new Uint8Array(this.context2D.getImageData(0, 0, this.texsizeX, this.texsizeY).data.buffer);
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textTexture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.texsizeX, this.texsizeY, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
  }, {
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
      this.canvas.width = this.texsizeX;
      this.canvas.height = this.texsizeY;
    } // based on https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js

  }, {
    key: "buildPositions",
    value: function buildPositions() {
      var width = 2;
      var height = 2;
      var widthHalf = width / 2;
      var heightHalf = height / 2;
      var gridX = 15;
      var gridY = 7;
      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;
      var segmentWidth = width / gridX;
      var segmentHeight = height / gridY;
      var vertices = [];

      for (var iy = 0; iy < gridY1; iy++) {
        var y = iy * segmentHeight - heightHalf;

        for (var ix = 0; ix < gridX1; ix++) {
          var x = ix * segmentWidth - widthHalf;
          vertices.push(x, -y, 0);
        }
      }

      var indices = [];

      for (var _iy = 0; _iy < gridY; _iy++) {
        for (var _ix = 0; _ix < gridX; _ix++) {
          var a = _ix + gridX1 * _iy;
          var b = _ix + gridX1 * (_iy + 1);
          var c = _ix + 1 + gridX1 * (_iy + 1);
          var d = _ix + 1 + gridX1 * _iy;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      this.vertices = new Float32Array(vertices);
      this.indices = new Uint16Array(indices);
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n       const vec2 halfmad = vec2(0.5);\n       in vec2 aPos;\n       in vec2 aUv;\n       out vec2 uv_orig;\n       out vec2 uv;\n       void main(void) {\n         gl_Position = vec4(aPos, 0.0, 1.0);\n         uv_orig = aPos * halfmad + halfmad;\n         uv = aUv;\n       }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n       precision ".concat(this.floatPrecision, " float;\n       precision highp int;\n       precision mediump sampler2D;\n\n       in vec2 uv_orig;\n       in vec2 uv;\n       out vec4 fragColor;\n       uniform sampler2D uTexture;\n       uniform float textColor;\n\n       void main(void) {\n         fragColor = texture(uTexture, uv) * vec4(textColor);\n       }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.uvLocation = this.gl.getAttribLocation(this.shaderProgram, 'aUv');
      this.textureLoc = this.gl.getUniformLocation(this.shaderProgram, 'uTexture');
      this.textColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'textColor');
    }
  }, {
    key: "generateUvs",
    value: function generateUvs(progress, flip, globalVars) {
      var gridX = 15;
      var gridY = 7;
      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;
      var uvs = [];
      var vertClip = 0.75;

      for (var j = 0; j < gridY1; j++) {
        for (var i = 0; i < gridX1; i++) {
          var u = i / gridX;
          var v = (j / gridY - 0.5) * vertClip + 0.5;
          var x = u * 2.0 - 1.0;
          var y = v * 2.0 - 1.0;

          if (progress >= 1) {
            y += 1.0 / this.texsizeY;
          }

          uvs.push(x, flip ? y : -y);
        }
      }

      var rampedProgress = Math.max(0, 1 - progress * 1.5);
      var t2 = Math.pow(rampedProgress, 1.8) * 1.3;

      for (var _j = 0; _j < gridY1; _j++) {
        for (var _i = 0; _i < gridX1; _i++) {
          var idx = _j * gridX1 + _i;
          uvs[idx] += t2 * 0.070 * Math.sin(globalVars.time * 0.31 + uvs[idx] * 0.39 - uvs[idx + 1] * 1.94);
          uvs[idx] += t2 * 0.044 * Math.sin(globalVars.time * 0.81 - uvs[idx] * 1.91 + uvs[idx + 1] * 0.27);
          uvs[idx] += t2 * 0.061 * Math.sin(globalVars.time * 1.31 + uvs[idx] * 0.61 + uvs[idx + 1] * 0.74);
          uvs[idx + 1] += t2 * 0.061 * Math.sin(globalVars.time * 0.37 + uvs[idx] * 1.83 + uvs[idx + 1] * 0.69);
          uvs[idx + 1] += t2 * 0.070 * Math.sin(globalVars.time * 0.67 + uvs[idx] * 0.42 - uvs[idx + 1] * 1.39);
          uvs[idx + 1] += t2 * 0.087 * Math.sin(globalVars.time * 1.07 + uvs[idx] * 3.55 + uvs[idx + 1] * 0.89);
        }
      }

      var scale = 1.01 / (Math.pow(progress, 0.21) + 0.01);

      for (var _i2 = 0; _i2 < uvs.length / 2; _i2++) {
        uvs[_i2 * 2] *= scale;
        uvs[_i2 * 2 + 1] *= scale * this.invAspecty; // get back UVs

        uvs[_i2 * 2] = (uvs[_i2 * 2] + 1) / 2.0;
        uvs[_i2 * 2 + 1] = (uvs[_i2 * 2 + 1] + 1) / 2.0;
      }

      return new Float32Array(uvs);
    }
  }, {
    key: "renderTitle",
    value: function renderTitle(progress, flip, globalVars) {
      this.gl.useProgram(this.shaderProgram);
      var progressUvs = this.generateUvs(progress, flip, globalVars);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, progressUvs, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.uvLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.uvLocation);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textTexture);
      this.gl.uniform1i(this.textureLoc, 0);
      this.gl.uniform1f(this.textColorLoc, Math.pow(progress, 0.3));
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
  }]);

  return TitleText;
}();



/***/ }),

/***/ "./src/rendering/waves/basicWaveform.js":
/*!**********************************************!*\
  !*** ./src/rendering/waves/basicWaveform.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BasicWaveform; });
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
/* harmony import */ var _waveUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./waveUtils */ "./src/rendering/waves/waveUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var BasicWaveform =
/*#__PURE__*/
function () {
  function BasicWaveform(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BasicWaveform);

    this.gl = gl;
    var numAudioSamples = 512;
    this.positions = new Float32Array(numAudioSamples * 3);
    this.positions2 = new Float32Array(numAudioSamples * 3);
    this.oldPositions = new Float32Array(numAudioSamples * 3);
    this.oldPositions2 = new Float32Array(numAudioSamples * 3);
    this.smoothedPositions = new Float32Array((numAudioSamples * 2 - 1) * 3);
    this.smoothedPositions2 = new Float32Array((numAudioSamples * 2 - 1) * 3);
    this.color = [0, 0, 0, 1];
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
    this.vertexBuf = this.gl.createBuffer();
  }

  _createClass(BasicWaveform, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      in vec3 aPos;\n                                      uniform vec2 thickOffset;\n                                      void main(void) {\n                                        gl_Position = vec4(aPos + vec3(thickOffset, 0.0), 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      out vec4 fragColor;\n                                      uniform vec4 u_color;\n                                      void main(void) {\n                                        fragColor = u_color;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLoc = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.colorLoc = this.gl.getUniformLocation(this.shaderProgram, 'u_color');
      this.thickOffsetLoc = this.gl.getUniformLocation(this.shaderProgram, 'thickOffset');
    }
  }, {
    key: "generateWaveform",
    value: function generateWaveform(blending, blendProgress, timeArrayL, timeArrayR, mdVSFrame) {
      var alpha = mdVSFrame.wave_a;
      var vol = (mdVSFrame.bass + mdVSFrame.mid + mdVSFrame.treb) / 3.0;

      if (vol > -0.01 && alpha > 0.001 && timeArrayL.length > 0) {
        var waveL = BasicWaveform.processWaveform(timeArrayL, mdVSFrame);
        var waveR = BasicWaveform.processWaveform(timeArrayR, mdVSFrame);
        var newWaveMode = Math.floor(mdVSFrame.wave_mode) % 8;
        var oldWaveMode = Math.floor(mdVSFrame.old_wave_mode) % 8;
        var wavePosX = mdVSFrame.wave_x * 2.0 - 1.0;
        var wavePosY = mdVSFrame.wave_y * 2.0 - 1.0;
        this.numVert = 0;
        this.oldNumVert = 0;
        var its = blending && newWaveMode !== oldWaveMode ? 2 : 1;

        for (var it = 0; it < its; it++) {
          var waveMode = it === 0 ? newWaveMode : oldWaveMode;
          var fWaveParam2 = mdVSFrame.wave_mystery;

          if ((waveMode === 0 || waveMode === 1 || waveMode === 4) && (fWaveParam2 < -1 || fWaveParam2 > 1)) {
            fWaveParam2 = fWaveParam2 * 0.5 + 0.5;
            fWaveParam2 -= Math.floor(fWaveParam2);
            fWaveParam2 = Math.abs(fWaveParam2);
            fWaveParam2 = fWaveParam2 * 2 - 1;
          }

          var numVert = void 0;
          var positions = void 0;
          var positions2 = void 0;

          if (it === 0) {
            positions = this.positions;
            positions2 = this.positions2;
          } else {
            positions = this.oldPositions;
            positions2 = this.oldPositions2;
          }

          alpha = mdVSFrame.wave_a;

          if (waveMode === 0) {
            if (mdVSFrame.modwavealphabyvolume > 0) {
              var alphaDiff = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;
              alpha *= (vol - mdVSFrame.modwavealphastart) / alphaDiff;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = Math.floor(waveL.length / 2) + 1;
            var numVertInv = 1.0 / (numVert - 1);
            var sampleOffset = Math.floor((waveL.length - numVert) / 2);

            for (var i = 0; i < numVert - 1; i++) {
              var rad = 0.5 + 0.4 * waveR[i + sampleOffset] + fWaveParam2;
              var ang = i * numVertInv * 2 * Math.PI + mdVSFrame.time * 0.2;

              if (i < numVert / 10) {
                var _mix = i / (numVert * 0.1);

                _mix = 0.5 - 0.5 * Math.cos(_mix * Math.PI);
                var rad2 = 0.5 + 0.4 * waveR[i + numVert + sampleOffset] + fWaveParam2;
                rad = (1.0 - _mix) * rad2 + rad * _mix;
              }

              positions[i * 3 + 0] = rad * Math.cos(ang) * this.aspecty + wavePosX;
              positions[i * 3 + 1] = rad * Math.sin(ang) * this.aspectx + wavePosY;
              positions[i * 3 + 2] = 0;
            } // connect the loop


            positions[(numVert - 1) * 3 + 0] = positions[0];
            positions[(numVert - 1) * 3 + 1] = positions[1];
            positions[(numVert - 1) * 3 + 2] = 0;
          } else if (waveMode === 1) {
            alpha *= 1.25;

            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = Math.floor(waveL.length / 2);

            for (var _i = 0; _i < numVert; _i++) {
              var _rad = 0.53 + 0.43 * waveR[_i] + fWaveParam2;

              var _ang = waveL[_i + 32] * 0.5 * Math.PI + mdVSFrame.time * 2.3;

              positions[_i * 3 + 0] = _rad * Math.cos(_ang) * this.aspecty + wavePosX;
              positions[_i * 3 + 1] = _rad * Math.sin(_ang) * this.aspectx + wavePosY;
              positions[_i * 3 + 2] = 0;
            }
          } else if (waveMode === 2) {
            if (this.texsizeX < 1024) {
              alpha *= 0.09;
            } else if (this.texsizeX >= 1024 && this.texsizeX < 2048) {
              alpha *= 0.11;
            } else {
              alpha *= 0.13;
            }

            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff2 = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff2;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = waveL.length;

            for (var _i2 = 0; _i2 < waveL.length; _i2++) {
              positions[_i2 * 3 + 0] = waveR[_i2] * this.aspecty + wavePosX;
              positions[_i2 * 3 + 1] = waveL[(_i2 + 32) % waveL.length] * this.aspectx + wavePosY;
              positions[_i2 * 3 + 2] = 0;
            }
          } else if (waveMode === 3) {
            if (this.texsizeX < 1024) {
              alpha *= 0.15;
            } else if (this.texsizeX >= 1024 && this.texsizeX < 2048) {
              alpha *= 0.22;
            } else {
              alpha *= 0.33;
            }

            alpha *= 1.3;
            alpha *= mdVSFrame.treb * mdVSFrame.treb; // should be treb_imm

            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff3 = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff3;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = waveL.length;

            for (var _i3 = 0; _i3 < waveL.length; _i3++) {
              positions[_i3 * 3 + 0] = waveR[_i3] * this.aspecty + wavePosX;
              positions[_i3 * 3 + 1] = waveL[(_i3 + 32) % waveL.length] * this.aspectx + wavePosY;
              positions[_i3 * 3 + 2] = 0;
            }
          } else if (waveMode === 4) {
            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff4 = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff4;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = waveL.length;

            if (numVert > this.texsizeX / 3) {
              numVert = Math.floor(this.texsizeX / 3);
            }

            var _numVertInv = 1.0 / numVert;

            var _sampleOffset = Math.floor((waveL.length - numVert) / 2);

            var w1 = 0.45 + 0.5 * (fWaveParam2 * 0.5 + 0.5);
            var w2 = 1.0 - w1;

            for (var _i4 = 0; _i4 < numVert; _i4++) {
              var x = 2.0 * _i4 * _numVertInv + (wavePosX - 1) + waveR[(_i4 + 25 + _sampleOffset) % waveL.length] * 0.44;
              var y = waveL[_i4 + _sampleOffset] * 0.47 + wavePosY; // momentum

              if (_i4 > 1) {
                x = x * w2 + w1 * (positions[(_i4 - 1) * 3 + 0] * 2.0 - positions[(_i4 - 2) * 3 + 0]);
                y = y * w2 + w1 * (positions[(_i4 - 1) * 3 + 1] * 2.0 - positions[(_i4 - 2) * 3 + 1]);
              }

              positions[_i4 * 3 + 0] = x;
              positions[_i4 * 3 + 1] = y;
              positions[_i4 * 3 + 2] = 0;
            }
          } else if (waveMode === 5) {
            if (this.texsizeX < 1024) {
              alpha *= 0.09;
            } else if (this.texsizeX >= 1024 && this.texsizeX < 2048) {
              alpha *= 0.11;
            } else {
              alpha *= 0.13;
            }

            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff5 = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff5;
            }

            alpha = Math.clamp(alpha, 0, 1);
            var cosRot = Math.cos(mdVSFrame.time * 0.3);
            var sinRot = Math.sin(mdVSFrame.time * 0.3);
            numVert = waveL.length;

            for (var _i5 = 0; _i5 < waveL.length; _i5++) {
              var ioff = (_i5 + 32) % waveL.length;
              var x0 = waveR[_i5] * waveL[ioff] + waveL[_i5] * waveR[ioff];
              var y0 = waveR[_i5] * waveR[_i5] - waveL[ioff] * waveL[ioff];
              positions[_i5 * 3 + 0] = (x0 * cosRot - y0 * sinRot) * (this.aspecty + wavePosX);
              positions[_i5 * 3 + 1] = (x0 * sinRot + y0 * cosRot) * (this.aspectx + wavePosY);
              positions[_i5 * 3 + 2] = 0;
            }
          } else if (waveMode === 6 || waveMode === 7) {
            if (mdVSFrame.modwavealphabyvolume > 0) {
              var _alphaDiff6 = mdVSFrame.modwavealphaend - mdVSFrame.modwavealphastart;

              alpha *= (vol - mdVSFrame.modwavealphastart) / _alphaDiff6;
            }

            alpha = Math.clamp(alpha, 0, 1);
            numVert = Math.floor(waveL.length / 2);

            if (numVert > this.texsizeX / 3) {
              numVert = Math.floor(this.texsizeX / 3);
            }

            var _sampleOffset2 = Math.floor((waveL.length - numVert) / 2);

            var _ang2 = Math.PI * 0.5 * fWaveParam2;

            var dx = Math.cos(_ang2);
            var dy = Math.sin(_ang2);
            var edgex = [wavePosX * Math.cos(_ang2 + Math.PI * 0.5) - dx * 3.0, wavePosX * Math.cos(_ang2 + Math.PI * 0.5) + dx * 3.0];
            var edgey = [wavePosX * Math.sin(_ang2 + Math.PI * 0.5) - dy * 3.0, wavePosX * Math.sin(_ang2 + Math.PI * 0.5) + dy * 3.0];

            for (var _i6 = 0; _i6 < 2; _i6++) {
              for (var j = 0; j < 4; j++) {
                var t = void 0;
                var bClip = false;

                switch (j) {
                  case 0:
                    if (edgex[_i6] > 1.1) {
                      t = (1.1 - edgex[1 - _i6]) / (edgex[_i6] - edgex[1 - _i6]);
                      bClip = true;
                    }

                    break;

                  case 1:
                    if (edgex[_i6] < -1.1) {
                      t = (-1.1 - edgex[1 - _i6]) / (edgex[_i6] - edgex[1 - _i6]);
                      bClip = true;
                    }

                    break;

                  case 2:
                    if (edgey[_i6] > 1.1) {
                      t = (1.1 - edgey[1 - _i6]) / (edgey[_i6] - edgey[1 - _i6]);
                      bClip = true;
                    }

                    break;

                  case 3:
                    if (edgey[_i6] < -1.1) {
                      t = (-1.1 - edgey[1 - _i6]) / (edgey[_i6] - edgey[1 - _i6]);
                      bClip = true;
                    }

                    break;

                  default:
                }

                if (bClip) {
                  var dxi = edgex[_i6] - edgex[1 - _i6];
                  var dyi = edgey[_i6] - edgey[1 - _i6];
                  edgex[_i6] = edgex[1 - _i6] + dxi * t;
                  edgey[_i6] = edgey[1 - _i6] + dyi * t;
                }
              }
            }

            dx = (edgex[1] - edgex[0]) / numVert;
            dy = (edgey[1] - edgey[0]) / numVert;
            var ang2 = Math.atan2(dy, dx);
            var perpDx = Math.cos(ang2 + Math.PI * 0.5);
            var perpDy = Math.sin(ang2 + Math.PI * 0.5);

            if (waveMode === 6) {
              for (var _i7 = 0; _i7 < numVert; _i7++) {
                var sample = waveL[_i7 + _sampleOffset2];
                positions[_i7 * 3 + 0] = edgex[0] + dx * _i7 + perpDx * 0.25 * sample;
                positions[_i7 * 3 + 1] = edgey[0] + dy * _i7 + perpDy * 0.25 * sample;
                positions[_i7 * 3 + 2] = 0;
              }
            } else if (waveMode === 7) {
              var sep = Math.pow(wavePosY * 0.5 + 0.5, 2);

              for (var _i8 = 0; _i8 < numVert; _i8++) {
                var _sample = waveL[_i8 + _sampleOffset2];
                positions[_i8 * 3 + 0] = edgex[0] + dx * _i8 + perpDx * (0.25 * _sample + sep);
                positions[_i8 * 3 + 1] = edgey[0] + dy * _i8 + perpDy * (0.25 * _sample + sep);
                positions[_i8 * 3 + 2] = 0;
              }

              for (var _i9 = 0; _i9 < numVert; _i9++) {
                var _sample2 = waveR[_i9 + _sampleOffset2];
                positions2[_i9 * 3 + 0] = edgex[0] + dx * _i9 + perpDx * (0.25 * _sample2 - sep);
                positions2[_i9 * 3 + 1] = edgey[0] + dy * _i9 + perpDy * (0.25 * _sample2 - sep);
                positions2[_i9 * 3 + 2] = 0;
              }
            }
          }

          if (it === 0) {
            this.positions = positions;
            this.positions2 = positions2;
            this.numVert = numVert;
            this.alpha = alpha;
          } else {
            this.oldPositions = positions;
            this.oldPositions2 = positions2;
            this.oldNumVert = numVert;
            this.oldAlpha = alpha;
          }
        }

        var mix = 0.5 - 0.5 * Math.cos(blendProgress * Math.PI);
        var mix2 = 1 - mix;

        if (this.oldNumVert > 0) {
          alpha = mix * this.alpha + mix2 * this.oldAlpha;
        }

        var r = Math.clamp(mdVSFrame.wave_r, 0, 1);
        var g = Math.clamp(mdVSFrame.wave_g, 0, 1);
        var b = Math.clamp(mdVSFrame.wave_b, 0, 1);

        if (mdVSFrame.wave_brighten !== 0) {
          var maxc = Math.max(r, g, b);

          if (maxc > 0.01) {
            r /= maxc;
            g /= maxc;
            b /= maxc;
          }
        }

        this.color = [r, g, b, alpha];

        if (this.oldNumVert > 0) {
          if (newWaveMode === 7) {
            var m = (this.oldNumVert - 1) / (this.numVert * 2);

            for (var _i10 = 0; _i10 < this.numVert; _i10++) {
              var fIdx = _i10 * m;
              var nIdx = Math.floor(fIdx);

              var _t = fIdx - nIdx;

              var _x = this.oldPositions[nIdx * 3 + 0] * (1 - _t) + this.oldPositions[(nIdx + 1) * 3 + 0] * _t;

              var _y = this.oldPositions[nIdx * 3 + 1] * (1 - _t) + this.oldPositions[(nIdx + 1) * 3 + 1] * _t;

              this.positions[_i10 * 3 + 0] = this.positions[_i10 * 3 + 0] * mix + _x * mix2;
              this.positions[_i10 * 3 + 1] = this.positions[_i10 * 3 + 1] * mix + _y * mix2;
              this.positions[_i10 * 3 + 2] = 0;
            }

            for (var _i11 = 0; _i11 < this.numVert; _i11++) {
              var _fIdx = (_i11 + this.numVert) * m;

              var _nIdx = Math.floor(_fIdx);

              var _t2 = _fIdx - _nIdx;

              var _x2 = this.oldPositions[_nIdx * 3 + 0] * (1 - _t2) + this.oldPositions[(_nIdx + 1) * 3 + 0] * _t2;

              var _y2 = this.oldPositions[_nIdx * 3 + 1] * (1 - _t2) + this.oldPositions[(_nIdx + 1) * 3 + 1] * _t2;

              this.positions2[_i11 * 3 + 0] = this.positions2[_i11 * 3 + 0] * mix + _x2 * mix2;
              this.positions2[_i11 * 3 + 1] = this.positions2[_i11 * 3 + 1] * mix + _y2 * mix2;
              this.positions2[_i11 * 3 + 2] = 0;
            }
          } else if (oldWaveMode === 7) {
            var halfNumVert = this.numVert / 2;

            var _m = (this.oldNumVert - 1) / halfNumVert;

            for (var _i12 = 0; _i12 < halfNumVert; _i12++) {
              var _fIdx2 = _i12 * _m;

              var _nIdx2 = Math.floor(_fIdx2);

              var _t3 = _fIdx2 - _nIdx2;

              var _x3 = this.oldPositions[_nIdx2 * 3 + 0] * (1 - _t3) + this.oldPositions[(_nIdx2 + 1) * 3 + 0] * _t3;

              var _y3 = this.oldPositions[_nIdx2 * 3 + 1] * (1 - _t3) + this.oldPositions[(_nIdx2 + 1) * 3 + 1] * _t3;

              this.positions[_i12 * 3 + 0] = this.positions[_i12 * 3 + 0] * mix + _x3 * mix2;
              this.positions[_i12 * 3 + 1] = this.positions[_i12 * 3 + 1] * mix + _y3 * mix2;
              this.positions[_i12 * 3 + 2] = 0;
            }

            for (var _i13 = 0; _i13 < halfNumVert; _i13++) {
              var _fIdx3 = _i13 * _m;

              var _nIdx3 = Math.floor(_fIdx3);

              var _t4 = _fIdx3 - _nIdx3;

              var _x4 = this.oldPositions2[_nIdx3 * 3 + 0] * (1 - _t4) + this.oldPositions2[(_nIdx3 + 1) * 3 + 0] * _t4;

              var _y4 = this.oldPositions2[_nIdx3 * 3 + 1] * (1 - _t4) + this.oldPositions2[(_nIdx3 + 1) * 3 + 1] * _t4;

              this.positions2[_i13 * 3 + 0] = this.positions[(_i13 + halfNumVert) * 3 + 0] * mix + _x4 * mix2;
              this.positions2[_i13 * 3 + 1] = this.positions[(_i13 + halfNumVert) * 3 + 1] * mix + _y4 * mix2;
              this.positions2[_i13 * 3 + 2] = 0;
            }
          } else {
            var _m2 = (this.oldNumVert - 1) / this.numVert;

            for (var _i14 = 0; _i14 < this.numVert; _i14++) {
              var _fIdx4 = _i14 * _m2;

              var _nIdx4 = Math.floor(_fIdx4);

              var _t5 = _fIdx4 - _nIdx4;

              var _x5 = this.oldPositions[_nIdx4 * 3 + 0] * (1 - _t5) + this.oldPositions[(_nIdx4 + 1) * 3 + 0] * _t5;

              var _y5 = this.oldPositions[_nIdx4 * 3 + 1] * (1 - _t5) + this.oldPositions[(_nIdx4 + 1) * 3 + 1] * _t5;

              this.positions[_i14 * 3 + 0] = this.positions[_i14 * 3 + 0] * mix + _x5 * mix2;
              this.positions[_i14 * 3 + 1] = this.positions[_i14 * 3 + 1] * mix + _y5 * mix2;
              this.positions[_i14 * 3 + 2] = 0;
            }
          }
        }

        for (var _i15 = 0; _i15 < this.numVert; _i15++) {
          this.positions[_i15 * 3 + 1] = -this.positions[_i15 * 3 + 1];
        }

        this.smoothedNumVert = this.numVert * 2 - 1;
        _waveUtils__WEBPACK_IMPORTED_MODULE_1__["default"].smoothWave(this.positions, this.smoothedPositions, this.numVert);

        if (newWaveMode === 7 || oldWaveMode === 7) {
          for (var _i16 = 0; _i16 < this.numVert; _i16++) {
            this.positions2[_i16 * 3 + 1] = -this.positions2[_i16 * 3 + 1];
          }

          _waveUtils__WEBPACK_IMPORTED_MODULE_1__["default"].smoothWave(this.positions2, this.smoothedPositions2, this.numVert);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "drawBasicWaveform",
    value: function drawBasicWaveform(blending, blendProgress, timeArrayL, timeArrayR, mdVSFrame) {
      if (this.generateWaveform(blending, blendProgress, timeArrayL, timeArrayR, mdVSFrame)) {
        this.gl.useProgram(this.shaderProgram);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.smoothedPositions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPosLoc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aPosLoc);
        this.gl.uniform4fv(this.colorLoc, this.color);
        var instances = 1;

        if (mdVSFrame.wave_thick !== 0 || mdVSFrame.wave_dots !== 0) {
          instances = 4;
        }

        if (mdVSFrame.additivewave !== 0) {
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
        } else {
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }

        var drawMode = mdVSFrame.wave_dots !== 0 ? this.gl.POINTS : this.gl.LINE_STRIP; // TODO: use drawArraysInstanced

        for (var i = 0; i < instances; i++) {
          var offset = 2;

          if (i === 0) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, 0]);
          } else if (i === 1) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, 0]);
          } else if (i === 2) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, offset / this.texsizeY]);
          } else if (i === 3) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, offset / this.texsizeY]);
          }

          this.gl.drawArrays(drawMode, 0, this.smoothedNumVert);
        }

        var waveMode = Math.floor(mdVSFrame.wave_mode) % 8;

        if (waveMode === 7) {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuf);
          this.gl.bufferData(this.gl.ARRAY_BUFFER, this.smoothedPositions2, this.gl.STATIC_DRAW);
          this.gl.vertexAttribPointer(this.aPosLoc, 3, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray(this.aPosLoc);

          for (var _i17 = 0; _i17 < instances; _i17++) {
            var _offset = 2;

            if (_i17 === 0) {
              this.gl.uniform2fv(this.thickOffsetLoc, [0, 0]);
            } else if (_i17 === 1) {
              this.gl.uniform2fv(this.thickOffsetLoc, [_offset / this.texsizeX, 0]);
            } else if (_i17 === 2) {
              this.gl.uniform2fv(this.thickOffsetLoc, [0, _offset / this.texsizeY]);
            } else if (_i17 === 3) {
              this.gl.uniform2fv(this.thickOffsetLoc, [_offset / this.texsizeX, _offset / this.texsizeY]);
            }

            this.gl.drawArrays(drawMode, 0, this.smoothedNumVert);
          }
        }
      }
    }
  }], [{
    key: "processWaveform",
    value: function processWaveform(timeArray, mdVSFrame) {
      var waveform = [];
      var scale = mdVSFrame.wave_scale / 128.0;
      var smooth = mdVSFrame.wave_smoothing;
      var smooth2 = scale * (1.0 - smooth);
      waveform.push(timeArray[0] * scale);

      for (var i = 1; i < timeArray.length; i++) {
        waveform.push(timeArray[i] * smooth2 + waveform[i - 1] * smooth);
      }

      return waveform;
    }
  }]);

  return BasicWaveform;
}();



/***/ }),

/***/ "./src/rendering/waves/customWaveform.js":
/*!***********************************************!*\
  !*** ./src/rendering/waves/customWaveform.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CustomWaveform; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils.js");
/* harmony import */ var _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaders/shaderUtils */ "./src/rendering/shaders/shaderUtils.js");
/* harmony import */ var _waveUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./waveUtils */ "./src/rendering/waves/waveUtils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var CustomWaveform =
/*#__PURE__*/
function () {
  function CustomWaveform(index, gl, opts) {
    _classCallCheck(this, CustomWaveform);

    this.index = index;
    this.gl = gl;
    var maxSamples = 512;
    this.pointsData = [new Float32Array(maxSamples), new Float32Array(maxSamples)];
    this.positions = new Float32Array(maxSamples * 3);
    this.colors = new Float32Array(maxSamples * 4);
    this.smoothedPositions = new Float32Array((maxSamples * 2 - 1) * 3);
    this.smoothedColors = new Float32Array((maxSamples * 2 - 1) * 4);
    this.texsizeX = opts.texsizeX;
    this.texsizeY = opts.texsizeY;
    this.mesh_width = opts.mesh_width;
    this.mesh_height = opts.mesh_height;
    this.aspectx = opts.aspectx;
    this.aspecty = opts.aspecty;
    this.invAspectx = 1.0 / this.aspectx;
    this.invAspecty = 1.0 / this.aspecty;
    this.positionVertexBuf = this.gl.createBuffer();
    this.colorVertexBuf = this.gl.createBuffer();
    this.floatPrecision = _shaders_shaderUtils__WEBPACK_IMPORTED_MODULE_1__["default"].getFragmentFloatPrecision(this.gl);
    this.createShader();
  }

  _createClass(CustomWaveform, [{
    key: "updateGlobals",
    value: function updateGlobals(opts) {
      this.texsizeX = opts.texsizeX;
      this.texsizeY = opts.texsizeY;
      this.mesh_width = opts.mesh_width;
      this.mesh_height = opts.mesh_height;
      this.aspectx = opts.aspectx;
      this.aspecty = opts.aspecty;
      this.invAspectx = 1.0 / this.aspectx;
      this.invAspecty = 1.0 / this.aspecty;
    }
  }, {
    key: "createShader",
    value: function createShader() {
      this.shaderProgram = this.gl.createProgram();
      var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vertShader, "#version 300 es\n                                      uniform float uSize;\n                                      uniform vec2 thickOffset;\n                                      in vec3 aPos;\n                                      in vec4 aColor;\n                                      out vec4 vColor;\n                                      void main(void) {\n                                        vColor = aColor;\n                                        gl_PointSize = uSize;\n                                        gl_Position = vec4(aPos + vec3(thickOffset, 0.0), 1.0);\n                                      }");
      this.gl.compileShader(vertShader);
      var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fragShader, "#version 300 es\n                                      precision ".concat(this.floatPrecision, " float;\n                                      precision highp int;\n                                      precision mediump sampler2D;\n                                      in vec4 vColor;\n                                      out vec4 fragColor;\n                                      void main(void) {\n                                        fragColor = vColor;\n                                      }"));
      this.gl.compileShader(fragShader);
      this.gl.attachShader(this.shaderProgram, vertShader);
      this.gl.attachShader(this.shaderProgram, fragShader);
      this.gl.linkProgram(this.shaderProgram);
      this.aPosLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPos');
      this.aColorLocation = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
      this.sizeLoc = this.gl.getUniformLocation(this.shaderProgram, 'uSize');
      this.thickOffsetLoc = this.gl.getUniformLocation(this.shaderProgram, 'thickOffset');
    }
  }, {
    key: "generateWaveform",
    value: function generateWaveform(timeArrayL, timeArrayR, freqArrayL, freqArrayR, globalVars, presetEquationRunner, waveEqs, alphaMult) {
      if (waveEqs.baseVals.enabled !== 0 && timeArrayL.length > 0) {
        var mdVSWave = Object.assign({}, presetEquationRunner.mdVSWaves[this.index], presetEquationRunner.mdVSFrameMapWaves[this.index], presetEquationRunner.mdVSQAfterFrame, presetEquationRunner.mdVSTWaveInits[this.index], globalVars);
        var mdVSWaveFrame = waveEqs.frame_eqs(mdVSWave);
        var maxSamples = 512;

        if (Object.prototype.hasOwnProperty.call(mdVSWaveFrame, 'samples')) {
          this.samples = mdVSWaveFrame.samples;
        } else {
          this.samples = maxSamples;
        }

        if (this.samples > maxSamples) {
          this.samples = maxSamples;
        }

        this.samples = Math.floor(this.samples);
        var sep = Math.floor(mdVSWaveFrame.sep);
        var scaling = mdVSWaveFrame.scaling;
        var spectrum = mdVSWaveFrame.spectrum;
        var smoothing = mdVSWaveFrame.smoothing;
        var usedots = mdVSWaveFrame.usedots;
        var frameR = mdVSWaveFrame.r;
        var frameG = mdVSWaveFrame.g;
        var frameB = mdVSWaveFrame.b;
        var frameA = mdVSWaveFrame.a;
        var waveScale = presetEquationRunner.mdVS.wave_scale;
        this.samples -= sep;

        if (this.samples >= 2 || usedots !== 0 && this.samples >= 1) {
          var useSpectrum = spectrum !== 0;
          var scale = (useSpectrum ? 0.15 : 0.004) * scaling * waveScale;
          var pointsLeft = useSpectrum ? freqArrayL : timeArrayL;
          var pointsRight = useSpectrum ? freqArrayR : timeArrayR;
          var j0 = useSpectrum ? 0 : Math.floor((maxSamples - this.samples) / 2 - sep / 2);
          var j1 = useSpectrum ? 0 : Math.floor((maxSamples - this.samples) / 2 + sep / 2);
          var t = useSpectrum ? (maxSamples - sep) / this.samples : 1;
          var mix1 = Math.pow(smoothing * 0.98, 0.5);
          var mix2 = 1 - mix1; // Milkdrop smooths waveform forward, backward and then scales

          this.pointsData[0][0] = pointsLeft[j0];
          this.pointsData[1][0] = pointsRight[j1];

          for (var j = 1; j < this.samples; j++) {
            var left = pointsLeft[Math.floor(j * t + j0)];
            var right = pointsRight[Math.floor(j * t + j1)];
            this.pointsData[0][j] = left * mix2 + this.pointsData[0][j - 1] * mix1;
            this.pointsData[1][j] = right * mix2 + this.pointsData[1][j - 1] * mix1;
          }

          for (var _j = this.samples - 2; _j >= 0; _j--) {
            this.pointsData[0][_j] = this.pointsData[0][_j] * mix2 + this.pointsData[0][_j + 1] * mix1;
            this.pointsData[1][_j] = this.pointsData[1][_j] * mix2 + this.pointsData[1][_j + 1] * mix1;
          }

          for (var _j2 = 0; _j2 < this.samples; _j2++) {
            this.pointsData[0][_j2] *= scale;
            this.pointsData[1][_j2] *= scale;
          }

          for (var _j3 = 0; _j3 < this.samples; _j3++) {
            var value1 = this.pointsData[0][_j3];
            var value2 = this.pointsData[1][_j3];
            mdVSWaveFrame.sample = _j3 / (this.samples - 1);
            mdVSWaveFrame.value1 = value1;
            mdVSWaveFrame.value2 = value2;
            mdVSWaveFrame.x = 0.5 + value1;
            mdVSWaveFrame.y = 0.5 + value2;
            mdVSWaveFrame.r = frameR;
            mdVSWaveFrame.g = frameG;
            mdVSWaveFrame.b = frameB;
            mdVSWaveFrame.a = frameA;

            if (waveEqs.point_eqs !== '') {
              mdVSWaveFrame = waveEqs.point_eqs(mdVSWaveFrame);
            }

            var x = (mdVSWaveFrame.x * 2 - 1) * this.invAspectx;
            var y = (mdVSWaveFrame.y * -2 + 1) * this.invAspecty;
            var r = mdVSWaveFrame.r;
            var g = mdVSWaveFrame.g;
            var b = mdVSWaveFrame.b;
            var a = mdVSWaveFrame.a;
            this.positions[_j3 * 3 + 0] = x;
            this.positions[_j3 * 3 + 1] = y;
            this.positions[_j3 * 3 + 2] = 0;
            this.colors[_j3 * 4 + 0] = r;
            this.colors[_j3 * 4 + 1] = g;
            this.colors[_j3 * 4 + 2] = b;
            this.colors[_j3 * 4 + 3] = a * alphaMult;
          } // this needs to be after per point (check fishbrain - witchcraft)


          var mdvsUserKeysWave = presetEquationRunner.mdVSUserKeysWaves[this.index];
          var mdVSNewFrameMapWave = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].pick(mdVSWaveFrame, mdvsUserKeysWave); // eslint-disable-next-line no-param-reassign

          presetEquationRunner.mdVSFrameMapWaves[this.index] = mdVSNewFrameMapWave;
          this.mdVSWaveFrame = mdVSWaveFrame;

          if (usedots === 0) {
            _waveUtils__WEBPACK_IMPORTED_MODULE_2__["default"].smoothWaveAndColor(this.positions, this.colors, this.smoothedPositions, this.smoothedColors, this.samples);
          }

          return true;
        }
      }

      return false;
    }
  }, {
    key: "drawCustomWaveform",
    value: function drawCustomWaveform(blendProgress, timeArrayL, timeArrayR, freqArrayL, freqArrayR, globalVars, presetEquationRunner, waveEqs) {
      if (waveEqs && this.generateWaveform(timeArrayL, timeArrayR, freqArrayL, freqArrayR, globalVars, presetEquationRunner, waveEqs, blendProgress)) {
        this.gl.useProgram(this.shaderProgram);
        var waveUseDots = this.mdVSWaveFrame.usedots !== 0;
        var waveThick = this.mdVSWaveFrame.thick !== 0;
        var waveAdditive = this.mdVSWaveFrame.additive !== 0;
        var positions;
        var colors;
        var numVerts;

        if (!waveUseDots) {
          positions = this.smoothedPositions;
          colors = this.smoothedColors;
          numVerts = this.samples * 2 - 1;
        } else {
          positions = this.positions;
          colors = this.colors;
          numVerts = this.samples;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aPosLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aPosLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVertexBuf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.aColorLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aColorLocation);
        var instances = 1;

        if (waveUseDots) {
          if (waveThick) {
            this.gl.uniform1f(this.sizeLoc, 2 + (this.texsizeX >= 1024 ? 1 : 0));
          } else {
            this.gl.uniform1f(this.sizeLoc, 1 + (this.texsizeX >= 1024 ? 1 : 0));
          }
        } else {
          this.gl.uniform1f(this.sizeLoc, 1);

          if (waveThick) {
            instances = 4;
          }
        }

        if (waveAdditive) {
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
        } else {
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }

        var drawMode = waveUseDots ? this.gl.POINTS : this.gl.LINE_STRIP; // TODO: use drawArraysInstanced

        for (var i = 0; i < instances; i++) {
          var offset = 2;

          if (i === 0) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, 0]);
          } else if (i === 1) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, 0]);
          } else if (i === 2) {
            this.gl.uniform2fv(this.thickOffsetLoc, [0, offset / this.texsizeY]);
          } else if (i === 3) {
            this.gl.uniform2fv(this.thickOffsetLoc, [offset / this.texsizeX, offset / this.texsizeY]);
          }

          this.gl.drawArrays(drawMode, 0, numVerts);
        }
      }
    }
  }]);

  return CustomWaveform;
}();



/***/ }),

/***/ "./src/rendering/waves/waveUtils.js":
/*!******************************************!*\
  !*** ./src/rendering/waves/waveUtils.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WaveUtils; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WaveUtils =
/*#__PURE__*/
function () {
  function WaveUtils() {
    _classCallCheck(this, WaveUtils);
  }

  _createClass(WaveUtils, null, [{
    key: "smoothWave",

    /* eslint-disable no-param-reassign */
    value: function smoothWave(positions, positionsSmoothed, nVertsIn) {
      var zCoord = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var c1 = -0.15;
      var c2 = 1.15;
      var c3 = 1.15;
      var c4 = -0.15;
      var invSum = 1.0 / (c1 + c2 + c3 + c4);
      var j = 0;
      var iBelow = 0;
      var iAbove;
      var iAbove2 = 1;

      for (var i = 0; i < nVertsIn - 1; i++) {
        iAbove = iAbove2;
        iAbove2 = Math.min(nVertsIn - 1, i + 2);

        for (var k = 0; k < 3; k++) {
          positionsSmoothed[j * 3 + k] = positions[i * 3 + k];
        }

        if (zCoord) {
          for (var _k = 0; _k < 3; _k++) {
            positionsSmoothed[(j + 1) * 3 + _k] = (c1 * positions[iBelow * 3 + _k] + c2 * positions[i * 3 + _k] + c3 * positions[iAbove * 3 + _k] + c4 * positions[iAbove2 * 3 + _k]) * invSum;
          }
        } else {
          for (var _k2 = 0; _k2 < 2; _k2++) {
            positionsSmoothed[(j + 1) * 3 + _k2] = (c1 * positions[iBelow * 3 + _k2] + c2 * positions[i * 3 + _k2] + c3 * positions[iAbove * 3 + _k2] + c4 * positions[iAbove2 * 3 + _k2]) * invSum;
          }

          positionsSmoothed[(j + 1) * 3 + 2] = 0;
        }

        iBelow = i;
        j += 2;
      }

      for (var _k3 = 0; _k3 < 3; _k3++) {
        positionsSmoothed[j * 3 + _k3] = positions[(nVertsIn - 1) * 3 + _k3];
      }
    }
  }, {
    key: "smoothWaveAndColor",
    value: function smoothWaveAndColor(positions, colors, positionsSmoothed, colorsSmoothed, nVertsIn) {
      var zCoord = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      var c1 = -0.15;
      var c2 = 1.15;
      var c3 = 1.15;
      var c4 = -0.15;
      var invSum = 1.0 / (c1 + c2 + c3 + c4);
      var j = 0;
      var iBelow = 0;
      var iAbove;
      var iAbove2 = 1;

      for (var i = 0; i < nVertsIn - 1; i++) {
        iAbove = iAbove2;
        iAbove2 = Math.min(nVertsIn - 1, i + 2);

        for (var k = 0; k < 3; k++) {
          positionsSmoothed[j * 3 + k] = positions[i * 3 + k];
        }

        if (zCoord) {
          for (var _k4 = 0; _k4 < 3; _k4++) {
            positionsSmoothed[(j + 1) * 3 + _k4] = (c1 * positions[iBelow * 3 + _k4] + c2 * positions[i * 3 + _k4] + c3 * positions[iAbove * 3 + _k4] + c4 * positions[iAbove2 * 3 + _k4]) * invSum;
          }
        } else {
          for (var _k5 = 0; _k5 < 2; _k5++) {
            positionsSmoothed[(j + 1) * 3 + _k5] = (c1 * positions[iBelow * 3 + _k5] + c2 * positions[i * 3 + _k5] + c3 * positions[iAbove * 3 + _k5] + c4 * positions[iAbove2 * 3 + _k5]) * invSum;
          }

          positionsSmoothed[(j + 1) * 3 + 2] = 0;
        }

        for (var _k6 = 0; _k6 < 4; _k6++) {
          colorsSmoothed[j * 4 + _k6] = colors[i * 4 + _k6];
          colorsSmoothed[(j + 1) * 4 + _k6] = colors[i * 4 + _k6];
        }

        iBelow = i;
        j += 2;
      }

      for (var _k7 = 0; _k7 < 3; _k7++) {
        positionsSmoothed[j * 3 + _k7] = positions[(nVertsIn - 1) * 3 + _k7];
      }

      for (var _k8 = 0; _k8 < 4; _k8++) {
        colorsSmoothed[j * 4 + _k8] = colors[(nVertsIn - 1) * 4 + _k8];
      }
    }
    /* eslint-enable no-param-reassign */

  }]);

  return WaveUtils;
}();



/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Utils; });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "atan2",
    value: function atan2(x, y) {
      var a = Math.atan2(x, y);

      if (a < 0) {
        a += 2 * Math.PI;
      }

      return a;
    }
  }, {
    key: "cloneVars",
    value: function cloneVars(vars) {
      return Object.assign({}, vars);
    }
  }, {
    key: "range",
    value: function range(start, end) {
      if (end === undefined) {
        return _toConsumableArray(Array(start).keys());
      }

      return Array.from({
        length: end - start
      }, function (_, i) {
        return i + start;
      });
    }
  }, {
    key: "pick",
    value: function pick(obj, keys) {
      var newObj = {};

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        newObj[key] = obj[key];
      }

      return newObj;
    }
  }, {
    key: "omit",
    value: function omit(obj, keys) {
      var newObj = Object.assign({}, obj);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        delete newObj[key];
      }

      return newObj;
    }
  }]);

  return Utils;
}();



/***/ }),

/***/ "./src/visualizer.js":
/*!***************************!*\
  !*** ./src/visualizer.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Visualizer; });
/* harmony import */ var _audio_audioProcessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio/audioProcessor */ "./src/audio/audioProcessor.js");
/* harmony import */ var _rendering_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rendering/renderer */ "./src/rendering/renderer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var Visualizer =
/*#__PURE__*/
function () {
  function Visualizer(audioContext, canvas, opts) {
    _classCallCheck(this, Visualizer);

    this.audio = new _audio_audioProcessor__WEBPACK_IMPORTED_MODULE_0__["default"](audioContext);
    var gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false
    });
    this.baseValsDefaults = {
      decay: 0.98,
      gammaadj: 2,
      echo_zoom: 2,
      echo_alpha: 0,
      echo_orient: 0,
      red_blue: 0,
      brighten: 0,
      darken: 0,
      wrap: 1,
      darken_center: 0,
      solarize: 0,
      invert: 0,
      fshader: 0,
      b1n: 0,
      b2n: 0,
      b3n: 0,
      b1x: 1,
      b2x: 1,
      b3x: 1,
      b1ed: 0.25,
      wave_mode: 0,
      additivewave: 0,
      wave_dots: 0,
      wave_thick: 0,
      wave_a: 0.8,
      wave_scale: 1,
      wave_smoothing: 0.75,
      wave_mystery: 0,
      modwavealphabyvolume: 0,
      modwavealphastart: 0.75,
      modwavealphaend: 0.95,
      wave_r: 1,
      wave_g: 1,
      wave_b: 1,
      wave_x: 0.5,
      wave_y: 0.5,
      wave_brighten: 1,
      mv_x: 12,
      mv_y: 9,
      mv_dx: 0,
      mv_dy: 0,
      mv_l: 0.9,
      mv_r: 1,
      mv_g: 1,
      mv_b: 1,
      mv_a: 1,
      warpanimspeed: 1,
      warpscale: 1,
      zoomexp: 1,
      zoom: 1,
      rot: 0,
      cx: 0.5,
      cy: 0.5,
      dx: 0,
      dy: 0,
      warp: 1,
      sx: 1,
      sy: 1,
      ob_size: 0.01,
      ob_r: 0,
      ob_g: 0,
      ob_b: 0,
      ob_a: 0,
      ib_size: 0.01,
      ib_r: 0.25,
      ib_g: 0.25,
      ib_b: 0.25,
      ib_a: 0
    };
    this.shapeBaseValsDefaults = {
      enabled: 0,
      sides: 4,
      additive: 0,
      thickoutline: 0,
      textured: 0,
      num_inst: 1,
      tex_zoom: 1,
      tex_ang: 0,
      x: 0.5,
      y: 0.5,
      rad: 0.1,
      ang: 0,
      r: 1,
      g: 0,
      b: 0,
      a: 1,
      r2: 0,
      g2: 1,
      b2: 0,
      a2: 0,
      border_r: 1,
      border_g: 1,
      border_b: 1,
      border_a: 0.1
    };
    this.waveBaseValsDefaults = {
      enabled: 0,
      samples: 512,
      sep: 0,
      scaling: 1,
      smoothing: 0.5,
      r: 1,
      g: 1,
      b: 1,
      a: 1,
      spectrum: 0,
      usedots: 0,
      thick: 0,
      additive: 0
    };
    this.renderer = new _rendering_renderer__WEBPACK_IMPORTED_MODULE_1__["default"](gl, this.audio, opts);
  }

  _createClass(Visualizer, [{
    key: "connectAudio",
    value: function connectAudio(audioNode) {
      this.audioNode = audioNode;
      this.audio.connectAudio(audioNode);
    }
  }, {
    key: "disconnectAudio",
    value: function disconnectAudio(audioNode) {
      this.audio.disconnectAudio(audioNode);
    }
  }, {
    key: "loadPreset",
    value: function loadPreset(presetMap) {
      var blendTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var preset = Object.assign({}, presetMap);
      preset.baseVals = Object.assign({}, this.baseValsDefaults, preset.baseVals);

      for (var i = 0; i < preset.shapes.length; i++) {
        preset.shapes[i].baseVals = Object.assign({}, this.shapeBaseValsDefaults, preset.shapes[i].baseVals);
      }

      for (var _i = 0; _i < preset.waves.length; _i++) {
        preset.waves[_i].baseVals = Object.assign({}, this.waveBaseValsDefaults, preset.waves[_i].baseVals);
      }

      if (typeof preset.init_eqs !== 'function') {
        /* eslint-disable no-param-reassign, no-new-func */
        preset.init_eqs = new Function('a', "".concat(preset.init_eqs_str, " return a;"));
        preset.frame_eqs = new Function('a', "".concat(preset.frame_eqs_str, " return a;"));

        if (preset.pixel_eqs_str && preset.pixel_eqs_str !== '') {
          preset.pixel_eqs = new Function('a', "".concat(preset.pixel_eqs_str, " return a;"));
        } else {
          preset.pixel_eqs = '';
        }

        for (var _i2 = 0; _i2 < preset.shapes.length; _i2++) {
          if (preset.shapes[_i2].baseVals.enabled !== 0) {
            preset.shapes[_i2] = Object.assign({}, preset.shapes[_i2], {
              init_eqs: new Function('a', "".concat(preset.shapes[_i2].init_eqs_str, " return a;")),
              frame_eqs: new Function('a', "".concat(preset.shapes[_i2].frame_eqs_str, " return a;"))
            });
          }
        }

        for (var _i3 = 0; _i3 < preset.waves.length; _i3++) {
          if (preset.waves[_i3].baseVals.enabled !== 0) {
            var wave = {
              init_eqs: new Function('a', "".concat(preset.waves[_i3].init_eqs_str, " return a;")),
              frame_eqs: new Function('a', "".concat(preset.waves[_i3].frame_eqs_str, " return a;"))
            };

            if (preset.waves[_i3].point_eqs_str && preset.waves[_i3].point_eqs_str !== '') {
              wave.point_eqs = new Function('a', "".concat(preset.waves[_i3].point_eqs_str, " return a;"));
            } else {
              wave.point_eqs = '';
            }

            preset.waves[_i3] = Object.assign({}, preset.waves[_i3], wave);
          }
        }
        /* eslint-enable no-param-reassign, no-new-func */

      }

      this.renderer.loadPreset(preset, blendTime);
    }
  }, {
    key: "loadExtraImages",
    value: function loadExtraImages(imageData) {
      this.renderer.loadExtraImages(imageData);
    }
  }, {
    key: "setRendererSize",
    value: function setRendererSize(width, height) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.renderer.setRendererSize(width, height, opts);
    }
  }, {
    key: "setInternalMeshSize",
    value: function setInternalMeshSize(width, height) {
      this.renderer.setInternalMeshSize(width, height);
    }
  }, {
    key: "setOutputAA",
    value: function setOutputAA(useAA) {
      this.renderer.setOutputAA(useAA);
    }
  }, {
    key: "render",
    value: function render(opts) {
      this.renderer.render(opts);
    }
  }, {
    key: "launchSongTitleAnim",
    value: function launchSongTitleAnim(text) {
      this.renderer.launchSongTitleAnim(text);
    }
  }, {
    key: "toDataURL",
    value: function toDataURL() {
      return this.renderer.toDataURL();
    }
  }, {
    key: "warpBufferToDataURL",
    value: function warpBufferToDataURL() {
      return this.renderer.warpBufferToDataURL();
    }
  }]);

  return Visualizer;
}();



/***/ })

/******/ });
});
//# sourceMappingURL=butterchurn.js.map