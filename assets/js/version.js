const APP_VERSION = '4.4.8';  // 현재 앱 버전

class VersionChecker {
    static check() {
        // 로컬 스토리지에서 마지막으로 확인한 버전 가져오기
        const lastVersion = localStorage.getItem('appVersion');
        //console.log('Current stored version:', lastVersion);
        //console.log('Current app version:', APP_VERSION);
        if (lastVersion === null) {
            // 최초 실행시
            localStorage.setItem('appVersion', APP_VERSION);
        } else if (lastVersion !== APP_VERSION) {
            // 버전이 다를 경우 업데이트 알림
            this.showUpdateNotification(lastVersion, APP_VERSION);
            localStorage.setItem('appVersion', APP_VERSION);
        }
    }


    static async clearCache() {
        try {
            // Service Worker에 버전 업데이트 메시지 전송 (캐시 삭제 요청)
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                try {
                    // Service Worker에 버전 업데이트 알림
                    navigator.serviceWorker.controller.postMessage({
                        type: 'VERSION_UPDATE',
                        version: APP_VERSION
                    });
                    console.log('[VersionChecker] Service Worker에 버전 업데이트 알림:', APP_VERSION);
                } catch (e) {
                    console.warn('[VersionChecker] Service Worker 메시지 전송 실패:', e);
                }
            }

            // 모든 캐시 삭제 (Service Worker 캐시 포함)
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
            //console.log('Cache cleared successfully');

            // CSS와 JS 파일 강제 새로고침 (APP_VERSION 사용)
            const resources = document.querySelectorAll('link[rel="stylesheet"], script[src]');
            resources.forEach(resource => {
                const url = new URL(resource.href || resource.src);
                // 기존 v 파라미터 제거
                url.searchParams.delete('v');
                // 새로운 버전 추가
                url.searchParams.set('v', APP_VERSION);

                if (resource.tagName === 'LINK') {
                    resource.href = url.toString();
                } else if (resource.src && !resource.src.includes('googlesyndication') && !resource.src.includes('googletagmanager')) {
                    // 광고 및 분석 스크립트 제외하고 새로고침
                    const newScript = document.createElement('script');
                    newScript.src = url.toString();
                    resource.parentNode.replaceChild(newScript, resource);
                }
            });

            // Service Worker는 해제하지 않음 (PWA 기능 유지)
            // 대신 업데이트만 요청
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                // 각 Service Worker 업데이트 요청
                await Promise.all(
                    registrations.map(registration => registration.update())
                );
                //console.log('Service workers updated');
            }

            // 브라우저 캐시 강제 무효화
            await fetch(window.location.href, {
                cache: 'reload',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        } catch (error) {
            console.error('Cache clearing failed:', error);
        }
    }

    // v 접두사 제거 후 버전 배열로 변환
    static normalizeVersion(v) {
        try {
            return String(v || '0').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
        } catch (_) {
            return [0, 0, 0];
        }
    }

    // a<b:-1, a==b:0, a>b:1
    static compareVersions(a, b) {
        const aa = this.normalizeVersion(a);
        const bb = this.normalizeVersion(b);
        for (let i = 0; i < Math.max(aa.length, bb.length); i++) {
            const x = aa[i] || 0;
            const y = bb[i] || 0;
            if (x < y) return -1;
            if (x > y) return 1;
        }
        return 0;
    }

    static async loadUpdatesCSV() {
        const base = (typeof BASE_URL !== 'undefined') ? BASE_URL : '';
        const url = `${base}/data/kr/updates.csv?v=${APP_VERSION}`;
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const lines = text.split(/\r?\n/).filter(l => l.trim().length);
            if (!lines.length) return [];
            const body = lines.slice(1);
            const records = body.map(line => {
                // CSV 안전 분리: 앞의 2개 컬럼 고정 후 나머지는 content로 결합
                const parts = line.split(',');
                const date = parts[0] || '';
                const version = (parts[1] || '').trim();
                const content = parts.slice(2).join(',').trim();
                const contentPatched = content.replace(/\|/g, ', ');
                return { date, version, content: contentPatched };
            });
            return records;
        } catch (err) {
            console.warn('[VersionChecker] updates.csv load failed:', err);
            return [];
        }
    }

    static filterUpdatesBetween(updates, fromVer, toVer) {
        const out = [];
        for (const u of updates) {
            const v = u.version || '';
            // CSV는 v 접두사가 포함될 수 있음 (예: v2.9.7)
            const cmpFrom = this.compareVersions(fromVer, v);
            const cmpTo = this.compareVersions(v, toVer);
            if (cmpFrom < 0 && cmpTo <= 0) {
                out.push(u);
            }
        }
        // 최신순 정렬 (버전 내림차순)
        out.sort((a, b) => this.compareVersions(b.version, a.version));
        return out;
    }

    static async showUpdateNotification(oldVersion, newVersion) {
        // 현재 언어 확인
        const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';

        // 언어별 텍스트 정의
        const i18nTexts = {
            kr: {
                title: "✨ 업데이트 안내",
                message: `새로운 버전이 적용되었습니다. (v${oldVersion} → v${newVersion})`,
                changes: "변경 사항",
                reload: "새로고침",
                close: "닫기"
            },
            en: {
                title: "✨ Update Notice",
                message: `A new version has been applied. (v${oldVersion} → v${newVersion})`,
                changes: "Changes",
                reload: "Refresh",
                close: "Close"
            },
            jp: {
                title: "✨ アップデート案内",
                message: `新しいバージョンが適用されました。(v${oldVersion} → v${newVersion})`,
                changes: "変更点",
                reload: "更新",
                close: "閉じる"
            }
        };

        // 현재 언어에 맞는 텍스트 선택 (없으면 한국어)
        const texts = i18nTexts[currentLang] || i18nTexts['kr'];

        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <h3>${texts.title}</h3>
                <p>${texts.message}</p>
                <div id="update-changes" class="update-changes" style="max-height:300px; overflow:auto; margin-top:8px;"></div>
                <div class="update-content-buttons">
                    <button id="update-reload-btn">${texts.reload}</button>
                    <button id="update-close-btn">${texts.close}</button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // 업데이트 내역 렌더링
        (async () => {
            try {
                const all = await this.loadUpdatesCSV();
                const between = this.filterUpdatesBetween(all, oldVersion, newVersion);
                const wrap = notification.querySelector('#update-changes');
                if (wrap && between.length) {
                    const frag = document.createDocumentFragment();
                    const title = document.createElement('div');
                    title.style.fontWeight = '600';
                    title.style.margin = '6px 0';
                    title.textContent = texts.changes;
                    frag.appendChild(title);

                    between.forEach(u => {
                        const el = document.createElement('div');
                        el.className = 'update-item';
                        const safeContent = (u.content || '').split('\\n').join('<br>');
                        el.innerHTML = `
                            <div class="update-item-head" style="font-weight:600; margin-top:6px;">${u.version} <span style="opacity:.7; font-weight:400;">${u.date}</span></div>
                            <div class="update-item-body" style="margin:2px 0 6px 0; line-height:1.4;">${safeContent}</div>
                        `;
                        frag.appendChild(el);
                    });
                    wrap.appendChild(frag);
                }
            } catch (_) { /* noop */ }
        })();

        // 새로고침 버튼 클릭 시
        document.getElementById('update-reload-btn').addEventListener('click', async () => {
            await this.clearCache();
            window.location.reload(true);
        });

        // 닫기 버튼 클릭 시
        document.getElementById('update-close-btn').addEventListener('click', () => {
            notification.remove();
        });
    }
} 
