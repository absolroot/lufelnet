/**
 * Guides System
 * Handles loading and displaying guides from JSON data
 */

const Guides = {
    basePath: '/apps/guides/data',
    currentLang: 'kr',
    list: [],
    categories: [],
    activeCategory: 'all',
    searchQuery: '',
    isComposing: false,
    currentView: 'list',
    currentGuideId: null,

    /**
     * Initialize the guides system
     */
    init() {
        this.detectLanguage();
        this.setupLanguageListener();
    },

    /**
     * Resolve text through integrated i18n service
     */
    getI18nText(key, fallback = '') {
        try {
            if (typeof window.t === 'function') {
                return window.t(key, fallback);
            }
        } catch (_) {}

        try {
            if (window.I18nService && typeof window.I18nService.t === 'function') {
                return window.I18nService.t(key, fallback);
            }
        } catch (_) {}

        return fallback || key;
    },

    /**
     * Replace token values in i18n strings
     */
    formatTemplate(template, value) {
        const safeTemplate = String(template || '');
        return safeTemplate.replace(/\{value\}/g, String(value));
    },

    /**
     * Detect current language from i18n service or URL/storage fallback
     */
    detectLanguage() {
        const supported = ['kr', 'en', 'jp'];

        try {
            if (typeof window.getCurrentLang === 'function') {
                const lang = window.getCurrentLang();
                if (supported.includes(lang)) {
                    this.currentLang = lang;
                    return;
                }
            }
        } catch (_) {}

        try {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                const lang = window.I18nService.getCurrentLanguage();
                if (supported.includes(lang)) {
                    this.currentLang = lang;
                    return;
                }
            }
        } catch (_) {}

        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && supported.includes(urlLang)) {
            this.currentLang = urlLang;
            return;
        }

        const storedLang = localStorage.getItem('preferredLanguage');
        this.currentLang = supported.includes(storedLang) ? storedLang : 'kr';
    },

    /**
     * Handle language change
     */
    handleLanguageChange(newLang) {
        if (!newLang || this.currentLang === newLang) return;
        this.currentLang = newLang;
        this.refresh();
    },

    /**
     * Listen for language changes
     */
    setupLanguageListener() {
        if (window.I18nService && typeof window.I18nService.onLanguageChange === 'function') {
            window.I18nService.onLanguageChange((oldLang, newLang) => {
                this.handleLanguageChange(newLang);
            });
        }

        // Backward compatibility with legacy events
        document.addEventListener('languageChanged', (e) => {
            this.handleLanguageChange(e?.detail?.lang);
        });
    },

    /**
     * Refresh current view
     */
    refresh() {
        if (this.currentView === 'list') {
            this.renderList();
            return;
        }

        if (this.currentView === 'single' && this.currentGuideId) {
            this.loadGuide(this.currentGuideId);
        }
    },

    /**
     * Load categories
     */
    async loadCategories() {
        try {
            const response = await fetch(`${this.basePath}/categories.json?v=${Date.now()}`);
            if (response.ok) {
                this.categories = await response.json();
            }
        } catch (e) {
            console.warn('Could not load categories:', e);
        }
    },

    /**
     * Get category label by id
     */
    getCategoryLabel(categoryId, lang) {
        const cat = this.categories.find((entry) => entry.id === categoryId);
        if (cat) return cat.labels[lang] || cat.labels.kr || categoryId;
        return categoryId || '';
    },

    /**
     * Load the guides list
     */
    async loadList() {
        this.currentView = 'list';
        const container = document.getElementById('guides-container');
        if (!container) return;

        container.innerHTML = `<div class="guides-loading">${this.getI18nText('loadingGuides', 'Loading guides...')}</div>`;

        try {
            await this.loadCategories();

            const response = await fetch(`${this.basePath}/guides-list.json?v=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to load guides list');

            this.list = await response.json();
            this.renderList();
        } catch (error) {
            console.error('Error loading guides:', error);
            container.innerHTML = `
                <div class="guides-empty">
                    <div class="guides-empty-icon">📄</div>
                    <div class="guides-empty-text">${this.getI18nText('noGuidesYet', 'No guides available yet')}</div>
                </div>
            `;
        }
    },

    /**
     * Render the guides list with search + category filter
     */
    renderList() {
        const container = document.getElementById('guides-container');
        if (!container) return;

        const lang = this.currentLang;
        this.updateMeta(
            this.getI18nText('seoListTitle', 'Guides - Persona 5: The Phantom X Lufelnet'),
            this.getI18nText('seoListDescription', 'Persona 5: The Phantom X Strategy Guides')
        );
        this.updateLanguageTexts();

        const searchPlaceholder = this.getI18nText('searchPlaceholder', 'Search...');
        const allLabel = this.getI18nText('filterAll', 'All');

        let html = `
            <div class="guides-search">
                <svg class="guides-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" class="guides-search-input" id="guides-search-input"
                       placeholder="${searchPlaceholder}"
                       value="${this.searchQuery}">
            </div>
            <div class="guides-category-tabs" id="guides-category-tabs">
                <button class="guides-tab${this.activeCategory === 'all' ? ' active' : ''}" data-cat="all">
                    ${allLabel}
                </button>
                ${this.categories.map((cat) => `
                    <button class="guides-tab${this.activeCategory === cat.id ? ' active' : ''}" data-cat="${cat.id}">
                        ${cat.labels[lang] || cat.labels.kr}
                    </button>
                `).join('')}
            </div>
        `;

        const filtered = this.getFilteredList(lang);

        html += '<div class="guides-results">';
        if (filtered.length === 0) {
            html += `
                <div class="guides-empty" style="margin-top:var(--guide-space-lg)">
                    <div class="guides-empty-text">${this.getI18nText('noResults', 'No results found')}</div>
                </div>
            `;
        } else {
            html += `
                <div class="guides-grid">
                    ${filtered.map((guide) => this.renderCard(guide, lang)).join('')}
                </div>
            `;
        }
        html += '</div>';

        container.innerHTML = html;

        const searchInput = document.getElementById('guides-search-input');
        if (searchInput) {
            searchInput.addEventListener('compositionstart', () => {
                this.isComposing = true;
            });
            searchInput.addEventListener('compositionend', (e) => {
                this.isComposing = false;
                this.searchQuery = e.target.value;
                this.updateFilteredList();
            });
            searchInput.addEventListener('input', (e) => {
                if (this.isComposing) return;
                this.searchQuery = e.target.value;
                this.updateFilteredList();
            });
        }

        container.querySelectorAll('.guides-tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                this.activeCategory = btn.dataset.cat;
                this.renderList();
            });
        });

        container.querySelectorAll('.guide-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = card.getAttribute('href');
            });
        });

        this.setupGifThumbnails(container);
    },

    /**
     * Update only the grid area (used by search to avoid destroying input)
     */
    updateFilteredList() {
        const container = document.getElementById('guides-container');
        if (!container) return;

        const lang = this.currentLang;
        const filtered = this.getFilteredList(lang);
        const gridContainer = container.querySelector('.guides-results');
        if (!gridContainer) return;

        if (filtered.length === 0) {
            gridContainer.innerHTML = `
                <div class="guides-empty" style="margin-top:var(--guide-space-lg)">
                    <div class="guides-empty-text">${this.getI18nText('noResults', 'No results found')}</div>
                </div>
            `;
        } else {
            gridContainer.innerHTML = `
                <div class="guides-grid">
                    ${filtered.map((guide) => this.renderCard(guide, lang)).join('')}
                </div>
            `;
        }

        gridContainer.querySelectorAll('.guide-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = card.getAttribute('href');
            });
        });

        this.setupGifThumbnails(gridContainer);
    },

    /**
     * Get filtered and sorted list
     */
    getFilteredList(lang) {
        let filtered = [...this.list];

        if (this.activeCategory !== 'all') {
            filtered = filtered.filter((guide) => guide.category === this.activeCategory);
        }

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter((guide) => {
                const title = (guide.titles?.[lang] || guide.titles?.kr || '').toLowerCase();
                const searchContent = (guide.searchContent?.[lang] || guide.searchContent?.kr || '').toLowerCase();
                return title.includes(query) || searchContent.includes(query);
            });
        }

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        return filtered;
    },

    /**
     * Get the URL for a guide
     */
    getGuideUrl(guide, lang) {
        if (guide.hasPage !== false) {
            return `/article/${guide.id}/?lang=${lang}`;
        }
        return `/article/view/?id=${guide.id}&lang=${lang}`;
    },

    /**
     * Get optimized thumbnail URL
     */
    getOptimizedThumbnail(url, width) {
        if (!url) return '';
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return url;
        }

        let fullUrl = url;
        if (url.startsWith('/')) {
            fullUrl = window.location.origin + url;
        }

        return `//wsrv.nl/?url=${encodeURIComponent(fullUrl)}&w=${width}&output=webp`;
    },

    /**
     * Render a single guide card
     */
    renderCard(guide, lang) {
        const untitled = this.getI18nText('untitled', 'Untitled');
        const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || untitled;
        const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
        const categoryLabel = this.getCategoryLabel(guide.category, lang);
        const catClass = guide.category ? ` cat-${guide.category}` : '';
        const date = this.formatDate(guide.date, lang);
        const thumbnail = guide.thumbnail || '';
        const url = this.getGuideUrl(guide, lang);

        let thumbHtml = '';
        if (thumbnail) {
            const optimizedThumb = this.getOptimizedThumbnail(thumbnail, 300);
            const isGif = thumbnail.toLowerCase().endsWith('.gif');
            const dataAttrs = isGif ? ` data-gif="${thumbnail}" data-static="${optimizedThumb}"` : '';
            thumbHtml = `<img class="guide-card-thumbnail" src="${optimizedThumb}" alt="${title}"${dataAttrs} loading="lazy">`;
        }

        return `
            <a class="guide-card" data-id="${guide.id}" href="${url}">
                ${thumbHtml}
                <div class="guide-card-content">
                    <span class="guide-card-category${catClass}">${categoryLabel}</span>
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
     * Setup GIF hover effects using pre-calculated paths
     */
    setupGifThumbnails(container) {
        container.querySelectorAll('.guide-card-thumbnail[data-gif]').forEach((img) => {
            const card = img.closest('.guide-card');
            if (!card) return;

            card.addEventListener('mouseenter', () => {
                img.src = img.getAttribute('data-gif');
            });
            card.addEventListener('mouseleave', () => {
                img.src = img.getAttribute('data-static');
            });
        });
    },

    /**
     * Load a single guide
     */
    async loadGuide(id) {
        this.currentView = 'single';
        this.currentGuideId = id;

        const container = document.getElementById('guide-view-container');
        if (!container) return;

        container.innerHTML = `<div class="guides-loading">${this.getI18nText('loadingGuide', 'Loading guide...')}</div>`;

        try {
            await this.loadCategories();

            const response = await fetch(`${this.basePath}/posts/${id}.json?v=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to load guide');

            const guide = await response.json();
            this.renderGuide(guide);
        } catch (error) {
            console.error('Error loading guide:', error);
            container.innerHTML = `
                <div class="guides-empty">
                    <div class="guides-empty-icon">404</div>
                    <div class="guides-empty-text">${this.getI18nText('guideNotFound', 'Guide not found')}</div>
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
        const untitled = this.getI18nText('untitled', 'Untitled');
        const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || untitled;
        const content = guide.contents?.[lang] || guide.contents?.kr || '';
        const categoryLabel = this.getCategoryLabel(guide.category, lang);
        const date = this.formatDate(guide.date, lang);
        const author = guide.author || '';
        let thumbnail = guide.thumbnail || '';

        if (thumbnail) {
            const tmp = document.createElement('div');
            tmp.innerHTML = content;
            const firstImg = tmp.querySelector('img');
            if (firstImg) {
                const firstSrc = firstImg.getAttribute('src') || '';
                if (firstSrc && (firstSrc === thumbnail || firstSrc.endsWith(thumbnail) || thumbnail.endsWith(firstSrc))) {
                    thumbnail = '';
                }
            }
        }

        const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
        const fullThumb = thumbnail && thumbnail.startsWith('/') ? window.location.origin + thumbnail : thumbnail;
        const siteName = this.getI18nText('siteName', 'Lufelnet');
        this.updateMeta(
            `${title} - ${siteName}`,
            excerpt || title,
            fullThumb || null
        );

        const backToList = this.getI18nText('backToList', 'Back to list');
        const html = `
            <a class="guide-back" href="/article/?lang=${lang}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>${backToList}</span>
            </a>

            <article class="guide-article">
                <header class="guide-header">
                    <span class="guide-category${guide.category ? ` cat-${guide.category}` : ''}">${categoryLabel}</span>
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
        this.updateLanguageTexts();
    },

    /**
     * Update texts based on current language
     */
    updateLanguageTexts() {
        if (window.I18nService && typeof window.I18nService.updateDOM === 'function') {
            window.I18nService.updateDOM();
        }
    },

    /**
     * Update SEO meta tags dynamically
     */
    updateMeta(title, description, image) {
        document.title = title;

        const setMeta = (selector, content) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('content', content);
            }
        };

        if (description) {
            setMeta('meta[name="description"]', description);
            setMeta('meta[property="og:description"]', description);
            setMeta('meta[name="twitter:description"]', description);
        }

        setMeta('meta[property="og:title"]', title);
        setMeta('meta[name="twitter:title"]', title);

        if (image) {
            setMeta('meta[property="og:image"]', image);
            setMeta('meta[name="twitter:image"]', image);
        }
    },

    /**
     * Format date based on language
     */
    formatDate(dateStr, lang) {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return '';

        const now = new Date();
        const diff = Math.max(now - date, 0);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return this.formatTemplate(
                    this.getI18nText('dateMinutesAgo', '{value} min ago'),
                    minutes
                );
            }

            return this.formatTemplate(
                this.getI18nText('dateHoursAgo', '{value} hours ago'),
                hours
            );
        }

        if (days < 7) {
            return this.formatTemplate(
                this.getI18nText('dateDaysAgo', '{value} days ago'),
                days
            );
        }

        if (days < 14) {
            const weeks = Math.floor(days / 7);
            const weekKey = lang === 'en' && weeks > 1 ? 'dateWeeksAgoPlural' : 'dateWeeksAgoSingular';
            return this.formatTemplate(
                this.getI18nText(weekKey, '{value} weeks ago'),
                weeks
            );
        }

        return this.getI18nText('oldGuideLabel', 'Lufelnet Guide');
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
