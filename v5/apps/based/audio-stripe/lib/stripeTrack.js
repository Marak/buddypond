import detectBPMClass from './detectBPM.js';
import detectKey from './detectKey.js';
import detectFirstBeatOffset from './detectFirstBeatOffset.js';
import beatGrid from './beatGrid.js';
import detectCuePoints from './detectCuePoints.js';
import detectID3 from './detectID3.js';

export default async function stripeTrack(t) {

    console.log("stripe.stripeTrack - striping track", t);
    let loadingText;

    if (t.trackElement) {
        loadingText = t.trackElement.querySelector('.loading-text');
    }

    if (typeof t.metadata.title === 'undefined') {
        // track has not been striped at all, id3 tags not processed
        console.log("CALCULATING ID3 TAGS FOR ", t.metadata.fileName)
        if (loadingText) {
            loadingText.innerText = "Detecting ID3 Tags.\n";
        }

        console.log('ttttt prob not defined here', t.blob)

        try {
            const id3Info = await detectID3(t.blob);

            console.log('id3Info', id3Info);
    
            let id3Props = ['title', 'artist', 'album', 'year', 'genre', 'initialKey', 'bpm', 'duration'];
            id3Props.forEach(prop => {
                if (typeof id3Info[prop] !== 'undefined') {
                    t.metadata[prop] = id3Info[prop];
                }
            });
            console.log('ID3 set props', t.metadata);
    
        } catch (err) {
            console.error('Error reading ID3 tags:', err);
            // there is no id3 data, set title to filename
            t.metadata.title = t.metadata.fileName;

        }
    }

    // check bpm first ( todo: firstBeatOffset here as well )
    if (typeof t.metadata.bpm !== 'number') {
        console.log("CALCULATING BPM FOR ", t.metadata.fileName)
        // TODO: await stripe.detectBPM(t);
        let detectBPM = new detectBPMClass(t);
        await detectBPM.init(t.id, t.audioElement, t.audioContext);
        let bpm;
        try {
            bpm = await detectBPM.detectBPM();
            // round bpm to 2 decimal places, if 0.99, round up
            bpm = Math.round(bpm * 100) / 100;
            if (bpm % 1 !== 0) {
                bpm = Math.ceil(bpm);
            }
            t.metadata.bpm = bpm;

            console.log(`Detected BPM for track ${t.metadata.fileName}: ${bpm}`);
        } catch (err) {
            console.error('Error detecting BPM', err);
        }

        //track.duration = detectBPM.duration;
        //track.bpm = bpm;


    } else {
        console.log("BPM ALREADY FOUND FOR ", t.metadata.fileName, t.metadata.bpm)
    }


    // check to see if there is an initialKey
    let forceInitialKeyRestripe = true;
    if (forceInitialKeyRestripe || typeof t.metadata.initialKey === 'undefined') {
        console.log("CALCULATING KEY FOR ", t.metadata.fileName)
        let estimatedKey = await detectKey(t.audioBuffer);
        // t.metadata.initialKey = estimatedKey;
        console.log('estimatedKey', estimatedKey);

        const traktorKey = mapKeyToTraktor(estimatedKey);
        console.log(`Detected Key: ${estimatedKey}, Traktor Key: ${traktorKey}`);
        console.log('current initialKey', t.metadata.initialKey);

        let adjustedKey = adjustToTraktorKey(traktorKey);
        console.log('adjustedKey', adjustedKey);

        // TODO: save the adjustedKey to the track metadata
        t.metadata.initialKey = adjustedKey;

    }

    console.log("ATTEMPTING TO CALCULATE FIRST BEAT OFFSET AND DURATION FOR ", t.metadata.fileName, t.metadata);
    // Check to see if we already have a firstBeatOffset and duration calculated
    if (typeof t.metadata.firstBeatOffset !== 'number' || typeof t.metadata.duration !== 'number') {

        if (loadingText) {
            loadingText.innerText = "Detecting First Beat Offset and Duration for first time.\n This may take a moment";
        }

        console.log("CALCULATING firstBeatOffset and duration ", t.metadata.fileName, 'existing', t.metadata);
        console.log('ty', typeof t.metadata.firstBeatOffset, typeof t.metadata.duration)
        const { firstBeatOffset, duration } = await detectFirstBeatOffset(t);
        t.metadata.duration = t.audioBuffer.duration;
        t.metadata.firstBeatOffset = firstBeatOffset;
    } else {
        console.log("firstBeatOffset and duration ALREADY FOUND FOR ", t.metadata.fileName, t.metadata)
    }

        // Check to see if we already have a beatgrid calculated
        let firstBeatOffset = t.metadata.firstBeatOffset;

    let newBeatGridAlgo = false;

    // This will use new beatgrid algo via aubio.js
    // Might not be as good? Needs work with phaseLock now that grids aren't aligned?
    if (newBeatGridAlgo) {
        let gridSnaps = t.metadata.beatGrid;

        if (!gridSnaps || gridSnaps.length === 0) {
            console.log("CALCULATING BEATGRID FOR ", t.metadata.fileName, t.audioBuffer)

            console.log('loadingText', loadingText)
            // update the textContent to "Detecting Beat Grid"
            if (loadingText) {
                loadingText.innerText = "Detecting Beat Grid for first time.\n This may take a moment";
            }

            let result = await detectBeats(t.audioBuffer);
            gridSnaps = result.beatTimes;
            console.log('calculated gridSnaps', gridSnaps);
            t.metadata.beatGrid = gridSnaps;
        }



    } else {
        // Calculate the beatgrid and visualize it
        let gridSnaps = t.metadata.beatGrid;
        console.log("BBB CALCULATING BEATGRID FOR ", t.metadata.fileName, gridSnaps)
        if (!gridSnaps || gridSnaps.length === 0) {
            //console.log("CALCULATING BEATGRID FOR ", t.metadata.fileName)
            gridSnaps = beatGrid.calculateGrid(t);
            console.log("CALCULATED BEATGRID FOR ", t.metadata.fileName, gridSnaps)
            // console.log('calculated gridSnaps', gridSnaps);
            t.metadata.beatGrid = gridSnaps;
            // Set default gridLength based on calculated values
            t.metadata.beatLength = gridSnaps[1] - gridSnaps[0];
        } else {
            console.log("BEATGRID ALREADY FOUND FOR ", t.metadata.fileName, gridSnaps)
        }


        // Take the firstBeatOffset and add it to each value in the gridSnaps array
        // this is much easier further in the API than having to add it each time at run-time
        console.log('what are gridSnaps', gridSnaps)
        t.metadata.beatGrid = gridSnaps.map((snap) => snap + firstBeatOffset);

    }

    // Remark: May want to move cuePoints further up in logic
    let cuePoints = t.metadata.cuePoints;

    if (typeof cuePoints === 'undefined' || cuePoints.length === 0) {
        console.log("CALCULATING CUEPOINTS FOR ", t.metadata.fileName)
        // Detect the cue points and visualize them
        cuePoints = await detectCuePoints(t);
        t.metadata.cuePoints = cuePoints;
    } else {
        console.log("CUEPOINTS ALREADY FOUND FOR ", t.metadata.fileName, cuePoints)
    }

    t.metadata.cuePoints = cuePoints;

};




function normalizeKey(inputKey) {
    // Split the input key into note and type (e.g., "Eb Minor" -> "Eb", "Minor")
    const [note, type] = inputKey.split(" ");

    if (!note || !type) {
        console.error(`Invalid key format: "${inputKey}"`);
        return null;
    }

    // Normalize the type (e.g., "Minor" -> "min", "Major" -> "maj")
    const normalizedType = type.toLowerCase() === "minor" ? "min" : "maj";

    // Return the normalized key (e.g., "Ebmin" or "C#maj")
    return `${note}${normalizedType}`;
}

function mapKeyToTraktor(inputKey) {
    // Normalize the input key
    const normalizedKey = normalizeKey(inputKey);

    if (!normalizedKey) {
        console.error(`Failed to normalize key: "${inputKey}"`);
        return null;
    }

    // Find the Traktor key from the keyMap
    const traktorKey = keyMap[normalizedKey];
    if (!traktorKey) {
        console.error(`Key "${normalizedKey}" not found in keyMap.`);
        return null;
    }

    return traktorKey;
}


const keyMap = {
    // Minor Keys
    "Amin": "8m", "Bbmin": "3m", "Bmin": "10m",
    "Cmin": "5m", "C#min": "12m", "Dbmin": "12m", // Dbmin = C#min
    "Dmin": "7m", "Ebmin": "2m", "Emin": "9m",
    "Fmin": "4m", "F#min": "11m", "Gbmin": "11m", // Gbmin = F#min
    "Gmin": "6m", "Abmin": "1m", "G#min": "1m",  // G#min = Abmin

    // Major Keys
    "Amaj": "11d", "Bbmaj": "6d", "Bmaj": "1d",
    "Cmaj": "8d", "C#maj": "3d", "Dbmaj": "3d",  // Dbmaj = C#maj
    "Dmaj": "10d", "Ebmaj": "5d", "Emaj": "12d",
    "Fmaj": "7d", "F#maj": "2d", "Gbmaj": "2d",  // Gbmaj = F#maj
    "Gmaj": "9d", "Abmaj": "4d", "G#maj": "4d"   // G#maj = Abmaj
};




function adjustToTraktorKey(libKeyFinderKey) {
    const relativeKeys = {
        // Minor Keys (m)
        "1m": "5m",  // Ab Minor -> C Minor
        "2m": "6m",  // Eb Minor -> G Minor
        "3m": "7m",  // Bb Minor -> D Minor
        "4m": "8m",  // F Minor -> A Minor
        "5m": "9m",  // C Minor -> E Minor
        "6m": "10m", // G Minor -> B Minor
        "7m": "11m", // D Minor -> F# Minor
        "8m": "12m", // A Minor -> C# Minor
        "9m": "1m",  // E Minor -> Ab Minor
        "10m": "2m", // B Minor -> Eb Minor
        "11m": "3m", // F# Minor -> Bb Minor
        "12m": "4m", // C# Minor -> F Minor

        // Major Keys (d)
        "1d": "5d",  // Ab Major -> C Major
        "2d": "6d",  // Eb Major -> G Major
        "3d": "7d",  // Bb Major -> D Major
        "4d": "8d",  // F Major -> A Major
        "5d": "9d",  // C Major -> E Major
        "6d": "10d", // G Major -> B Major
        "7d": "11d", // D Major -> F# Major
        "8d": "12d", // A Major -> C# Major
        "9d": "1d",  // E Major -> Ab Major
        "10d": "2d", // B Major -> Eb Major
        "11d": "3d", // F# Major -> Bb Major
        "12d": "4d"  // C# Major -> F Major
    };

    return relativeKeys[libKeyFinderKey] || libKeyFinderKey; // Default to original key if no mapping exists
}