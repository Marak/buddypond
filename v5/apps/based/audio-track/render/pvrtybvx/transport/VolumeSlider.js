import sliderComponent from '../../../../ui/Slider.js';

export default function createVolumeSlider (track) {

    let trackId = track.id;

    let container = document.createElement('div');
    container.classList.add('volume-slider-container');

    let volumeSliderIcon = document.createElement('i');
    volumeSliderIcon.classList.add('fa-solid', 'fa-headphones-simple');
    volumeSliderIcon.classList.add('volumeSliderIcon', 'headphones');
    //volumeSliderIcon.classList.add('fancy-button');
    volumeSliderIcon.style.fontSize = '24px';
    volumeSliderIcon.style.marginRight = '10px';
    
    volumeSliderIcon.title = "Mute / Unmute track";
    // click handler
    volumeSliderIcon.addEventListener('click', () => {
        // console.log('Mute / Unmute track');
        console.log('track', track);
        track.toggleMute();
    
        // toggle the icon btn-active / btn-inactive
        if (volumeSliderIcon.classList.contains('headphones-inactive')) {
            //volumeSliderIcon.classList.add('btn-active');
            volumeSliderIcon.classList.remove('headphones-inactive');
        } else {
            //volumeSliderIcon.classList.remove('btn-inactive');
            volumeSliderIcon.classList.add('headphones-inactive');
        }
    
    });
    
    track.transport.volumeSliderIcon = volumeSliderIcon;
    
    container.append(volumeSliderIcon);
    
    let volumeSlider = sliderComponent(track, trackId, {
        minValue: 0,
        maxValue: 1, // TODO: could be higher...needs better gain logic linear gain is not ideal after 1
        value: 1,
        trackWidth: '20px',
        trackHeight: '260px',
        thumbHeight: '48px',
        thumbWidth: '26px',
        sliderThumbStyles: {
            left: '0px',
        },
    
        showLabel: false,
        className: 'volume-slider',
        onClick: function (value) {
            // api.stopAutoDJ();
        },
        onChange: function (value) {
            // console.log("CHANGED VAL", value, this)
            track.setVolume(value);
        }
    });
    track.transport.volumeSlider = volumeSlider;
    
    container.append(volumeSlider.sliderContainer);
    //return volumeSlider.sliderContainer

    return container;
}