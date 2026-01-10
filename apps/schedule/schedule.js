/**
 * P5X Release Schedule Renderer
 * Renders the character release timeline
 * 
 * - manualReleases + autoGenerateCharacters 이후,
 * - characterData의 release_order 기반으로 나머지 캐릭터 자동 추가
 */

(function() {
    'use strict';
    
    const BASE_URL = window.BASE_URL || '';
    const data = window.ReleaseScheduleData;
    
    // Wait for character data to load
    function waitForCharacterData() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.characterData && Object.keys(window.characterData).length > 0) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }
    
    // Get current language
    function getLang() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang') || 'en';
    }
    
    // Get translation
    function t(key) {
        const lang = getLang();
        return data.i18n[lang]?.[key] || data.i18n.en[key] || key;
    }
    
    // Parse date string to Date object
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    
    // Format date for display
    function formatDate(dateStr) {
        const date = parseDate(dateStr);
        const lang = getLang();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        
        if (lang === 'jp') {
            return date.toLocaleDateString('ja-JP', options);
        } else if (lang === 'kr') {
            return date.toLocaleDateString('ko-KR', options);
        }
        return date.toLocaleDateString('en-US', options);
    }
    
    // Format Date object to string (YYYY-MM-DD)
    function formatDateStr(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Get release status based on date
    function getStatus(dateStr) {
        const releaseDate = parseDate(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = releaseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < -14) return 'released';
        if (diffDays <= 0) return 'current';
        if (diffDays <= 21) return 'upcoming';
        return 'future';
    }
    
    // Get days difference text
    function getDaysText(dateStr) {
        const releaseDate = parseDate(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = releaseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return t('today');
        if (diffDays > 0) return `${diffDays} ${t('daysLeft')}`;
        return `${Math.abs(diffDays)} ${t('daysAgo')}`;
    }
    
    // Get remaining characters by release_order (only characters after the last autoGenerate character)
    function getRemainingCharactersByOrder(alreadyScheduled, minReleaseOrder) {
        const charData = window.characterData || {};
        const excludeList = new Set([...alreadyScheduled, "원더", "J&C"]); // 원더, J&C 제외
        
        // Get characters with release_order > minReleaseOrder (after the last scheduled one)
        const chars = Object.entries(charData)
            .filter(([name, info]) => {
                return info.release_order > minReleaseOrder && !excludeList.has(name);
            })
            .sort((a, b) => a[1].release_order - b[1].release_order)
            .map(([name]) => name);
        
        return chars;
    }
    
    // Generate full release schedule
    function generateFullSchedule() {
        const releases = [...data.manualReleases];
        const charData = window.characterData || {};
        
        // Collect already scheduled characters
        const alreadyScheduled = new Set();
        releases.forEach(r => r.characters.forEach(c => alreadyScheduled.add(c)));
        
        // Get last release for date calculation
        let lastRelease = releases[releases.length - 1];
        let lastDate = parseDate(lastRelease.date);
        let interval = data.intervalRules.beforeV4; // 기본 2주
        
        // Track the maximum release_order from autoGenerateCharacters
        let maxReleaseOrder = 0;
        
        // 1. First add autoGenerateCharacters (user-defined order)
        if (data.autoGenerateCharacters && data.autoGenerateCharacters.length > 0) {
            data.autoGenerateCharacters.forEach((item) => {
                // Check if switching to 3-week interval
                if (item.isThreeWeekStart) {
                    interval = data.intervalRules.afterV4;
                }
                
                // Calculate next date
                lastDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);
                
                releases.push({
                    version: item.version,
                    date: formatDateStr(lastDate),
                    characters: item.characters,
                    note: item.note,
                    autoGenerated: true
                });
                
                // Add to already scheduled and track max release_order
                item.characters.forEach(c => {
                    alreadyScheduled.add(c);
                    const charInfo = charData[c];
                    if (charInfo && charInfo.release_order > maxReleaseOrder) {
                        maxReleaseOrder = charInfo.release_order;
                    }
                });
            });
        }
        
        // 2. Then auto-add remaining characters by release_order (only those AFTER autoGenerateCharacters)
        const remainingChars = getRemainingCharactersByOrder(alreadyScheduled, maxReleaseOrder);
        
        if (remainingChars.length > 0) {
            // After autoGenerateCharacters, we're in 3-week interval mode
            interval = data.intervalRules.afterV4;
            
            remainingChars.forEach((charName) => {
                // Calculate next date
                lastDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);
                
                releases.push({
                    // 버전 정보 없이 날짜만 자동 생성
                    version: '?',
                    date: formatDateStr(lastDate),
                    characters: [charName],
                    autoGenerated: true
                });
            });
        }
        
        return releases;
    }
    
    // Get character display name based on language
    function getCharacterName(charName) {
        const charData = window.characterData?.[charName];
        if (!charData) return charName;
        
        const lang = getLang();
        if (lang === 'en' && charData.name_en) return charData.name_en;
        if (lang === 'jp' && charData.name_jp) return charData.name_jp;
        return charData.name || charName;
    }
    
    // Get position icon path
    function getPositionIcon(position) {
        return `${BASE_URL}/assets/img/character-cards/직업_${position}.png`;
    }
    
    // Get element icon path
    function getElementIcon(element) {
        return `${BASE_URL}/assets/img/character-cards/속성_${element}.png`;
    }
    
    // Render character item with click to navigate
    function renderCharacter(charName) {
        const charData = window.characterData?.[charName];
        if (!charData) {
            return `<div class="character-item"><span class="character-name">${charName}</span></div>`;
        }
        
        const displayName = getCharacterName(charName);
        const rarity = charData.rarity || 5;
        const isLimit = charData.limit || false;
        const position = charData.position;
        const element = charData.element;
        const lang = getLang();
        
        // Build rarity stars HTML
        const starHtml = rarity == 5 && isLimit 
            ? '<span class="rarity-star star5-limit">★★★★★</span>'
            : `<span class="rarity-star">${'★'.repeat(rarity)}</span>`;
        
        // Character page URL
        const charUrl = `${BASE_URL}/character.html?name=${encodeURIComponent(charName)}&lang=${lang}`;
        
        return `
            <div class="character-item" onclick="window.location.href='${charUrl}'" title="${displayName}">
                <img 
                    class="character-avatar" 
                    src="${BASE_URL}/assets/img/tier/${charName}.webp" 
                    alt="${displayName}"
                    onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'"
                />
                <div class="character-info">
                    <span class="character-name">${displayName}</span>
                    <div class="character-meta">
                        ${position ? `<img class="position-icon" src="${getPositionIcon(position)}" alt="${position}" title="${position}">` : ''}
                        ${element ? `<img class="element-icon" src="${getElementIcon(element)}" alt="${element}" title="${element}">` : ''}
                        ${starHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render release card
    function renderReleaseCard(release) {
        const status = getStatus(release.date);
        const statusLabel = t(status);
        const daysText = getDaysText(release.date);
        
        const charactersHtml = release.characters
            .map(char => renderCharacter(char))
            .join('');
        
        const noteHtml = release.note 
            ? `<div class="release-note">${release.note}</div>` 
            : '';
        
        // 버전이 '?'이거나 없으면 버전 배지 숨김
        const versionBadgeHtml = release.version && release.version !== '?' 
            ? `<span class="version-badge">v${release.version}</span>` 
            : '';
        
        return `
            <div class="release-card status-${status}" data-status="${status}">
                <div class="timeline-node"></div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="version-info">
                            ${versionBadgeHtml}
                            <span class="release-date">${formatDate(release.date)} · ${daysText}</span>
                        </div>
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </div>
                    <div class="character-list">
                        ${charactersHtml}
                    </div>
                    ${noteHtml}
                </div>
            </div>
        `;
    }
    
    // Render year divider
    function renderYearDivider(year) {
        return `
            <div class="year-divider">
                <span class="year-label">${year}</span>
            </div>
        `;
    }
    
    // Render current banner info
    function renderCurrentBanner(releases) {
        const container = document.getElementById('current-banner');
        if (!container) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find current release
        const currentRelease = releases.find(r => getStatus(r.date) === 'current');
        
        // Find next upcoming release
        const upcomingReleases = releases.filter(r => {
            const releaseDate = parseDate(r.date);
            return releaseDate > today;
        });
        const nextRelease = upcomingReleases.length > 0 ? upcomingReleases[0] : null;
        
        let currentHtml = '';
        let nextHtml = '';
        
        // Current banner
        if (currentRelease) {
            const firstChar = currentRelease.characters[0];
            const charNames = currentRelease.characters.map(c => getCharacterName(c)).join(', ');
            const charImgSrc = `${BASE_URL}/assets/img/tier/${firstChar}.webp`;
            
            currentHtml = `
                <div class="current-info">
                    <div class="current-label">${t('currentBanner')}</div>
                    <div class="current-character">
                        <img class="current-char-avatar" src="${charImgSrc}" alt="${charNames}" onerror="this.style.display='none'">
                        <span>${charNames}</span>
                    </div>
                </div>
            `;
        }
        
        // Next release
        if (nextRelease) {
            const nextDate = parseDate(nextRelease.date);
            const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
            const firstNextChar = nextRelease.characters[0];
            const nextCharNames = nextRelease.characters.map(c => getCharacterName(c)).join(', ');
            const nextCharImgSrc = `${BASE_URL}/assets/img/tier/${firstNextChar}.webp`;
            
            nextHtml = `
                <div class="next-release">
                    <div class="current-label">${t('nextRelease')}</div>
                    <div class="countdown">${diffDays} ${t('daysLeft')}</div>
                    <div class="next-character">
                        <span>${nextCharNames}</span>
                        <img class="next-char-avatar" src="${nextCharImgSrc}" alt="${nextCharNames}" onerror="this.style.display='none'">
                    </div>
                </div>
            `;
        }
        
        if (!currentHtml && !nextHtml) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = '';
        container.innerHTML = currentHtml + nextHtml;
    }
    
    // Render timeline
    function renderTimeline(releases, filter = 'all') {
        const container = document.getElementById('timeline-container');
        if (!container) return;
        
        // Separate released and non-released
        const releasedReleases = releases.filter(r => getStatus(r.date) === 'released');
        const nonReleasedReleases = releases.filter(r => getStatus(r.date) !== 'released');
        
        // Apply filter
        let filteredReleases;
        if (filter === 'all') {
            filteredReleases = releases;
        } else if (filter === 'released') {
            filteredReleases = releasedReleases;
        } else {
            filteredReleases = releases.filter(r => getStatus(r.date) === filter);
        }
        
        if (filteredReleases.length === 0) {
            container.innerHTML = `<div class="empty-state">${t('noCharacters')}</div>`;
            return;
        }
        
        let html = '';
        
        // If showing all, render released as collapsible section
        if (filter === 'all' && releasedReleases.length > 0) {
            html += `
                <div class="released-section">
                    <button class="released-toggle-btn" onclick="toggleReleasedSection(this)">
                        <span class="toggle-text">${t('showReleased')}</span>
                        <span class="toggle-count">${releasedReleases.length}</span>
                        <span class="toggle-icon">+</span>
                    </button>
                    <div class="released-content" id="released-content">
            `;
            
            let currentYear = null;
            releasedReleases.forEach(release => {
                const releaseYear = release.date.split('-')[0];
                if (releaseYear !== currentYear) {
                    currentYear = releaseYear;
                    html += renderYearDivider(currentYear);
                }
                html += renderReleaseCard(release);
            });
            
            html += `
                    </div>
                </div>
            `;
            
            // Render non-released
            let currentYear2 = null;
            nonReleasedReleases.forEach(release => {
                const releaseYear = release.date.split('-')[0];
                if (releaseYear !== currentYear2) {
                    currentYear2 = releaseYear;
                    html += renderYearDivider(currentYear2);
                }
                html += renderReleaseCard(release);
            });
        } else {
            // Standard rendering for filtered view
            let currentYear = null;
            filteredReleases.forEach(release => {
                const releaseYear = release.date.split('-')[0];
                if (releaseYear !== currentYear) {
                    currentYear = releaseYear;
                    html += renderYearDivider(currentYear);
                }
                html += renderReleaseCard(release);
            });
        }
        
        container.innerHTML = html;
    }
    
    // Toggle released section
    window.toggleReleasedSection = function(btn) {
        const content = document.getElementById('released-content');
        if (!content) return;
        
        const isExpanded = content.classList.contains('expanded');
        const toggleText = btn.querySelector('.toggle-text');
        const toggleIcon = btn.querySelector('.toggle-icon');
        
        if (isExpanded) {
            content.classList.remove('expanded');
            btn.classList.remove('expanded');
            toggleText.textContent = t('showReleased');
            toggleIcon.textContent = '+';
        } else {
            content.classList.add('expanded');
            btn.classList.add('expanded');
            toggleText.textContent = t('hideReleased');
            toggleIcon.textContent = '−';
        }
    };
    
    // Initialize filter buttons
    function initFilters(releases) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                renderTimeline(releases, filter);
            });
        });
    }
    
    // Main initialization
    async function init() {
        try {
            // Wait for character data
            await waitForCharacterData();
            
            // Generate full schedule
            const releases = generateFullSchedule();
            
            // Render current banner
            renderCurrentBanner(releases);
            
            // Render timeline
            renderTimeline(releases);
            
            // Initialize filters
            initFilters(releases);
            
        } catch (error) {
            console.error('Schedule initialization failed:', error);
            const container = document.getElementById('timeline-container');
            if (container) {
                container.innerHTML = '<div class="empty-state">Failed to load schedule data.</div>';
            }
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
