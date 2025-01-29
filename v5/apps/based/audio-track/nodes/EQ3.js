export default function applyEQ3(track, type, gainValue) {

    // TODO: use track.audioNodes Map instead of track.eqNodes
    // if (!track.audioNodes.has('eq3')) {

    if (!track.eqNodes) {
        console.log("Creating EQ nodes for track", track.id);
        // Create and configure EQ nodes
        track.eqNodes = {
            lowshelf: track.audioContext.createBiquadFilter(),
            peaking: track.audioContext.createBiquadFilter(),
            highshelf: track.audioContext.createBiquadFilter(),
        };

        track.eqNodes.lowshelf.type = "lowshelf";
        track.eqNodes.lowshelf.frequency.value = 200;
        track.eqNodes.lowshelf.gain.value = 0;

        track.eqNodes.peaking.type = "peaking";
        track.eqNodes.peaking.frequency.value = 1000;
        track.eqNodes.peaking.Q.value = 1;
        track.eqNodes.peaking.gain.value = 0;

        track.eqNodes.highshelf.type = "highshelf";
        track.eqNodes.highshelf.frequency.value = 5000;
        track.eqNodes.highshelf.gain.value = 0;

        track.addNode('eq-lowshelf', track.eqNodes.lowshelf);
        track.addNode('eq-peaking', track.eqNodes.peaking);
        track.addNode('eq-highshelf', track.eqNodes.highshelf);

    }

    // Adjust EQ gain
    const eqNode = track.eqNodes[type];
    if (eqNode) {
        eqNode.gain.value = gainValue;
        // console.log(`Applied ${type} EQ with gain ${gainValue}`);
    } else {
        console.warn(`Invalid EQ type: ${type}`);
    }
}