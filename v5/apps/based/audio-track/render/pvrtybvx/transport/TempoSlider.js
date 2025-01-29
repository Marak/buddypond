import Slider from '../../../../ui/Slider.js';

export default function TempoSlider (track) {
    let trackId = track.id;
    // Create the tempoSlider
    let tempoSlider = Slider(track, trackId, {
        // value: 120,
        trackHeight: '150px',
        trackWidth: '60px',
        defaultValue: 0,
        sliderThumbStyles: { // not sure why override is needed for this one, was misaligned?
            left: '6px',     // could be due to custom width ( wider bar, thumb didn't adjust? )
        },
        value: 0,
        minValue: -1,
        maxValue: 1,
        step: 0.001, // rounding / precision issue here, we need finer tuned bpm control
        showCenterLine: true,
        showScale: true,
        showLabel: false,
        formatLabel: (value) => {
            // invert value
            value = 1 - value;
            return value;
        },
        className: 'tempo-slider',

        onDoubleClick: (value) => {
            // console.log('onDoubleClick', value);
            track.setBPM(track.metadata.bpm, true);
        },

        onChange: function (value) {

            // let track = transport.tracks[trackId];

            // if value is 0, return to original bpm
            if (value === 0) {
                track.setBPM(track.metadata.bpm, false);
                return;
            }

            // invert the value for tempo slider
            value = 1 - value;

            let bpmRangeStart = 60;
            let bpmRangeEnd = 180;
            let bpmRange = bpmRangeEnd - bpmRangeStart;

            // Calculate the BPM based on the slider value
            let bpm = bpmRangeStart + (bpmRange * value);


            // console.log("THIS", this, this.getValue())
            /*
            if (track.isSync) {
                console.log('Cannot change tempo while track is sync');
                ev.preventDefault();
                tempoSlider.value = track.currentBPM;
                return false;
            }
                */

            //console.log('tempoSlider', tempoSlider, Number(tempoSlider.value), tempoSlider.minValue);

            // TODO: The slider needs to work in reverse, moving up should decrease the BPM
            // Moving down should increase the BPM
            // const reversedValue = this.maxValue - (bpm - this.minValue);
            //const reverseBPM = this.maxValue - ()
            //console.log('setting reversedValue', reversedValue)
            // api.track.setBPM(trackId, Number(tempoSlider.value));
            // console.log("SETTING VALUES", reversedValue, bpm, this.minValue, this.maxValue);
            track.setBPM(bpm, false);

        }
    });
    track.transport.tempoSlider = tempoSlider;
    console.log("returning tempoSlider", tempoSlider);
    return tempoSlider.sliderContainer;

}

