/* Campfire grows with scroll — binds page scroll progress to CSS vars */
(function () {
    'use strict';

    const root = document.documentElement;
    let ticking = false;

    function updateProgress() {
        const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(window.scrollY / max, 1);

        // Fire scale grows from .35 to ~1.4
        const fireScale = 0.35 + progress * 1.05;

        root.style.setProperty('--fire-progress', progress.toFixed(3));
        root.style.setProperty('--fire-scale', fireScale.toFixed(3));

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    updateProgress();
})();
