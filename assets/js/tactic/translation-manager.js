/* ========== 중앙화된 번역 관리 시스템 ========== */

// 전역 변수
let characterDataReady = false;
let translationCallbacks = [];

// characterData 준비 상태 확인
function isCharacterDataReady() {
  const charData = window.characterData || (typeof characterData !== 'undefined' ? characterData : null);
  if (!charData || typeof charData !== 'object') return false;
  // 최소한의 데이터 확인 (원더, 렌, 레오 중 하나라도 있어야 함)
  return !!(charData['원더'] || charData['렌'] || charData['레오']);
}

// characterData 준비 완료 이벤트 발생
function notifyCharacterDataReady() {
  if (characterDataReady) return;
  characterDataReady = true;
  translationCallbacks.forEach(cb => {
    try { cb(); } catch (e) { console.error('Translation callback error:', e); }
  });
  translationCallbacks = [];
}

// characterData 준비 대기 후 콜백 실행
function whenCharacterDataReady(callback) {
  if (isCharacterDataReady()) {
    characterDataReady = true;
    try { callback(); } catch (e) { console.error('Translation callback error:', e); }
  } else {
    translationCallbacks.push(callback);
  }
}

// characterData 변경 감지 (주기적 체크)
(function() {
  let checkCount = 0;
  const maxChecks = 200; // 최대 20초
  
  const checkInterval = setInterval(() => {
    checkCount++;
    if (isCharacterDataReady() && !characterDataReady) {
      notifyCharacterDataReady();
      clearInterval(checkInterval);
    } else if (checkCount >= maxChecks) {
      clearInterval(checkInterval);
    }
  }, 100);
  
  // DOMContentLoaded, load 이벤트에서도 확인
  const tryNotify = () => {
    if (isCharacterDataReady() && !characterDataReady) {
      notifyCharacterDataReady();
      clearInterval(checkInterval);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryNotify);
  } else {
    tryNotify();
  }
  
  window.addEventListener('load', () => {
    setTimeout(tryNotify, 200);
  });
})();

// 전역 노출
window.isCharacterDataReady = isCharacterDataReady;
window.whenCharacterDataReady = whenCharacterDataReady;
window.notifyCharacterDataReady = notifyCharacterDataReady;




