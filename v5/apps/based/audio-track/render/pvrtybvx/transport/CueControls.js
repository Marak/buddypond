import CuePoints from '../waveform/CuePoints.js';



const automator = {
    updateAutomation: () => {}
};

const transport = {
    createTrackControls: () => {}
};

//import api from '../api.js';
//import transport from '../transport.js';

const cueControls = {};

// creates container div for all cue controls
cueControls.createCueControls = function (track) {
    let cueControlsContainer = document.createElement('div');
    cueControlsContainer.id = `#cueControls-${track.id}`;
    cueControlsContainer.classList.add('cue-controls');
    // create the buttons
    let cueButtons = cueControls.createCueButtons(track);
    cueControlsContainer.appendChild(cueButtons);
    return cueControlsContainer;
};

// creates a set of buttons for cue points 1-8
cueControls.createCueButtons = function (track) {
    let cueButtons = document.createElement('div');
    cueButtons.classList.add('cue-buttons');
    for (let i = 1; i <= 8; i++) {
        let cueButton = cueControls.createCueButton(track, i);
        cueButtons.appendChild(cueButton);
    }
    return cueButtons;
};

// creates a single cue button
cueControls.createCueButton = function (track, cueNumber) {
    let cueButton = document.createElement('button');
    cueButton.classList.add('cue-button');
    // TODO: add shift key functionality
    // cueButton.classList.add('has-shift-key');

    let isMappedToCuePoint = '';
    let wasAlreadyPlaying = false;

    let cueIndex = Number(cueNumber) - 1;

    // check if this cue point is already set
    if (track && track.metadata.cuePoints) {

        let cuePoints = track.metadata.cuePoints;
        // console.log('createCueButton track', cuePoints, cueNumber);
        if (cuePoints && cuePoints[Number(cueNumber)]) {
            isMappedToCuePoint = 'cue-mapped';
        }
    }
    //console.log('isMappedToCuePoint', isMappedToCuePoint)
    cueButton.innerHTML = `<span class="cue-number ${isMappedToCuePoint}">${cueNumber}</span>`;
    cueButton.dataset.cueNumber = cueNumber;

    track.transport.cueButtons = track.transport.cueButtons || {};
    track.transport.cueButtons[cueNumber] = cueButton;

    // on click, set cue point
    cueButton.addEventListener('mousedown', function () {
        //        console.log('cueButton mousedown', cueButton.dataset.cueNumber);

        /* TODO: leave this for now
        // check to see if this cue point is already set
        if (track.isCueSet && track.cueNumber === cueNumber) {
            // if already set, return to cue point
            api.transport.cueTo(trackId, cueNumber);
            return;
        } else {
            // set cue point
            api.transport.setCue(trackId, cueNumber);
            cueButton.classList.add('btn-active');
        }
            */

        if (track.isPlaying(track.id)) {
            wasAlreadyPlaying = true;
        }

        // check if there is a cuePoint associated with this button
        let cuePoints = track.metadata.cuePoints;
        console.log("using cuePoints", cuePoints)
        if (cuePoints && cuePoints[Number(cueNumber) - 1]) {
            console.log('cueButton mousedown', cueButton.dataset.cueNumber);
            track.cueTo((cueIndex + 1).toString());
    
        } else {
            console.log("No cue point set for this button");
            let currentTime = track.waveform.getCurrentTime();
            console.log('Setting cue point', cueNumber, currentTime);
            track.setCuePoint(cueNumber, currentTime);
            // CuePoints.renderCuePoints(track, track.waveform, track.metadata.cuePoints);
            CuePoints.renderCuePoint(cueNumber - 1, track.detailedWaveform, t, cue)

    //transport.renderCuePoint(cueNumber - 1, t.detailedWaveform, t, cue)
    //transport.renderCuePoint(cueNumber - 1, t.overviewWaveform, t, cue)




        }



        // Remark: This is actually a cue operation..
        // TODO: track.isCueing = true;
//        track.isCueing = true;
        // api.track.play(trackId);

        // toggle the btn-active class on all other buttons to off
        let buttons = document.querySelectorAll('.cue-button');
        buttons.forEach(button => {
            if (button !== cueButton) {
                button.classList.remove('btn-active');
            }
        });
    });

    cueButton.addEventListener('mouseup', function () {
        // api.transport.releaseCue(track.id);
        return;
        if (!wasAlreadyPlaying /*&& !track.isCueing */ ) { // TOOD: && !track.isCueing

            let track = transport.tracks[trackId];
            if (track.keepPlayingOnCueRelease) {

            } else {
                api.track.pause(trackId);
                api.track.cueTo(trackId, (cueIndex + 1).toString());
            }
        }
        wasAlreadyPlaying = false;
    });

    return cueButton;
};

export default cueControls.createCueControls;