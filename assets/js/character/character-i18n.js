// 캐릭터 상세 페이지 전용 I18N 유틸
(function(){
    'use strict';

    const CharI18N = {
        getLang() { try { return (typeof getCurrentLanguage==='function') ? getCurrentLanguage() : 'kr'; } catch(_) { return 'kr'; } },

        labels: {
            review: { kr: '캐릭터 리뷰', en: 'Character Review', jp: 'キャラクター レビュー' },
            recommendedSetup: { kr: '추천 세팅', en: 'Recommended Setup', jp: 'おすすめ設定' },
            skills: { kr: '스킬', en: 'Skills', jp: 'スキル' },
            ritual: { kr: '의식', en: 'Awareness', jp: '意識' },
            weapon: { kr: '전용 무기', en: 'Exclusive Weapon', jp: '専用武器' },
            revelation: { kr: '계시', en: 'Revelation', jp: '啓示' },
            mainOption: { kr: '주 옵션', en: 'Main Options', jp: '主属性' },
            subOption: { kr: '부 옵션', en: 'Sub Options', jp: '副属性' },
            recommendedStats: { kr: '권장 육성 스탯', en: 'Recommended Stats', jp: '推奨育成ステータス' },
            battleEntry: { kr: '전투 진입 시 +', en: 'Battle Entry +', jp: '戦闘開始時 +' },
            mindLv5: { kr: '심상 (LV 5)', en: 'Mindscape (LV 5)', jp: 'イメジャリー (LV 5)' },
            recommendedOperation: { kr: '추천 운영', en: 'Skill Rotation', jp: 'スキル利用順' },
            notes: { kr: '참고사항', en: 'Notes', jp: '参考事項' },
            skillLevels: {
                kr: ['스킬 1', '스킬 2', '스킬 3', '전투기술'],
                en: ['Skill 1', 'Skill 2', 'Skill 3', 'Highlight'],
                jp: ['スキル 1', 'スキル 2', 'スキル 3', 'ハイライト']
            },
            priority: {
                kr: ['1순위', '2순위', '3순위'],
                en: ['1st Priority', '2nd Priority', '3rd Priority'],
                jp: ['第1優先', '第2優先', '第3優先']
            },
            mindStats: {
                kr: ['진급강화 1', '진급강화 2', '스킬깨달음 1', '스킬깨달음 2'],
                en: ['Stats 1', 'Stats 2', 'Skill Enforce 1', 'Skill Enforce 2'],
                jp: ['進級強化 1', '進級強化 2', 'スキル覚醒 1', 'スキル覚醒 2']
            },
            enhancementButtons: {
                kr: { mixed: '5성 개조0 / 4성 개조6', all: '전체', '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6' },
                en: { mixed: '5★ +0 / 4★ +6', all: 'All', '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6' },
                jp: { mixed: '5星 強化0 / 4星 強化6', all: '全体', '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6' }
            },
            sunMoonStar: {
                kr: ['일', '월', '성', '진'],
                en: ['Sun', 'Moon', 'Star', 'Planet'],
                jp: ['旭', '月', '星', '天']
            },
            sunMoonStarEarth: { kr: '일월성진', en: 'S/M/S/P', jp: '旭月星天' },
            mainLabel: { kr: '주', en: 'Space', jp: '宙' }
        },

        applySectionLabels(){
            const lang = this.getLang();
            const L = this.labels;
            const set = (sel, key, withHelp) => {
                const el = document.querySelector(sel);
                if (!el) return;
                const label = (L[key] && L[key][lang]) || (L[key] && L[key]['kr']) || '';
                if (withHelp) {
                    el.innerHTML = label + ' ' + this.createHelpIcon(withHelp);
                } else {
                    el.textContent = label;
                }
            };
            set('.review-card h2', 'review');
            set('.settings-card h2', 'recommendedSetup');
            set('.skills-card h2', 'skills');
            set('.ritual-card h2', 'ritual');
            set('.weapons-card h2', 'weapon');
            set('.revelation-settings h3', 'revelation', 'revelation');
            set('.revelation-settings .setting-section:nth-child(2) h3', 'mainOption', 'main-option');
            set('.revelation-settings .setting-section:nth-child(3) h3', 'subOption', 'sub-option');
            set('.stats-requirements h3:first-child', 'recommendedStats', 'recommended-stats');
            set('.stats-requirements .setting-section:last-child h3', 'battleEntry', 'battle-entry');
            set('.skill-mind-settings .setting-section:first-child h3', 'skills', 'skill');
            set('.skill-mind-settings .setting-section:last-child h3', 'mindLv5', 'mind-lv5');
            set('.operation-settings .setting-section:first-child h3', 'recommendedOperation', 'recommended-operation');
            const notesEl = document.querySelector('.operation-settings .setting-section:last-child h3');
            if (notesEl) notesEl.textContent = (L.notes[lang] || L.notes.kr);

            document.querySelectorAll('.skill-levels .skill-level .label').forEach((el, idx) => {
                const arr = L.skillLevels[lang] || L.skillLevels.kr;
                if (arr[idx]) el.textContent = arr[idx];
            });
            document.querySelectorAll('.sub-options .option-row .priority').forEach((el, idx) => {
                const arr = L.priority[lang] || L.priority.kr;
                if (arr[idx]) el.textContent = arr[idx];
            });
            // 진급강화/스킬깨달음 라벨
            const mindStatsArr = L.mindStats[lang] || L.mindStats.kr;
            document.querySelectorAll('.mind-stats .stat-row .label, .mind-skills .skill-row .label').forEach((el, idx) => {
                if (mindStatsArr[idx]) el.textContent = mindStatsArr[idx];
            });
            const mainLabelEl = document.querySelector('.main-revelation .label');
            if (mainLabelEl) {
                const icon = mainLabelEl.querySelector('img');
                mainLabelEl.innerHTML = `${(L.mainLabel[lang] || L.mainLabel.kr)} `;
                if (icon) mainLabelEl.appendChild(icon);
            }
            const smsEl = document.querySelector('.sub-revelation .label');
            if (smsEl) smsEl.textContent = (L.sunMoonStarEarth[lang] || L.sunMoonStarEarth.kr);
            document.querySelectorAll('.main-options .option-row .label').forEach((el, idx) => {
                const icon = el.querySelector('img');
                const arr = L.sunMoonStar[lang] || L.sunMoonStar.kr;
                el.innerHTML = `${arr[idx] || ''} `;
                if (icon) el.appendChild(icon);
            });
            const buttons = document.querySelectorAll('.enhancement-btn');
            const map = L.enhancementButtons[lang] || L.enhancementButtons.kr;
            buttons.forEach(btn => {
                const st = btn.dataset.stage;
                if (st && map[st] != null) btn.textContent = map[st];
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


