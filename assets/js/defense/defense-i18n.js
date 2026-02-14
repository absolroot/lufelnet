(function(){
    'use strict';

    const DefenseI18N = {
        normalizeLang(rawLang){
            const lang = String(rawLang || '').trim().toLowerCase();
            if (lang === 'kr' || lang === 'ko') return 'kr';
            if (lang === 'en') return 'en';
            if (lang === 'jp' || lang === 'ja') return 'jp';
            // defense/critical 계산기는 현재 kr/en/jp 페이지만 제공되므로
            // 그 외 지원 언어는 영어로 폴백한다.
            if (lang === 'cn' || lang === 'tw' || lang === 'sea') return 'en';
            return 'kr';
        },

        getLang(){
            try {
                const urlLang = new URLSearchParams(window.location.search).get('lang');
                if (urlLang) return this.normalizeLang(urlLang);

                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang) return this.normalizeLang(savedLang);

                if (typeof getCurrentLanguage === 'function') {
                    return this.normalizeLang(getCurrentLanguage());
                }

                if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                    return this.normalizeLang(LanguageRouter.getCurrentLanguage());
                }

                if (I18NUtils && I18NUtils.getCurrentLanguageSafe) {
                    return this.normalizeLang(I18NUtils.getCurrentLanguageSafe());
                }
            } catch(_) {}
            return 'kr';
        },

        isCriticalCalcPage(){
            try {
                const path = String(window.location.pathname || '');
                return path.includes('/critical-calc') || path.includes('critical-calc');
            } catch(_) {
                return false;
            }
        },

        getPagePack(lang = this.getLang()){
            const criticalVarMap = {
                kr: 'I18N_PAGE_CRITICAL_CALC_KR',
                en: 'I18N_PAGE_CRITICAL_CALC_EN',
                jp: 'I18N_PAGE_CRITICAL_CALC_JP'
            };
            const defenseVarMap = {
                kr: 'I18N_PAGE_DEFENSE_CALC_KR',
                en: 'I18N_PAGE_DEFENSE_CALC_EN',
                jp: 'I18N_PAGE_DEFENSE_CALC_JP'
            };

            const normalizedLang = this.normalizeLang(lang);
            const primaryMap = this.isCriticalCalcPage() ? criticalVarMap : defenseVarMap;
            const secondaryMap = this.isCriticalCalcPage() ? defenseVarMap : criticalVarMap;

            return (
                window[primaryMap[normalizedLang]] ||
                window[primaryMap.kr] ||
                window[secondaryMap[normalizedLang]] ||
                window[secondaryMap.kr] ||
                {}
            );
        },

        getDefenseTexts(lang = this.getLang()){
            const pagePack = this.getPagePack(lang);
            const fallbackPack = this.getPagePack('kr');
            return pagePack.defenseI18n || fallbackPack.defenseI18n || {};
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
            const t = this.getDefenseTexts(currentLang);
            if (!t || typeof t !== 'object' || !t.nav_home) {
                // 번들 로딩 전에는 DOM에 undefined를 쓰지 않음
                try {
                    clearTimeout(this._i18nRetryTimer);
                    this._i18nRetryTimer = setTimeout(() => this.updateLanguageContent(root), 60);
                } catch(_) {}
                return;
            }
            const tx = (key, fallback = '') => {
                const v = t[key];
                return (typeof v === 'string' && v.length > 0) ? v : fallback;
            };

            const navHome = (root.querySelector && root.querySelector('.navigation-path #nav-home'))
                || (root.getElementById ? root.getElementById('nav-home') : document.getElementById('nav-home'));
            const navCurrent = (root.querySelector && root.querySelector('.navigation-path #nav-current'))
                || (root.getElementById ? root.getElementById('nav-current') : document.getElementById('nav-current'));
            const pageTitle = root.getElementById ? root.getElementById('page-title') : document.getElementById('page-title');
            if (navHome) navHome.textContent = tx('nav_home', '홈');
            if (navCurrent) navCurrent.textContent = tx('nav_current', '방어력 계산');
            // defense-calc 페이지에서만 page-title 업데이트 (critical-calc는 critical-calc.js에서 처리)
            if (pageTitle && (window.location.pathname.includes('/defense-calc') || window.location.pathname.includes('defense-calc'))) {
                pageTitle.textContent = tx('page_title', '방어력 감소 계산기');
            }

            const bossSelectPlaceholder = document.getElementById('bossSelectPlaceholder');
            const baseDefenseLabel = document.getElementById('baseDefenseLabel');
            const defenseCoefLabel = document.getElementById('defenseCoefLabel');
            const bossInfoTooltip = document.getElementById('bossInfoTooltip');
            const bossInfoInlineBadge = document.getElementById('bossInfoInlineBadge');
            const bossInfoInlineText = document.getElementById('bossInfoInlineText');
            if (bossInfoTooltip) bossInfoTooltip.setAttribute('data-tooltip', tx('boss_info_tip'));
            if (bossInfoInlineBadge) bossInfoInlineBadge.textContent = tx('boss_info_inline_badge');
            if (bossInfoInlineText) bossInfoInlineText.textContent = tx('boss_info_inline');
            if (bossSelectPlaceholder) bossSelectPlaceholder.textContent = tx('boss_select', '보스 선택');
            if (baseDefenseLabel) baseDefenseLabel.textContent = tx('base_defense', '· 기본 방어력:');
            if (defenseCoefLabel) defenseCoefLabel.textContent = tx('defense_coef', '· 보스 방어 계수:');
            
            // 바다/흉몽 탭 번역
            const bossTypeSea = document.getElementById('bossTypeSea');
            const bossTypeNightmare = document.getElementById('bossTypeNightmare');
            if (bossTypeSea) {
                const span = bossTypeSea.querySelector('span');
                if (span) span.textContent = tx('boss_type_sea', '바다');
            }
            if (bossTypeNightmare) {
                const span = bossTypeNightmare.querySelector('span');
                if (span) span.textContent = tx('boss_type_nightmare', '흉몽');
            }

            const showSpoilerLabel = document.getElementById('showSpoilerLabel');
            const spoilerWrap = document.getElementById('spoilerToggleWrap');
            if (spoilerWrap) {
                spoilerWrap.style.display = (currentLang === 'kr') ? 'none' : '';
            }
            if (showSpoilerLabel) {
                showSpoilerLabel.textContent = tx('show_spoiler', 'Show Spoilers');
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
                const text = document.createTextNode(`${tx('penetrate_total', '관통')} `);
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
            if (penetrateIcon) penetrateIcon.setAttribute('data-tooltip', tx('penetrate_desc'));

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
                const text = document.createTextNode(`${tx('defense_reduce_total', '방어력 감소')} `);
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
            if (defenseReduceIcon) defenseReduceIcon.setAttribute('data-tooltip', tx('defense_reduce_desc'));

            const pierceSumTargetLabel = document.getElementById('pierceSumTargetLabel');
            const reduceSumTargetLabel = document.getElementById('reduceSumTargetLabel');
            if (pierceSumTargetLabel) pierceSumTargetLabel.textContent = tx('sum_target', '합계 / 목표');
            if (reduceSumTargetLabel) reduceSumTargetLabel.textContent = tx('sum_target', '합계 / 목표');

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
                const text = document.createTextNode(tx('final_defense_coef_title', '방어력 수치'));
                if (statIcon && statIcon.nextSibling) {
                    finalCoefTitle.insertBefore(text, statIcon.nextSibling);
                } else if (statIcon) {
                    finalCoefTitle.appendChild(text);
                } else {
                    finalCoefTitle.textContent = tx('final_defense_coef_title', '방어력 수치');
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
                const text = document.createTextNode(`${tx('final_damage_increase', '최종 대미지')} `);
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
            if (finalDamageTooltip) finalDamageTooltip.setAttribute('data-tooltip', tx('tooltip_formula'));
            if (baseFinalDamageLabel) baseFinalDamageLabel.textContent = tx('base_final_damage');
            if (withDefReduceLabel) withDefReduceLabel.textContent = tx('with_def_reduce');
            
            // 새로 추가된 라벨들 번역
            const statLabels = root.querySelectorAll ? root.querySelectorAll('.stat-label') : document.querySelectorAll('.stat-label');
            statLabels.forEach(label => {
                const text = label.textContent.trim();
                if (text === '합계' || text === 'Sum' || text === '合計') {
                    label.textContent = tx('stat_sum', '합계');
                } else if (text === '목표' || text === 'Target' || text === '目標') {
                    label.textContent = tx('stat_target', '목표');
                } else if (text === '남은 수치' || text === 'Remaining' || text === '残り数値') {
                    label.textContent = tx('stat_remaining', '남은 수치');
                } else if (text === '최종 증가' || text === 'Final Increase' || text === '最終増加') {
                    label.textContent = tx('stat_final_increase', '최종 증가');
                } else if (text === '기존 대미지 배수' || text === 'Base Damage Mult.' || text === '基本ダメージ倍率') {
                    label.textContent = tx('stat_base_damage_mult', '기존 대미지 배수');
                } else if (text === '최종 대미지 배수' || text === 'Final Damage Mult.' || text === '最終ダメージ倍率') {
                    label.textContent = tx('stat_final_damage_mult', '최종 대미지 배수');
                } else if (text === '최종 방어 계수' || text === 'Final Defense Coef.' || text === '最終防御係数') {
                    label.textContent = tx('stat_final_def_coef', '최종 방어 계수');
                } else if (text === '보스 방어 계수' || text === 'Boss Defense Coef.' || text === 'ボス防御係数') {
                    label.textContent = tx('stat_boss_def_coef', '보스 방어 계수');
                } else if (text === '보스 기본 방어력' || text === 'Boss Base Defense' || text === 'ボス基本防御力') {
                    label.textContent = tx('stat_boss_base_def', '보스 기본 방어력');
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
                    const text = document.createTextNode(tx('tab_pierce', '관통'));
                    if (icon.nextSibling) {
                        tabPierce.insertBefore(text, icon.nextSibling);
                    } else {
                        tabPierce.appendChild(text);
                    }
                } else {
                    tabPierce.textContent = tx('tab_pierce', '관통');
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
                    const text = document.createTextNode(tx('tab_defense', '방어력 감소'));
                    if (icon.nextSibling) {
                        tabDefense.insertBefore(text, icon.nextSibling);
                    } else {
                        tabDefense.appendChild(text);
                    }
                } else {
                    tabDefense.textContent = tx('tab_defense', '방어력 감소');
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
                    const text = document.createTextNode(tx('revelation_penetrate', '계시 관통 합계'));
                    if (icon.nextSibling) {
                        revelationPenetrateLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        revelationPenetrateLabel.appendChild(text);
                    }
                } else {
                    revelationPenetrateLabel.textContent = tx('revelation_penetrate', '계시 관통 합계');
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
                    const text = document.createTextNode(tx('explanation_power', '해명의 힘'));
                    // 아이콘 다음에 텍스트 추가
                    if (icon.nextSibling) {
                        explanationPowerLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        explanationPowerLabel.appendChild(text);
                    }
                } else {
                    explanationPowerLabel.textContent = tx('explanation_power', '해명의 힘');
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
                    const text = document.createTextNode(tx('revelation_sum', '계시 합계'));
                    // 아이콘 다음에 텍스트 추가
                    if (icon.nextSibling) {
                        revelationSumLabel.insertBefore(text, icon.nextSibling);
                    } else {
                        revelationSumLabel.appendChild(text);
                    }
                } else {
                    revelationSumLabel.textContent = tx('revelation_sum', '계시 합계');
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
                const text = tx('other_reduce', '기타 방어력 감소');
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
            if (windsweptText && tx('windswept')) windsweptText.textContent = tx('windswept');
            if (windsweptTooltip && tx('windswept_tip')) windsweptTooltip.setAttribute('data-tooltip', tx('windswept_tip'));

            this.setTextAll('.check-column', tx('th_select', '선택'));
            this.setTextAll('.char-img-column', tx('th_thief', '괴도'));
            this.setTextAll('.type-column', tx('th_type', '분류'));
            this.setTextAll('.target-column', tx('th_target', '목표'));
            this.setTextAll('.skill-name-column', tx('th_name', '이름'));
            this.setTextAll('.option-column', tx('th_option', '옵션'));
            this.setTextAll('.value-column', tx('th_value', '수치'));
            this.setTextAll('.duration-column', tx('th_duration', '지속'));
            this.setTextAll('.note-column', tx('th_note', '비고'));

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

        translateGroupName(groupName){
            const currentLang = this.getLang();
            if (!groupName || currentLang === 'kr') return groupName;

            const pagePack = this.getPagePack(currentLang);
            const groupMap = pagePack.defenseGroupNames || {};
            if (!groupMap || typeof groupMap !== 'object') return groupName;

            if (groupName === '원더') return groupMap.wonder || groupName;
            if (groupName === '계시') return groupMap.revelation || groupName;
            if (groupName === '공통') return groupMap.common || groupName;
            return groupName;
        },

        // 타입 번역 (심상코어, 스킬, 의식 등)
        translateType(typeText){
            const currentLang = this.getLang();
            if (!typeText || currentLang === 'kr') return typeText;

            const pagePack = this.getPagePack(currentLang);
            const langMap = pagePack.defenseTypeMap || {};
            if (!langMap || typeof langMap !== 'object') return typeText;

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
