export default function freeze(growthDuration = 3000, holdDuration = 5000, intensity = 3) {
    if ($('body').hasClass('freeze-active')) return;

    const $body = $('body').addClass('freeze-active');
    this.bp.play('v5/apps/based/spellbook/spells/freeze/freeze.mp3');

    const $canvas = $('<canvas>').css({
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 999999
    }).appendTo($body);

    const canvas = $canvas[0];
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startTime = Date.now();
    const totalDuration = growthDuration + holdDuration;
    const frameRate = 1000 / 60;

    // Snow Particles
    const snowCount = 150;
    const snowflakes = Array.from({ length: snowCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        speedY: Math.random() * 1 + 0.5
    }));

    // Crystal Seeds
    const seeds = Array.from({ length: 1111 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        branches: Array.from({ length: 6 }, (_, i) => ({
            x: null, y: null, angle: i * Math.PI / 3 + Math.random() * 0.2,
            maxLength: 80 + Math.random() * 60
        }))
    }));
    seeds.forEach(seed => {
        seed.branches.forEach(b => {
            b.x = seed.x;
            b.y = seed.y;
        });
    });

    function drawSnow() {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        snowflakes.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
            f.y += f.speedY;
            if (f.y > canvas.height) {
                f.y = -10;
                f.x = Math.random() * canvas.width;
            }
        });
    }

    function drawCrystal(br, progress) {
        const steps = Math.floor(br.maxLength * progress);
        let { x, y, angle } = br;
        ctx.strokeStyle = `rgba(230,255,255,${0.4 + progress * 0.3})`;
        ctx.lineWidth = 1 + progress * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 0; i < steps; i++) {
            x += Math.cos(angle) * 1.8;
            y += Math.sin(angle) * 1.8;
            ctx.lineTo(x, y);

            if (i % 15 === 0 && Math.random() < 0.5) {
                const offAngle = angle + (Math.random() - 0.5) * 0.5;
                ctx.moveTo(x, y);
                ctx.lineTo(
                    x + Math.cos(offAngle) * 8 * progress,
                    y + Math.sin(offAngle) * 8 * progress
                );
            }
        }
        ctx.stroke();
    }

    function drawFrame() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / growthDuration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Frosty background
        const frostAlpha = Math.sin(progress * Math.PI) * 0.4;
        ctx.fillStyle = `rgba(180,220,255,${frostAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawSnow();

        const waveX = canvas.width * progress;
        seeds.forEach(seed => {
            if (seed.x < waveX || progress >= 1) {
                const localP = progress < 1
                    ? Math.min((waveX - seed.x) / canvas.width * 2, 1)
                    : 1;
                seed.branches.forEach(br => drawCrystal(br, localP));
            }
        });

        // Shake only during growth
        const shake = (progress < 1 ? intensity * (1 - progress) * 0.15 : 0);
        $body.css({
            position: 'relative',
            transform: `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`
        });

        if (elapsed < totalDuration) {
            setTimeout(drawFrame, frameRate);
        } else {
            this.bp.play('v5/apps/based/spellbook/spells/freeze/shatter.mp3');
            $canvas.remove();
            $body.css({ transform: 'translate(0,0)', position: '' })
                .removeClass('freeze-active');
        }
    }

    drawFrame();
}
