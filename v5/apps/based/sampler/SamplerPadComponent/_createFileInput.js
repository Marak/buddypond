import StreamingWaveform from "../../ui/StreamingWaveform.js";

// File Input
export default function _createFileInput(button, sampler, padIndex) {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";
    fileInput.style.display = "none"; // Hide the input element

    // Create a FontAwesome icon button
    const iconButton = document.createElement("button");
    iconButton.classList.add("sampler-file-icon-button", 'sampler-record-button');
    iconButton.innerHTML = '<i class="fa-duotone fa-regular fa-upload"></i>'; // FontAwesome audio file icon
    iconButton.title = "Load Audio Sample";

    // Event listener for the file input change
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
            await sampler.loadSample(file, padIndex);
            button.textContent = file.name.split(".")[0]; // Update button text with file name

            // get the wavecontainer by padIndex
            let waveformContainer = this.pads[padIndex].querySelector('.sampler-waveform-container');
            waveformContainer.innerHTML = ''; // clear the waveform container
            // render a waveform for this sound file
            const waveform = new StreamingWaveform({
                buffer: this.sampler.buffers[padIndex],
                parent: waveformContainer,
                width: 196,
                height: 100,
            });



        }
    });

    // Click the hidden file input when the icon is clicked
    iconButton.addEventListener("click", () => {
        fileInput.click();
    });

    return { fileInput, iconButton };
}