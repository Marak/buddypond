export default function PlayPauseCue(track, className = 'playPauseCueButtonsA') {
    let trackId = track.id;
    // Container for buttons
    const container = document.createElement('div');
    container.classList.add(className);

    // Cue Button
    const cueButton = document.createElement('button');
    cueButton.classList.add('cueButton');
    cueButton.classList.add('btn-active');
    cueButton.title = 'Cue';
    cueButton.innerHTML = 'CUE';

    let isDragging = false;


    // let previousCueTime = 0;
    // Cue Button Events
    cueButton.addEventListener('mousedown', (ev) => {
    // get current time
        //let { t } = api.resolveTrack(trackId)
        //api.transport.cue(trackId, ev.target)
        cueButton.style.backgroundColor = '#666'; // Highlight on press
        isDragging = false; // Reset dragging state
    });

    cueButton.addEventListener('mouseup', (ev) => {
        if (!isDragging) {
            //let { t } = api.resolveTrack(trackId)
            //api.track.pause(trackId, playPauseButton); // Stop track if not dragging
            //api.track.setTime(t.id, t.transport.previousCueTime);
        }
        cueButton.style.backgroundColor = '#444'; // Reset background
        cueButton.classList.remove('btn-selected');
        //cueButton.classList.add('btn-inactive');
    });

    cueButton.addEventListener('mouseleave', (ev) => {
        /* cueButton.style.backgroundColor = '#444'; // Reset background */
    });

    cueButton.addEventListener('mousemove', (ev) => {
        if (ev.buttons === 1) {
            isDragging = true; // Mark as dragging if mouse is moved with the button held
        }

    });

    // Play/Pause Button
    const playPauseButton = document.createElement('button');
    playPauseButton.classList.add('playButton');
    playPauseButton.classList.add('btn-active');
    playPauseButton.title = 'Play/Pause';
    playPauseButton.innerHTML = '<i class="fa-duotone fa-solid fa-play"></i> <i class="fa-duotone fa-solid fa-solid fa-pause"></i>';

    // Play/Pause Button Event
    playPauseButton.addEventListener('click', (ev) => {
        // previousCueTime = null;
        // api.stopAutoDJ();
        // api.track.playPause(trackId, playPauseButton);
        console.log('Play/Pause button clicked', track);
        track.playPause();
    });


    // Add drag-and-hold behavior
    cueButton.addEventListener('mousemove', (ev) => {
        const rect = playPauseButton.getBoundingClientRect();
        if (
            ev.clientX >= rect.left &&
            ev.clientX <= rect.right &&
            ev.clientY >= rect.top &&
            ev.clientY <= rect.bottom
        ) {
            // api.track.play(trackId, playPauseButton); // Start playing the track
            isDragging = true; // Set dragging state
        }
    });

    track.transport.playPauseButton = playPauseButton;
    

    // Add buttons to container
    container.appendChild(cueButton);
    container.appendChild(playPauseButton);

    return container;
}
