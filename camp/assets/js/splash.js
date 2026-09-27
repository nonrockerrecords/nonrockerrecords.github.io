(function () {
    'use strict';

    const form = document.getElementById('campSignup');
    const email = document.getElementById('email');
    const note = document.getElementById('formNote');
    const codeCard = document.getElementById('codeCard');
    const copyButton = document.getElementById('copyCode');
    const storeCode = document.getElementById('storeCode');
    const STORE_CODE = 'CAMPFREE';

    if (!form || !email || !note || !codeCard) return;

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!isValidEmail(email.value)) {
            note.textContent = 'Enter a valid email address to unlock the store code.';
            note.classList.add('error');
            email.focus();
            return;
        }

        note.classList.remove('error');
        note.textContent = 'You are on the list. Use the code below for one free store item.';
        if (storeCode) storeCode.textContent = STORE_CODE;
        codeCard.hidden = false;
        form.querySelector('button').textContent = 'Unlocked';
        form.querySelector('button').disabled = true;
        email.disabled = true;

        // Production hook: POST email.value to the newsletter ESP before revealing the code.
        // Keep the reveal fast, but gate STORE_CODE behind a successful subscribe response.
    });

    if (copyButton && storeCode) {
        copyButton.addEventListener('click', async () => {
            const code = storeCode.textContent.trim();

            try {
                await navigator.clipboard.writeText(code);
                copyButton.textContent = 'Copied';
            } catch (error) {
                const range = document.createRange();
                range.selectNode(storeCode);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                copyButton.textContent = 'Selected';
            }

            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 1800);
        });
    }
})();
