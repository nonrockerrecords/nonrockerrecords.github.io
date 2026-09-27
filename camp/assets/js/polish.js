/* Polish demos — count-up + floating CTA reveal + twinkling stars */
(function () {
    'use strict';

    // ── Count-up stats ──
    function countUp(el, target, duration = 1800, suffix = '') {
        const start = performance.now();
        const initial = 0;
        function frame(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            const value = Math.floor(initial + (target - initial) * eased);
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(frame);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(frame);
    }

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.counted) {
                const target = parseInt(e.target.dataset.target, 10);
                const suffix = e.target.dataset.suffix || '';
                e.target.dataset.counted = '1';
                countUp(e.target, target, 1800, suffix);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.countup-num').forEach(el => countObserver.observe(el));

    // ── Twinkling stars in footer (generated, randomized) ──
    const starWrap = document.querySelector('.twinkle-stars');
    if (starWrap) {
        const chars = ['★', '✦', '✧', '·'];
        for (let i = 0; i < 30; i++) {
            const s = document.createElement('span');
            s.className = 'twinkle-star';
            s.textContent = chars[Math.floor(Math.random() * chars.length)];
            s.style.left = `${Math.random() * 100}%`;
            s.style.top = `${Math.random() * 100}%`;
            s.style.animationDelay = `${Math.random() * -3}s`;
            s.style.animationDuration = `${2.5 + Math.random() * 2}s`;
            s.style.fontSize = `${8 + Math.random() * 8}px`;
            starWrap.appendChild(s);
        }
    }

    // ── Floating CTA reveal on scroll ──
    const fab = document.getElementById('floatingCta');
    if (fab) {
        window.addEventListener('scroll', () => {
            fab.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
    }
})();
