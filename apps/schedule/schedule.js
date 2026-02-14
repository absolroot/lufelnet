/**
 * P5X Release Schedule Renderer
 * Renders the character release timeline
 * 
 * - manualReleases + autoGenerateCharacters 이후,
 * - characterData의 release_order 기반으로 나머지 캐릭터 자동 추가
 */

(function () {
    'use strict';

    const BASE_URL = window.BASE_URL || '';
    const data = window.ReleaseScheduleData;

    /**
     * Helper function: Add days to a date string (YYYY-MM-DD format)
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @param {number} days - Number of days to add
     * @returns {string} New date string in YYYY-MM-DD format
     */
    function addDaysToDateString(dateStr, days) {
        if (!dateStr) return dateStr;
        const parts = dateStr.split('-');
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        date.setDate(date.getDate() + days);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Apply or remove SEA server delay to ReleaseScheduleData
     * @param {boolean} isSea - If true, apply +7 days shift; if false, restore original
     */
    function applyServerDelayToData(isSea) {
        if (!window.ReleaseScheduleData) return;

        // Backup original data on first run
        if (!window.ReleaseScheduleData_Original) {
            window.ReleaseScheduleData_Original = JSON.parse(JSON.stringify(window.ReleaseScheduleData));
        }

        // Always restore from original first
        window.ReleaseScheduleData = JSON.parse(JSON.stringify(window.ReleaseScheduleData_Original));

        // If SEA mode, shift all dates by +7 days
        if (isSea) {
            const shiftDays = 8;

            // Shift manualReleases dates
            if (window.ReleaseScheduleData.manualReleases) {
                window.ReleaseScheduleData.manualReleases.forEach(release => {
                    if (release.date) {
                        release.date = addDaysToDateString(release.date, shiftDays);
                    }
                });
            }

            // Shift anniversaryEvents dates
            if (window.ReleaseScheduleData.anniversaryEvents) {
                window.ReleaseScheduleData.anniversaryEvents.forEach(event => {
                    if (event.date) {
                        event.date = addDaysToDateString(event.date, shiftDays);
                    }
                });
            }

            // Note: autoGenerateCharacters don't have dates - they're calculated from manualReleases
            // So we don't need to shift them directly
        }
    }

    //const BASE_URL = window.BASE_URL || '';
    // const data = window.ReleaseScheduleData;

    // Wait for character data to load
    function waitForCharacterData() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.characterData && Object.keys(window.characterData).length > 0) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    // Use global getCurrentLang() and t() functions from i18n service

    // Persona CSV translation cache
    let personaCsvMap = null;
    let personaCsvLoading = null;

    // Weapons data cache
    let weaponsData = null;
    let weaponsLoading = null;

    // Revelation data cache
    let revelationDataCache = null;
    let revelationDataLoading = null;

    // Load revelation data for translation
    // Always load Korean data first for mapping, then current language data
    async function loadRevelationData() {
        if (revelationDataCache) return revelationDataCache;
        if (revelationDataLoading) return revelationDataLoading;

        revelationDataLoading = new Promise((resolve) => {
            // Get language from URL directly (don't use getCurrentLang to avoid dependency)
            const urlParams = new URLSearchParams(window.location.search);
            const lang = urlParams.get('lang') || 'en';

            // Always load Korean data first for mapping
            let krDataLoaded = false;
            let currentLangDataLoaded = false;
            const loadedData = {};

            const loadScript = (src, isKorean) => {
                return new Promise((res) => {
                    // Check if already loaded
                    if (isKorean && typeof revelationData !== 'undefined' && revelationData) {
                        loadedData.kr = revelationData;
                        krDataLoaded = true;
                        res();
                        return;
                    } else if (!isKorean && lang === 'en' && typeof enRevelationData !== 'undefined' && enRevelationData) {
                        loadedData.current = enRevelationData;
                        // Set window.enRevelationData for tooltip access
                        window.enRevelationData = enRevelationData;
                        currentLangDataLoaded = true;
                        res();
                        return;
                    } else if (!isKorean && lang === 'jp' && typeof jpRevelationData !== 'undefined' && jpRevelationData) {
                        loadedData.current = jpRevelationData;
                        // Set window.jpRevelationData for tooltip access
                        window.jpRevelationData = jpRevelationData;
                        currentLangDataLoaded = true;
                        res();
                        return;
                    } else if (!isKorean && lang === 'kr') {
                        // Korean is already loaded
                        currentLangDataLoaded = true;
                        res();
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = `${BASE_URL}${src}`;
                    script.onload = () => {
                        setTimeout(() => {
                            if (isKorean && typeof revelationData !== 'undefined') {
                                loadedData.kr = revelationData;
                            } else if (!isKorean && lang === 'en' && typeof enRevelationData !== 'undefined') {
                                loadedData.current = enRevelationData;
                                // Set window.enRevelationData for tooltip access
                                window.enRevelationData = enRevelationData;
                            } else if (!isKorean && lang === 'jp' && typeof jpRevelationData !== 'undefined') {
                                loadedData.current = jpRevelationData;
                                // Set window.jpRevelationData for tooltip access
                                window.jpRevelationData = jpRevelationData;
                            }
                            res();
                        }, 100);
                    };
                    script.onerror = () => res();
                    document.head.appendChild(script);
                });
            };

            // Load Korean data first (for mapping)
            loadScript('/data/kr/revelations/revelations.js', true).then(() => {
                // Then load current language data if not Korean
                if (lang === 'kr') {
                    revelationDataCache = loadedData.kr || {};
                    resolve(revelationDataCache);
                } else {
                    loadScript(`/data/${lang}/revelations/revelations.js`, false).then(() => {
                        // Use current language data for translation
                        // Current language data has mainTranslated and subTranslated
                        revelationDataCache = loadedData.current || {};

                        // Also set window.enRevelationData or window.jpRevelationData for tooltip access
                        if (lang === 'en' && loadedData.current) {
                            window.enRevelationData = loadedData.current;
                        } else if (lang === 'jp' && loadedData.current) {
                            window.jpRevelationData = loadedData.current;
                        }

                        resolve(revelationDataCache);
                    });
                }
            });
        });

        return revelationDataLoading;
    }

    // Get localized revelation name
    // revelationName is always in Korean (from data.js)
    function getLocalizedRevelationName(revelationName) {
        const lang = getCurrentLang();

        // If Korean, return as is
        if (lang === 'kr') {
            return revelationName;
        }

        // Get translated data from cache
        if (!revelationDataCache) {
            return revelationName;
        }

        // Try to find in mainTranslated or subTranslated
        if (lang === 'en') {
            if (revelationDataCache.mainTranslated && revelationDataCache.mainTranslated[revelationName]) {
                return revelationDataCache.mainTranslated[revelationName];
            }
            if (revelationDataCache.subTranslated && revelationDataCache.subTranslated[revelationName]) {
                return revelationDataCache.subTranslated[revelationName];
            }
            // Fallback to mapping_en
            if (revelationDataCache.mapping_en && revelationDataCache.mapping_en[revelationName]) {
                return revelationDataCache.mapping_en[revelationName];
            }
        } else if (lang === 'jp') {
            if (revelationDataCache.mainTranslated && revelationDataCache.mainTranslated[revelationName]) {
                return revelationDataCache.mainTranslated[revelationName];
            }
            if (revelationDataCache.subTranslated && revelationDataCache.subTranslated[revelationName]) {
                return revelationDataCache.subTranslated[revelationName];
            }
            // Fallback to mapping_jp
            if (revelationDataCache.mapping_jp && revelationDataCache.mapping_jp[revelationName]) {
                return revelationDataCache.mapping_jp[revelationName];
            }
        }

        // If not found, return as is
        return revelationName;
    }

    // Get Korean revelation name for image path
    // revelationName is always in Korean (from data.js), so just return it
    function getKoreanRevelationName(revelationName) {
        // data.js의 revelation은 항상 한국어 이름이므로 그대로 반환
        return revelationName;
    }

    // Get revelation tooltip data
    function getRevelationTooltipData(revelationName) {
        const lang = getCurrentLang();
        const koreanName = getKoreanRevelationName(revelationName);

        // Check if it's main or sub revelation
        let krData = null;
        if (revelationDataCache) {
            if (typeof revelationData !== 'undefined' && revelationData) {
                krData = revelationData;
            } else if (revelationDataCache.main || revelationDataCache.sub) {
                krData = revelationDataCache;
            }
        }

        const isMain = krData && krData.main && krData.main.hasOwnProperty(koreanName);
        const isSub = krData && krData.sub && krData.sub.hasOwnProperty(koreanName);

        if (isSub) {
            // Sub revelation: show set2 and set4 effects
            const currentLang = lang;
            let effectData, set2Text, set4Text, setTypes;

            let translationData = null;
            if (currentLang === 'en' && window.enRevelationData) {
                translationData = window.enRevelationData;
            } else if (currentLang === 'jp' && window.jpRevelationData) {
                translationData = window.jpRevelationData;
            }

            if (currentLang === 'en' && translationData && translationData.sub_effects) {
                const englishKey = getLocalizedRevelationName(koreanName);
                if (translationData.sub_effects[englishKey]) {
                    effectData = translationData.sub_effects[englishKey];
                    set2Text = effectData.set2;
                    set4Text = effectData.set4;
                    setTypes = effectData.type;
                }
            } else if (currentLang === 'jp' && translationData && translationData.sub_effects) {
                const japaneseKey = getLocalizedRevelationName(koreanName);
                if (translationData.sub_effects[japaneseKey]) {
                    effectData = translationData.sub_effects[japaneseKey];
                    set2Text = effectData.set2;
                    set4Text = effectData.set4;
                    setTypes = effectData.type;
                }
            } else if (currentLang === 'kr' && typeof revelationData !== 'undefined' && revelationData.sub_effects && revelationData.sub_effects[koreanName]) {
                effectData = revelationData.sub_effects[koreanName];
                set2Text = effectData.set2;
                set4Text = effectData.set4;
                setTypes = effectData.type;
            }

            if (effectData) {
                const translatedTitle = getLocalizedRevelationName(koreanName);
                const set2Label = t('revelationSet2');
                const set4Label = t('revelationSet4');
                let tooltipText = `[${translatedTitle}]\n${set2Label}: ${set2Text}\n${set4Label}: ${set4Text}`;

                if (setTypes && setTypes.includes('미출시')) {
                    const notReleasedText = t('revelationNotReleased');
                    if (notReleasedText) {
                        tooltipText += `\n\n${notReleasedText}`;
                    }
                }

                return tooltipText.replace(/"/g, '&quot;');
            }
        } else if (isMain) {
            // Main revelation: show set effects (simplified - show all combinations)
            const currentLang = lang;
            let setEffectsData;

            let translationData = null;
            if (currentLang === 'en' && window.enRevelationData) {
                translationData = window.enRevelationData;
            } else if (currentLang === 'jp' && window.jpRevelationData) {
                translationData = window.jpRevelationData;
            }

            if (currentLang === 'en' && translationData && translationData.set_effects) {
                const englishMainKey = getLocalizedRevelationName(koreanName);
                if (translationData.set_effects[englishMainKey]) {
                    setEffectsData = translationData.set_effects[englishMainKey];
                }
            } else if (currentLang === 'jp' && translationData && translationData.set_effects) {
                const japaneseMainKey = getLocalizedRevelationName(koreanName);
                if (translationData.set_effects[japaneseMainKey]) {
                    setEffectsData = translationData.set_effects[japaneseMainKey];
                }
            } else if (currentLang === 'kr' && typeof revelationData !== 'undefined' && revelationData.set_effects && revelationData.set_effects[koreanName]) {
                setEffectsData = revelationData.set_effects[koreanName];
            }

            if (setEffectsData) {
                const mainTitle = getLocalizedRevelationName(koreanName);
                const allEffectsText = Object.entries(setEffectsData)
                    .filter(([key]) => key !== 'type')
                    .map(([subRevKey, effect]) => {
                        let subTitle;
                        if (currentLang === 'en' && translationData) {
                            subTitle = subRevKey;
                        } else if (currentLang === 'jp' && translationData) {
                            subTitle = subRevKey;
                        } else {
                            subTitle = getLocalizedRevelationName(subRevKey);
                        }
                        if (subTitle === 'type') {
                            return t('revelationNotReleased');
                        }
                        return `[${mainTitle} - ${subTitle}]\n${effect}`;
                    })
                    .join('\n\n');

                if (allEffectsText) {
                    return allEffectsText.replace(/"/g, '&quot;');
                }
            }
        }

        return null;
    }

    // Weapon Effect Modal Functions
    function showWeaponEffect(weaponId, imageUrl, weaponName, hasStamp = false) {
        const modal = document.getElementById('weapon-effect-modal');
        if (!modal) return;

        const modalImage = document.getElementById('weapon-effect-image');
        const modalTitle = document.getElementById('weapon-effect-title');
        const modalDescription = document.getElementById('weapon-effect-description');

        // Set the weapon image and name
        if (modalImage) modalImage.src = imageUrl;
        if (modalTitle) {
            modalTitle.textContent = weaponName;
        }

        // Get the effect text based on current language
        let effectText = t('weaponEffectNoInfo');
        const lang = getCurrentLang();

        if (weaponsData && weaponsData[weaponId]) {
            const weapon = weaponsData[weaponId];
            if (lang === 'en' && weapon.effect_en) {
                effectText = weapon.effect_en;
            } else if (lang === 'jp' && weapon.effect_jp) {
                effectText = weapon.effect_jp;
            } else if (weapon.effect) {
                effectText = weapon.effect; // Default to Korean
            }
        }

        // Check for lightning_stamp data
        if (weaponsData && weaponsData[weaponId] && weaponsData[weaponId].lightning_stamp && Array.isArray(weaponsData[weaponId].lightning_stamp) && weaponsData[weaponId].lightning_stamp.length > 0) {
            const stampData = weaponsData[weaponId].lightning_stamp[0]; // Use first stamp
            let stampEffectText = '';

            if (lang === 'en' && stampData.effect_en) {
                stampEffectText = stampData.effect_en;
            } else if (lang === 'jp' && stampData.effect_jp) {
                stampEffectText = stampData.effect_jp;
            } else if (stampData.effect) {
                stampEffectText = stampData.effect;
            }

            if (stampEffectText) {
                const stampName = lang === 'en' ? stampData.name_en : (lang === 'jp' ? stampData.name_jp : stampData.name);
                const stampLabel = t('labelLightningStamp');
                const stampIcon = hasStamp ? ` <img class="weapon-modal-stamp-icon" src="${BASE_URL}/assets/img/wonder-weapon/lightning_stamp.png" alt="${stampLabel}" title="${stampLabel}" style="width: 16px; vertical-align: middle; margin-left: 4px;">` : '';
                effectText += `\n\n-\n[${stampName}]${stampIcon}\n${stampEffectText}`;
            }
        }

        // Set the effect text with proper line breaks
        if (modalDescription) {
            modalDescription.innerHTML = effectText.replace(/\n/g, '<br>');

            // Add Detail link
            const br = document.createElement('br');
            modalDescription.appendChild(br);

            const detailLink = document.createElement('a');
            detailLink.href = `${BASE_URL}/wonder-weapon/`;
            detailLink.textContent = 'Detail →';
            detailLink.target = '_blank';
            modalDescription.appendChild(detailLink);
        }

        // Show the modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeWeaponEffectModal() {
        const modal = document.getElementById('weapon-effect-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Load weapons.js for translation
    async function loadWeaponsData() {
        if (weaponsData) return weaponsData;
        if (weaponsLoading) return weaponsLoading;

        weaponsLoading = new Promise((resolve) => {
            // Check if matchWeapons is already loaded
            if (typeof matchWeapons !== 'undefined' && matchWeapons) {
                weaponsData = matchWeapons;
                resolve(matchWeapons);
                return;
            }

            // Load weapons.js script
            const script = document.createElement('script');
            script.src = `${BASE_URL}/data/kr/wonder/weapons.js`;
            script.onload = () => {
                if (typeof matchWeapons !== 'undefined' && matchWeapons) {
                    weaponsData = matchWeapons;
                } else {
                    weaponsData = {};
                }
                resolve(weaponsData);
            };
            script.onerror = () => {
                weaponsData = {};
                resolve(weaponsData);
            };
            document.head.appendChild(script);
        });

        return weaponsLoading;
    }

    // Get localized weapon name
    function getLocalizedWeaponName(weaponName) {
        const lang = getCurrentLang();
        if (!weaponsData || !weaponsData[weaponName]) {
            return weaponName;
        }

        const weapon = weaponsData[weaponName];
        if (lang === 'en' && weapon.name_en) return weapon.name_en;
        if (lang === 'jp' && weapon.name_jp) return weapon.name_jp;
        return weaponName;
    }

    // Load persona CSV for translation
    async function loadPersonaCsv() {
        if (personaCsvMap) return personaCsvMap;
        if (personaCsvLoading) return personaCsvLoading;

        const ver = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1');
        const url = `${BASE_URL}/data/kr/wonder/persona_skill_from.csv?v=${ver}`;

        personaCsvLoading = fetch(url)
            .then(res => res.ok ? res.text() : '')
            .then(text => {
                if (!text) return {};
                const lines = text.split(/\r?\n/).filter(l => l.trim().length);
                if (lines.length < 2) return {};

                const map = {};
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',').map(s => s.trim());
                    if (cols.length < 3) continue;
                    const kr = cols[0] || '';
                    const en = cols[1] || '';
                    const jp = cols[2] || '';
                    const rank = cols[3] || '';
                    if (!kr) continue;

                    // combination1, combination2, combination3 (인덱스 8, 9, 10)
                    const combination1 = cols[8] || '';
                    const combination2 = cols[9] || '';
                    const combination3 = cols[10] || '';

                    map[kr] = {
                        kr,
                        en,
                        jp,
                        rank,
                        combination1,
                        combination2,
                        combination3
                    };
                }
                personaCsvMap = map;
                return map;
            })
            .catch(() => {
                personaCsvMap = {};
                return {};
            });

        return personaCsvLoading;
    }

    // Get localized persona name from CSV
    function getLocalizedPersonaName(personaName) {
        const lang = getCurrentLang();

        // Try CSV first
        if (personaCsvMap && personaCsvMap[personaName]) {
            const names = personaCsvMap[personaName];
            if (lang === 'en' && names.en) return names.en;
            if (lang === 'jp' && names.jp) return names.jp;
            return names.kr || personaName;
        }

        // Fallback to personaFiles/personaData
        const store = (typeof window !== 'undefined' && window.personaFiles && Object.keys(window.personaFiles).length)
            ? window.personaFiles
            : (typeof personaData !== 'undefined' ? personaData : (window.persona && window.persona.personaData) || {});
        if (!store || !store[personaName]) {
            return personaName;
        }

        const p = store[personaName];
        if (lang === 'en' && p.name_en) {
            return p.name_en;
        } else if (lang === 'jp' && p.name_jp) {
            return p.name_jp;
        }
        return personaName;
    }

    // Parse date string to Date object
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    // Format date for display
    function formatDate(dateStr) {
        const date = parseDate(dateStr);
        const lang = getCurrentLang();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        if (lang === 'jp') {
            return date.toLocaleDateString('ja-JP', options);
        } else if (lang === 'kr') {
            return date.toLocaleDateString('ko-KR', options);
        }
        return date.toLocaleDateString('en-US', options);
    }

    // Format Date object to string (YYYY-MM-DD)
    function formatDateStr(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Get release status based on date
    function getStatus(dateStr) {
        const releaseDate = parseDate(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = releaseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < -14) return 'released';
        if (diffDays <= 0) return 'current';
        if (diffDays <= 21) return 'upcoming';
        return 'future';
    }

    // Get days difference text
    function getDaysText(dateStr) {
        const releaseDate = parseDate(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = releaseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t('today');
        if (diffDays > 0) return `${diffDays} ${t('daysLeft')}`;
        return `${Math.abs(diffDays)} ${t('daysAgo')}`;
    }

    // Get remaining characters by release_order (only characters after the last autoGenerate character)
    function getRemainingCharactersByOrder(alreadyScheduled, minReleaseOrder) {
        const charData = window.characterData || {};
        const excludeList = new Set([...alreadyScheduled, "원더", "J&C"]); // 원더, J&C 제외

        // Get characters with release_order > minReleaseOrder (after the last scheduled one)
        const chars = Object.entries(charData)
            .filter(([name, info]) => {
                return info.release_order > minReleaseOrder && !excludeList.has(name);
            })
            .sort((a, b) => a[1].release_order - b[1].release_order)
            .map(([name]) => name);

        return chars;
    }

    // Generate full release schedule
    function generateFullSchedule() {
        const releases = [...window.ReleaseScheduleData.manualReleases];
        const charData = window.characterData || {};

        // Collect already scheduled characters
        const alreadyScheduled = new Set();
        releases.forEach(r => r.characters.forEach(c => alreadyScheduled.add(c)));

        // Get last release for date calculation
        let lastRelease = releases[releases.length - 1];

        // Calculate next update date
        let lastDate = parseDate(lastRelease.date);
        let interval = lastRelease.days ?? data.intervalRules.beforeV4
        lastDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);

        // Track the maximum release_order from autoGenerateCharacters
        let maxReleaseOrder = 0;

        // 1. First add autoGenerateCharacters (user-defined order)
        if (window.ReleaseScheduleData.autoGenerateCharacters && window.ReleaseScheduleData.autoGenerateCharacters.length > 0) {
            window.ReleaseScheduleData.autoGenerateCharacters.forEach((item) => {
                releases.push({
                    version: item.version,
                    date: formatDateStr(lastDate),
                    characters: item.characters,
                    note: item.note,
                    'main-story': item['main-story'],
                    summer: item.summer,
                    persona: item.persona,
                    weapon: item.weapon,
                    weapon_stamp: item.weapon_stamp,
                    goldTicketUnlocks: item.goldTicketUnlocks,
                    revelation: item.revelation,
                    mindscape_core: item.mindscape_core,
                    autoGenerated: true
                });

                // Calculate next date after pushing
                interval = item.days ?? data.intervalRules.beforeV4;
                lastDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);

                // Add to already scheduled and track max release_order
                item.characters.forEach(c => {
                    alreadyScheduled.add(c);
                    const charInfo = charData[c];
                    if (charInfo && charInfo.release_order > maxReleaseOrder) {
                        maxReleaseOrder = charInfo.release_order;
                    }
                });
            });
        }

        // 2. Then auto-add remaining characters by release_order (only those AFTER autoGenerateCharacters)
        const remainingChars = getRemainingCharactersByOrder(alreadyScheduled, maxReleaseOrder);

        if (remainingChars.length > 0) {
            // After autoGenerateCharacters, we're in 3-week interval mode
            interval = data.intervalRules.afterV4;

            remainingChars.forEach((charName) => {
                // Calculate next date
                lastDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000);

                releases.push({
                    // 버전 정보 없이 날짜만 자동 생성
                    version: '?',
                    date: formatDateStr(lastDate),
                    characters: [charName],
                    autoGenerated: true
                });
            });
        }

        // 3. Auto-add Gold Ticket Unlocks for 5-star non-limited characters
        // 5성 limit: false 캐릭터는 출시 6개월 후 Gold Ticket Unlock
        // 단, release_order 0 또는 1인 캐릭터는 예외
        const GOLD_TICKET_DELAY_DAYS = 180; // 6개월 (약 180일)

        // 이미 메뉴얼로 작성된 goldTicketUnlocks가 있는 release와 codename 추적
        const manualGoldTicketReleases = new Set();
        const manualGoldTicketCodenames = new Set();
        releases.forEach((r) => {
            if (r.goldTicketUnlocks && Array.isArray(r.goldTicketUnlocks) && r.goldTicketUnlocks.length > 0) {
                // 메뉴얼로 작성된 것으로 간주 (data.js에서 직접 추가된 경우)
                manualGoldTicketReleases.add(r);
                // 메뉴얼로 작성된 codename들도 추적
                r.goldTicketUnlocks.forEach(codename => {
                    manualGoldTicketCodenames.add(codename);
                });
            }
        });

        // 각 release의 characters를 순회하며 5성 limit: false 캐릭터 찾기
        releases.forEach((release) => {
            release.characters.forEach((charName) => {
                const charInfo = charData[charName];
                if (!charInfo) return;

                // 5성이고 limit: false이고 release_order가 0 또는 1이 아닌 경우만
                if (charInfo.rarity === 5 && charInfo.limit === false && charInfo.release_order !== 1 && charInfo.release_order !== 0) {
                    const codename = charInfo.codename || charName;

                    // 이미 메뉴얼로 작성된 codename은 건너뛰기
                    if (manualGoldTicketCodenames.has(codename)) return;

                    const releaseDate = parseDate(release.date);
                    const unlockDate = new Date(releaseDate);
                    unlockDate.setDate(unlockDate.getDate() + GOLD_TICKET_DELAY_DAYS);

                    // unlockDate에 가장 가까운 release 찾기
                    let closestRelease = null;
                    let minDiff = Infinity;

                    releases.forEach((r) => {
                        // 메뉴얼로 작성된 release는 건너뛰기
                        if (manualGoldTicketReleases.has(r)) return;

                        const rDate = parseDate(r.date);
                        const diff = Math.abs(rDate.getTime() - unlockDate.getTime());
                        if (diff < minDiff && rDate >= releaseDate) {
                            minDiff = diff;
                            closestRelease = r;
                        }
                    });

                    if (closestRelease && closestRelease !== release) {
                        // goldTicketUnlocks 배열 초기화
                        if (!closestRelease.goldTicketUnlocks) {
                            closestRelease.goldTicketUnlocks = [];
                        }

                        // 중복 체크 및 메뉴얼 작성 여부 재확인
                        if (!closestRelease.goldTicketUnlocks.includes(codename) && !manualGoldTicketCodenames.has(codename)) {
                            closestRelease.goldTicketUnlocks.push(codename);
                            // 자동 추가된 것임을 표시
                            if (!closestRelease.goldTicketUnlocksAuto) {
                                closestRelease.goldTicketUnlocksAuto = [];
                            }
                            closestRelease.goldTicketUnlocksAuto.push(codename);
                        }
                    }
                }
            });
        });

        return releases;
    }

    // Get character display name based on language
    function getCharacterName(charName) {
        const charData = window.characterData?.[charName];
        if (!charData) return charName;

        const lang = getCurrentLang();
        if (lang === 'en' && charData.name_en) return charData.name_en;
        if (lang === 'jp' && charData.name_jp) return charData.name_jp;
        return charData.name || charName;
    }

    // Get position icon path
    function getPositionIcon(position) {
        return `${BASE_URL}/assets/img/character-cards/직업_${position}.png`;
    }

    // Get element icon path
    function getElementIcon(element) {
        return `${BASE_URL}/assets/img/character-cards/속성_${element}.png`;
    }

    // Render character item with click to navigate
    function renderCharacter(charName) {
        const charData = window.characterData?.[charName];
        if (!charData) {
            return `<div class="character-item"><span class="character-name">${charName}</span></div>`;
        }

        const displayName = getCharacterName(charName);
        const codename = charData.codename || '';
        const rarity = charData.rarity || 5;
        const isLimit = charData.limit || false;
        const position = charData.position;
        const element = charData.element;
        const lang = getCurrentLang();

        // Build rarity stars HTML
        const starHtml = rarity == 5 && isLimit
            ? '<span class="rarity-star star5-limit">★★★★★</span>'
            : `<span class="rarity-star">${'★'.repeat(rarity)}</span>`;

        // Character page URL
        const charUrl = `${BASE_URL}/character.html?name=${encodeURIComponent(charName)}&lang=${lang}`;

        // Codename HTML (작고 흐리게)
        const codenameHtml = codename
            ? `<span class="character-codename">${codename}</span>`
            : '';

        return `
            <div class="character-item" onclick="window.location.href='${charUrl}'" title="${displayName}">
                <img 
                    class="character-avatar" 
                    src="${BASE_URL}/assets/img/tier/${charName}.webp" 
                    alt="${displayName}"
                    onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'"
                />
                <div class="character-info">
                    <span class="character-name">${displayName}</span>
                    ${codenameHtml}
                    <div class="character-meta">
                        ${position ? `<img class="position-icon" src="${getPositionIcon(position)}" alt="${position}" title="${position}">` : ''}
                        ${element ? `<img class="element-icon" src="${getElementIcon(element)}" alt="${element}" title="${element}">` : ''}
                        ${starHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // Render release card
    function renderReleaseCard(release) {
        const status = getStatus(release.date);
        const statusLabel = t(status);
        const daysText = getDaysText(release.date);

        const charactersHtml = release.characters
            .map(char => renderCharacter(char))
            .join('');

        const noteHtml = release.note
            ? `<div class="release-note">${release.note}</div>`
            : '';

        // 버전이 '?'이거나 없으면 버전 배지 숨김
        const versionBadgeHtml = release.version && release.version !== '?'
            ? `<span class="version-badge">v${release.version}</span>`
            : '';

        // 콜라보 이벤트 아이콘 (v0.0 제외)
        let collaboIconHtml = '';
        if (release.version !== '0.0') {
            const charData = window.characterData || {};
            let hasP5 = false;
            let hasP5R = false;
            let hasP3 = false;

            release.characters.forEach(charName => {
                const char = charData[charName];
                if (char) {
                    if (char.persona5) {
                        if (charName === '카스미' || charName === '아케치') {
                            hasP5R = true;
                        } else {
                            hasP5 = true;
                        }
                    }
                    if (char.persona3) {
                        hasP3 = true;
                    }
                }
            });

            // 언어별 콜라보 설명 (출시 콘텐츠 명시)
            if (hasP5R) {
                collaboIconHtml = `
                    <div class="content-badge collabo-badge">
                        <img class="content-icon" src="${BASE_URL}/apps/schedule/p5r.png" alt="P5R" title="${t('collaboP5rTitle')}">
                        <span class="content-label">${t('collaboP5rDesc')}</span>
                    </div>
                `;
            } else if (hasP5) {
                collaboIconHtml = `
                    <div class="content-badge collabo-badge">
                        <img class="content-icon" src="${BASE_URL}/apps/schedule/p5.png" alt="P5" title="${t('collaboP5Title')}">
                        <span class="content-label">${t('collaboP5Desc')}</span>
                    </div>
                `;
            } else if (hasP3) {
                collaboIconHtml = `
                    <div class="content-badge collabo-badge">
                        <img class="content-icon" src="${BASE_URL}/apps/schedule/p3r.png" alt="P3R" title="${t('collaboP3rTitle')}">
                        <span class="content-label">${t('collaboP3rDesc')}</span>
                    </div>
                `;
            }
        }

        // 메인 스토리 표시 (main-story 필드 사용)
        let mainStoryHtml = '';
        const mainStoryValue = release['main-story'] || release.main_story;
        if (mainStoryValue) {
            mainStoryHtml = `
                <div class="content-badge main-story-badge">
                    <img class="content-icon" src="${BASE_URL}/apps/schedule/palace.png" alt="Main Story" title="${t('mainStoryTitle')}">
                    <span class="content-label">${t('mainStoryPrefix')} ${mainStoryValue}</span>
                </div>
            `;
        }

        // Summer Event 표시 (summer 필드 사용)
        let summerHtml = '';
        if (release.summer === true) {
            summerHtml = `
                <div class="content-badge summer-badge">
                    <img class="content-icon" src="${BASE_URL}/apps/schedule/summer.png" alt="Summer Event" title="${t('summerEventTitle')}">
                    <span class="content-label">${t('summerEventDesc')}</span>
                </div>
            `;
        }

        // Gold Ticket Unlock 표시 (goldTicketUnlocks 필드 사용)
        let goldTicketHtml = '';
        if (release.goldTicketUnlocks && Array.isArray(release.goldTicketUnlocks) && release.goldTicketUnlocks.length > 0) {
            // 자동 추가된 것인지 확인 (모든 항목이 자동 추가된 경우에만 Predict 표시)
            const autoUnlocks = release.goldTicketUnlocksAuto && Array.isArray(release.goldTicketUnlocksAuto) ? release.goldTicketUnlocksAuto : [];
            const allAuto = autoUnlocks.length > 0 && autoUnlocks.length === release.goldTicketUnlocks.length &&
                release.goldTicketUnlocks.every(codename => autoUnlocks.includes(codename));

            // 미래 일정인 경우에도 Predict 표시 (수동 입력 포함)
            const isFuture = status === 'upcoming' || status === 'future';
            const labelText = (allAuto || isFuture) ? t('goldTicketPredict') : t('goldTicketDesc');

            // codename으로 캐릭터 찾기
            const charData = window.characterData || {};
            // 첫 번째 캐릭터의 URL을 뱃지 전체 링크로 사용
            let firstCharUrl = '';

            const characterIcons = release.goldTicketUnlocks.map(codename => {
                // codename으로 캐릭터 찾기
                let charName = null;
                for (const [name, info] of Object.entries(charData)) {
                    if (info.codename === codename) {
                        charName = name;
                        break;
                    }
                }

                if (charName) {
                    const lang = getCurrentLang();
                    const charUrl = `${BASE_URL}/character.html?name=${encodeURIComponent(charName)}&lang=${lang}`;

                    if (!firstCharUrl) {
                        firstCharUrl = charUrl;
                    }

                    // 뱃지 전체가 링크이므로 내부는 이미지 태그만 반환 (a 태그 제거)
                    return `<img class="gold-ticket-character-icon" src="${BASE_URL}/assets/img/tier/${charName}.webp" alt="${codename}" title="${codename}" onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'">`;
                }
                return '';
            }).filter(icon => icon).join('');

            // 첫 번째 캐릭터 URL이 있으면 a 태그로, 없으면 div 태그 사용
            const badgeTag = firstCharUrl ? 'a' : 'div';
            const badgeHref = firstCharUrl ? `href="${firstCharUrl}"` : '';
            const badgeClick = firstCharUrl ? `onclick="event.stopPropagation();"` : '';
            const badgeStyle = firstCharUrl ? 'style="text-decoration: none; color: inherit; cursor: pointer;"' : '';

            goldTicketHtml = `
                <${badgeTag} ${badgeHref} class="content-badge gold-ticket-badge" ${badgeClick} ${badgeStyle}>
                    <img class="gold-ticket-icon" src="${BASE_URL}/assets/img/character-detail/limit_non.png" alt="Gold Ticket Unlock" title="${t('goldTicketTitle')}">
                    ${characterIcons}
                    <span class="content-label">${labelText}</span>
                </${badgeTag}>
            `;
        }

        // Weapon 표시 (weapon 필드 사용)
        let weaponHtml = '';
        const hasWeapons = release.weapon && Array.isArray(release.weapon) && release.weapon.length > 0;
        const hasWeaponStamps = release.weapon_stamp && Array.isArray(release.weapon_stamp) && release.weapon_stamp.length > 0;

        if (hasWeapons || hasWeaponStamps) {
            // weapon 필드가 있으면 weapon 목록 사용, 없으면 weapon_stamp만 사용
            const weaponsToShow = hasWeapons ? release.weapon : release.weapon_stamp;
            const weaponListHtml = weaponsToShow.map(weaponName => {
                const localizedName = getLocalizedWeaponName(weaponName);
                const hasStamp = hasWeaponStamps && release.weapon_stamp.includes(weaponName);

                // Check if weapon data exists (if not, disable click and hover)
                const hasWeaponData = weaponsData && weaponsData[weaponName];
                const clickable = hasWeaponData;
                const cursorStyle = clickable ? 'cursor: pointer;' : 'cursor: default;';
                const dataAttrs = clickable ? `data-weapon-id="${weaponName}" data-weapon-image="${BASE_URL}/assets/img/wonder-weapon/${weaponName}.webp" data-weapon-name="${localizedName}"` : '';
                const noHoverClass = clickable ? '' : 'weapon-item-no-hover';

                const weaponImageUrl = `${BASE_URL}/assets/img/wonder-weapon/${weaponName}.webp`;
                const stampAttr = hasStamp ? 'data-weapon-has-stamp="true"' : '';
                // Weapon click handler (Prevent modal, go to link) -> a 태그로 변경
                const tag = clickable ? 'a' : 'div';
                const hrefAttr = clickable ? `href="${BASE_URL}/wonder-weapon/?weapon=${encodeURIComponent(weaponName)}"` : '';
                const onClickAttr = clickable ? `onclick="event.stopPropagation();"` : '';
                const lightningStampLabel = t('labelLightningStamp');

                return `
                    <${tag} class="weapon-item ${noHoverClass}" ${dataAttrs} ${stampAttr} style="${cursorStyle}" ${hrefAttr} ${onClickAttr}>
                        ${hasStamp ? `<img class="weapon-stamp-icon" src="${BASE_URL}/assets/img/wonder-weapon/lightning_stamp.png" alt="${lightningStampLabel}" title="${lightningStampLabel}">` : ''}
                        <img class="weapon-icon" src="${weaponImageUrl}" alt="${localizedName}" title="${localizedName}" onerror="this.src='${BASE_URL}/assets/img/placeholder.png';">
                        <span class="weapon-name">${localizedName}</span>
                    </${tag}>
                `;
            }).join('');

            weaponHtml = `
                <div class="weapon-list">
                    ${weaponListHtml}
                </div>
            `;
        }

        // Revelation 표시 (revelation 필드 사용)
        let revelationHtml = '';
        if (release.revelation && Array.isArray(release.revelation) && release.revelation.length > 0) {
            const revelationListHtml = release.revelation.map(revelationName => {
                const koreanName = getKoreanRevelationName(revelationName);
                const localizedName = getLocalizedRevelationName(revelationName);

                // Get tooltip data for revelation
                const tooltipData = getRevelationTooltipData(revelationName);
                const tooltipAttr = tooltipData ? `data-tooltip="${tooltipData}"` : '';
                const tooltipClass = tooltipData ? 'tooltip-text' : '';

                return `
                    <div class="revelation-item ${tooltipClass}" ${tooltipAttr}>
                        <img class="revelation-icon" src="${BASE_URL}/assets/img/revelation/${koreanName}.webp" alt="${localizedName}" title="${localizedName}" onerror="this.src='${BASE_URL}/assets/img/placeholder.png';">
                        <span class="revelation-name">${localizedName}</span>
                    </div>
                `;
            }).join('');

            revelationHtml = `
                <div class="revelation-list">
                    ${revelationListHtml}
                </div>
            `;
        }

        // Mindscape Core 표시 (mindscape_core 필드 사용)
        let mindscapeCoreHtml = '';
        if (release.mindscape_core && Array.isArray(release.mindscape_core) && release.mindscape_core.length > 0) {
            const mindscapeCoreListHtml = release.mindscape_core.map(charName => {
                const charData = window.characterData?.[charName];
                const displayName = charData?.name || charName;

                const lang = getCurrentLang();
                const charUrl = `${BASE_URL}/character.html?name=${encodeURIComponent(charName)}&lang=${lang}`;

                return `
                    <a href="${charUrl}" class="mindscape-core-item" style="cursor: pointer;" onclick="event.stopPropagation();">
                        <img class="mindscape-core-icon" src="${BASE_URL}/assets/img/character-detail/innate/core.png" alt="${t('coreLabel')}" title="${t('coreLabel')}">
                        <img class="mindscape-core-character-icon" src="${BASE_URL}/assets/img/tier/${charName}.webp" alt="${displayName}" title="${displayName}" onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'">
                        <span class="mindscape-core-label">LV100</span>
                    </a>
                `;
            }).join('');

            mindscapeCoreHtml = `
                <div class="mindscape-core-list">
                    ${mindscapeCoreListHtml}
                </div>
            `;
        }

        // 페르소나 표시 (persona 필드 사용) - character-list와 뱃지 사이에 배치
        let personaHtml = '';
        if (release.persona && Array.isArray(release.persona) && release.persona.length > 0) {
            const personaListHtml = release.persona.map(personaName => {
                // 이름 끝의 ! 표시 여부에 따라 하이라이트 적용
                const hasHighlight = /!+$/.test(personaName);
                const cleanPersonaName = personaName.replace(/!+$/, '');
                const localizedName = getLocalizedPersonaName(cleanPersonaName);

                // 사악한 프로스트는 링크 막기
                const isBlackFrost = cleanPersonaName === '사악한 프로스트' || cleanPersonaName === 'Black Frost' || cleanPersonaName === 'ジャアクフロスト';
                const personaPageUrl = isBlackFrost ? '#' : `${BASE_URL}/persona/?name=${encodeURIComponent(cleanPersonaName)}`;

                // CSV에서 combination 및 rank 정보 가져오기
                const personaData = personaCsvMap && personaCsvMap[cleanPersonaName] ? personaCsvMap[cleanPersonaName] : null;
                const rank = personaData ? personaData.rank : '';
                const combinations = personaData ? [
                    personaData.combination1,
                    personaData.combination2,
                    personaData.combination3
                ].filter(c => c) : [];

                // EVENT 체크
                const hasEvent = combinations.some(c => /^EVENT$/i.test(c));

                // rainbow+ 체크
                const rainbowMatch = combinations.find(c => /^rainbow\+(\d+)$/i.test(c));
                const rainbowNum = rainbowMatch ? rainbowMatch.match(/^rainbow\+(\d+)$/i)[1] : null;

                // 이미지 처리
                const imgElement = `
                    <img 
                        src="${BASE_URL}/assets/img/persona/${cleanPersonaName}.webp" 
                        alt="${localizedName}"
                        onerror="this.onerror=null; this.src='${BASE_URL}/assets/img/placeholder.png';"
                    />
                `;

                // EVENT 및 rainbow+ 표시
                let extraInfoHtml = '';
                if (hasEvent) {
                    extraInfoHtml += '<span class="persona-event-label">EVENT</span>';
                }
                if (rainbowNum) {
                    const iconNameKr = '와일드 엠블럼 무지개';
                    extraInfoHtml += `
                        <span class="persona-emblem">
                            <img class="persona-emblem-icon" src="${BASE_URL}/apps/persona/persona_icon/${encodeURIComponent(iconNameKr)}.png" alt="${iconNameKr}" />
                            <span class="persona-emblem-num">${rainbowNum}</span>
                        </span>
                    `;
                }

                // Rank 아이콘
                const rankIconHtml = rank
                    ? `<img class="persona-grade-img" src="${BASE_URL}/assets/img/persona/persona-grade${rank}.webp" alt="Grade ${rank}" />`
                    : '';

                // persona-item 전체 클릭 가능하게 (사악한 프로스트 제외)
                const onClickHandler = isBlackFrost
                    ? ''
                    : `onclick="window.open('${personaPageUrl}', '_blank');"`;
                const noHoverClass = isBlackFrost ? 'persona-item-no-hover' : '';

                return `
                    <div class="persona-item ${hasHighlight ? 'super-highlight' : ''} ${noHoverClass}" ${onClickHandler} title="${localizedName}">
                        ${imgElement}
                        <div class="persona-info">
                            <div class="persona-name-wrapper">
                                <span class="persona-name">${localizedName}</span>
                                ${rankIconHtml}
                            </div>
                            ${extraInfoHtml ? `<div class="persona-extra-info">${extraInfoHtml}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            personaHtml = `
                <div class="persona-list">
                    ${personaListHtml}
                </div>
            `;
        }

        return `
            <div class="release-card status-${status}" data-status="${status}">
                <div class="timeline-node"></div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="version-info">
                            ${versionBadgeHtml}
                            <span class="release-date">${formatDate(release.date)} · ${daysText}</span>
                        </div>
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </div>
                    <div class="character-list-wrapper">
                        <div class="character-list">
                            ${charactersHtml}
                        </div>
                        ${personaHtml}
                        <div class="badges-group">
                            ${collaboIconHtml}
                            ${mainStoryHtml}
                            ${summerHtml}
                            ${goldTicketHtml}
                            ${weaponHtml}
                            ${revelationHtml}
                            ${mindscapeCoreHtml}
                        </div>
                    </div>
                    ${noteHtml}
                </div>
            </div>
        `;
    }

    // Get all anniversary events (past and future)
    function getAllAnniversaryEvents() {
        return data.anniversaryEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Render anniversary event
    function renderAnniversaryEvent(event) {
        const eventDate = parseDate(event.date);
        const daysText = getDaysText(event.date);

        // Get localized event name
        let localizedName = event.name;
        if (event.type === 'debut') localizedName = event.server === 'global' ? t('anniversaryGlobalDebut') : t('anniversaryCnDebut');
        else if (event.type === 'half') localizedName = event.server === 'global' ? t('anniversaryGlobalHalf') : t('anniversaryCnHalf');
        else if (event.type === 'first') localizedName = event.server === 'global' ? t('anniversaryGlobalFirst') : t('anniversaryCnFirst');
        else if (event.type === 'onehalf') localizedName = event.server === 'global' ? t('anniversaryGlobalOneHalf') : t('anniversaryCnOneHalf');
        else if (event.type === 'second') localizedName = t('anniversaryCnSecond');
        else if (event.type === 'twohalf') localizedName = t('anniversaryCnTwoHalf');

        if (!localizedName || localizedName === event.type) {
            localizedName = event.name;
        }

        // Server icon
        const anniversaryLabel = t('anniversary');
        const serverIcon = `<img class="server-icon" src="${BASE_URL}/apps/schedule/aniver.png" alt="${anniversaryLabel}" title="${anniversaryLabel}">`;

        return `
            <div class="release-card status-${getStatus(event.date)}" data-status="${getStatus(event.date)}">
                <div class="timeline-node"></div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="version-info">
                            <span class="release-date">${formatDate(event.date)} · ${daysText}</span>
                        </div>
                        <span class="status-badge ${getStatus(event.date)}">${t(getStatus(event.date))}</span>
                    </div>
                    <div class="character-list-wrapper">
                        <div class="anniversary-event">
                            <div class="anniversary-info">
                                ${serverIcon}
                                <span class="anniversary-name">${localizedName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render year divider
    function renderYearDivider(year) {
        return `
            <div class="year-divider">
                <span class="year-label">${year}</span>
            </div>
        `;
    }

    // Render current banner info
    function renderCurrentBanner(releases) {
        const container = document.getElementById('current-banner');
        if (!container) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find current release
        const currentRelease = releases.find(r => getStatus(r.date) === 'current');

        // Find next upcoming release
        const upcomingReleases = releases.filter(r => {
            const releaseDate = parseDate(r.date);
            return releaseDate > today;
        });
        const nextRelease = upcomingReleases.length > 0 ? upcomingReleases[0] : null;

        let currentHtml = '';
        let nextHtml = '';

        // Current banner
        if (currentRelease) {
            const firstChar = currentRelease.characters[0];
            const charNames = currentRelease.characters.map(c => getCharacterName(c)).join(', ');
            const charImgSrc = `${BASE_URL}/assets/img/tier/${firstChar}.webp`;

            currentHtml = `
                <div class="banner-item current-info">
                    <div class="banner-label">${t('currentBanner')}</div>
                    <div class="banner-character">
                        <img class="banner-char-avatar" src="${charImgSrc}" alt="${charNames}" onerror="this.style.display='none'">
                        <span class="banner-char-name">${charNames}</span>
                    </div>
                </div>
            `;
        }

        // Next release
        if (nextRelease) {
            const nextDate = parseDate(nextRelease.date);
            const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
            const firstNextChar = nextRelease.characters[0];
            const nextCharNames = nextRelease.characters.map(c => getCharacterName(c)).join(', ');
            const nextCharImgSrc = `${BASE_URL}/assets/img/tier/${firstNextChar}.webp`;

            nextHtml = `
                <div class="banner-item next-release">
                    <div class="banner-label">${t('nextRelease')}</div>
                    <div class="banner-character">
                        <img class="banner-char-avatar" src="${nextCharImgSrc}" alt="${nextCharNames}" onerror="this.style.display='none'">
                        <span class="banner-char-name">${nextCharNames}</span>
                    </div>
                    <div class="banner-countdown">${diffDays} ${t('daysLeft')}</div>
                </div>
            `;
        }

        if (!currentHtml && !nextHtml) {
            container.style.display = 'none';
            return;
        }

        container.style.display = '';
        container.innerHTML = currentHtml + nextHtml;
    }

    // Render timeline
    function renderTimeline(releases, filter = 'all') {
        const container = document.getElementById('timeline-container');
        if (!container) return;

        // Get all anniversary events
        const anniversaryEvents = getAllAnniversaryEvents();

        // Separate anniversary events by status
        const releasedAnniversaries = anniversaryEvents.filter(event => getStatus(event.date) === 'released');
        const nonReleasedAnniversaries = anniversaryEvents.filter(event => getStatus(event.date) !== 'released');

        // Separate releases by status
        const releasedReleases = releases.filter(r => getStatus(r.date) === 'released');
        const nonReleasedReleases = releases.filter(r => getStatus(r.date) !== 'released');

        // Apply filter
        let filteredReleases;
        if (filter === 'all') {
            filteredReleases = releases;
        } else if (filter === 'released') {
            filteredReleases = releasedReleases;
        } else {
            filteredReleases = releases.filter(r => getStatus(r.date) === filter);
        }

        if (filteredReleases.length === 0 && anniversaryEvents.length === 0) {
            container.innerHTML = `<div class="empty-state">${t('noCharacters')}</div>`;
            return;
        }

        let html = '';

        // If showing all, render released as collapsible section
        if (filter === 'all' && (releasedReleases.length > 0 || releasedAnniversaries.length > 0)) {
            const totalReleasedCount = releasedReleases.length + releasedAnniversaries.length;

            html += `
                <div class="released-section">
                    <button class="released-toggle-btn" onclick="toggleReleasedSection(this)">
                        <span class="toggle-text">${t('showReleased')}</span>
                        <span class="toggle-count">${totalReleasedCount}</span>
                        <span class="toggle-icon">+</span>
                    </button>
                    <div class="released-content" id="released-content">
            `;

            // Combine released releases and released anniversaries, sort by date
            const allReleasedItems = [...releasedReleases, ...releasedAnniversaries];
            allReleasedItems.sort((a, b) => new Date(a.date) - new Date(b.date));

            let currentYear = null;
            allReleasedItems.forEach(item => {
                const itemYear = item.date.split('-')[0];
                if (itemYear !== currentYear) {
                    currentYear = itemYear;
                    html += renderYearDivider(currentYear);
                }

                // Check if it's an anniversary event or regular release
                if (item.server) { // Anniversary events have server property
                    html += renderAnniversaryEvent(item);
                } else {
                    html += renderReleaseCard(item);
                }
            });

            html += `
                    </div>
                </div>
            `;

            // Render non-released and non-released anniversary events together
            const allFutureEvents = [...nonReleasedReleases, ...nonReleasedAnniversaries];
            allFutureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

            let currentYear2 = null;
            allFutureEvents.forEach(event => {
                const eventYear = event.date.split('-')[0];
                if (eventYear !== currentYear2) {
                    currentYear2 = eventYear;
                    html += renderYearDivider(currentYear2);
                }

                // Check if it's an anniversary event or regular release
                if (event.server) { // Anniversary events have server property
                    html += renderAnniversaryEvent(event);
                } else {
                    html += renderReleaseCard(event);
                }
            });
        } else {
            // Standard rendering for filtered view - include anniversary events for all filters
            let allEvents = [...filteredReleases];

            // Add anniversary events based on filter
            if (filter === 'released') {
                allEvents = [...allEvents, ...releasedAnniversaries];
            } else if (filter === 'upcoming' || filter === 'future' || filter === 'current') {
                allEvents = [...allEvents, ...nonReleasedAnniversaries];
            } else {
                allEvents = [...allEvents, ...anniversaryEvents];
            }

            // Sort by date
            allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

            let currentYear = null;
            allEvents.forEach(event => {
                const eventYear = event.date.split('-')[0];
                if (eventYear !== currentYear) {
                    currentYear = eventYear;
                    html += renderYearDivider(currentYear);
                }

                // Check if it's an anniversary event or regular release
                if (event.server) { // Anniversary events have server property
                    html += renderAnniversaryEvent(event);
                } else {
                    html += renderReleaseCard(event);
                }
            });
        }

        container.innerHTML = html;

        // Re-initialize tooltips after rendering
        setTimeout(() => {
            // Manually bind tooltips for revelation items
            document.querySelectorAll('.revelation-item.tooltip-text').forEach(el => {
                if (typeof bindTooltipElement === 'function') {
                    bindTooltipElement(el);
                } else if (window.bindTooltipElement) {
                    window.bindTooltipElement(el);
                }
            });

            // Also call addTooltips if available
            if (typeof addTooltips === 'function') {
                addTooltips();
            } else if (window.addTooltips) {
                window.addTooltips();
            }
        }, 100);
    }

    // Toggle released section
    window.toggleReleasedSection = function (btn) {
        const content = document.getElementById('released-content');
        if (!content) return;

        const isExpanded = content.classList.contains('expanded');
        const toggleText = btn.querySelector('.toggle-text');
        const toggleIcon = btn.querySelector('.toggle-icon');

        if (isExpanded) {
            content.classList.remove('expanded');
            btn.classList.remove('expanded');
            toggleText.textContent = t('showReleased');
            toggleIcon.textContent = '+';
        } else {
            content.classList.add('expanded');
            btn.classList.add('expanded');
            toggleText.textContent = t('hideReleased');
            toggleIcon.textContent = '−';
        }
    };

    // Initialize filter buttons
    function initFilters(releases) {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                renderTimeline(releases, filter);
            });
        });

        // Add SEA Server Mode checkbox
        const filterSection = document.querySelector('.filter-section');
        if (filterSection && !document.getElementById('seaServerCheckbox')) {
            const isSeaServer = localStorage.getItem('schedule_isSeaServer') === 'true';

            const seaServerContainer = document.createElement('div');
            seaServerContainer.className = 'sea-server-toggle-container';
            seaServerContainer.innerHTML = `
                <label class="sea-server-label">
                    <input type="checkbox" id="seaServerCheckbox" ${isSeaServer ? 'checked' : ''}>
                    <span>${t('seaServerLabel')}</span>
                </label>
            `;

            filterSection.appendChild(seaServerContainer);

            // Add event listener for checkbox
            const checkbox = document.getElementById('seaServerCheckbox');
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;

                    // Save to localStorage
                    localStorage.setItem('schedule_isSeaServer', isChecked.toString());

                    // Apply server delay
                    applyServerDelayToData(isChecked);

                    // Re-generate schedule
                    const newReleases = generateFullSchedule();

                    // Re-render UI
                    renderCurrentBanner(newReleases);
                    renderTimeline(newReleases);


                    // Re-initialize tooltips
                    setTimeout(() => {
                        if (typeof addTooltips === 'function') {
                            addTooltips();
                        } else if (window.addTooltips) {
                            window.addTooltips();
                        }
                    }, 100);
                });
            }
        }
    }

    // Main initialization
    async function init() {
        // Wait for i18n service (window.t) to be ready
        if (typeof window.t !== 'function') {
            await new Promise(resolve => {
                const checkI18n = setInterval(() => {
                    if (typeof window.t === 'function') {
                        clearInterval(checkI18n);
                        resolve();
                    }
                }, 50);
                // Fallback timeout after 3 seconds
                setTimeout(() => {
                    clearInterval(checkI18n);
                    resolve();
                }, 3000);
            });
        }

        try {
            // Load SEA Server Mode state from localStorage
            await Promise.all([
                waitForCharacterData(),
                loadPersonaCsv(),
                loadWeaponsData(),
                loadRevelationData()
            ]);

            // Get SEA server preference
            const urlParams = new URLSearchParams(window.location.search);
            const isSea = urlParams.get('sea') === 'true';

            // Apply SEA server delay if needed
            applyServerDelayToData(isSea);

            const releases = generateFullSchedule();
            renderTimeline(releases);
            renderCurrentBanner(releases);
            initFilters(releases);
        } catch (error) {
            console.error('Schedule initialization failed:', error);
            const container = document.getElementById('timeline-container');
            if (container) {
                container.innerHTML = `<div class="empty-state">${t('loadScheduleFailed')}</div>`;
            }
        }
    }

    // Initialize weapon modal events
    function initWeaponModalEvents() {
        // Weapon item click events (delegated) - click on entire weapon-item
        document.addEventListener('click', function (e) {
            const weaponItem = e.target.closest('.weapon-item[data-weapon-id]');
            if (weaponItem) {
                const weaponId = weaponItem.getAttribute('data-weapon-id');
                const imageUrl = weaponItem.getAttribute('data-weapon-image');
                const weaponName = weaponItem.getAttribute('data-weapon-name');
                const hasStamp = weaponItem.getAttribute('data-weapon-has-stamp') === 'true';
                showWeaponEffect(weaponId, imageUrl, weaponName, hasStamp);
                return;
            }

            // Close modal when clicking close button
            if (e.target.closest('.weapon-effect-close')) {
                closeWeaponEffectModal();
                return;
            }

            // Close modal when clicking outside the modal content
            const modal = document.getElementById('weapon-effect-modal');
            if (modal && modal.classList.contains('show') && !e.target.closest('.weapon-effect-modal-content') && !e.target.closest('.weapon-item')) {
                closeWeaponEffectModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function (e) {
            const modal = document.getElementById('weapon-effect-modal');
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                closeWeaponEffectModal();
            }
        });
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
