// drive-sync.js - 수동 Google Drive 저장/불러오기 컨트롤러
(() => {
  function lang() {
    try { return (new URLSearchParams(location.search).get('lang') || 'kr').toLowerCase(); }
    catch(_) { return 'kr'; }
  }

  function labels() {
    const l = lang();
    const base = {
      save:  { kr:'Drive 저장', en:'Save to Drive',  jp:'Drive 保存' },
      load:  { kr:'Drive 불러오기', en:'Load from Drive', jp:'Drive 読み込み' },
      saved: { kr:'드라이브에 저장했습니다.', en:'Saved to Drive.', jp:'Drive に保存しました。' },
      loadedOk: { kr:'드라이브에서 불러왔습니다.', en:'Loaded from Drive.', jp:'Drive から読み込みました。' },
      loadedNone: { kr:'드라이브에 저장된 데이터가 없습니다.', en:'No data on Drive.', jp:'Drive に保存されたデータがありません。' },
      noLocal: { kr:'저장할 로컬 데이터가 없습니다.', en:'No local data to save.', jp:'保存するローカルデータがありません。' },
      needLogin: { kr:'먼저 상단 로그인 버튼으로 Google Drive에 로그인해 주세요.', en:'Please login to Google Drive first.', jp:'まず上部のログインボタンから Google Drive にログインしてください。' },
      failed: { kr:'작업에 실패했습니다. 잠시 후 다시 시도해 주세요.', en:'Operation failed. Please try again later.', jp:'操作に失敗しました。時間をおいて再度お試しください。' }
    };
    return {
      save: base.save[l] || base.save.kr,
      load: base.load[l] || base.load.kr,
      saved: base.saved[l] || base.saved.kr,
      loadedOk: base.loadedOk[l] || base.loadedOk.kr,
      loadedNone: base.loadedNone[l] || base.loadedNone.kr,
      noLocal: base.noLocal[l] || base.noLocal.kr,
      needLogin: base.needLogin[l] || base.needLogin.kr,
      failed: base.failed[l] || base.failed.kr
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
    document.addEventListener('DOMContentLoaded', initButtons);
  } else {
    initButtons();
  }
})();


