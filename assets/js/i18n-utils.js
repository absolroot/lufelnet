// 공통 I18N/번역 유틸 - 페이지 전역에서 재사용
// 전역 의존: window.getCurrentLanguage (language-router.js), APP_VERSION, BASE_URL

(function(){
    'use strict';

    const I18NUtils = {
        getCurrentLanguageSafe() {
            try { return (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr'; } catch(_) { return 'kr'; }
        },

        // UI 라벨 번역 매핑 (페이지 공통)
        labels: {
            review: { kr: '요약', en: 'Summary', jp: '要約' },
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
                kr: ['스킬 1', '스킬 2', '스킬 3', '하이라이트'],
                en: ['Skill 1', 'Skill 2', 'Skill 3', 'Highlight'],
                jp: ['スキル 1', 'スキル 2', 'スキル 3', 'ハイライト']
            },
            priority: {
                kr: ['1순위', '2순위', '3순위'],
                en: ['1st Priority', '2nd Priority', '3rd Priority'],
                jp: ['第1優先', '第2優先', '第3優先']
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
            mainLabel: { kr: '주', en: 'Space', jp: '宙' },
        },

        // 스탯 단어 번역 테이블 (UI 전역 적용)
        statTranslations: {
            kr: {
                '생명': '생명','생명력': '생명력','공격력': '공격력','대미지 보너스': '대미지 보너스','대미지보너스': '대미지 보너스','크리티컬 확률': '크리티컬 확률','크리티컬확률': '크리티컬 확률','크리티컬 효과': '크리티컬 효과','크리티컬효과': '크리티컬 효과','관통': '관통','방어력': '방어력','효과 명중': '효과 명중','효과명중': '효과 명중','속도': '속도','치료효과':'치료효과'
            },
            en: {
                '최대 생명 증가': 'Max HP Up','최대 생명':'Max HP','생명':'HP','생명력':'HP','공격력':'Attack','대미지 보너스':'DMG Bonus(ATK Mult)','대미지보너스':'DMG Bonus(ATK Mult)','크리티컬 확률':'Crit Rate','크리티컬확률':'Crit Rate','크리티컬 효과':'Crit Mult','크리티컬효과':'Crit Mult','관통':'Pierce Rate','방어력 감소':'Defense Reduction','방어력':'Defense','방어':'Defense','효과 명중':'Ailment Accuracy','효과명중':'Ailment Accuracy','속도':'Speed','치료효과':'Healing Effect','치료':'Healing','추격':'Follow-up','효과 저항':'Effect Resi','효과저항':'Effect Resi','SP 회복':'SP Recovery','SP회복':'SP Recovery','해명의힘':'Navi Power','해명의 힘':'Navi Power','직책':'Labor','마이팰리스 평점':'My Palace Rating','마이팰리스':'My Palace','실드 효과':'Shield Effect','대미지감면':'Damage Reduction','총기':'Gun Shot','총격':'Gun Shot','의식':'Awareness','전용무기':'Exclusive Weapon','4성 무기':'4 Star Weapon','패시브':'Passive','실드효과':'Shield Effect','추가 효과':'Follow-up','반격':'CounterAttack','받는 대미지 증가':'Damage Taken','수면':'Sleep','원소 이상':'Element Alignment','실드':'Shield','주원':'Curse','지속 대미지':'DOT','화상':'Burn','화염 속성':'Fire','축복':'Blessing','풍습':'Windswept','동결':'Freeze','감전':'Shock','공격받을 확률 증가':'Taunt','전격':'Electric','망각':'Forget','감소':'Decrease','제거':'Remove','크리티컬':'Critical','차지':'Charge','추가 턴':'Additional Turn','디버프':'Debuff','지속 회복':'DOT Recovery','부활':'Revive','변신':'Transform','약점 변경':'Weakness Change','폼 체인지':'Form Change','스킬마스터':'Skill Master','빙결 속성':'Ice','대미지 축적':'Damage Accumulation','다운':'Down','테우르기아 충전':'Theurgy Charge','테우르기아':'Theurgy','아이템':'Item','미정':'TBD'
            },
            jp: {
                '최대 생명 증가':'最大HP上昇','최대 생명':'最大HP','생명':'HP','생명력':'HP','공격력':'攻撃力','대미지 보너스':'攻撃倍率+','대미지보너스':'攻撃倍率+','크리티컬 확률':'CRT発生率','크리티컬확률':'CRT発生率','크리티컬 효과':'CRT倍率','크리티컬효과':'CRT倍率','관통':'貫通','방어력 감소':'防御力減少','방어력':'防御力','방어':'防御力','효과 명중':'状態異常命中','효과명중':'状態異常命中','속도':'速さ','치료효과':'HP回復量','치료':'治療','추격':'追撃','효과 저항':'効果耐性','효과저항':'効果耐性','SP 회복':'SP 回復','SP회복':'SP 回復','해명의힘':'ステータス強化','해명의 힘':'ステータス強化','직책':'職責','마이팰리스 평점':'マイパレス評価','마이팰리스':'マイパレス','실드 효과':'シールド効果','대미지감면':'ダメージ減少','총기':'銃撃','총격':'銃撃','의식':'意識','전용무기':'専用武器','4성 무기':'4星武器','패시브':'パッシブ','실드효과':'シールド効果','추가 효과':'意識奏功','반격':'反撃','받는 대미지 증가':'ダメージ受け','수면':'睡眠','원소 이상':'元素異常','실드':'シールド','주원':'呪怨','지속 대미지':'DOT','화상':'燃焼','화염 속성':'火炎','축복':'祝福','풍습':'風襲','동결':'凍結','공격받을 확률 증가':'挑発','감전':'感電','전격':'電撃','망각':'忘却','감소':'減少','제거':'除去','크리티컬':'クリティカル','차지':'チャージ','추가 턴':'追加ターン','디버프':'デバフ','지속 회복':'DOT回復','부활':'復活','변신':'変身','약점 변경':'弱点変更','폼 체인지':'フォームチェンジ','스킬마스터':'スキルマスター','빙결 속성':'氷結','대미지 축적':'ダメージ蓄積','다운':'ダウン','테우르기아 충전':'テウルギアャージ','테우르기아':'テウルギア','아이템':'アイテム','미정':'未定','가드':'ダウン値','벨벳 룸의 시련':'ベルベットルームの試練'
            }
        },

        // 요소 내 텍스트의 스탯 단어 번역
        translateStatTexts(root=document){
            const lang = this.getCurrentLanguageSafe();
            const dict = this.statTranslations[lang] || {};
            const all = root.querySelectorAll('*');
            all.forEach(el => {
                if (el.children.length === 0) {
                    let text = el.textContent;
                    if (!text) return;
                    let changed = false;
                    Object.keys(dict).forEach(ko => {
                        const tr = dict[ko];
                        if (ko !== tr && text.includes(ko)) {
                            text = text.replace(new RegExp(ko,'g'), tr);
                            changed = true;
                        }
                    });
                    if (changed) el.textContent = text;
                }
            });
            // 특정 클래스들 빠르게 재적용
            document.querySelectorAll('.stat-label, .value, .option-row .value').forEach(el => {
                let text = el.textContent || '';
                let changed = false;
                Object.keys(dict).forEach(ko => {
                    const tr = dict[ko];
                    if (ko !== tr && text.includes(ko)) {
                        text = text.replace(new RegExp(ko,'g'), tr);
                        changed = true;
                    }
                });
                if (changed) el.textContent = text;
            });
        },

        // 공통 섹션 라벨 번역 적용
        applyCommonSectionLabels(){
            const lang = this.getCurrentLanguageSafe();
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

            // 스킬 레벨 라벨
            document.querySelectorAll('.skill-levels .skill-level .label').forEach((el, idx) => {
                const arr = L.skillLevels[lang] || L.skillLevels.kr;
                if (arr[idx]) el.textContent = arr[idx];
            });

            // 우선순위 라벨
            document.querySelectorAll('.sub-options .option-row .priority').forEach((el, idx) => {
                const arr = L.priority[lang] || L.priority.kr;
                if (arr[idx]) el.textContent = arr[idx];
            });

            // 메인/일월성진 개별 라벨
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

            // 무기 개조 버튼
            const buttons = document.querySelectorAll('.enhancement-btn');
            const map = L.enhancementButtons[lang] || L.enhancementButtons.kr;
            buttons.forEach(btn => {
                const st = btn.dataset.stage;
                if (st && map[st] != null) btn.textContent = map[st];
            });
        },

        // 도움말 아이콘 SVG
        createHelpIcon(helpType){
            return `<span class="help-icon" onclick="showHelpModal('${helpType}')">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"/>
                    <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"/>
                </svg>
            </span>`;
        },

        // 배틀 진입 텍스트 내 심상5 언어치환
        replaceMindText(text){
            const lang = this.getCurrentLanguageSafe();
            const map = { kr: '심상5', en: 'Mindscape5', jp: 'イメジャリー5' };
            return text.replace(/심상\s?5/g, map[lang] || '심상5');
        }
    };

    // 전역 노출
    window.I18NUtils = I18NUtils;
})();


