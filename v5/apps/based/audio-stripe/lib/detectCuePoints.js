export default async function detectCuePoints(track) {
    console.log('detectCuePoints was called', track);

    const audioContext = track.audioContext;
    const audioElement = track.audioElement;

    if (!track.audioBuffer) {

    }

    // Fetch and decode the audio data
    //const audioData = await api.fetch(audioElement.src).then(response => response.arrayBuffer());
    //const audioBuffer = await audioContext.decodeAudioData(audioData);
    let audioBuffer = track.audioBuffer;



    const duration = audioBuffer.duration;

    // Create an OfflineAudioContext for analysis
    const offlineContext = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);

    // Create a buffer source in the offline context
    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = audioBuffer;
    offlineSource.connect(offlineContext.destination);

    // Start the source and render the audio offline
    offlineSource.start(0);
    const renderedBuffer = await offlineContext.startRendering();

    // Analyze the rendered buffer
    const channelData = renderedBuffer.getChannelData(0);  // Use the first channel's data
    const sampleRate = renderedBuffer.sampleRate;
    const threshold = 0.01;  // Adjust threshold for noticeable energy spikes

    // Create an Analyser node
    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = 1024;
    offlineSource.connect(analyser);
    const frequencyData = new Float32Array(analyser.frequencyBinCount);

    // Approach 1: Using the track's metadata.beatGrid to segment the track into sections
    const beatGrid = track.metadata.beatGrid;  // Assuming beatGrid is an array of beats (e.g., [0, 1, 2, 3, 4, 5...])
    const cuePointsFromBeatGrid = generateCuePointsFromBeatGrid(beatGrid, duration);

    // Approach 2: Perform energy-based audio analysis to detect interesting cue points
    const cuePointsFromAudio = await analyzeAudioForCuePoints(channelData, sampleRate, analyser, frequencyData, threshold);

    // Combine both approaches and select the top 8 cue points
    let allCuePoints = [...cuePointsFromBeatGrid /*, ...cuePointsFromAudio*/];

    // allCuePoints = await analyzeAudioForAmplitudeChanges(track, channelData, sampleRate, track.metadata, threshold);
    //allCuePoints = await analyzeAudioForFFT(track, channelData, sampleRate, track.metadata, threshold);


    const uniqueCuePoints = Array.from(new Set(allCuePoints));  // Ensure no duplicate cue points
    const sortedCuePoints = uniqueCuePoints.sort((a, b) => a - b);  // Sort cue points by their timestamps


    //let caculatedCuePoints = generateCuePointsFromCommonSongStructure(beatGrid, duration);
    //return caculatedCuePoints;
    // Limit to 8 cue points
    // const finalCuePoints = sortedCuePoints.slice(0, 8);
    const finalCuePoints = allCuePoints;

   // console.log('Generated Cue Points:', finalCuePoints);

    return finalCuePoints;
}
function generateCuePointsFromCommonSongStructure(beatGrid, duration) {
    const cuePoints = [];

    // Determine the duration of one bar in seconds
    const beatsPerBar = 4;  // Assuming 4/4 time signature
    const totalBeats = beatGrid.length;  // Total number of beats in the track
    
    // Estimate the beats per second (BPS) by dividing total beats by track duration
    const beatsPerSecond = totalBeats / duration;

    // Calculate the time for each cue point at evenly spaced intervals along the duration
    const numberOfCuePoints = 8;  // We want 8 cue points

    // Divide the track duration into 8 equal parts, each part representing the position of a cue point
    for (let i = 0; i < numberOfCuePoints; i++) {
        const targetTime = (i + 1) * duration / numberOfCuePoints;

        // Find the closest beat to the target time using beatsPerSecond
        const targetBeat = targetTime * beatsPerSecond;
        const cuePointTime = getTimeForBeat(targetBeat, beatGrid, totalBeats);

        if (cuePointTime !== null) {
            cuePoints.push(cuePointTime);
        }
    }
    // console.log("RETURNING", cuePoints)
    // Return the 8 cue points
    return cuePoints;
}

function getTimeForBeat(targetBeat, beatGrid, totalBeats) {
    // If the target beat exceeds the available beats in the grid, return null
    if (targetBeat > beatGrid[totalBeats - 1]) {
        return null;
    }

    // Find the closest beat in the beat grid
    for (let i = 0; i < beatGrid.length; i++) {
        if (beatGrid[i] >= targetBeat) {
            return beatGrid[i];
        }
    }
    return null;  // In case no beat is found (should not happen with correct data)
}


function generateCuePointsFromBeatGrid(beatGrid) {
    console.log('generateCuePointsFromBeatGrid was called')
    if (!beatGrid || beatGrid.length === 0) {
        throw new Error("Invalid beatGrid: empty or null.");
    }

    const cuePoints = [];
    for (let i = 0; i < beatGrid.length; i++) {
        // Only create cue points at intervals of 64 beats
        if (i % 64 !== 0) {
            continue;
        }

        let cueType = 'cue';
        if (i === 0) {
            cueType = 'start';
        }

        // Use the exact beatGrid value as the cue point
        const cueTime = beatGrid[i];
        cuePoints.push({
            time: cueTime,
            type: cueType,
        });
    }
    return cuePoints;
}


// Analyze audio data to find interesting cue points (e.g., spikes, build-ups, drops)


/*



3. **Frequency Analysis for "Interesting" Sections**:
   - Perform a **Fourier Transform** (or a simplified version) on each frame to extract dominant frequencies and overall frequency energy distribution.
   - Look for distinct shifts in frequency patterns:
      - *Bass Drop Detection*: If the low-frequency energy (e.g., around 20-150 Hz) suddenly spikes or dips, it could indicate the start or end of a **bass-heavy section**.
      - *Buildup Identification*: If high frequencies (above 500 Hz) consistently rise, this could indicate a buildup leading to a drop.
      - *Verse and Hook Segments*: Identify sections with varied frequency patterns that differ from the repetitive bass or drum patterns, suggesting a verse or hook. Verses often have a more stable, balanced frequency distribution, while hooks might have more intense or complex frequency arrangements.


*/
async function analyzeAudioForAmplitudeChanges(track, channelData, sampleRate, trackMetadata, threshold) {
    const cuePoints = [];
    //const windowSize = Math.floor(track.metadata.beatLength / 50 * sampleRate);  // Align window to one beat
    //let windowSize = Math.floor(0.5 * sampleRate);
    //windowSize = Math.floor(0.2 * sampleRate);
    const windowSize = 1024;  // Use a fixed window size for analysis

    // TODO: calculate all averages of each window

    const stepSize = windowSize / 2;  // Use half-beat steps for finer resolution
    const dropThreshold = 0.50;  // Drop threshold as a percentage (e.g., 50%)

    let lastAverageAmplitude = 0;
    let inBreakdown = false;

    for (let i = 0; i < channelData.length; i += stepSize) {
        // Calculate average amplitude for the current window
        let sumAmplitude = 0;
        for (let j = i; j < i + windowSize && j < channelData.length; j++) {
            sumAmplitude += Math.abs(channelData[j]);
        }
        const averageAmplitude = sumAmplitude / windowSize;
 //       console.log(averageAmplitude, 'averageAmplitude', lastAverageAmplitude, 'lastAverageAmplitude');
        // Check for significant drop in amplitude (possible breakdown start)
        if (!inBreakdown && averageAmplitude < lastAverageAmplitude * dropThreshold) {
            // console.log('BREAKDOWN START', i / sampleRate);
            cuePoints.push({
                time: i / sampleRate,
                type: "breakdown start"
            });
            inBreakdown = true;
        }

        // Check for return of amplitude after breakdown (possible breakdown end)
        if (inBreakdown && averageAmplitude >= lastAverageAmplitude * dropThreshold) {
            cuePoints.push({
                time: i / sampleRate,
                type: "breakdown end"
            });
            inBreakdown = false;
        }

        // Update lastAverageAmplitude for the next iteration
        lastAverageAmplitude = averageAmplitude;
    }

    // console.log('analyzeAudioForAmplitudeChanges cuePoints', cuePoints);

    return cuePoints;
}


/*



    Write pseudo code that will find the best areas of interest in a song to set cue points.
    This will be done by making some assumptions about frequency data and energy levels in the song.
    Then figuring out start and end points and using those as cue points.

*/
async function analyzeAudioForCuePoints(channelData, sampleRate, analyser, frequencyData, threshold) {
    const cuePoints = [];
    const windowSize = 1024;
    // TODO: align windowSize to beatLength / beatGrid
    //     const windowSize = Math.floor(trackMetadata.beatLength * sampleRate);  // Align window to one beat

    const stepSize = windowSize / 4;

    let energy = 0;
    let lastEnergy = 0;
    let isSpike = false;
    const spikeThreshold = 1.5;  // Example spike threshold

    for (let i = 0; i < channelData.length; i += stepSize) {
        analyser.getFloatFrequencyData(frequencyData);
        
        // Calculate energy in low frequencies (e.g., bass)
        const lowFrequencyEnergy = frequencyData.slice(0, 50).reduce((sum, val) => sum + val, 0);

        if (lowFrequencyEnergy > threshold) {
            // Detect energy spikes
            if (lowFrequencyEnergy > lastEnergy * spikeThreshold) {
                // High energy spike
                cuePoints.push(i / sampleRate);  // Mark this time as a cue point
                isSpike = true;
            }
            lastEnergy = lowFrequencyEnergy;
        }

        // Detect breakdowns or other interesting sections
        if (!isSpike && lowFrequencyEnergy < threshold) {
            // A quiet section after a spike could indicate a breakdown
            cuePoints.push(i / sampleRate);  // Mark this time as a cue point
        }

        isSpike = false;  // Reset spike detection
    }

    return cuePoints;
}
