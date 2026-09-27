/* Tell Us Your Story — reverse pitch form */
(function () {
    'use strict';

    const PROMPTS = [
        "We're trying to grow enrollment by…",
        "Our brand feels off because…",
        "Last year we tried… and it didn't work.",
        "What we really want is…",
        "If money weren't an issue, we'd…",
        "The thing nobody tells us is…"
    ];

    const form     = document.getElementById('ysForm');
    const instInput = document.getElementById('ysInstitution');
    const storyInput = document.getElementById('ysStory');
    const counter  = document.getElementById('ysCounter');
    const submit   = document.getElementById('ysSubmit');
    const success  = document.getElementById('ysSuccess');
    const promptsRow = document.getElementById('ysPrompts');

    // Render prompt chips
    PROMPTS.forEach(text => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ys-prompt';
        btn.textContent = text;
        btn.addEventListener('click', () => {
            storyInput.value = storyInput.value ? storyInput.value.trim() + ' ' + text + ' ' : text + ' ';
            storyInput.focus();
            storyInput.dispatchEvent(new Event('input'));
        });
        promptsRow.appendChild(btn);
    });

    // Counter
    const MIN = 30;
    const TARGET = 280;
    const MAX = 800;

    function updateCounter() {
        const len = storyInput.value.trim().length;
        counter.textContent = `${len} characters · aim for ${TARGET}`;
        counter.classList.remove('warn', 'over');
        if (len > MAX) counter.classList.add('over');
        else if (len >= TARGET) counter.classList.add('warn');

        submit.disabled = len < MIN || !instInput.value.trim();
    }

    storyInput.addEventListener('input', updateCounter);
    instInput.addEventListener('input', updateCounter);
    updateCounter();

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const institution = instInput.value.trim();
        const story = storyInput.value.trim();
        if (!institution || story.length < MIN) return;

        // Show the success state
        success.querySelector('.ys-echo-institution').textContent = institution;
        success.querySelector('.ys-echo-text').textContent = '"' + story + '"';
        form.style.display = 'none';
        success.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // In production: POST to your CRM / inbox
        // fetch('/api/story', { method: 'POST', body: JSON.stringify({ institution, story }) })
    });
})();
