/**
 * Guides System
 * Handles loading and displaying guides from JSON data
 */

const Guides = {
    basePath: '/apps/guides/data',
    currentLang: 'kr',
    list: [],

    /**
     * Initialize the guides system
     */
    init() {
        this.detectLanguage();
        this.setupLanguageListener();
    },

    /**
     * Detect current language from URL or localStorage
     */
    detectLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const storedLang = localStorage.getItem('selectedLanguage');
        this.currentLang = urlLang || storedLang || 'kr';
    },

    /**
     * Listen for language changes
     */
    setupLanguageListener() {
        // Listen for custom language change events
        document.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.refresh();
        });
    },

    /**
     * Refresh current view
     */
    refresh() {
        if (this.currentView === 'list') {
            this.renderList();
        } else if (this.currentView === 'single') {
            this.loadGuide(this.currentGuideId);
        }
    },

    /**
     * Load the guides list
     */
    async loadList() {
        this.currentView = 'list';
        const container = document.getElementById('guides-container');
        if (!container) return;

        container.innerHTML = '<div class="guides-loading">Loading guides</div>';

        try {
            const response = await fetch(`${this.basePath}/guides-list.json?v=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to load guides list');

            this.list = await response.json();
            this.renderList();
        } catch (error) {
            console.error('Error loading guides:', error);
            container.innerHTML = `
                <div class="guides-empty">
                    <div class="guides-empty-icon">📄</div>
                    <div class="guides-empty-text">No guides available yet</div>
                </div>
            `;
        }
    },

    /**
     * Render the guides list
     */
    renderList() {
        const container = document.getElementById('guides-container');
        if (!container || !this.list.length) return;

        const lang = this.currentLang;

        // Sort by date descending
        const sortedList = [...this.list].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        const html = `
            <div class="guides-grid">
                ${sortedList.map(guide => this.renderCard(guide, lang)).join('')}
            </div>
        `;

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.guide-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const id = card.dataset.id;
                window.location.href = `/guides/view/?id=${id}&lang=${lang}`;
            });
        });
    },

    /**
     * Render a single guide card
     */
    renderCard(guide, lang) {
        const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || 'Untitled';
        const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
        const category = guide.category || 'Guide';
        const date = this.formatDate(guide.date, lang);
        const thumbnail = guide.thumbnail || '';

        return `
            <a class="guide-card" data-id="${guide.id}" href="/guides/view/?id=${guide.id}&lang=${lang}">
                ${thumbnail ? `<img class="guide-card-thumbnail" src="${thumbnail}" alt="${title}">` : ''}
                <div class="guide-card-content">
                    <span class="guide-card-category">${category}</span>
                    <h3 class="guide-card-title">${title}</h3>
                    ${excerpt ? `<p class="guide-card-excerpt">${excerpt}</p>` : ''}
                    <div class="guide-card-meta">
                        <span class="guide-card-date">${date}</span>
                        ${guide.author ? `<span class="guide-card-author">${guide.author}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    },

    /**
     * Load a single guide
     */
    async loadGuide(id) {
        this.currentView = 'single';
        this.currentGuideId = id;

        const container = document.getElementById('guide-view-container');
        if (!container) return;

        container.innerHTML = '<div class="guides-loading">Loading guide</div>';

        try {
            const response = await fetch(`${this.basePath}/posts/${id}.json?v=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to load guide');

            const guide = await response.json();
            this.renderGuide(guide);
        } catch (error) {
            console.error('Error loading guide:', error);
            container.innerHTML = `
                <div class="guides-empty">
                    <div class="guides-empty-icon">404</div>
                    <div class="guides-empty-text">Guide not found</div>
                </div>
            `;
        }
    },

    /**
     * Render a single guide
     */
    renderGuide(guide) {
        const container = document.getElementById('guide-view-container');
        if (!container) return;

        const lang = this.currentLang;
        const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || 'Untitled';
        const content = guide.contents?.[lang] || guide.contents?.kr || '';
        const category = guide.category || 'Guide';
        const date = this.formatDate(guide.date, lang);
        const author = guide.author || '';
        const thumbnail = guide.thumbnail || '';

        // Update page title
        document.title = `${title} - Guides`;

        const html = `
            <a class="guide-back" href="/guides/?lang=${lang}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span data-kr="목록으로" data-en="Back to list" data-jp="一覧へ">목록으로</span>
            </a>

            <article class="guide-article">
                <header class="guide-header">
                    <span class="guide-category">${category}</span>
                    <h1 class="guide-title">${title}</h1>
                    <div class="guide-meta">
                        <span class="guide-meta-item">${date}</span>
                        ${author ? `<span class="guide-meta-item">${author}</span>` : ''}
                    </div>
                    ${thumbnail ? `<img class="guide-thumbnail" src="${thumbnail}" alt="${title}">` : ''}
                </header>

                <div class="guide-content">
                    ${content}
                </div>
            </article>
        `;

        container.innerHTML = html;

        // Update back link text based on language
        this.updateLanguageTexts();
    },

    /**
     * Update texts based on current language
     */
    updateLanguageTexts() {
        const lang = this.currentLang;
        document.querySelectorAll('[data-kr]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-kr');
            if (text) el.textContent = text;
        });
    },

    /**
     * Format date based on language
     */
    formatDate(dateStr, lang) {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        const locales = {
            kr: 'ko-KR',
            en: 'en-US',
            jp: 'ja-JP'
        };

        try {
            return date.toLocaleDateString(locales[lang] || 'ko-KR', options);
        } catch {
            return dateStr;
        }
    },

    /**
     * Get guide ID from URL
     */
    getGuideIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Guides.init();
});
