/* Morning Light / Campfire toggle */
(function () {
    'use strict';

    const toggle = document.getElementById('dnToggle');
    const orb    = toggle.querySelector('.dn-toggle-orb');
    const label  = toggle.querySelector('.dn-toggle-label');

    // Day-mode SVG colors → night-mode SVG colors
    const SCENE = {
        day: {
            sky:    '#87a89c',
            sky2:   '#b0c4b1',
            sun:    '#D9AB4D',
            sunGlow:'#F6F2EE',
            mtn1:   '#5a7a64',
            mtn2:   '#4a6855',
            mtn3:   '#3a5644',
            ground: '#4f6a52',
            tree:   '#3a5644'
        },
        night: {
            sky:    '#050a07',
            sky2:   '#1a2e22',
            sun:    '#F6F2EE',     // moon
            sunGlow:'#D9AB4D',
            mtn1:   '#162819',
            mtn2:   '#1e3320',
            mtn3:   '#263d2c',
            ground: '#2f4936',
            tree:   '#0d1f15'
        }
    };

    function applyScene(mode) {
        const c = SCENE[mode];
        // Update SVG element fills
        document.querySelectorAll('.dn-bg [data-fill]').forEach(el => {
            const key = el.dataset.fill;
            if (c[key]) el.setAttribute('fill', c[key]);
        });

        // Stars: visible only at night
        document.querySelectorAll('.dn-bg .star').forEach(el => {
            el.style.transition = 'opacity 1s ease';
            el.style.opacity = mode === 'night' ? '.85' : '0';
        });

        // Campfire glow: only at night
        document.querySelectorAll('.dn-bg .campfire-night').forEach(el => {
            el.style.transition = 'opacity 1s ease';
            el.style.opacity = mode === 'night' ? '1' : '0';
        });
    }

    function setMode(mode) {
        if (mode === 'night') {
            document.body.classList.add('night');
            label.textContent = '★ Morning Light';
        } else {
            document.body.classList.remove('night');
            label.textContent = '★ Campfire';
        }
        applyScene(mode);
        try { localStorage.setItem('kanahomaMode', mode); } catch (e) {}
    }

    toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('night') ? 'day' : 'night';
        setMode(next);
    });

    // Restore preference
    let saved = 'day';
    try { saved = localStorage.getItem('kanahomaMode') || 'day'; } catch (e) {}
    setMode(saved);
})();
