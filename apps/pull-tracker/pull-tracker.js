(() => {
    // Simple local i18n
    const messages = {
        kr: {
            pageTitle: 'Pull Tracker',
            navCurrent: 'Pull Tracker',
            inputLabel: '가챠 기록 URL',
            placeholder: '여기에 주소를 붙여넣기...',
            start: '가져오기',
            clear: '초기화',
            infoReady: '가챠 기록 URL을 입력하고 가져오기를 누르세요.',
            infoNotice: '최근 90일 동안의 기록만 가져옵니다. 이전 기록은 게임 서버에서 제공되지 않습니다.\n가챠 시도 횟수가 많은 경우 로딩에 5분 이상 걸릴 수 있습니다.',
            loadingTitle: '서버에서 기록을 조회 중입니다...',
            loadingDetail: '네트워크 상태와 서버 부하에 따라 시간이 걸릴 수 있습니다.',
            noticeLong: '최근 90일 뽑기 횟수에 따라 10분 이상 소요될 수 있습니다. 처리 중에는 브라우저 창을 닫지 말아주세요.',
            elapsed: (m, s) => `경과 시간: ${m}분 ${s}초`,
            sending: '요청 전송 중...',
            waiting: '서버 응답 대기 중...',
            tryGet: '진행 중...', // POST 실패 GET 진행 
            invalidUrl: '유효한 URL을 입력하세요.',
            done: (bytes) => `완료 (응답 바이트: ${bytes})`,
            failed: '요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            confirmReset: '정말 초기화할까요?\n이 작업은 저장된 가챠 데이터(마지막 URL/응답 포함)를 모두 삭제합니다.',
            loadedDrive: '클라우드(Drive)에서 불러왔습니다.',
            loadedLocal: '로컬 저장본에서 불러왔습니다.',
            savedDrive: '클라우드(Drive)에 저장되었습니다.',
            savedLocal: '로컬에 저장되었습니다.',
            deletedDrive: '클라우드(Drive)에서 삭제했습니다.',
            deleteDriveFailed: '클라우드(Drive) 삭제에 실패했습니다.',
            driveForbidden: 'Google Drive 접근이 거부되었습니다. (403) 권한 또는 설정을 확인하세요.',
            driveNeedConsent: '드라이브 접근 권한이 필요합니다. 상단 로그인 버튼을 눌러 권한을 승인해 주세요.',
            driveNoData: '드라이브에 저장된 데이터가 없습니다.'
        },
        en: {
            pageTitle: 'Pull Tracker',
            navCurrent: 'Pull Tracker',
            inputLabel: 'Gacha Records URL',
            placeholder: 'Paste the link here...',
            start: 'Fetch',
            clear: 'Clear',
            infoReady: 'Paste your gacha records URL and press Fetch.',
            infoNotice: 'Only the last 90 days of records can be fetched. Older records are not provided by game servers.\nIf you have many pulls, loading may take 5+ minutes.',
            loadingTitle: 'Fetching records from the server...',
            loadingDetail: 'Depending on network and server load, it can take some time.',
            noticeLong: 'If you have many pulls in the last 90 days, it may take 10+ minutes. Please keep the browser open during processing.',
            elapsed: (m, s) => `Elapsed: ${m}m ${s}s`,
            sending: 'Sending request...',
            waiting: 'Waiting for server response...',
            tryGet: 'Processing...',
            invalidUrl: 'Please enter a valid URL.',
            done: (bytes) => `Done (response bytes: ${bytes})`,
            failed: 'Something went wrong. Please try again later.',
            confirmReset: 'Are you sure you want to reset?\nThis will delete all stored gacha data (including last URL/response).',
            loadedDrive: 'Loaded from Drive.',
            loadedLocal: 'Loaded from local cache.',
            savedDrive: 'Saved to Drive.',
            savedLocal: 'Saved locally.',
            deletedDrive: 'Deleted from Drive.',
            deleteDriveFailed: 'Failed to delete from Drive.',
            driveForbidden: 'Google Drive access forbidden (403). Please review permissions/settings.',
            driveNeedConsent: 'Drive permission is required. Click Login to grant access.',
            driveNoData: 'No saved data found on Drive.'
        },
        jp: {
            pageTitle: 'Pull Tracker',
            navCurrent: 'Pull Tracker',
            inputLabel: '祈願履歴 URL',
            placeholder: 'ここにリンクを貼り付けてください...',
            start: '取得',
            clear: 'クリア',
            infoReady: '祈願履歴のURLを貼り付けて、取得を押してください。',
            infoNotice: '直近90日の記録のみ取得できます。以前の記録はゲームサーバーでは提供されません。\n試行回数が多い場合、読み込みに5分以上かかることがあります。',
            loadingTitle: 'サーバーから履歴を取得しています...',
            loadingDetail: 'ネットワーク状況やサーバー負荷により時間がかかる場合があります。',
            noticeLong: '直近90日のガチャ数によっては10分以上かかる場合があります。処理中はブラウザを閉じないでください。',
            elapsed: (m, s) => `経過時間: ${m}分 ${s}秒`,
            sending: 'リクエスト送信中...',
            waiting: 'サーバーの応答を待機中...',
            tryGet: '処理中...',
            invalidUrl: '有効なURLを入力してください。',
            done: (bytes) => `完了（応答バイト数: ${bytes}）`,
            failed: 'エラーが発生しました。時間をおいて再度お試しください。',
            confirmReset: '本当に初期化しますか？\nこの操作により、保存されたガチャデータ(最後のURL/レスポンスを含む)がすべて削除されます。',
            loadedDrive: 'Drive から読み込みました。',
            loadedLocal: 'ローカルから読み込みました。',
            savedDrive: 'Drive に保存しました。',
            savedLocal: 'ローカルに保存しました。',
            deletedDrive: 'Drive から削除しました。',
            deleteDriveFailed: 'Drive の削除に失敗しました。',
            driveForbidden: 'Google Drive へのアクセスが拒否されました（403）。権限や設定をご確認ください。',
            driveNeedConsent: 'Drive へのアクセス許可が必要です。上部のログインを押して許可してください。',
            driveNoData: 'Drive に保存されたデータがありません。'
        }
    };

    const lang = (new URLSearchParams(location.search).get('lang') || 'kr').toLowerCase();
    const DEBUG = false;
    const VERBOSE_LOG = false; // DEBUG 출력 중 상세 로그는 별도 플래그로 제어
    const t = messages[lang] || messages.kr;

    const els = {
        title: document.getElementById('pageTitle'),
        navCurrent: document.getElementById('navCurrent'),
        inputLabel: document.getElementById('inputLabel'),
        input: document.getElementById('sourceUrl'),
        start: document.getElementById('startBtn'),
        clear: document.getElementById('clearBtn'),
        info: document.getElementById('info'),
        status: document.getElementById('status'),
        result: document.getElementById('result'),
        cards: document.getElementById('cards'),
        cardsTitle: document.getElementById('cardsTitle'),
        overview: document.getElementById('overview')
    };

    function applyTexts() {
        if (els.title) els.title.textContent = t.pageTitle;
        if (els.navCurrent) els.navCurrent.textContent = t.navCurrent;
        if (els.inputLabel) els.inputLabel.textContent = t.inputLabel;
        if (els.input) els.input.setAttribute('placeholder', t.placeholder);
        if (els.start) els.start.textContent = t.start;
        if (els.clear) els.clear.textContent = t.clear;
        if (els.info) els.info.innerHTML = `${t.infoReady}<br>${t.infoNotice}`;
        const hide4 = document.getElementById('hide4Label');
        if (hide4) hide4.textContent = (lang==='en'?'Hide under 4★': (lang==='jp'?'4★ 以下を隠す':'4★ 이하 숨기기'));
        if (els.cardsTitle) {
            const map = { kr: '요약 카드 (최근 90일)', en: 'Stats (Last 90 Days)', jp: '統計（直近90日）' };
            els.cardsTitle.textContent = map[lang] || map.kr;
        }
        // auth bar labels
        try {
            const signed = document.getElementById('ptUserSignedAs');
            const loginBtn = document.getElementById('ptLoginBtn');
            const logoutBtn = document.getElementById('ptLogoutBtn');
            if (signed) signed.textContent = (lang==='en'?'Signed in:': (lang==='jp'?'ログイン:':'로그인:'));
            if (loginBtn) loginBtn.textContent = (lang==='en'?'Login': (lang==='jp'?'ログイン':'로그인'));
            if (logoutBtn) logoutBtn.textContent = (lang==='en'?'Logout': (lang==='jp'?'ログアウト':'로그아웃'));
        } catch(_) {}
    }

    // DEBUG 예시 UI 바인딩 (DOM 생성 이후)
    document.addEventListener('DOMContentLoaded', function(){
        try {
            const box = document.getElementById('debugExamples');
            if (!box) return;
            if (DEBUG) box.style.display = 'flex';
            const btn = document.getElementById('applyExampleBtn');
            const sel = document.getElementById('exampleSelect');
            if (btn && sel) {
                btn.addEventListener('click', async () => {
                    try {
                        const n = String(sel.value||'1');
                        const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                        const url = `${base}/apps/pull-tracker/example${n==='1'?'':n}.json?v=${Date.now()}`;
                        const res = await fetch(url);
                        if (!res.ok) throw new Error('example fetch failed');
                        const text = await res.text();
                        setResult(text);
                        try { localStorage.setItem('pull-tracker:last-response', text); } catch(_) {}
                        const incoming = JSON.parse(text);
                        const merged = mergeWithCache(incoming);
                        localStorage.setItem('pull-tracker:merged', JSON.stringify(merged));
                        renderCardsFromExample(merged);
                        const beforeAuthed = __googleAuthed;
                        await syncMergedToCloud();
                        if (__googleAuthed) { __dataSource = 'drive'; setStatus(`${t.savedDrive} ${nowStamp()}\n✅ 완료`); }
                        else { __dataSource = 'local'; setStatus(`${t.savedLocal} ${nowStamp()}\n✅ 완료`); }
                    } catch(e){ setStatus('예시 적용 실패'); }
                });
            }
        } catch(_) {}
    });

    // --- Google Drive 로그인/동기화 ---
    let __googleAuthed = false;
    let __googleToken = null;
    let __tokenExpAt = 0;
    let tokenClient = null;
    const DRIVE_FILE_NAME = 'p5x_pull_tracker.json'; // 기본 파일명
    const DEBUG_FOLDER_NAME = 'lufelnet_test'; // DEBUG 시 일반 드라이브 폴더
    const APP_FILE_TAG = 'lufelnet'; // appProperties.ownerApp 태그

    function gapiLoad() {
        return new Promise(resolve => {
            try {
                if (window.gapi && gapi.client) return resolve();
                const tick = setInterval(() => {
                    if (window.gapi) { clearInterval(tick); gapi.load('client', resolve); }
                }, 50);
            } catch(_) { resolve(); }
        });
    }

    // GIS 하드닝: 사용자 제스처 없이 popup flow가 시작되지 않도록 차단
    (function hardenGIS(){
        const tryPatch = () => {
            try {
                if (!window.google || !google.accounts || !google.accounts.oauth2) return;
                if (google.__pt_hardened) return;
                const origInit = google.accounts.oauth2.initTokenClient;
                if (typeof origInit !== 'function') return;
                google.accounts.oauth2.initTokenClient = function(config){
                    const client = origInit(config);
                    const origReq = client.requestAccessToken && client.requestAccessToken.bind(client);
                    if (typeof origReq === 'function') {
                        client.requestAccessToken = function(options){
                            const promptVal = (options && options.prompt) || (config && config.prompt) || undefined;
                            const allow = !!window.__pt_allowInteractive || promptVal === '';
                            if (!allow) {
                                if (VERBOSE_LOG) console.log('[pull-tracker] blocked requestAccessToken without user gesture');
                                return; // 차단
                            }
                            return origReq(options);
                        };
                    }
                    return client;
                };
                google.__pt_hardened = true;
            } catch(_) {}
        };
        window.__pt_allowInteractive = false;
        const id = setInterval(()=>{ tryPatch(); if (window.google && google.__pt_hardened) clearInterval(id); }, 60);
        document.addEventListener('DOMContentLoaded', tryPatch);
    })();

    // Token client (silent refresh)
    function initTokenClientOnce(){
        if (tokenClient) return tokenClient;
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: window.GOOGLE_CLIENT_ID,
                scope: 'openid email https://www.googleapis.com/auth/drive.appdata',
                callback: (resp) => {
                    if (resp && resp.access_token) {
                        __googleToken = resp.access_token;
                        __googleAuthed = true;
                        const sec = Number(resp.expires_in || 3600);
                        __tokenExpAt = Date.now() + Math.max(0, (sec - 60) * 1000);
                        try { localStorage.setItem('pull-tracker:google-token', __googleToken); } catch(_) {}
                        localStorage.setItem('pull-tracker:google-exp', String(__tokenExpAt));
                    }
                }
            });
        } catch(_) {}
        return tokenClient;
    }

    async function ensureTokenSilent(){
        try {
            // 저장된 토큰이 없으면 절대 무팝업 요청을 시도하지 않음 (사용자 클릭 전 UI 노출 방지)
            if (!__googleToken) return false;
            if (Date.now() < __tokenExpAt) return true;
            initTokenClientOnce();
            return await new Promise((resolve)=>{
                try {
                    tokenClient.callback = (resp)=>{ resolve(!!(resp && resp.access_token)); };
                    tokenClient.requestAccessToken({ prompt: '' }); // 무팝업 갱신만
                } catch(_) { resolve(false); }
            });
        } catch(_) { return false; }
    }

    async function tokenHas(scopeSubstr){
        if (!__googleToken) return false;
        try {
            const r = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + encodeURIComponent(__googleToken));
            const j = await r.json();
            return typeof j.scope === 'string' && j.scope.includes(scopeSubstr);
        } catch(_) { return false; }
    }

    // 공통: Drive API 호출 래퍼 (401/403 시 선택적으로 재인증)
    async function driveFetch(url, options = {}, interactive = false) {
        let res = await fetch(url, options);
        try {
            if (res.status === 403) {
                const txt = await res.clone().text();
                if (/storageQuotaExceeded/i.test(txt)) {
                    setStatus(lang==='en' ? 'Google Drive storage quota exceeded. Please free up space.' : (lang==='jp' ? 'Google ドライブの保存容量が上限に達しました。空き容量を確保してください。' : 'Google 드라이브 저장 용량이 초과되었습니다. 공간을 확보해주세요.'));
                }
            }
        } catch(_) {}
        // 재인증은 401(만료/무효 토큰)에 한정. 403은 권한/정책/쿼터 이슈일 수 있어 재팝업 금지
        if (res.status === 401 && interactive) {
            try { await gapiInit(); await googleSignIn(); } catch(_) {}
            res = await fetch(url, { ...options, headers: { ...(options.headers||{}), Authorization: 'Bearer ' + __googleToken } });
        }
        return res;
    }

    async function gapiInit() {
        try {
            await gapiLoad();
            await gapi.client.init({
                apiKey: '',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            });
        } catch(_) {}
    }

    function renderAuthBarUI(profile) {
        const bar = document.getElementById('ptUserBar');
        const nameEl = document.getElementById('ptUserName');
        const loginBtn = document.getElementById('ptLoginBtn');
        const logoutBtn = document.getElementById('ptLogoutBtn');
        if (!bar || !loginBtn || !logoutBtn) return;
        bar.style.display = 'flex';
        if (profile) {
            if (nameEl) nameEl.textContent = profile?.email || profile?.name || 'Google Drive';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            try { localStorage.setItem('pull-tracker:google-token', __googleToken||''); } catch(_) {}
        } else {
            if (nameEl) nameEl.textContent = '';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            try { localStorage.removeItem('pull-tracker:google-token'); } catch(_) {}
        }
    }

    // DEBUG 모드에서도 drive.file 범위는 사용하지 않음(예시 제출만 허용)
    const OAUTH_SCOPE = 'openid email https://www.googleapis.com/auth/drive.appdata';

    async function googleSignIn() {
        return new Promise((resolve) => {
            try {
            // 사용자 제스처 구간: 인터랙티브 허용
            const prev = window.__pt_allowInteractive;
            window.__pt_allowInteractive = true;
            const client = google.accounts.oauth2.initTokenClient({
                client_id: window.GOOGLE_CLIENT_ID,
                scope: OAUTH_SCOPE,
                callback: async (resp) => {
                __googleToken = resp.access_token;
                __googleAuthed = true;
                try {
                    const sec = Number(resp.expires_in || 3600);
                    __tokenExpAt = Date.now() + Math.max(0, (sec - 60) * 1000);
                    localStorage.setItem('pull-tracker:google-token', __googleToken);
                    localStorage.setItem('pull-tracker:google-exp', String(__tokenExpAt));
                } catch(_) {}
                // 2) 사용자 정보 가져오기 (OIDC userinfo)
                let profile = null;
                try {
                    const r = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
                    headers: { Authorization: 'Bearer ' + __googleToken }
                    });
                    profile = r.ok ? await r.json() : null; // { email, name, ... }
                } catch(_) {}
                try { if (profile && profile.email) localStorage.setItem('pull-tracker:google-email', profile.email); } catch(_) {}
                renderAuthBarUI(profile || { email: (localStorage.getItem('pull-tracker:google-email')||'') });
                window.__pt_allowInteractive = prev;
                resolve(resp);
                }
            });
            client.requestAccessToken(); // 최초 동의 이후엔 prompt 없이 재발급됨
            } catch(e) { try { window.__pt_allowInteractive = false; } catch(_) {}; resolve(null); }
        });
    }
      

    function googleSignOut(){ __googleAuthed = false; __googleToken = null; renderAuthBarUI(null); }

    async function driveFetchFileId(interactive = false) {
        try {
            if (!__googleToken) return null;
            const q = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and 'appDataFolder' in parents and trashed=false`);
            const url = `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=appDataFolder&fields=files(id,name)`;
            let res = await driveFetch(url, { headers: { Authorization: 'Bearer ' + __googleToken } }, interactive);
            const json = await res.json();
            return (json.files && json.files[0] && json.files[0].id) || null;
        } catch(_) { return null; }
    }


    async function driveLoadMerged(interactive = false) {
        try {
            if (!__googleToken) return null;
            // 항상 AppDataFolder에서만 로드(디버그에서도 예외 없음)
            const fileId = await driveFetchFileId(interactive);
            if (!fileId) return null;
            let res = await driveFetch('https://www.googleapis.com/drive/v3/files/'+fileId+'?alt=media', { headers: { Authorization: 'Bearer '+__googleToken } }, interactive);
            if (!res.ok) return null;
            return await res.json();
        } catch(_) { return null; }
    }

    async function driveSaveMerged(merged, interactive = false) {
        try {
            if (!__googleToken || !merged) return false;
            // 항상 AppDataFolder에만 저장
            let fileId = await driveFetchFileId(interactive);
            const folderParents = ['appDataFolder'];
            const metadata = { name: DRIVE_FILE_NAME, parents: folderParents };
            const boundary = '-------314159265358979323846';
            const delimiter = '\r\n--' + boundary + '\r\n';
            const closeDelim = '\r\n--' + boundary + '--';
            const metaPart = 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata);
            const dataPart = 'Content-Type: application/json\r\n\r\n' + JSON.stringify(merged);
            const body = delimiter + metaPart + delimiter + dataPart + closeDelim;
            // 1) 파일이 우리 앱 소유가 아니거나 PATCH 권한이 없으면 403이므로 POST 신규 생성으로 폴백
            let res;
            if (fileId) {
                const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=multipart';
                res = await driveFetch(url, { method: 'PATCH', headers: { 'Authorization': 'Bearer '+__googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
                if (res.status === 403) {
                    // 폴백: 새 파일 생성
                    const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
                    res = await driveFetch(createUrl, { method: 'POST', headers: { 'Authorization': 'Bearer '+__googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
                }
            } else {
                const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
                res = await driveFetch(createUrl, { method: 'POST', headers: { 'Authorization': 'Bearer '+__googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
            }
            return res.ok;
        } catch(_) { return false; }
    }

    async function driveDeleteMerged(interactive = false) {
        try {
            if (!__googleToken) return false;
            const fileId = await driveFetchFileId(interactive);
            if (!fileId) return true;
            const res = await driveFetch('https://www.googleapis.com/drive/v3/files/'+fileId, { method:'DELETE', headers: { Authorization: 'Bearer '+__googleToken } }, interactive);
            return res.ok || res.status === 404;
        } catch(_) { return false; }
    }

    async function initAuthBar(){
        const loginBtn = document.getElementById('ptLoginBtn');
        const logoutBtn = document.getElementById('ptLogoutBtn');
        // 토큰 복원으로 로그인 유지 + 유효성 확인 (자동 재인증은 하지 않음)
        try {
            const tok = localStorage.getItem('pull-tracker:google-token');
            if (tok) {
                __googleToken = tok; __googleAuthed = true;
                __tokenExpAt = Number(localStorage.getItem('pull-tracker:google-exp')||'0')||0;
                // 새로고침 시에는 무팝업 갱신조차 시도하지 않음(일부 환경에서 팝업 생성 방지)
                try {
                    const r = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers:{ Authorization:'Bearer '+__googleToken } });
                    if (r.status === 401 || r.status === 403) { __googleAuthed = false; __googleToken = null; renderAuthBarUI({ email: (localStorage.getItem('pull-tracker:google-email')||'') }); }
                    else {
                        const profile = await r.json().catch(()=>null);
                        try { if (profile && profile.email) localStorage.setItem('pull-tracker:google-email', profile.email); } catch(_) {}
                        renderAuthBarUI(profile || { email: (localStorage.getItem('pull-tracker:google-email')||'') });
                    }
                } catch(_) {}
            } else { renderAuthBarUI(null); }
        } catch(_) { renderAuthBarUI(null); }
        if (loginBtn) loginBtn.onclick = async () => {
            const prev = window.__pt_allowInteractive;
            window.__pt_allowInteractive = true;
            try {
                await gapiInit();
                const resp = await googleSignIn();
                const cloud = await driveLoadMerged(false);
                if (cloud && cloud.data) {
                    __dataSource = 'drive'; setStatus(t.loadedDrive);
                    const m = mergeWithCache(cloud);
                    localStorage.setItem('pull-tracker:merged', JSON.stringify(m));
                    renderCardsFromExample(m);
                } else {
                    setStatus(t.driveNoData);
                }
            } finally {
                window.__pt_allowInteractive = prev;
            }
        };
        if (logoutBtn) logoutBtn.onclick = () => { googleSignOut(); };
    }

    // 병합 완료 시 Google Drive 저장
    async function syncMergedToCloud(){
        try {
            if (!__googleAuthed) return;
            const ok = await ensureTokenSilent();
            if (!ok) return;
            const s = localStorage.getItem('pull-tracker:merged');
            if (!s) return;
            const merged = JSON.parse(s);
            await driveSaveMerged(merged, true);
        } catch(_) {}
    }

    // expose init for index.html
    window.pullTrackerInitAuth = initAuthBar;

    function renderOverview(payload){
        try {
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            const jewel = `${base}/assets/img/pay/이계 엠버.png`;
            const get = (key) => payload.data[key];
            const blocks = {
                pickup: [get('Confirmed'), get('Fortune')],
                weapon: [get('Weapon')],
                standard: [get('Gold'), get('Newcomer')]
            };
            const inProgressOf = (b) => {
                try {
                    const list = Array.isArray(b.records) ? b.records : [];
                    let s = 0; for (const seg of list) { if (seg && seg.fivestar == null) { const rec = Array.isArray(seg.record)?seg.record:[]; s += rec.length; } }
                    return s;
                } catch(_) { return 0; }
            };
            const calc = (arr) => {
                const sum = (sel) => arr.reduce((s,b)=> s + (Number(((b||{}).summary||{})[sel])||0), 0);
                const pulled = sum('pulledSum');
                const t5 = sum('total5Star');
                const t4 = sum('total4Star');
                const effTotal = pulled - arr.reduce((s,b)=> s + inProgressOf(b||{}), 0);
                const avg5 = (arr.map(b=>Number((b||{}).summary?.avgPity)||0).filter(Boolean).reduce((a,b)=>a+b,0) / Math.max(1, arr.filter(b=>Number(b?.summary?.avgPity)).length)) || null;
                const rate5 = effTotal>0 && t5>=0 ? (t5/effTotal*100) : null;
                const rate4 = pulled>0 && t4>=0 ? (t4/pulled*100) : null;
                return { pulled, effTotal, t5, t4, avg5, rate5, rate4 };
            };
            const pickup = calc(blocks.pickup);
            const weapon = calc(blocks.weapon);
            const standard = calc(blocks.standard);

            const jewelCost = (key) => {
                if (key==='pickup') return pickup.pulled * 150;
                if (key==='weapon') return weapon.pulled * 100;
                if (key==='standard') {
                    const goldPulled = Number((blocks.standard[0]?.summary?.pulledSum)||0);
                    const newcomerPulled = Number((blocks.standard[1]?.summary?.pulledSum)||0);
                    return goldPulled*150 + newcomerPulled*120;
                }
                return 0;
            };

            const makeCard = (key, title, data, ExtraRow=null, titleIcon=null) => {
                const el = document.createElement('div');
                el.className = 'overview-card';
                // title with right-side icon (like stat-cards)
                const titleWrap = document.createElement('div');
                titleWrap.className = 'h3-row';
                const h3 = document.createElement('h3'); h3.textContent = title;
                titleWrap.appendChild(h3);
                if (titleIcon){ const ic=document.createElement('img'); ic.src=titleIcon; ic.alt=key; ic.className='card-title-icon'; titleWrap.appendChild(ic); }
                el.appendChild(titleWrap);
                // top stats: 총 뽑기 N회 / {jewel} cost
                const pullsSuffix = lang==='en' ? 'pulls' : (lang==='jp' ? '回' : '회');
                const topRow = document.createElement('div'); topRow.className='stat'; topRow.style.fontSize='13px'; topRow.style.justifyContent='flex-start'; topRow.style.gap='16px';
                // const l = document.createElement('span'); l.textContent = textFor('total');
                const r = document.createElement('strong');
                const txt = document.createElement('span'); txt.textContent = `${numberFmt(data.pulled)}${pullsSuffix}`; txt.style.marginRight='8px';
                const jimg=document.createElement('img'); jimg.src=jewel; jimg.alt='j'; jimg.className='jewel'; jimg.style.marginLeft='16px';
                const jv = document.createElement('span'); jv.textContent = numberFmt(jewelCost(key)); jv.style.fontSize='13px'; jv.style.color='#cdcdcd'; jv.style.fontWeight='400';
                r.appendChild(txt); r.appendChild(jimg); r.appendChild(jv);
                //topRow.appendChild(l); 
                topRow.appendChild(r);
                titleWrap.appendChild(topRow);
                // el.appendChild(topRow);

                // ----------------------------
                // chart canvas
                const canvas = document.createElement('canvas'); canvas.className='overview-chart';
                el.appendChild(canvas);
                requestAnimationFrame(()=> { try { if (window.drawOverviewChart) window.drawOverviewChart(canvas, blocks, key, lang); } catch(_) {} });

                const table = document.createElement('div');
                table.className = 'stat-table';
                const header = document.createElement('div'); header.className='tr';
                header.appendChild(cell('th',''));
                header.appendChild(cell('th', textFor('count')));
                header.appendChild(cell('th', textFor('rate')));
                header.appendChild(cell('th', textFor('avg')));
                table.appendChild(header);
                // 5★
                const row5 = document.createElement('div'); row5.className='tr five';
                row5.appendChild(cell('td','5★'));
                row5.appendChild(cell('td', numberFmt(data.t5)));
                row5.appendChild(cell('td', data.rate5!=null?numberFmt(data.rate5,2)+'%':'-'));
                row5.appendChild(cell('td', data.avg5!=null?numberFmt(data.avg5,2):'-'));
                table.appendChild(row5);
                // extra
                if (ExtraRow){ const holder=document.createElement('div'); holder.innerHTML=ExtraRow; while(holder.firstChild){ table.appendChild(holder.firstChild);} }
                // 4★
                const row4 = document.createElement('div'); row4.className='tr four';
                row4.appendChild(cell('td','4★'));
                row4.appendChild(cell('td', numberFmt(data.t4)));
                row4.appendChild(cell('td', data.rate4!=null?numberFmt(data.rate4,2)+'%':'-'));
                row4.appendChild(cell('td', data.pulled>0?numberFmt(data.pulled/Math.max(1,data.t4),2):'-'));
                table.appendChild(row4);
                el.appendChild(table);
                return el;
            };
            function cell(cls, html){ const d=document.createElement('div'); d.className=cls; d.innerHTML=html; return d; }
            // drawOverviewChart moved to charts.js

            // 5성 픽업(운명/확정 합산, 무기는 50:50)
            const pickupWin = (Number(blocks.pickup[0]?.summary?.win5050)||0)+(Number(blocks.pickup[1]?.summary?.win5050)||0);
            const pickupRate = (pickup.t5>0) ? (pickupWin / pickup.t5 * 100) : null;
            const pickupAvg = (pickupWin>0) ? (pickup.effTotal / pickupWin) : null;
            const pickupLabel = `  └ ${lang==='en'?'5★ Pickup':(lang==='jp'?'5★ ピックアップ':'5성 픽업')}`; 
            const pickupExtra = `<div class=\"tr fifty\"><div class=\"td\">${pickupLabel}</div><div class=\"td\">${numberFmt(pickupWin)}</div><div class=\"td\">${pickupRate!=null?numberFmt(pickupRate,2)+'%':'-'}</div><div class=\"td\">${pickupAvg!=null?numberFmt(pickupAvg,2):'-'}</div></div>`;

            const weaponWin = (Number(blocks.weapon[0]?.summary?.win5050)||0);
            const weaponTotal5 = (Number(blocks.weapon[0]?.summary?.total5Star)||0);
            const weaponLabel = `  └ ${lang==='en'?'5★ Pickup':(lang==='jp'?'5★ ピックアップ':'5성 픽업')}`;
            const weaponAvg = weaponWin>0 ? (weapon.effTotal/weaponWin) : null;
            const weaponExtra = `<div class=\"tr fifty\"><div class=\"td\">${weaponLabel}</div><div class=\"td\">${numberFmt(weaponWin)}</div><div class=\"td\">${weaponTotal5>0?numberFmt(weaponWin/weaponTotal5*100,2)+'%':'-'}</div><div class=\"td\">${weaponAvg!=null?numberFmt(weaponAvg,2):'-'}</div></div>`;

            const wrap = els.overview;
            wrap.innerHTML='';
            const iconMap = { pickup: '정해진 운명.png', weapon: '정해진 코인.png', standard: '미래의 운명.png' };
            wrap.appendChild(makeCard('pickup', (lang==='en'?'Pickup':(lang==='jp'?'ピックアップ':'픽업')), pickup, pickupExtra, `${base}/assets/img/pay/${iconMap.pickup}`));
            wrap.appendChild(makeCard('weapon', (lang==='en'?'Weapon':(lang==='jp'?'武器':'무기')), weapon, weaponExtra, `${base}/assets/img/pay/${iconMap.weapon}`));
            wrap.appendChild(makeCard('standard', (lang==='en'?'Standard':(lang==='jp'?'通常':'일반')), standard, null, `${base}/assets/img/pay/${iconMap.standard}`));
        } catch(_) {}
    }

    applyTexts();

    // tooltip lib loader
    function ensureTooltipLib(){
        return new Promise((resolve)=>{
            try {
                if (window.bindTooltipElement) return resolve();
                const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                const s = document.createElement('script');
                s.src = `${base}/assets/js/tooltip.js?v=${Date.now()}`;
                s.onload = () => resolve();
                s.onerror = () => resolve();
                document.head.appendChild(s);
            } catch(_) { resolve(); }
        });
    }

    // Load KR characters database for name→class mapping
    function getCharData() {
        try {
            // top-level const characterData is not a window property; access via identifier when available
            // eslint-disable-next-line no-undef
            if (typeof characterData !== 'undefined') return characterData;
        } catch(_) {}
        return window.characterData || null;
    }

    // Load KR weapons database for weapon→owner mapping
    function getWeaponData() {
        try {
            // eslint-disable-next-line no-undef
            if (typeof WeaponData !== 'undefined') return WeaponData;
        } catch(_) {}
        return window.WeaponData || null;
    }

    async function loadCharacters() {
        if (getCharData()) return;
        await new Promise((resolve) => {
            try {
                const s = document.createElement('script');
                const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                s.src = `${base}/data/kr/characters/characters.js?v=${Date.now()}`;
                s.onload = () => resolve();
                s.onerror = () => resolve();
                document.head.appendChild(s);
            } catch(_) { resolve(); }
        });
        /*
        if (DEBUG) {
            try {
                const g = getCharData();
                console.log('[pull-tracker] characters loaded:', !!g, g ? Object.keys(g).length : 0);
            } catch(_) {}
        }*/
    }

    let __weaponsLoading = null;
    async function loadWeapons() {
        if (__weaponsLoading) return __weaponsLoading;
        __weaponsLoading = new Promise((resolve) => {
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            const tasks = [];
            try {
                if (!getWeaponData()) {
                    tasks.push(new Promise((res) => {
                        const s = document.createElement('script');
                        s.src = `${base}/data/kr/characters/character_weapon.js?v=${Date.now()}`;
                        s.onload = () => res(); s.onerror = () => res(); document.head.appendChild(s);
                    }));
                }
                if (!window.enCharacterWeaponData) {
                    tasks.push(new Promise((res) => {
                        const s = document.createElement('script');
                        s.src = `${base}/data/en/characters/character_weapon.js?v=${Date.now()}`;
                        s.onload = () => res(); s.onerror = () => res(); document.head.appendChild(s);
                    }));
                }
                if (!window.jpCharacterWeaponData) {
                    tasks.push(new Promise((res) => {
                        const s = document.createElement('script');
                        s.src = `${base}/data/jp/characters/character_weapon.js?v=${Date.now()}`;
                        s.onload = () => res(); s.onerror = () => res(); document.head.appendChild(s);
                    }));
                }
            } catch(_) {}
            Promise.all(tasks).then(() => resolve());
        });
        return __weaponsLoading;
    }

    // Persist last URL
    const STORAGE_KEY = 'pull-tracker:last-url';
    try {
        const last = localStorage.getItem(STORAGE_KEY);
        if (last && els.input && !els.input.value) els.input.value = last;
    } catch(_) {}

    function setStatus(lines) {
        if (!els.status) return;
        if (Array.isArray(lines)) {
            els.status.textContent = lines.filter(Boolean).join('\n');
        } else {
            els.status.textContent = lines || '';
        }
    }

    let __dataSource = null; // 'drive' | 'local' | null
    let __needDriveConsent = false;

    // inline 로딩 UI를 유지하면서 메시지만 교체하는 헬퍼
    function updateInlineStatus(message){
        try {
            if (!els.status) return;
            els.status.innerHTML = `<span class="spinner" style="display:inline-block;vertical-align:-3px;margin-right:6px;width:14px;height:14px;border-width:2px"></span>${message} <span id="inline-elapsed"></span>`;
        } catch(_) {}
    }

    function setResult(text) {
        try {
            const pre = document.getElementById('result');
            if (!pre) return;
            if (DEBUG) {
                pre.style.display = 'block';
                pre.textContent = text || '';
            } else {
                pre.style.display = 'none';
                pre.textContent = '';
            }
        } catch(_) {}
    }

    function startLoadingUI() {
        const startedAt = Date.now();
        // top inline status with spinner
        try {
            updateInlineStatus(t.waiting);
        } catch(_) {}
        let dot = 0;
        const anim = setInterval(() => {
            dot = (dot + 1) % 4;
            const d = '.'.repeat(dot);
            const elapsedMs = Date.now() - startedAt;
            const m = Math.floor(elapsedMs / 60000);
            const s = Math.floor((elapsedMs % 60000) / 1000);
            try { const el = document.getElementById('inline-elapsed'); if (el) el.textContent = `(${t.elapsed(m, s)})`; } catch(_) {}
            try {
                const ldTitle = document.getElementById('ld-title');
                const ldSub = document.getElementById('ld-sub');
                const ldElapsed = document.getElementById('ld-elapsed');
                if (ldTitle) ldTitle.textContent = t.loadingTitle;
                if (ldSub) ldSub.textContent = `${t.waiting} ${d}`;
                if (ldElapsed) ldElapsed.textContent = t.elapsed(m, s);
            } catch(_) {}
        }, 1000);
        return () => {
            clearInterval(anim);
            // no modal overlay hide; keep inline status only
        };
    }

    async function fetchRecords(userUrl) {
        const endpoint = 'https://iant.kr:5000/gacha/get_records';

        // Try POST (x-www-form-urlencoded)
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: new URLSearchParams({ url: userUrl, translate: 'true' })
            });
            if (!res.ok) throw new Error('POST not ok');
            const text = await res.text();
            return text;
        } catch (err) {
            // POST 실패 시에도 스피너/경과 시간은 유지하고, 메시지만 교체
            updateInlineStatus(`${t.tryGet}`);
        }

        // Fallback GET
        const url = `${endpoint}?url=${encodeURIComponent(userUrl)}&translate=true`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error('GET not ok');
        return await res.text();
    }

    async function onStart() {
        const userUrl = (els.input && els.input.value || '').trim();
        if (!userUrl || !/^https?:\/\//i.test(userUrl)) {
            setStatus(t.invalidUrl);
            return;
        }
        try { localStorage.setItem(STORAGE_KEY, userUrl); } catch(_) {}

        setResult('');
        const stop = startLoadingUI();
        try {
            await Promise.all([loadCharacters(), loadWeapons()]);
            const text = await fetchRecords(userUrl);
            // if (DEBUG) { try { console.log('[pull-tracker][raw-response]', text.slice(0, 1000)); } catch(_) {} }
            stop();
            setStatus('✅ 완료');
            setResult(text);

            try {
                const incoming = JSON.parse(text);
                try { localStorage.setItem('pull-tracker:last-response', text); } catch(_) {}
                // 병합 수행 → 저장 → 렌더
                const merged = mergeWithCache(incoming);
                try { localStorage.setItem('pull-tracker:merged', JSON.stringify(merged)); } catch(_) {}
                renderCardsFromExample(merged);
                // Google Drive 동기화
                try {
                    await syncMergedToCloud();
                    if (__googleAuthed) setStatus(`${t.savedDrive} ${nowStamp()}`);
                    else setStatus(`${t.savedLocal} ${nowStamp()}`);
                } catch(_) {}
            } catch(_) {
                // ignore parse error; keep raw text only
            }
        } catch (err) {
            stop();
            setStatus(t.failed);
            setResult(String(err && err.message ? err.message : err));
        }
    }

    async function onClear() {
        try {
            const ok = window.confirm(t.confirmReset);
            if (!ok) return;
        } catch(_) {}
        // 입력 및 화면 초기화
        try { if (els.input) els.input.value = ''; } catch(_) {}
        try { setStatus(''); } catch(_) {}
        try { setResult(''); } catch(_) {}
        try { if (els.cards) els.cards.innerHTML = ''; } catch(_) {}
        try { if (els.overview) els.overview.innerHTML = ''; } catch(_) {}

        // 로컬 저장소 정리
        try { localStorage.removeItem(STORAGE_KEY); } catch(_) {}
        try { localStorage.removeItem('pull-tracker:last-response'); } catch(_) {}
        try { localStorage.removeItem('pull-tracker:merged'); } catch(_) {}
        __dataSource = null;
        // hide4 설정은 사용자 환경 설정이므로 유지

        // Google Drive(AppDataFolder)에도 저장된 병합본 삭제 시도 (무팝업 갱신 후 삭제를 보장)
        try {
            if (__googleToken) {
                await ensureTokenSilent();
                const ok = await driveDeleteMerged(true);
                try {
                    setStatus(ok ? `${t.deletedDrive} ${nowStamp()}` : `${t.deleteDriveFailed} ${nowStamp()}`);
                } catch(_) {}
            }
        } catch(_) {}
    }

    if (els.start) els.start.addEventListener('click', onStart);
    if (els.clear) els.clear.addEventListener('click', onClear);

    // Build stat cards from example.json-like structure
    function renderCardsFromExample(payload) {
        if (!payload || !payload.data || !els.cards) return;
        // 카드 순서/행 구성: 1행(확정/운명/일반), 2행(무기/신규)
        const types = [
            ['Confirmed', 'confirmed'],
            ['Fortune', 'fortune'],
            ['Weapon', 'weapon'],
            ['Gold', 'gold'],
            ['Newcomer', 'newcomer']
        ];

        els.cards.innerHTML = '';
        // 4★ 숨기기 상태 불러오기
        let hide4 = false;
        try { hide4 = localStorage.getItem('pull-tracker:hide4') === '1'; } catch(_) {}
        const hide4Chk = document.getElementById('hide4Chk');
        if (hide4Chk) { hide4Chk.checked = hide4; hide4Chk.onchange = () => {
            try { localStorage.setItem('pull-tracker:hide4', hide4Chk.checked ? '1' : '0'); } catch(_) {}
            // 재렌더
            renderCardsFromExample(payload);
        }; }
        if (els.overview) renderOverview(payload);

        for (const [key, label] of types) {
            const block = payload.data[key];
            if (!block) continue;

            // 총 뽑기: summary.pulledSum
            const total = getNumber(block, ['summary', 'pulledSum']);
            // 진행 중(현재 5★ 미확정 구간) 계산: fivestar === null 인 섹션들의 record 길이 합
            const inProgress = (() => {
                try {
                    const list = Array.isArray(block.records) ? block.records : [];
                    if (list.length===0) return 0;
                    // 90일 규칙: 가장 최근 그룹(=마지막 segment의 시각)이 포함된 fivestar:null 세그먼트만 집계
                    const msDay = 24*60*60*1000;
                    const lastSeg = list[list.length-1];
                    const lastTime = Number(lastSeg?.lastTimestamp||0);
                    if (!lastTime) return 0;
                    let s = 0;
                    for (let i=list.length-1;i>=0;i--){
                        const seg = list[i];
                        const ts = Number(seg?.lastTimestamp||0);
                        if (!ts) continue;
                        if (Math.abs(lastTime - ts) > 90*msDay) break; // 이전 그룹 도달 → 중단
                        if (seg && seg.fivestar == null) {
                            const rec = Array.isArray(seg.record) ? seg.record : [];
                            s += rec.length;
                        }
                    }
                    return s;
                } catch(_) { return 0; }
            })();
            const effectiveTotal = Math.max(0, (Number.isFinite(total) ? total : 0) - inProgress);

            const avgPity = getNumber(block, ['summary', 'avgPity']);
            const total5 = getNumber(block, ['summary', 'total5Star']);
            const total4 = getNumber(block, ['summary', 'total4Star']);
            const win5050 = getNumber(block, ['summary', 'win5050']);

            // 확률(비율): 전체 뽑기 대비 해당 등급 출현 비율
            // 5★ 확률만 (총-진행중) 기준, 4★는 총 뽑기 기준
            const fiveRate = effectiveTotal > 0 && total5 >= 0 ? ((total5 / effectiveTotal) * 100) : null;
            const fourRate = total > 0 && total4 >= 0 ? ((total4 / total) * 100) : null;
            // 평균 뽑기 횟수: 데이터 기반 근사치 (총 뽑기 / 등급 개수). 5★은 avgPity 우선 사용
            const fiveAvg = avgPity != null ? avgPity : (total5 > 0 ? (total / total5) : null);
            const fourAvg = total4 > 0 ? (total / total4) : null;
            // 50:50 승리 비율: 5★ 중 win5050 개수 비율
            const win5050Rate = (total5 > 0 && win5050 != null) ? ((win5050 / total5) * 100) : null;
            const win5050Avg = (win5050 && win5050 > 0) ? (effectiveTotal / win5050) : null;

            const card = document.createElement('div');
            card.className = 'stat-card';

            const titleWrap = document.createElement('div');
            titleWrap.className = 'h3-row';
            const title = document.createElement('h3');
            title.textContent = toDisplayName(label);
            const help = document.createElement('span');
            help.className = 'help-icon';
            help.setAttribute('data-tooltip', tooltipFor(label));
            help.innerHTML = '<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"/><path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"/></svg>';
            titleWrap.appendChild(title);

            // title right-side icon
            const icon = document.createElement('img');
            icon.className = 'card-title-icon';
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            const iconMap = {
                confirmed: '정해진 운명.png',
                fortune: '정해진 운명.png',
                gold: '미래의 운명.png',
                newcomer: '미래의 운명.png',
                weapon: '정해진 코인.png'
            };
            const iconName = iconMap[label];
            if (iconName) {
                icon.src = `${base}/assets/img/pay/${iconName}`;
                icon.alt = label;
                icon.loading = 'lazy';
                titleWrap.appendChild(icon);
            }
            titleWrap.appendChild(help);
            card.appendChild(titleWrap);
            // bind cursor-follow tooltip
            ensureTooltipLib().then(() => { try { if (window.bindTooltipElement) window.bindTooltipElement(help); } catch(_) {} });

            // 상단 총계: 총 뽑기 / 진행 중 (진행중은 작고 연해)
            const totalPair = (total != null) ? `${numberFmt(total)} / ` : '-';
            const rowTop = makeStatRow(textFor('totalInProgress'), totalPair);
            if (total != null) {
                const ip = document.createElement('span'); ip.className='inprogress'; ip.textContent=numberFmt(inProgress);
                rowTop.lastChild.appendChild(ip);
            }
            card.appendChild(rowTop);

            // 표 헤더
            const table = document.createElement('div');
            table.className = 'stat-table';
            table.appendChild(makeTableRow(['', textFor('count'), textFor('rate'), textFor('avg')], true));

            // 5★ 행
            const fiveRow = makeTableRow([
                '5★',
                total5 != null ? numberFmt(total5) : '-',
                fiveRate != null ? numberFmt(fiveRate, 2) + '%' : '-',
                fiveAvg != null ? numberFmt(fiveAvg, 2) : '-'
            ]);
            fiveRow.classList.add('five');
            table.appendChild(fiveRow);

            //  ㄴ 50:50 (Fortune/Weapon) - 평균도 표시
            if (label === 'fortune' || label === 'weapon') {
                const fiftyRow = makeTableRow([
                    '  └ 50% '+textFor('win'),
                    win5050 != null ? numberFmt(win5050) : '-',
                    win5050Rate != null ? numberFmt(win5050Rate, 2) + '%' : '-',
                    win5050Avg != null ? numberFmt(win5050Avg, 2) : '-'
                ], false, true);
                fiftyRow.classList.add('fifty');
                table.appendChild(fiftyRow);
            }

            // 4★ 행
            const fourRow = makeTableRow([
                '4★',
                total4 != null ? numberFmt(total4) : '-',
                fourRate != null ? numberFmt(fourRate, 2) + '%' : '-',
                fourAvg != null ? numberFmt(fourAvg, 2) : '-'
            ]);
            fourRow.classList.add('four');
            table.appendChild(fourRow);

            // 보장 규칙 행 제거 (요청)

            card.appendChild(table);

            // 하단: 5★ → 4★ → 3★(이하 합산) 이름 pill 나열
            const pills = document.createElement('div');
            pills.className = 'pills';
            // if (DEBUG) console.log('[pull-tracker] render pills for', label);
            renderNamePills(block, pills, label, hide4);
            card.appendChild(pills);

            // 아코디언: 5★ 상세 기록 (이미지/이름/시간/천장)
            try {
                const accordion = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = textFor('fiveStarHistory');
                accordion.appendChild(summary);
                const listWrap = document.createElement('div');
                listWrap.className = 'five-list';
                const fiveRecords = collectFiveStarRecords(block);
                for (const rec of fiveRecords) {
                    const row = document.createElement('div');
                    row.className = 'five-row';
                    const left = document.createElement('div');
                    left.className = 'five-left';
                    const avatar = (label === 'weapon') ? weaponThumbFor(rec.name) : characterThumbFor(rec.name);
                    if (avatar) left.appendChild(avatar);
                    const nameEl = document.createElement('span');
                    nameEl.textContent = rec.name;
                    left.appendChild(nameEl);
                    const right = document.createElement('div');
                    right.className = 'five-right';
                    const timeEl = document.createElement('span');
                    timeEl.textContent = tsToLocal(rec.timestamp);
                    const pityEl = document.createElement('span');
                    pityEl.textContent = `${rec.pity} ${textFor('timesSuffix')}`;
                    right.appendChild(timeEl);
                    right.appendChild(pityEl);
                    row.appendChild(left);
                    row.appendChild(right);
                    listWrap.appendChild(row);
                }
                accordion.appendChild(listWrap);
                card.appendChild(accordion);
            } catch(_) {}

            els.cards.appendChild(card);
        }
    }

    function getNumber(obj, path) {
        try {
            let cur = obj;
            for (const k of path) cur = cur[k];
            const n = Number(cur);
            return Number.isFinite(n) ? n : null;
        } catch(_) { return null; }
    }

    function makeStatRow(label, value) {
        const row = document.createElement('div');
        row.className = 'stat';
        const l = document.createElement('span');
        l.textContent = label;
        const r = document.createElement('strong');
        r.textContent = String(value);
        row.appendChild(l);
        row.appendChild(r);
        return row;
    }

    function makeSectionLabel(text) {
        const el = document.createElement('div');
        el.style.margin = '10px 0 4px 0';
        el.style.opacity = '.8';
        el.style.fontWeight = '600';
        el.textContent = text;
        return el;
    }

    function makeTableRow(values, header = false, subtle = false) {
        const row = document.createElement('div');
        row.className = 'tr';
        for (let i = 0; i < values.length; i++) {
            const cell = document.createElement('div');
            cell.className = header ? 'th' : 'td';
            if (i === 0) cell.className += ' star';
            if (subtle) cell.className += ' sub';
            cell.textContent = values[i];
            row.appendChild(cell);
        }
        return row;
    }

    function toDisplayName(key) {
        const map = {
            kr: { gold: '일반', fortune: '운명', weapon: '무기', confirmed: '확정', newcomer: '신규' },
            en: { gold: 'Gold', fortune: 'Fortune', weapon: 'Weapon', confirmed: 'Confirmed', newcomer: 'Newcomer' },
            jp: { gold: 'ゴールド', fortune: 'フォーチュン', weapon: '武器', confirmed: '確定', newcomer: 'ニューカマー' }
        };
        const dict = map[lang] || map.kr;
        return dict[key] || key;
    }

    function textFor(key) {
        const dicts = {
            kr: {
                total: '총 뽑기',
                totalInProgress: '총 뽑기 / 진행 중',
                count: '합계',
                rate: '확률',
                avg: '평균 횟수',
                win: '성공',
                rule: '보장 규칙',
                fiveStarHistory: '5★ 상세 기록',
                timesSuffix: '회',
                tooltip_confirmed: '확정: 5★ 110회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
                tooltip_fortune: '운명: 5★ 80회 보장, 4★ 10회 보장 (50% 규칙).\n5★ 확률 및 50% 성공은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.\n50% 성공 여부는 현재 게임 서버에서 제공되지 않아 한정 캐릭터 여부를 통해 성공 여부를 판정합니다. 따라서 특정 상황에 따라 정확도가 떨어질 수 있습니다.',
                tooltip_gold: '일반: 5★ 80회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
                tooltip_weapon: '무기: 5★ 70회 보장, 4★ 10회 보장 (50% 규칙).\n5★ 확률 및 50% 성공은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.\n50% 성공 여부는 현재 게임 서버에서 제공되지 않아 한정 캐릭터 여부를 통해 성공 여부를 판정합니다. 따라서 특정 상황에 따라 정확도가 떨어질 수 있습니다.',
                tooltip_newcomer: '신규: 5★ 50회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
                fiveTotal: '5★ 총 횟수',
                fivePityRate: '5★ 확률',
                fiveAvg: '5★ 평균 횟수',
                win5050Count: '50% 성공(횟수)',
                win5050Rate: '50% 성공(확률)',
                fourTotal: '4★ 총 횟수',
                fourPityRate: '4★ 확률',
                fourAvg: '4★ 평균 횟수'
            },
            en: {
                total: 'Total Pulls',
                totalInProgress: 'Total / In Progress',
                count: 'Count',
                rate: 'Rate',
                avg: 'Avg Pulls',
                win: 'Win',
                rule: 'Guarantee',
                fiveStarHistory: '5★ History',
                timesSuffix: 'pulls',
                tooltip_confirmed: 'Confirmed: 5★ at 110, 4★ at 10.\n5★ Rates are calculated using (Total - In Progress).',
                tooltip_fortune: 'Fortune: 5★ at 80, 4★ at 10 (50:50 rule).\n5★Rates and 50:50 use (Total - In Progress).\n50:50 success is not provided by the game server; we infer it using featured/limited status, so accuracy may be reduced in some situations.',
                tooltip_gold: 'Standard: 5★ at 80, 4★ at 10.\n5★ Rates use (Total - In Progress).',
                tooltip_weapon: 'Weapon: 5★ at 70, 4★ at 10 (50:50 rule).\n5★ Rates and 50:50 use (Total - In Progress).\n50:50 success is not provided by the game server; we infer it using featured/limited status, so accuracy may be reduced in some situations.',
                tooltip_newcomer: 'Newcomer: 5★ at 50, 4★ at 10.\n5★ Rates use (Total - In Progress).',
                fiveTotal: '5★ Count',
                fivePityRate: '5★ Rate',
                fiveAvg: '5★ Avg Pulls',
                win5050Count: 'Win 50:50 (Count)',
                win5050Rate: 'Win 50:50 (Rate)',
                fourTotal: '4★ Count',
                fourPityRate: '4★ Rate',
                fourAvg: '4★ Avg Pulls'
            },
            jp: {
                total: '総ガチャ数',
                totalInProgress: '総数 / 進行中',
                count: '合計',
                rate: '率',
                avg: '平均回数',
                win: '勝利',
                rule: '保証',
                fiveStarHistory: '5★ 詳細',
                timesSuffix: '回',
                tooltip_confirmed: '確定: 5★ 110回, 4★ 10回。\n5★確率および50%勝利は(総数 - 進行中)で計算します。',
                tooltip_fortune: 'フォーチュン: 5★ 80回, 4★ 10回 (50% ルール)。\n5★確率および50%勝利は(総数 - 進行中)で計算。\n50%勝利の可否はゲームサーバーが提供していないため、限定キャラクターかどうかで推定しています。状況によっては正確性が低下する場合があります。',
                tooltip_gold: '通常: 5★ 80回, 4★ 10回。\n5★確率は(総数 - 進行中)で計算。',
                tooltip_weapon: '武器: 5★ 70回, 4★ 10回 (50% ルール)。\n5★確率および50%勝利は(総数 - 進行中)で計算。\n50%勝利の可否はゲームサーバーが提供していないため、限定キャラクターかどうかで推定しています。状況によっては正確性が低下する場合があります。',
                tooltip_newcomer: 'ニューカマー: 5★ 50回, 4★ 10回。\n5★確率は(総数 - 進行中)で計算。',
                fiveTotal: '5★ 回数',
                fivePityRate: '5★ 率',
                fiveAvg: '5★ 平均回数',
                win5050Count: '50% 勝利(回数)',
                win5050Rate: '50% 勝利(率)',
                fourTotal: '4★ 回数',
                fourPityRate: '4★ 率',
                fourAvg: '4★ 平均回数'
            }
        };
        const dict = dicts[lang] || dicts.kr;
        return dict[key] || key;
    }

    function numberFmt(n, frac = 0) {
        try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: frac, minimumFractionDigits: frac }).format(n); }
        catch(_) { return String(n); }
    }

    function nowStamp(){
        try {
            const d = new Date();
            const yy = String(d.getFullYear()).slice(-2);
            const mm = String(d.getMonth()+1).padStart(2,'0');
            const dd = String(d.getDate()).padStart(2,'0');
            let h = d.getHours();
            const ampm = h>=12 ? 'PM' : 'AM';
            h = h%12; if (h===0) h = 12;
            const hh = String(h).padStart(2,'0');
            const mi = String(d.getMinutes()).padStart(2,'0');
            const ss = String(d.getSeconds()).padStart(2,'0');
            return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss} ${ampm}`;
        } catch(_) { return ''; }
    }

    function tsToLocal(ts){
        try { const d = new Date(Number(ts)); if (!isNaN(d)) return d.toLocaleString(); } catch(_) {}
        return '';
    }

    function tooltipFor(label){
        const key = label === 'confirmed' ? 'tooltip_confirmed'
                 : label === 'fortune' ? 'tooltip_fortune'
                 : label === 'gold' ? 'tooltip_gold'
                 : label === 'weapon' ? 'tooltip_weapon'
                 : label === 'newcomer' ? 'tooltip_newcomer'
                 : null;
        const dict = {
            kr: textFor(key),
            en: textFor(key),
            jp: textFor(key)
        };
        return dict[lang] || '';
    }

    function pityRuleAvgFor(label) {
        // 규칙: Confirmed(확정)=110, Fortune(운명)=80, Gold(골드)=80, Weapon(무기)=70, Newcomer(뉴커머)=50
        // 4★은 전 타입 10
        const five = (label === 'confirmed') ? 110
                  : (label === 'fortune') ? 80
                  : (label === 'gold') ? 80
                  : (label === 'weapon') ? 70
                  : (label === 'newcomer') ? 50
                  : null;
        const four = 10;
        if (five == null) return '-';
        return `5★ ${five}, 4★ ${four}`;
    }

    function renderNamePills(block, container, label, hide4) {
        try {
            const list = [];
            const records = (block.records || []).flatMap(r => Array.isArray(r.record) ? r.record : []);
            // 5★ → 4★ → 3★ 순서로 name별 개수 집계
            const byGrade = { 5: new Map(), 4: new Map(), 3: new Map(), 2: new Map() };
            for (const it of records) {
                const g = Number(it.grade);
                const name = it.name;
                if (!name) continue;
                const bucket = byGrade[g] || byGrade[3];
                bucket.set(name, (bucket.get(name) || 0) + 1);
            }
            if (DEBUG) console.log('[pull-tracker] grade buckets', Object.fromEntries(Object.entries(byGrade).map(([k,m])=>[k, m.size])));
            // 3★ 이하 묶기: 3★/2★ 총합 표시
            const gradesForList = [5, 4];
            for (const g of gradesForList) {
                if (g===4 && hide4) continue;
                const m = byGrade[g];
                if (!m || m.size === 0) continue;
                const arr = Array.from(m.entries()).sort((a,b) => b[1]-a[1]);
                for (const [name, cnt] of arr) {
                    const pill = document.createElement('span');
                    pill.className = 'pill';
                    if (g === 5) pill.classList.add('grade-5');
                    else if (g === 4) pill.classList.add('grade-4');
                    // 이미지: 무기 카드는 무기 이미지, 그 외는 캐릭터 이미지
                    const img = (label === 'weapon') ? weaponThumbFor(name) : characterThumbFor(name);
                    if (img) {
                        pill.style.display = 'inline-flex';
                        pill.style.alignItems = 'center';
                        pill.style.gap = '6px';
                        pill.appendChild(img);
                    }
                    const text = document.createElement('span');
                    const disp = resolveDisplayName(name, label);
                    text.textContent = `${disp} ${cnt}`;
                    pill.appendChild(text);
                    container.appendChild(pill);
                }
            }
            // 3★ 이하 totals
            const total3 = sumMap(byGrade[3]);
            const total2 = sumMap(byGrade[2]);
            const lowLabel = lang === 'jp' ? '以下' : (lang === 'en' ? 'and below' : '이하');
            if (total3 > 0 && !hide4) addPill(container, `3★ ${total3}`);
            if (total2 > 0 && !hide4) addPill(container, `2★ ${total2}`);
        } catch(_) {}
    }

    function sumMap(m) {
        if (!m) return 0; let s = 0; for (const v of m.values()) s += v; return s;
    }
    function addPill(container, text) {
        const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = text; container.appendChild(pill);
    }
    // -------------------------
    // Merge Engine (gachaId-aware)
    // -------------------------
    // merge-engine moved to merge-engine.js

    // 5★ 기록 수집 (name, timestamp, pity)
    function collectFiveStarRecords(block) {
        try {
            const rows = [];
            const segments = Array.isArray(block.records) ? block.records : [];
            for (const seg of segments) {
                const recs = Array.isArray(seg.record) ? seg.record : [];
                let pity = 0;
                for (let i = 0; i < recs.length; i++) {
                    const r = recs[i];
                    pity++;
                    if (r && Number(r.grade) === 5) {
                        // translate display name using current lang
                        let disp = r.name;
                        const cls = resolveCharacterClass(r.name);
                        if (cls) {
                            const info = (getCharData()||{})[cls];
                            const alt = charNameByLang(info);
                            if (alt) disp = alt;
                        }
                        rows.push({ name: disp, timestamp: r.timestamp, pity });
                        pity = 0;
                    }
                }
            }
            return rows;
        } catch(_) { return []; }
    }

    // 이름에서 캐릭터 클래스 키 추정 후 이미지 노출 (무기 카드는 제외)
    function characterThumbFor(displayName){
        try {
            // 이름 풀서치로 class key 찾기 (예외 치환 적용)
            const globalChar = getCharData();
            if (!globalChar) return null;
            const wanted = String(applyNameFixups(displayName)).trim();
            const baseOf = (s) => String(s).split('·')[0].trim();
            const hasVar = (s) => String(s).includes('·');
            const wantedBase = baseOf(wanted);
            const wantedHasVar = hasVar(wanted);

            let found = null;
            // 1) 완전 일치
            for (const [cls, info] of Object.entries(globalChar)) {
                const cands = candidateNames(info);
                if (cands.some(nm => nm === wanted)) { found = cls; break; }
            }
            // 2) 같은 base 내에서 변형 우선순위 선택
            if (!found) {
                const candidates = [];
                for (const [cls, info] of Object.entries(globalChar)) {
                    const cands = candidateNames(info);
                    for (const nm of cands){
                        if (!nm) continue;
                        if (baseOf(nm) === wantedBase) {
                            candidates.push({ cls, nm, hasVar: hasVar(nm) });
                            break;
                        }
                    }
                }
                if (candidates.length > 0) {
                    if (wantedHasVar) {
                        // 변형명을 원하는 경우: 정확히 같은 변형명을 우선
                        const exactVar = candidates.find(c => c.nm === wanted);
                        found = (exactVar ? exactVar.cls : candidates[0].cls);
                    } else {
                        // 일반명을 원하는 경우: 변형이 없는 항목 우선
                        const plain = candidates.find(c => !c.hasVar);
                        found = (plain ? plain.cls : candidates[0].cls);
                    }
                }
            }
            // if (DEBUG) console.log('[pull-tracker] map name→class', displayName, '=>', found);
            if (!found) return null;
            const img = document.createElement('img');
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            // 첫 시도: 캐시 우회를 위해 timestamp 쿼리 추가 (간헐적 미로딩 방지)
            const ts = Date.now();
            const first = `${base}/assets/img/tier/${found}.webp?v=${ts}`;
            const fallback = `${base}/assets/img/character-half/${found}.webp?v=${ts}`;
            img.src = first;
            img.alt = found;
            img.loading = 'lazy';
            img.style.width = '18px';
            img.style.height = '18px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            img.style.aspectRatio = '1 / 1';
            img.decoding = 'async';
            img.referrerPolicy = 'no-referrer';
            // 안정화: 네트워크 지연 시 onload 보장 및 fallback 1회 재시도
            let triedFallback = false;
            img.onerror = function(){
                if (!triedFallback) {
                    triedFallback = true;
                    this.src = fallback;
                } else {
                    this.style.display='none';
                    // if (DEBUG) console.log('[pull-tracker] image not found for', found);
                }
            };
            return img;
        } catch(_) { return null; }
    }

    // 캐릭터 매칭 후보 이름들(다국어/코드네임 포함)
    function candidateNames(info){
        if (!info) return [];
        const base = [info.name, info.name_en, info.name_jp, info.codename]
            .map(v => (v==null? '' : String(v).trim()))
            .filter(Boolean);
        if (lang === 'jp') {
            const extra = [];
            for (const s of base){
                try {
                    const noSpace = String(s).replace(/[\s\u3000]+/g, '');
                    if (noSpace && noSpace !== s) extra.push(noSpace);
                } catch(_) {}
            }
            return Array.from(new Set(base.concat(extra)));
        }
        return Array.from(new Set(base));
    }

    function charNameByLang(info){
        if (!info) return '';
        if (lang === 'en') return String(info.codename || info.name_en || info.name || '').trim();
        if (lang === 'jp') return String(info.name_jp || info.name || '').trim();
        return String(info.name || '').trim();
    }

    function resolveCharacterClass(displayName){
        try {
            const globalChar = getCharData(); if (!globalChar) return null;
            let wanted = String(applyNameFixups(displayName)).trim();
            // 일본어: 공백 제거 버전도 함께 고려
            const wantedNorm = (lang==='jp') ? wanted.replace(/[\s\u3000]+/g,'') : wanted;
            const baseOf = (s) => String(s).split('·')[0].trim();
            const hasVar = (s) => String(s).includes('·');
            const wantedBase = baseOf(wanted);
            const wantedHasVar = hasVar(wanted);
            for (const [cls, info] of Object.entries(globalChar)){
                const cands = candidateNames(info);
                if (cands.some(nm => nm === wanted || (lang==='jp' && nm.replace(/[\s\u3000]+/g,'') === wantedNorm))) return cls;
            }
            const candidates = [];
            for (const [cls, info] of Object.entries(globalChar)){
                const cands = candidateNames(info);
                for (const nm of cands){
                    if (!nm) continue;
                    const nmBase = baseOf(nm);
                    if (nmBase === wantedBase) { candidates.push({cls, nm, hasVar: hasVar(nm)}); break; }
                }
            }
            if (candidates.length === 0) return null;
            if (wantedHasVar) { const exact = candidates.find(c=>c.nm===wanted); return exact? exact.cls : candidates[0].cls; }
            const plain = candidates.find(c=>!c.hasVar); return plain? plain.cls : candidates[0].cls;
        } catch(_) { return null; }
    }

    // 무기 썸네일 생성: WeaponData에서 name으로 찾고, 소유 캐릭터 키와 weaponX-Y 추출
    function weaponThumbFor(weaponName) {
        try {
            const name = String(weaponName || '').trim();
            const meta = resolveWeaponMeta(name);
            if (!meta) return null;
            const ownerKey = meta.ownerKey; const weaponKey = meta.weaponKey;
            if (!ownerKey || !weaponKey) return null;
            const m = weaponKey.match(/^weapon(\d+)-(\d+)$/);
            if (!m) return null;
            const num1 = m[1];
            const num2 = String(m[2]).padStart(2, '0');
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            const file = `${ownerKey}-${num1}-${num2}.png`;
            const img = document.createElement('img');
            img.src = `${base}/assets/img/character-weapon/${file}?v=${Date.now()}`;
            img.alt = `${ownerKey}-${weaponKey}`;
            img.loading = 'lazy';
            img.style.width = '18px';
            img.style.height = '18px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '3px';
            img.decoding = 'async';
            img.referrerPolicy = 'no-referrer';
            img.onerror = function(){ this.style.display='none'; };
            return img;
        } catch(_) { return null; }
    }

    function resolveWeaponMeta(name){
        try {
            const datasets = [];
            const kr = getWeaponData(); if (kr) datasets.push(kr);
            if (window.enCharacterWeaponData) datasets.push(window.enCharacterWeaponData);
            if (window.jpCharacterWeaponData) datasets.push(window.jpCharacterWeaponData);
            const needle = String(name||'').trim(); if (!needle) return null;
            for (const db of datasets){
                for (const [charKey, obj] of Object.entries(db)){
                    for (const [k,v] of Object.entries(obj)){
                        if (!k.startsWith('weapon')) continue;
                        const vname = v && typeof v.name==='string' ? v.name.trim() : '';
                        if (vname && vname === needle) return { ownerKey: charKey, weaponKey: k };
                    }
                }
            }
            return null;
        } catch(_) { return null; }
    }

    function weaponNameByLang(ownerKey, weaponKey){
        try {
            const db = (lang==='en') ? (window.enCharacterWeaponData||getWeaponData())
                     : (lang==='jp') ? (window.jpCharacterWeaponData||getWeaponData())
                     : getWeaponData();
            const entry = db && db[ownerKey] && db[ownerKey][weaponKey];
            const n = entry && entry.name ? String(entry.name).trim() : '';
            return n || null;
        } catch(_) { return null; }
    }

    // 표시에 사용할 이름을 언어별로 결정 (이미지 매칭은 항상 한국어 클래스 키 기반 유지)
    // 특정 예외 매핑 사전
    const NAME_FIXUPS = {
        'Yui': 'YUI',
        'Kotone Montagne': 'Montagne Kotone'
    };

    function applyNameFixups(raw){
        try { const k = String(raw||'').trim(); return NAME_FIXUPS[k] || k; } catch(_) { return raw; }
    }

    function resolveDisplayName(name, label){
        try {
            const fixed = applyNameFixups(name);
            if (label === 'weapon') {
                const meta = resolveWeaponMeta(fixed);
                const alt = meta ? weaponNameByLang(meta.ownerKey, meta.weaponKey) : null;
                return alt || name;
            }
            const cls = resolveCharacterClass(fixed);
            if (!cls) return name;
            const info = (getCharData()||{})[cls];
            const alt = charNameByLang(info);
            return alt || name;
        } catch(_) { return name; }
    }

    // Supabase rows → merged payload 형태로 변환
    function shapeCloudRows(rows){
        const keys = ['Confirmed','Fortune','Weapon','Gold','Newcomer'];
        const data = {}; for (const k of keys) data[k] = { summary:{ pulledSum:0,total5Star:0,total4Star:0,win5050:0,avgPity:null }, records:[] };
        const byType = new Map();
        for (const r of rows){
            const t = r.gacha_type; if (!data[t]) continue;
            if (!byType.has(t)) byType.set(t, []);
            byType.get(t).push({ name:r.name, grade:Number(r.grade||0), timestamp:Number(r.timestamp||0), gachaId:r.gacha_id||null });
        }
        for (const [t, arr] of byType.entries()){
            arr.sort((a,b)=> a.timestamp-b.timestamp);
            // 간단히 한 그룹으로 묶어 segment 구성
            const seg = { fivestar: null, lastTimestamp: (arr[arr.length-1]?.timestamp||0), record: arr };
            const i5 = arr.findIndex(v=> Number(v.grade)===5); if (i5>=0) seg.fivestar = { name: arr[i5].name, timestamp: arr[i5].timestamp };
            data[t].records = [seg];
            const s = { pulledSum: arr.length, total5Star: arr.filter(v=>v.grade===5).length, total4Star: arr.filter(v=>v.grade===4).length, win5050:0, avgPity:null };
            data[t].summary = s;
        }
        return { version:1, updatedAt: Date.now(), data };
    }

    // Auto render from bundled example when available (dev view)
    try {
        /*
        const exampleAttr = els.cards ? els.cards.getAttribute('data-example') : null;
        const exampleUrl = exampleAttr || `${location.pathname}example.json`;
        */
       const exampleAttr = null;
       const exampleUrl = exampleAttr;

        Promise.all([loadCharacters(), loadWeapons()]).then(async () => {
            // Google Drive 병합본 우선 로드 (무팝업 토큰 갱신만 시도, 팝업 재인증은 하지 않음)
            try { await gapiInit(); } catch(_) {}
            let cloud = null;
            try {
                cloud = await driveLoadMerged(false);
                if (cloud && cloud.data) {
                    __dataSource = 'drive'; setStatus(`${t.loadedDrive} ${nowStamp()}`);
                    // 유저바가 비로그인 상태라면 저장 이메일로 표시 보정
                    try {
                        const email = localStorage.getItem('pull-tracker:google-email')||'';
                        if (email) renderAuthBarUI({ email });
                    } catch(_) {}
                }
            } catch(e) {
                // fetch 예외에서는 status가 없을 수 있으니 응답 본문으로 403 추정
                setStatus(t.driveForbidden);
                __needDriveConsent = true;
            }
            try {
                if (cloud && cloud.data) { const m = mergeWithCache(cloud); localStorage.setItem('pull-tracker:merged', JSON.stringify(m)); renderCardsFromExample(m); return; }
                // if (DEBUG) { setStatus(t.driveNeedConsent); return; }
                const mergedCached = localStorage.getItem('pull-tracker:merged');
                if (mergedCached) {
                    const json = JSON.parse(mergedCached);
                    __dataSource = 'local';
                    if (__needDriveConsent) setStatus(`${t.loadedLocal} ${nowStamp()}\n${t.driveNeedConsent}`);
                    else setStatus(`${t.loadedLocal} ${nowStamp()}`);
                    renderCardsFromExample(json); return;
                }
                const cached = localStorage.getItem('pull-tracker:last-response');
                if (cached) { const json = JSON.parse(cached); const m = mergeWithCache(json); renderCardsFromExample(m); return; }
            } catch(_) {}
        });
    } catch(_) {}
})();


