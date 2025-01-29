export default class TouchPadControl {
    constructor(parentElement, options = {}) {
      this.parentElement = parentElement;
      this.options = {
        width: options.width || 200,
        height: options.height || 200,
        fullRange: true, // new option to toggle between -1 to 1 and 0 to 1 ranges
        onChange: options.onChange || function(x, y) {
          console.log('no onChange set, using default TouchPadControl:', x, y);
        },
      };
  
      if (typeof options.fullRange === 'boolean') {
        this.options.fullRange = options.fullRange;
      }
      this.status = 'visible';
      this.init();
      return this;
    }
  
    init() {
      // Create the pad element
      this.pad = document.createElement('div');
      this.pad.style.width = `${this.options.width}px`;
      this.pad.style.height = `${this.options.height}px`;
      this.pad.classList.add('touchpad-control');
  
      // Append to parent
      this.parentElement.appendChild(this.pad);
  
      // Create the thumb
      this.thumb = document.createElement('div');
      this.thumb.classList.add('touchpad-thumb');
      this.pad.appendChild(this.thumb);
  
      // Set thumb initial position at center
      this.updateThumbPosition(this.options.width / 2, this.options.height / 2);
  
      // Bind event listeners
      this.pad.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.pad.addEventListener('dblclick', this.handleDoubleClick.bind(this)); // Add double-click listener
      this.thumb.addEventListener('dblclick', this.handleDoubleClick.bind(this)); // Ensure double-click on thumb also resets
  
      // Bind mousemove and mouseup event listeners to the document
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }
  
    handleMouseDown(event) {
      const rect = this.pad.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.updatePosition(x, y);
  
      // Add mouse move and mouse up handlers
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  
    handleDoubleClick(event) {
      event.stopPropagation(); // Prevent double-click event from propagating further
      // Reset position to center
      this.updatePosition(this.options.width / 2, this.options.height / 2);
    }
  
    handleMouseMove(event) {
      const rect = this.pad.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.updatePosition(x, y);
    }
  
    handleMouseUp() {
      // Remove temporary handlers
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  
    updatePosition(x, y) {
      this.updateThumbPosition(x, y);
      // Adjust values to range from -1 to 1 or 0 to 1 based on fullRange option
      const normalizedX = (x / this.options.width) * (this.options.fullRange ? 2 : 1) - (this.options.fullRange ? 1 : 0);
      const normalizedY = (y / this.options.height) * (this.options.fullRange ? 2 : 1) - (this.options.fullRange ? 1 : 0);
      this.options.onChange(normalizedX, normalizedY);
    }
  
    updateThumbPosition(x, y) {
      this.thumb.style.left = `${x}px`;
      this.thumb.style.top = `${y}px`;
    }
  
    hide () {
      this.status = 'hidden';
      this.pad.style.display = 'none';
    }
  
    show () {
      this.status = 'visible';
      this.pad.style.display = 'block';
    }
  
    toggle () {
      if (this.status === 'hidden') {
        this.show();
      } else {
        this.hide();
      }
    }
  }
  