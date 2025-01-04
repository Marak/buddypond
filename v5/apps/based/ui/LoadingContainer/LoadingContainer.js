export default class LoadingContainer {
    constructor(parentElement, options = {}) {
      this.parentElement = parentElement;
      this.options = {
        fadeInDuration: options.fadeInDuration || 1350,
        loadingTextInitial: options.loadingTextInitial || '...',
        minimalLoadingTime: options.minimalLoadingTime || 0
      };
      this.startTime = Date.now(); // Record the time when the component is created
      this.hideCalled = false;
      this.loadingSpinner = null;
      this.loadingColumns = null;
      this.loadingText = null;
      this.init();
      return this;
    }
  
    init() {
      // Fade in the parent element
//      api.ui.fadeIn(this.parentElement, { duration: this.options.fadeInDuration });
  
      // Create loading spinner and columns
      this.loadingSpinner = document.createElement("div");
      this.loadingSpinner.classList.add("loading-spinner");
  
      this.loadingColumns = document.createElement("div");
      this.loadingColumns.classList.add("loading-columns");
  
      const loadingColumnLeft = document.createElement("div");
      loadingColumnLeft.classList.add("loading-column", "left");
  
      const loadingColumnRight = document.createElement("div");
      loadingColumnRight.classList.add("loading-column", "right");
  
      this.loadingColumns.appendChild(loadingColumnLeft);
      this.loadingColumns.appendChild(loadingColumnRight);
  
      this.loadingText = document.createElement("div");
      this.loadingText.classList.add("loading-text");
      this.loadingText.innerText = this.options.loadingTextInitial;
  
      // Append the loading elements to the parent element
      this.parentElement.appendChild(this.loadingColumns);
      this.parentElement.appendChild(this.loadingSpinner);
      this.parentElement.appendChild(this.loadingText);
  
      // Start the minimal loading time logic if set
      if (this.options.minimalLoadingTime > 0) {
        const interval = setInterval(() => {
          let elapsed = Date.now() - this.startTime;
          let progress = elapsed / this.options.minimalLoadingTime;
          this.updateProgress(progress);
          if (elapsed >= this.options.minimalLoadingTime) {
            clearInterval(interval);
            if (this.hideCalled) {
              this.hideNow(this.cb);
            }
          }
        }, 1); // Update every 100ms
      }
    }
  
    updateProgress(progress) {
      progress = Math.min(progress, 1); // Ensure progress does not exceed 100%
      const progressPercent = Math.floor(progress * 100);
      this.loadingText.innerText = `${progressPercent}%`;
    }
  
    hide(cb) {
      this.cb = cb;
      this.hideCalled = true;
      let elapsed = Date.now() - this.startTime;
      if (elapsed >= this.options.minimalLoadingTime) {
        this.hideNow(cb);
      }
    }
  
    hideNow(cb) {
      this.loadingSpinner.remove();
      this.loadingColumns.remove();
      this.loadingText.remove();
        if (typeof cb === 'function') {
            cb();
        }
    }
  }
  