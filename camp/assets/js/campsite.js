/* Build Your Campsite — service recommender quiz */
(function () {
    'use strict';

    const QUESTIONS = [
        {
            step: "Step 1 of 3",
            question: "What kind of trip are you on?",
            options: [
                { icon: "↑", label: "Enrollment crisis",      desc: "Numbers are down. Need to move the needle, fast.",            weight: { aor: 3, brand: 1, consulting: 2 } },
                { icon: "★", label: "Brand refresh",           desc: "Identity feels dated or off-key. Time to retell the story.", weight: { aor: 2, brand: 4, consulting: 1 } },
                { icon: "→", label: "Steady growth",           desc: "Things are working. Need an engine to scale.",                weight: { aor: 4, brand: 2, consulting: 1 } },
                { icon: "?", label: "Just exploring",          desc: "Curious what a partnership could look like.",                 weight: { aor: 1, brand: 2, consulting: 3 } }
            ]
        },
        {
            step: "Step 2 of 3",
            question: "How long are you planning to stay?",
            options: [
                { icon: "▸", label: "One specific project",     desc: "A defined scope, a clear timeline.",                weight: { aor: 1, brand: 3, consulting: 4 } },
                { icon: "≡", label: "Multi-year partnership",   desc: "Looking for an embedded long-term team.",            weight: { aor: 5, brand: 1, consulting: 1 } },
                { icon: "↻", label: "Annual campaign cycle",    desc: "Recurring enrollment seasons, repeatable systems.", weight: { aor: 4, brand: 2, consulting: 2 } },
                { icon: "•", label: "Not sure yet",             desc: "Want to start small and see how it goes.",           weight: { aor: 2, brand: 2, consulting: 3 } }
            ]
        },
        {
            step: "Step 3 of 3",
            question: "What's already in your pack?",
            options: [
                { icon: "✕", label: "Starting from scratch",     desc: "No in-house team, no existing agency.",         weight: { aor: 5, brand: 2, consulting: 1 } },
                { icon: "▣", label: "In-house marketing team",   desc: "Have a team — need expert reinforcements.",     weight: { aor: 2, brand: 3, consulting: 4 } },
                { icon: "▤", label: "An existing agency",        desc: "Have a partner — exploring an upgrade.",         weight: { aor: 4, brand: 3, consulting: 2 } },
                { icon: "✦", label: "Just leadership + vision",  desc: "Need someone to translate strategy into work.", weight: { aor: 3, brand: 3, consulting: 3 } }
            ]
        }
    ];

    const RESULTS = {
        aor: {
            icon: "A",
            eyebrow: "Recommended for you",
            title: "Pitch a tent — let's build an Agency of Record partnership.",
            desc: "Based on your answers, you'll get the most value from a deep, embedded partnership. We'll function as an integrated extension of your team — strategy, creative, media, analytics — all accountable to one set of enrollment outcomes.",
            points: [
                "Full-service: strategy, creative, media buying, analytics",
                "Stitched into your enrollment calendar and reporting cycles",
                "Senior team you'll know by first name, available year-round",
                "Performance commitments built into the engagement"
            ]
        },
        brand: {
            icon: "B",
            eyebrow: "Recommended for you",
            title: "Lay the foundation — start with Brand.",
            desc: "Your answers point toward needing brand-level clarity before campaign-level execution. We'll start by sharpening positioning and identity, then translate it into campaigns that actually move the needle on enrollment.",
            points: [
                "Positioning workshops and stakeholder interviews",
                "Identity systems built to scale across channels",
                "Enrollment campaigns that flow from the brand strategy",
                "Brand guidelines your in-house team can run with"
            ]
        },
        consulting: {
            icon: "C",
            eyebrow: "Recommended for you",
            title: "Pack light — Strategic Consulting is the right first step.",
            desc: "Based on your answers, you'd benefit most from a focused expert engagement. We'll diagnose, advise, and deliver a sharp set of recommendations — without the commitment of a full agency partnership.",
            points: [
                "Defined scope, weeks not months",
                "Go-to-market plans, audits, or positioning sprints",
                "Deliverables your team can execute against immediately",
                "Easy to expand into a deeper engagement later"
            ]
        }
    };

    const card     = document.getElementById('quizCard');
    const result   = document.getElementById('quizResult');
    const progress = document.getElementById('quizProgress');
    const stepEl   = card.querySelector('.cs-step');
    const qEl      = card.querySelector('.cs-question');
    const optsEl   = card.querySelector('.cs-options');
    const backBtn  = card.querySelector('.cs-back');
    const nextBtn  = card.querySelector('.cs-next');

    let current = 0;
    let answers = [null, null, null];

    function renderProgress() {
        progress.innerHTML = '';
        QUESTIONS.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'cs-progress-dot';
            if (i < current) dot.classList.add('done');
            if (i === current) dot.classList.add('current');
            progress.appendChild(dot);
        });
    }

    function renderQuestion() {
        const q = QUESTIONS[current];
        stepEl.textContent = q.step;
        qEl.textContent = q.question;
        optsEl.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'cs-option';
            btn.setAttribute('type', 'button');
            btn.innerHTML = `
                <span class="cs-option-icon">${opt.icon}</span>
                <span class="cs-option-label">${opt.label}<span class="cs-option-desc">${opt.desc}</span></span>
            `;
            if (answers[current] === i) btn.classList.add('selected');
            btn.addEventListener('click', () => {
                answers[current] = i;
                optsEl.querySelectorAll('.cs-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                nextBtn.disabled = false;
            });
            optsEl.appendChild(btn);
        });

        backBtn.disabled = current === 0;
        nextBtn.disabled = answers[current] === null;
        nextBtn.textContent = current === QUESTIONS.length - 1 ? 'See My Camp →' : 'Next →';
        renderProgress();
    }

    function computeResult() {
        const score = { aor: 0, brand: 0, consulting: 0 };
        answers.forEach((ansIdx, qIdx) => {
            const weight = QUESTIONS[qIdx].options[ansIdx].weight;
            score.aor += weight.aor;
            score.brand += weight.brand;
            score.consulting += weight.consulting;
        });
        // Pick max
        let best = 'aor', bestScore = score.aor;
        if (score.brand > bestScore) { best = 'brand'; bestScore = score.brand; }
        if (score.consulting > bestScore) { best = 'consulting'; bestScore = score.consulting; }
        return RESULTS[best];
    }

    function showResult() {
        const r = computeResult();
        result.innerHTML = `
            <div class="cs-result-icon">${r.icon}</div>
            <div class="cs-result-eyebrow">${r.eyebrow}</div>
            <h2 class="cs-result-title">${r.title.replace(/(Agency of Record|Brand|Strategic Consulting)/, '<span class="script">$1</span>')}</h2>
            <p class="cs-result-desc">${r.desc}</p>
            <div class="cs-result-points">
                <h4>What's included</h4>
                <ul>${r.points.map(p => `<li>${p}</li>`).join('')}</ul>
            </div>
            <div class="cs-result-buttons">
                <a href="mailto:hello@kanahoma.com" class="cs-result-primary">Pitch a Tent Here →</a>
                <a href="index.html" class="cs-result-secondary">Back to Site</a>
            </div>
            <button class="cs-restart">Start over</button>
        `;
        card.style.display = 'none';
        result.classList.add('show');
        progress.style.display = 'none';

        result.querySelector('.cs-restart').addEventListener('click', restart);
    }

    function restart() {
        current = 0;
        answers = [null, null, null];
        result.classList.remove('show');
        card.style.display = 'flex';
        progress.style.display = 'flex';
        renderQuestion();
    }

    backBtn.addEventListener('click', () => {
        if (current > 0) { current--; renderQuestion(); }
    });

    nextBtn.addEventListener('click', () => {
        if (answers[current] === null) return;
        if (current < QUESTIONS.length - 1) {
            current++;
            renderQuestion();
        } else {
            showResult();
        }
    });

    renderQuestion();
})();
