/* Kanahoma - Grab Your Swag claw machine
   Orchestrates the claw animation sequence on form submit.
*/
(function () {
    'use strict';

    const machine = document.querySelector('.claw-machine');
    const form = document.getElementById('clawForm');
    const input = document.getElementById('clawEmail');
    const button = document.getElementById('clawLever');
    const hint = document.getElementById('clawHint');
    const toast = document.getElementById('clawToast');

    if (!machine || !form) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CAPSULE_COLORS = ['#D9AB4D', '#C96E43', '#F6F2EE', '#C3A98E', '#2F4936'];

    machine.dataset.state = 'idle';

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());

    function randomizeCapsuleColor() {
        const color = CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)];
        const grabbed = machine.querySelector('.grabbed-capsule circle:first-child');
        const delivered = machine.querySelector('.delivered-capsule circle:first-child');

        if (grabbed) grabbed.setAttribute('fill', color);
        if (delivered) delivered.setAttribute('fill', color);

        const isLight = ['#F6F2EE', '#C3A98E', '#D9AB4D'].includes(color);
        const textFill = isLight ? '#1a2e22' : '#F6F2EE';
        machine.querySelectorAll('.delivered-capsule text').forEach((node) => {
            node.setAttribute('fill', textFill);
        });
    }

    function showToast(email) {
        if (!toast) return;

        const name = email.split('@')[0] || 'camper';
        toast.textContent = `You grabbed the free-item code, ${name}. Welcome to camp.`;
        toast.classList.add('show');
    }

    function lockForm() {
        button.disabled = true;
        input.disabled = true;
    }

    async function runSequence(email) {
        lockForm();
        randomizeCapsuleColor();

        if (prefersReducedMotion) {
            machine.dataset.state = 'delivered';
            showToast(email);
            hint.textContent = 'your free-item code is ready.';
            return;
        }

        hint.textContent = 'lowering the claw...';
        machine.dataset.state = 'dropping';
        await wait(1100);

        hint.textContent = 'grabbing your swag...';
        machine.dataset.state = 'grabbing';
        await wait(550);

        hint.textContent = 'incoming!';
        machine.dataset.state = 'lifting';
        await wait(1100);

        machine.dataset.state = 'traversing';
        await wait(950);

        machine.dataset.state = 'releasing';
        await wait(700);

        machine.dataset.state = 'delivered';
        showToast(email);
        hint.textContent = 'your free-item code is ready.';

        // In production, POST the email to the ESP before revealing the code.
        // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = input.value.trim();

        if (!isValidEmail(email)) {
            input.focus();
            input.style.borderColor = '#ff6b6b';
            hint.textContent = 'enter a valid email to grab your swag.';
            hint.style.color = '#ff9b9b';
            setTimeout(() => {
                input.style.borderColor = '';
                hint.style.color = '';
                hint.textContent = 'one email = one shot.';
            }, 2400);
            return;
        }

        runSequence(email);
    });

    if (hint && !hint.textContent.trim()) {
        hint.textContent = 'one email = one shot.';
    }
})();
