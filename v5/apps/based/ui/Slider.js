export default function createSliderComponent(track, trackId, config = {}) {
    let slider = new SliderComponent(track, trackId, config);
    return slider;
}

function SliderComponent(track, trackId, config = {}) {
    // Default configuration options
    const defaultConfig = {
        className: 'volume-slider',
        thumbClassName: 'slider-thumb',
        labelClassName: 'label', // New option for label class
        orientation: 'vertical', // 'vertical' or 'horizontal'
        trackColor: '#333',
        thumbColor: '#fff',
        trackWidth: '60px',
        trackHeight: '200px',
        thumbWidth: '48px',
        thumbHeight: '8px',
        showLabel: true,
        showScale: false,
        showCenterLine: false, // Option to enable/disable the center line
        centerLineColor: '#aeafaf', // Default color for the center line
        centerLineLength: '32px', // Length of the center line
        scaleLineLength: '32px', // Length of the scale lines
        centerLineWidth: '2px', // Default width for the center line
        centerLineSpacing: 10, // Spacing between each line in pixels
        progressBarColor: '#4caf50', // Default color for the progress bar
        progressBarSize: '8px', // Default size for the progress bar
        minValue: 0,
        maxValue: 1,
        step: 0.01,
        value: 0,
        defaultValue: 0, // Default value when double-clicking the slider
        onDoubleClick: (value) => {
            console.log('Must implement double-click handler to reset the value');
            // resets the value to default
            this.setValue(value);
        },
        onClick : (value) => {
            // console.log('Must implement onClick to evoke changes to state');
        },
        onChange: (value, val) => {
            console.log('Must implement changeFunction to evoke changes to state');
        },
        formatLabel: (value) => {
            return value.toFixed(2);
        }
    };

    const options = { ...defaultConfig, ...config };
    this.options = options;

    this.onClick = options.onClick.bind(this); // Binding the onClick method to ensure proper context
    this.onChange = options.onChange.bind(this); // Binding the onChange method to ensure proper context
    this.onDoubleClick = options.onDoubleClick.bind(this); // Binding the onDoubleClick method to ensure proper context
    this.formatLabel = options.formatLabel.bind(this);
    this.thumbHeight = options.thumbHeight;
    this.thumbWidth = options.thumbWidth;
    this.trackWidth = options.trackWidth;
    this.trackHeight = options.trackHeight;
    this.orientation = options.orientation;

    this.defaultValue = options.defaultValue;


    this.trackLength = options.orientation === 'vertical'
        ? parseInt(options.trackHeight)
        : parseInt(options.trackWidth);


    const sliderContainer = document.createElement('div');
    this.sliderContainer = sliderContainer;
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.value = options.value;

    sliderContainer.style.background = options.trackColor;
    sliderContainer.style.borderRadius = '5px';
    sliderContainer.classList.add(options.className);
    sliderContainer.classList.add('slider-component');

    if (options.orientation === 'vertical') {
        sliderContainer.style.width = options.trackWidth;
        sliderContainer.style.height = options.trackHeight;
    } else {
        sliderContainer.style.width = options.trackHeight; // Flip dimensions for horizontal
        sliderContainer.style.height = options.trackWidth;
    }

    if (options.showCenterLine) {
        const centerLine = document.createElement('div');
        centerLine.style.position = 'absolute';
        centerLine.style.background = options.centerLineColor;

        if (options.orientation === 'vertical') {
            centerLine.style.width = options.centerLineLength;
            centerLine.style.height = options.centerLineWidth;
            centerLine.style.left = `calc(50% - ${parseInt(options.centerLineLength) / 2}px)`;
            centerLine.style.top = '50%';
        } else {
            centerLine.style.height = options.centerLineLength;
            centerLine.style.width = options.centerLineWidth;
            centerLine.style.top = `calc(50% - ${parseInt(options.centerLineLength) / 2}px)`;
            centerLine.style.left = '50%';
        }

        sliderContainer.appendChild(centerLine);
    }

    if (options.showScale) {
        const createLine = (position) => {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.background = options.centerLineColor;
            line.style.opacity = 0.2;

            if (options.orientation === 'vertical') {
                line.style.width = options.scaleLineLength;
                line.style.height = options.centerLineWidth;
                line.style.left = `calc(50% - ${parseInt(options.scaleLineLength) / 2}px)`;
                line.style.top = `${position}px`;
            } else {
                line.style.height = options.scaleLineLength;
                line.style.width = options.centerLineWidth;
                line.style.top = `calc(50% - ${parseInt(options.scaleLineLength) / 2}px)`;
                line.style.left = `${position}px`;
            }

            sliderContainer.appendChild(line);
        };

        // Add lines symmetrically starting from the center
        const trackLength = options.orientation === 'vertical'
            ? parseInt(options.trackHeight)
            : parseInt(options.trackWidth);

        const center = trackLength / 2;
        const spacing = options.centerLineSpacing;

        // Create lines from the center outward
        for (let offset = 0; center + offset <= trackLength || center - offset >= 0; offset += spacing) {
            if (center + offset <= trackLength) createLine(center + offset); // Line below/after center
            if (center - offset >= 0 && offset !== 0) createLine(center - offset); // Line above/before center
        }
    }

    if (options.showProgress) {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.background = options.progressBarColor;
        progressBar.style.zIndex = '1'; // Ensure it appears below the thumb
        this.progressBar = progressBar;

        if (options.orientation === 'vertical') {
            progressBar.style.width = options.progressBarSize;
            progressBar.style.left = `calc(50% - ${parseInt(options.progressBarSize) / 2}px)`;
        } else {
            progressBar.style.height = options.progressBarSize;
            progressBar.style.top = `calc(50% - ${parseInt(options.progressBarSize) / 2}px)`;
        }
        sliderContainer.appendChild(progressBar);

    }

    // Slider thumb
    const sliderThumb = document.createElement('div');
    sliderThumb.classList.add(options.thumbClassName);
    sliderThumb.style.position = 'absolute';
    sliderThumb.style.background = options.thumbColor;
    sliderThumb.style.borderRadius = '4px';
    sliderThumb.style.cursor = 'pointer';
    sliderThumb.title = this.options.title || "Track Volume";

    if (this.options.sliderThumbStyles) {
        // object array of styles with keys as the css property and values as the css value
        // iterate and apply
        Object.keys(this.options.sliderThumbStyles).forEach((key) => {
            sliderThumb.style[key] = this.options.sliderThumbStyles[key];
        });
    }

    if (options.orientation === 'vertical') {
        sliderThumb.style.width = options.thumbWidth;
        sliderThumb.style.height = options.thumbHeight;
        // sliderThumb.style.left = `calc(50% - ${parseInt(options.thumbWidth) / 2}px)`;
    } else {
        sliderThumb.style.width = options.thumbHeight; // Flip dimensions for horizontal
        sliderThumb.style.height = options.thumbWidth;
        // sliderThumb.style.top = `calc(50% - ${parseInt(options.thumbWidth) / 2}px)`;
    }

    this.sliderThumb = sliderThumb;

    const initialPosition =
        options.orientation === 'vertical'
            ? (1 - options.value) * this.trackLength
            : options.value * this.trackLength;

    if (options.orientation === 'vertical') {
        sliderThumb.style.top = `${initialPosition - parseInt(options.thumbHeight) / 2}px`;
    } else {
        sliderThumb.style.left = `${initialPosition - parseInt(options.thumbWidth) / 2}px`;
    }

    sliderContainer.appendChild(sliderThumb);

    const sliderLabel = document.createElement('div');
    sliderLabel.classList.add(options.labelClassName);
    sliderLabel.textContent = options.value.toFixed(2); // Initial value
    sliderLabel.style.position = 'absolute';
    sliderLabel.style.top = options.orientation === 'vertical' ? '-22px' : '50%';
    sliderLabel.style.left = options.orientation === 'vertical' ? '50%' : 'calc(100% + 10px)';
    sliderLabel.style.transform = options.orientation === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)';
    this.sliderLabel = sliderLabel;

    if (!this.options.showLabel) {
        sliderLabel.style.display = 'none';
    }

    sliderContainer.appendChild(sliderLabel);

    let self = this;

    let isDragging = false;

    sliderThumb.addEventListener('mousedown', (e) => {
        this.onClick(this.getValue());
        isDragging = true;
        this._onChange(e);
    });

    sliderThumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        this._onChange(e.touches[0]);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) this._onChange(e);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) this._onChange(e.touches[0]);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    sliderContainer.addEventListener('mousedown', (e) => {
        if (e.target === sliderThumb) return;
        this.onClick(this.getValue());
        this._onChange(e);
        isDragging = true;
    });

    // mobile touch events
    sliderContainer.addEventListener('touchstart', (e) => {
        if (e.target === sliderThumb) return;
        this._onChange(e.touches[0]);
        isDragging = true;
    });

    sliderContainer.addEventListener('touchend', () => {
        isDragging = false;
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (isDragging) this._onChange(e.touches[0]);
    });

    sliderContainer.addEventListener('dblclick', (e) => {
        // TODO: ensure a delay of 200ms has passed
        // before resetting the value
        this.onDoubleClick(this.defaultValue);
    });

    this.setValue(options.value, false);

    return this;
}

SliderComponent.prototype._onChange = function (e) {
    // Custom scale for zoomed-in elements
    let scale = 1;
    //scale = 1;
    const rect = this.sliderContainer.getBoundingClientRect();
    let position;

    // Adjust rect dimensions based on scale
    const scaledWidth = rect.width / scale;
    const scaledHeight = rect.height / scale;

    if (this.orientation === 'vertical') {
        // Calculate position accounting for the scale
        position = (e.clientY - rect.top) / scale;
        position = Math.min(Math.max(position, 0), scaledHeight);

        const volume = 1 - position / scaledHeight;

        // Adjust slider thumb position based on scale
        this.sliderThumb.style.top = `${Math.min(
            Math.max(position - parseInt(this.thumbHeight) / 2 / scale, 0),
            scaledHeight - parseInt(this.thumbHeight) / scale
        )}px`;

        // Update value and UI elements
        this.value = volume;
        this.updateProgressBar(volume);
        this.updateLabel(this.formatLabel(volume));

        this.onChange(volume, this.getValue());
    } else {
        // Calculate position accounting for the scale
        position = (e.clientX - rect.left) / scale;
        position = Math.min(Math.max(position, 0), scaledWidth);

        const volume = position / scaledWidth;

        // Adjust slider thumb position based on scale
        this.sliderThumb.style.left = `${Math.min(
            Math.max(position - parseInt(this.thumbWidth) / 2 / scale, 0),
            scaledWidth - parseInt(this.thumbWidth) / scale
        )}px`;

        // Update value and UI elements
        this.value = volume;
        this.updateProgressBar(volume);
        this.updateLabel(this.formatLabel(volume));

        this.onChange(volume, this.getValue());
    }
};

SliderComponent.prototype.getValue = function () {
    // returns actual value from with 0 to 1 multipled by the range
    return this.value * (this.maxValue - this.minValue) + this.minValue;
}

SliderComponent.prototype.setValue = function (value, propigate = true) {
    const clampedValue = Math.min(Math.max(value, this.options.minValue), this.options.maxValue);
    // incoming value is in units of the range,
    // we need to conver this into 0-1 value
    let range = this.maxValue - this.minValue;
    let normalizedValue = (clampedValue - this.minValue) / range;

    this.value = normalizedValue;

    const position =
        this.orientation === 'vertical'
            ? (1 - normalizedValue) * this.trackLength
            : normalizedValue * this.trackLength;

    if (this.orientation === 'vertical') {
        this.sliderThumb.style.top = `${Math.min(
            Math.max(position - parseInt(this.thumbHeight) / 2, 0),
            this.trackLength - parseInt(this.thumbHeight)
        )}px`;
        if (this.options.showProgress) {

            this.progressBar.style.height = `${(1 - normalizedValue) * this.trackLength}px`;
            this.progressBar.style.top = `${normalizedValue * this.trackLength}px`;
        }
    } else {
        this.sliderThumb.style.left = `${Math.min(
            Math.max(position - parseInt(this.thumbWidth) / 2, 0),
            this.trackLength - parseInt(this.thumbWidth)
        )}px`;
        if (this.options.showProgress) {
            this.progressBar.style.width = `${normalizedValue * this.trackLength}px`;
        }
    }
    this.updateLabel(this.formatLabel(value));
    this.updateProgressBar();

    if (propigate) {
        // this.onChange(normalizedValue, this.getValue()); // Ensure onChange is always called
        this.onChange(normalizedValue, this.getValue());

    }
};

SliderComponent.prototype.updateProgressBar = function (value) {
    if (!this.options.showProgress) return;
    const position = value * this.trackLength; // Position based on current value
    console.log('value', value, 'position', position);

    if (this.orientation === 'vertical') {
        // Ensure the progress bar grows upward for vertical orientation
        this.progressBar.style.height = `${position}px`;
        this.progressBar.style.top = `${this.trackLength - position}px`;
    } else {
        // Ensure the progress bar grows to the right for horizontal orientation
        this.progressBar.style.width = `${position}px`;
        this.progressBar.style.left = '0'; // Reset any previous left offset
    }
};

SliderComponent.prototype.updateLabel = function (val) {
    this.sliderLabel.textContent = this.getValue().toFixed(2);
};