(function () {
    'use strict';

    function getLangSafe() {
        try {
            return (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr';
        } catch (_) {
            return 'kr';
        }
    }

    function t(key, fallback) {
        if (typeof window.t === 'function') {
            try {
                return window.t(key, fallback);
            } catch (_) {}
        }
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            const result = window.I18nService.t(key, fallback);
            if (result && result !== key) return result;
        }
        return fallback;
    }

    function showHelpModal(helpType) {
        const modal = document.getElementById('help-modal');
        const modalTitle = document.getElementById('help-modal-title');
        const modalDescription = document.getElementById('help-modal-description');
        const currentLang = getLangSafe();
        const safeLang = ['kr', 'en', 'jp'].includes(currentLang) ? currentLang : 'kr';
        const revelationOptionsLink = `<a href="/${safeLang}/article/Revelation-Options/" target="_blank">lufel.net/${safeLang}/article/Revelation-Options/</a>`;

        const helpConfig = {
            'revelation': {
                titleKey: 'characterDetailRevelation',
                titleFallback: '계시',
                contentKey: 'helpRevelationContent',
                contentFallback: '추천 계시 목록입니다. 파티 구성과 상대 적에 따라 추천이 달라질 수 있으니, 각 계시 효과를 확인해 적절한 계시를 선택하세요.'
            },
            'main-option': {
                titleKey: 'characterDetailMainOption',
                titleFallback: '주 옵션',
                contentKey: 'helpMainOptionContent',
                contentFallback: '계시 위치별 추천 옵션입니다. 의식(Awareness), 무기, 파티 구성에 따라 우선순위가 달라질 수 있습니다.'
            },
            'sub-option': {
                titleKey: 'characterDetailSubOption',
                titleFallback: '부 옵션',
                contentKey: 'helpSubOptionContent',
                contentFallback: '캐릭터별 계시에서 우선하는 부 옵션입니다. 부 옵션 범위는 {link}를 참고하세요. 의식, 무기, 파티 구성에 따라 우선순위가 달라질 수 있습니다.'
            },
            'recommended-stats': {
                titleKey: 'characterDetailRecommendedStats',
                titleFallback: '권장 속성 스탯',
                contentKey: 'helpRecommendedStatsContent',
                contentFallback: '스킬이 스탯 영향을 받는 경우 최대 효율을 위한 권장 수치입니다. 가능하면 충족을 권장합니다. (전투 기준)'
            },
            'battle-entry': {
                titleKey: 'characterDetailBattleEntry',
                titleFallback: '전투 진입 시 +',
                contentKey: 'helpBattleEntryContent',
                contentFallback: '전투 시작 시 적용되는 버프로 권장 스탯 계산에 영향을 주는 요소입니다.'
            },
            'skill': {
                titleKey: 'characterDetailSkills',
                titleFallback: '스킬',
                contentKey: 'helpSkillContent',
                contentFallback: '8은 우선순위가 낮은 스킬, MAX는 가능하면 최대로 올릴 스킬, 별 표시는 핵심 스킬을 의미합니다.'
            },
            'mind-lv5': {
                titleKey: 'characterDetailMindLv5',
                titleFallback: '심상 (LV 5)',
                contentKey: 'helpMindLv5Content',
                contentFallback: '별 표시는 가능하면 먼저 확보할 것을 권장하는 심상 우선순위입니다.'
            },
            'base-stats': {
                titleKey: 'characterStatsBaseTitle',
                titleFallback: '기초 스탯',
                contentKey: 'helpBaseStatsContent',
                contentFallback: '레벨 1 기준 수치입니다. 캐릭터는 내부적으로 소수점 단위 스탯을 가지며, 정확한 내부 수치는 게임 내에서 모두 공개되지 않습니다.'
            },
            'awake7': {
                titleKey: 'characterStatsAwakeTitle',
                titleFallback: '잠재력 LV7',
                contentKey: 'helpAwake7Content',
                contentFallback: '잠재력 LV7(캐릭터 레벨 80) 기준 최종 보너스 수치입니다. 예: 치명타 확률 22.4%는 기본 5% 포함, 추가 17.4%를 의미합니다.'
            },
            'recommended-operation': {
                titleKey: 'characterDetailRecommendedOperation',
                titleFallback: '추천 운영',
                contentKey: 'helpRecommendedOperationContent',
                contentFallback: '의식 단계별 기본 운영 예시입니다. 적과 파티에 따라 순서는 달라질 수 있습니다. 상위 의식 운용이 별도로 없으면 의식 상승에 따른 추가 변화가 없다는 의미입니다.'
            }
        };

        const config = helpConfig[helpType];
        if (config) {
            const title = t(config.titleKey, config.titleFallback);
            const fallbackContent = String(config.contentFallback || '').replace('{link}', revelationOptionsLink);
            const translatedContent = t(config.contentKey, fallbackContent);
            const content = String(translatedContent || fallbackContent).replace('{link}', revelationOptionsLink);
            if (modalTitle) modalTitle.textContent = title;
            if (modalDescription) modalDescription.innerHTML = content;
        }
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeHelpModal() {
        const modal = document.getElementById('help-modal');
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('.help-close')) {
            closeHelpModal();
            return;
        }
        const modal = document.getElementById('help-modal');
        if (modal && modal.classList.contains('show') && !e.target.closest('.help-modal-content') && !e.target.closest('.help-icon')) {
            closeHelpModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        const modal = document.getElementById('help-modal');
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeHelpModal();
        }
    });

    window.showHelpModal = showHelpModal;
    window.closeHelpModal = closeHelpModal;
})();
