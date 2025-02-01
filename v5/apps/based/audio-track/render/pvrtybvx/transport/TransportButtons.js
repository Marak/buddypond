export default function createTransportButtons(track) {

    let trackId = track.id;

    let transportUtilButtonsContainer = document.createElement('div');
    transportUtilButtonsContainer.classList.add('transport-util-buttons-container');


    let cloneBtn = createCloneTrackButton(trackId);
    cloneBtn.classList.add('fancy-button');
    transportUtilButtonsContainer.appendChild(cloneBtn);

    let partyContainer = document.getElementById('party-container');

    let nextTrackBtn = createNextTrackButton(trackId);
    nextTrackBtn.classList.add('fancy-button');
    transportUtilButtonsContainer.appendChild(nextTrackBtn);

    let openSuggestionsBtn = createOpenSuggestionsButton(trackId);
    openSuggestionsBtn.classList.add('fancy-button');
    //transportUtilButtonsContainer.appendChild(openSuggestionsBtn);

    let closeBtn = createCloseButton(track);
    closeBtn.classList.add('fancy-button');
    transportUtilButtonsContainer.appendChild(closeBtn);
    return transportUtilButtonsContainer;
}

function createCloseButton(track) {
    let trackId = track.id;
    // Close/Stop Track Button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>'; // Close (X) icon
    closeBtn.title = 'Unload and close track';
    closeBtn.classList.add('closeButton');
    closeBtn.classList.add('btn-active');
    closeBtn.addEventListener('click', async () => {
        // closeTrack(trackId);
        await track.unload();
    });

    return closeBtn;
}

function createCloneTrackButton(trackId) {
    // Clone Track Button
    const cloneBtn = document.createElement('button');
    cloneBtn.innerHTML = '<i class="fa-solid fa-copy"></i>'; // Copy (clone) icon
    cloneBtn.title = 'Clone track into a new deck';
    cloneBtn.classList.add('cloneButton');
    cloneBtn.classList.add('btn-active');
    cloneBtn.addEventListener('click', async () => {
        // cloneTrack(trackId);
        // load the selected track into a new deck
        // await transport.loadInitialDecks([file]);
        // TODO: better api.track.load()
        //let track = transport.tracks[trackId];
        //await api.track.load(track.metadata);
        bp.open('audio-player');
    });

    return cloneBtn;
}



function createOpenSuggestionsButton(trackId) {
    // Open Suggestions Button
    const openSuggestionsBtn = document.createElement('button');
    openSuggestionsBtn.innerHTML = '<i class="fas fa-music"></i>'; // Music note icon
    openSuggestionsBtn.title = 'Open track suggestions';
    openSuggestionsBtn.classList.add('openSuggestionsButton');
    openSuggestionsBtn.classList.add('btn-active');
    openSuggestionsBtn.addEventListener('click', () => {
        // openSuggestions(trackId);
        // console.log('openSuggestions', trackId)
        api.ui.toggleLibrary();

        // give it a moment to load
        setTimeout(() => {
            let el = document.getElementById('library-next-tracks-button');
            if (el) {
                el.click();
            }

        }, 222);
    });

    return openSuggestionsBtn;
}




function createNextTrackButton(trackId) {
    // TODO: move api.track.suggest() logic to separate file
    // or api.brain.suggestNextTrack(), etc
    // Next Track Button
    const nextTrackBtn = document.createElement('button');
    //nextTrackBtn.textContent = 'Next Track';
    nextTrackBtn.innerHTML = '<i class="fa-solid fa-record-vinyl"></i>'; // Vinyl record icon
    nextTrackBtn.classList.add('nextTrackButton');
    nextTrackBtn.classList.add('btn-active');
    nextTrackBtn.title = 'Load next suggested track';
    nextTrackBtn.addEventListener('click', () => {
        // nextTrack(trackId);
        let prevTrack = transport.tracks[trackId];
        // unload the current track
        // api.track.unload(trackId);

        // suggest a new track based on previous and load it
        //let nextTracks = transport.suggestNextTrack(prevTrack);
        // TODO: implement brain API for track suggestions
        //console.log('nextTracks', nextTracks)
        // load the next track

        // get random track from nextTrack array
        //let randomIndex = Math.floor(Math.random() * nextTracks.length);
        //api.track.load(nextTracks[randomIndex]);

        // for now load a hard-coded track
        
        // console.log('nextTrack', trackId)
    });

    return nextTrackBtn;

}
