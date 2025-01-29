
const beatGrid = {};

export default beatGrid;

beatGrid.calculateGrid = function (track) {
    
    let trackDuration = track.audioBuffer.duration;
    let bpm = track.metadata.bpm;
    console.log('Using trackDuration', trackDuration, bpm);
    console.log("beatGrid.calculateGrid    trackDuration", track, trackDuration, bpm);
    // throw new Error('Not implemented');
    const secondsPerBeat = 60 / bpm;
    const gridSnaps = [];

    // Generate the beat grid based on the BPM and track duration
    for (let i = 0; i <= trackDuration; i += secondsPerBeat) {
        gridSnaps.push(i);
    }

    // Map the first cue point with an offset adjustment
    // track.metadata.cuePoints = []; // Initialize cuePoints object if not defined
    // track.metadata.cuePoints['1'] = (gridSnaps[0] + track.metadata.firstBeatOffset) / trackDuration;

    /*
    track.metadata.cuePoints.push({
        time: (gridSnaps[0] + track.metadata.firstBeatOffset) / trackDuration,
        type: "start"
    });
    */


    // Calculate 3 additional cue points at 25%, 50%, and 75% of the track duration
    const cuePositions = [0.25, 0.5, 0.75];
    cuePositions.forEach((position, index) => {
        // Find the closest beat in the grid to the desired position
        let cueTime = trackDuration * position;
        let closestBeat = gridSnaps.reduce((prev, curr) =>
            Math.abs(curr - cueTime) < Math.abs(prev - cueTime) ? curr : prev
        );
        // console.log('closestBeatclosestBeat', closestBeat)
        // Assign the cue point, e.g., cuePoints['2'], cuePoints['3'], cuePoints['4']
            /*
        track.metadata.cuePoints.push({
            time: closestBeat / trackDuration,
            type: "cue"
        });
        */
    });

    return gridSnaps;
};

beatGrid.visualizeGrid = async function visualizeGrid(wavesurfer, gridSnaps, firstBeatOffset, showLabels = false) {

    const trackDuration = wavesurfer.getDuration();
    // console.log('visualizeGrid', trackDuration, gridSnaps, firstBeatOffset);
    // Offset each snapTime by the firstBeatOffset
    gridSnaps.forEach((snapTime, i) => {
        const adjustedSnapTime = snapTime;
        if (adjustedSnapTime <= trackDuration) {
            let regionLabel = '';
            
            if (showLabels) {
                regionLabel = document.createElement('span');
                regionLabel.classList.add('region-label');
                regionLabel.style.color = 'white';
                regionLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                regionLabel.style.border = '1px solid white';
                regionLabel.style.borderRadius = '5px';
                regionLabel.style.padding = '5px';
                regionLabel.lineHeight = '1em';
                regionLabel.textContent = i + 1;
    
            }
            // new rgb color from '#aeafaf', with opacity 0.5
            let color = 'rgba(174, 175, 175, 0.5)';
            // console.log("wavesurfer.regions.addRegion", adjustedSnapTime, regionLabel, color);
            wavesurfer.regions.addRegion({
                start: adjustedSnapTime,
                content: regionLabel,
                // end: adjustedSnapTime + 0.001,  // Short duration to mark the snap point
                color: color,
                drag: false,
                resize: false,
            });
            
        }
    });
}
