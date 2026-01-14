// Soulmate/Friend Choice Indicator for RANK 14→15
(function() {
    'use strict';

    // RANK 14→15 선택지 하단에 소울 메이트/절친 표시 추가
    async function addSoulmateIndicator() {
        // 모든 soulmate-indicator-placeholder를 찾아서 실제 표시로 교체
        const placeholders = document.querySelectorAll('.soulmate-indicator-placeholder[data-rank="14-15"]');
        
        for (const placeholder of placeholders) {
            // 이미 교체되었는지 확인
            if (placeholder.classList.contains('replaced')) continue;
            
            const characterName = placeholder.getAttribute('data-character');
            if (!characterName) continue;
            
            // friend_lover_dialog 데이터 확인
            const friendLoverDialog = await getFriendLoverDialog(characterName);
            
            let html;
            if (friendLoverDialog && friendLoverDialog.length === 2) {
                // friend_lover_dialog가 있으면 dialog-choice 2개 추가
                html = createDialogChoices(friendLoverDialog);
            } else {
                // 없으면 기존 soulmate-indicator 표시
                html = createSoulmateIndicator();
            }
            
            placeholder.outerHTML = html;
        }
    }
    
    // friend_lover_dialog 데이터 가져오기
    async function getFriendLoverDialog(characterName) {
        try {
            const currentLanguage = getCurrentLanguage();
            const BASE_URL = window.BASE_URL || '';
            const APP_VERSION = window.APP_VERSION || Date.now().toString();
            
            // 현재 언어의 데이터 파일 로드
            const fileName = encodeURIComponent(characterName);
            let response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
            let data = null;
            
            if (response.ok) {
                const jsonData = await response.json();
                // synergy.js와 동일한 파싱 로직: jsonData.data || jsonData
                data = jsonData.data || jsonData;
            }
            
            // friend_lover_dialog 확인
            if (data && data.friend_lover_dialog && Array.isArray(data.friend_lover_dialog) && data.friend_lover_dialog.length === 2) {
                return data.friend_lover_dialog;
            }
            
            // 현재 언어 파일이 없거나 friend_lover_dialog가 없으면 한국어로 폴백
            if (currentLanguage !== 'kr') {
                const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                if (krResponse.ok) {
                    const krJsonData = await krResponse.json();
                    const krData = krJsonData.data || krJsonData;
                    if (krData && krData.friend_lover_dialog && Array.isArray(krData.friend_lover_dialog) && krData.friend_lover_dialog.length === 2) {
                        return krData.friend_lover_dialog;
                    }
                }
            }
            
            return null;
        } catch (e) {
            console.error('Failed to load friend_lover_dialog:', e);
            return null;
        }
    }
    
    // dialog-choice HTML 생성
    function createDialogChoices(friendLoverDialog) {
        const BASE_URL = window.BASE_URL || '';
        const currentLanguage = getCurrentLanguage();
        
        // 번역 텍스트
        const texts = {
            kr: { 
                soulmate: '소울 메이트', 
                friend: '절친',
                notice: '이번 이벤트에는 위 선택지 외에 중요한 결정을 내리게 됩니다.'
            },
            en: { 
                soulmate: 'Romantic', 
                friend: 'Friendship',
                notice: 'In this event, you will make an important decision in addition to the choices above.'
            },
            jp: { 
                soulmate: '연인', 
                friend: '친구',
                notice: 'このイベントでは、上記の選択肢に加えて重要な決定を下すことになります。'
            }
        };
        
        const text = texts[currentLanguage] || texts.kr;
        
        // is_romance: false가 먼저, true가 나중에 오도록 정렬
        const sortedDialog = [...friendLoverDialog].sort((a, b) => {
            if (a.is_romance === false && b.is_romance === true) return -1;
            if (a.is_romance === true && b.is_romance === false) return 1;
            return 0;
        });
        
        let html = `<div class="soulmate-notice">${text.notice}</div>`;
        html += '<div class="dialog-choices">';
        
        sortedDialog.forEach((dialog, index) => {
            const isRomance = dialog.is_romance === true;
            const label = isRomance ? text.soulmate : text.friend;
            const choiceNumber = index + 1;
            // 아이콘: 소울 메이트는 GF, 절친은 BF
            const iconPath = isRomance 
                ? `${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-GF.png`
                : `${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-BF.png`;
            // gradient 클래스: 소울 메이트는 left, 절친은 right
            const gradientClass = isRomance ? 'soulmate-dialog-left' : 'soulmate-dialog-right';
            
            html += `
                <div class="dialog-choice ${gradientClass}">
                    <div class="dialog-choice-number">${choiceNumber}.</div>
                    <div class="dialog-choice-content">${dialog.content.replace(/\n/g, '<br>')}</div>
                    <div class="dialog-choice-reward soulmate-reward">
                        <img src="${iconPath}" alt="${label}" class="soulmate-icon" onerror="this.onerror=null; this.style.display='none';">
                        <span>${label}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // 소울 메이트/절친 표시 HTML 생성
    function createSoulmateIndicator() {
        const BASE_URL = window.BASE_URL || '';
        const currentLanguage = getCurrentLanguage();
        
        // 번역 텍스트
        const texts = {
            kr: { 
                soulmate: '소울 메이트', 
                friend: '절친',
                notice: '이번 이벤트에는 위 선택지 외에 중요한 결정을 내리게 됩니다.'
            },
            en: { 
                soulmate: 'Romantic', 
                friend: 'Friendship',
                notice: 'In this event, you will make an important decision in addition to the choices above.'
            },
            jp: { 
                soulmate: '연인', 
                friend: '친구',
                notice: 'このイベントでは、上記の選択肢に加えて重要な決定を下すことになります。'
            }
        };
        
        const text = texts[currentLanguage] || texts.kr;
        
        return `
            <div class="soulmate-notice">${text.notice}</div>
            <div class="soulmate-indicator">
                <div class="soulmate-block soulmate-block-left">
                    <img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-GF.png" alt="${text.soulmate}" class="soulmate-icon" onerror="this.onerror=null; this.style.display='none';">
                    <span class="soulmate-text">${text.soulmate}</span>
                </div>
                <div class="soulmate-block soulmate-block-right">
                    <img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-BF.png" alt="${text.friend}" class="soulmate-icon" onerror="this.onerror=null; this.style.display='none';">
                    <span class="soulmate-text">${text.friend}</span>
                </div>
            </div>
        `;
    }

    // 현재 언어 감지
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
        }
        try {
            const htmlLang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
            if (htmlLang) {
                if (htmlLang.startsWith('ko') || htmlLang.startsWith('kr')) return 'kr';
                if (htmlLang.startsWith('en')) return 'en';
                if (htmlLang.startsWith('ja') || htmlLang.startsWith('jp')) return 'jp';
            }
        } catch (e) {}
        return 'kr';
    }

    // 캐릭터 상세 정보가 렌더링된 후 실행
    function initSoulmateIndicator() {
        // MutationObserver를 사용하여 DOM 변경 감지
        const observer = new MutationObserver(() => {
            addSoulmateIndicator();
        });

        const characterDetail = document.querySelector('.character-detail');
        if (characterDetail) {
            observer.observe(characterDetail, {
                childList: true,
                subtree: true
            });
            
            // 초기 실행
            setTimeout(() => {
                addSoulmateIndicator();
            }, 100);
        }
    }

    // 페이지 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSoulmateIndicator);
    } else {
        initSoulmateIndicator();
    }

    // 전역 함수로도 노출 (synergy.js에서 호출 가능하도록)
    window.addSoulmateIndicator = addSoulmateIndicator;
})();

