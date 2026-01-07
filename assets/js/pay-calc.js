// P5X 가챠 트래커 pity 데이터 (kr/tw/cn 실시간 로드용)
const PITY_LANGS = ['kr', 'tw', 'cn'];
const PITY_BASE_URL = 'https://raw.githubusercontent.com/iantCode/P5X_Gacha_Statistics/refs/heads/main/pity/pity_';

class PayCalculator {
    constructor() {
        // pity 분포 기본값 (로드 실패 시 0으로 남음)
        this.charPityStats = { mean: 0, median: 0, total: 0 };
        this.weaponPityStats = { mean: 0, median: 0, total: 0 };

        this.baseResources = this.loadBaseResources();
        this.initializeTabs();
        this.initializeTable();
        this.bindEvents();
        this.initializeCheckboxes();
        this.initializeBaseResourcesInputs();
        this.bindExpectationTooltips();
        this.updateTotals();

        // pity 분포 비동기 로드 (kr/tw/cn 합산)
        this.initializePityDistributions();
    }

    computeHistogramStats(histObj) {
        if (!histObj) return { mean: 0, median: 0, total: 0 };
        const entries = Object.entries(histObj)
            .map(([k, v]) => [Number(k), Number(v)])
            .filter(([k, v]) => Number.isFinite(k) && v > 0)
            .sort((a, b) => a[0] - b[0]);

        let total = 0;
        let sum = 0;
        entries.forEach(([pull, count]) => {
            total += count;
            sum += pull * count;
        });

        let median = 0;
        if (total > 0) {
            const half = total / 2;
            let acc = 0;
            for (const [pull, count] of entries) {
                acc += count;
                if (acc >= half) {
                    median = pull;
                    break;
                }
            }
        }

        const mean = total > 0 ? sum / total : 0;
        return { mean, median, total };
    }

    async initializePityDistributions() {
        const combinedConfirmed = {};
        const combinedWeapon = {};

        const merge = (target, source) => {
            if (!source) return;
            Object.entries(source).forEach(([k, v]) => {
                const key = Number(k);
                const val = Number(v);
                if (!Number.isFinite(key) || !Number.isFinite(val) || val <= 0) return;
                target[key] = (target[key] || 0) + val;
            });
        };

        for (const lang of PITY_LANGS) {
            try {
                const res = await fetch(`${PITY_BASE_URL}${lang}.json`, { cache: 'no-store' });
                if (!res.ok) continue;
                const data = await res.json();
                if (data.Confirmed) merge(combinedConfirmed, data.Confirmed);
                if (data.Weapon) merge(combinedWeapon, data.Weapon);
            } catch (_) {
                // 개별 언어 실패는 무시하고 나머지로 계산
            }
        }

        // 분포가 없을 경우 기본 중간값/평균을 사용 (캐릭 90회, 무기 60회)
        if (Object.keys(combinedConfirmed).length > 0) {
            this.charPityStats = this.computeHistogramStats(combinedConfirmed);
        } else {
            this.charPityStats = { mean: 90, median: 90, total: 0 };
        }

        if (Object.keys(combinedWeapon).length > 0) {
            this.weaponPityStats = this.computeHistogramStats(combinedWeapon);
        } else {
            this.weaponPityStats = { mean: 60, median: 60, total: 0 };
        }

        this.updatePityMedianLabels();
        this.updatePityTooltipSources();
        this.updateTotals();
    }

    bindExpectationTooltips() {
        try {
            if (typeof bindTooltipElement === 'function') {
                document.querySelectorAll('.expectation-row .tooltip-icon').forEach(el => {
                    if (el) bindTooltipElement(el);
                });
            }
        } catch (_) {}
    }

    updatePityMedianLabels() {
        try {
            if (this.charPityStats && this.charPityStats.median) {
                const el = document.getElementById('limitedCharMedianLabel');
                if (el) el.textContent = ` (중간값 ${this.charPityStats.median}회/확률 평균 83.3회)`;
            }
            if (this.weaponPityStats && this.weaponPityStats.median) {
                const allEl = document.getElementById('allWeaponMedianLabel');
                const limitedEl = document.getElementById('limitedWeaponMedianLabel');
                const txt = ` (중간값 ${this.weaponPityStats.median}회/확률 평균 50회)`;
                if (allEl) allEl.textContent = txt;
                //if (limitedEl) limitedEl.textContent = txt;
            }
        } catch (_) {}
    }

    updatePityTooltipSources() {
        try {
            const formatN = (n) => this.formatPrice ? this.formatPrice(n) : n.toString();

            // 한정 캐릭터 툴팁
            const charTooltip = document.querySelector('.expectation-row .expectation-item:nth-child(1) .tooltip-icon');
            if (charTooltip) {
                const baseText = (charTooltip.getAttribute('data-tooltip') || '').split('중간값은 루페르넷에 제출된')[0].trim();
                let suffix;
                if (this.charPityStats && this.charPityStats.total > 0) {
                    const n = formatN(this.charPityStats.total);
                    suffix = `중간값은 루페르넷에 제출된 ${n}회의 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.`;
                } else {
                    suffix = '중간값은 루페르넷에 제출된 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.';
                }
                charTooltip.setAttribute('data-tooltip', `${baseText}\n\n${suffix}`.trim());
            }

            // 전체 무기 툴팁
            const allWeaponTooltip = document.querySelector('.expectation-row .expectation-item:nth-child(2) .tooltip-icon');
            if (allWeaponTooltip) {
                const baseText = (allWeaponTooltip.getAttribute('data-tooltip') || '').split('중간값은 루페르넷에 제출된')[0].trim();
                let suffix;
                if (this.weaponPityStats && this.weaponPityStats.total > 0) {
                    const n = formatN(this.weaponPityStats.total);
                    suffix = `중간값은 루페르넷에 제출된 ${n}회의 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.`;
                } else {
                    suffix = '중간값은 루페르넷에 제출된 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.';
                }
                allWeaponTooltip.setAttribute('data-tooltip', `${baseText}\n\n${suffix}`.trim());
            }

            // 한정 무기 툴팁 (전체 무기와 같은 분포 사용)
            const limitedWeaponTooltip = document.querySelector('.expectation-row .expectation-item:nth-child(3) .tooltip-icon');
            if (limitedWeaponTooltip) {
                const baseText = (limitedWeaponTooltip.getAttribute('data-tooltip') || '').split('중간값은 루페르넷에 제출된')[0].trim();
                let suffix;
                if (this.weaponPityStats && this.weaponPityStats.total > 0) {
                    const n = formatN(this.weaponPityStats.total);
                    suffix = `중간값은 루페르넷에 제출된 ${n}회의 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.`;
                } else {
                    suffix = '중간값은 루페르넷에 제출된 한국, 대만, 중국 서버의 가챠 통계 데이터를 기반으로 산정됐습니다.';
                }
                limitedWeaponTooltip.setAttribute('data-tooltip', `${baseText}\n\n${suffix}`.trim());
            }
        } catch (_) {}
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 모든 탭 버튼과 컨텐츠에서 active 클래스 제거
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 클릭한 탭 버튼과 해당 컨텐츠에 active 클래스 추가
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    loadBaseResources() {
        const defaultValues = {
            crystal: 0,
            amber: 0,
            destiny: 0,
            destinyCoins: 0,
            futureDestiny: 0,
            cognition: 0
        };

        try {
            const stored = localStorage.getItem('payCalcBaseResources');
            if (!stored) return defaultValues;

            const data = JSON.parse(stored);
            return {
                crystal: Number.isFinite(Number(data.crystal)) ? Number(data.crystal) : 0,
                amber: Number.isFinite(Number(data.amber)) ? Number(data.amber) : 0,
                destiny: Number.isFinite(Number(data.destiny)) ? Number(data.destiny) : 0,
                destinyCoins: Number.isFinite(Number(data.destinyCoins)) ? Number(data.destinyCoins) : 0,
                futureDestiny: Number.isFinite(Number(data.futureDestiny)) ? Number(data.futureDestiny) : 0,
                cognition: Number.isFinite(Number(data.cognition)) ? Number(data.cognition) : 0
            };
        } catch (e) {
            return defaultValues;
        }
    }

    saveBaseResources() {
        try {
            localStorage.setItem('payCalcBaseResources', JSON.stringify(this.baseResources));
        } catch (e) {
            // 로컬 스토리지 에러는 무시
        }
    }

    initializeBaseResourcesInputs() {
        const config = [
            { id: 'baseCrystal', key: 'crystal' },
            { id: 'baseAmber', key: 'amber' },
            { id: 'baseDestiny', key: 'destiny' },
            { id: 'baseDestinyCoins', key: 'destinyCoins' },
            { id: 'baseFutureDestiny', key: 'futureDestiny' },
            { id: 'baseCognition', key: 'cognition' }
        ];

        config.forEach(({ id, key }) => {
            const input = document.getElementById(id);
            if (!input) return;

            input.value = this.baseResources[key] || 0;

            input.addEventListener('input', () => {
                let value = parseInt(input.value, 10);
                if (isNaN(value) || value < 0) value = 0;
                this.baseResources[key] = value;
                input.value = value;
                this.saveBaseResources();
                this.updateTotals();
            });
        });
    }

    initializeTable() {
        // 패키지 테이블 초기화
        const packageTbody = document.getElementById('packageTableBody');
        PAY_DATA.packages.forEach((pkg, index) => {
            const tr = this.createTableRow(pkg, index);
            packageTbody.appendChild(tr);
        });

        // 이계 수정 테이블 초기화
        const crystalTbody = document.getElementById('crystalTableBody');
        PAY_DATA.crystalPackages.forEach((pkg, index) => {
            const tr = this.createTableRow(pkg, PAY_DATA.packages.length + index);
            crystalTbody.appendChild(tr);
        });
    }

    createTableRow(pkg, index) {
        const tr = document.createElement('tr');
        
        // 이미지 경로용 패키지 이름 처리
        const imgName = pkg.name.replace(' (초회)', '');

        // 엠버 효율 계산
        const calculateEfficiency = (pkg) => {
            const amberValue = (pkg.crystal || 0) + (pkg.amber || 0) + 
                             (pkg.destiny || 0) * 150 + 
                             (pkg.destinyCoins || 0) * 100 + 
                             (pkg.destiny_future || 0) * 150;
            const amberValueExcludeFuture = (pkg.crystal || 0) + (pkg.amber || 0) + 
                                          (pkg.destiny || 0) * 150 + 
                                          (pkg.destinyCoins || 0) * 100;
            
            if (amberValue === 0) return { withFuture: 0, withoutFuture: 0 };
            
            const pricePerAmber = pkg.price / amberValue;
            const pricePerAmberExcludeFuture = amberValueExcludeFuture > 0 ? 
                pkg.price / amberValueExcludeFuture : 0;
            
            return {
                withFuture: Math.round(pricePerAmber * 100) / 100,
                withoutFuture: Math.round(pricePerAmberExcludeFuture * 100) / 100
            };
        };

        const efficiency = calculateEfficiency(pkg);
        const efficiencyText = efficiency.withFuture === 0 ? '' : 
            efficiency.withFuture === efficiency.withoutFuture ?
                `<div class="efficiency-pc">(${this.formatPrice(efficiency.withFuture)}원)</div>
                 <div class="efficiency-mobile">(${this.formatPrice(efficiency.withFuture)}원)</div>` :
                `<div class="efficiency-pc">(${this.formatPrice(efficiency.withFuture)}원/${this.formatPrice(efficiency.withoutFuture)}원)</div>
                 <div class="efficiency-mobile">(${this.formatPrice(efficiency.withFuture)}원/${this.formatPrice(efficiency.withoutFuture)}원)</div>`;

        // 모바일용 재화 HTML 생성
        const resourcesHtml = [
            { value: pkg.crystal, icon: '이계 수정' },
            { value: pkg.amber, icon: '이계 엠버' },
            { value: pkg.destiny, icon: '정해진 운명' },
            { value: pkg.destinyCoins, icon: '정해진 코인' },
            { value: pkg.destiny_future, icon: '미래의 운명' }
        ].filter(r => r.value)
         .map(r => `<span class="resource-mobile-item">
                     <img src="/assets/img/pay/${r.icon}.png" alt="${r.icon}" class="resource-mobile-icon">
                     ${r.value}
                   </span>`)
         .join(' ');

        // 재화 값과 아이콘 HTML 생성 함수
        const getResourceHtml = (value, icon) => {
            if (!value || value === '-') return '-';
            return `<div class="resource-with-icon">
                <img src="/assets/img/pay/${icon}.png" alt="${icon}" class="resource-table-icon">
                <span>${value}</span>
            </div>`;
        };

        tr.innerHTML = `
            <td class="check-column">
                <img src="/assets/img/ui/check-off.png" class="checkbox-img" data-index="${index}">
            </td>
            <td class="img-column">
                <img src="/assets/img/pay/${imgName}.png" alt="${pkg.name}" class="package-img">
            </td>
            <td class="name-column">${pkg.name}</td>
            <td class="price-value mobile-price">
                <div class="price-main">${this.formatPrice(pkg.price)}원</div>
                ${efficiencyText}
            </td>
            <td class="value-column resource-value">${getResourceHtml(pkg.crystal, '이계 수정')}</td>
            <td class="value-column resource-value">${getResourceHtml(pkg.amber, '이계 엠버')}</td>
            <td class="value-column resource-value">${getResourceHtml(pkg.destiny, '정해진 운명')}</td>
            <td class="value-column resource-value">${getResourceHtml(pkg.destinyCoins, '정해진 코인')}</td>
            <td class="value-column resource-value">${getResourceHtml(pkg.destiny_future, '미래의 운명')}</td>
            <td class="count-column">
                ${(pkg.maxCount || 1) > 1 ? 
                    `<select class="count-select" data-index="${index}">
                        ${this.generateCountOptions(pkg.maxCount)}
                    </select>` : 
                    '-'
                }
            </td>
            <td class="discount-column">
                <select class="discount-select" data-index="${index}">
                    ${this.generateDiscountOptions()}
                </select>
            </td>
            <td class="note-column">${pkg.note || '-'}</td>
            <td class="resources-mobile">${resourcesHtml}</td>
        `;
        return tr;
    }

    generateCountOptions(maxCount) {
        let options = '';
        for (let i = 1; i <= maxCount; i++) {
            options += `<option value="${i}">${i}개</option>`;
        }
        return options;
    }

    generateDiscountOptions() {
        return PAY_DATA.discountOptions.map(option => 
            `<option value="${option.value}" data-type="${option.type}">${option.label}</option>`
        ).join('');
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    calculateDiscount(price, discountOption) {
        const value = parseInt(discountOption.value);
        const type = discountOption.dataset.type;
        
        if (type === 'fixed') {
            return Math.max(0, price - value);
        } else if (type === 'percent') {
            return Math.round(price * (100 - value) / 100);
        }
        return price;
    }

    updateTotals() {
        let totalPrice = 0;
        let gainedCrystal = 0;
        let gainedAmber = 0;
        let gainedDestiny = 0;
        let gainedDestinyCoins = 0;
        let gainedFutureDestiny = 0;

        document.querySelectorAll('.checkbox-img[data-index]').forEach((checkbox) => {
            const isChecked = checkbox.src.includes('check-on.png');
            const tr = checkbox.closest('tr');
            const index = parseInt(checkbox.getAttribute('data-index'));
            
            if (isChecked) {
                // 패키지 데이터 가져오기 (일반 패키지 또는 이계 수정 패키지)
                const pkg = index < PAY_DATA.packages.length ? 
                    PAY_DATA.packages[index] : 
                    PAY_DATA.crystalPackages[index - PAY_DATA.packages.length];

                const countSelect = document.querySelector(`.count-select[data-index="${index}"]`);
                const count = countSelect ? parseInt(countSelect.value) : 1;
                const discountOption = document.querySelector(`.discount-select[data-index="${index}"]`).selectedOptions[0];
                
                const price = this.calculateDiscount(pkg.price, discountOption);
                totalPrice += price * count;
                
                if (pkg.crystal) gainedCrystal += pkg.crystal * count;
                if (pkg.amber) gainedAmber += pkg.amber * count;
                if (pkg.destiny) gainedDestiny += pkg.destiny * count;
                if (pkg.destinyCoins) gainedDestinyCoins += pkg.destinyCoins * count;
                if (pkg.destiny_future) gainedFutureDestiny += pkg.destiny_future * count;
            }
            
            tr.classList.toggle('selected', isChecked);
        });

        // 페이백 적용
        const finalPrice = document.getElementById('paybackCheckbox').checked ? 
            Math.round(totalPrice * 0.7) : totalPrice;

        // 총 엠버 환산 값 계산
        const totalAmberValue = gainedCrystal + gainedAmber + (gainedDestiny * 150) + (gainedDestinyCoins * 100) + (gainedFutureDestiny * 150);
        const totalAmberValueExcludeFuture = gainedCrystal + gainedAmber + (gainedDestiny * 150) + (gainedDestinyCoins * 100);

        // 엠버 1개당 가격 계산
        const pricePerAmber = totalAmberValue > 0 ? finalPrice / totalAmberValue : 0;
        const pricePerAmberExcludeFuture = totalAmberValueExcludeFuture > 0 ? finalPrice / totalAmberValueExcludeFuture : 0;

        document.getElementById('totalPrice').textContent = this.formatPrice(finalPrice) + '원';
        // 획득 재화 표시
        const gainedCrystalEl = document.getElementById('gainedCrystal');
        const gainedAmberEl = document.getElementById('gainedAmber');
        const gainedDestinyEl = document.getElementById('gainedDestiny');
        const gainedDestinyCoinsEl = document.getElementById('gainedDestinyCoins');
        const gainedFutureDestinyEl = document.getElementById('gainedFutureDestiny');

        if (gainedCrystalEl) gainedCrystalEl.textContent = this.formatPrice(gainedCrystal) + '개';
        if (gainedAmberEl) gainedAmberEl.textContent = this.formatPrice(gainedAmber) + '개';
        if (gainedDestinyEl) gainedDestinyEl.textContent = gainedDestiny + '개';
        if (gainedDestinyCoinsEl) gainedDestinyCoinsEl.textContent = gainedDestinyCoins + '개';
        if (gainedFutureDestinyEl) gainedFutureDestinyEl.textContent = gainedFutureDestiny + '개';

        // 기존 보유 재화
        const base = this.baseResources || {
            crystal: 0,
            amber: 0,
            destiny: 0,
            destinyCoins: 0,
            futureDestiny: 0,
            cognition: 0
        };

        // 인지 단면은 입력 필드 값을 한 번 더 직접 읽어서 동기화 (이벤트 누락 대비)
        const baseCognitionInput = document.getElementById('baseCognition');
        if (baseCognitionInput) {
            let cognitionValue = parseInt(baseCognitionInput.value, 10);
            if (isNaN(cognitionValue) || cognitionValue < 0) cognitionValue = 0;
            base.cognition = cognitionValue;
            if (this.baseResources) {
                this.baseResources.cognition = cognitionValue;
            }
        }

        // 총 보유 재화 (기존 + 획득) - ALL 변환의 기준 값
        let totalCrystal = base.crystal + gainedCrystal;
        let totalAmber = base.amber + gainedAmber;
        let totalDestiny = base.destiny + gainedDestiny;
        let totalDestinyCoins = base.destinyCoins + gainedDestinyCoins;
        const totalFutureDestiny = base.futureDestiny + gainedFutureDestiny;
        let totalCognition = base.cognition; // 현재 패키지에서 인지 단면을 얻지 않으므로 보유 값만 사용

        // 정해진 운명 ALL 변환
        if (document.getElementById('destinyAllCheckbox').checked) {
            // 1) 이계 수정 / 이계 엠버 -> 정해진 운명 (150 비율 유지)
            const totalValueCA = totalCrystal + totalAmber;
            const convertedDestinyFromCA = Math.floor(totalValueCA / 150);
            const remainderCA = totalValueCA % 150;

            totalDestiny += convertedDestinyFromCA;
            if (remainderCA > 0) {
                if (totalCrystal >= remainderCA) {
                    totalCrystal = remainderCA;
                    totalAmber = 0;
                } else {
                    totalAmber = remainderCA - totalCrystal;
                }
            } else {
                totalCrystal = 0;
                totalAmber = 0;
            }

            // 2) 인지 단면 -> 정해진 운명 (15 비율)
            const convertedDestinyFromCog = Math.floor(totalCognition / 15);
            const remainderCog = totalCognition % 15;
            totalDestiny += convertedDestinyFromCog;
            totalCognition = remainderCog;
        }

        // 정해진 코인 ALL 변환
        if (document.getElementById('coinsAllCheckbox').checked) {
            // 1) 이계 수정 / 이계 엠버 -> 정해진 코인 (100 비율 유지)
            const totalValueCA = totalCrystal + totalAmber;
            const convertedCoinsFromCA = Math.floor(totalValueCA / 100);
            const remainderCA = totalValueCA % 100;

            totalDestinyCoins += convertedCoinsFromCA;
            if (remainderCA > 0) {
                if (totalCrystal >= remainderCA) {
                    totalCrystal = remainderCA;
                    totalAmber = 0;
                } else {
                    totalAmber = remainderCA - totalCrystal;
                }
            } else {
                totalCrystal = 0;
                totalAmber = 0;
            }

            // 2) 인지 단면 -> 정해진 코인 (10 비율)
            const convertedCoinsFromCog = Math.floor(totalCognition / 10);
            const remainderCog = totalCognition % 10;
            totalDestinyCoins += convertedCoinsFromCog;
            totalCognition = remainderCog;
        }

        document.getElementById('totalCrystal').textContent = this.formatPrice(totalCrystal) + '개';
        document.getElementById('totalAmber').textContent = this.formatPrice(totalAmber) + '개';
        document.getElementById('totalDestiny').textContent = totalDestiny + '개';
        document.getElementById('totalDestinyCoins').textContent = totalDestinyCoins + '개';
        document.getElementById('totalFutureDestiny').textContent = totalFutureDestiny + '개';
        const totalCognitionEl = document.getElementById('totalCognition');
        if (totalCognitionEl) totalCognitionEl.textContent = this.formatPrice(totalCognition) + '개';
        
        // 엠버 1개당 가격 표시
        document.getElementById('pricePerAmber').textContent = this.formatPrice(Math.round(pricePerAmber * 100) / 100) + '원';
        document.getElementById('pricePerAmberExcludeFuture').textContent = this.formatPrice(Math.round(pricePerAmberExcludeFuture * 100) / 100) + '원';

        // 기대값 계산 (정해진 운명 / 정해진 코인 + 인지 단면 환급 재귀 포함)
        const expectedLimitedCharEl = document.getElementById('expectedLimitedChar');
        const expectedAllWeaponEl = document.getElementById('expectedAllWeapon');
        const expectedLimitedWeaponEl = document.getElementById('expectedLimitedWeapon');
        const expectedLimitedCharDestinyEl = document.getElementById('expectedLimitedCharDestiny');
        const expectedAllWeaponCoinsEl = document.getElementById('expectedAllWeaponCoins');
        const expectedLimitedWeaponCoinsEl = document.getElementById('expectedLimitedWeaponCoins');

        if (expectedLimitedCharEl || expectedAllWeaponEl || expectedLimitedWeaponEl ||
            expectedLimitedCharDestinyEl || expectedAllWeaponCoinsEl || expectedLimitedWeaponCoinsEl) {
            // 현재 총 재화 기준 (운명/코인만 사용, 보유 인지 단면은 시작 재화에서 제외)
            const currentDestiny = totalDestiny;
            const currentCoins = totalDestinyCoins;

            // 한정 캐릭터 기대값 계산 (p5는 중간값 기반, 환급 재귀 유지)
            let expectedLimitedChar = 0;
            let expectedLimitedCharDestiny = 0;
            {
                let startDestiny = currentDestiny;
                // 캐릭터 배너 최초 1회는 인지 단면 30개(=운명 2개 환급)가 없다고 보고 보정
                if (startDestiny > 0) {
                    startDestiny = Math.max(0, startDestiny - 2);
                }

                const charMedian = (this.charPityStats && this.charPityStats.median) ? this.charPityStats.median : 0;
                const CHAR_P5 = charMedian > 0 ? 1 / charMedian : 0.012; // 기존 0.012 대신 1/중간값
                const CHAR_P4 = 0.1312; // 4성 확률은 고정

                const CHAR_SHARD_PER_PULL =
                    CHAR_P5 * 30 +      // 5성 시 인지 단면 30개
                    CHAR_P4 * 15;       // 4성 시 인지 단면 15개
                const destinyRefundPerPull = CHAR_SHARD_PER_PULL / 15; // 15개당 운명 1개

                if (startDestiny > 0 && destinyRefundPerPull < 1) {
                    const totalPulls = startDestiny / (1 - destinyRefundPerPull);
                    expectedLimitedChar = totalPulls * CHAR_P5; // 한정 캐릭터는 5성=픽업
                    expectedLimitedCharDestiny = totalPulls;    // 운명 1개당 1뽑
                }
            }

            // 무기 기대값 계산 (p5는 중간값 기반, 환급 재귀 유지)
            let expectedAllWeapon = 0;
            let expectedLimitedWeapon = 0;
            let expectedAllWeaponCoins = 0;
            {
                const startCoins = currentCoins;

                const weaponMedian = (this.weaponPityStats && this.weaponPityStats.median) ? this.weaponPityStats.median : 0;
                const WEAPON_P5 = weaponMedian > 0 ? 1 / weaponMedian : 0.012; // 기존 0.012 대신 1/중간값
                const WEAPON_P4 = 0.1414; // 4성 확률은 고정

                const WEAPON_SHARD_PER_PULL =
                    WEAPON_P5 * 20 +     // 5성 시 인지 단면 20개
                    WEAPON_P4 * 4;       // 4성 시 인지 단면 4개
                const coinRefundPerPull = WEAPON_SHARD_PER_PULL / 10; // 10개당 코인 1개

                if (startCoins > 0 && coinRefundPerPull < 1) {
                    const totalPullsWeapon = startCoins / (1 - coinRefundPerPull);

                    // 픽업 5성 종합 확률: 분포 중간값 기반 (기존 0.02 대체)
                    const PICKUP_TOTAL_RATE = weaponMedian > 0 ? 1 / weaponMedian : 0.02;

                    expectedAllWeapon = totalPullsWeapon * PICKUP_TOTAL_RATE;
                    // 한정 무기 2 / 총 픽업 3 (반천장)
                    expectedLimitedWeapon = expectedAllWeapon * (2 / 3);
                    expectedAllWeaponCoins = totalPullsWeapon; // 코인 1개당 1뽑
                }
            }

            const formatExpectation = (value) => {
                if (!isFinite(value) || value <= 0) return '0회';
                if (value < 0.01) return '0회';
                return `${(Math.round(value * 100) / 100).toFixed(2)}회`;
            };

            if (expectedLimitedCharEl) {
                expectedLimitedCharEl.textContent = formatExpectation(expectedLimitedChar);
            }
            if (expectedAllWeaponEl) {
                expectedAllWeaponEl.textContent = formatExpectation(expectedAllWeapon);
            }
            if (expectedLimitedWeaponEl) {
                expectedLimitedWeaponEl.textContent = formatExpectation(expectedLimitedWeapon);
            }

            const formatCurrencyExpectation = (value) => {
                if (!isFinite(value) || value <= 0) return '0개';
                const rounded = Math.round(value);
                return this.formatPrice(rounded) + '개';
            };

            if (expectedLimitedCharDestinyEl) {
                expectedLimitedCharDestinyEl.textContent = formatCurrencyExpectation(expectedLimitedCharDestiny);
            }
            if (expectedAllWeaponCoinsEl) {
                expectedAllWeaponCoinsEl.textContent = formatCurrencyExpectation(expectedAllWeaponCoins);
            }
            if (expectedLimitedWeaponCoinsEl) {
                // 한정 무기도 같은 코인 풀에서 나오므로 사용 코인은 전체 무기와 동일하게 표기
                expectedLimitedWeaponCoinsEl.textContent = formatCurrencyExpectation(expectedAllWeaponCoins);
            }
        }
    }

    bindEvents() {
        // 패키지/이계 수정 행 선택용 체크 이미지에만 클릭 이벤트 바인딩
        document.querySelectorAll('.checkbox-img[data-index]').forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                const isChecked = checkbox.src.includes('check-on.png');
                checkbox.src = `/assets/img/ui/check-${isChecked ? 'off' : 'on'}.png`;
                const tr = checkbox.closest('tr');
                if (tr) {
                    tr.classList.toggle('selected', !isChecked);
                }
                this.updateTotals();
            });
        });

        document.querySelectorAll('.count-select, .discount-select').forEach(element => {
            element.addEventListener('change', () => this.updateTotals());
        });
    }

    initializeCheckboxes() {
        // 페이백 체크박스 이벤트
        const paybackCheckbox = document.getElementById('paybackCheckbox');
        const paybackCheckImg = document.getElementById('paybackCheckImg');
        
        paybackCheckbox.addEventListener('change', () => {
            paybackCheckImg.src = `/assets/img/ui/check-${paybackCheckbox.checked ? 'on' : 'off'}.png`;
            this.updateTotals();
        });

        // 정해진 운명 ALL 체크박스 이벤트
        const destinyAllCheckbox = document.getElementById('destinyAllCheckbox');
        const destinyAllCheckImg = document.getElementById('destinyAllCheckImg');
        
        destinyAllCheckbox.addEventListener('change', () => {
            destinyAllCheckImg.src = `/assets/img/ui/check-${destinyAllCheckbox.checked ? 'on' : 'off'}.png`;
            this.updateTotals();
        });

        // 정해진 코인 ALL 체크박스 이벤트
        const coinsAllCheckbox = document.getElementById('coinsAllCheckbox');
        const coinsAllCheckImg = document.getElementById('coinsAllCheckImg');
        
        coinsAllCheckbox.addEventListener('change', () => {
            coinsAllCheckImg.src = `/assets/img/ui/check-${coinsAllCheckbox.checked ? 'on' : 'off'}.png`;
            this.updateTotals();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PayCalculator();
}); 