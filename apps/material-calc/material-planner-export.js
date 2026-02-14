/* eslint-disable */
(function(){
    function $(sel){ return document.querySelector(sel); }
    function openModal(id){ const el = document.getElementById(id); if(el) el.setAttribute('aria-hidden','false'); }
    function closeModal(id){ const el = document.getElementById(id); if(el) el.setAttribute('aria-hidden','true'); }
  
    const Lang = (window.MaterialPlanner && typeof window.MaterialPlanner.getLang==='function')
      ? window.MaterialPlanner.getLang() : 'kr';
  
    const I18N = {
      kr: {
        backup: '백업',
        load: '불러오기',
        loadTitle: '불러오기 확인',
        loadMessage: '현재 상황이 지워집니다. 해당 파일로 덮어쓰시겠습니까?',
        yes: '예',
        no: '아니오',
        invalidFile: '파일 형식이 올바르지 않습니다.',
        loadError: '파일을 읽는 중 오류가 발생했습니다.',
        noPlanner: '플래너가 초기화되지 않았습니다.'
      },
      en: {
        backup: 'Backup',
        load: 'Load',
        loadTitle: 'Load Confirm',
        loadMessage: 'Your current inventory will be replaced. Continue?',
        yes: 'Yes',
        no: 'No',
        invalidFile: 'Invalid file format.',
        loadError: 'Failed to read the file.',
        noPlanner: 'Planner is not initialized.'
      },
      jp: {
        backup: 'バックアップ',
        load: 'ロード',
        loadTitle: 'ロードの確認',
        loadMessage: '現在の状況は削除され、読み込んだファイルで上書きされます。よろしいですか？',
        yes: 'はい',
        no: 'いいえ',
        invalidFile: 'ファイル形式が正しくありません。',
        loadError: 'ファイルの読み込み中にエラーが発生しました。',
        noPlanner: 'プランナーが初期化されていません。'
      }
    };
    const tpack = I18N[Lang] || I18N.kr;
  
    function localizeUI(){
      const backupBtn = $('#backupBtn');
      const loadBtn = $('#loadBtn');
      const title = $('#loadConfirmTitle');
      const msg = $('#loadConfirmMessage');
      const no = $('#loadNoBtn');
      const yes = $('#loadYesBtn');
  
      if(backupBtn) backupBtn.textContent = tpack.backup;
      if(loadBtn) loadBtn.textContent = tpack.load;
      if(title) title.textContent = tpack.loadTitle;
      if(msg) msg.textContent = tpack.loadMessage;
      if(yes) yes.textContent = tpack.yes;
      if(no) no.textContent = tpack.no;
    }
  
    function download(filename, text){
      const blob = new Blob([text], {type:'application/json;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
    }
  
    function onBackup(){
      if(!window.MaterialPlanner){ alert(tpack.noPlanner); return; }
      // 전체 상태 백업 우선, 없으면 기존 최소 상태로 폴백
      const hasFull = typeof window.MaterialPlanner.exportFullState === 'function';
      const full = hasFull ? window.MaterialPlanner.exportFullState() : null;
      const basic = (!full && typeof window.MaterialPlanner.exportState === 'function')
        ? window.MaterialPlanner.exportState() : null;
      const langVal = (full?.lang || basic?.lang || Lang);
      const ts = new Date();
      const pad = n => String(n).padStart(2,'0');
      const fname = `material_planner_backup_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.json`;

      let payload;
      if(full){
        payload = {
          type: 'material_planner_full_backup',
          version: 2,
          lang: langVal,
          timestamp: ts.toISOString(),
          state: full
        };
      }else{
        // 구버전(인벤토리 중심) 백업 포맷 유지
        payload = {
          type: 'material_planner_inventory_backup',
          version: 1,
          lang: langVal,
          timestamp: ts.toISOString(),
          inventory: basic?.inventory || {}
        };
      }
      download(fname, JSON.stringify(payload, null, 2));
    }
  
    // 파일 입력은 동적으로 생성해서 재사용
    let fileInput;
    function ensureFileInput(){
      if(fileInput) return fileInput;
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      return fileInput;
    }
  
    let pendingInventory = null;
    let pendingFullState = null;
  
    function onLoad(){
      const inp = ensureFileInput();
      inp.value = '';
      inp.onchange = async ()=>{
        const file = inp.files && inp.files[0];
        if(!file) return;
        try{
          const text = await file.text();
          const data = JSON.parse(text);
          pendingInventory = null; pendingFullState = null;
          // 포맷 판별: full 우선, 없으면 인벤토리
          if(data && typeof data==='object'){
            if(data.state && typeof data.state==='object'){
              pendingFullState = data.state;
            }else if(data.type === 'material_planner_full_backup' && data.version >= 2){
              // 혹시 state 누락 케이스 대비: 루트가 곧 상태일 수 있음
              pendingFullState = data;
            }else{
              // 유연성: inventory 키가 없으면 루트 객체를 시도
              const inv = (data.inventory && typeof data.inventory==='object') ? data.inventory : data;
              if(inv && typeof inv==='object') pendingInventory = inv;
            }
          }
          if(!pendingFullState && !pendingInventory){ alert(tpack.invalidFile); return; }
          // 모달 오픈
          openModal('loadConfirmModal');
        }catch(_){
          alert(tpack.loadError);
        }
      };
      inp.click();
    }
  
    function bindEvents(){
      const backupBtn = $('#backupBtn');
      const loadBtn = $('#loadBtn');
      const modal = $('#loadConfirmModal');
      const closeBtn = modal ? modal.querySelector('[data-close]') : null;
      const no = $('#loadNoBtn');
      const yes = $('#loadYesBtn');
  
      if(backupBtn && !backupBtn._bound){ backupBtn._bound = true; backupBtn.addEventListener('click', onBackup); }
      if(loadBtn && !loadBtn._bound){ loadBtn._bound = true; loadBtn.addEventListener('click', onLoad); }
  
      if(closeBtn && !closeBtn._bound){
        closeBtn._bound = true;
        closeBtn.addEventListener('click', ()=>{ pendingInventory = null; pendingFullState = null; closeModal('loadConfirmModal'); });
      }
      if(no && !no._bound){
        no._bound = true;
        no.addEventListener('click', ()=>{ pendingInventory = null; pendingFullState = null; closeModal('loadConfirmModal'); });
      }
      if(yes && !yes._bound){
        yes._bound = true;
        yes.addEventListener('click', ()=>{
          if(!window.MaterialPlanner){ alert(tpack.noPlanner); return; }
          // 전체 상태 복원 가능 시 우선 적용, 폴백으로 인벤토리만
          if(pendingFullState && typeof window.MaterialPlanner.importFullState==='function'){
            window.MaterialPlanner.importFullState(pendingFullState);
          } else if(pendingInventory){
            window.MaterialPlanner.importInventory(pendingInventory);
          }
          pendingInventory = null; pendingFullState = null;
          closeModal('loadConfirmModal');
        });
      }
    }
  
    function init(){
      localizeUI();
      bindEvents();
    }
  
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', init);
    }else{
      init();
    }
  })();