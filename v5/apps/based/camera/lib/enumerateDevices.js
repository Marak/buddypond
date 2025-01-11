export default async function enumerateDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      $('.selectMirrorCamera').html('');
      let cameraCount = 0;
      devices.forEach((device, i) => {
        device.index = i;
        if (!this.allDevices) {
          this.allDevices = {};
        }
        if (!this.devices) {
          this.devices = {};
        }
        this.allDevices[device.label] = device;
        this.devices[device.kind] = this.devices[device.kind] || {};
        this.devices[device.kind][device.label] = device;
        // console.log("device", device);
        if (device.kind === 'videoinput') {
          cameraCount++;
          let selected = '';
          if (this.selectedCameraIndex === cameraCount) {
            selected = 'selected="selected"';
            device.label = 'ACTIVE';
          }
          $('.selectMirrorCamera', this.cameraWindow.content).append(`<option ${selected}>${device.label}</option>`);
        }
        if (device.kind === 'audioinput') {
          // Update audio devices as needed
          // $('.selectAudio').append(`<option>${device.label}</option>`);
        }
      });
  
      return devices;
    } catch (err) {
      console.error('Error enumerating devices:', err);
      throw err; // Re-throw the error to be handled by the caller
    }
  };
  