export default function barrelRoll({
    spins = 1,
    direction = 'clockwise',
    rotationSpeed = 1, // Seconds per full rotation
  } = {}) {
    // Prevent multiple barrel rolls
    if (document.body.classList.contains('barrelroll-active')) return;
  
    // Add barrelroll class to body
    const body = document.body;
    body.classList.add('barrelroll-active');
  
    // Calculate total duration (ms) based on spins and rotation speed
    const totalDuration = spins * rotationSpeed * 1000;
  
    // Create and inject CSS for rotation animation
    const style = document.createElement('style');
    style.textContent = `
      .barrelroll-active {
        transform-origin: center center;
        animation: barrelRoll ${totalDuration}ms linear forwards;
      }
      @keyframes barrelRoll {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(${direction === 'clockwise' ? spins * 360 : -spins * 360}deg);
        }
      }
    `;
    document.head.appendChild(style);
    this.bp.play('v5/apps/based/spellbook/spells/barrelRoll/barrelRoll.mp3');


  
    // Cleanup after animation
    setTimeout(() => {
      body.classList.remove('barrelroll-active');
      body.style.transform = 'none';
      style.remove();
    }, totalDuration);
  }