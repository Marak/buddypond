export default async function enumerateDevices(parent) {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Devices:', devices);
        $('.selectCamera', parent).html('');
        $('.selectAudio', parent).html('');
        devices.forEach((device) => {
            this.alldevices[device.label] = device;
            this.devices[device.kind] = this.devices[device.kind] || {};
            this.devices[device.kind][device.label] = device;
            if (device.kind === 'videoinput') {
                $('.selectCamera', parent).append(
                    `<option value="${device.label}">${device.label}</option>`
                );
            }
            if (device.kind === 'audioinput') {
                $('.selectAudio', parent).append(
                    `<option value="${device.label}">${device.label}</option>`
                );
            }
        });
        console.log('videochat completed enumerateDevices', devices);
    } catch (err) {
        console.error('Error enumerating devices:', err);
        throw err;
    }
}
