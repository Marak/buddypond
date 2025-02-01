importScripts('ffmpeg.js');

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

self.onmessage = async function (e) {
    try {
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        const arrayBuffer = e.data;
        const fileName = 'input.mp3';
        
        await ffmpeg.FS('writeFile', fileName, new Uint8Array(arrayBuffer));
        await ffmpeg.run('-i', fileName, 'output.wav');

        const outputData = ffmpeg.FS('readFile', 'output.wav');

        self.postMessage(outputData.buffer, [outputData.buffer]); // Send processed WAV file back
    } catch (err) {
        self.postMessage({ error: err.message });
    }
};
