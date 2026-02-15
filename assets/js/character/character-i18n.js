// 캐릭터 상세 페이지 전용 I18N 유틸
(function(){
    'use strict';

    function tx(key, fallback) {
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

    const CharI18N = {
        applySectionLabels(){
            const set = (sel, key, fallback, withHelp) => {
                const el = document.querySelector(sel);
                if (!el) return;
                const label = tx(key, fallback);
                if (withHelp) {
                    el.innerHTML = label + ' ' + this.createHelpIcon(withHelp);
                } else {
                    el.textContent = label;
                }
            };

            set('.review-card h2', 'characterDetailReview', '캐릭터 리뷰');
            set('.settings-card h2', 'characterDetailRecommendedSetup', '추천 세팅');
            set('.skills-card h2', 'characterDetailSkills', '스킬');
            set('.ritual-card h2', 'characterDetailRitual', '의식');
            set('.weapons-card h2', 'characterDetailWeapon', '전용 무기');
            set('.revelation-settings h3', 'characterDetailRevelation', '계시', 'revelation');
            set('.revelation-settings .setting-section:nth-child(2) h3', 'characterDetailMainOption', '주 옵션', 'main-option');
            set('.revelation-settings .setting-section:nth-child(3) h3', 'characterDetailSubOption', '부 옵션', 'sub-option');
            set('.stats-requirements h3:first-child', 'characterDetailRecommendedStats', '권장 육성 스탯', 'recommended-stats');
            set('.stats-requirements .setting-section:last-child h3', 'characterDetailBattleEntry', '전투 진입 시 +', 'battle-entry');
            set('.skill-mind-settings .setting-section:first-child h3', 'characterDetailSkills', '스킬', 'skill');
            set('.skill-mind-settings .setting-section:last-child h3', 'characterDetailMindLv5', '심상 (LV 5)', 'mind-lv5');
            set('.operation-settings .setting-section:first-child h3', 'characterDetailRecommendedOperation', '추천 운영', 'recommended-operation');
            set('.operation-settings .setting-section:last-child h3', 'characterDetailNotes', '참고사항');

            const skillLevels = [
                tx('characterDetailSkill1', '스킬 1'),
                tx('characterDetailSkill2', '스킬 2'),
                tx('characterDetailSkill3', '스킬 3'),
                tx('characterDetailSkillHighlight', '전투기술')
            ];
            document.querySelectorAll('.skill-levels .skill-level .label').forEach((el, idx) => {
                if (skillLevels[idx]) el.textContent = skillLevels[idx];
            });

            const priority = [
                tx('characterDetailPriority1', '1순위'),
                tx('characterDetailPriority2', '2순위'),
                tx('characterDetailPriority3', '3순위')
            ];
            document.querySelectorAll('.sub-options .option-row .priority').forEach((el, idx) => {
                if (priority[idx]) el.textContent = priority[idx];
            });

            const mindStats = [
                tx('characterDetailMindStat1', '진급강화 1'),
                tx('characterDetailMindStat2', '진급강화 2'),
                tx('characterDetailMindSkill1', '스킬깨달음 1'),
                tx('characterDetailMindSkill2', '스킬깨달음 2')
            ];
            document.querySelectorAll('.mind-stats .stat-row .label, .mind-skills .skill-row .label').forEach((el, idx) => {
                if (el.hasAttribute('data-glb-index')) return;
                if (mindStats[idx]) el.textContent = mindStats[idx];
            });

            const glbSuffix = ' (GLB)';
            document.querySelectorAll('.label[data-glb-index]').forEach(el => {
                const baseIndex = parseInt(el.getAttribute('data-glb-index'), 10);
                if (mindStats[baseIndex]) {
                    el.textContent = mindStats[baseIndex] + glbSuffix;
                }
            });

            const mainLabelEl = document.querySelector('.main-revelation .label');
            if (mainLabelEl) {
                const icon = mainLabelEl.querySelector('img');
                mainLabelEl.innerHTML = `${tx('characterDetailMainLabel', '주')} `;
                if (icon) mainLabelEl.appendChild(icon);
            }

            const smsEl = document.querySelector('.sub-revelation .label');
            if (smsEl) smsEl.textContent = tx('characterDetailSunMoonStarEarth', '일월성진');

            const sunMoonStar = [
                tx('characterDetailSun', '일'),
                tx('characterDetailMoon', '월'),
                tx('characterDetailStar', '성'),
                tx('characterDetailSky', '진')
            ];
            document.querySelectorAll('.main-options .option-row .label').forEach((el, idx) => {
                const icon = el.querySelector('img');
                el.innerHTML = `${sunMoonStar[idx] || ''} `;
                if (icon) el.appendChild(icon);
            });

            const enhancementMap = {
                mixed: tx('characterDetailEnhancementMixed', '5성 개조0 / 4성 개조6'),
                all: tx('characterDetailEnhancementAll', '전체'),
                '0': '0',
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '6': '6'
            };
            document.querySelectorAll('.enhancement-btn').forEach(btn => {
                const st = btn.dataset.stage;
                if (st && enhancementMap[st] != null) btn.textContent = enhancementMap[st];
            });
        },

        createHelpIcon(helpType){
            return `<span class="help-icon" onclick="showHelpModal('${helpType}')">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"/>
                    <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"/>
                </svg>
            </span>`;
        }
    };

    window.CharI18N = CharI18N;
})();


