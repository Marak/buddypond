export default function updateProfilePicture(event, profilePictureImg) {
  const file = event.target.files[0];
  const profilePictureInput = event.target;
  const statusElement = document.querySelector('.aim-profile-picture-upload-status');
  const statusText = statusElement.querySelector('.status-text');

  // Helper function to update status
  const updateStatus = (text, state) => {
    statusElement.classList.remove('uploading', 'success', 'error', 'hidden');
    statusText.textContent = text;
    statusElement.classList.add(state);
    statusElement.style.display = 'block';
  };

  // Helper function to hide status after delay
  const hideStatusAfterDelay = (delay = 3000) => {
    setTimeout(() => {
      statusElement.classList.add('hidden');
      statusElement.style.display = 'none';
    }, delay);
  };

  if (file) {
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      updateStatus('Please select a valid image file (JPEG, PNG, or GIF).', 'error');
      profilePictureInput.value = ''; // Clear the input
      hideStatusAfterDelay();
      return;
    }

    // Load and resize image
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = async () => {
        // Resize image to 128x128 using Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(128 / img.width, 128 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (128 - scaledWidth) / 2;
        const offsetY = (128 - scaledHeight) / 2;

        // Draw scaled image on canvas
        ctx.fillStyle = 'white'; // Optional: white background for transparency
        ctx.fillRect(0, 0, 128, 128);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Convert canvas to blob (JPEG for compression)
        try {
          const blob = await new Promise((resolve) => {
            canvas.toBlob(
              (blob) => resolve(blob),
              'image/jpeg',
              0.8 // JPEG quality (0.8 balances size and quality)
            );
          });

          // Validate resized file size (300KB = 300 * 1024 bytes)
          const maxSize = 300 * 1024;
          if (blob.size > maxSize) {
            updateStatus('Resized image exceeds 300KB. Please choose a smaller image.', 'error');
            profilePictureInput.value = ''; // Clear the input
            hideStatusAfterDelay();
            return;
          }

          // Show preview
          const previewUrl = URL.createObjectURL(blob);
          profilePictureImg.src = previewUrl;

          // Create a new img element inside .aim-profile-picture-preview
          const previewImg = document.createElement('img');
          previewImg.src = previewUrl;
          previewImg.classList.add('aim-profile-picture-img');
          const profilePicturePreview = document.querySelector('.aim-profile-picture-preview');
          profilePicturePreview.innerHTML = ''; // Clear previous preview
          profilePicturePreview.appendChild(previewImg);

          // Proceed with upload
          updateStatus('Uploading...', 'uploading');
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          try {
            let onProgress = (progress) => {
              // Assuming progress is a value between 0 and 1
              const percentage = Math.round(progress * 100);
              updateStatus(`Uploading: ${percentage}%`, 'uploading');
            };


            // prefix '/profile-pics/' to the file path
            resizedFile.filePath = '/profile-pics/' + resizedFile.name;

            console.log('Uploading file:', resizedFile);

            let url;
            try {
              url = await buddypond.uploadFile(resizedFile, onProgress);
              console.log('File uploaded to:', url);
              updateStatus('Upload complete!', 'success');
              hideStatusAfterDelay();

            } catch (err) {
              console.error('Error uploading file:', err);
              updateStatus('Upload failed: ' + err.message, 'error');
              return;
            }

            //let url = 'https://files.buddypond.com/Jane/profile-pics/terry-called.jpg';
            console.log('File uploaded to:', url);

            // Now we call updateProfile to update the profile picture
            await this.bp.apps.client.api.updateProfile(this.bp.me, {
              profilePicture : url
            });

            // set the local profile state ( for use in sending messages)
            this.bp.apps.buddylist.data.profileState.profilePicture = url;

            /*
            // Simulate upload for testing (remove when real upload is implemented)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            onProgress(0.5); // Simulate 50% progress
            await new Promise((resolve) => setTimeout(resolve, 1000));
            onProgress(1); // Simulate 100% progress
            */


            // Stub for uploading profile picture API call
            // await this.bp.apps.client.api.uploadProfilePicture(resizedFile);
          } catch (error) {
            console.error('Upload error:', error);
            updateStatus('Upload failed. Please try again.', 'error');
            hideStatusAfterDelay();
          }

          // Clean up (only revoke if not needed for persistent preview)
          // URL.revokeObjectURL(previewUrl);
        } catch (error) {
          console.error('Error processing image:', error);
          updateStatus('Error processing image. Please try again.', 'error');
          profilePictureInput.value = ''; // Clear the input
          hideStatusAfterDelay();
        }
      };
      img.onerror = () => {
        updateStatus('Failed to load image. Please select a valid image file.', 'error');
        profilePictureInput.value = ''; // Clear the input
        hideStatusAfterDelay();
      };
    };
    reader.readAsDataURL(file);
  }
}