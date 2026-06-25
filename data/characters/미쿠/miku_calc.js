;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '미쿠';

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

  function apply() {
    hidePersonaUi();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(hidePersonaUi);
    }
    setTimeout(hidePersonaUi, 100);
    setTimeout(hidePersonaUi, 500);
  }

  markCharacterData();
  window.MikuCalc.apply = apply;
  window.MikuCalc.hidePersonaUi = hidePersonaUi;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
