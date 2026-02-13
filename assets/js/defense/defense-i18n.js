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
                    boss_type_sea: '바다', boss_type_nightmare: '흉몽',
                    penetrate_total: '관통', final_defense_coef_after_pierce: '관통 적용 방어 계수:', sum_target: '합계 / 목표',
                    penetrate_desc: '※ 보스 방어 계수 × (100-관통)%', defense_reduce_total: '방어력 감소', final_defense_coef: '최종 방어 계수:',
                    final_defense_coef_title: '방어력 수치', defense_reduce_desc: '※ 보스 방어 계수 - 방어력 감소', final_damage_increase: '최종 대미지',
                    boss_info_tip: '최고 난이도 기준의 참조용 데이터입니다. 같은 이름이라도 보스별 방어력 수치는 다를 수 있습니다. 중요: 이 값은 출시 초기 확보 데이터 기반이며, 현재는 정확한 수치를 구하거나 검증할 방법이 없습니다.',
                    boss_info_inline_badge: '초기 데이터',
                    boss_info_inline: '출시 초기 확보 데이터 기반 / 현재 정확 수치 입수·검증 불가',
                    tooltip_formula: '대미지 배수 : 1 - [방어력 × 방어 계수 / (방어력× 방어 계수 + 1400)]',
                    base_final_damage: '· 방어력에 의한 최종 대미지 배수:', with_def_reduce: '· 방어력 감소 최종 대미지 배수:',
                    tab_pierce: '관통', tab_defense: '방어력 감소', revelation_penetrate: '계시 관통 합계', revelation_sum: '계시 합계', explanation_power: '해명의 힘',
                    th_select: '선택', th_thief: '괴도', th_type: '분류', th_target: '목표', th_name: '이름', th_option: '옵션', th_value: '수치', th_duration: '지속', th_note: '비고',
                    windswept: '풍습', windswept_tip: '최종 방어력 계수 * 88%. 항상 마지막에 적용됩니다. 따라서 계수 0을 달성하기 위해서는 풍습을 제외하고 남은 수치 만큼 실제 감소가 필요합니다.',
                    stat_sum: '합계', stat_target: '목표', stat_remaining: '남은 수치',
                    stat_final_increase: '최종 증가', stat_base_damage_mult: '기존 대미지 배수', stat_final_damage_mult: '최종 대미지 배수',
                    stat_final_def_coef: '최종 방어 계수', stat_boss_def_coef: '보스 방어 계수', stat_boss_base_def: '보스 기본 방어력'
                },
                en: {
                    nav_home: 'Home', nav_current: 'Defense Calc', page_title: 'Defense Reduction Calculator',
                    boss_info: 'Boss Info', boss_select: 'Select Boss', base_defense: '· Enemy Defense:', defense_coef: '· Boss Defense Coefficient:',
                    boss_type_sea: 'SoS', boss_type_nightmare: 'NTMR',
                    penetrate_total: 'Pierce', final_defense_coef_after_pierce: 'Defense Coef. after Pierce:', sum_target: 'Sum / Target',
                    penetrate_desc: '※ Boss Defense Coef. × (100 - Pierce)%', defense_reduce_total: 'Def. Reduction', final_defense_coef: 'Final Defense Coef.:',
                    final_defense_coef_title: 'Def. Info', defense_reduce_desc: '※ Boss Defense Coef. - Defense Reduction', final_damage_increase: 'Final Damage',
                    boss_info_tip: 'These are highest-difficulty reference values. Even bosses with the same name can have different Defense stats. Important: this dataset is based on launch-period data, and exact values are currently unobtainable and cannot be verified.',
                    boss_info_inline_badge: 'Initial Data',
                    boss_info_inline: 'Launch-period data only. Exact values are currently unobtainable and unverifiable.',
                    tooltip_formula: 'Damage multiplier: 1 - [Enemy Defense × Defense Coef. / (Enemy Defense × Defense Coef. + 1400)]',
                    base_final_damage: '· Base final damage mult.:', with_def_reduce: '· With defense reduction mult.:',
                    tab_pierce: 'Pierce', tab_defense: 'Defense Reduction', revelation_penetrate: 'Revelation Pierce Total', revelation_sum: 'Revelation Sum', explanation_power: 'Elucidation Power', other_reduce: 'Other Def. Reduction',
                    th_select: 'Select', th_thief: 'Thief', th_type: 'Type', th_target: 'Target', th_name: 'Name', th_option: 'Option', th_value: 'Value', th_duration: 'Duration', th_note: 'Note',
                    windswept: 'Windswept', windswept_tip: 'Final Defense Coef. * 88%. Always applied at the very end. Therefore, to reach a final coefficient of 0, you need enough actual reduction from other sources excluding Windswept.',
                    stat_sum: 'Sum', stat_target: 'Target', stat_remaining: 'Remaining',
                    stat_final_increase: 'Final Increase', stat_base_damage_mult: 'Base DMG Mult.', stat_final_damage_mult: 'Final DMG Mult.',
                    stat_final_def_coef: 'Final Def Coef.', stat_boss_def_coef: 'Boss Def Coef.', stat_boss_base_def: 'Boss Base Def'
                },
                jp: {
                    nav_home: 'ホーム', nav_current: '防御力計算', page_title: '防御力減少計算機',
                    boss_info: 'ボス情報', boss_select: 'ボス選択', base_defense: '・ 敵防御力:', defense_coef: '・ ボス防御係数:',
                    boss_type_sea: '心の海', boss_type_nightmare: '閼兇夢',
                    penetrate_total: '貫通合計', final_defense_coef_after_pierce: '貫通適用の防御係数:', sum_target: '合計 / 目標',
                    penetrate_desc: '※ ボス防御係数 × (100 - 貫通)%', defense_reduce_total: '防御力減少合計', final_defense_coef: '最終防御係数:',
                    final_defense_coef_title: '防御力数値', defense_reduce_desc: '※ ボス防御係数 - 防御力減少', final_damage_increase: '最終ダメージ',
                    boss_info_tip: '最高難易度基準の参考値です。同名でもボスごとに防御値が異なる場合があります。重要: このデータはリリース初期に確保された情報ベースであり、現在は正確な数値を入手・検証できません。',
                    boss_info_inline_badge: '初期データ',
                    boss_info_inline: 'リリース初期データのみ / 現在は正確値の入手・検証不可',
                    tooltip_formula: 'ダメージ倍率: 1 - [敵防御 × 防御係数 / (敵防御 × 防御係数 + 1400)]',
                    base_final_damage: '・ 基本 最終ダメージ倍率:', with_def_reduce: '・ 防御力減少あり 最終ダメージ倍率:',
                    tab_pierce: '貫通', tab_defense: '防御力減少', revelation_penetrate: '啓示 貫通合計', revelation_sum: '啓示 合計', explanation_power: '解明の力', other_reduce: 'その他 防御力減少',
                    th_select: '選択', th_thief: '怪盗', th_type: '分類', th_target: '対象', th_name: '名前', th_option: 'オプション', th_value: '数値', th_duration: '持続', th_note: '備考',
                    windswept: '風襲', windswept_tip: '最終防御係数 * 88%。常に最後に適用されます。そのため、最終係数0を達成するには、風襲を除いた残りの分を実際の減少で満たす必要があります。',
                    stat_sum: '合計', stat_target: '目標', stat_remaining: '残り数値',
                    stat_final_increase: '最終増加', stat_base_damage_mult: '基本ダメージ倍率', stat_final_damage_mult: '最終ダメージ倍率',
                    stat_final_def_coef: '最終防御係数', stat_boss_def_coef: 'ボス防御係数', stat_boss_base_def: 'ボス基本防御力'
                }
            };

            const t = i18n[currentLang] || i18n.kr;

            const navHome = root.getElementById ? root.getElementById('nav-home') : document.getElementById('nav-home');
            const navCurrent = root.getElementById ? root.getElementById('nav-current') : document.getElementById('nav-current');
            const pageTitle = root.getElementById ? root.getElementById('page-title') : document.getElementById('page-title');
            if (navHome) navHome.textContent = t.nav_home;
            if (navCurrent) navCurrent.textContent = t.nav_current;
            // defense-calc 페이지에서만 page-title 업데이트 (critical-calc는 critical-calc.js에서 처리)
            if (pageTitle && (window.location.pathname.includes('/defense-calc') || window.location.pathname.includes('defense-calc'))) {
                pageTitle.textContent = t.page_title;
            }

            const bossSelectPlaceholder = document.getElementById('bossSelectPlaceholder');
            const baseDefenseLabel = document.getElementById('baseDefenseLabel');
            const defenseCoefLabel = document.getElementById('defenseCoefLabel');
            const bossInfoTooltip = document.getElementById('bossInfoTooltip');
            const bossInfoInlineBadge = document.getElementById('bossInfoInlineBadge');
            const bossInfoInlineText = document.getElementById('bossInfoInlineText');
            if (bossInfoTooltip) bossInfoTooltip.setAttribute('data-tooltip', t.boss_info_tip);
            if (bossInfoInlineBadge) bossInfoInlineBadge.textContent = t.boss_info_inline_badge || '';
            if (bossInfoInlineText) bossInfoInlineText.textContent = t.boss_info_inline || '';
            if (bossSelectPlaceholder) bossSelectPlaceholder.textContent = t.boss_select;
            if (baseDefenseLabel) baseDefenseLabel.textContent = t.base_defense;
            if (defenseCoefLabel) defenseCoefLabel.textContent = t.defense_coef;
            
            // 바다/흉몽 탭 번역
            const bossTypeSea = document.getElementById('bossTypeSea');
            const bossTypeNightmare = document.getElementById('bossTypeNightmare');
            if (bossTypeSea) {
                const span = bossTypeSea.querySelector('span');
                if (span) span.textContent = t.boss_type_sea;
            }
            if (bossTypeNightmare) {
                const span = bossTypeNightmare.querySelector('span');
                if (span) span.textContent = t.boss_type_nightmare;
            }

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
                const statIcon = penetrateTitle.querySelector('.stat-icon');
                // 기존 텍스트 노드 제거
                Array.from(penetrateTitle.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                const text = document.createTextNode(t.penetrate_total + ' ');
                if (statIcon && statIcon.nextSibling) {
                    penetrateTitle.insertBefore(text, statIcon.nextSibling);
                } else if (statIcon) {
                    penetrateTitle.appendChild(text);
                } else {
                    penetrateTitle.insertBefore(text, penetrateTitle.firstChild);
                }
                if (icon && !penetrateTitle.contains(icon)) penetrateTitle.appendChild(icon);
            }
            const penetrateIcon = document.getElementById('penetrateTooltip');
            if (penetrateIcon) penetrateIcon.setAttribute('data-tooltip', t.penetrate_desc);

            const defenseReduceTitle = document.getElementById('defense-reduce-total-title');
            if (defenseReduceTitle) {
                const icon2 = defenseReduceTitle.querySelector('.tooltip-icon');
                const statIcon = defenseReduceTitle.querySelector('.stat-icon');
                // 기존 텍스트 노드 제거
                Array.from(defenseReduceTitle.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                const text = document.createTextNode(t.defense_reduce_total + ' ');
                if (statIcon && statIcon.nextSibling) {
                    defenseReduceTitle.insertBefore(text, statIcon.nextSibling);
                } else if (statIcon) {
                    defenseReduceTitle.appendChild(text);
                } else {
                    defenseReduceTitle.insertBefore(text, defenseReduceTitle.firstChild);
                }
                if (icon2 && !defenseReduceTitle.contains(icon2)) defenseReduceTitle.appendChild(icon2);
            }
            const defenseReduceIcon = document.getElementById('defenseReduceTooltip');
            if (defenseReduceIcon) defenseReduceIcon.setAttribute('data-tooltip', t.defense_reduce_desc);

            const pierceSumTargetLabel = document.getElementById('pierceSumTargetLabel');
            const reduceSumTargetLabel = document.getElementById('reduceSumTargetLabel');
            if (pierceSumTargetLabel) pierceSumTargetLabel.textContent = t.sum_target;
            if (reduceSumTargetLabel) reduceSumTargetLabel.textContent = t.sum_target;

            const finalCoefTitle = document.getElementById('defense-coef-title');
            if (finalCoefTitle) {
                const statIcon = finalCoefTitle.querySelector('.stat-icon');
                // 기존 텍스트 노드 제거
                Array.from(finalCoefTitle.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                const text = document.createTextNode(t.final_defense_coef_title);
                if (statIcon && statIcon.nextSibling) {
                    finalCoefTitle.insertBefore(text, statIcon.nextSibling);
                } else if (statIcon) {
                    finalCoefTitle.appendChild(text);
                } else {
                    finalCoefTitle.textContent = t.final_defense_coef_title;
                }
            }

            const finalDamageTitle = document.getElementById('final-damage-increase-title');
            const finalDamageTooltip = document.getElementById('finalDamageTooltip');
            const baseFinalDamageLabel = document.getElementById('baseFinalDamageLabel');
            const withDefReduceLabel = document.getElementById('withDefReduceLabel');
            if (finalDamageTitle) {
                const statIcon = finalDamageTitle.querySelector('.stat-icon');
                const tooltipIcon = finalDamageTitle.querySelector('.tooltip-icon');
                // 기존 텍스트 노드만 제거 (아이콘은 보존)
                Array.from(finalDamageTitle.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // stat-icon 다음에 텍스트 추가
                const text = document.createTextNode(t.final_damage_increase + ' ');
                if (statIcon) {
                    // stat-icon 바로 다음에 텍스트 삽입
                    if (statIcon.nextSibling) {
                        finalDamageTitle.insertBefore(text, statIcon.nextSibling);
                    } else {
                        finalDamageTitle.appendChild(text);
                    }
                } else {
                    finalDamageTitle.insertBefore(text, finalDamageTitle.firstChild);
                }
                // tooltip-icon이 이미 있으면 그대로 유지, 없으면 추가하지 않음 (HTML에 이미 있음)
            }
            if (finalDamageTooltip) finalDamageTooltip.setAttribute('data-tooltip', t.tooltip_formula);
            if (baseFinalDamageLabel) baseFinalDamageLabel.textContent = t.base_final_damage;
            if (withDefReduceLabel) withDefReduceLabel.textContent = t.with_def_reduce;
            
            // 새로 추가된 라벨들 번역
            const statLabels = root.querySelectorAll ? root.querySelectorAll('.stat-label') : document.querySelectorAll('.stat-label');
            statLabels.forEach(label => {
                const text = label.textContent.trim();
                if (text === '합계' || text === 'Sum' || text === '合計') {
                    label.textContent = t.stat_sum;
                } else if (text === '목표' || text === 'Target' || text === '目標') {
                    label.textContent = t.stat_target;
                } else if (text === '남은 수치' || text === 'Remaining' || text === '残り数値') {
                    label.textContent = t.stat_remaining;
                } else if (text === '최종 증가' || text === 'Final Increase' || text === '最終増加') {
                    label.textContent = t.stat_final_increase;
                } else if (text === '기존 대미지 배수' || text === 'Base Damage Mult.' || text === '基本ダメージ倍率') {
                    label.textContent = t.stat_base_damage_mult;
                } else if (text === '최종 대미지 배수' || text === 'Final Damage Mult.' || text === '最終ダメージ倍率') {
                    label.textContent = t.stat_final_damage_mult;
                } else if (text === '최종 방어 계수' || text === 'Final Defense Coef.' || text === '最終防御係数') {
                    label.textContent = t.stat_final_def_coef;
                } else if (text === '보스 방어 계수' || text === 'Boss Defense Coef.' || text === 'ボス防御係数') {
                    label.textContent = t.stat_boss_def_coef;
                } else if (text === '보스 기본 방어력' || text === 'Boss Base Defense' || text === 'ボス基本防御力') {
                    label.textContent = t.stat_boss_base_def;
                }
            });

            const tabPierce = document.querySelector('.tab-button[data-tab="penetrate"]');
            const tabDefense = document.querySelector('.tab-button[data-tab="defense"]');
            if (tabPierce) {
                const icon = tabPierce.querySelector('.tab-icon');
                // 기존 텍스트 노드 제거
                Array.from(tabPierce.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                if (icon) {
                    const text = document.createTextNode(t.tab_pierce);
                    if (icon.nextSibling) {
                        tabPierce.insertBefore(text, icon.nextSibling);
                    } else {
                        tabPierce.appendChild(text);
                    }
                } else {
                    tabPierce.textContent = t.tab_pierce;
                }
            }
            if (tabDefense) {
                const icon = tabDefense.querySelector('.tab-icon');
                // 기존 텍스트 노드 제거
                Array.from(tabDefense.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                if (icon) {
                    const text = document.createTextNode(t.tab_defense);
                    if (icon.nextSibling) {
                        tabDefense.insertBefore(text, icon.nextSibling);
                    } else {
                        tabDefense.appendChild(text);
                    }
                } else {
                    tabDefense.textContent = t.tab_defense;
                }
            }

            const revelationPenetrateLabel = document.getElementById('revelationPenetrateLabel');
            const revelationSumLabel = document.getElementById('revelationSumLabel');
            const explanationPowerLabel = document.getElementById('explanationPowerLabel');
            const otherReduceLabel = document.getElementById('otherReduceLabel');
            const windsweptText = document.getElementById('windsweptText');
            const windsweptTooltip = document.getElementById('windsweptTooltip');
            if (revelationPenetrateLabel) {
                const icon = revelationPenetrateLabel.querySelector('.input-label-icon');
                // 기존 텍스트 노드 제거
                Array.from(revelationPenetrateLabel.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                if (icon) {
                    const text = document.createTextNode(t.revelation_penetrate);
                    if (icon.nextSibling) {
                        revelationPenetrateLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        revelationPenetrateLabel.appendChild(text);
                    }
                } else {
                    revelationPenetrateLabel.textContent = t.revelation_penetrate;
                }
            }
            if (explanationPowerLabel) {
                let icon = explanationPowerLabel.querySelector('.input-label-icon');
                // 아이콘이 없으면 먼저 생성 (critical-calc용)
                if (!icon) {
                    const img = document.createElement('img');
                    const baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : (typeof window !== 'undefined' && window.SITE_BASEURL) ? window.SITE_BASEURL : '';
                    img.src = `${baseUrl}/assets/img/character-cards/직업_해명.png`;
                    img.alt = '해명';
                    img.className = 'input-label-icon';
                    explanationPowerLabel.insertBefore(img, explanationPowerLabel.firstChild);
                    icon = img;
                }
                // 기존 텍스트 노드 제거 (아이콘은 유지)
                Array.from(explanationPowerLabel.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 다음에 텍스트 추가
                if (icon) {
                    const text = document.createTextNode(t.explanation_power);
                    // 아이콘 다음에 텍스트 추가
                    if (icon.nextSibling) {
                        explanationPowerLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        explanationPowerLabel.appendChild(text);
                    }
                } else {
                    explanationPowerLabel.textContent = t.explanation_power;
                }
            }
            if (revelationSumLabel) {
                let icon = revelationSumLabel.querySelector('.input-label-icon');
                // 아이콘이 없으면 먼저 생성 (critical-calc용)
                if (!icon) {
                    const img = document.createElement('img');
                    const baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : (typeof window !== 'undefined' && window.SITE_BASEURL) ? window.SITE_BASEURL : '';
                    img.src = `${baseUrl}/assets/img/nav/qishi.png`;
                    img.alt = '계시';
                    img.className = 'input-label-icon';
                    revelationSumLabel.insertBefore(img, revelationSumLabel.firstChild);
                    icon = img;
                }
                // 기존 텍스트 노드 제거 (아이콘은 유지)
                Array.from(revelationSumLabel.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 다음에 텍스트 추가
                if (icon) {
                    const text = document.createTextNode(t.revelation_sum);
                    // 아이콘 다음에 텍스트 추가
                    if (icon.nextSibling) {
                        revelationSumLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        revelationSumLabel.appendChild(text);
                    }
                } else {
                    revelationSumLabel.textContent = t.revelation_sum;
                }
            }
            if (otherReduceLabel) {
                const icon = otherReduceLabel.querySelector('.input-label-icon');
                // 기존 텍스트 노드 제거
                Array.from(otherReduceLabel.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // 아이콘 뒤에 텍스트 추가
                const text = currentLang === 'kr' ? '기타 방어력 감소' : t.other_reduce;
                if (icon) {
                    const textNode = document.createTextNode(text);
                    if (icon.nextSibling) {
                        otherReduceLabel.insertBefore(textNode, icon.nextSibling);
                    } else {
                        otherReduceLabel.appendChild(textNode);
                    }
                } else {
                    otherReduceLabel.textContent = text;
                }
            }
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
        },

        // 타입 번역 (심상코어, 스킬, 의식 등)
        translateType(typeText){
            const currentLang = this.getLang();
            if (!typeText || currentLang === 'kr') return typeText;

            const typeMap = {
                en: {
                    '심상코어': 'Mindscape Core',
                    '스킬': 'Skill',
                    '패시브': 'Passive',
                    '하이라이트': 'Highlight',
                    '전용무기': 'Weapon',
                    '페르소나': 'Persona',
                    '의식1': 'A1',
                    '의식2': 'A2',
                    '의식3': 'A3',
                    '의식4': 'A4',
                    '의식5': 'A5',
                    '의식6': 'A6',
                    '총격': 'Gun',
                    '광역': 'AoE',
                    '단일': 'Single'
                },
                jp: {
                    '심상코어': 'イメジャリー・コア',
                    '스킬': 'スキル',
                    '패시브': 'パッシブ',
                    '하이라이트': 'ハイライト',
                    '전용무기': '専用武器',
                    '페르소나': 'ペルソナ',
                    '의식1': '意識1',
                    '의식2': '意識2',
                    '의식3': '意識3',
                    '의식4': '意識4',
                    '의식5': '意識5',
                    '의식6': '意識6',
                    '총격': '銃撃',
                    '광역': '広域',
                    '단일': '単体'
                }
            };

            const langMap = typeMap[currentLang];
            if (!langMap) return typeText;

            // 정확히 매칭되는 경우
            if (langMap[typeText]) return langMap[typeText];

            // 부분 매칭 (예: "심상코어" 포함된 경우)
            let result = typeText;
            Object.keys(langMap).forEach(kr => {
                if (result.includes(kr)) {
                    result = result.replace(new RegExp(kr, 'g'), langMap[kr]);
                }
            });
            return result;
        }
    };

    window.DefenseI18N = DefenseI18N;
})();
