
export default function setBPM (bpm) {
    bpm = Number(bpm);
    console.log('AAAA track.setBPM', this.id, bpm)
    let waveform = this.waveform;

    if (this) {

        // console.log('found track bpm', this, this.bpm, bpm);

        this.currentBPM = bpm;
        const originalBPM = this.bpm || 120; // Use the current BPM or a default value
        let playbackRate = bpm / originalBPM;
        //track.bpm = bpm;
        // console.log('Setting playback rate to:', playbackRate);
        // round to nearest 2 decimals
        playbackRate = Math.round(playbackRate * 100) / 100;
        waveform.setPlaybackRate(playbackRate);

        // track.setBPM(trackId, originalBPM);
        this.audioElement.playbackRate = playbackRate; // Set the playback rate of the audio element

        let currentBpmText = this.detailedContainer.querySelector('.current-bpm');
        let paddedString = bpm.toFixed(2);
        // currentBpmText.textContent = paddedString;

        // in addition, we need to set the .bpm-percentage element to the percentage difference between the current BPM and the original BPM
        // this is a simple calculation of (bpm / originalBPM) * 100
        let bpmPercentage = (bpm / originalBPM) * 100;
        let el = this.detailedContainer.querySelector('.bpm-percentage');
        // round bpmPercentage to 2 decimals

        // instead of percentage, value should be + or - the difference
        // if bpmPercentage is positive, add a + sign
        bpmPercentage = bpmPercentage - 100;

        if (bpmPercentage > 0) {
            bpmPercentage = '+' + bpmPercentage;
        } else {
            bpmPercentage = '' + bpmPercentage;
        }
        bpmPercentage = Math.round(bpmPercentage * 100) / 100;

        // el.textContent = bpmPercentage + '%';




    }
}
