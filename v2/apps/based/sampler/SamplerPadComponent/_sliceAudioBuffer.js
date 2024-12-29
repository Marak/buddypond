
    // Slice an AudioBuffer between start and end times
export default  function  _sliceAudioBuffer(audioBuffer, start, end) {
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(start * sampleRate);
        const endSample = Math.floor(end * sampleRate);

        const slicedBuffer = this.audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            endSample - startSample,
            sampleRate
        );

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const originalData = audioBuffer.getChannelData(channel);
            const slicedData = slicedBuffer.getChannelData(channel);

            for (let i = 0; i < slicedData.length; i++) {
                slicedData[i] = originalData[startSample + i];
            }
        }

        return slicedBuffer;
    }

