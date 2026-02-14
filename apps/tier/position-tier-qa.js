async function waitForTierI18n(maxRetries = 50, delayMs = 100) {
    while (typeof window.t !== 'function' && maxRetries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        maxRetries--;
    }
}

function getCurrentTierLanguage() {
    return (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage)
        ? LanguageRouter.getCurrentLanguage()
        : 'kr';
}

function getTierQaData(lang) {
    if (typeof window.t === 'function') {
        const title = window.t('tierQaTitle', 'Q&A');
        const items = window.t('tierQaItems', []);
        if (Array.isArray(items) && items.length > 0) {
            return { title, items };
        }
    }

    const pageVar = `I18N_PAGE_TIER_${String(lang || 'kr').toUpperCase()}`;
    const fallbackPack = window.I18N_PAGE_TIER_KR || {};
    const pack = window[pageVar] || fallbackPack;

    return {
        title: pack.tierQaTitle || 'Q&A',
        items: Array.isArray(pack.tierQaItems) ? pack.tierQaItems : []
    };
}

async function renderTierQa() {
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

    await waitForTierI18n();

    const currentLang = getCurrentTierLanguage();
    const data = getTierQaData(currentLang);
    if (!Array.isArray(data.items) || data.items.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    if (title && data.title) title.textContent = data.title;

    list.textContent = '';
    data.items.forEach((item) => {
        const details = document.createElement('details');
        details.className = 'tier-qa-item';

        const summary = document.createElement('summary');
        summary.textContent = item.q || '';

        const answer = document.createElement('div');
        answer.className = 'tier-qa-answer';

        const lines = String(item.a || '').split('\n');
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
document.addEventListener('DOMContentLoaded', () => { void renderTierQa(); });
