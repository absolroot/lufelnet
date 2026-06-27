;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '미쿠';
  var MUSIC_ICON_MAP = {
    H: 'music_HEAVEN.png',
    '고': 'music_고스트룰.png',
    '불': 'music_불장난.png',
    '춘': 'music_춘람.png'
  };
  var MUSIC_NAME_MAP = {
    kr: {
      H: 'Heaven',
      '고': '고스트 룰(ゴーストルール)',
      '불': '불장난(ヒアソビ)',
      '춘': '춘람(春嵐)'
    },
    en: {
      H: 'Heaven',
      '고': 'Ghost Rule',
      '불': 'Play-With-Fire',
      '춘': 'Spring Storm'
    },
    jp: {
      H: 'Ｈｅａｖｅｎ',
      '고': 'ゴーストルール',
      '불': 'ヒアソビ',
      '춘': '春嵐'
    },
    cn: {
      H: 'Heaven',
      '고': '幽灵法则',
      '불': '玩火',
      '춘': '春岚'
    }
  };

  window.MikuCalc = window.MikuCalc || {};
  window.MikuCalc[CHARACTER_NAME] = true;

  function isMikuPage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('name') === CHARACTER_NAME || window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    } catch (_) {
      return window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    }
  }

  function markCharacterData() {
    if (!window.characterData || !window.characterData[CHARACTER_NAME]) return;
    var character = window.characterData[CHARACTER_NAME];
    character.hidePersonaName = true;
  }

  function hidePersonaUi() {
    if (!isMikuPage()) return;
    markCharacterData();

    var personaName = document.querySelector('.persona-name');
    if (personaName) {
      personaName.innerHTML = '';
      personaName.style.display = 'none';
    }

  }

  function getMusicIconUrl(fileName) {
    var base = (typeof BASE_URL !== 'undefined') ? BASE_URL : '';
    return base + '/data/characters/' + CHARACTER_NAME + '/' + fileName;
  }

  function getCurrentLanguage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var langParam = params.get('lang');
      if (langParam === 'en' || langParam === 'jp' || langParam === 'cn' || langParam === 'kr') return langParam;

      var path = window.location.pathname || '';
      if (path.indexOf('/en/') !== -1) return 'en';
      if (path.indexOf('/jp/') !== -1) return 'jp';
      if (path.indexOf('/cn/') !== -1) return 'cn';
      return 'kr';
    } catch (_) {
      return 'kr';
    }
  }

  function getMusicName(musicKey) {
    var lang = getCurrentLanguage();
    var names = MUSIC_NAME_MAP[lang] || MUSIC_NAME_MAP.kr;
    return names[musicKey] || (MUSIC_NAME_MAP.kr && MUSIC_NAME_MAP.kr[musicKey]) || musicKey;
  }

  function ensureMusicIconStyles() {
    if (document.getElementById('miku-music-operation-style')) return;

    var style = document.createElement('style');
    style.id = 'miku-music-operation-style';
    style.textContent = [
      '.skill-step.miku-music-step {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 3px;',
      '  min-width: 36px;',
      '}',
      '.miku-music-icon {',
      '  width: 18px;',
      '  height: 18px;',
      '  object-fit: contain;',
      '  flex: 0 0 18px;',
      '  vertical-align: middle;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderMusicStep(step, skillNumber, musicKey) {
    var fileName = MUSIC_ICON_MAP[musicKey];
    if (!fileName) return;
    var musicName = getMusicName(musicKey);

    step.textContent = '';
    step.classList.add('miku-music-step', 'tooltip-text');
    step.setAttribute('data-miku-music', musicKey);
    step.setAttribute('data-tooltip', musicName);
    step.setAttribute('aria-label', musicName);
    step.setAttribute('tabindex', '0');
    step.removeAttribute('title');

    var number = document.createElement('span');
    number.className = 'miku-skill-number';
    number.textContent = skillNumber;

    var icon = document.createElement('img');
    icon.className = 'miku-music-icon';
    icon.src = getMusicIconUrl(fileName);
    icon.alt = musicName;
    icon.loading = 'lazy';
    icon.decoding = 'async';

    step.appendChild(number);
    step.appendChild(icon);

    if (typeof window.bindTooltipElement === 'function') {
      window.bindTooltipElement(step);
    } else if (typeof bindTooltipElement === 'function') {
      bindTooltipElement(step);
    }
  }

  function applyMusicIcons() {
    if (!isMikuPage()) return;

    ensureMusicIconStyles();

    document.querySelectorAll('.operation-settings .skill-step').forEach(function (step) {
      var raw = (step.textContent || '').trim();
      var match = raw.match(/^([1-3])\s*(H|고|불|춘)$/);
      if (!match) return;

      renderMusicStep(step, match[1], match[2]);
    });
  }

  var observerStarted = false;
  function observeOperationRerenders() {
    if (observerStarted || !isMikuPage() || typeof MutationObserver === 'undefined') return;

    var target = document.querySelector('.operation-levels');
    if (!target) {
      setTimeout(observeOperationRerenders, 100);
      return;
    }

    observerStarted = true;
    var pending = false;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () {
        pending = false;
        applyMusicIcons();
      }, 0);
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  function apply() {
    hidePersonaUi();
    applyMusicIcons();
    observeOperationRerenders();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        hidePersonaUi();
        applyMusicIcons();
      });
    }
    setTimeout(function () {
      hidePersonaUi();
      applyMusicIcons();
      observeOperationRerenders();
    }, 100);
    setTimeout(function () {
      hidePersonaUi();
      applyMusicIcons();
      observeOperationRerenders();
    }, 500);
  }

  markCharacterData();
  window.MikuCalc.apply = apply;
  window.MikuCalc.hidePersonaUi = hidePersonaUi;
  window.MikuCalc.applyMusicIcons = applyMusicIcons;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
