(function(){
    'use strict';

    const DefenseI18N = {
        getLang(){
            try { return (typeof getCurrentLanguage==='function') ? getCurrentLanguage() : (I18NUtils && I18NUtils.getCurrentLanguageSafe ? I18NUtils.getCurrentLanguageSafe() : 'kr'); } catch(_) { return 'kr'; }
        },

        // Wonder 데이터 이름 영어/일본어 매핑 주입
        enrichDefenseDataWithWonderNames(){
            try {
                // 방깎 테이블
                if (typeof defenseCalcData !== 'undefined' && Array.isArray(defenseCalcData['원더'])) {
                    defenseCalcData['원더'].forEach(item => this._fillWonderLocalizedName(item));
                }
                // 관통 테이블
                if (typeof penetrateData !== 'undefined' && Array.isArray(penetrateData['원더'])) {
                    penetrateData['원더'].forEach(item => this._fillWonderLocalizedName(item));
                }
            } catch(_) {}
        },

        _fillWonderLocalizedName(item){
            if (!item || !item.skillName || !item.type) return;


            const type = String(item.type);
            const nameKr = String(item.skillName);
            //console.log(nameKr);
            if (type === '전용무기') {
                const loc = this.lookupWonderLocalization('weapon', nameKr);
                if (loc) { item.skillName_en = loc.en; item.skillName_jp = loc.jp; }
            } else if (type === '스킬') {
                const loc = this.lookupWonderLocalization('skill', nameKr);
                if (loc) { item.skillName_en = loc.en; item.skillName_jp = loc.jp; }
            } else if (type === '페르소나') {
                const hadUniqueSuffix = (/-\s*고유\s?스킬|-\s*고유스킬/).test(nameKr);
                const base = nameKr.replace(/\s*-\s*고유\s?스킬/g, '').replace(/\s*-\s*고유스킬/g, '');
                const loc = this.lookupWonderLocalization('persona', base);
                if (loc) {
                    if (hadUniqueSuffix) {
                        item.skillName_en = `${loc.en} - Unique Skill`;
                        item.skillName_jp = `${loc.jp} - 固有スキル`;
                    } else {
                        item.skillName_en = loc.en;
                        item.skillName_jp = loc.jp;
                    }
                }
            }
        },

        lookupWonderLocalization(kind, nameKr){
            // 각 매핑 객체에서 name_en/name_jp 탐색
            const tryGet = (mapObj, key) => {
                if (!mapObj || !key) return null;
                const rec = (mapObj && (mapObj[key] || (mapObj.default && mapObj.default[key]))) || mapObj[key];
                if (!rec) return null;
                const en = rec.name_en || rec.en || rec.english || '';
                const jp = rec.name_jp || rec.jp || rec.japanese || '';
                if (!en && !jp) return null;
                return { en: en || key, jp: jp || key };
            };

            try {
                if (kind === 'weapon') {
                    const source = (typeof matchWeapons !== 'undefined') ? matchWeapons : (window.matchWeapons || (window.weapons && window.weapons.matchWeapons));
                    return tryGet(source, nameKr);
                } else if (kind === 'skill') {
                    const source = (typeof personaSkillList !== 'undefined') ? personaSkillList : (window.personaSkillList || (window.skills && window.skills.personaSkillList));
                    return tryGet(source, nameKr);
                } else if (kind === 'persona') {
                    const source =
                        (typeof window !== 'undefined' && window.personaFiles && Object.keys(window.personaFiles).length)
                            ? window.personaFiles
                            : ((typeof personaData !== 'undefined') ? personaData : (window.personaData || (window.persona && window.persona.personaData)));
                    return tryGet(source, nameKr);
                }
            } catch(_) { return null; }
            return null;
        },

        updateLanguageContent(root=document){
            // 원더 데이터에 영/일 이름 주입 (1회성 안전 호출)
            try { this.enrichDefenseDataWithWonderNames(); } catch(_) {}
            const currentLang = this.getLang();
            const i18n = {
                kr: {
                    nav_home: '홈', nav_current: '방어력 계산', page_title: '방어력 감소 계산기',
                    boss_info: '보스 정보', boss_select: '보스 선택', base_defense: '· 기본 방어력:', defense_coef: '· 보스 방어 계수:',
                    penetrate_total: '관통', final_defense_coef_after_pierce: '관통 적용 방어 계수:', sum_target: '합계 / 목표',
                    penetrate_desc: '※ 보스 방어 계수 × (100-관통)%', defense_reduce_total: '방어력 감소', final_defense_coef: '최종 방어 계수:',
                    final_defense_coef_title: '최종 방어력 계수', defense_reduce_desc: '※ 보스 방어 계수 - 방어력 감소', final_damage_increase: '최종 대미지 증가',
                    boss_info_tip: '최고 난이도 기준 값이며, 같은 이름이더라도 보스마다 방어력 값은 다를 수 있습니다. 참조용 데이터이며 정확한 수치는 아닙니다.',
                    tooltip_formula: '대미지 배수 : 1 - [방어력 × 방어 계수 / (방어력× 방어 계수 + 1400)]',
                    base_final_damage: '· 방어력에 의한 최종 대미지 배수:', with_def_reduce: '· 방어력 감소 최종 대미지 배수:',
                    tab_pierce: '관통', tab_defense: '방어력 감소', revelation_penetrate: '계시 관통 합계', explanation_power: '해명의 힘',
                    th_select: '선택', th_thief: '괴도', th_type: '분류', th_target: '목표', th_name: '이름', th_option: '옵션', th_value: '수치', th_duration: '지속시간', th_note: '비고',
                    windswept: '풍습', windswept_tip: '최종 방어력 계수 * 88%. 항상 마지막에 적용됩니다. 따라서 계수 0을 달성하기 위해서는 풍습을 제외하고 남은 수치 만큼 실제 감소가 필요합니다.'
                },
                en: {
                    nav_home: 'Home', nav_current: 'Defense Calc', page_title: 'Defense Reduction Calculator',
                    boss_info: 'Boss Info', boss_select: 'Select Boss', base_defense: '· Enemy Defense:', defense_coef: '· Boss Defense Coefficient:',
                    penetrate_total: 'Total Pierce', final_defense_coef_after_pierce: 'Defense Coef. after Pierce:', sum_target: 'Sum / Target',
                    penetrate_desc: '※ Boss Defense Coef. × (100 - Pierce)%', defense_reduce_total: 'Total Defense Reduction', final_defense_coef: 'Final Defense Coef.:',
                    final_defense_coef_title: 'Final Defense Coef.', defense_reduce_desc: '※ Boss Defense Coef. - Defense Reduction', final_damage_increase: 'Final Damage Increase',
                    boss_info_tip: 'Values are based on the highest difficulty. Even with the same name, each boss can have different Defense values. This is reference data and may not be exact.',
                    tooltip_formula: 'Damage multiplier: 1 - [Enemy Defense × Defense Coef. / (Enemy Defense × Defense Coef. + 1400)]',
                    base_final_damage: '· Base final damage mult.:', with_def_reduce: '· With defense reduction mult.:',
                    tab_pierce: 'Pierce', tab_defense: 'Defense Reduction', revelation_penetrate: 'Revelation Pierce Total', explanation_power: 'Elucidation Power', other_reduce: 'Other Defense Reduction',
                    th_select: 'Select', th_thief: 'Thief', th_type: 'Type', th_target: 'Target', th_name: 'Name', th_option: 'Option', th_value: 'Value', th_duration: 'Duration', th_note: 'Note',
                    windswept: 'Windswept', windswept_tip: 'Final Defense Coef. * 88%. Always applied at the very end. Therefore, to reach a final coefficient of 0, you need enough actual reduction from other sources excluding Windswept.'
                },
                jp: {
                    nav_home: 'ホーム', nav_current: '防御力計算', page_title: '防御力減少計算機',
                    boss_info: 'ボス情報', boss_select: 'ボス選択', base_defense: '・ 敵防御力:', defense_coef: '・ ボス防御係数:',
                    penetrate_total: '貫通合計', final_defense_coef_after_pierce: '貫通適用の防御係数:', sum_target: '合計 / 目標',
                    penetrate_desc: '※ ボス防御係数 × (100 - 貫通)%', defense_reduce_total: '防御力減少合計', final_defense_coef: '最終防御係数:',
                    final_defense_coef_title: '最終防御係数', defense_reduce_desc: '※ ボス防御係数 - 防御力減少', final_damage_increase: '最終ダメージ増加',
                    boss_info_tip: '最高難易度を基準とした値です。同じ名前でもボスごとに防御力は異なる場合があります。参考用データであり、正確な数値ではありません。',
                    tooltip_formula: 'ダメージ倍率: 1 - [敵防御 × 防御係数 / (敵防御 × 防御係数 + 1400)]',
                    base_final_damage: '・ 基本 最終ダメージ倍率:', with_def_reduce: '・ 防御力減少あり 最終ダメージ倍率:',
                    tab_pierce: '貫通', tab_defense: '防御力減少', revelation_penetrate: '啓示 貫通合計', explanation_power: '解明の力', other_reduce: 'その他 防御力減少',
                    th_select: '選択', th_thief: '怪盗', th_type: '分類', th_target: '対象', th_name: '名前', th_option: 'オプション', th_value: '数値', th_duration: '持続時間', th_note: '備考',
                    windswept: '風襲', windswept_tip: '最終防御係数 * 88%。常に最後に適用されます。そのため、最終係数0を達成するには、風襲を除いた残りの分を実際の減少で満たす必要があります。'
                }
            };

            const t = i18n[currentLang] || i18n.kr;

            const navHome = root.getElementById ? root.getElementById('nav-home') : document.getElementById('nav-home');
            const navCurrent = root.getElementById ? root.getElementById('nav-current') : document.getElementById('nav-current');
            const pageTitle = root.getElementById ? root.getElementById('page-title') : document.getElementById('page-title');
            if (navHome) navHome.textContent = t.nav_home;
            if (navCurrent) navCurrent.textContent = t.nav_current;
            if (pageTitle) pageTitle.textContent = t.page_title;

            const bossInfoTitle = document.getElementById('boss-info-title');
            const bossSelectPlaceholder = document.getElementById('bossSelectPlaceholder');
            const baseDefenseLabel = document.getElementById('baseDefenseLabel');
            const defenseCoefLabel = document.getElementById('defenseCoefLabel');
            if (bossInfoTitle) {
                const icon0 = bossInfoTitle.querySelector('.tooltip-icon');
                bossInfoTitle.textContent = t.boss_info + ' ';
                if (icon0) bossInfoTitle.appendChild(icon0);
            }
            const bossInfoTooltip = document.getElementById('bossInfoTooltip');
            if (bossInfoTooltip) bossInfoTooltip.setAttribute('data-tooltip', t.boss_info_tip);
            if (bossSelectPlaceholder) bossSelectPlaceholder.textContent = t.boss_select;
            if (baseDefenseLabel) baseDefenseLabel.textContent = t.base_defense;
            if (defenseCoefLabel) defenseCoefLabel.textContent = t.defense_coef;

            const showSpoilerLabel = document.getElementById('showSpoilerLabel');
            const spoilerWrap = document.getElementById('spoilerToggleWrap');
            if (spoilerWrap) {
                spoilerWrap.style.display = (currentLang === 'kr') ? 'none' : '';
            }
            if (showSpoilerLabel) {
                if (currentLang === 'en') showSpoilerLabel.textContent = 'Show Spoilers';
                else if (currentLang === 'jp') showSpoilerLabel.textContent = 'スポイラー表示';
                else showSpoilerLabel.textContent = 'Show Spoilers';
            }

            const penetrateTitle = document.getElementById('penetrate-total-title');
            if (penetrateTitle) {
                const icon = penetrateTitle.querySelector('.tooltip-icon');
                penetrateTitle.textContent = t.penetrate_total + ' ';
                if (icon) penetrateTitle.appendChild(icon);
            }
            const penetrateIcon = document.getElementById('penetrateTooltip');
            if (penetrateIcon) penetrateIcon.setAttribute('data-tooltip', t.penetrate_desc);

            const defenseReduceTitle = document.getElementById('defense-reduce-total-title');
            if (defenseReduceTitle) {
                const icon2 = defenseReduceTitle.querySelector('.tooltip-icon');
                defenseReduceTitle.textContent = t.defense_reduce_total + ' ';
                if (icon2) defenseReduceTitle.appendChild(icon2);
            }
            const defenseReduceIcon = document.getElementById('defenseReduceTooltip');
            if (defenseReduceIcon) defenseReduceIcon.setAttribute('data-tooltip', t.defense_reduce_desc);

            const pierceSumTargetLabel = document.getElementById('pierceSumTargetLabel');
            const reduceSumTargetLabel = document.getElementById('reduceSumTargetLabel');
            if (pierceSumTargetLabel) pierceSumTargetLabel.textContent = t.sum_target;
            if (reduceSumTargetLabel) reduceSumTargetLabel.textContent = t.sum_target;

            const finalCoefTitle = document.getElementById('defense-coef-title');
            if (finalCoefTitle) finalCoefTitle.textContent = t.final_defense_coef_title;

            const finalDamageTitle = document.getElementById('final-damage-increase-title');
            const finalDamageTooltip = document.getElementById('finalDamageTooltip');
            const baseFinalDamageLabel = document.getElementById('baseFinalDamageLabel');
            const withDefReduceLabel = document.getElementById('withDefReduceLabel');
            if (finalDamageTitle && finalDamageTitle.firstChild) finalDamageTitle.firstChild.textContent = t.final_damage_increase + ' ';
            if (finalDamageTooltip) finalDamageTooltip.setAttribute('data-tooltip', t.tooltip_formula);
            if (baseFinalDamageLabel) baseFinalDamageLabel.textContent = t.base_final_damage;
            if (withDefReduceLabel) withDefReduceLabel.textContent = t.with_def_reduce;

            const tabPierce = document.querySelector('.tab-button[data-tab="penetrate"]');
            const tabDefense = document.querySelector('.tab-button[data-tab="defense"]');
            if (tabPierce) tabPierce.textContent = t.tab_pierce;
            if (tabDefense) tabDefense.textContent = t.tab_defense;

            const revelationPenetrateLabel = document.getElementById('revelationPenetrateLabel');
            const explanationPowerLabel = document.getElementById('explanationPowerLabel');
            const otherReduceLabel = document.getElementById('otherReduceLabel');
            const windsweptText = document.getElementById('windsweptText');
            const windsweptTooltip = document.getElementById('windsweptTooltip');
            if (revelationPenetrateLabel) revelationPenetrateLabel.textContent = t.revelation_penetrate;
            if (explanationPowerLabel) explanationPowerLabel.textContent = t.explanation_power;
            if (otherReduceLabel) otherReduceLabel.textContent = (currentLang==='kr'?'기타 방어력 감소': t.other_reduce);
            if (windsweptText && t.windswept) windsweptText.textContent = t.windswept;
            if (windsweptTooltip && t.windswept_tip) windsweptTooltip.setAttribute('data-tooltip', t.windswept_tip);

            this.setTextAll('.check-column', t.th_select);
            this.setTextAll('.char-img-column', t.th_thief);
            this.setTextAll('.type-column', t.th_type);
            this.setTextAll('.target-column', t.th_target);
            this.setTextAll('.skill-name-column', t.th_name);
            this.setTextAll('.option-column', t.th_option);
            this.setTextAll('.value-column', t.th_value);
            this.setTextAll('.duration-column', t.th_duration);
            this.setTextAll('.note-column', t.th_note);

            // 툴팁 재바인딩
            try {
                if (typeof bindTooltipElement === 'function') {
                    ['bossInfoTooltip','penetrateTooltip','defenseReduceTooltip','finalDamageTooltip','windsweptTooltip']
                        .map(id => document.getElementById(id))
                        .forEach(el => { if (el) bindTooltipElement(el); });
                }
            } catch(_) {}
        },

        setTextAll(selector, text){
            document.querySelectorAll(`.defense-table thead ${selector}`).forEach(el => {
                if (el && text != null) el.textContent = text;
            });
        }
    };

    window.DefenseI18N = DefenseI18N;
})();


