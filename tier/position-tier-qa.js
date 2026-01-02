const tierQaData = {
    kr: {
        title: "Q&A",
        items: [
            {
                q: "Sample question 1",
                a: "Sample answer. Replace this text."
            },
            {
                q: "Sample question 2",
                a: "Another sample answer.\nAdd more detail here."
            }
        ]
    },
    en: {
        title: "Q&A",
        items: [
            {
                q: "Sample question 1",
                a: "Sample answer. Replace this text."
            },
            {
                q: "Sample question 2",
                a: "Another sample answer.\nAdd more detail here."
            }
        ]
    },
    jp: {
        title: "Q&A",
        items: [
            {
                q: "Sample question 1",
                a: "Sample answer. Replace this text."
            },
            {
                q: "Sample question 2",
                a: "Another sample answer.\nAdd more detail here."
            }
        ]
    }
};

function renderTierQa() {
    const section = document.getElementById('tier-qa-section');
    const list = document.getElementById('tier-qa-list');
    const title = document.getElementById('tier-qa-title');
    if (!section || !list) return;

    const urlParams = new URLSearchParams(window.location.search);
    const isListMode = urlParams.get('list') !== 'false';
    if (!isListMode) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    const currentLang = (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage)
        ? LanguageRouter.getCurrentLanguage()
        : 'kr';
    const data = tierQaData[currentLang] || tierQaData.kr;

    if (title && data.title) title.textContent = data.title;

    list.textContent = '';
    data.items.forEach((item) => {
        const details = document.createElement('details');
        details.className = 'tier-qa-item';

        const summary = document.createElement('summary');
        summary.textContent = item.q || '';

        const answer = document.createElement('div');
        answer.className = 'tier-qa-answer';

        const lines = (item.a || '').split('\n');
        lines.forEach((line) => {
            const p = document.createElement('p');
            p.textContent = line;
            answer.appendChild(p);
        });

        details.appendChild(summary);
        details.appendChild(answer);
        list.appendChild(details);
    });
}

window.renderTierQa = renderTierQa;
document.addEventListener('DOMContentLoaded', renderTierQa);
