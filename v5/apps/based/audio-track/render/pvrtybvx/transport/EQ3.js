import sliderComponent from '../../../../ui/Slider.js';
import EQ3 from '../../../nodes/EQ3.js'
// remove eqContainer and bands data
// replace all hard coded values with config values
// TODO: provide the new example code for generating the EQ3 knobs with eqContainer and bands data and config
// from a parent function
export default function createEQ3(track, trackId, config = {}) {
    // Container for EQ sliders
    const eqContainer = document.createElement('div');
    eqContainer.classList.add('eq-container');

    track.transport.eq3Container = eqContainer;
    // Create knobs for high, mid, and low EQ
    const bands = [
        { name: 'Hi', type: 'highshelf', defaultValue: 0, fgColor: '#FF5733' },
        { name: 'Mid', type: 'peaking', defaultValue: 0, fgColor: '#33FF57' },
        { name: 'Lo', type: 'lowshelf', defaultValue: 0, fgColor: '#3357FF' },
    ];

    let sliderHi = new sliderComponent(track, trackId, {
        className: 'eq-slider-hi',
        thumbWidth: '32px',
        thumbHeight: '32px',
        trackHeight: '150px',
        trackWidth: '32px',
        thumbColor: '#00c0e3',
        minValue: -15,
        maxValue: 15,
        onChange: function(value, val) {
            EQ3(track, 'highshelf', val);
        }
    });

    let sliderMid = new sliderComponent(track, trackId, {
        className: 'eq-slider-mid',
        thumbWidth: '32px',
        thumbHeight: '32px',
        trackHeight: '150px',
        trackWidth: '32px',
        thumbColor: '#00c0e3',
        minValue: -15,
        maxValue: 15,
        onChange: function(value, val) {
           EQ3(track, 'peaking', val);
        }
    });

    let sliderLo = new sliderComponent(track, trackId, {
        className: 'eq-slider-lo',
        thumbWidth: '32px',
        thumbHeight: '32px',
        trackHeight: '150px',
        trackWidth: '32px',
        thumbColor: '#00c0e3',
        minValue: -15,
        maxValue: 15,
        onChange: function(value, val) {
            EQ3(track, 'lowshelf', val);
        }
    });

    let eqSliderContainer = document.createElement('div');
    eqSliderContainer.style.display = 'flex';
    eqSliderContainer.style.justifyContent = 'center';
    eqSliderContainer.style.alignItems = 'center';
    eqSliderContainer.style.gap = '20px';
    eqSliderContainer.style.position = 'relative';

    eqSliderContainer.appendChild(sliderHi.sliderContainer);
    eqSliderContainer.appendChild(sliderMid.sliderContainer);
    eqSliderContainer.appendChild(sliderLo.sliderContainer);

    eqContainer.appendChild(eqSliderContainer)


    bands.forEach((band, i) => {
        return;
        // Create a div wrapper for each knob
        const knobWrapper = document.createElement('div');
        knobWrapper.style.textAlign = 'center';

        knobWrapper.style.cursor = 'pointer';
        // Create a canvas element for the knob
        const knobInput = document.createElement('input');
        knobInput.type = 'text';
        knobInput.value = band.defaultValue; // Start at center
        knobInput.setAttribute('data-fgColor', '#09ccf1');
        knobInput.setAttribute('data-bgColor', '#818180');
        knobInput.setAttribute('data-width', '72'); // Larger for better control
        knobInput.setAttribute('data-height', '72');
        knobInput.setAttribute('data-angleOffset', '-125'); // Start angle
        knobInput.setAttribute('data-angleArc', '250'); // Full arc for EQ knobs
        knobInput.setAttribute('data-min', '-12'); // Minimum EQ value
        knobInput.setAttribute('data-max', '12'); // Maximum EQ value
        knobInput.setAttribute('data-step', '0.1'); // Step for smooth control
        knobInput.setAttribute('data-displayInput', 'false'); // Hide numeric display
        // set  data-thickness=".1"
        knobInput.setAttribute('data-thickness', '.5');

        knobInput.classList.add(`${band.name.toLowerCase()}-eq-knob`);

        // Create the +/- buttons
        const decrementButton = document.createElement('button');
        decrementButton.textContent = '-';
        decrementButton.style.position = 'relative';
        decrementButton.style.top = `${(60 * i) + 60}px`;
        decrementButton.style.left = '0px';
        // decrementButton.style.transform = 'translateX(-50%)';
        decrementButton.style.fontSize = '12px';
        decrementButton.style.color = '#fff';
        decrementButton.style.background = 'transparent';
        decrementButton.style.border = 'none';
        decrementButton.style.cursor = 'pointer';
        decrementButton.style.display = 'none'; // Hidden by default
        decrementButton.style.margin = '0px';
        decrementButton.style.padding = '0px';
        // flaot right
        decrementButton.style.float = 'left';


        const incrementButton = document.createElement('button');
        incrementButton.textContent = '+';
        incrementButton.style.position = 'relative';
        incrementButton.style.top = `60px`;
        incrementButton.style.left = '40px';
        // incrementButton.style.transform = 'translateX(-50%)';
        incrementButton.style.fontSize = '12px';
        incrementButton.style.color = '#fff';
        incrementButton.style.background = 'transparent';
        incrementButton.style.border = 'none';
        incrementButton.style.cursor = 'pointer';
        incrementButton.style.display = 'none'; // Hidden by default
        incrementButton.style.margin = '0px';
        incrementButton.style.padding = '0px';
        // float
        incrementButton.style.float = 'left';

        // Increment and decrement functionality
        decrementButton.addEventListener('click', () => {
            let currentValue = parseFloat(knobInput.value);
            if (currentValue > -12) {
                currentValue -= 1;
                $(knobInput).val(currentValue).trigger('change');
                api.track.applyEQ3(trackId, band.type, currentValue);
            }
        });

        incrementButton.addEventListener('click', () => {
            let currentValue = parseFloat(knobInput.value);
            if (currentValue < 12) {
                currentValue += 1;
                $(knobInput).val(currentValue).trigger('change');
                api.track.applyEQ3(trackId, band.type, currentValue);
            }
        });

        // Show/hide +/- buttons on hover
        knobWrapper.addEventListener('mouseover', () => {
            decrementButton.style.display = 'block';
            incrementButton.style.display = 'block';
        });

        knobWrapper.addEventListener('mouseout', () => {
            //decrementButton.style.display = 'none';
            //incrementButton.style.display = 'none';
        });

        console.log('knobInput', knobInput)
        // Initialize the jQuery.knob plugin

        // Create a label for the knob
        const label = document.createElement('div');
        label.textContent = band.name;
        label.style.marginTop = '0px';
        label.style.color = '#fff';
        label.style.position = 'relative';
        label.style.bottom = '0px';
        label.style.right = '13px';
        label.style.fontSize = '12px';
        label.style.zIndex = '-1';

        // Create the bypass button
        const bypassButton = document.createElement('button');
        bypassButton.textContent = '';
        bypassButton.title = `Bypass ${band.name}`;
        bypassButton.style.width = '14px';
        bypassButton.style.height = '14px';
        bypassButton.style.borderRadius = '50%';
        bypassButton.style.border = '2px solid #000';
        bypassButton.style.backgroundColor = '#818180';
        bypassButton.style.marginRight = '10px';
        bypassButton.style.cursor = 'pointer';
        bypassButton.style.boxSizing = 'border-box'; // Ensure border is included in width and height
        bypassButton.style.display = 'inline-block'; // Ensure the button respects its width and height

        bypassButton.classList.add(`${band.name.toLowerCase()}-bypass-button`);

        // Add toggle functionality to the bypass button
        let isBypassed = false;
        bypassButton.addEventListener('click', () => {
            isBypassed = !isBypassed;
            bypassButton.style.backgroundColor = isBypassed ? '#09ccf1' : '#333';
            console.log(`${band.name} EQ Bypass: ${isBypassed}`);
            // TODO: implement bypass functionality
            api.track.bypassEQ3(trackId, band.type, isBypassed); // Trigger bypass API
        });


        // Handle mouseover and mouseout for dynamic label updates
        knobWrapper.addEventListener('mouseover', () => {
            const currentValue = parseFloat(knobInput.value) || 0;
            const percentage = ((currentValue / 12) * 100).toFixed(0);
            label.textContent = `${percentage}%`; // Show percentage on hover
        });

        knobWrapper.addEventListener('mouseout', () => {
            label.textContent = band.name; // Revert to band name on mouseout
        });

        // Append the knob and label to the wrapper
        //knobWrapper.appendChild(decrementButton);
        //knobWrapper.appendChild(incrementButton);
        knobWrapper.appendChild(knobInput);
        knobWrapper.appendChild(bypassButton);
        knobWrapper.appendChild(label);


        // Add the wrapper to the container
        eqContainer.appendChild(knobWrapper);

        setTimeout(function () {

            $(knobInput).knob({
                release: (value) => {
                    console.log(`${band.name} EQ`, value);
                },
                change: (value) => {
                    console.log(`${band.name} EQ changing`, value);
                    api.track.applyEQ3(trackId, band.type, Number(value));
                    // Update label with real-time percentage
                    const percentage = ((value / 12) * 100).toFixed(0); // Map value to percentage (-100% to 100%)
                    label.textContent = `${percentage}%`;
                },
                // double click to reset
                dblclick: (value) => {
                    console.log(`${band.name} EQ reset to ${band.defaultValue}`);
                    $(knobInput).val(band.defaultValue).trigger('change'); // Reset value
                    api.track.applyEQ3(trackId, band.type, band.defaultValue); // Apply reset
                }
            });

            // Event listener to reset the knob on double-click
            $(knobInput).on('dblclick', () => {
                console.log("dblclick KNob");
                $(knobInput).val(band.defaultValue).trigger('change'); // Reset value
                api.track.applyEQ3(trackId, band.type, band.defaultValue); // Apply reset
                console.log(`${band.name} EQ reset to ${band.defaultValue}`);
            });



        }, 0);
        console.log('knobInput', knobInput)

    });

    return eqContainer;
}
