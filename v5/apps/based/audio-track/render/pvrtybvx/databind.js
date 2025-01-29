//import transport from '../../../transport.js';
//import timecode from '../../../timecode.js';
//import api from '../../../api.js';
//import beatGrid from '../../../plugins/beatGrid.js';
import WaveForms from "./waveform/WaveForms.js";
import hasTrackMetadata from '../../../audio-stripe/lib/hasTrackMetadata.js';
import stripeTrack from '../../../audio-stripe/lib/stripeTrack.js';
import beatGrid from '../../../audio-stripe/lib/beatGrid.js';
import CuePoints from './waveform/CuePoints.js';
// response for taking in fresh track data and rendering it
// reloading it into the same track

// stubs
const api = {
    track: {
        getTitle: (track) => {
            return track.metadata.title;
        },
        playPause: (trackId, button) => {
            console.log('playpPause', trackId, button);
        },
        play: (trackId) => {
            console.log('play', trackId);
        },
        pause: (trackId) => {
            console.log('pause', trackId);
        },
        unload: (trackId) => {
            console.log('unload', trackId);
        },
        isPlaying: () => {
            return false;
        }
    },
    helpers: {
        formatTime: (time) => {
            return time;
        }
    },
    addonManager: {
        initAddon: () => {}
    }
};

const automator = {
    updateAutomation: () => {}
};




export default async function defaultDatabind(track) {
    let t = track;
    let container = track.element;
    console.log("Loading the track", t, container)

    let hasMetadata = hasTrackMetadata(track.metadata)
    if (!hasMetadata.hasMetadata && track.audioBuffer) { // don't attempt to stripe unless there is data
        console.error("Track is missing metadata", hasMetadata.missing);
        //return;

        await stripeTrack(track);
    }
    console.log("HAS METADATA", hasMetadata)
    // re-render is simple data binding to class names of elements
    // be sure to use common classnames and structures between renderers to keep code clean
    // t.load() *will* need to be called again ( now that is has fileName it should work )
    // will most likely need separate code paths below to deal with both cases
    // case 1. loading track data into an existing track
    // case 2. loading track data into a new track

    // Assume all elements already exist and just update their content

    //
    // Mobile view: TODO: move this to separate layout ( switch layout on media query)
    //
    /*
    const songTitle = container.querySelector('.mobile-song-name');
    songTitle.textContent = api.track.getTitle(t) || 'Unknown Track';

    const songBPM = container.querySelector('.mobile-song-bpm');
    songBPM.textContent = `BPM: ${t.metadata.bpm || 'n/a'}`;

    const songKey = container.querySelector('.mobile-song-key');
    songKey.textContent = `Key: ${t.metadata.initialKey || 'n/a'}`;

    const songEnergy = container.querySelector('.mobile-song-energy');
    songEnergy.textContent = `Energy: ${t.metadata.rating || 'n/a'}`;

    const songCurrentTime = container.querySelector('.mobile-song-current-time');
    // Update with current time if necessary or leave static if this is handled elsewhere

    const songDuration = container.querySelector('.mobile-song-duration');
    songDuration.textContent = api.helpers.formatTime(t.metadata.duration);
    */
    // Track


    // Update the title display
    let titleElement = container.querySelector('.titleElement');
    let titleText = track.getTitle(t);

    titleElement.textContent = titleText || 'Unknown Track';
    // Update tags display
    let tagsElement = container.querySelector('.tags-display');
    //tagsElement.textContent = t.metadata.tags.join(', ') || 'No Tags';

    // Update time display
    let detailedTimeDisplay = container.querySelector('.time-display');
    detailedTimeDisplay.innerText = '00:00'; // Update this dynamically as needed

    // Update current track BPM display
    let currentTrackBpm = container.querySelector('.current-bpm');
    currentTrackBpm.innerText = t.metadata.bpm ? Number(t.metadata.bpm).toFixed(2) : 'N/A';

    // Update key text
    let keyText = container.querySelector('.key-text');
    keyText.innerText = t.metadata.initialKey || 'N/A';

    // Update time duration
    let detailedTimeDuration = container.querySelector('.time-duration');
    detailedTimeDuration.innerText = formatTime(t.metadata.duration);

    // Update track BPM
    let trackBpm = container.querySelector('.bpm-text');
    trackBpm.innerText = t.metadata.bpm ? Number(t.metadata.bpm).toFixed(2) : 'N/A';

    // Update BPM percentage display
    let trackBpmPercentage = container.querySelector('.bpm-percentage');
    trackBpmPercentage.innerText = '0%'; // Update this dynamically as needed

    // render the waveforms

    // remove existing waveform placeholders ( if exists )
    let oldWaveforms = container.querySelectorAll('.waveform-container');

    if (oldWaveforms.length) {
        oldWaveforms.forEach(waveform => waveform.remove());
    }


    console.log("Creating waveform for track", t, container)
    let resp = await WaveForms(t, t.id, 1, container);
    let { detailedWaveform, overviewWaveform, overviewContainer, detailedContainer } = resp;
    console.log('Waveform created:', detailedWaveform, overviewWaveform, overviewContainer, detailedContainer);
    if (t.noWavesurfer) {
        detailedContainer.style.display = 'none';
        overviewContainer.style.display = 'none';
    }

    if (t.audioBuffer && t.metadata.beatGrid) {

        setTimeout(() => {
            console.log('beatGrid.visualizeGrid', t.metadata.beatGrid, t.metadata.firstBeatOffset);
            beatGrid.visualizeGrid(detailedWaveform, t.metadata.beatGrid, t.metadata.firstBeatOffset);
            CuePoints.renderCuePoints(detailedWaveform, t, '#8a2be2', t.metadata.beatLength / 8, {
                color: '#aeafaf',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid white',
                borderRadius: '5px',
                paddingLeft: '5px',
                paddingRight: '5px',
                marginLeft: '5px',
                lineHeight: '1em',
            });
            CuePoints.renderCuePoints(overviewWaveform, t, '#8a2be2', t.metadata.beatLength * 2, {
                color: '#aeafaf',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '0.2em thin white',
                borderRadius: '5px',
                marginLeft: '5px',
                marginRight: '5px',
            });
    
            // timecode.snapToBeat(t);

        }, 10);

    }


};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}