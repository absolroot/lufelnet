class PayCalculator {
    constructor() {
        this.baseResources = this.loadBaseResources();
        this.initializeTabs();
        this.initializeTable();
        this.bindEvents();
        this.initializeCheckboxes();
        this.initializeBaseResourcesInputs();
        this.updateTotals();
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