export default class FileUploadOverlay {
    constructor(uploadFn) {
      this.files = [];
      this.initializeElements();
      this.bindEvents();
      this.uploadFn = uploadFn;
    }
  
    initializeElements() {
      this.overlay = document.querySelector('.bp-file-explorer-upload-overlay');
      this.filesList = document.querySelector('.bp-file-explorer-upload-files-list');
      this.totalSize = document.querySelector('.bp-file-explorer-total-size');
      this.uploadButton = document.querySelector('.bp-file-explorer-upload-start');
      this.cancelButton = document.querySelector('.bp-file-explorer-upload-cancel');
      this.progressContainer = document.querySelector('.bp-file-explorer-upload-progress-container');
      this.progressBar = document.querySelector('.bp-file-explorer-upload-progress-bar');
      this.progressPercentage = document.querySelector('.bp-file-explorer-upload-progress-percentage');
      this.currentFile = document.querySelector('.bp-file-explorer-current-file');
      this.fileCount = document.querySelector('.bp-file-explorer-file-count');
    }
  
    bindEvents() {
      this.uploadButton.addEventListener('click', () => this.startUpload());
      this.cancelButton.addEventListener('click', () => this.hide());
    }
  
    show(files) {
      this.files = Array.from(files);
      this.overlay.style.display = 'flex';
      this.renderFiles();
      this.updateTotalSize();
    }
  
    hide() {
      this.overlay.style.display = 'none';
      this.progressContainer.style.display = 'none';
      this.files = [];
      this.filesList.innerHTML = '';
    }
  
    formatSize(bytes) {
      const sizes = ['B', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 B';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }
  
    renderFiles() {
      this.filesList.innerHTML = this.files.map((file, index) => `
        <div class="bp-file-explorer-upload-file-item">
          <div class="bp-file-explorer-upload-column-name">${file.name}</div>
          <div class="bp-file-explorer-upload-column-size">${this.formatSize(file.size)}</div>
          <div class="bp-file-explorer-upload-column-status">Pending</div>
        </div>
      `).join('');
    }
  
    updateTotalSize() {
      const totalBytes = this.files.reduce((acc, file) => acc + file.size, 0);
      this.totalSize.textContent = this.formatSize(totalBytes);
    }
  
    async startUpload() {
      this.uploadButton.disabled = true;
      this.progressContainer.style.display = 'block';
      
      let uploadedFiles = 0;
      let totalProgress = 0;
  
      for (const file of this.files) {
        uploadedFiles++;
        this.currentFile.textContent = file.name;
        this.fileCount.textContent = `(File ${uploadedFiles} of ${this.files.length})`;
  
        try {
          // Simulated upload progress
          await this.uploadFile(file, (progress) => {
            const fileProgress = progress / this.files.length;
            totalProgress = ((uploadedFiles - 1) / this.files.length) + fileProgress;
            this.updateProgress(totalProgress * 100);
          });
        } catch (error) {
          console.error('Upload failed:', error);
          // Handle error appropriately
        }
      }
  
      // Upload complete
      setTimeout(() => {
        this.hide();
        // Trigger any necessary refresh of the file explorer
      }, 1000);
    }
  
    async uploadFile(file, onProgress) {
      // This is a placeholder for your actual upload implementation
      // Replace this with your actual upload logic

      return this.uploadFn(file, onProgress);

      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.1;
          onProgress(progress);
          if (progress >= 1) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }
  
    updateProgress(percentage) {
      const roundedPercentage = Math.min(100, Math.round(percentage));
      this.progressBar.style.width = `${roundedPercentage}%`;
      this.progressPercentage.textContent = `${roundedPercentage}%`;
    }
  }
  
  /*
  // Usage:
  const uploadOverlay = new FileUploadOverlay();
  
  // When files are dropped:
  function handleFileDrop(event) {
    const files = event.dataTransfer.files;
    uploadOverlay.show(files);
  }
    */