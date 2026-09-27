/* Campfire Stories — sticky visual swaps based on scroll position */
(function () {
    'use strict';

    const sections = document.querySelectorAll('.story-section');
    const stages   = document.querySelectorAll('.stage-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                const target = entry.target.dataset.stage;
                stages.forEach(s => s.classList.toggle('active', s.dataset.stage === target));
            }
        });
    }, { threshold: [0, 0.4, 0.6, 1] });

    sections.forEach(s => observer.observe(s));

    // Default: show first stage
    if (stages[0]) stages[0].classList.add('active');
})();
