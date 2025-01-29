// Function to read ID3 tags from a file Blob
export default async function detectID3Tags(blob) {
    try {
        return new Promise((resolve, reject) => {
            jsmediatags.read(blob, {
                onSuccess: function (tag) {
                    // console.log('readID3Tags onSuccess', tag);

                    const id3Info = {};
                    const tagMappings = {
                        title: 'title',
                        artist: 'artist',
                        album: 'album',
                        year: 'year',
                        genre: 'genre',
                        track: 'trackNumber',
                        TBPM: 'bpm',
                        TKEY: 'key',
                        COMM: 'comment',
                        TCON: 'genre',
                        TLEN: 'duration',
                        TPE1: 'artist',
                        TPE2: 'band',
                        TPOS: 'discNumber',
                        TIT1: 'group',
                        TIT2: 'title',
                        TIT3: 'subtitle',
                        TYER: 'year',
                        TDAT: 'date',
                        TIME: 'time',
                        TORY: 'originalYear',
                        TXXX: 'userDefined',
                        WXXX: 'userDefinedUrl',
                        TCMP: 'compilation',
                        TENC: 'encodedBy',
                        TFLT: 'fileType',
                        TMED: 'mediaType',
                        TMOO: 'mood',
                        TPE3: 'conductor',
                        TPE4: 'remixer',
                    };
                
                    // Generic tag extraction
                    for (const [tagKey, infoKey] of Object.entries(tagMappings)) {
                        const value = tag.tags[tagKey]?.data || tag.tags[tagKey];
                        if (value) id3Info[infoKey] = value;
                    }
                
                    // Special case for POPM (Popularimeter) tag
                    if (tag.tags.POPM) {
                        const popm = tag.tags.POPM;
                        if (typeof popm.rating === 'number') {
                            // Map rating from 0-255 to a 5-star system
                            id3Info.rating = Math.round((popm.rating / 255) * 5);
                        }
                        id3Info.playCount = popm.counter || 0; // Optional play count
                    }
                
                    // console.log('Extracted ID3 Info:', id3Info);


                    resolve(id3Info);
                },
                onError: function (error) {
                    console.error('Error reading ID3 tags:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Failed to fetch the file:', error);
        throw error;
    }
}
