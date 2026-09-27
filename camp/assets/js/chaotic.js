/* Kanahoma — Chaotic page behavior
   Random tile rotations + parallax wiggle on scroll
*/
(function () {
    'use strict';

    // Randomize tile rotation slightly on load to keep it fresh each visit
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const baseRotation = parseFloat(getComputedStyle(tile).transform === 'none' ? 0 :
            Math.atan2(
                parseFloat(getComputedStyle(tile).transform.split(',')[1] || 0),
                parseFloat(getComputedStyle(tile).transform.split('(')[1] || 1)
            ) * 180 / Math.PI) || 0;
        const jitter = (Math.random() - 0.5) * 1.5;
        const finalRotation = baseRotation + jitter;
        tile.style.setProperty('--r', `${finalRotation}deg`);
    });

    // Floating shapes – assign random animation delay so they don't all bob together
    document.querySelectorAll('.shape').forEach(shape => {
        shape.style.animationDelay = `${Math.random() * -8}s`;
    });

    // Easter egg: clicking the wordmark spins everything
    const wordmark = document.querySelector('.chaos-wordmark');
    if (wordmark) {
        wordmark.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.transition = 'transform 1s cubic-bezier(.4,1.6,.4,1)';
            document.body.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                document.body.style.transition = '';
                document.body.style.transform = '';
            }, 1000);
        });
    }

    // Cursor sparkle trail (lightweight)
    let lastSpark = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSpark < 80) return;
        lastSpark = now;

        const spark = document.createElement('div');
        spark.textContent = ['★', '✦', '✧'][Math.floor(Math.random() * 3)];
        spark.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            color: #D9AB4D;
            font-size: ${10 + Math.random() * 8}px;
            pointer-events: none;
            z-index: 9999;
            transition: all .8s ease-out;
            opacity: 1;
        `;
        document.body.appendChild(spark);
        requestAnimationFrame(() => {
            spark.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${20 + Math.random() * 30}px)`;
            spark.style.opacity = '0';
        });
        setTimeout(() => spark.remove(), 800);
    });
})();
