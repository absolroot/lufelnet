// drive-sync.js - 수동 Google Drive 저장/불러오기 컨트롤러
(() => {
  function tr(key, fallback) {
    try {
      if (window.PullTrackerI18n && typeof window.PullTrackerI18n.t === 'function') {
        return window.PullTrackerI18n.t(key, fallback);
      }
    } catch (_) { }
    return fallback || key;
  }

  function labels() {
    return {
      save: tr('io.drive.saveLabel', 'Drive 저장'),
      load: tr('io.drive.loadLabel', 'Drive 불러오기'),
      saved: tr('io.drive.saved', '드라이브에 저장했습니다.'),
      loadedOk: tr('io.drive.loadedOk', '드라이브에서 불러왔습니다.'),
      loadedNone: tr('io.drive.loadedNone', '드라이브에 저장된 데이터가 없습니다.'),
      noLocal: tr('io.drive.noLocal', '저장할 로컬 데이터가 없습니다.'),
      needLogin: tr('io.drive.needLogin', '먼저 상단 로그인 버튼으로 Google Drive에 로그인해 주세요.'),
      failed: tr('io.drive.failed', '작업에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    };
  }

  function setStatus(msg) {
    try {
      const el = document.getElementById('status');
      if (el) el.textContent = msg || '';
    } catch(_) {}
  }

  async function onDriveSave() {
    const t = labels();
    try {
      if (typeof window.pullTrackerSyncToCloud !== 'function') {
        setStatus(t.failed);
        return;
      }
      const r = await window.pullTrackerSyncToCloud();
      if (r === true) {
        setStatus(t.saved);
      } else if (r === 'AUTH') {
        setStatus(t.needLogin);
      } else if (r === 'EMPTY') {
        setStatus(t.noLocal);
      } else {
        setStatus(t.failed);
      }
    } catch(_) {
      setStatus(t.failed);
    }
  }

  async function onDriveLoad() {
    const t = labels();
    try {
      if (typeof window.pullTrackerLoadFromCloud !== 'function') {
        setStatus(t.failed);
        return;
      }

      // 기존 로컬 데이터가 있는 경우 병합/덮어쓰기 선택 (커스텀 다이얼로그)
      let merge = false;
      try {
        const existing = localStorage.getItem('pull-tracker:merged');
        if (existing && typeof window.pullTrackerChooseMergeMode === 'function') {
          const mode = await window.pullTrackerChooseMergeMode('drive');
          if (mode === null) return;
          merge = (mode === 'merge');
        } else if (existing) {
          // 헬퍼가 없으면 기본은 병합
          merge = true;
        }
      } catch(_) {}

      const ok = await window.pullTrackerLoadFromCloud({ interactive: true, merge });
      if (ok === true) {
        setStatus(t.loadedOk);
      } else if (ok === 'EMPTY') {
        setStatus(t.loadedNone);
      } else if (ok === 'AUTH') {
        setStatus(t.needLogin);
      } else {
        setStatus(t.failed);
      }
    } catch(_) {
      setStatus(t.failed);
    }
  }

  function initButtons() {
    try {
      const t = labels();
      const saveBtn = document.getElementById('driveSaveBtn');
      const loadBtn = document.getElementById('driveLoadBtn');
      if (saveBtn) {
        saveBtn.textContent = t.save;
        saveBtn.addEventListener('click', onDriveSave);
      }
      if (loadBtn) {
        loadBtn.textContent = t.load;
        loadBtn.addEventListener('click', onDriveLoad);
      }
    } catch(_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try { await (window.__pullI18nReady || Promise.resolve()); } catch (_) { }
      initButtons();
    });
  } else {
    (async () => {
      try { await (window.__pullI18nReady || Promise.resolve()); } catch (_) { }
      initButtons();
    })();
  }
})();


