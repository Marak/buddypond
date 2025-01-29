import TouchPad from '../../../../ui/TouchPad.js';
import BeatMasher from './BeatMasher.js';

function createFXComponents(track) {
    const { transport, audioElement, audioBuffer, fx } = track;
    const { eq3Container } = transport;

    const fxContainer = document.createElement('div');
    fxContainer.classList.add('fx-container');

    // BeatMasher setup
    const beatMasher = new BeatMasher(track);
    fx.beatmasher = beatMasher.beatmasher;
    fxContainer.appendChild(beatMasher.container);

    // FX Switch Button
    const fxSwitch = document.createElement('button');
    fxSwitch.textContent = 'FX';
    fxSwitch.classList.add('fxSwitch', 'btn-active');

    // FX Dropdown
    const fxDropdown = document.createElement('select');
    fxDropdown.classList.add('fxDropdown');
    fxDropdown.style.display = 'none';

    const fxOptions = [
        { value: 'none', label: 'None' },
        { value: 'beatmasher', label: 'Beatmash' },
        { value: 'echo', label: 'Icey Verb' },
        { value: 'flanger', label: '92:LFO' },
    ];

    fxOptions.forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        fxDropdown.appendChild(option);
    });

    fxDropdown.addEventListener('change', (ev) => {
        console.log('fxDropdown', ev.target.value);
        const currentTime = audioElement.currentTime;
        if (fx.beatmasher.isActive) {
            fx.beatmasher.stop();
        } else {
            fx.beatmasher.start(currentTime % audioBuffer.duration);
        }
    });

    fxContainer.append(fxDropdown);

    fxSwitch.addEventListener('click', () => {
        const { touchPad } = transport;
        if (touchPad.status === 'visible') {
            touchPad.hide();
            filterEqSwitch.style.display = 'block';
            fxDropdown.style.display = 'none';
        } else {
            touchPad.show();
            filterEqSwitch.style.display = 'none';
            eq3Container.style.display = 'none';
            fxDropdown.style.display = 'block';
        }
    });

    fxContainer.append(fxSwitch);

    return { fxContainer, fxSwitch, fxDropdown };
}


export default function createFX(track) {
    const { fxContainer, fxSwitch, fxDropdown } = createFXComponents(track);

    // TouchPad Setup
    const touchPad = new TouchPad(fxContainer, {
        width: 150,
        height: 180,
        fullRange: false,
        onChange(x, y) {
            if (track.transport.activeFx === 'beatmasher') {
                track.fx.beatmasher.setLoopLength(x, y);
            } else if (track.transport.activeFx === 'filter') {
                Filter(track, x, y);
            }
        },
    });

    track.transport.touchPad = touchPad;
    touchPad.hide();

    return fxContainer;
}
