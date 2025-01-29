
// stubs
const api = {

   
    addonManager: {
        initAddon: () => {}
    }
};

const automator = {
    updateAutomation: () => {}
};


export default function createTopTrackControls(track, container) {
    console.log('Creating top track controls for:', track);
    let trackId = track.id;

    let titleElement = createTitleDisplay(track, trackId);
    track.transport.titleElement = titleElement;
    container.appendChild(titleElement);
    // setupScrollingTitle(container, titleElement);

    let tagsElement = createTagsDisplay(track, trackId);
    track.transport.tagsElement = tagsElement;
    container.appendChild(tagsElement);

    // Create a common container for the time and BPM data
    let dataContainer = document.createElement('div');
    dataContainer.className = 'data-container';
    // dataContainer.style.width = '200px';
    // Create time display element
    let detailedTimeDisplay = document.createElement('div');
    detailedTimeDisplay.className = 'time-display';
    detailedTimeDisplay.innerText = '00:00'; // Initial display
    dataContainer.appendChild(detailedTimeDisplay);

    // Create current track BPM display
    let currentTrackBpm = document.createElement('div');
    currentTrackBpm.className = 'current-bpm';
    currentTrackBpm.innerText = track.metadata.bpm ? Number(track.metadata.bpm).toFixed(2) : 'N/A';
    dataContainer.appendChild(currentTrackBpm);

    // Create key text element
    let keyText = document.createElement('div');
    keyText.className = 'key-text';
    keyText.innerText = track.metadata.initialKey || 'N/A';
    dataContainer.appendChild(keyText);

    // Append the entire container to the main container
    container.appendChild(dataContainer);

    // Create time duration element
    let detailedTimeDuration = document.createElement('div');
    detailedTimeDuration.className = 'time-duration';
    detailedTimeDuration.innerText = ''; // Initial display
    dataContainer.appendChild(detailedTimeDuration);

    // Create track BPM element
    let trackBpm = document.createElement('div');
    trackBpm.className = 'bpm-text';
    trackBpm.innerText = track.metadata.bpm ? Number(track.metadata.bpm).toFixed(2) : 'N/A';
    trackBpm.addEventListener('click', async () => {
        console.log('Setting BPM to', track.metadata.bpm);
        await track.setBPM(track.metadata.bpm);
    });
    dataContainer.appendChild(trackBpm);

    // Create BPM percentage display
    let trackBpmPercentage = document.createElement('div');
    trackBpmPercentage.className = 'bpm-percentage';
    trackBpmPercentage.innerText = '0%'; // Initial display
    trackBpmPercentage.style.fontSize = '14px !important';
    dataContainer.appendChild(trackBpmPercentage);

    // Save elements to transport for external control
    track.transport.detailedTimeDisplay = detailedTimeDisplay;
    track.transport.detailedTimeDuration = detailedTimeDuration;
    track.transport.trackBpmPercentage = trackBpmPercentage;
    track.transport.currentTrackBpm = currentTrackBpm;

    // create keyLock button
    // use font-awesome icons for music note
    let keyLockButton = document.createElement('button');
    keyLockButton.classList.add('key-lock-btn', 'key-lock-btn-active');
    keyLockButton.title = 'Pitch Bend Key Lock';
    //keyLockButton.className = 'key-lock-btn';
    keyLockButton.innerHTML = '<i class="fas fa-music"></i>';
    //keyLockButton.innerHTML = '<i class="fas fa-music"></i>';
    keyLockButton.addEventListener('click', async () => {
        console.log('Key Lock button clicked');

        // if selected, remove the style
        if (keyLockButton.classList.contains('key-lock-btn-active')) {
            keyLockButton.classList.remove('key-lock-btn-active');
            keyLockButton.classList.add('key-lock-btn-inactive');

        } else {
            keyLockButton.classList.add('key-lock-btn-active');
            keyLockButton.classList.remove('key-lock-btn-inactive');
        }

        await track.toggleKeyLock();
    });
    container.appendChild(keyLockButton);

}

let CONTAINER_WIDTH = 385; // Adjust container width
let SCROLL_RATE = -0.1; // Adjust scroll speed
let WAIT_TO_SCROLL_TIME = 2000; // Wait time before starting scroll

function setupScrollingTitle(container, textElement) {
    console.log("Setting up scrolling title for:", container);

    // Clone the text element for seamless effect
    const clone = textElement.cloneNode(true);
    clone.style.paddingLeft = "20px"; // Add spacing between repeated text
    // container.appendChild(clone);

    // Get the dynamic scroll width
    const textWidth = textElement.offsetWidth;
    const containerWidth = container.offsetWidth;
    let scrollWidth = textWidth + parseInt(clone.style.paddingLeft, 10);
    scrollWidth = scrollWidth * 0.3;

    let scrollPosition = 0;

    // Scroll function
    function scrollText() {
        scrollPosition += SCROLL_RATE;

        textElement.style.transform = `translateX(${scrollPosition}px)`;
        clone.style.transform = `translateX(${scrollPosition}px)`;

        // Reset or bounce the scroll position
        // TODO: Use CONTAINER_WIDTH?
        console.log('scrollPosition', scrollPosition, 'scrollWidth', scrollWidth);
        if (Math.abs(scrollPosition) >= scrollWidth) {
            // scrollPosition = 0; // Reset for seamless loop
            SCROLL_RATE = SCROLL_RATE * -1; // Reverse scroll direction
        }

        requestAnimationFrame(scrollText);
    }

    // Delay scrolling to allow initial view
    setTimeout(scrollText, WAIT_TO_SCROLL_TIME);
}


function createTitleDisplay(track, trackId) {

    const titleContainer = document.createElement('div');
    titleContainer.className = 'titleContainer';

    // Song Title Display
    const titleElement = document.createElement('span');

    let titleText = track.getTitle(track);

    /*
    let titleText = trackData && trackData.metadata ? trackData.metadata.title : 'Unknown Title';

    // clean up track title ( todo: rename files for real )
    titleText = titleText.replace('_(mp3.pm)', '');
    // replaces all instances of _ with space
    titleText = titleText.split('_').join(' ');
    */

    titleElement.textContent = `${titleText}`;
    titleElement.className = 'titleElement';
    titleElement.style.overflow = 'hidden';
    titleElement.style.textOverflow = 'ellipsis';

    titleContainer.appendChild(titleElement);
    return titleContainer;

}


function createTagsDisplay(track, trackId) {
    // Create a container for the tags
    const tagsElement = document.createElement('div');
    tagsElement.className = 'tags-container';

    // TODO: replace with real tags
    // TODO: when click tag, open library with suggest tracks on that tag search
    // Create a tag for the track's key
    const keyTag = document.createElement('div');
    keyTag.className = 'tag key-tag';
    keyTag.innerText = track.metadata.key ? track.metadata.key.note : 'N/A';
    tagsElement.appendChild(keyTag);

    // Create a tag for the track's BPM
    const bpmTag = document.createElement('div');
    bpmTag.className = 'tag bpm-tag';
    bpmTag.innerText = track.metadata.bpm ? Number(track.metadata.bpm).toFixed(2) : 'N/A';
    tagsElement.appendChild(bpmTag);

    // Create a tag for the track's genre
    const genreTag = document.createElement('div');
    genreTag.className = 'tag genre-tag';
    genreTag.innerText = track.metadata.genre || 'N/A';
    tagsElement.appendChild(genreTag);

    // Create a tag for the track's artist
    const artistTag = document.createElement('div');
    artistTag.className = 'tag artist-tag';
    artistTag.innerText = track.metadata.artist || 'N/A';
    tagsElement.appendChild(artistTag);

    // tag for adding new tags
    const addTag = document.createElement('div');
    addTag.className = 'tag add-tag';
    addTag.innerText = '+';
    addTag.addEventListener('click', () => {
        console.log('Add tag clicked');
        // api.toggleAddTagDialog(track, function () {
    });
    tagsElement.appendChild(addTag);

    return tagsElement;
}
