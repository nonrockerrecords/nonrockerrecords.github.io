/* Kanahoma — Newsletter signup behavior */
(function () {
    'use strict';

    const form = document.getElementById('signupForm');
    const success = document.getElementById('signupSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value.trim();
        if (!email) return;

        // In production, this would POST to your ESP (Mailchimp, Klaviyo, etc.)
        success.querySelector('.success-email').textContent = email;
        success.classList.add('show');
        form.style.display = 'none';
    });
})();
