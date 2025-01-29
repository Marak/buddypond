export default function hasTrackMetadata (metadata) {
    const requiredProps = ['title', 'initialKey', 'bpm', 'firstBeatOffset', 'duration', /* 'beatGrid', 'cuePoints'*/ ];

    if (!metadata) {
        return {
            hasMetadata: false,
            missing: requiredProps
        };
    }

    // console.log("WHACK", metadata)
    const missing = requiredProps.filter(prop => {
        if (prop === 'firstBeatOffset' || prop === 'duration') {
            return typeof metadata[prop] !== 'number';
        } else if (prop === 'beatGrid' || prop === 'cuePoints') {
            return !Array.isArray(metadata[prop]) || metadata[prop].length === 0;
        } else {
            return typeof metadata[prop] === 'undefined';
        }
    });

    if (missing.length > 0) {
        return {
            hasMetadata: false,
            missing
        };
    }

    return {
        hasMetadata: true
    };
};
