(function () {
    'use strict';

    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'en') return 'en';
        if (langParam === 'jp') return 'jp';

        const path = window.location.pathname;
        if (path.includes('/en/')) return 'en';
        if (path.includes('/jp/')) return 'jp';
        return 'kr';
    }

    function t(key, fallback) {
        if (typeof window.t === 'function') {
            try {
                return window.t(key, fallback);
            } catch (_) {}
        }
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            const result = window.I18nService.t(key, fallback);
            if (result && result !== key) return result;
        }
        return fallback;
    }

    function applyNameTemplate(template, name, fallbackNoName) {
        if (!name) return fallbackNoName;
        return String(template || '').replace(/\{name\}/g, name);
    }

    function pickFirstYoutubeId(value) {
        if (!value) return '';
        if (Array.isArray(value)) {
            for (const v of value) {
                if (typeof v === 'string' && v.trim()) return v.trim();
            }
            return '';
        }
        if (typeof value === 'string') return value.trim();
        return '';
    }

    function normalizeYoutubeIdList(value) {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value
                .filter(v => typeof v === 'string')
                .map(v => v.trim())
                .filter(v => v);
        }
        if (typeof value === 'string') {
            const v = value.trim();
            return v ? [v] : [];
        }
        return [];
    }

    function resolveVideoId(character, characterName) {
        if (!character) return '';
        
        // characterSetting에서 video 데이터 병합
        const setting = (characterName && window.characterSetting && window.characterSetting[characterName]) ? window.characterSetting[characterName] : {};
        const mergedCharacter = { ...character, ...setting };

        const lang = getCurrentLanguage();
        if (lang === 'en') {
            const enId = pickFirstYoutubeId(mergedCharacter.video_en);
            if (enId) return enId;
            return pickFirstYoutubeId(mergedCharacter.video);
        }
        else if(lang === 'jp') {
            const jpId = pickFirstYoutubeId(mergedCharacter.video_jp);
            if (jpId) return jpId;
            return pickFirstYoutubeId(mergedCharacter.video);
        }

        return pickFirstYoutubeId(mergedCharacter.video);
    }

    function resolveVideoIds(character, characterName) {
        if (!character) return [];
        
        // characterSetting에서 video 데이터 병합
        const setting = (characterName && window.characterSetting && window.characterSetting[characterName]) ? window.characterSetting[characterName] : {};
        const mergedCharacter = { ...character, ...setting };

        const lang = getCurrentLanguage();
        if (lang === 'en') {
            const enList = normalizeYoutubeIdList(mergedCharacter.video_en);
            if (enList.length > 0) return enList;
            return normalizeYoutubeIdList(mergedCharacter.video);
        }
        else if(lang === 'jp') {
            const jpList = normalizeYoutubeIdList(mergedCharacter.video_jp);
            if (jpList.length > 0) return jpList;
            return normalizeYoutubeIdList(mergedCharacter.video);
        }

        return normalizeYoutubeIdList(mergedCharacter.video);
    }

    function removeExistingVideo(tagEl) {
        try {
            document.querySelectorAll('.character-video').forEach(n => {
                try { n.remove(); } catch (_) { }
            });
        } catch (_) { }
    }

    function buildArrowSvg(direction) {
        if (direction === 'prev') {
            return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    function buildPlaySvg() {
        return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8L16 12L10 16V8Z" fill="white"/></svg>';
    }

    function getBaseUrl() {
        try {
            if (typeof window.BASE_URL !== 'undefined' && window.BASE_URL !== null) {
                return String(window.BASE_URL);
            }
        } catch (_) { }
        return '';
    }

    function isTouchLike() {
        try {
            if ('ontouchstart' in window) return true;
            if (navigator && navigator.maxTouchPoints && navigator.maxTouchPoints > 0) return true;
        } catch (_) { }
        return false;
    }

    function ensureVideoOrTag(characterName, character) {
        const tagEl = document.querySelector('.chracter-tag');
        if (!tagEl) return;

        removeExistingVideo(tagEl);

        const videoIds = resolveVideoIds(character, characterName);
        if (!videoIds || videoIds.length === 0) {
            tagEl.style.display = '';
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'character-video';

        const stage = document.createElement('div');
        stage.className = 'character-video-stage';

        const iframe = document.createElement('iframe');
        const iframeTitleTemplate = t('characterVideoIframeTitle', '{name} 영상');
        const iframeTitleFallback = t('characterVideoIframeTitleFallback', '캐릭터 영상');
        iframe.title = applyNameTemplate(iframeTitleTemplate, characterName, iframeTitleFallback);
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;

        const dots = document.createElement('div');
        dots.className = 'character-video-dots';

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'character-video-nav prev';
        prevBtn.setAttribute('aria-label', t('characterVideoAriaPrev', '이전 영상'));
        prevBtn.innerHTML = buildArrowSvg('prev');

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'character-video-nav next';
        nextBtn.setAttribute('aria-label', t('characterVideoAriaNext', '다음 영상'));
        nextBtn.innerHTML = buildArrowSvg('next');

        let index = 0;

        const renderPoster = (videoId) => {
            stage.innerHTML = '';

            const poster = document.createElement('div');
            poster.className = 'character-video-poster';

            const img = document.createElement('img');
            const thumbnailAltTemplate = t('characterVideoThumbnailAlt', '{name} 영상 썸네일');
            const thumbnailAltFallback = t('characterVideoThumbnailAltFallback', '영상 썸네일');
            img.alt = applyNameTemplate(thumbnailAltTemplate, characterName, thumbnailAltFallback);
            img.src = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;

            const overlay = document.createElement('div');
            overlay.className = 'character-video-overlay';

            const playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.className = 'character-video-play';
            const playLabel = t('characterVideoAriaPlay', '재생');
            playBtn.setAttribute('aria-label', playLabel);
            const playImg = document.createElement('img');
            playImg.className = 'character-video-play-img';
            playImg.alt = playLabel;
            playImg.src = `${getBaseUrl()}/assets/img/character-detail/play_btn.png`;
            playBtn.appendChild(playImg);
            playBtn.addEventListener('click', () => {
                loadPlayer(videoId);
            });

            poster.appendChild(img);
            poster.appendChild(overlay);
            poster.appendChild(playBtn);
            stage.appendChild(poster);
        };

        const loadPlayer = (videoId) => {
            stage.innerHTML = '';
            iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
            stage.appendChild(iframe);
        };

        const setActive = (nextIndex) => {
            const len = videoIds.length;
            if (len <= 0) return;
            index = ((nextIndex % len) + len) % len;

            const videoId = videoIds[index];
            renderPoster(videoId);

            try {
                dots.querySelectorAll('button').forEach((b, i) => {
                    if (i === index) b.classList.add('active');
                    else b.classList.remove('active');
                });
            } catch (_) { }
        };

        if (videoIds.length > 1) {
            videoIds.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'character-video-dot';
                dot.setAttribute('aria-label', `Video ${i + 1}`);
                dot.addEventListener('click', () => setActive(i));
                dots.appendChild(dot);
            });

            prevBtn.addEventListener('click', () => setActive(index - 1));
            nextBtn.addEventListener('click', () => setActive(index + 1));
        }

        if (isTouchLike() && videoIds.length > 1) {
            let startX = 0;
            let startY = 0;
            let moved = false;
            let locked = false;

            wrap.addEventListener('touchstart', (e) => {
                try {
                    const t = e.touches && e.touches[0];
                    if (!t) return;
                    startX = t.clientX;
                    startY = t.clientY;
                    moved = false;
                    locked = false;
                } catch (_) { }
            }, { passive: true });

            wrap.addEventListener('touchmove', (e) => {
                try {
                    const t = e.touches && e.touches[0];
                    if (!t) return;
                    const dx = t.clientX - startX;
                    const dy = t.clientY - startY;
                    if (!locked) {
                        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
                            locked = true;
                        } else if (Math.abs(dy) > 10) {
                            locked = false;
                            return;
                        }
                    }
                    if (locked) {
                        moved = true;
                        e.preventDefault();
                    }
                } catch (_) { }
            }, { passive: false });

            wrap.addEventListener('touchend', (e) => {
                try {
                    if (!moved || !locked) return;
                    const t = (e.changedTouches && e.changedTouches[0]) || null;
                    if (!t) return;
                    const dx = t.clientX - startX;
                    const dy = t.clientY - startY;
                    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                        if (dx < 0) setActive(index + 1);
                        else setActive(index - 1);
                    }
                } catch (_) { }
            }, { passive: true });
        }

        wrap.appendChild(stage);
        if (videoIds.length > 1) {
            wrap.appendChild(prevBtn);
            wrap.appendChild(nextBtn);
            wrap.appendChild(dots);
        }

        setActive(0);

        const isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
        if (isMobile) {
            const imagesEl = document.querySelector('.character-images');
            if (imagesEl && imagesEl.parentNode) {
                imagesEl.parentNode.insertBefore(wrap, imagesEl.nextSibling);
            } else {
                tagEl.parentNode.insertBefore(wrap, tagEl);
            }
        } else {
            tagEl.parentNode.insertBefore(wrap, tagEl);
        }
        tagEl.style.display = 'none';
    }

    function getCharacterFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || window.__CHARACTER_DEFAULT || '';
        const character = (name && window.characterData) ? window.characterData[name] : null;
        // characterSetting에서 video 데이터 병합
        const setting = (name && window.characterSetting && window.characterSetting[name]) ? window.characterSetting[name] : {};
        const mergedCharacter = character ? { ...character, ...setting } : null;
        return { name, character: mergedCharacter };
    }

    window.applyCharacterVideo = function applyCharacterVideo(characterName, character) {
        try {
            const resolvedName = characterName || getCharacterFromUrl().name;
            const resolvedCharacter = character || getCharacterFromUrl().character;
            ensureVideoOrTag(resolvedName, resolvedCharacter);
        } catch (e) {
            console.warn('[cha_video] applyCharacterVideo failed', e);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const safeApply = () => {
            if (typeof window.applyCharacterVideo === 'function') {
                const { name, character } = getCharacterFromUrl();
                window.applyCharacterVideo(name, character);
            }
        };

        const tagEl = document.querySelector('.chracter-tag');
        if (!tagEl) {
            setTimeout(safeApply, 100);
            return;
        }

        const maybeApply = () => {
            safeApply();
        };

        const obs = new MutationObserver(() => maybeApply());
        try {
            obs.observe(tagEl, { childList: true, subtree: true, characterData: true });
        } catch (_) { }

        setTimeout(maybeApply, 0);
        setTimeout(maybeApply, 200);
        setTimeout(maybeApply, 800);

        window.addEventListener('languageDetected', () => {
            setTimeout(maybeApply, 0);
        });
    });
})();
