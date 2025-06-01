import WaveSurfer from '../../vendor/wavesurfer.js/dist/wavesurfer.js';
import WaveSurferShim from './waveSurferShim.js';
import RegionsPlugin from '../../vendor/wavesurfer.js/dist/plugins/regions.esm.js';
import HoverPlugin from '../../vendor/wavesurfer.js/dist/plugins/hover.esm.js';
import TimelinePlugin from '../../vendor/wavesurfer.js/dist/plugins/timeline.esm.js';


let WaveSurferClass = WaveSurfer;
let RegionsPluginClass = RegionsPlugin;

let RegionsPluginShim = {
    create: function (options) {
        return {
            addRegion: function (options) {
                console.log('RegionsPluginShim.addRegion', options);
            },
            on: function (event, callback) {
                console.log('RegionsPluginShim.on', event, callback);
            }
        }
    }
};

let prevPeaks = null;

export default async function createWaveform(track, trackId, index, trackContainer) {

    if (track.noWavesurfer) {
        WaveSurferClass = WaveSurferShim;
        RegionsPluginClass = RegionsPluginShim;
    }

    trackContainer = trackContainer || document.getElementById(trackId);


    console.log('createWaveform', track, trackId, index, trackContainer);

    if (!trackContainer) {
        throw new Error(`Track container not found for trackId: ${trackId}. Cannot createWaveform()`);
    }


    let waveformContainer = document.getElementById(`#waveformContainer${index + 1}`);

    // Overview of entire track ( zoomed out smaller size )
    let overviewContainer = document.querySelector(`#overviewWaveform${index + 1}`);

    // Detailed view of track ( zoomed in larger size )
    let detailedContainer = document.querySelector(`#detailedWaveform${index + 1}`);

    // Initialize the seeking flag
    let isProgrammaticSeek = false;

    // console.log('track.metadata.beatLength', track.metadata.beatLength)
    // Create a timeline plugin instance with custom options
    const topTimeline = TimelinePlugin.create({
        height: 20,
        insertPosition: 'beforebegin',
        timeInterval: track.metadata.beatLength,
        primaryLabelInterval: track.metadata.beatLength * 4,
        secondaryLabelInterval: track.metadata.beatLength,
        formatTimeCallback: (seconds, timeline) => {
            // return beats and measures
            const beats = Math.floor(seconds / track.metadata.beatLength);
            const measures = Math.floor(beats / 4);
            const beat = beats % 4;
            return `${measures}:${beat}`;
        },
        style: {
            fontSize: '12px',
            color: 'white',
        },
    })

    // Create a second timeline
    const bottomTimeline = TimelinePlugin.create({
        height: 10,
        timeInterval: 0.1,
        primaryLabelInterval: 1,
        style: {
            fontSize: '10px',
            color: 'white',
        },
    })


    if (!waveformContainer) {
        waveformContainer = document.createElement('div');
        waveformContainer.id = `waveformContainer${index}`;
        waveformContainer.className = "waveform-container";
        trackContainer.prepend(waveformContainer);
    }


    if (!overviewContainer) {
        overviewContainer = document.createElement('div');
        overviewContainer.id = `overviewWaveform${index}`;
        overviewContainer.className = "waveform-container-overview";
        waveformContainer.prepend(overviewContainer);
    }

    if (!detailedContainer) {
        detailedContainer = document.createElement('div');
        detailedContainer.id = `detailedWaveform${index}`;
        detailedContainer.className = "waveform-container-detailed";
        waveformContainer.prepend(detailedContainer);
    }
    track.detailedContainer = detailedContainer;


    if (!track.audioBuffer) {
        // no audio data availble we need to return placeholder div

        let detailedWaveformPlaceholder = document.createElement('div');
        detailedWaveformPlaceholder.className = "detailed-waveform-placeholder";
        detailedWaveformPlaceholder.innerText = "No audio data available";
        detailedContainer.prepend(detailedWaveformPlaceholder);


        let overviewWaveformPlaceholder = document.createElement('div');
        overviewWaveformPlaceholder.className = "overview-waveform-placeholder";
        overviewWaveformPlaceholder.innerText = "No audio data available";
        overviewContainer.prepend(overviewWaveformPlaceholder);


        return { detailedWaveform: null, overviewWaveform: null, overviewContainer, detailedContainer };
    }

    let peaksData =  null;

    if (!peaksData) {
        console.log('No peaks data available, generating from audioBuffer...slow in main process. Use worker...');
        let channelData = track.audioBuffer.getChannelData(0);
        console.log('track.arrayBuffer', track.arrayBuffer);
        peaksData = channelData;
    }

    let overviewRegions = RegionsPluginClass.create();
    // Initialize the overview waveform (zoomed-out)
    const overviewWaveform = WaveSurferClass.create({
        sampleRate: 44100,
        scale: 512, // I
        showWaveform: false,
        container: overviewContainer,
        waveColor: 'grey',
        autoCenter: true,
        autoCenterImmediately: true, // fake?
        progressColor: 'purple',
        cursorColor: 'red',  // Hide the cursor on the overview
        height: 55,
        barGap: 1,
        barWidth: 1,
        normalize: true,
        partialRender: true,
        responsive: false,
        cursorWidth: 1,
        peaks: peaksData, // Use the first channel data for overview
        duration: track.metadata.duration,
        minPxPerSec: 1,  // Lower resolution for full-track view
        scrollParent: false,
        plugins: [
            overviewRegions,
            HoverPlugin.create({
                lineColor: '#ff0000',
                lineWidth: 2,
                labelBackground: '#555',
                labelColor: '#fff',
                labelSize: '11px',
            }),
        ]
    });

    overviewWaveform.regions = overviewRegions;
    const detailedRegions = RegionsPluginClass.create();
    // Initialize the detailed waveform (zoomed-in)
    
    const detailedWaveform = WaveSurferClass.create({
        showWaveform: false,
        container: detailedContainer,
        waveColor: 'purple',
        autoCenter: true,
        autoCenterImmediately: true, // fake?
        progressColor: 'purple',
        cursorColor: 'red',
        media: track.audioElement,
        height: 140,
        // width: 560,
        interact: true,
        barWidth: 1,
        barGap: 1,
        pixelRatio: 1,
        partialRender: true,
        normalize: false,
        dragToSeek: false,
        peaks: peaksData,
        // peaks: channelData,
        duration: track.metadata.duration,
        cursorWidth: 1,
        responsive: false,
        hideScrollbar: true,
        minPxPerSec: 130,  // Higher resolution for detailed view
        scrollParent: false,
        isScrollable: false,
        plugins: [
            detailedRegions,
        ]
    });
    detailedWaveform.regions = detailedRegions;

    // console.log("tttt", transport.tracks)
    track.waveform = detailedWaveform;
    track.detailedWaveform = detailedWaveform;

    // Helper function to format time in mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Sync overview waveform position to the detailed waveform
    detailedWaveform.on('audioprocess', () => {
        const progress = detailedWaveform.getCurrentTime() / detailedWaveform.getDuration();
        const currentTime = detailedWaveform.getCurrentTime();

        // query document for all elements with 'time-display' class inside the context
        // of track.transport.trackContainer
        let timeDisplays = trackContainer.querySelectorAll('.time-display');
        // iterate over all time-display elements
        timeDisplays.forEach((timeDisplay) => {
            // update the text content of each time-display element
            timeDisplay.innerText = formatTime(currentTime);
        });

        // Only update overviewWaveform if not in a programmatic seek
        if (!isProgrammaticSeek) {
            isProgrammaticSeek = true;
            overviewWaveform.seekTo(progress);
            isProgrammaticSeek = false;
        }
    });

    detailedWaveform.on('seeking', (progress) => {
        //console.log("detailedWaveform seeking to", progress);
        const currentTime = detailedWaveform.getCurrentTime();
        const duration = detailedWaveform.getDuration();
        //console.log('Current Time', currentTime);
        if (track.transport.detailedTimeDisplay) {
            track.transport.detailedTimeDisplay.innerText = '-' + formatTime(currentTime);
            track.transport.previousCueTime = currentTime;
        }
    });

    // Event listener for drag start
    detailedWaveform.on("dragstart", (relativeX) => {
        console.log('dragstart', relativeX)
        detailedWaveform.pause(); // Pause playback while dragging
    });

    // Event listener for dragging
    detailedWaveform.on("drag", (relativeX) => {
        console.log('drag', relativeX)
        const duration = detailedWaveform.getDuration();
        const newTime = duration * relativeX; // Calculate time based on relativeX position
        detailedWaveform.seekTo(newTime); // Update playback position
    });

    // Event listener for drag end
    detailedWaveform.on("dragend", (relativeX) => {
        console.log('dragend', relativeX)
        const duration = detailedWaveform.getDuration();
        const newTime = duration * relativeX; // Final time based on end drag position
        detailedWaveform.seekTo(newTime); // Set final position
        detailedWaveform.play(); // Resume playback
    });

    overviewWaveform.on('click', (e, ev) => {

        // update the detailed waveform to the click position
        let overviewWaveformPosition = overviewWaveform.getCurrentTime();
        console.log('overviewWaveform mousedown', overviewWaveformPosition)
        detailedWaveform.setTime(overviewWaveformPosition);
        /*
        const currentTimeCode = track.waveform.getCurrentTime();
        const hostDateTime = Date.now();
        const hostTrackUrl = track.metadata.fileName;
        if (api.bridge && api.bridge.sendMessage) {
            api.bridge.sendMessage('timecode', {
                hostTrackTimeCode: currentTimeCode,
                hostTrackUrl: hostTrackUrl,
                hostDateTime,
                hostTrackId: 'host-' + track.id,
                resetSync: true,
            });
        }
        */
        return false;
    });

    overviewWaveform.on('seeking', (progress) => {
        console.log("overviewWaveform seeking to", progress);
        //console.log('ppprogress', progress)
        if (!isProgrammaticSeek) {
            isProgrammaticSeek = true;
            const pprogress = overviewWaveform.getCurrentTime() / overviewWaveform.getDuration();
            detailedWaveform.seekTo(pprogress);
            isProgrammaticSeek = false;
        }
    });

    detailedWaveform.on('click', (e, ev) => {
        console.log('detailedWaveform mousedown')
        // check to see if the waveform is playing
        if (detailedWaveform.isPlaying()) {
            // play pause
            //return;
        }
        track.playPause();
        return false;
    });

    detailedWaveform.on('mouseup', () => {
        console.log('detailedWaveform mouseup')
        //detailedWaveform.play(); // Resume playback
    });

    console.log('before set', track.overviewWaveform);

    track.overviewWaveform = overviewWaveform;
    track.detailedWaveform = detailedWaveform;
    track.overviewWaveform._ = track.overviewWaveform._ || {};

    console.log('after set', track.overviewWaveform);
    // Set volume and other transport properties
    // detailedWaveform.setVolume(transport.globalVolume);
    overviewWaveform.setVolume(0);  // Mute the overview waveform


    return { detailedWaveform, overviewWaveform, overviewContainer, detailedContainer };
}