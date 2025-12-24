window.JCCalc = (function () {
    const registrations = []; // { item, valueCell, isPenetrate, calc }
    const STORAGE_KEY = 'jc_desire_level'; // 로컬 스토리지 키

    // 초기값 설정: 저장된 값이 있으면 불러오고, 없으면 100
    let currentN = 100;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            const parsed = parseFloat(saved);
            if (isFinite(parsed)) {
                currentN = parsed;
            }
        }
    } catch (_) {}

    function getLang() {
        try {
            if (typeof I18NUtils !== 'undefined' && I18NUtils.getCurrentLanguageSafe) {
                return I18NUtils.getCurrentLanguageSafe();
            }
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                return LanguageRouter.getCurrentLanguage();
            }
        } catch (_) {}
        return 'kr';
    }

    function getLabelText() {
        const lang = getLang();
        if (lang === 'en') return 'Desire level';
        if (lang === 'jp') return 'デザイアレベル';
        return '페르소나 강도';
    }

    function getFactor() {
        // (100 + (N - 100) / 2)%
        return (100 + (currentN - 100) / 2) / 100;
    }

    function clampN(n) {
        if (!isFinite(n)) return 100;
        if (n < 0) n = 0;
        if (n > 300) n = 300;
        return n;
    }

    function formatValue(v) {
        return `${v.toFixed(2)}%`;
    }

    function applyMultiplierToItemInternal(item, valueCell) {
        if (!item || !valueCell) return;
        const base = (item.__jcBaseValue != null) ? item.__jcBaseValue : (item.value || 0);
        const factor = getFactor();
        const effective = base * factor;
        item.value = effective;
        valueCell.textContent = formatValue(effective);
    }

    function recalcAll() {
        const seenCalc = new Set();
        registrations.forEach(reg => {
            if (document.body.contains(reg.valueCell)) {
                applyMultiplierToItemInternal(reg.item, reg.valueCell);
                if (reg.calc && !seenCalc.has(reg.calc)) {
                    seenCalc.add(reg.calc);
                }
            }
        });
        seenCalc.forEach(calc => {
            try {
                calc.updateTotal();
                calc.updatePenetrateTotal();
            } catch (_) {}
        });
    }

    return {
        getCurrentN() {
            return currentN;
        },

        attachDesireControl(headerTr, calcInstance) {
            if (!headerTr) return;
            
            // 초기 로딩 시점 문제 해결: 아이템 연결이 안 되어있으면 리로드
            if (calcInstance && !calcInstance.__jcReloaded) {
                const groups = [calcInstance.penetrateGroups, calcInstance.reduceGroups];
                let needReload = false;
                for (const g of groups) {
                    if (g && g['J&C']) {
                        const unregistered = g['J&C'].some(item => !item.__jcRegistered);
                        if (unregistered) {
                            needReload = true;
                            break;
                        }
                    }
                }

                if (needReload) {
                    calcInstance.__jcReloaded = true;
                    setTimeout(() => {
                        console.log('J&C module loaded: Refreshing table to register items...');
                        if (typeof calcInstance.initializeTable === 'function') calcInstance.initializeTable();
                        if (typeof calcInstance.initializePenetrateTable === 'function') calcInstance.initializePenetrateTable();
                    }, 0);
                    return;
                }
            }

            try {
                const infoWrap = headerTr.querySelector('.group-info');
                if (!infoWrap) return;

                if (headerTr.querySelector('.jc-desire-container')) return;

                const container = document.createElement('span');
                container.className = 'jc-desire-container';

                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                const label = document.createElement('span');
                label.className = 'jc-desire-label';
                label.textContent = getLabelText();

                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'jc-desire-input';
                input.min = '0';
                input.max = '300';
                input.step = '0.1';
                input.value = String(currentN); // 저장된 값 또는 기본값 사용

                const handleUpdate = () => {
                    const rawValue = input.value;
                    let n = parseFloat(rawValue);

                    if (isNaN(n)) return; 
                    
                    currentN = n;
                    
                    // [변경] 값이 변할 때마다 로컬 스토리지에 저장
                    try {
                        localStorage.setItem(STORAGE_KEY, String(currentN));
                    } catch (_) {}

                    document.querySelectorAll('.jc-desire-input').forEach(el => {
                        if (el !== input) el.value = rawValue;
                    });
                    
                    recalcAll();
                };

                input.addEventListener('input', handleUpdate);
                input.addEventListener('click', (e) => e.stopPropagation());

                container.appendChild(label);
                container.appendChild(input);
                infoWrap.appendChild(container);
            } catch (_) {}
        },

        registerItem(item, valueCell, isPenetrate, calcInstance) {
            if (!item || !valueCell) return;
            
            if (item.__jcBaseValue == null) {
                item.__jcBaseValue = item.value || 0;
            }

            if (item.__jcRegistered) {
                const existingReg = registrations[item.__jcRegIndex];
                if (existingReg) {
                    existingReg.valueCell = valueCell;
                    existingReg.calc = calcInstance;
                }
            } else {
                const reg = { item, valueCell, isPenetrate: !!isPenetrate, calc: calcInstance || null };
                const index = registrations.push(reg) - 1;
                item.__jcRegistered = true;
                item.__jcRegIndex = index;
            }
            
            applyMultiplierToItemInternal(item, valueCell);
        },

        onOptionChanged(item, valueCell, isPenetrate, calcInstance) {
            if (!item) return;
            item.__jcBaseValue = item.value || 0;
            applyMultiplierToItemInternal(item, valueCell);
            try {
                if (calcInstance) {
                    if (isPenetrate) {
                        calcInstance.updatePenetrateTotal();
                    } else {
                        calcInstance.updateTotal();
                    }
                }
            } catch (_) {}
        }
    };
})();