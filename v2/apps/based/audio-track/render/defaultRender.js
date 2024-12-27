export default function defaultRender(track) {
    const container = document.createElement('div');
    container.className = 'audio-track';
  
    const fileName = document.createElement('p');
    fileName.textContent = track.metadata.fileName || 'No file loaded';
    container.appendChild(fileName);

    const playPauseButton = document.createElement('button');
    playPauseButton.textContent = 'Play';
    playPauseButton.addEventListener('click', () => {
        console.log('playPauseButton clicked', track.isPlaying());
      if (track.isPlaying()) {
        track.pause();
        playPauseButton.textContent = 'Play';
      } else {
        track.play();
        playPauseButton.textContent = 'Pause';
      }
    });
    
    container.appendChild(playPauseButton);
  
    return container;
}