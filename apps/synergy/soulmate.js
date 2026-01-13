// Soulmate/Friend Choice Indicator for RANK 14→15
(function() {
    'use strict';

    // RANK 14→15 선택지 하단에 소울 메이트/절친 표시 추가
    function addSoulmateIndicator() {
        // 모든 soulmate-indicator-placeholder를 찾아서 실제 표시로 교체
        const placeholders = document.querySelectorAll('.soulmate-indicator-placeholder[data-rank="14-15"]');
        
        placeholders.forEach(placeholder => {
            // 이미 교체되었는지 확인
            if (placeholder.classList.contains('replaced')) return;
            
            const soulmateHtml = createSoulmateIndicator();
            placeholder.outerHTML = soulmateHtml;
        });
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
                soulmate: 'Soulmate', 
                friend: 'Friend',
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

