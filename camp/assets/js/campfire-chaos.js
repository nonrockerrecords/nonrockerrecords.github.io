/* Campfire CHAOS — fast fire growth, demons appear at thresholds, screen shake at peak */
(function () {
    'use strict';

    const root  = document.documentElement;
    const scene = document.querySelector('.chaos-scene');
    const demons = document.querySelectorAll('.demon');
    const embersWrap = document.querySelector('.embers');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    // Demon reveal thresholds (scroll progress 0-1)
    const DEMON_THRESHOLDS = [0.25, 0.32, 0.40, 0.48, 0.56, 0.62];

    function updateProgress() {
        const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(window.scrollY / max, 1);

        root.style.setProperty('--fp', progress.toFixed(3));

        // Reveal demons as fire grows
        demons.forEach((d, i) => {
            const threshold = DEMON_THRESHOLDS[i] || 1;
            d.classList.toggle('appear', progress >= threshold);
        });

        // Page shake at peak
        scene.classList.toggle('peak', progress >= 0.75);

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    // ── Generate flying embers ──
    if (embersWrap && !reduceMotion) {
        for (let i = 0; i < 56; i++) {
            const e = document.createElement('div');
            e.className = 'ember';
            e.style.left = `${18 + Math.random() * 64}%`;
            const xd  = `${(Math.random() - 0.5) * 140}px`;
            const xd2 = `${(Math.random() - 0.5) * 340}px`;
            e.style.setProperty('--xd', xd);
            e.style.setProperty('--xd2', xd2);
            e.style.width  = `${2 + Math.random() * 7}px`;
            e.style.height = e.style.width;
            e.style.animation = `emberRise ${1.7 + Math.random() * 3.6}s ease-out infinite`;
            e.style.animationDelay = `${Math.random() * -4}s`;
            embersWrap.appendChild(e);
        }
    }

    updateProgress();
})();
