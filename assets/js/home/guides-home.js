/**
 * Home Page Guides Loader
 * Fetches latest guides from /apps/guides/data/guides-list.json and renders them.
 */

window.loadHomeGuides = async function (currentLang) {
    const container = document.getElementById('guides-list');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="guides-loading" style="padding: 20px; text-align: center; color: #888;">Loading...</div>';

    try {
        // Fetch guides data
        const baseUrl = window.SITE_BASEURL || '';
        const response = await fetch(`${baseUrl}/apps/guides/data/guides-list.json?v=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load guides list');

        let guides = await response.json();

        // Sort by date (newest first)
        guides.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Take top 5
        const recentGuides = guides.slice(0, 5);

        // Clear container
        container.innerHTML = '';

        if (recentGuides.length === 0) {
            container.innerHTML = '<div class="guides-empty" style="padding: 20px; text-align: center; color: #888;">No guides available.</div>';
            return;
        }

        // Render guides
        recentGuides.forEach(guide => {
            const item = createGuideItem(guide, currentLang);
            container.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading home guides:', error);
        container.innerHTML = '<div class="guides-error" style="padding: 20px; text-align: center; color: #888;">Failed to load guides.</div>';
    }
};

function createGuideItem(guide, lang) {
    const item = document.createElement('div');
    item.className = 'post-item guide-home-item'; // Reuse post-item for similar styling if compatible, add guide-home-item for overrides

    // Data extraction
    const title = guide.titles?.[lang] || guide.titles?.kr || guide.title || 'Untitled';
    const excerpt = guide.excerpts?.[lang] || guide.excerpts?.kr || '';
    // const category = guide.category || 'general';
    const dateStr = formatHomeGuideDate(new Date(guide.date), lang);
    const thumbnail = guide.thumbnail || '';

    // Determine URL
    const baseUrl = window.SITE_BASEURL || '';
    const url = guide.hasPage !== false
        ? `${baseUrl}/article/${guide.id}/?lang=${lang}`
        : `${baseUrl}/article/view/?id=${guide.id}&lang=${lang}`;

    // Styling overrides for guide items to distinguish or fit better
    item.style.cursor = 'pointer';
    item.style.display = 'flex';
    item.style.flexDirection = 'row';
    item.style.gap = '15px';
    item.style.alignItems = 'flex-start';
    item.style.padding = '15px';
    item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
    item.style.transition = 'background-color 0.2s';

    // Hover effect handled by CSS injected in createGuideItem

    item.onclick = (e) => {
        // Prevent redirect if clicking specific interactive elements if any
        window.location.href = url;
    };

    // Thumbnail HTML
    let thumbnailHtml = '';
    if (thumbnail) {
        const optimizedThumb = getOptimizedThumbnail(thumbnail, 300);
        thumbnailHtml = `
            <div class="guide-thumbnail-container" style="flex-shrink: 0; width: 100px; height: 65px; border-radius: 6px; overflow: hidden; background: #222;">
                <img src="${optimizedThumb}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            </div>
        `;
    }

    // New badge logic (within 3 days)
    const isNew = (Date.now() - new Date(guide.date).getTime()) < (3 * 24 * 60 * 60 * 1000);
    const newBadge = isNew ? `<span style="background: #d32f2f; color: white; font-size: 8px; padding: 2px 5px; border-radius: 4px; margin-right: 6px; vertical-align: middle;">NEW</span>` : '';

    item.innerHTML = `
        ${thumbnailHtml}
        <div class="guide-info" style="flex: 1; min-width: 0;">
            <div class="guide-header-line" style="display: flex; align-items: center; margin-bottom: 6px;">
                ${newBadge}
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #ececec; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">
                    ${title}
                </h3>
            </div>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #a0a0a0; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;">
                ${excerpt}
            </p>
            <div class="guide-meta" style="font-size: 12px; color: #666;">
                <span>${dateStr}</span>
                ${guide.author ? `<span style="margin: 0 6px;">|</span><span>${guide.author}</span>` : ''}
            </div>
        </div>
    `;

    // Inject styles for hover effect if not already present
    if (!document.getElementById('guide-home-styles')) {
        const style = document.createElement('style');
        style.id = 'guide-home-styles';
        style.innerHTML = `
            .guide-home-item {
                transition: background-color 0.2s;
            }
            .guide-home-item:hover {
                background-color: rgba(255, 255, 255, 0.02) !important;
            }
        `;
        document.head.appendChild(style);
    }

    return item;
}

function formatHomeGuideDate(date, lang) {
    try {
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
        } else if (days < 30) {
            const weeks = Math.floor(days / 7);
            if (lang === 'en') return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
            if (lang === 'jp') return `${weeks}週間前`;
            return `${weeks}주 전`;
        }

        const options = { month: 'long', day: 'numeric' };
        if (currentYear !== targetYear) {
            options.year = 'numeric';
        }

        const locale = (lang === 'en') ? 'en-US' : (lang === 'jp') ? 'ja-JP' : 'ko-KR';
        return date.toLocaleDateString(locale, options);
    } catch (_) { return ''; }
}

function getOptimizedThumbnail(url, width) {
    if (!url) return '';
    // If it's already an external URL, just pass it to wsrv.nl
    // If it's a local path, construct the full URL first
    let fullUrl = url;
    if (url.startsWith('/')) {
        // Use the current origin or a specific base URL if configured
        // For local dev (localhost), wsrv.nl won't work unless we use a public URL.
        // However, for production (lufel.net), it works.
        // To permit testing, we just return original if localhost (unless we use tunneling, but simplistic check here)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return url; // Skip optimization on localhost
        }
        fullUrl = window.location.origin + url;
    }

    // wsrv.nl format: //wsrv.nl/?url=IMAGE_URL&w=WIDTH&output=webp
    return `//wsrv.nl/?url=${encodeURIComponent(fullUrl)}&w=${width}&output=webp`;
}

// Expose initialization function
window.initHomeGuides = function () {
    // Get current language similar to other scripts
    let currentLang = 'kr';
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) {
        currentLang = urlLang;
    } else if (typeof LanguageRouter !== 'undefined') {
        currentLang = LanguageRouter.getCurrentLanguage();
    } else {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
            currentLang = savedLang;
        }
    }

    loadHomeGuides(currentLang);
};

// Hook into DOMContentLoaded or call immediately if defer loaded
document.addEventListener('DOMContentLoaded', () => {
    // We'll let index.html script block call this to coordinate with other loads if needed, 
    // or just run it here.
    window.initHomeGuides();
});

// Update on language change event if exists
document.addEventListener('languageChanged', (e) => {
    if (e.detail && e.detail.lang) {
        window.loadHomeGuides(e.detail.lang);
    }
});
