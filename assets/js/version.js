const APP_VERSION = '2.5.1';  // 현재 앱 버전

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
            // 모든 캐시 삭제
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
            
            // 서비스 워커 해제
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations.map(registration => registration.unregister())
                );
                //console.log('Service workers unregistered');
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

    static showUpdateNotification(oldVersion, newVersion) {
        // 현재 언어 확인
        const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
        
        // 언어별 텍스트 정의
        const i18nTexts = {
            kr: {
                title: "✨ 업데이트 안내",
                message: `새로운 버전이 적용되었습니다. (v${oldVersion} → v${newVersion})`,
                reload: "새로고침",
                close: "닫기"
            },
            en: {
                title: "✨ Update Notice",
                message: `A new version has been applied. (v${oldVersion} → v${newVersion})`,
                reload: "Refresh",
                close: "Close"
            },
            jp: {
                title: "✨ アップデート案内",
                message: `新しいバージョンが適用されました。(v${oldVersion} → v${newVersion})`,
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
                <div class="update-content-buttons">
                    <button id="update-reload-btn">${texts.reload}</button>
                    <button id="update-close-btn">${texts.close}</button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

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