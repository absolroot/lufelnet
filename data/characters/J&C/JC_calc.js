window.JCCalc = (function () {
    const registrations = []; // { item, valueCell, type, calc }

    // 타입 정의
    const TYPES = {
        PENETRATE: 'penetrate',
        DEF: 'def',
        CRIT: 'crit',
        JC1_PENETRATE: 'jc1_penetrate', // jc1 전용 (관통 테이블)
        JC2_DEF: 'jc2_def' // jc2 전용 (방어력 감소 테이블)
    };

    // 로컬 스토리지 키 매핑
    const STORAGE_KEYS = {
        [TYPES.PENETRATE]: 'jc_desire_penetrate',
        [TYPES.DEF]: 'jc_desire_def', // 기존 reduce/def 테이블용
        [TYPES.CRIT]: 'jc_desire_crit',
        [TYPES.JC1_PENETRATE]: 'jc_desire_jc1_penetrate', // jc1 전용
        [TYPES.JC2_DEF]: 'jc_desire_jc2_def' // jc2 전용
    };

    // 상태 관리 (각각 독립된 값)
    const state = {
        [TYPES.PENETRATE]: 100,
        [TYPES.DEF]: 100,
        [TYPES.CRIT]: 100,
        [TYPES.JC1_PENETRATE]: 100,
        [TYPES.JC2_DEF]: 100
    };

    // 초기값 로드 함수
    function loadState() {
        Object.values(TYPES).forEach(type => {
            try {
                const key = STORAGE_KEYS[type];
                const saved = localStorage.getItem(key);
                if (saved !== null) {
                    const parsed = parseFloat(saved);
                    if (isFinite(parsed)) {
                        state[type] = parsed;
                    }
                }
            } catch (_) { }
        });
    }

    // 초기 로드 실행
    loadState();

    function getLang() {
        try {
            if (typeof I18NUtils !== 'undefined' && I18NUtils.getCurrentLanguageSafe) {
                return I18NUtils.getCurrentLanguageSafe();
            }
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                return LanguageRouter.getCurrentLanguage();
            }
        } catch (_) { }
        return 'kr';
    }

    function getLabelText() {
        const lang = getLang();
        if (lang === 'en') return 'Desire level';
        if (lang === 'jp') return 'デザイアレベル';
        return '페르소나 성능';
    }

    // 타입별 Factor 계산
    function getFactor(type, baseValue) {
        // 타입이 없거나 잘못되었으면 기본값(Def) 혹은 100 사용
        const currentN = state[type] || 100;

        // jc1 전용 공식: value/2 + value/2 * N/100 = value * (0.5 + 0.5 * N/100) = value * (50 + N/2) / 100
        if (type === TYPES.JC1_PENETRATE) {
            return (50 + currentN / 2) / 100;
        }

        // jc2 전용 공식: value/2 + value/2 * N/100 = value * (50 + N/2) / 100
        if (type === TYPES.JC2_DEF) {
            return (50 + currentN / 2) / 100;
        }

        // 기존 공식: (100 + (N - 100) / 2)%
        return (100 + (currentN - 100) / 2) / 100;
    }

    function formatValue(v) {
        return `${v.toFixed(2)}%`;
    }

    function applyMultiplierToItemInternal(item, valueCell, type) {
        if (!item || !valueCell) return;
        const base = (item.__jcBaseValue != null) ? item.__jcBaseValue : (item.value || 0);

        // 해당 아이템에 지정된 타입의 Desire Level을 적용
        const factor = getFactor(type, base);
        const effective = base * factor;

        item.value = effective;
        valueCell.textContent = formatValue(effective);
    }

    function recalcAll() {
        const seenCalc = new Set();
        registrations.forEach(reg => {
            if (document.body.contains(reg.valueCell)) {
                // 저장된 reg.type을 사용하여 재계산
                applyMultiplierToItemInternal(reg.item, reg.valueCell, reg.type);
                if (reg.calc && !seenCalc.has(reg.calc)) {
                    seenCalc.add(reg.calc);
                }
            }
        });

        // 변경된 값들을 합계에 반영
        seenCalc.forEach(calc => {
            try {
                if (typeof calc.updateTotal === 'function') calc.updateTotal();
                if (typeof calc.updatePenetrateTotal === 'function') calc.updatePenetrateTotal();
                if (typeof calc.updateCritTotal === 'function') calc.updateCritTotal(); // Crit용 업데이트 함수가 있다면 호출
            } catch (_) { }
        });
    }

    return {
        // 특정 타입의 현재 값 조회
        getCurrentN(type) {
            return state[type] || 100;
        },

        /**
         * Desire Control UI 붙이기
         * @param {HTMLElement} headerTr 헤더 엘리먼트
         * @param {Object} calcInstance 계산기 인스턴스
         * @param {string} type 'penetrate', 'def', 'crit' 중 하나 (필수)
         */
        attachDesireControl(headerTr, calcInstance, type) {
            if (!headerTr) return;

            // 타입 유효성 검사 (기본값 def)
            let targetType = Object.values(TYPES).includes(type) ? type : TYPES.DEF;

            // jc1_penetrate와 jc2_def는 별도로 attachJC1Control, attachJC2Control에서 처리
            // 여기서는 기존 penetrate/def/crit 타입만 처리
            if (type === TYPES.JC1_PENETRATE || type === TYPES.JC2_DEF) {
                return; // 별도 함수에서 처리
            }

            // 초기 로딩 시점 문제 해결 (재로딩 로직 유지)
            if (calcInstance && !calcInstance.__jcReloaded) {
                // ... (기존 재로딩 로직 동일, 필요 시 Crit 그룹도 체크 추가 가능) ...
            }

            try {
                const infoWrap = headerTr.querySelector('.group-info');
                if (!infoWrap) return;

                // 이미 붙어있으면 패스 (중복 방지)
                if (headerTr.querySelector('.jc-desire-container')) return;

                const container = document.createElement('span');
                container.className = 'jc-desire-container';
                container.dataset.type = targetType; // 디버깅용

                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                const label = document.createElement('span');
                label.className = 'jc-desire-label';
                label.textContent = getLabelText();

                const input = document.createElement('input');
                input.type = 'number';
                input.className = `jc-desire-input jc-input-${targetType}`; // 타입별 클래스 구분
                input.min = '0';
                input.max = '300';
                input.step = '0.1';
                input.value = String(state[targetType]); // 해당 타입의 저장된 값 사용

                const handleUpdate = () => {
                    const rawValue = input.value;
                    let n = parseFloat(rawValue);

                    if (isNaN(n)) return;

                    // 해당 타입의 상태 업데이트
                    state[targetType] = n;

                    // 해당 타입의 로컬 스토리지 저장
                    try {
                        localStorage.setItem(STORAGE_KEYS[targetType], String(n));
                    } catch (_) { }

                    // 동일한 타입의 다른 인풋들도 동기화 (같은 페이지에 여러 표가 있을 경우)
                    document.querySelectorAll(`.jc-input-${targetType}`).forEach(el => {
                        if (el !== input) el.value = rawValue;
                    });

                    recalcAll();
                };

                input.addEventListener('input', handleUpdate);
                input.addEventListener('click', (e) => e.stopPropagation());

                container.appendChild(label);
                container.appendChild(input);
                infoWrap.appendChild(container);
            } catch (_) { }
        },

        /**
         * jc1 전용 Desire Control UI 붙이기 (관통 테이블용)
         * 공식: value/2 + value/2 * N/100
         */
        attachJC1Control(headerTr, calcInstance) {
            if (!headerTr) return;
            const targetType = TYPES.JC1_PENETRATE;

            try {
                const infoWrap = headerTr.querySelector('.group-info');
                if (!infoWrap) return;

                // 이미 붙어있으면 패스 (중복 방지)
                if (headerTr.querySelector('.jc-desire-container-jc1')) return;

                const container = document.createElement('span');
                container.className = 'jc-desire-container jc-desire-container-jc1';
                container.dataset.type = targetType;

                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                const label = document.createElement('span');
                label.className = 'jc-desire-label';
                label.textContent = getLabelText();

                const input = document.createElement('input');
                input.type = 'number';
                input.className = `jc-desire-input jc-input-${targetType}`;
                input.min = '0';
                input.max = '300';
                input.step = '0.1';
                input.value = String(state[targetType]);

                const handleUpdate = () => {
                    const rawValue = input.value;
                    let n = parseFloat(rawValue);

                    if (isNaN(n)) return;

                    state[targetType] = n;

                    try {
                        localStorage.setItem(STORAGE_KEYS[targetType], String(n));
                    } catch (_) { }

                    document.querySelectorAll(`.jc-input-${targetType}`).forEach(el => {
                        if (el !== input) el.value = rawValue;
                    });

                    recalcAll();
                };

                input.addEventListener('input', handleUpdate);
                input.addEventListener('click', (e) => e.stopPropagation());

                container.appendChild(label);
                container.appendChild(input);
                infoWrap.appendChild(container);
            } catch (_) { }
        },

        /**
         * jc2 전용 Desire Control UI 붙이기 (방어력 감소 테이블용)
         * 공식: value/2 + value/2 * N/100
         */
        attachJC2Control(headerTr, calcInstance) {
            if (!headerTr) return;
            const targetType = TYPES.JC2_DEF;

            try {
                const infoWrap = headerTr.querySelector('.group-info');
                if (!infoWrap) return;

                // 이미 붙어있으면 패스 (중복 방지)
                if (headerTr.querySelector('.jc-desire-container-jc2')) return;

                const container = document.createElement('span');
                container.className = 'jc-desire-container jc-desire-container-jc2';
                container.dataset.type = targetType;

                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                const label = document.createElement('span');
                label.className = 'jc-desire-label';
                label.textContent = getLabelText();

                const input = document.createElement('input');
                input.type = 'number';
                input.className = `jc-desire-input jc-input-${targetType}`;
                input.min = '0';
                input.max = '300';
                input.step = '0.1';
                input.value = String(state[targetType]);

                const handleUpdate = () => {
                    const rawValue = input.value;
                    let n = parseFloat(rawValue);

                    if (isNaN(n)) return;

                    state[targetType] = n;

                    try {
                        localStorage.setItem(STORAGE_KEYS[targetType], String(n));
                    } catch (_) { }

                    document.querySelectorAll(`.jc-input-${targetType}`).forEach(el => {
                        if (el !== input) el.value = rawValue;
                    });

                    recalcAll();
                };

                input.addEventListener('input', handleUpdate);
                input.addEventListener('click', (e) => e.stopPropagation());

                container.appendChild(label);
                container.appendChild(input);
                infoWrap.appendChild(container);
            } catch (_) { }
        },

        /**
         * 아이템 등록
         * @param {Object} item 데이터 객체
         * @param {HTMLElement} valueCell 값 표시 셀
         * @param {string|boolean} typeOrIsPenetrate 'penetrate', 'def', 'crit' 문자열 권장. (호환성을 위해 true/false도 지원)
         * @param {Object} calcInstance 계산기 인스턴스
         */
        registerItem(item, valueCell, typeOrIsPenetrate, calcInstance) {
            if (!item || !valueCell) return;

            if (item.__jcBaseValue == null) {
                item.__jcBaseValue = item.value || 0;
            }

            // 타입 결정 로직 (하위 호환성 및 명시적 타입 지원)
            let targetType = TYPES.DEF; // 기본값
            if (typeOrIsPenetrate === true || typeOrIsPenetrate === 'penetrate') {
                targetType = TYPES.PENETRATE;
            } else if (typeOrIsPenetrate === 'crit') {
                targetType = TYPES.CRIT;
            } else if (typeOrIsPenetrate === 'def' || typeOrIsPenetrate === false) {
                targetType = TYPES.DEF;
            } else if (typeOrIsPenetrate === 'jc1_penetrate') {
                targetType = TYPES.JC1_PENETRATE;
            } else if (typeOrIsPenetrate === 'jc2_def') {
                targetType = TYPES.JC2_DEF;
            }

            if (item.__jcRegistered) {
                const existingReg = registrations[item.__jcRegIndex];
                if (existingReg) {
                    existingReg.valueCell = valueCell;
                    existingReg.calc = calcInstance;
                    existingReg.type = targetType; // 타입 업데이트
                }
            } else {
                const reg = { item, valueCell, type: targetType, calc: calcInstance || null };
                const index = registrations.push(reg) - 1;
                item.__jcRegistered = true;
                item.__jcRegIndex = index;
            }

            applyMultiplierToItemInternal(item, valueCell, targetType);
        },

        // 옵션 변경 시 호출
        onOptionChanged(item, valueCell, typeOrIsPenetrate, calcInstance) {
            if (!item) return;
            item.__jcBaseValue = item.value || 0;

            // 타입 결정
            let targetType = TYPES.DEF;
            if (typeOrIsPenetrate === true || typeOrIsPenetrate === 'penetrate') targetType = TYPES.PENETRATE;
            else if (typeOrIsPenetrate === 'crit') targetType = TYPES.CRIT;
            else if (typeOrIsPenetrate === 'jc1_penetrate') targetType = TYPES.JC1_PENETRATE;
            else if (typeOrIsPenetrate === 'jc2_def') targetType = TYPES.JC2_DEF;

            applyMultiplierToItemInternal(item, valueCell, targetType);

            // 합계 업데이트 (각 타입에 맞는 합계 함수 호출)
            try {
                if (calcInstance) {
                    if (targetType === TYPES.PENETRATE || targetType === TYPES.JC1_PENETRATE) {
                        if (calcInstance.updatePenetrateTotal) calcInstance.updatePenetrateTotal();
                    } else if (targetType === TYPES.CRIT) {
                        if (calcInstance.updateCritTotal) calcInstance.updateCritTotal(); // Crit 합계 함수가 있다고 가정
                        else if (calcInstance.updateTotal) calcInstance.updateTotal(); // 없으면 기본 Total
                    } else {
                        if (calcInstance.updateTotal) calcInstance.updateTotal();
                    }
                }
            } catch (_) { }
        },

        // 타입 상수 노출 (외부에서 사용 가능)
        TYPES: TYPES
    };
})();