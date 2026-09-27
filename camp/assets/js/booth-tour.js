/* Interactive Booth Tour — clickable hotspots reveal info */
(function () {
    'use strict';

    const SPOTS = {
        'kanahoma-camp': {
            icon: '★',
            label: 'Brand identity',
            title: 'Kanahoma Camp Stories',
            body: 'Our brand system applied to live experience. Block-style layered compositions, mixed typography, and a color palette that travels from screen to physical environment without losing a beat.',
            link: 'See the brand system →'
        },
        'cabin': {
            icon: '⌂',
            label: 'Storytelling stage',
            title: 'The cabin (Camp Kanahoma HQ)',
            body: 'Center of gravity for the booth. The cabin houses our 60" screen for live case study walkthroughs and the lantern-lit table where actual conversations happen. Sit down. Stay a while.',
            link: 'See case studies →'
        },
        'story': {
            icon: '✦',
            label: 'Brand voice',
            title: '"Where results tell the story"',
            body: 'Our positioning, in five words. Performance marketing translated into a campfire ethos: real outcomes, told as real stories, with no hype layer between the work and the result.',
            link: 'Read our manifesto →'
        },
        'claw': {
            icon: 'C',
            label: 'Grab Your Swag',
            title: 'The claw machines',
            body: 'Two real claw machines stocked with Kanahoma merch. The hook (pun intended): every capsule contains either a piece of swag or a one-on-one strategy session. About 80% are swag.',
            link: 'Try the digital version →'
        },
        'gear': {
            icon: 'G',
            label: 'Service offering',
            title: 'Gear Up for Impact',
            body: 'Our three core services made visible — AOR, Brand, Consulting — displayed as gear on the wall. Visitors can pick the right "pack" for their trip and walk away with a service one-pager.',
            link: 'Explore services →'
        },
        'campfire': {
            icon: '🔥',
            label: 'Gathering point',
            title: 'The campfire (and tree stumps)',
            body: 'Center of the booth, by design. The campfire is where we host our daily "Ranger Chats" — 20-minute open-format Q&As on enrollment marketing, with whoever pulls up a stump.',
            link: 'See the chat schedule →'
        }
    };

    const hotspots = document.querySelectorAll('.hotspot');
    const thumbs = document.querySelectorAll('.spot-thumb');
    const panel = document.getElementById('infoPanel');

    function showInfo(key) {
        const spot = SPOTS[key];
        if (!spot) return;

        // Mark active
        hotspots.forEach(h => h.classList.toggle('active', h.dataset.spot === key));
        thumbs.forEach(t => t.classList.toggle('active', t.dataset.spot === key));

        panel.classList.remove('show');
        setTimeout(() => {
            panel.innerHTML = `
                <div class="info-panel-inner">
                    <div class="info-icon">${spot.icon}</div>
                    <div class="info-content">
                        <p class="info-label">${spot.label}</p>
                        <h3 class="info-title">${spot.title}</h3>
                        <p class="info-body">${spot.body}</p>
                        <a href="#" class="info-link">${spot.link}</a>
                    </div>
                </div>
            `;
            panel.classList.add('show');
        }, 180);
    }

    hotspots.forEach((h, i) => {
        h.textContent = i + 1;
        h.addEventListener('click', () => showInfo(h.dataset.spot));
        h.setAttribute('aria-label', SPOTS[h.dataset.spot].title);
    });

    thumbs.forEach(t => {
        t.addEventListener('click', () => showInfo(t.dataset.spot));
    });

    // Start with first hotspot info shown
    showInfo('kanahoma-camp');
})();
