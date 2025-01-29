// TODO: This is the legacy function we need to update to the new style as above
export default function applyFilter(track, value, resonance = 1) {

    if (!track) return;

    console.log('applyFilter', track.id, value);

    // Ensure the value is clamped within the range [-22050, 22050]
    value = Math.max(-22050, Math.min(22050, Number(value)));
    // Clamp resonance to a sensible range, typically [0.1, 10]
    resonance = Math.max(0.1, Math.min(10, Number(resonance)));

    // Initialize the filter node if it doesn't exist

    // Check if the filter node already exists, if not create and add it
    if (!track.audioNodes.has('filter')) {
        let filterNode = track.audioContext.createBiquadFilter();
        console.log("Creating filter node for track", track.id, filterNode);
        track.addNode('filter', filterNode); // Use addNode to manage the filter
        track.filterNode = filterNode; // Store the filter node reference ( for now, should use track API instead )
    }

    const filterNode = track.audioNodes.get('filter');


    // console.log('applyFilter', track.id, value);

    const minFrequency = 10; // Minimum valid frequency
    const maxFrequency = 22050; // Maximum valid frequency

    if (value < 0) {
        // Lowpass: Map value [-1, 0) to frequencies [maxFrequency, minFrequency]
        const normalizedValue = Math.max(-1, Math.min(0, value)); // Clamp value to [-1, 0]
        track.filterNode.type = 'lowpass';
        track.filterNode.frequency.value =
            maxFrequency * Math.pow(minFrequency / maxFrequency, -normalizedValue);
    } else if (value > 0) {
        // Highpass: Map value (0, 1] to frequencies [minFrequency, maxFrequency]
        const normalizedValue = Math.max(0, Math.min(1, value)); // Clamp value to [0, 1]
        track.filterNode.type = 'highpass';
        track.filterNode.frequency.value =
            minFrequency * Math.pow(maxFrequency / minFrequency, normalizedValue);
    } else {
        // Allpass: No filtering
        // console.log('ALLPASS');
        track.filterNode.type = 'allpass';
        track.filterNode.frequency.value = maxFrequency; // Full range
    }

    // Set the resonance (Q value) for the filter
    filterNode.Q.value = resonance;
}

