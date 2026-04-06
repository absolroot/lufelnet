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

    function getLangSafe() {
        try {
            if (typeof window.getCurrentLanguage === 'function') {
                return window.getCurrentLanguage();
            }
            if (window.I18nService && typeof window.I18nService.getCurrentLanguageSafe === 'function') {
                return window.I18nService.getCurrentLanguageSafe();
            }
        } catch (_) {}
        return 'kr';
    }

    function fallbackByLang(map) {
        const lang = getLangSafe();
        return map[lang] || map.kr;
    }

    function txMap(key, map) {
        return tx(key, fallbackByLang(map));
    }

    const CharI18N = {
        applySectionLabels(){
            const set = (sel, key, map, withHelp) => {
                const el = document.querySelector(sel);
                if (!el) return;
                const label = txMap(key, map);
                if (withHelp) {
                    el.innerHTML = label + ' ' + this.createHelpIcon(withHelp);
                } else {
                    el.textContent = label;
                }
            };

            set('.review-card h2', 'characterDetailReview', { kr: '캐릭터 리뷰', en: 'Character Review', jp: '怪盗レビュー', cn: '怪盗评测' });
            set('.settings-card h2', 'characterDetailRecommendedSetup', { kr: '추천 세팅', en: 'Recommended Setup', jp: 'おすすめ設定', cn: '推荐配置' });
            set('.skills-card h2', 'characterDetailSkills', { kr: '스킬', en: 'Skills', jp: 'スキル', cn: '技能' });
            set('.ritual-card h2', 'characterDetailRitual', { kr: '의식', en: 'Awareness', jp: '意識', cn: '意识' });
            set('.weapons-card h2', 'characterDetailWeapon', { kr: '전용 무기', en: 'Exclusive Weapon', jp: '専用武器', cn: '专属武器' });
            set('.revelation-settings h3', 'gameTerms.revelation', { kr: '계시', en: 'Revelation', jp: '啓示', cn: '启示' }, 'revelation');
            set('.revelation-settings .setting-section:nth-child(2) h3', 'characterDetailMainOption', { kr: '주 옵션', en: 'Main Option', jp: '主オプション', cn: '主属性' }, 'main-option');
            set('.revelation-settings .setting-section:nth-child(3) h3', 'characterDetailSubOption', { kr: '부 옵션', en: 'Sub Option', jp: '副オプション', cn: '副属性' }, 'sub-option');
            set('.stats-requirements h3:first-child', 'characterDetailRecommendedStats', { kr: '권장 육성 스탯', en: 'Recommended Stats', jp: '推奨育成ステータス', cn: '推荐养成属性' }, 'recommended-stats');
            set('.stats-requirements .setting-section:last-child h3', 'characterDetailBattleEntry', { kr: '전투 진입 시 +', en: 'At Battle Start +', jp: '戦闘開始時 +', cn: '战斗开始时 +' }, 'battle-entry');
            set('.skill-mind-settings .setting-section:first-child h3', 'characterDetailSkills', { kr: '스킬', en: 'Skills', jp: 'スキル', cn: '技能' }, 'skill');
            set('.skill-mind-settings .setting-section:last-child h3', 'characterDetailMindLv5', { kr: '심상 (LV 5)', en: 'Mindscape (LV 5)', jp: 'イメジャリー (LV 5)', cn: '心象 (LV 5)' }, 'mind-lv5');
            set('.operation-settings .setting-section:first-child h3', 'characterDetailRecommendedOperation', { kr: '추천 운영', en: 'Recommended Rotation', jp: '推奨運用', cn: '推荐操作' }, 'recommended-operation');
            set('.operation-settings .setting-section:last-child h3', 'characterDetailNotes', { kr: '참고사항', en: 'Notes', jp: '注意事項', cn: '注意事项' });

            const skillLevels = [
                txMap('characterDetailSkill1', { kr: '스킬 1', en: 'Skill 1', jp: 'スキル 1', cn: '技能1' }),
                txMap('characterDetailSkill2', { kr: '스킬 2', en: 'Skill 2', jp: 'スキル 2', cn: '技能2' }),
                txMap('characterDetailSkill3', { kr: '스킬 3', en: 'Skill 3', jp: 'スキル 3', cn: '技能3' }),
                txMap('characterDetailSkillHighlight', { kr: '하이라이트', en: 'HIGHLIGHT', jp: 'ハイライト', cn: '战斗技巧' })
            ];
            document.querySelectorAll('.skill-levels .skill-level .label').forEach((el, idx) => {
                if (skillLevels[idx]) el.textContent = skillLevels[idx];
            });

            const priority = [
                txMap('characterDetailPriority1', { kr: '1순위', en: '1st', jp: '1位', cn: '优先级1' }),
                txMap('characterDetailPriority2', { kr: '2순위', en: '2nd', jp: '2位', cn: '优先级2' }),
                txMap('characterDetailPriority3', { kr: '3순위', en: '3rd', jp: '3位', cn: '优先级3' })
            ];
            document.querySelectorAll('.sub-options .option-row .priority').forEach((el, idx) => {
                if (priority[idx]) el.textContent = priority[idx];
            });

            const mindStatLabels = [
                txMap('characterDetailMindStat1', { kr: '진급강화 1', en: 'Stats 1', jp: '進級強化 1', cn: '进阶强化 1' }),
                txMap('characterDetailMindStat2', { kr: '진급강화 2', en: 'Stats 2', jp: '進級強化 2', cn: '进阶强化 2' })
            ];
            const mindSkillLabels = [
                txMap('characterDetailMindSkill1', { kr: '스킬깨달음 1', en: 'Skill Enforce 1', jp: 'スキル覚醒 1', cn: '技能领悟 1' }),
                txMap('characterDetailMindSkill2', { kr: '스킬깨달음 2', en: 'Skill Enforce 2', jp: 'スキル覚醒 2', cn: '技能领悟 2' })
            ];

            document.querySelectorAll('.mind-stats .stat-row .label:not([data-glb-index])').forEach((el, idx) => {
                if (mindStatLabels[idx]) el.textContent = mindStatLabels[idx];
            });
            document.querySelectorAll('.mind-skills .skill-row .label:not([data-glb-index])').forEach((el, idx) => {
                if (mindSkillLabels[idx]) el.textContent = mindSkillLabels[idx];
            });

            const glbSuffix = ' (GLB)';
            const glbBaseLabels = {
                0: mindStatLabels[0],
                1: mindStatLabels[1],
                2: mindSkillLabels[0],
                3: mindSkillLabels[1]
            };
            document.querySelectorAll('.label[data-glb-index]').forEach(el => {
                const baseIndex = parseInt(el.getAttribute('data-glb-index'), 10);
                if (glbBaseLabels[baseIndex]) {
                    el.textContent = glbBaseLabels[baseIndex] + glbSuffix;
                }
            });

            const mainLabelEl = document.querySelector('.main-revelation .label');
            if (mainLabelEl) {
                const icon = mainLabelEl.querySelector('img');
                mainLabelEl.innerHTML = `${txMap('characterDetailMainLabel', { kr: '주', en: 'Main', jp: '主', cn: '宙' })} `;
                if (icon) mainLabelEl.appendChild(icon);
            }

            const smsEl = document.querySelector('.sub-revelation .label');
            if (smsEl) smsEl.textContent = txMap('characterDetailSunMoonStarEarth', { kr: '일월성진', en: 'Sun Moon Star Sky', jp: '日月星辰', cn: '日月星辰' });

            const sunMoonStar = [
                txMap('characterDetailSun', { kr: '일', en: 'Sun', jp: '日', cn: '日' }),
                txMap('characterDetailMoon', { kr: '월', en: 'Moon', jp: '月', cn: '月' }),
                txMap('characterDetailStar', { kr: '성', en: 'Star', jp: '星', cn: '星' }),
                txMap('characterDetailSky', { kr: '진', en: 'Sky', jp: '辰', cn: '辰' })
            ];
            document.querySelectorAll('.main-options .option-row .label').forEach((el, idx) => {
                const icon = el.querySelector('img');
                el.innerHTML = `${sunMoonStar[idx] || ''} `;
                if (icon) el.appendChild(icon);
            });

            const enhancementMap = {
                mixed: txMap('characterDetailEnhancementMixed', { kr: '5성 개조0 / 4성 개조6', en: '5★ Forge0 / 4★ Forge6', jp: '★5 改造0 / ★4 改造6', cn: '5星改造0 / 4星改造6' }),
                all: txMap('characterDetailEnhancementAll', { kr: '전체', en: 'All', jp: '全体', cn: '全部' }),
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
