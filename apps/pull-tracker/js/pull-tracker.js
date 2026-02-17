(async () => {
    try { await (window.__pullI18nReady || Promise.resolve()); } catch (_) { }

    function tr(key, fallback) {
        try {
            if (window.PullTrackerI18n && typeof window.PullTrackerI18n.t === 'function') {
                return window.PullTrackerI18n.t(key, fallback);
            }
        } catch (_) { }
        return fallback || key;
    }

    function formatTemplate(template, vars = {}) {
        let out = String(template || '');
        Object.entries(vars).forEach(([k, v]) => {
            out = out.replaceAll(`{${k}}`, String(v));
        });
        return out;
    }

    const lang = (() => {
        try {
            if (window.PullTrackerI18n && typeof window.PullTrackerI18n.lang === 'function') {
                return window.PullTrackerI18n.lang();
            }
            return (new URLSearchParams(location.search).get('lang') || 'kr').toLowerCase();
        } catch (_) {
            return 'kr';
        }
    })();
    const DEBUG = false;
    const VERBOSE_LOG = false; // DEBUG 출력 중 상세 로그는 별도 플래그로 제어
    const t = {
        get navhome() { return tr('individual.nav.home', '홈'); },
        get pageTitle() { return tr('individual.pageTitle', '계약 트래커 (beta)'); },
        get navCurrent() { return tr('individual.nav.current', '계약 트래커'); },
        get inputLabel() { return tr('individual.inputLabel', 'URL 획득 방법'); },
        get placeholder() { return tr('individual.placeholder', '여기에 주소를 붙여넣기...'); },
        get start() { return tr('individual.buttons.start', '가져오기'); },
        get clear() { return tr('individual.buttons.clear', '초기화'); },
        get infoReady() { return tr('individual.info.ready', '가챠 기록 URL을 입력하고 가져오기를 누르세요.'); },
        get infoNotice() { return tr('individual.info.notice'); },
        get loadingTitle() { return tr('individual.loading.title', '서버에서 기록을 조회 중입니다...'); },
        get loadingDetail() { return tr('individual.loading.detail'); },
        get noticeLong() { return tr('individual.loading.noticeLong'); },
        elapsed: (m, s) => formatTemplate(tr('individual.loading.elapsed', '경과 시간: {m}분 {s}초'), { m, s }),
        get sending() { return tr('individual.status.sending', '요청 전송 중...'); },
        get waiting() { return tr('individual.status.waiting', '서버 응답 대기 중...'); },
        get tryGet() { return tr('individual.status.tryGet', '진행 중...'); },
        get invalidUrl() { return tr('individual.status.invalidUrl', '유효한 URL을 입력하세요.'); },
        done: (bytes) => formatTemplate(tr('individual.status.done', '완료 (응답 바이트: {bytes})'), { bytes }),
        get failed() { return tr('individual.status.failed', '요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); },
        get complete() { return tr('individual.status.complete', '✅ Complete'); },
        get confirmReset() { return tr('individual.confirm.reset', '정말 초기화할까요?'); },
        get loadedDrive() { return tr('individual.status.loadedDrive', '클라우드(Drive)에서 불러왔습니다.'); },
        get loadedLocal() { return tr('individual.status.loadedLocal', '로컬 브라우저에서 불러왔습니다.'); },
        get savedDrive() { return tr('individual.status.savedDrive', '클라우드(Drive)에 저장되었습니다.'); },
        get savedLocal() { return tr('individual.status.savedLocal', '로컬 브라우저에 저장되었습니다.'); },
        get deletedDrive() { return tr('individual.status.deletedDrive', '클라우드(Drive)에서 삭제했습니다.'); },
        get deleteDriveFailed() { return tr('individual.status.deleteDriveFailed', '클라우드(Drive) 삭제에 실패했습니다.'); },
        get allDeleted() { return tr('individual.status.allDeleted', '브라우저에 저장된 데이터를 삭제했습니다.'); },
        get driveForbidden() { return tr('individual.status.driveForbidden', 'Google Drive 접근이 거부되었습니다. (403) 권한 또는 설정을 확인하세요.'); },
        get driveNeedConsent() { return tr('individual.status.driveNeedConsent', '드라이브 접근 권한이 필요합니다. 상단 로그인 버튼을 눌러 권한을 승인해 주세요.'); },
        get driveNoData() { return tr('individual.status.driveNoData', '드라이브에 저장된 데이터가 없습니다.'); },
        get noData() { return tr('individual.status.noData', '저장된 데이터가 없습니다.'); },
        get driveQuotaExceeded() { return tr('individual.status.driveQuotaExceeded', 'Google 드라이브 저장 용량이 초과되었습니다. 공간을 확보해주세요.'); },
        get exampleApplyFailed() { return tr('individual.status.exampleApplyFailed', '예시 적용 실패'); },
        get recordAdded() { return tr('individual.status.recordAdded', '기록이 추가되었습니다.'); },
        get recordUpdated() { return tr('individual.status.recordUpdated', '기록이 수정되었습니다.'); },
        get recordDeleted() { return tr('individual.status.recordDeleted', '기록이 삭제되었습니다.'); },
        get adjustmentSaved() { return tr('individual.status.adjustmentSaved', '보정값이 저장되었습니다.'); },
        get cardsTitle() { return tr('individual.cardsTitle', '요약 카드 (최근 90일)'); },
        get hideUnder4() { return tr('individual.buttons.hideUnder4', '4★ 이하 숨기기'); },
        get authSignedIn() { return tr('individual.auth.signedIn', '로그인:'); },
        get authLogin() { return tr('individual.auth.login', '로그인'); },
        get authLogout() { return tr('individual.auth.logout', '로그아웃'); },
        get authScopeNote() { return tr('individual.auth.scopeNote', '※ 이 사이트에서 생성한 파일만 읽고 쓸 수 있습니다.'); },
        get pullsUnit() { return tr('individual.overview.pullsUnit', '회'); },
        get limited5() { return tr('individual.overview.limited5', '5성 한정'); },
        overviewSection: (key, fallback) => tr(`individual.overview.section.${key}`, fallback),
        bannerName: (key, fallback) => tr(`individual.bannerNames.${key}`, fallback || key),
        table: (key, fallback) => tr(`individual.table.${key}`, fallback || key),
        get manualTag() { return tr('individual.manual.tag', '수동'); },
        get lowAndBelow() { return tr('individual.lower.andBelow', '이하'); },
        mergeTitle: (source) => source === 'file'
            ? tr('individual.merge.fileTitle', '파일 가져오기')
            : tr('individual.merge.driveTitle', 'Drive 불러오기'),
        get mergeMessage() { return tr('individual.merge.message', '새 데이터 적용 방식 선택:\n\n병합: 기존 기록에 새 데이터를 합치기\n덮어쓰기: 현재 기록을 새 데이터로 교체하기'); },
        get mergeCancel() { return tr('individual.merge.cancel', '취소'); },
        get mergeMerge() { return tr('individual.merge.merge', '병합'); },
        get mergeOverwrite() { return tr('individual.merge.overwrite', '덮어쓰기'); }
    };

    const els = {
        home: document.getElementById('navhome'),
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
        if (els.home) els.home.textContent = t.navhome;
        if (els.title) els.title.textContent = t.pageTitle;
        if (els.navCurrent) els.navCurrent.textContent = t.navCurrent;
        const guideBtn = document.getElementById('openGuideBtn');
        if (guideBtn) {
            const svg = '<span class="help-icon" aria-hidden="true"><svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"/><path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"/></svg></span>';
            guideBtn.innerHTML = svg + '<span style="margin-left:6px;">' + t.inputLabel + '</span>';
        }
        if (els.input) els.input.setAttribute('placeholder', t.placeholder);
        if (els.start) els.start.textContent = t.start;
        if (els.clear) els.clear.textContent = t.clear;
        if (els.info) els.info.innerHTML = `${t.infoReady}<br>${t.infoNotice}`;
        const hide4 = document.getElementById('hide4Label');
        if (hide4) hide4.textContent = t.hideUnder4;
        if (els.cardsTitle) els.cardsTitle.textContent = t.cardsTitle;
        // auth bar labels
        try {
            const signed = document.getElementById('ptUserSignedAs');
            const loginBtn = document.getElementById('ptLoginBtn');
            const logoutBtn = document.getElementById('ptLogoutBtn');
            const scopeNote = document.getElementById('ptScopeNote');
            if (signed) signed.textContent = t.authSignedIn;
            if (loginBtn) loginBtn.textContent = t.authLogin;
            if (logoutBtn) logoutBtn.textContent = t.authLogout;
            if (scopeNote) scopeNote.textContent = t.authScopeNote;
        } catch (_) { }
    }

    function bindRuntimeUi() {
        try {
            // URL 가이드 버튼 이동
            const gbtn = document.getElementById('openGuideBtn');
            if (gbtn) {
                gbtn.addEventListener('click', () => {
                    const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                    const targetLang = ['kr', 'en', 'jp'].includes(lang) ? lang : 'kr';
                    location.href = `${base}/${targetLang}/pull-tracker/url-guide/`;
                });
            }
            const box = document.getElementById('debugExamples');
            if (!box) return;
            if (DEBUG) box.style.display = 'flex';
            const btn = document.getElementById('applyExampleBtn');
            const sel = document.getElementById('exampleSelect');
            if (btn && sel) {
                btn.addEventListener('click', async () => {
                    try {
                        const n = String(sel.value || '1');
                        const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                        const url = `${base}/apps/pull-tracker/examples/example${n === '1' ? '' : n}.json?v=${Date.now()}`;
                        const res = await fetch(url);
                        if (!res.ok) throw new Error('example fetch failed');
                        const text = await res.text();
                        setResult(text);
                        try { localStorage.setItem('pull-tracker:last-response', text); } catch (_) { }
                        const incoming = parseIncoming(text);
                        const merged = ensureTsOrderInPayload(mergeWithCache(incoming));
                        localStorage.setItem('pull-tracker:merged', JSON.stringify(merged));
                        renderCardsFromExample(merged);
                        __dataSource = 'local';
                        setStatus(`${t.savedLocal} ${nowStamp()}\n${t.complete}`);
                    } catch (e) { setStatus(t.exampleApplyFailed); }
                });
            }
        } catch (_) { }
    }

    // i18n 초기화 대기 후 이 코드가 실행되므로, DOMContentLoaded가 이미 끝났을 수 있다.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindRuntimeUi, { once: true });
    } else {
        bindRuntimeUi();
    }

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
            } catch (_) { resolve(); }
        });
    }

    // GIS 하드닝: 사용자 제스처 없이 popup flow가 시작되지 않도록 차단
    (function hardenGIS() {
        const tryPatch = () => {
            try {
                if (!window.google || !google.accounts || !google.accounts.oauth2) return;
                if (google.__pt_hardened) return;
                const origInit = google.accounts.oauth2.initTokenClient;
                if (typeof origInit !== 'function') return;
                google.accounts.oauth2.initTokenClient = function (config) {
                    const client = origInit(config);
                    const origReq = client.requestAccessToken && client.requestAccessToken.bind(client);
                    if (typeof origReq === 'function') {
                        client.requestAccessToken = function (options) {
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
            } catch (_) { }
        };
        window.__pt_allowInteractive = false;
        const id = setInterval(() => { tryPatch(); if (window.google && google.__pt_hardened) clearInterval(id); }, 60);
        document.addEventListener('DOMContentLoaded', tryPatch);
    })();

    // Token client (silent refresh)
    function initTokenClientOnce() {
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
                        try { localStorage.setItem('pull-tracker:google-token', __googleToken); } catch (_) { }
                        localStorage.setItem('pull-tracker:google-exp', String(__tokenExpAt));
                    }
                }
            });
        } catch (_) { }
        return tokenClient;
    }

    async function ensureTokenSilent() {
        try {
            // 저장된 토큰이 없으면 절대 무팝업 요청을 시도하지 않음 (사용자 클릭 전 UI 노출 방지)
            if (!__googleToken) return false;
            if (Date.now() < __tokenExpAt) return true;
            initTokenClientOnce();
            return await new Promise((resolve) => {
                try {
                    tokenClient.callback = (resp) => { resolve(!!(resp && resp.access_token)); };
                    tokenClient.requestAccessToken({ prompt: '' }); // 무팝업 갱신만
                } catch (_) { resolve(false); }
            });
        } catch (_) { return false; }
    }

    async function tokenHas(scopeSubstr) {
        if (!__googleToken) return false;
        try {
            const r = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + encodeURIComponent(__googleToken));
            const j = await r.json();
            return typeof j.scope === 'string' && j.scope.includes(scopeSubstr);
        } catch (_) { return false; }
    }

    // 공통: Drive API 호출 래퍼 (401/403 시 선택적으로 재인증)
    async function driveFetch(url, options = {}, interactive = false) {
        let res = await fetch(url, options);
        try {
            if (res.status === 403) {
                const txt = await res.clone().text();
                if (/storageQuotaExceeded/i.test(txt)) {
                    setStatus(t.driveQuotaExceeded);
                }
            }
        } catch (_) { }
        // 재인증은 401(만료/무효 토큰)에 한정. 403은 권한/정책/쿼터 이슈일 수 있어 재팝업 금지
        if (res.status === 401 && interactive) {
            try { await gapiInit(); await googleSignIn(); } catch (_) { }
            res = await fetch(url, { ...options, headers: { ...(options.headers || {}), Authorization: 'Bearer ' + __googleToken } });
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
        } catch (_) { }
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
            try { localStorage.setItem('pull-tracker:google-token', __googleToken || ''); } catch (_) { }
        } else {
            if (nameEl) nameEl.textContent = '';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            try { localStorage.removeItem('pull-tracker:google-token'); } catch (_) { }
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
                        } catch (_) { }
                        // 2) 사용자 정보 가져오기 (OIDC userinfo)
                        let profile = null;
                        try {
                            const r = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
                                headers: { Authorization: 'Bearer ' + __googleToken }
                            });
                            profile = r.ok ? await r.json() : null; // { email, name, ... }
                        } catch (_) { }
                        try { if (profile && profile.email) localStorage.setItem('pull-tracker:google-email', profile.email); } catch (_) { }
                        renderAuthBarUI(profile || { email: (localStorage.getItem('pull-tracker:google-email') || '') });
                        window.__pt_allowInteractive = prev;
                        resolve(resp);
                    }
                });
                client.requestAccessToken(); // 최초 동의 이후엔 prompt 없이 재발급됨
            } catch (e) { try { window.__pt_allowInteractive = false; } catch (_) { }; resolve(null); }
        });
    }


    function googleSignOut() { __googleAuthed = false; __googleToken = null; renderAuthBarUI(null); }

    async function driveFetchFileIds(interactive = false) {
        try {
            if (!__googleToken) return null;
            const q = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and 'appDataFolder' in parents and trashed=false`);
            const url = `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=appDataFolder&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`;
            let res = await driveFetch(url, { headers: { Authorization: 'Bearer ' + __googleToken } }, interactive);
            const json = await res.json();
            return Array.isArray(json.files) ? json.files : [];
        } catch (_) { return null; }
    }

    async function driveFetchFileId(interactive = false) {
        const files = await driveFetchFileIds(interactive);
        if (!files || files.length === 0) return null;
        return files[0].id || null;
    }


    async function driveLoadMerged(interactive = false) {
        try {
            if (!__googleToken) return null;
            // 항상 AppDataFolder에서만 로드(디버그에서도 예외 없음)
            const fileId = await driveFetchFileId(interactive);
            if (!fileId) return null;
            const bust = Date.now();
            let res = await driveFetch('https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media&v=' + bust, { headers: { Authorization: 'Bearer ' + __googleToken, 'Cache-Control': 'no-cache' } }, interactive);
            if (!res.ok) return null;
            return await res.json();
        } catch (_) { return null; }
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
                res = await driveFetch(url, { method: 'PATCH', headers: { 'Authorization': 'Bearer ' + __googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
                if (res.status === 403) {
                    // 폴백: 새 파일 생성
                    const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
                    res = await driveFetch(createUrl, { method: 'POST', headers: { 'Authorization': 'Bearer ' + __googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
                }
            } else {
                const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
                res = await driveFetch(createUrl, { method: 'POST', headers: { 'Authorization': 'Bearer ' + __googleToken, 'Content-Type': 'multipart/related; boundary=' + boundary }, body }, interactive);
            }
            return res.ok;
        } catch (_) { return false; }
    }

    async function driveDeleteMerged(interactive = false) {
        try {
            if (!__googleToken) return false;
            const files = await driveFetchFileIds(interactive);
            if (!files || files.length === 0) return true;
            let allOk = true;
            for (const f of files) {
                const res = await driveFetch('https://www.googleapis.com/drive/v3/files/' + f.id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + __googleToken } }, interactive);
                allOk = allOk && (res.ok || res.status === 404);
            }
            return allOk;
        } catch (_) { return false; }
    }

    async function initAuthBar() {
        const loginBtn = document.getElementById('ptLoginBtn');
        const logoutBtn = document.getElementById('ptLogoutBtn');
        // 토큰 복원으로 로그인 유지 + 유효성 확인 (자동 재인증은 하지 않음)
        try {
            const tok = localStorage.getItem('pull-tracker:google-token');
            if (tok) {
                __googleToken = tok; __googleAuthed = true;
                __tokenExpAt = Number(localStorage.getItem('pull-tracker:google-exp') || '0') || 0;
                // 새로고침 시에는 무팝업 갱신조차 시도하지 않음(일부 환경에서 팝업 생성 방지)
                try {
                    const r = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: 'Bearer ' + __googleToken } });
                    if (r.status === 401 || r.status === 403) { __googleAuthed = false; __googleToken = null; renderAuthBarUI({ email: (localStorage.getItem('pull-tracker:google-email') || '') }); }
                    else {
                        const profile = await r.json().catch(() => null);
                        try { if (profile && profile.email) localStorage.setItem('pull-tracker:google-email', profile.email); } catch (_) { }
                        renderAuthBarUI(profile || { email: (localStorage.getItem('pull-tracker:google-email') || '') });
                    }
                } catch (_) { }
            } else { renderAuthBarUI(null); }
        } catch (_) { renderAuthBarUI(null); }
        if (loginBtn) loginBtn.onclick = async () => {
            const prev = window.__pt_allowInteractive;
            window.__pt_allowInteractive = true;
            try {
                await gapiInit();
                await googleSignIn();
                // 로그인만 수행하고, Drive에서의 실제 데이터 불러오기는 사용자가 별도 버튼으로 실행
                setStatus('');
            } finally {
                window.__pt_allowInteractive = prev;
            }
        };
        if (logoutBtn) logoutBtn.onclick = () => { googleSignOut(); };
    }

    // 병합 완료 시 Google Drive 저장 (수동 호출용)
    async function syncMergedToCloud() {
        try {
            if (!__googleAuthed) return 'AUTH';
            const ok = await ensureTokenSilent();
            if (!ok) return 'AUTH';
            const s = localStorage.getItem('pull-tracker:merged');
            if (!s) return 'EMPTY';
            const merged = JSON.parse(s);
            const res = await driveSaveMerged(merged, true);
            return !!res;
        } catch (_) {
            return false;
        }
    }

    // 수동 Drive 로드용 헬퍼 (drive-sync.js에서 호출)
    // opts: { interactive: boolean, merge: boolean }
    async function loadFromCloud(opts) {
        try {
            const interactive = !!(opts && opts.interactive);
            const doMerge = !!(opts && opts.merge);
            if (!__googleAuthed || !__googleToken) return 'AUTH';
            const cloud = await driveLoadMerged(interactive);
            if (!cloud || !cloud.data) return 'EMPTY';
            const fixed = ensureTsOrderInPayload(cloud);

            let finalPayload;
            const existing = localStorage.getItem('pull-tracker:merged');
            if (doMerge && existing && typeof mergeWithCache === 'function') {
                finalPayload = mergeWithCache(fixed);
            } else {
                finalPayload = fixed;
            }

            localStorage.setItem('pull-tracker:merged', JSON.stringify(finalPayload));
            renderCardsFromExample(finalPayload);
            setMergedDebug(finalPayload);
            setHide4Visible(true);
            return true;
        } catch (_) {
            return false;
        }
    }

    // expose helpers for other scripts
    window.pullTrackerInitAuth = initAuthBar;
    try {
        window.pullTrackerSyncToCloud = syncMergedToCloud;
        window.pullTrackerLoadFromCloud = loadFromCloud;
        window.pullTrackerChooseMergeMode = chooseMergeMode;
    } catch (_) { }

    function renderOverview(payload) {
        try {
            const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
            const jewel = `${base}/assets/img/pay/이계 엠버.png`;
            const get = (key) => payload.data[key];
            const blocks = {
                pickup: [get('Confirmed'), get('Fortune')],
                weapon: [get('Weapon'), get('Weapon_Confirmed')],
                standard: [get('Gold'), get('Newcomer')]
            };
            const inProgressOf = (b) => {
                try {
                    const list = Array.isArray(b.records) ? b.records : [];
                    let s = 0; for (const seg of list) { if (seg && seg.fivestar == null) { const rec = Array.isArray(seg.record) ? seg.record : []; s += rec.length; } }
                    return s;
                } catch (_) { return 0; }
            };
            const calc = (arr) => {
                const sum = (sel) => arr.reduce((s, b) => s + (Number(((b || {}).summary || {})[sel]) || 0), 0);
                const pulled = sum('pulledSum');
                const t5 = sum('total5Star');
                const t4 = sum('total4Star');
                const effTotal = pulled - arr.reduce((s, b) => s + inProgressOf(b || {}), 0);
                const avg5 = (arr.map(b => Number((b || {}).summary?.avgPity) || 0).filter(Boolean).reduce((a, b) => a + b, 0) / Math.max(1, arr.filter(b => Number(b?.summary?.avgPity)).length)) || null;
                const rate5 = effTotal > 0 && t5 >= 0 ? (t5 / effTotal * 100) : null;
                const rate4 = pulled > 0 && t4 >= 0 ? (t4 / pulled * 100) : null;
                return { pulled, effTotal, t5, t4, avg5, rate5, rate4 };
            };
            const pickup = calc(blocks.pickup);
            const weapon = calc(blocks.weapon);
            const standard = calc(blocks.standard);

            const jewelCost = (key) => {
                if (key === 'pickup') return pickup.pulled * 150;
                if (key === 'weapon') return weapon.pulled * 100;
                if (key === 'standard') {
                    const goldPulled = Number((blocks.standard[0]?.summary?.pulledSum) || 0);
                    const newcomerPulled = Number((blocks.standard[1]?.summary?.pulledSum) || 0);
                    return goldPulled * 150 + newcomerPulled * 120;
                }
                return 0;
            };

            const makeCard = (key, title, data, ExtraRow = null, titleIcon = null) => {
                const el = document.createElement('div');
                el.className = 'overview-card';
                // title with right-side icon (like stat-cards)
                const titleWrap = document.createElement('div');
                titleWrap.className = 'h3-row';
                const h3 = document.createElement('h3'); h3.textContent = title;
                titleWrap.appendChild(h3);
                if (titleIcon) { const ic = document.createElement('img'); ic.src = titleIcon; ic.alt = key; ic.className = 'card-title-icon'; titleWrap.appendChild(ic); }
                el.appendChild(titleWrap);
                // top stats: 총 뽑기 N회 / {jewel} cost
                const pullsSuffix = t.pullsUnit;
                const topRow = document.createElement('div'); topRow.className = 'stat'; topRow.style.fontSize = '13px'; topRow.style.justifyContent = 'flex-start'; topRow.style.gap = '16px';
                // const l = document.createElement('span'); l.textContent = textFor('total');
                const r = document.createElement('strong');
                const txt = document.createElement('span'); txt.textContent = `${numberFmt(data.pulled)}${pullsSuffix}`; txt.style.marginRight = '8px';
                const jimg = document.createElement('img'); jimg.src = jewel; jimg.alt = 'j'; jimg.className = 'jewel'; jimg.style.marginLeft = '16px';
                const jv = document.createElement('span'); jv.textContent = numberFmt(jewelCost(key)); jv.style.fontSize = '13px'; jv.style.color = '#cdcdcd'; jv.style.fontWeight = '400';
                r.appendChild(txt); r.appendChild(jimg); r.appendChild(jv);
                //topRow.appendChild(l); 
                topRow.appendChild(r);
                titleWrap.appendChild(topRow);
                // el.appendChild(topRow);

                // ----------------------------
                // chart canvas
                const canvas = document.createElement('canvas'); canvas.className = 'overview-chart';
                el.appendChild(canvas);
                requestAnimationFrame(() => { try { if (window.drawOverviewChart) window.drawOverviewChart(canvas, blocks, key, lang); } catch (_) { } });

                const table = document.createElement('div');
                table.className = 'stat-table';
                const header = document.createElement('div'); header.className = 'tr';
                header.appendChild(cell('th', ''));
                header.appendChild(cell('th', textFor('count')));
                header.appendChild(cell('th', textFor('rate')));
                header.appendChild(cell('th', textFor('avg')));
                table.appendChild(header);
                // 5★
                const row5 = document.createElement('div'); row5.className = 'tr five';
                row5.appendChild(cell('td', '5★'));
                row5.appendChild(cell('td', numberFmt(data.t5)));
                row5.appendChild(cell('td', data.rate5 != null ? numberFmt(data.rate5, 2) + '%' : '-'));
                row5.appendChild(cell('td', data.avg5 != null ? numberFmt(data.avg5, 2) : '-'));
                table.appendChild(row5);
                // extra
                if (ExtraRow) { const holder = document.createElement('div'); holder.innerHTML = ExtraRow; while (holder.firstChild) { table.appendChild(holder.firstChild); } }
                // 4★
                const row4 = document.createElement('div'); row4.className = 'tr four';
                row4.appendChild(cell('td', '4★'));
                row4.appendChild(cell('td', numberFmt(data.t4)));
                row4.appendChild(cell('td', data.rate4 != null ? numberFmt(data.rate4, 2) + '%' : '-'));
                row4.appendChild(cell('td', data.pulled > 0 ? numberFmt(data.pulled / Math.max(1, data.t4), 2) : '-'));
                table.appendChild(row4);
                el.appendChild(table);
                return el;
            };
            function cell(cls, html) { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; }
            // drawOverviewChart moved to charts.js

            // 5성 픽업(운명/확정 합산, 무기는 50:50)
            const pickupWin = (Number(blocks.pickup[0]?.summary?.win5050) || 0) + (Number(blocks.pickup[1]?.summary?.win5050) || 0);
            const pickupRate = (pickup.t5 > 0) ? (pickupWin / pickup.t5 * 100) : null;
            const pickupAvg = (pickupWin > 0) ? (pickup.effTotal / pickupWin) : null;
            const pickupLabel = `  └ ${t.limited5}`;
            const pickupExtra = `<div class=\"tr fifty\"><div class=\"td\">${pickupLabel}</div><div class=\"td\">${numberFmt(pickupWin)}</div><div class=\"td\">${pickupRate != null ? numberFmt(pickupRate, 2) + '%' : '-'}</div><div class=\"td\">${pickupAvg != null ? numberFmt(pickupAvg, 2) : '-'}</div></div>`;

            // Weapon만 50:50 계산, Weapon_Confirmed는 제외
            const weaponWin = (Number(blocks.weapon[0]?.summary?.win5050) || 0);
            const weaponTotal5 = (Number(blocks.weapon[0]?.summary?.total5Star) || 0) + (Number(blocks.weapon[1]?.summary?.total5Star) || 0);
            const weaponLabel = `  └ ${t.limited5}`;
            const weaponAvg = weaponWin > 0 ? (weapon.effTotal / weaponWin) : null;
            const weaponExtra = `<div class=\"tr fifty\"><div class=\"td\">${weaponLabel}</div><div class=\"td\">${numberFmt(weaponWin)}</div><div class=\"td\">${weaponTotal5 > 0 ? numberFmt(weaponWin / weaponTotal5 * 100, 2) + '%' : '-'}</div><div class=\"td\">${weaponAvg != null ? numberFmt(weaponAvg, 2) : '-'}</div></div>`;

            const wrap = els.overview;
            wrap.innerHTML = '';
            const iconMap = { pickup: '정해진 운명.png', weapon: '정해진 코인.png', standard: '미래의 운명.png' };
            wrap.appendChild(makeCard('pickup', t.overviewSection('character', 'Character'), pickup, pickupExtra, `${base}/assets/img/pay/${iconMap.pickup}`));
            wrap.appendChild(makeCard('weapon', t.overviewSection('weapon', 'Weapon'), weapon, weaponExtra, `${base}/assets/img/pay/${iconMap.weapon}`));
            wrap.appendChild(makeCard('standard', t.overviewSection('standard', 'Standard'), standard, null, `${base}/assets/img/pay/${iconMap.standard}`));
        } catch (_) { }
    }

    applyTexts();

    // tooltip lib loader
    function ensureTooltipLib() {
        return new Promise((resolve) => {
            try {
                if (window.bindTooltipElement) return resolve();
                const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                const s = document.createElement('script');
                s.src = `${base}/assets/js/tooltip.js?v=${Date.now()}`;
                s.onload = () => resolve();
                s.onerror = () => resolve();
                document.head.appendChild(s);
            } catch (_) { resolve(); }
        });
    }

    // Load KR characters database for name→class mapping
    function getCharData() {
        try {
            // top-level const characterData is not a window property; access via identifier when available
            // eslint-disable-next-line no-undef
            if (typeof characterData !== 'undefined') return characterData;
        } catch (_) { }
        return window.characterData || null;
    }

    // Load KR weapons database for weapon→owner mapping
    function getWeaponData() {
        try {
            // eslint-disable-next-line no-undef
            if (typeof WeaponData !== 'undefined') return WeaponData;
        } catch (_) { }
        return window.WeaponData || null;
    }

    async function loadCharacters() {
        if (getCharData()) return;
        await new Promise((resolve) => {
            try {
                const s = document.createElement('script');
                const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                s.src = `${base}/data/character_info.js?v=${Date.now()}`;
                s.onload = () => resolve();
                s.onerror = () => resolve();
                document.head.appendChild(s);
            } catch (_) { resolve(); }
        });
        /*
        if (DEBUG) {
            try {
                const g = getCharData();
                console.log('[pull-tracker] characters loaded:', !!g, g ? Object.keys(g).length : 0);
            } catch(_) {}
        }*/
    }

    // 무기 데이터는 이제 /data/characters/<캐릭터>/weapon.js 에서만 관리
    let __weaponsLoading = null;
    async function loadWeapons() {
        if (__weaponsLoading) return __weaponsLoading;
        __weaponsLoading = (async () => {
            try {
                // 글로벌 컨테이너 보장
                window.WeaponData = window.WeaponData || {};
                window.enCharacterWeaponData = window.enCharacterWeaponData || {};
                window.jpCharacterWeaponData = window.jpCharacterWeaponData || {};
                window.cnCharacterWeaponData = window.cnCharacterWeaponData || {};

                const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                const ver = (typeof window.APP_VERSION !== 'undefined') ? window.APP_VERSION : Date.now();
                const chars = Object.keys(getCharData() || {});
                if (!chars.length) return;

                const tasks = chars.map((name) => new Promise((res) => {
                    try {
                        const s = document.createElement('script');
                        s.src = `${base}/data/characters/${encodeURIComponent(name)}/weapon.js?v=${ver}`;
                        s.onload = () => res();
                        // 404 등 에러는 무시하고 계속 진행 (콘솔 에러는 브라우저가 표시하지만 프로세스는 계속됨)
                        s.onerror = () => res();
                        document.head.appendChild(s);
                    } catch (_) {
                        // 에러 발생해도 계속 진행
                        res();
                    }
                }));
                await Promise.all(tasks);
                // 스크립트 로드 후 데이터가 설정될 시간을 약간 대기
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (_) { }
        })();
        return __weaponsLoading;
    }

    // manual-editor에서 사용할 수 있도록 window에 노출
    try {
        window.loadWeapons = loadWeapons;
        window.loadCharacters = loadCharacters;
    } catch (_) { }

    // Persist last URL (자동 입력은 비활성화)
    const STORAGE_KEY = 'pull-tracker:last-url';

    function setStatus(lines) {
        if (!els.status) return;
        if (Array.isArray(lines)) {
            els.status.textContent = lines.filter(Boolean).join('\n');
        } else {
            els.status.textContent = lines || '';
        }
    }
    try { window.__pull_setStatus = setStatus; } catch (_) { }

    function setHide4Visible(visible) {
        try { const lbl = document.querySelector('.hide4-toggle'); if (lbl) lbl.style.display = visible ? 'inline-block' : 'none'; } catch (_) { }
    }

    let __dataSource = null; // 'drive' | 'local' | null
    let __needDriveConsent = false;

    // inline 로딩 UI를 유지하면서 메시지만 교체하는 헬퍼
    function updateInlineStatus(message) {
        try {
            if (!els.status) return;
            els.status.innerHTML = `<span class="spinner" style="display:inline-block;vertical-align:-3px;margin-right:6px;width:14px;height:14px;border-width:2px"></span>${message} <span id="inline-elapsed"></span>`;
        } catch (_) { }
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
        } catch (_) { }
    }

    // JSON.parse 전에 gachaId 숫자 리터럴을 문자열로 강제
    function normalizeGachaIdText(text) {
        try {
            // "gachaId": 123, "gachaId": 1.23e16 등 모든 숫자 리터럴을 문자열로 치환
            return String(text).replace(/("gachaId"\s*:\s*)(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g, '$1"$2"');
        } catch (_) { return text; }
    }
    function parseIncoming(text) {
        try { return JSON.parse(normalizeGachaIdText(text)); }
        catch (_) { return JSON.parse(text); }
    }

    // payload 내 모든 record에 대해, 같은 timestamp 묶음에서 tsOrder/ts_order가 없으면 현재 배열 순서로 보정
    function ensureTsOrderInPayload(payload) {
        try {
            if (!payload || !payload.data) return payload;
            const KEYS = ['Confirmed', 'Fortune', 'Weapon', 'Weapon_Confirmed', 'Gold', 'Newcomer'];
            for (const k of KEYS) {
                const block = payload.data[k];
                if (!block || !Array.isArray(block.records)) continue;
                for (const seg of block.records) {
                    const recs = Array.isArray(seg?.record) ? seg.record : [];
                    // timestamp별 인덱스 할당 (기존 tsOrder/ts_order가 있으면 그대로 둠)
                    const perTsIdx = new Map();
                    for (let i = 0; i < recs.length; i++) {
                        const r = recs[i] || {};
                        const t = Number(r.timestamp ?? r.time ?? r.ts ?? 0) || 0;
                        const has = (r.tsOrder != null) || (r.ts_order != null);
                        if (!t || has) continue;
                        const idx = perTsIdx.get(t) || 0;
                        perTsIdx.set(t, idx + 1);
                        r.tsOrder = idx;
                        r.ts_order = idx;
                        // ensure persists on object
                        recs[i] = r;
                    }
                }
            }
        } catch (_) { }
        return payload;
    }

    // DEBUG: 병합/로컬 로드된 데이터(result-response) 표시
    function setMergedDebug(obj) {
        if (!DEBUG) return;
        try {
            const raw = document.getElementById('result');
            if (!raw) return;
            // 캡션(한 번만 생성)
            let cap = document.getElementById('resultMergedLabel');
            if (!cap) {
                cap = document.createElement('div');
                cap.id = 'resultMergedLabel';
                cap.style.marginTop = '8px';
                cap.style.opacity = '.7';
                cap.style.fontSize = '12px';
                cap.textContent = 'result-response';
                raw.insertAdjacentElement('afterend', cap);
            } else {
                cap.style.display = 'block';
            }
            let pre = document.getElementById('resultMerged');
            if (!pre) {
                pre = document.createElement('pre');
                pre.id = 'resultMerged';
                pre.className = 'raw-response'; // raw-response 스타일 재사용(스크롤/높이 제한)
                pre.style.display = 'block';
                pre.style.marginTop = '4px';
                cap.insertAdjacentElement('afterend', pre);
            }
            pre.style.display = 'block';
            pre.textContent = (typeof obj === 'string') ? obj : JSON.stringify(obj, null, 2);
        } catch (_) { }
    }

    function startLoadingUI() {
        const startedAt = Date.now();
        // top inline status with spinner
        try {
            updateInlineStatus(t.waiting);
        } catch (_) { }
        let dot = 0;
        const anim = setInterval(() => {
            dot = (dot + 1) % 4;
            const d = '.'.repeat(dot);
            const elapsedMs = Date.now() - startedAt;
            const m = Math.floor(elapsedMs / 60000);
            const s = Math.floor((elapsedMs % 60000) / 1000);
            try { const el = document.getElementById('inline-elapsed'); if (el) el.textContent = `(${t.elapsed(m, s)})`; } catch (_) { }
            try {
                const ldTitle = document.getElementById('ld-title');
                const ldSub = document.getElementById('ld-sub');
                const ldElapsed = document.getElementById('ld-elapsed');
                if (ldTitle) ldTitle.textContent = t.loadingTitle;
                if (ldSub) ldSub.textContent = `${t.waiting} ${d}`;
                if (ldElapsed) ldElapsed.textContent = t.elapsed(m, s);
            } catch (_) { }
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
        try { localStorage.setItem(STORAGE_KEY, userUrl); } catch (_) { }

        setResult('');
        const stop = startLoadingUI();
        try {
            await loadCharacters();
            await loadWeapons();
            const text = await fetchRecords(userUrl);
            // if (DEBUG) { try { console.log('[pull-tracker][raw-response]', text.slice(0, 1000)); } catch(_) {} }
            stop();
            setStatus('✅ Complete');
            setResult(text);

            try {
                const incoming = parseIncoming(text);
                try { console.log('[pull-tracker][incoming]', incoming); } catch (_) { }
                try { localStorage.setItem('pull-tracker:last-response', text); } catch (_) { }
                // 병합 수행 → 저장 → 렌더
                const merged = ensureTsOrderInPayload(mergeWithCache(incoming));
                try { console.log('[pull-tracker][merged]', merged); } catch (_) { }
                try { localStorage.setItem('pull-tracker:merged', JSON.stringify(merged)); } catch (_) { }
                renderCardsFromExample(merged);
                setMergedDebug(merged);
                setStatus(`${t.savedLocal} ${nowStamp()}`);
            } catch (_) {
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
        } catch (_) { }
        // 입력 및 화면 초기화
        try { if (els.input) els.input.value = ''; } catch (_) { }
        try { setStatus(''); } catch (_) { }
        try { setResult(''); } catch (_) { }
        try { const m = document.getElementById('resultMerged'); if (m) m.textContent = ''; } catch (_) { }
        try { if (els.cards) els.cards.innerHTML = ''; } catch (_) { }
        try { if (els.overview) els.overview.innerHTML = ''; } catch (_) { }

        // 로컬 저장소 정리
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) { }
        try { localStorage.removeItem('pull-tracker:last-response'); } catch (_) { }
        try { localStorage.removeItem('pull-tracker:merged'); } catch (_) { }
        __dataSource = null;
        // hide4 설정은 사용자 환경 설정이므로 유지

        // Drive 데이터는 별도 버튼(Drive 저장/불러오기)로만 조작하며, 초기화 시에는 건드리지 않는다.
        setStatus(`${t.allDeleted} ${nowStamp()}`);
        setHide4Visible(false);
    }

    if (els.start) els.start.addEventListener('click', onStart);
    if (els.clear) els.clear.addEventListener('click', onClear);

    // Build stat cards from example.json-like structure
    function renderCardsFromExample(payload) {
        if (!payload || !payload.data || !els.cards) return;
        // 카드 순서/행 구성: 1행(확정/운명/일반), 2행(무기/무기확정/신규)
        const types = [
            ['Fortune', 'fortune'],
            ['Confirmed', 'confirmed'],
            ['Weapon', 'weapon'],
            ['Weapon_Confirmed', 'weapon_confirmed'],
            ['Gold', 'gold'],
            ['Newcomer', 'newcomer']
        ];

        els.cards.innerHTML = '';
        // 4★ 숨기기 상태 불러오기
        let hide4 = false;
        try { hide4 = localStorage.getItem('pull-tracker:hide4') === '1'; } catch (_) { }
        const hide4Chk = document.getElementById('hide4Chk');
        if (hide4Chk) {
            hide4Chk.checked = hide4; hide4Chk.onchange = () => {
                try { localStorage.setItem('pull-tracker:hide4', hide4Chk.checked ? '1' : '0'); } catch (_) { }
                // 재렌더
                renderCardsFromExample(payload);
            };
        }
        if (els.overview) renderOverview(payload);

        for (const [key, label] of types) {
            const block = payload.data[key];
            // Weapon_Confirmed는 데이터가 없어도 카드 표시
            if (!block && key !== 'Weapon_Confirmed') continue;
            // Weapon_Confirmed가 없으면 빈 블록 생성
            const actualBlock = block || { summary: { pulledSum: 0, total5Star: 0, total4Star: 0, win5050: 0, avgPity: null }, records: [] };

            // 총 뽑기: summary.pulledSum
            const total = getNumber(actualBlock, ['summary', 'pulledSum']);
            // 진행 중(현재 5★ 미확정 구간) 계산: fivestar === null 인 섹션들의 record 길이 합
            let inProgress = (() => {
                try {
                    const list = Array.isArray(actualBlock.records) ? actualBlock.records : [];
                    if (list.length === 0) return 0;
                    // 이 블록의 모든 진행 중 세그먼트 길이 합산 (overview 규칙과 동일화)
                    let s = 0;
                    for (const seg of list) {
                        if (seg && seg.fivestar == null) {
                            const rec = Array.isArray(seg.record) ? seg.record : [];
                            s += rec.length;
                        }
                    }
                    return s;
                } catch (_) { return 0; }
            })();
            // 엔진 summary 값이 있으면 우선 사용
            const inProgressFromSummary = getNumber(actualBlock, ['summary', 'inProgressCount']);
            if (Number.isFinite(inProgressFromSummary)) inProgress = inProgressFromSummary;
            const effectiveSummary = getNumber(block, ['summary', 'effectivePulled']);
            const effectiveTotal = Number.isFinite(effectiveSummary) ? effectiveSummary : Math.max(0, (Number.isFinite(total) ? total : 0) - inProgress);

            const avgPity = getNumber(actualBlock, ['summary', 'avgPity']);
            const total5 = getNumber(actualBlock, ['summary', 'total5Star']);
            const total4 = getNumber(actualBlock, ['summary', 'total4Star']);
            const win5050 = getNumber(actualBlock, ['summary', 'win5050']);

            // 보정값 가져오기 (먼저 정의해야 함)
            let adjustedTotal = total;
            let adjustedProgress = inProgress;
            if (window.RecordManager && window.RecordManager.getAdjustedTotal) {
                adjustedTotal = window.RecordManager.getAdjustedTotal(key, total);
                adjustedProgress = window.RecordManager.getAdjustedProgress(key, inProgress);
            }

            // 보정된 유효 뽑기 수 계산
            const adjustedEffectiveTotal = Math.max(0, adjustedTotal - adjustedProgress);

            // 확률(비율): 전체 뽑기 대비 해당 등급 출현 비율
            // 5★ 확률만 (총-진행중) 기준, 4★는 총 뽑기 기준
            const fiveRate = adjustedEffectiveTotal > 0 && total5 >= 0 ? ((total5 / adjustedEffectiveTotal) * 100) : null;
            const fourRate = adjustedTotal > 0 && total4 >= 0 ? ((total4 / adjustedTotal) * 100) : null;
            // 평균 뽑기 횟수: 데이터 기반 근사치 (총 뽑기 / 등급 개수). 5★은 avgPity 우선 사용
            const fiveAvg = (total5 > 0 ? (adjustedEffectiveTotal / total5) : null);
            const fourAvg = total4 > 0 ? (adjustedTotal / total4) : null;
            // 50:50 승리 비율: 5★ 중 win5050 개수 비율
            const win5050Rate = (total5 > 0 && win5050 != null) ? ((win5050 / total5) * 100) : null;
            const win5050Avg = (win5050 && win5050 > 0) ? (adjustedEffectiveTotal / win5050) : null;

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
                weapon: '정해진 코인.png',
                weapon_confirmed: '정해진 코인.png'
            };
            const iconName = iconMap[label];
            if (iconName) {
                icon.src = `${base}/assets/img/pay/${iconName}`;
                icon.alt = label;
                icon.loading = 'lazy';
                titleWrap.appendChild(icon);
            }
            titleWrap.appendChild(help);

            // + 버튼 (수동 추가) - 가장 오른쪽에 배치
            if (window.ManualEditor && window.ManualEditor.createAddButton) {
                const addBtn = window.ManualEditor.createAddButton(key, (grade) => {
                    window.ManualEditor.openAddModal(key, grade, (record, panelKey) => {
                        if (window.RecordManager && window.RecordManager.addRecord) {
                            const success = window.RecordManager.addRecord(record, panelKey);
                            if (success) {
                                window.RecordManager.triggerRerender();
                                setStatus(`${t.recordAdded} ${nowStamp()}`);
                            }
                        }
                    });
                });
                titleWrap.appendChild(addBtn);
            }

            card.appendChild(titleWrap);
            // bind cursor-follow tooltip
            ensureTooltipLib().then(() => { try { if (window.bindTooltipElement) window.bindTooltipElement(help); } catch (_) { } });

            // 상단 총계: 총 뽑기 / 진행 중 (진행중은 작고 연해)
            const totalPair = (adjustedTotal != null) ? `${numberFmt(adjustedTotal)} / ` : '-';
            const rowTop = makeStatRow(textFor('totalInProgress'), totalPair);
            if (adjustedTotal != null) {
                const ip = document.createElement('span'); ip.className = 'inprogress'; ip.textContent = numberFmt(adjustedProgress);
                rowTop.lastChild.appendChild(ip);

                // 수정 아이콘 추가
                if (window.ManualEditor && window.ManualEditor.createEditIcon) {
                    const editIcon = window.ManualEditor.createEditIcon(() => {
                        window.ManualEditor.openAdjustModal(key, total, inProgress, (additionalPulls, progressAdjust) => {
                            if (window.RecordManager && window.RecordManager.setAdjustment) {
                                window.RecordManager.setAdjustment(key, additionalPulls, progressAdjust);
                                window.RecordManager.triggerRerender();
                                setStatus(`${t.adjustmentSaved} ${nowStamp()}`);
                            }
                        });
                    });
                    rowTop.lastChild.appendChild(editIcon);
                }
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

            //  ㄴ 50:50 (Fortune/Weapon) - 평균도 표시 (Weapon_Confirmed는 제외)
            if (label === 'fortune' || label === 'weapon') {
                const fiftyRow = makeTableRow([
                    '  └ 50% ' + textFor('win'),
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
            renderNamePills(actualBlock, pills, label, hide4, key);
            card.appendChild(pills);

            // 아코디언: 5★ 상세 기록 (이미지/이름/시간/천장)
            try {
                const accordion = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = textFor('fiveStarHistory');
                accordion.appendChild(summary);
                const listWrap = document.createElement('div');
                listWrap.className = 'five-list';

                // RecordManager에서 pity 포함 5★ 기록 가져오기
                let fiveRecords;
                if (window.RecordManager && window.RecordManager.collectFiveStarWithPity) {
                    fiveRecords = window.RecordManager.collectFiveStarWithPity(key).sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
                } else {
                    fiveRecords = collectFiveStarRecords(actualBlock).sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
                }

                for (const rec of fiveRecords) {
                    const row = document.createElement('div');
                    row.className = 'five-row five-row-clickable';
                    row.style.cursor = 'pointer';
                    const left = document.createElement('div');
                    left.className = 'five-left';
                    const avatar = (label === 'weapon' || label === 'weapon_confirmed') ? weaponThumbFor(rec.name) : characterThumbFor(rec.name);
                    if (avatar) left.appendChild(avatar);
                    const nameEl = document.createElement('span');
                    nameEl.textContent = resolveDisplayName(rec.name, label);
                    // 운명/무기: 승(lose list에 없는 id)을 노란색으로 강조
                    try {
                        if (label === 'fortune' || label === 'weapon') {
                            const loseSet = (typeof window !== 'undefined' && Array.isArray(window.LOSE_5050_LIST)) ? new Set(window.LOSE_5050_LIST.map((v) => Number(v))) : null;
                            const idNum = Number(rec.id);
                            if (loseSet && Number.isFinite(idNum) && !loseSet.has(idNum)) {
                                nameEl.style.color = '#ffc17c';
                            }
                        }
                    } catch (_) { }
                    left.appendChild(nameEl);

                    // 수동 태그 표시 (수동 입력된 기록만)
                    const isManual = window.RecordManager && window.RecordManager.isManualRecord && window.RecordManager.isManualRecord(rec);
                    if (isManual) {
                        const tag = document.createElement('span');
                        tag.className = 'five-manual-tag';
                        tag.textContent = t.manualTag;
                        tag.style.cssText = 'font-size:10px; padding:2px 6px; background:rgba(100,200,100,0.2); color:#8f8; border-radius:4px; margin-left:6px;';
                        left.appendChild(tag);
                    }

                    const right = document.createElement('div');
                    right.className = 'five-right';
                    const timeEl = document.createElement('span');
                    timeEl.textContent = tsToLocal(rec.timestamp);
                    const pityEl = document.createElement('span');
                    // manualPity 또는 계산된 pity 사용
                    const displayPity = rec._displayPity || rec.pity || rec.manualPity || '-';
                    pityEl.textContent = `${displayPity} ${textFor('timesSuffix')}`;
                    right.appendChild(timeEl);
                    right.appendChild(pityEl);
                    row.appendChild(left);
                    row.appendChild(right);

                    // 클릭 이벤트: 수정 모달 열기
                    row.addEventListener('click', () => {
                        if (window.ManualEditor && window.ManualEditor.openEditModal) {
                            window.ManualEditor.openEditModal(rec, key,
                                // onSave
                                (updated, pk) => {
                                    if (window.RecordManager && window.RecordManager.updateRecord(updated, pk)) {
                                        window.RecordManager.triggerRerender();
                                        setStatus(`${t.recordUpdated} ${nowStamp()}`);
                                    }
                                },
                                // onDelete
                                (deleted, pk) => {
                                    if (window.RecordManager && window.RecordManager.deleteRecord(deleted, pk)) {
                                        window.RecordManager.triggerRerender();
                                        setStatus(`${t.recordDeleted} ${nowStamp()}`);
                                    }
                                }
                            );
                        }
                    });

                    listWrap.appendChild(row);
                }
                accordion.appendChild(listWrap);
                card.appendChild(accordion);
            } catch (_) { }

            els.cards.appendChild(card);
        }
    }
    try { window.renderCardsFromExample = renderCardsFromExample; } catch (_) { }

    function getNumber(obj, path) {
        try {
            let cur = obj;
            for (const k of path) cur = cur[k];
            const n = Number(cur);
            return Number.isFinite(n) ? n : null;
        } catch (_) { return null; }
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
        return t.bannerName(key, key);
    }

    function textFor(key) {
        return t.table(key, key);
    }

    function numberFmt(n, frac = 0) {
        try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: frac, minimumFractionDigits: frac }).format(n); }
        catch (_) { return String(n); }
    }

    function nowStamp() {
        try {
            const d = new Date();
            const yy = String(d.getFullYear()).slice(-2);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            let h = d.getHours();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12; if (h === 0) h = 12;
            const hh = String(h).padStart(2, '0');
            const mi = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss} ${ampm}`;
        } catch (_) { return ''; }
    }

    function tsToLocal(ts) {
        try {
            const d = new Date(Number(ts));
            if (isNaN(d)) return '';
            const pad = n => String(n).padStart(2, '0');
            const yy = String(d.getFullYear()).slice(-2);
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const mi = pad(d.getMinutes());
            return `${yy}-${mm}-${dd} ${hh}:${mi}`;
        } catch (_) { }
        return '';
    }

    function tooltipFor(label) {
        const key = label === 'confirmed' ? 'tooltip_confirmed'
            : label === 'fortune' ? 'tooltip_fortune'
                : label === 'gold' ? 'tooltip_gold'
                    : label === 'weapon' ? 'tooltip_weapon'
                        : label === 'weapon_confirmed' ? 'tooltip_weapon_confirmed'
                            : label === 'newcomer' ? 'tooltip_newcomer'
                                : null;
        return key ? textFor(key) : '';
    }

    // 병합 / 덮어쓰기 선택용 간단 다이얼로그
    async function chooseMergeMode(source) {
        try {
            return await new Promise((resolve) => {
                const title = t.mergeTitle(source);
                const msg = t.mergeMessage;
                const backdrop = document.createElement('div');
                backdrop.style.position = 'fixed';
                backdrop.style.inset = '0';
                backdrop.style.background = 'rgba(0,0,0,0.45)';
                backdrop.style.zIndex = '9999';
                backdrop.style.display = 'flex';
                backdrop.style.alignItems = 'center';
                backdrop.style.justifyContent = 'center';

                const box = document.createElement('div');
                box.style.background = 'rgba(25,25,25,0.98)';
                box.style.border = '1px solid rgba(255,255,255,0.1)';
                box.style.borderRadius = '8px';
                box.style.padding = '16px 18px 14px';
                box.style.maxWidth = '360px';
                box.style.width = '100%';
                box.style.boxShadow = '0 18px 40px rgba(0,0,0,0.6)';
                box.style.color = '#fff';
                box.style.fontSize = '13px';
                box.style.lineHeight = '1.5';

                const h = document.createElement('div');
                h.textContent = title;
                h.style.fontWeight = '600';
                h.style.marginBottom = '8px';

                const p = document.createElement('div');
                p.textContent = msg;
                p.style.whiteSpace = 'pre-line';
                p.style.marginBottom = '12px';

                const btnRow = document.createElement('div');
                btnRow.style.display = 'flex';
                btnRow.style.justifyContent = 'flex-end';
                btnRow.style.gap = '8px';

                function close(val) {
                    try { document.body.removeChild(backdrop); } catch (_) { }
                    resolve(val);
                }

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = t.mergeCancel;
                cancelBtn.className = 'url-btn secondary';
                cancelBtn.onclick = () => close(null);

                const mergeBtn = document.createElement('button');
                mergeBtn.textContent = t.mergeMerge;
                mergeBtn.className = 'url-btn secondary';
                mergeBtn.onclick = () => close('merge');

                const overwriteBtn = document.createElement('button');
                overwriteBtn.textContent = t.mergeOverwrite;
                overwriteBtn.className = 'url-btn primary';
                overwriteBtn.onclick = () => close('overwrite');

                btnRow.appendChild(cancelBtn);
                btnRow.appendChild(mergeBtn);
                btnRow.appendChild(overwriteBtn);

                box.appendChild(h);
                box.appendChild(p);
                box.appendChild(btnRow);
                backdrop.appendChild(box);
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) close(null);
                });
                document.body.appendChild(backdrop);
            });
        } catch (_) {
            return null;
        }
    }

    function pityRuleAvgFor(label) {
        // 규칙: Confirmed(확정)=110, Fortune(운명)=80, Gold(골드)=80, Weapon(무기)=70, Weapon_Confirmed(무기확정)=95, Newcomer(뉴커머)=50
        // 4★은 전 타입 10
        const five = (label === 'confirmed') ? 110
            : (label === 'fortune') ? 80
                : (label === 'gold') ? 80
                    : (label === 'weapon') ? 70
                        : (label === 'weapon_confirmed') ? 95
                            : (label === 'newcomer') ? 50
                                : null;
        const four = 10;
        if (five == null) return '-';
        return `5★ ${five}, 4★ ${four}`;
    }

    function renderNamePills(block, container, label, hide4, panelKey) {
        try {
            const list = [];
            const records = (block.records || []).flatMap(r => Array.isArray(r.record) ? r.record : []);
            // 5★ → 4★ → 3★ 순서로 name별 개수 집계
            const byGrade = { 5: new Map(), 4: new Map(), 3: new Map(), 2: new Map() };
            const loseSet = (typeof window !== 'undefined' && Array.isArray(window.LOSE_5050_LIST)) ? new Set(window.LOSE_5050_LIST.map((v) => Number(v))) : null;
            for (const it of records) {
                const g = Number(it.grade);
                const name = it.name;
                if (!name) continue;
                const bucket = byGrade[g] || byGrade[3];
                bucket.set(name, (bucket.get(name) || 0) + 1);
            }
            if (DEBUG) console.log('[pull-tracker] grade buckets', Object.fromEntries(Object.entries(byGrade).map(([k, m]) => [k, m.size])));
            // 3★ 이하 묶기: 3★/2★ 총합 표시
            const gradesForList = [5, 4];
            for (const g of gradesForList) {
                if (g === 4 && hide4) continue;
                const m = byGrade[g];
                if (!m || m.size === 0) continue;
                const arr = Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
                for (const [name, cnt] of arr) {
                    const pill = document.createElement('span');
                    pill.className = 'pill pill-clickable';
                    if (g === 5) pill.classList.add('grade-5');
                    else if (g === 4) pill.classList.add('grade-4');
                    // 이미지: 무기 카드는 무기 이미지, 그 외는 캐릭터 이미지
                    const img = (label === 'weapon' || label === 'weapon_confirmed') ? weaponThumbFor(name) : characterThumbFor(name);
                    if (img) {
                        pill.style.display = 'inline-flex';
                        pill.style.alignItems = 'center';
                        pill.style.gap = '6px';
                        pill.appendChild(img);
                    }
                    const text = document.createElement('span');
                    const disp = resolveDisplayName(name, label);
                    text.textContent = `${disp} ${cnt}`;
                    // 운명/무기: LOSE_5050_LIST 기준 승(win: not in list) 노란색 표시
                    if ((label === 'fortune' || label === 'weapon') && g === 5 && loseSet) {
                        try {
                            // 가능한 id/charId는 five history쪽에서만 안정적이므로 pills는 이름만 강조
                            // 이름만으로 id 매칭은 불가 → pills에서는 전체 5성을 승 강조하지 않고, history에서 정확히 처리
                        } catch (_) { }
                    }
                    pill.appendChild(text);

                    // 클릭 이벤트: 해당 캐릭터/무기의 히스토리 패널 열기
                    pill.style.cursor = 'pointer';
                    pill.addEventListener('click', () => {
                        if (window.RecordManager && window.ManualEditor) {
                            const historyRecords = window.RecordManager.collectRecordsByName(name, panelKey);
                            window.ManualEditor.openHistoryPanel(disp, historyRecords, panelKey, (rec) => {
                                // 개별 레코드 수정 모달 열기
                                window.ManualEditor.openEditModal(rec, panelKey,
                                    // onSave
                                    (updated, pk) => {
                                        if (window.RecordManager.updateRecord(updated, pk)) {
                                            window.RecordManager.triggerRerender();
                                            setStatus(`${t.recordUpdated} ${nowStamp()}`);
                                        }
                                    },
                                    // onDelete
                                    (deleted, pk) => {
                                        if (window.RecordManager.deleteRecord(deleted, pk)) {
                                            window.RecordManager.triggerRerender();
                                            setStatus(`${t.recordDeleted} ${nowStamp()}`);
                                        }
                                    }
                                );
                            });
                        }
                    });

                    container.appendChild(pill);
                }
            }
            // 3★ 이하 totals
            const total3 = sumMap(byGrade[3]);
            const total2 = sumMap(byGrade[2]);
            if (total3 > 0 && !hide4) addPill(container, `3★ ${total3}`);
            if (total2 > 0 && !hide4) addPill(container, `2★ ${total2}`);
        } catch (_) { }
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
                // 정렬 강제: timestamp asc → tsOrder/ts_order asc → gachaId asc
                const recs = (Array.isArray(seg.record) ? seg.record.slice() : []).sort((a, b) => {
                    const ta = Number(a?.timestamp ?? a?.time ?? a?.ts ?? 0) || 0;
                    const tb = Number(b?.timestamp ?? b?.time ?? b?.ts ?? 0) || 0;
                    if (ta !== tb) return ta - tb;
                    const oa = (a && a.tsOrder != null) ? Number(a.tsOrder) : ((a && a.ts_order != null) ? Number(a.ts_order) : Infinity);
                    const ob = (b && b.tsOrder != null) ? Number(b.tsOrder) : ((b && b.ts_order != null) ? Number(b.ts_order) : Infinity);
                    if (oa !== ob) return oa - ob;
                    const ga = String(a && a.gachaId != null ? a.gachaId : '');
                    const gb = String(b && b.gachaId != null ? b.gachaId : '');
                    return ga < gb ? -1 : ga > gb ? 1 : 0;
                });
                let pity = 0;
                for (let i = 0; i < recs.length; i++) {
                    const r = recs[i];
                    pity++;
                    if (r && Number(r.grade) === 5) {
                        // translate display name using current lang
                        let disp = r.name;
                        const cls = resolveCharacterClass(r.name);
                        if (cls) {
                            const info = (getCharData() || {})[cls];
                            const alt = charNameByLang(info);
                            if (alt) disp = alt;
                        }
                        rows.push({ name: disp, timestamp: r.timestamp, pity, id: (r && (r.id != null || r.charId != null) ? Number(r.id != null ? r.id : r.charId) : undefined) });
                        pity = 0;
                    }
                }
            }
            return rows;
        } catch (_) { return []; }
    }

    // 이름에서 캐릭터 클래스 키 추정 후 이미지 노출 (무기 카드는 제외)
    function characterThumbFor(displayName) {
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
                    for (const nm of cands) {
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
            img.onerror = function () {
                if (!triedFallback) {
                    triedFallback = true;
                    this.src = fallback;
                } else {
                    this.style.display = 'none';
                    // if (DEBUG) console.log('[pull-tracker] image not found for', found);
                }
            };
            return img;
        } catch (_) { return null; }
    }

    // 캐릭터 매칭 후보 이름들(다국어/코드네임 포함)
    function candidateNames(info) {
        if (!info) return [];
        const base = [info.name, info.name_en, info.name_jp, info.name_cn, info.codename]
            .map(v => (v == null ? '' : String(v).trim()))
            .filter(Boolean);
        if (lang === 'jp') {
            const extra = [];
            for (const s of base) {
                try {
                    const noSpace = String(s).replace(/[\s\u3000]+/g, '');
                    if (noSpace && noSpace !== s) extra.push(noSpace);
                } catch (_) { }
            }
            return Array.from(new Set(base.concat(extra)));
        }
        return Array.from(new Set(base));
    }

    function charNameByLang(info) {
        if (!info) return '';
        if (lang === 'en') return String(info.codename || info.name_en || info.name || '').trim();
        if (lang === 'jp') return String(info.name_jp || info.name || '').trim();
        if (lang === 'cn') return String(info.name_cn || info.name || '').trim();
        return String(info.name || '').trim();
    }

    function resolveCharacterClass(displayName) {
        try {
            const globalChar = getCharData(); if (!globalChar) return null;
            let wanted = String(applyNameFixups(displayName)).trim();
            // 일본어: 공백 제거 버전도 함께 고려
            const wantedNorm = (lang === 'jp') ? wanted.replace(/[\s\u3000]+/g, '') : wanted;
            const baseOf = (s) => String(s).split('·')[0].trim();
            const hasVar = (s) => String(s).includes('·');
            const wantedBase = baseOf(wanted);
            const wantedHasVar = hasVar(wanted);
            for (const [cls, info] of Object.entries(globalChar)) {
                const cands = candidateNames(info);
                if (cands.some(nm => nm === wanted || (lang === 'jp' && nm.replace(/[\s\u3000]+/g, '') === wantedNorm))) return cls;
            }
            const candidates = [];
            for (const [cls, info] of Object.entries(globalChar)) {
                const cands = candidateNames(info);
                for (const nm of cands) {
                    if (!nm) continue;
                    const nmBase = baseOf(nm);
                    if (nmBase === wantedBase) { candidates.push({ cls, nm, hasVar: hasVar(nm) }); break; }
                }
            }
            if (candidates.length === 0) return null;
            if (wantedHasVar) { const exact = candidates.find(c => c.nm === wanted); return exact ? exact.cls : candidates[0].cls; }
            const plain = candidates.find(c => !c.hasVar); return plain ? plain.cls : candidates[0].cls;
        } catch (_) { return null; }
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
            img.onerror = function () { this.style.display = 'none'; };
            return img;
        } catch (_) { return null; }
    }

    function resolveWeaponMeta(name) {
        try {
            const datasets = [];
            const kr = getWeaponData(); if (kr) datasets.push(kr);
            if (window.enCharacterWeaponData) datasets.push(window.enCharacterWeaponData);
            if (window.jpCharacterWeaponData) datasets.push(window.jpCharacterWeaponData);
            if (window.cnCharacterWeaponData) datasets.push(window.cnCharacterWeaponData);
            const needle = String(name || '').trim(); if (!needle) return null;
            for (const db of datasets) {
                for (const [charKey, obj] of Object.entries(db)) {
                    for (const [k, v] of Object.entries(obj)) {
                        if (!k.startsWith('weapon')) continue;
                        const vname = v && typeof v.name === 'string' ? v.name.trim() : '';
                        if (vname && vname === needle) return { ownerKey: charKey, weaponKey: k };
                    }
                }
            }
            return null;
        } catch (_) { return null; }
    }

    function weaponNameByLang(ownerKey, weaponKey) {
        try {
            const db = (lang === 'en') ? (window.enCharacterWeaponData || getWeaponData())
                : (lang === 'jp') ? (window.jpCharacterWeaponData || getWeaponData())
                    : (lang === 'cn') ? (window.cnCharacterWeaponData || getWeaponData())
                    : getWeaponData();
            const entry = db && db[ownerKey] && db[ownerKey][weaponKey];
            const n = entry && entry.name ? String(entry.name).trim() : '';
            return n || null;
        } catch (_) { return null; }
    }

    // 표시에 사용할 이름을 언어별로 결정 (이미지 매칭은 항상 한국어 클래스 키 기반 유지)
    // 특정 예외 매핑 사전
    const NAME_FIXUPS = {
        'Yui': 'YUI',
        "ＹＵＩ": 'YUI',
        'Kotone Montagne': 'Montagne Kotone'
    };

    function applyNameFixups(raw) {
        try { const k = String(raw || '').trim(); return NAME_FIXUPS[k] || k; } catch (_) { return raw; }
    }

    function resolveDisplayName(name, label) {
        try {
            const fixed = applyNameFixups(name);
            if (label === 'weapon' || label === 'weapon_confirmed') {
                const meta = resolveWeaponMeta(fixed);
                const alt = meta ? weaponNameByLang(meta.ownerKey, meta.weaponKey) : null;
                return alt || name;
            }
            const cls = resolveCharacterClass(fixed);
            if (!cls) return name;
            const info = (getCharData() || {})[cls];
            const alt = charNameByLang(info);
            return alt || name;
        } catch (_) { return name; }
    }

    // Supabase rows → merged payload 형태로 변환
    function shapeCloudRows(rows) {
        const keys = ['Confirmed', 'Fortune', 'Weapon', 'Weapon_Confirmed', 'Gold', 'Newcomer'];
        const data = {}; for (const k of keys) data[k] = { summary: { pulledSum: 0, total5Star: 0, total4Star: 0, win5050: 0, avgPity: null }, records: [] };
        const byType = new Map();
        for (const r of rows) {
            const t = r.gacha_type; if (!data[t]) continue;
            if (!byType.has(t)) byType.set(t, []);
            byType.get(t).push({ name: r.name, grade: Number(r.grade || 0), timestamp: Number(r.timestamp || 0), gachaId: (r.gacha_id != null ? String(r.gacha_id) : null), tsOrder: (r.ts_order != null ? Number(r.ts_order) : null) });
        }
        for (const [t, arr] of byType.entries()) {
            arr.sort((a, b) => {
                const dt = a.timestamp - b.timestamp; if (dt) return dt;
                const au = (a.tsOrder == null); const bu = (b.tsOrder == null);
                if (au !== bu) return au ? -1 : 1;
                if (!au && !bu) { const doo = a.tsOrder - b.tsOrder; if (doo) return doo; }
                return 0;
            });
            // 간단히 한 그룹으로 묶어 segment 구성
            const seg = { fivestar: null, lastTimestamp: (arr[arr.length - 1]?.timestamp || 0), record: arr };
            const i5 = arr.findIndex(v => Number(v.grade) === 5); if (i5 >= 0) seg.fivestar = { name: arr[i5].name, timestamp: arr[i5].timestamp };
            data[t].records = [seg];
            const s = { pulledSum: arr.length, total5Star: arr.filter(v => v.grade === 5).length, total4Star: arr.filter(v => v.grade === 4).length, win5050: 0, avgPity: null };
            data[t].summary = s;
        }
        return { version: 1, updatedAt: Date.now(), data };
    }

    // Auto render from bundled example when available (dev view)
    try {
        /*
        const exampleAttr = els.cards ? els.cards.getAttribute('data-example') : null;
        const exampleUrl = exampleAttr || `${location.pathname}example.json`;
        */
        const exampleAttr = null;
        const exampleUrl = exampleAttr;

        // 캐릭터 메타 → 무기 데이터 순으로 로드 후, 로컬 캐시/마지막 응답만 사용
        (async () => {
            await loadCharacters();
            await loadWeapons();
            try {
                const mergedCached = localStorage.getItem('pull-tracker:merged');
                if (mergedCached) {
                    const json = ensureTsOrderInPayload(JSON.parse(mergedCached));
                    try { console.log('[pull-tracker][merged-local]', json); } catch (_) { }
                    __dataSource = 'local';
                    setStatus(`${t.loadedLocal} ${nowStamp()}`);
                    renderCardsFromExample(json); setMergedDebug(json); setHide4Visible(true); return;
                }
                const cached = localStorage.getItem('pull-tracker:last-response');
                if (cached) {
                    const json = parseIncoming(cached);
                    try { console.log('[pull-tracker][incoming-local]', json); } catch (_) { }
                    const m = ensureTsOrderInPayload(mergeWithCache(json));
                    try { console.log('[pull-tracker][merged-from-last]', m); } catch (_) { }
                    renderCardsFromExample(m); setMergedDebug(m); setHide4Visible(true); return;
                }
                setStatus(t.noData);
                setHide4Visible(false);
            } catch (_) { }
        })();
    } catch (_) { }
})();



