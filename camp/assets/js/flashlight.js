/* Flashlight cursor + werewolf jump scare */
(function () {
    'use strict';

    const root = document.documentElement;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let raf = null;

    function update() {
        root.style.setProperty('--mx', `${mx}px`);
        root.style.setProperty('--my', `${my}px`);
        checkWerewolf();
        raf = null;
    }

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mx = e.touches[0].clientX;
            my = e.touches[0].clientY;
            if (!raf) raf = requestAnimationFrame(update);
        }
    }, { passive: true });

    // ── Flashlight on/off ──
    const toggle = document.getElementById('flToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const isOff = document.body.classList.toggle('flashlight-off');
            toggle.classList.toggle('off', isOff);
            toggle.textContent = isOff ? 'Turn flashlight on' : 'Turn flashlight off';
        });
    }

    // ── WEREWOLF JUMP SCARE ──
    const werewolf       = document.getElementById('werewolf');
    const werewolfEyes   = document.getElementById('werewolfEyes');
    const scareFlash     = document.getElementById('scareFlash');
    const scareToast     = document.getElementById('scareToast');
    let scared = false;

    function getWerewolfCenter() {
        // Compute center of the werewolf eyes element in viewport coords
        if (!werewolfEyes) return null;
        const r = werewolfEyes.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function checkWerewolf() {
        if (scared || !werewolfEyes) return;
        const c = getWerewolfCenter();
        if (!c) return;
        const d = Math.hypot(mx - c.x, my - c.y);

        // Warn — eyes go red and widen — as user gets close
        if (d < 160 && d >= 70) {
            werewolfEyes.classList.add('warned');
        } else if (d >= 160) {
            werewolfEyes.classList.remove('warned');
        }

        // Trigger scare on close proximity
        if (d < 70) {
            triggerScare();
        }
    }

    function triggerScare() {
        if (scared) return;
        scared = true;

        // Hide decoy eyes — werewolf takes over
        werewolfEyes.style.opacity = '0';

        // Big visual: red flash + body shake + werewolf appearance
        scareFlash.classList.add('flash');
        document.body.classList.add('scared');
        werewolf.classList.add('scare');

        // Light haptic feedback if available (mobile)
        if (navigator.vibrate) {
            try { navigator.vibrate([100, 50, 200]); } catch (e) {}
        }

        setTimeout(() => {
            document.body.classList.remove('scared');
            scareToast.classList.add('show');
        }, 700);

        // After a moment, fade the werewolf back into the dark
        setTimeout(() => {
            werewolf.style.transition = 'opacity 1.5s ease-out';
            werewolf.style.opacity = '0';
            scareToast.classList.remove('show');
            // Allow rescare after 8s cooldown
            setTimeout(() => {
                scared = false;
                werewolf.classList.remove('scare');
                werewolf.style.transition = '';
                werewolf.style.opacity = '';
                werewolfEyes.style.opacity = '';
                werewolfEyes.classList.remove('warned');
                scareFlash.classList.remove('flash');
            }, 8000);
        }, 4000);
    }

    update();
})();
