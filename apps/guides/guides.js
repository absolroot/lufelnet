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
        const cat = this.categories.find(c => c.id === categoryId);
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

        container.innerHTML = '<div class="guides-loading">Loading guides</div>';

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
                    <div class="guides-empty-text">No guides available yet</div>
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

        // Update page title i18n
        const pageTitles = {
            kr: '가이드 - 페르소나5 더 팬텀 X 루페르넷',
            en: 'Guides - Persona 5: The Phantom X Lufelnet',
            jp: 'ガイド - ペルソナ5 ザ・ファントムX ルフェルネット'
        };
        const pageDescs = {
            kr: '페르소나5 더 팬텀 X 공략 가이드',
            en: 'Persona 5: The Phantom X Strategy Guides',
            jp: 'ペルソナ5 ザ・ファントムX 攻略ガイド'
        };
        this.updateMeta(pageTitles[lang] || pageTitles.kr, pageDescs[lang] || pageDescs.kr);
        this.updateLanguageTexts();

        // Build search bar
        const searchLabels = { kr: '검색...', en: 'Search...', jp: '検索...' };
        const allLabels = { kr: '전체', en: 'All', jp: 'すべて' };

        let html = `
            <div class="guides-search">
                <svg class="guides-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" class="guides-search-input" id="guides-search-input"
                       placeholder="${searchLabels[lang] || searchLabels.kr}"
                       value="${this.searchQuery}">
            </div>
            <div class="guides-category-tabs" id="guides-category-tabs">
                <button class="guides-tab${this.activeCategory === 'all' ? ' active' : ''}" data-cat="all">
                    ${allLabels[lang] || allLabels.kr}
                </button>
                ${this.categories.map(cat => `
                    <button class="guides-tab${this.activeCategory === cat.id ? ' active' : ''}" data-cat="${cat.id}">
                        ${cat.labels[lang] || cat.labels.kr}
                    </button>
                `).join('')}
            </div>
        `;

        // Filter and sort
        let filtered = this.getFilteredList(lang);

        html += '<div class="guides-results">';
        if (filtered.length === 0) {
            const noResultLabels = { kr: '결과가 없습니다', en: 'No results found', jp: '結果が見つかりません' };
            html += `
                <div class="guides-empty" style="margin-top:var(--guide-space-lg)">
                    <div class="guides-empty-text">${noResultLabels[lang] || noResultLabels.kr}</div>
                </div>
            `;
        } else {
            html += `
                <div class="guides-grid">
                    ${filtered.map(guide => this.renderCard(guide, lang)).join('')}
                </div>
            `;
        }
        html += '</div>';

        container.innerHTML = html;

        // Search input handler (with IME composition support)
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

        // Category tab handlers
        container.querySelectorAll('.guides-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeCategory = btn.dataset.cat;
                this.renderList();
            });
        });

        // Card click handlers
        container.querySelectorAll('.guide-card').forEach(card => {
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
        let filtered = this.getFilteredList(lang);

        const gridContainer = container.querySelector('.guides-results');
        if (!gridContainer) return;

        if (filtered.length === 0) {
            const noResultLabels = { kr: '결과가 없습니다', en: 'No results found', jp: '結果が見つかりません' };
            gridContainer.innerHTML = `
                <div class="guides-empty" style="margin-top:var(--guide-space-lg)">
                    <div class="guides-empty-text">${noResultLabels[lang] || noResultLabels.kr}</div>
                </div>
            `;
        } else {
            gridContainer.innerHTML = `
                <div class="guides-grid">
                    ${filtered.map(guide => this.renderCard(guide, lang)).join('')}
                </div>
            `;
        }

        // Re-bind card click handlers
        gridContainer.querySelectorAll('.guide-card').forEach(card => {
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
            filtered = filtered.filter(g => g.category === this.activeCategory);
        }

        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(g => {
                const title = (g.titles?.[lang] || g.titles?.kr || '').toLowerCase();
                const searchContent = (g.searchContent?.[lang] || g.searchContent?.kr || '').toLowerCase();
                return title.includes(q) || searchContent.includes(q);
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
     * Render a single guide card
     */
    /**
     * Get optimized thumbnail URL
     */
    getOptimizedThumbnail(url, width) {
        if (!url) return '';
        // Skip optimization for local dev to avoid broken broken images if not public
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return url;
        }

        // Construct full URL if relative
        let fullUrl = url;
        if (url.startsWith('/')) {
            fullUrl = window.location.origin + url;
        }

        // wsrv.nl format
        return `//wsrv.nl/?url=${encodeURIComponent(fullUrl)}&w=${width}&output=webp`;
    },

    /**
     * Render a single guide card
     */
    renderCard(guide, lang) {
        const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || 'Untitled';
        const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
        const categoryLabel = this.getCategoryLabel(guide.category, lang);
        const catClass = guide.category ? ` cat-${guide.category}` : '';
        const date = this.formatDate(guide.date, lang);
        const thumbnail = guide.thumbnail || '';
        const url = this.getGuideUrl(guide, lang);

        let thumbHtml = '';
        if (thumbnail) {
            // Optimize to 300px WebP (static)
            const optimizedThumb = this.getOptimizedThumbnail(thumbnail, 300);
            // Store original GIF URL in data-gif if it is a GIF
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
        container.querySelectorAll('.guide-card-thumbnail[data-gif]').forEach(img => {
            const card = img.closest('.guide-card');
            if (card) {
                card.addEventListener('mouseenter', () => {
                    img.src = img.getAttribute('data-gif');
                });
                card.addEventListener('mouseleave', () => {
                    img.src = img.getAttribute('data-static');
                });
            }
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

        container.innerHTML = '<div class="guides-loading">Loading guide</div>';

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
        const categoryLabel = this.getCategoryLabel(guide.category, lang);
        const date = this.formatDate(guide.date, lang);
        const author = guide.author || '';
        let thumbnail = guide.thumbnail || '';

        // Hide thumbnail if same as first content image
        if (thumbnail) {
            // Check if content starts with image that matches thumbnail
            const tmp = document.createElement('div');
            tmp.innerHTML = content;
            const firstImg = tmp.querySelector('img');
            if (firstImg) {
                const firstSrc = firstImg.getAttribute('src') || '';
                // Simple check for matching filenames
                if (firstSrc && (firstSrc === thumbnail || firstSrc.endsWith(thumbnail) || thumbnail.endsWith(firstSrc))) {
                    thumbnail = '';
                }
            }
        }

        // Update page title & SEO
        const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
        const fullThumb = thumbnail && thumbnail.startsWith('/') ? window.location.origin + thumbnail : thumbnail;
        const siteLabels = { kr: '루페르넷', en: 'Lufelnet', jp: 'ルフェルネット' };
        this.updateMeta(
            `${title} - ${siteLabels[lang] || siteLabels.kr}`,
            excerpt || title,
            fullThumb || null
        );

        const html = `
            <a class="guide-back" href="/article/?lang=${lang}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span data-kr="목록으로" data-en="Back to list" data-jp="一覧へ">목록으로</span>
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

        // Update back link text based on language
        this.updateLanguageTexts();

        // No special GIF handling for single view (let it play)
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
     * Update SEO meta tags dynamically
     */
    updateMeta(title, description, image) {
        document.title = title;

        const setMeta = (selector, content) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', content);
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
    /**
     * Format date based on language
     */
    formatDate(dateStr, lang) {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const currentYear = now.getFullYear();
        const targetYear = date.getFullYear();

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                if (lang === 'en') return `${minutes} min ago`;
                if (lang === 'jp') return `${minutes}分前`;
                return `${minutes}분 전`;
            }
            if (lang === 'en') return `${hours} hours ago`;
            if (lang === 'jp') return `${hours}時間前`;
            return `${hours}시간 전`;
        } else if (days < 7) {
            if (lang === 'en') return `${days} days ago`;
            if (lang === 'jp') return `${days}日前`;
            return `${days}일 전`;
        } else if (days < 14) {
            const weeks = Math.floor(days / 7);
            if (lang === 'en') return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
            if (lang === 'jp') return `${weeks}週間前`;
            return `${weeks}주 전`;
        }

        // Unified string for older guides (> 2 weeks)
        if (lang === 'kr') return '루페르넷 가이드';
        if (lang === 'jp') return 'Lufelnet Guide';
        return 'Lufelnet Guide';
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
