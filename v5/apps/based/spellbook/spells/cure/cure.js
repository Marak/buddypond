export default function cure(pulses = [], intensity = 2) {
  if ($('body').hasClass('cure-active')) return;


  pulses = [{ time: 100, duration: 1400 },   // First flash
  { time: 1500, duration: 1500 },  // Second flash
  { time: 2900, duration: 3500 }]   // Third flash

  const $body = $('body');
  $body.addClass('cure-active');
  this.bp.play('v5/apps/based/spellbook/spells/cure/cure.mp3');

  const $overlay = $('<div>').css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(200, 230, 255, 0.6) 60%, rgba(180, 220, 255, 0.3) 90%, rgba(255, 255, 255, 0) 100%)',
    opacity: 0,
    transform: 'scale(0.8)',
    pointerEvents: 'none',
    zIndex: 9999
  }).appendTo($body);

  const frameRate = 1000 / 60;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;

    // Find the first active pulse, if any
    let activePulse = null;
    for (let i = 0; i < pulses.length; i++) {
      const { time, duration } = pulses[i];
      if (elapsed >= time && elapsed <= time + duration) {
        activePulse = { index: i, time, duration };
        break;
      }
    }

    const endOfLastPulse = Math.max(...pulses.map(p => p.time + p.duration));

    if (elapsed <= endOfLastPulse) {
      if (activePulse) {
        const { index, time, duration } = activePulse;
        const pulseProgress = (elapsed - time) / duration;
        const pulseStrength = Math.sin(pulseProgress * Math.PI); // fade in/out

        const baseOpacity = 0.4 + index * 0.2;
        const opacity = baseOpacity * pulseStrength;
        const scale = 1 + pulseStrength * 1.5;

        $overlay.css({
          transform: `scale(${scale})`,
          opacity: opacity
        });

        // Gentle shimmer
        const shakeIntensity = intensity * (1 - pulseProgress) * 0.3;
        const offsetX = (Math.random() - 0.5) * shakeIntensity * 2;
        const offsetY = (Math.random() - 0.5) * shakeIntensity * 2;

        $body.css({
          position: 'relative',
          transform: `translate(${offsetX}px, ${offsetY}px)`
        });
      } else {
        $overlay.css({ opacity: 0 });
        $body.css({ transform: 'translate(0, 0)' });
      }

      setTimeout(animate, frameRate);
    } else {
      $overlay.remove();
      $body.css({
        transform: 'translate(0, 0)',
        position: ''
      }).removeClass('cure-active');
    }
  }

  animate();
}
