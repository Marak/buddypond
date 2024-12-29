import StreamingWaveform from "../../ui/StreamingWaveform.js";

export default async function _sliceAndLoadToPads(audioBuffer) {
    // Detect beats and retrieve beat grid
    //let beatGrid = await detectSmallerBeats(audioBuffer);
    let beatGrid = [];
    console.log("Beat grid:", beatGrid);

    const sliceCount = 8;
    let slicePoints = []; // To hold slice start and end times

    if (beatGrid && beatGrid.beatTimes && beatGrid.beatTimes.length > 0) {
        const beatTimes = beatGrid.beatTimes;

        // Logic to determine evenly spaced beats
        if (beatTimes.length <= sliceCount) {
            // Use the first 8 beats or fewer
            slicePoints = beatTimes.slice(0, sliceCount);
        } else {
            // Divide beats evenly into 8 slices
            const step = Math.floor(beatTimes.length / sliceCount);
            for (let i = 0; i < sliceCount; i++) {
                slicePoints.push(beatTimes[i * step]);
            }
        }

        // Ensure the first beat starts at 0
        if (slicePoints[0] !== 0) slicePoints.unshift(0);

        // Adjust to ensure exactly 8 slices
        while (slicePoints.length > sliceCount) {
            slicePoints.pop();
        }
        while (slicePoints.length < sliceCount) {
            slicePoints.push(audioBuffer.duration); // Fill remaining slices
        }

        console.log("Adjusted slice points based on beats:", slicePoints);
    } else {
        // Fallback to uniform slices if beat grid fails
        const sliceDuration = audioBuffer.duration / sliceCount;
        for (let i = 0; i < sliceCount; i++) {
            slicePoints.push(i * sliceDuration);
        }
        slicePoints.push(audioBuffer.duration);
    }

    // Perform slicing and waveform rendering
    for (let i = 0; i < sliceCount; i++) {
        const start = slicePoints[i];
        const end = slicePoints[i + 1] || audioBuffer.duration;

        // Render waveform behind the pad button
        const padContainer = this.pads[i]; // Access the pad container
        const waveformContainer = padContainer.querySelector(".sampler-waveform-container");

        // Slice the audio buffer
        const slicedBuffer = this._sliceAudioBuffer(audioBuffer, start, end);
        this.sampler.buffers[i] = slicedBuffer;

        // get the pad button associated with sampler i and remove its innerText
        const button = padContainer.querySelector(".sampler-pad-button");
        button.innerText = "";

        waveformContainer.innerHTML = "";

        // Clear any existing waveform
        waveformContainer.innerHTML = "";
        new StreamingWaveform({
            audioContext: this.audioContext,
            buffer: slicedBuffer,
            parent: waveformContainer,
            width: 196,
            height: 100,
        });

        console.log(`Loaded slice ${i + 1} from ${start.toFixed(2)}s to ${end.toFixed(2)}s`);
    }
}
