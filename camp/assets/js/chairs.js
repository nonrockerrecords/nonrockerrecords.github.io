/* Pull Up a Chair — testimonial carousel */
(function () {
    'use strict';

    const TESTIMONIALS = [
        {
            quote: "Kanahoma transformed how we think about enrollment marketing. Their team brought a level of strategic rigor and creative execution we hadn't seen from any previous agency.",
            initials: "SM",
            name: "Sarah Mitchell",
            role: "VP of Enrollment, Pinecrest University",
            result: "↑ 42% application volume"
        },
        {
            quote: "We've worked with five agencies in seven years. Kanahoma is the first one that felt like a real partner rather than a vendor. They show up, do the work, and own the outcomes.",
            initials: "JK",
            name: "Jessica Kane",
            role: "CMO, Beacon Institute",
            result: "3yr AOR partnership"
        },
        {
            quote: "Their go-to-market consulting helped us reframe our entire positioning. Six months in, our application volume is up 38% year over year.",
            initials: "TC",
            name: "Thomas Chen",
            role: "President, Westridge College",
            result: "↑ 38% YoY apps"
        },
        {
            quote: "It's the only agency newsletter I actually open. Most are recycled blog posts — Kanahoma consistently teaches me something I can put to work the same day.",
            initials: "DR",
            name: "David Reyes",
            role: "Director of Marketing, Mountainview ISD",
            result: "Loyal subscriber, 2yr"
        }
    ];

    const buttons = document.querySelectorAll('.stump-btn');
    const card = document.getElementById('testimonialCard');
    const quoteEl = card.querySelector('.testimonial-quote');
    const avatarEl = card.querySelector('.author-avatar');
    const nameEl = card.querySelector('.author-meta strong');
    const roleEl = card.querySelector('.author-meta span');
    const resultEl = card.querySelector('.testimonial-result-text');

    function showTestimonial(index) {
        const t = TESTIMONIALS[index];

        // Reset pressed states
        buttons.forEach((b, i) => b.setAttribute('aria-pressed', i === index ? 'true' : 'false'));

        // Animate out, swap content, animate in
        card.classList.remove('show');
        setTimeout(() => {
            quoteEl.textContent = `"${t.quote}"`;
            avatarEl.textContent = t.initials;
            nameEl.textContent = t.name;
            roleEl.textContent = t.role;
            resultEl.textContent = t.result;
            card.classList.add('show');
        }, 220);
    }

    buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => showTestimonial(i));
        btn.setAttribute('aria-label', `Hear from ${TESTIMONIALS[i].name}`);
    });

    // Show the first one by default
    showTestimonial(0);

    // Auto-advance every 8s if user hasn't clicked recently
    let lastInteraction = Date.now();
    buttons.forEach(b => b.addEventListener('click', () => { lastInteraction = Date.now(); }));

    setInterval(() => {
        if (Date.now() - lastInteraction < 6000) return;
        const current = Array.from(buttons).findIndex(b => b.getAttribute('aria-pressed') === 'true');
        const next = (current + 1) % TESTIMONIALS.length;
        showTestimonial(next);
    }, 6500);
})();
