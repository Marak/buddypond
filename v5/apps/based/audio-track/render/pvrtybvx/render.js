import SongInfo from "./transport/SongInfo.js";
import CueControls from "./transport/CueControls.js";
import PlayPauseCue from "./transport/PlayPauseCue.js";
import EQ3 from "./transport/EQ3.js";
import FX from "./fx/FX.js";
import Filter from "./transport/Filter.js";
import VolumeSlider from "./transport/VolumeSlider.js";
import LoopControls from "./transport/LoopControls.js";
import TempoSlider from "./transport/TempoSlider.js";
import TransportButtons from "./transport/TransportButtons.js";

export default function createTrackControls(track, trackContainer) {
    // let container = document.querySelector(`#waveform${trackId.slice(-1)}`);
    //let trackContainer = document.getElementById(trackId);
    let trackId = track.id;
    if (!trackContainer) {
        // throw new Error(`Track container not found for trackId: ${trackId}. Cannot createWaveform()`);
        // create a new div for the track
        trackContainer = document.createElement('div');
        trackContainer.id = `#track${track.id}`;
        trackContainer.classList.add('track-container');

        console.log("setupTrackControls making new div...", document.body, trackContainer)
    }

    track.transport = track.transport || {};

    // Track controls that appear left and right of the waveforms
    let rightTrackControls = document.getElementById(`#rightTrackControls-${trackId}`);
    let topTrackControls = document.getElementById(`#topTrackControls-${trackId}`);

    if (!topTrackControls) {
        topTrackControls = document.createElement('div');
        topTrackControls.id = `topTrackControls-${trackId}`;
        topTrackControls.className = "track-controls";
        topTrackControls.classList.add('top-controls');
        trackContainer.appendChild(topTrackControls);
        track.transport.topTrackControls = topTrackControls;
    }
 
    if (!rightTrackControls) {
        rightTrackControls = document.createElement('div');
        rightTrackControls.id = `rightTrackControls-${trackId}`;
        rightTrackControls.className = "track-controls";
        rightTrackControls.classList.add('right-controls');
        trackContainer.appendChild(rightTrackControls);
        track.transport.rightTrackControls = rightTrackControls;
    }

    if (trackContainer == null) {
        trackContainer = document.createElement('div');
        trackContainer.id = `#waveform${trackId}`;
        console.log("setupTrackControls making new div...", document.body, trackContainer)
        document.body.appendChild(trackContainer);
    }

    track.transport = track.transport || {};
    SongInfo(track, track.transport.topTrackControls)

    let leftControls = document.createElement('div');
    leftControls.className = 'left-controls';
    rightTrackControls.appendChild(leftControls);

    let eq3 = EQ3(track);
    leftControls.appendChild(eq3);

    let filter = Filter(track);
    leftControls.appendChild(filter);

    //let fx = FX(track);
    //leftControls.appendChild(fx);

    let rightControls = document.createElement('div');
    rightControls.className = 'right-controls';
    rightTrackControls.appendChild(rightControls);

    let tempoSlider = TempoSlider(track);
    leftControls.appendChild(tempoSlider);

    let deckLabel = document.createElement('div');
    deckLabel.classList.add('deck-label');

    deckLabel.textContent = track.currentDeck || 'A';
    rightControls.appendChild(deckLabel);

    let loopControls = LoopControls(track, 'loopControlsA');
    rightControls.appendChild(loopControls);

    let playPauseCueButtons = PlayPauseCue(track);
    rightControls.appendChild(playPauseCueButtons);

    let volumeSlider = VolumeSlider(track);
    rightTrackControls.appendChild(volumeSlider);

    let transportButtons = TransportButtons(track);
    trackContainer.appendChild(transportButtons);

    let bottomRow = document.createElement('div');
    bottomRow.className = 'bottom-row';
    trackContainer.appendChild(bottomRow);

    let cueControlsContainer = CueControls(track);
    bottomRow.appendChild(cueControlsContainer);
    return trackContainer;

}