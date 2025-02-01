"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBlobURL = exports.downloadWithProgress = exports.importScript = exports.fetchFile = void 0;
const errors_js_1 = require("./errors.js");
const const_js_1 = require("./const.js");
const readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
        const { result } = fileReader;
        if (result instanceof ArrayBuffer) {
            resolve(new Uint8Array(result));
        }
        else {
            resolve(new Uint8Array());
        }
    };
    fileReader.onerror = (event) => {
        var _a, _b;
        reject(Error(`File could not be read! Code=${((_b = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code) || -1}`));
    };
    fileReader.readAsArrayBuffer(blob);
});
/**
 * An util function to fetch data from url string, base64, URL, File or Blob format.
 *
 * Examples:
 * ```ts
 * // URL
 * await fetchFile("http://localhost:3000/video.mp4");
 * // base64
 * await fetchFile("data:<type>;base64,wL2dvYWwgbW9yZ...");
 * // URL
 * await fetchFile(new URL("video.mp4", import.meta.url));
 * // File
 * fileInput.addEventListener('change', (e) => {
 *   await fetchFile(e.target.files[0]);
 * });
 * // Blob
 * const blob = new Blob(...);
 * await fetchFile(blob);
 * ```
 */
const fetchFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    if (typeof file === "string") {
        /* From base64 format */
        if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
            data = atob(file.split(",")[1])
                .split("")
                .map((c) => c.charCodeAt(0));
            /* From remote server/URL */
        }
        else {
            data = yield (yield fetch(file)).arrayBuffer();
        }
    }
    else if (file instanceof URL) {
        data = yield (yield fetch(file)).arrayBuffer();
    }
    else if (file instanceof File || file instanceof Blob) {
        data = yield readFromBlobOrFile(file);
    }
    else {
        return new Uint8Array();
    }
    return new Uint8Array(data);
});
exports.fetchFile = fetchFile;
/**
 * importScript dynamically import a script, useful when you
 * want to use different versions of ffmpeg.wasm based on environment.
 *
 * Example:
 *
 * ```ts
 * await importScript("http://localhost:3000/ffmpeg.js");
 * ```
 */
const importScript = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        const eventHandler = () => {
            script.removeEventListener("load", eventHandler);
            resolve();
        };
        script.src = url;
        script.type = "text/javascript";
        script.addEventListener("load", eventHandler);
        document.getElementsByTagName("head")[0].appendChild(script);
    });
});
exports.importScript = importScript;
/**
 * Download content of a URL with progress.
 *
 * Progress only works when Content-Length is provided by the server.
 *
 */
const downloadWithProgress = (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const resp = yield fetch(url);
    let buf;
    try {
        // Set total to -1 to indicate that there is not Content-Type Header.
        const total = parseInt(resp.headers.get(const_js_1.HeaderContentLength) || "-1");
        const reader = (_a = resp.body) === null || _a === void 0 ? void 0 : _a.getReader();
        if (!reader)
            throw errors_js_1.ERROR_RESPONSE_BODY_READER;
        const chunks = [];
        let received = 0;
        for (;;) {
            const { done, value } = yield reader.read();
            const delta = value ? value.length : 0;
            if (done) {
                if (total != -1 && total !== received)
                    throw errors_js_1.ERROR_INCOMPLETED_DOWNLOAD;
                cb && cb({ url, total, received, delta, done });
                break;
            }
            chunks.push(value);
            received += delta;
            cb && cb({ url, total, received, delta, done });
        }
        const data = new Uint8Array(received);
        let position = 0;
        for (const chunk of chunks) {
            data.set(chunk, position);
            position += chunk.length;
        }
        buf = data.buffer;
    }
    catch (e) {
        console.log(`failed to send download progress event: `, e);
        // Fetch arrayBuffer directly when it is not possible to get progress.
        buf = yield resp.arrayBuffer();
        cb &&
            cb({
                url,
                total: buf.byteLength,
                received: buf.byteLength,
                delta: 0,
                done: true,
            });
    }
    return buf;
});
exports.downloadWithProgress = downloadWithProgress;
/**
 * toBlobURL fetches data from an URL and return a blob URL.
 *
 * Example:
 *
 * ```ts
 * await toBlobURL("http://localhost:3000/ffmpeg.js", "text/javascript");
 * ```
 */
const toBlobURL = (url, mimeType, progress = false, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = progress
        ? yield (0, exports.downloadWithProgress)(url, cb)
        : yield (yield fetch(url)).arrayBuffer();
    const blob = new Blob([buf], { type: mimeType });
    return URL.createObjectURL(blob);
});
exports.toBlobURL = toBlobURL;
