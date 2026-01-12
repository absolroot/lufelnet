// QEVEL (My Palace Rating) 계산 및 모달 관리
(function() {
    'use strict';

    // 현재 언어 가져오기
    function getCurrentLanguage() {
        try {
            if (typeof window.getCurrentLanguage === 'function') {
                return window.getCurrentLanguage();
            }
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            if (langParam === 'en') return 'en';
            if (langParam === 'jp') return 'jp';
            const path = window.location.pathname;
            if (path.includes('/en/')) return 'en';
            if (path.includes('/jp/')) return 'jp';
            return 'kr';
        } catch(_) {
            return 'kr';
        }
    }

    // 버프 데이터 정의
    const buffData = [
        {
            id: 1,
            kr: '모든 캐릭터의 효과 명중 0.1% 증가',
            en: 'Increases ally ailment accuracy by 0.1%',
            jp: '味方の状態異常命中を0.1%増加',
            type: 'stat',
            stat: 'ailment_accuracy',
            value: 0.1
        },
        {
            id: 2,
            kr: '물리, 총격 속성 대미지 0.2% 증가',
            en: 'Increases ally Physical and Gun damage by 0.2%',
            jp: '味方の物理・銃撃ダメージを0.2%増加',
            type: 'element_dmg',
            elements: ['물리', '총격'],
            value: 0.2
        },
        {
            id: 3,
            kr: '[재물 추가] 도전 시마다 영혼석 100개 추가 생산',
            en: 'Grants 100 Konpaku Gems when you play Realm of Repression: Pursuit of Treasure',
            jp: '調伏の領域：財宝追加挑戦するたびに魂魄石100個追加生産',
            type: 'special',
            value: 100
        },
        {
            id: 4,
            kr: '화염, 염동 속성 대미지 0.2% 증가',
            en: 'Increases ally Fire and Psychokinesis damage by 0.2%',
            jp: '味方の火炎・念動ダメージを0.2%増加',
            type: 'element_dmg',
            elements: ['화염', '염동'],
            value: 0.2
        },
        {
            id: 5,
            kr: '모든 캐릭터의 [억압의 공간]에서 주는 대미지 0.2% 증가',
            en: 'Increases ally damage by 0.2% in Realm of Repression',
            jp: '味方の[調伏の領域]でのダメージを0.2%増加',
            type: 'content_dmg',
            content: '억압의 공간',
            value: 0.2
        },
        {
            id: 6,
            kr: '마이 팰리스 레벨 경험치 150 증가',
            en: 'Increases My Palace level experience by 150',
            jp: 'マイパレスレベル経験値150増加',
            type: 'exp',
            value: 150
        },
        {
            id: 7,
            kr: '빙결, 핵열 대미지 0.2% 증가',
            en: 'Increases Ice and Nuclear allies\' damage by 0.2%',
            jp: '味方の氷結・核熱ダメージを0.2%増加',
            type: 'element_dmg',
            elements: ['빙결', '핵열'],
            value: 0.2
        },
        {
            id: 8,
            kr: '매일 첫 접속 시 체력 1포인트 추가 획득',
            en: 'Restores 1 stamina after the first login of each day',
            jp: '毎日初回ログイン時にスタミナ1ポイント追加獲得',
            type: 'stamina',
            value: 1
        },
        {
            id: 9,
            kr: '전격, 축복 속성 대미지 0.2% 증가',
            en: 'Increases Electric and Bless allies\' damage by 0.2%',
            jp: '味方の電撃・祝福ダメージを0.2%増加',
            type: 'element_dmg',
            elements: ['전격', '축복'],
            value: 0.2
        },
        {
            id: 10,
            kr: '페르소나가 주는 대미지 0.2% 증가',
            en: 'Increases Persona damage by 0.2%',
            jp: 'ペルソナのダメージを0.2%増加',
            type: 'persona_dmg',
            value: 0.2
        },
        {
            id: 11,
            kr: '모든 캐릭터의 치료 효과 0.1% 증가',
            en: 'Increases ally healing effects by 0.1%',
            jp: '味方のHP回復量を0.1%増加',
            type: 'stat',
            stat: 'healing_effect',
            value: 0.1
        },
        {
            id: 12,
            kr: '질풍, 주원 속성 대미지 0.2% 증가',
            en: 'Increases Wind and Curse allies\' damage by 0.2%',
            jp: '味方の疾風・呪怨ダメージを0.2%増加',
            type: 'element_dmg',
            elements: ['질풍', '주원'],
            value: 0.2
        },
        {
            id: 13,
            kr: '모든 캐릭터의 생명 8 증가',
            en: 'Increases ally HP by 8',
            jp: '味方のHPを8増加',
            type: 'stat',
            stat: 'HP',
            value: 8
        },
        {
            id: 14,
            kr: '[마음의 바다 시련]에서 주는 대미지 0.2% 증가',
            en: 'Increases ally damage by 0.2% in Trials from the Sea of Souls',
            jp: '味方の[心の海の試練]でのダメージを0.2%増加',
            type: 'content_dmg',
            content: '마음의 바다 시련',
            value: 0.2
        },
        {
            id: 15,
            kr: '주인공이 주는 대미지 0.2% 증가',
            en: 'Increases protagonist damage by 0.2%',
            jp: '主人公のダメージを0.2%増加',
            type: 'protagonist_dmg',
            value: 0.2
        },
        {
            id: 16,
            kr: '마이 팰리스 레벨 경험치 150 증가',
            en: 'Increases My Palace level experience by 150',
            jp: 'マイパレスレベル経験値150増加',
            type: 'exp',
            value: 150
        },
        {
            id: 17,
            kr: '모든 캐릭터의 방어력 2 증가',
            en: 'Increases ally Defense by 2',
            jp: '味方の防御力を2増加',
            type: 'stat',
            stat: 'defense',
            value: 2
        },
        {
            id: 18,
            kr: '[흉몽의 문]에서 주는 대미지 0.2% 증가',
            en: 'Increases ally damage by 0.2% in Gates of the Nightmare Catcher',
            jp: '味方の[閼兇夢の扉]でのダメージを0.2%増加',
            type: 'content_dmg',
            content: '흉몽의 문',
            value: 0.2
        },
        {
            id: 19,
            kr: '모든 캐릭터의 속도 0.1 증가',
            en: 'Increases ally Speed by 0.1',
            jp: '味方の速さを0.1増加',
            type: 'stat',
            stat: 'speed',
            value: 0.1
        },
        {
            id: 20,
            kr: '모든 캐릭터의 공격력 2 증가',
            en: 'Increases ally Attack by 2',
            jp: '味方の攻撃力を2増加',
            type: 'stat',
            stat: 'attack',
            value: 2
        }
    ];

    // QEVEL에 따른 버프 계산
    function calculateBuffs(qevel) {
        if (!qevel || qevel < 0) return {};
        
        const result = {
            stats: {},
            elementDmg: {},
            contentDmg: {},
            personaDmg: 0,
            protagonistDmg: 0,
            exp: 0,
            stamina: 0,
            special: {}
        };

        // QEVEL에 따라 1~20번 버프를 반복 적용
        // 예: 21레벨 = 1~20 효과 1회 + 1레벨 효과
        // 예: 53레벨 = 1~20 효과 2회 + 1~13레벨 효과
        const fullSets = Math.floor(qevel / 20); // 완전한 20단위 세트 횟수
        const remainder = qevel % 20; // 나머지 레벨
        
        // 완전한 20단위 세트 적용
        for (let repeat = 0; repeat < fullSets; repeat++) {
            for (let i = 0; i < 20; i++) {
                applyBuff(buffData[i], result, 1);
            }
        }
        
        // 나머지 레벨 적용
        for (let i = 0; i < remainder; i++) {
            applyBuff(buffData[i], result, 1);
        }

        return result;
    }

    // 버프 적용 헬퍼
    function applyBuff(buff, result, multiplier) {
        const value = buff.value * multiplier;

        switch(buff.type) {
            case 'stat':
                if (!result.stats[buff.stat]) {
                    result.stats[buff.stat] = 0;
                }
                result.stats[buff.stat] += value;
                break;
            case 'element_dmg':
                buff.elements.forEach(el => {
                    if (!result.elementDmg[el]) {
                        result.elementDmg[el] = 0;
                    }
                    result.elementDmg[el] += value;
                });
                break;
            case 'content_dmg':
                if (!result.contentDmg[buff.content]) {
                    result.contentDmg[buff.content] = 0;
                }
                result.contentDmg[buff.content] += value;
                break;
            case 'persona_dmg':
                result.personaDmg += value;
                break;
            case 'protagonist_dmg':
                result.protagonistDmg += value;
                break;
            case 'exp':
                result.exp += value;
                break;
            case 'stamina':
                result.stamina += value;
                break;
            case 'special':
                result.special[buff.id] = value;
                break;
        }
    }

    // 버프 결과를 HTML로 포맷 (아이콘 포함)
    function formatBuffResult(buffs, lang) {
        const lines = [];
        const currentLang = lang || getCurrentLanguage();
        const base = (typeof BASE_URL !== 'undefined') ? BASE_URL : (window.SITE_BASEURL || '');

        // 아이콘 생성 헬퍼 함수
        function createIcon(src, alt, isElement = false) {
            if (isElement) {
                // 속성 아이콘: 가로 14px, 16px x 16px 영역 가운데 정렬
                return `<span style="display: inline-block; width: 16px; height: 16px; text-align: center; vertical-align: middle; margin-right: 4px; line-height: 16px;"><img src="${src}" alt="${alt}" style="width: 12px; height: auto; max-height: 16px; vertical-align: middle;" onerror="this.style.display='none';" /></span>`;
            } else {
                // 일반 아이콘: 가로 크기만 고정, 비율 유지
                return `<img src="${src}" alt="${alt}" style="width: 16px; height: auto; vertical-align: middle; margin-right: 4px; display: inline-block;" onerror="this.style.display='none';" />`;
            }
        }

        // 콘텐츠 대미지 버프 (제일 위)
        const contentLabels = {
            kr: {
                '억압의 공간': '억압의 공간',
                '마음의 바다 시련': '마음의 바다 시련',
                '흉몽의 문': '흉몽의 문'
            },
            en: {
                '억압의 공간': 'Realm of Repression',
                '마음의 바다 시련': 'Trials from the Sea of Souls',
                '흉몽의 문': 'Gates of the Nightmare Catcher'
            },
            jp: {
                '억압의 공간': '調伏の領域',
                '마음의 바다 시련': '心の海の試練',
                '흉몽의 문': '閼兇夢の扉'
            }
        };

        // 콘텐츠 대미지 순서: 억압의 공간, 흉몽의 문, 마음의 바다 시련
        const contentOrder = ['억압의 공간', '흉몽의 문', '마음의 바다 시련'];
        contentOrder.forEach(content => {
            if (buffs.contentDmg[content] && buffs.contentDmg[content] > 0) {
                const label = contentLabels[currentLang][content] || content;
                const dmgText = currentLang === 'en' ? 'damage' : (currentLang === 'jp' ? 'ダメージ' : '대미지');
                const icon = createIcon(`${base}/assets/img/stat-icon/대미지 보너스.png`, label);
                lines.push(`${icon}[${label}] ${dmgText} +${buffs.contentDmg[content].toFixed(1)}%`);
            }
        });

        // 스탯 버프 (공격력, 방어력, 생명, 효과 명중, 속도, 치료 효과 순서)
        const statLabels = {
            kr: {
                'attack': '공격력',
                'defense': '방어력',
                'HP': '생명',
                'ailment_accuracy': '효과 명중',
                'speed': '속도',
                'healing_effect': '치료 효과'
            },
            en: {
                'attack': 'Attack',
                'defense': 'Defense',
                'HP': 'HP',
                'ailment_accuracy': 'Ailment Accuracy',
                'speed': 'Speed',
                'healing_effect': 'Healing Effect'
            },
            jp: {
                'attack': '攻撃力',
                'defense': '防御力',
                'HP': 'HP',
                'ailment_accuracy': '状態異常命中',
                'speed': '速さ',
                'healing_effect': 'HP回復量'
            }
        };

        const statOrder = ['attack', 'defense', 'HP', 'ailment_accuracy', 'speed', 'healing_effect'];
        statOrder.forEach(stat => {
            if (buffs.stats[stat] && buffs.stats[stat] > 0) {
                const label = statLabels[currentLang][stat] || stat;
                let valueText = '';
                if (stat === 'speed') {
                    valueText = `+${buffs.stats[stat].toFixed(1)}`;
                } else if (stat === 'HP' || stat === 'attack' || stat === 'defense') {
                    valueText = `+${Math.floor(buffs.stats[stat])}`;
                } else {
                    valueText = `+${buffs.stats[stat].toFixed(1)}%`;
                }
                const iconName = stat === 'HP' ? '생명.png' : 
                                stat === 'attack' ? '공격력.png' :
                                stat === 'defense' ? '방어력.png' :
                                stat === 'ailment_accuracy' ? '효과 명중.png' :
                                stat === 'speed' ? '속도.png' :
                                stat === 'healing_effect' ? '치료 효과.png' : '';
                const icon = iconName ? createIcon(`${base}/assets/img/stat-icon/${iconName}`, label) : '';
                lines.push(`${icon}${label} ${valueText}`);
            }
        });

        // 페르소나 대미지
        if (buffs.personaDmg > 0) {
            const label = currentLang === 'en' ? 'Persona' : (currentLang === 'jp' ? 'ペルソナ' : '페르소나');
            const dmgText = currentLang === 'en' ? 'damage' : (currentLang === 'jp' ? 'ダメージ' : '대미지');
            const icon = createIcon(`${base}/assets/img/stat-icon/대미지 보너스.png`, label);
            lines.push(`${icon}${label} ${dmgText} +${buffs.personaDmg.toFixed(1)}%`);
        }

        // 주인공 대미지
        if (buffs.protagonistDmg > 0) {
            const label = currentLang === 'en' ? 'Protagonist' : (currentLang === 'jp' ? '主人公' : '주인공');
            const dmgText = currentLang === 'en' ? 'damage' : (currentLang === 'jp' ? 'ダメージ' : '대미지');
            const icon = createIcon(`${base}/assets/img/stat-icon/대미지 보너스.png`, label);
            lines.push(`${icon}${label} ${dmgText} +${buffs.protagonistDmg.toFixed(1)}%`);
        }

        // 속성 대미지 버프
        const elementLabels = {
            kr: {
                '물리': '물리',
                '총격': '총격',
                '화염': '화염',
                '염동': '염동',
                '빙결': '빙결',
                '핵열': '핵열',
                '전격': '전격',
                '축복': '축복',
                '질풍': '질풍',
                '주원': '주원'
            },
            en: {
                '물리': 'Physical',
                '총격': 'Gun',
                '화염': 'Fire',
                '염동': 'Psychokinesis',
                '빙결': 'Ice',
                '핵열': 'Nuclear',
                '전격': 'Electric',
                '축복': 'Bless',
                '질풍': 'Wind',
                '주원': 'Curse'
            },
            jp: {
                '물리': '物理',
                '총격': '銃撃',
                '화염': '火炎',
                '염동': '念動',
                '빙결': '氷結',
                '핵열': '核熱',
                '전격': '電撃',
                '축복': '祝福',
                '질풍': '疾風',
                '주원': '呪怨'
            }
        };

        Object.entries(buffs.elementDmg).forEach(([element, value]) => {
            if (value > 0) {
                const label = elementLabels[currentLang][element] || element;
                const dmgText = currentLang === 'en' ? 'damage' : (currentLang === 'jp' ? 'ダメージ' : '대미지');
                const icon = createIcon(`${base}/assets/img/skill-element/${element}.png`, label, true);
                lines.push(`${icon}${label} ${dmgText} +${value.toFixed(1)}%`);
            }
        });

        // 경험치 (마이 팰리스 레벨 경험치 증가) - 아이콘 없음
        if (buffs.exp > 0) {
            const expText = {
                kr: `마이 팰리스 레벨 경험치 ${Math.floor(buffs.exp)} 증가`,
                en: `Increases My Palace level experience by ${Math.floor(buffs.exp)}`,
                jp: `マイパレスレベル経験値${Math.floor(buffs.exp)}増加`
            };
            lines.push(expText[currentLang] || expText.kr);
        }

        // 체력 (매일 첫 접속 시 체력 포인트 추가 획득) - 아이콘 없음
        if (buffs.stamina > 0) {
            const staminaText = {
                kr: `매일 첫 접속 시 체력 ${Math.floor(buffs.stamina)}포인트 추가 획득`,
                en: `Restores ${Math.floor(buffs.stamina)} stamina after the first login of each day`,
                jp: `毎日初回ログイン時にスタミナ${Math.floor(buffs.stamina)}ポイント追加獲得`
            };
            lines.push(staminaText[currentLang] || staminaText.kr);
        }

        // 특수 버프 (영혼석 등) - 아이콘 없음
        if (buffs.special[3]) {
            const label = currentLang === 'en' ? 'Konpaku Gems' : (currentLang === 'jp' ? '魂魄石' : '영혼석');
            const prefixText = currentLang === 'en' ? '[Pursuit of Treasure]' : (currentLang === 'jp' ? '[財宝追加]' : '[재물 추가]');
            lines.push(`${prefixText} ${label} +${Math.floor(buffs.special[3])}`);
        }

        return lines;
    }

    // 모달 표시
    function showQEVELModal() {
        const lang = getCurrentLanguage();
        
        // 모달이 이미 있으면 제거
        const existingModal = document.getElementById('qevel-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 모달 생성
        const modal = document.createElement('div');
        modal.id = 'qevel-modal';
        modal.className = 'weapon-effect-modal show';

        const titleText = {
            kr: '마이팰리스 평점 (QEVEL)',
            en: 'My Palace Rating (QEVEL)',
            jp: 'マイパレス評価 (QEVEL)'
        };

        const inputLabelText = {
            kr: 'QEVEL 입력:',
            en: 'Enter QEVEL:',
            jp: 'QEVEL入力:'
        };

        const calculateText = {
            kr: '계산',
            en: 'Calculate',
            jp: '計算'
        };

        const closeText = {
            kr: '닫기',
            en: 'Close',
            jp: '閉じる'
        };

        modal.innerHTML = `
            <div class="weapon-effect-modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <span class="qevel-close weapon-effect-close">&times;</span>
                <div class="weapon-effect-header">
                    <h3>${titleText[lang] || titleText.kr}</h3>
                </div>
                <div style="padding: 0px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <label for="qevel-input" style="color: #d3bc8e; white-space: nowrap;">
                            ${inputLabelText[lang] || inputLabelText.kr}
                        </label>
                        <input 
                            type="number" 
                            id="qevel-input" 
                            name="qevel-input"
                            aria-label="${inputLabelText[lang] || inputLabelText.kr}"
                            min="0" 
                            max="500" 
                            value="0" 
                            style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-size: 16px;"
                        />
                    </div>
                    <div id="qevel-result" style="min-height: 100px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; color: #fff; line-height: 2.0; margin-top: 15px; font-size: 13px;">
                        <div style="opacity: 0.6; text-align: center;">${lang === 'en' ? 'Enter QEVEL to see buffs' : (lang === 'jp' ? 'QEVELを入力してバフを確認' : 'QEVEL을 입력하면 버프를 확인할 수 있습니다')}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // show 클래스 추가로 모달 표시
        // CSS에서 .weapon-effect-modal.show가 display: flex를 설정함
        modal.classList.add('show');

        // 입력 필드와 결과 영역
        const input = document.getElementById('qevel-input');
        const resultDiv = document.getElementById('qevel-result');

        // 로컬 스토리지에서 저장된 QEVEL 값 불러오기
        const savedQEVEL = localStorage.getItem('qevel-value');
        if (savedQEVEL) {
            input.value = savedQEVEL;
        }

        const updateResult = () => {
            const qevel = parseInt(input.value) || 0;
            
            // 로컬 스토리지에 저장
            if (qevel > 0) {
                localStorage.setItem('qevel-value', qevel.toString());
            } else {
                localStorage.removeItem('qevel-value');
            }
            
            const buffs = calculateBuffs(qevel);
            const lines = formatBuffResult(buffs, lang);

            if (lines.length === 0) {
                resultDiv.innerHTML = `<div style="opacity: 0.6; text-align: center;">${lang === 'en' ? 'No buffs' : (lang === 'jp' ? 'バフなし' : '버프 없음')}</div>`;
            } else {
                resultDiv.innerHTML = lines.map(line => `<div>${line}</div>`).join('');
            }
        };

        // 값 변경 시 자동 계산
        input.addEventListener('input', updateResult);
        input.addEventListener('change', updateResult);
        
        // 초기 로드 시 저장된 값이 있으면 계산
        if (savedQEVEL) {
            updateResult();
        }

        // 닫기 버튼 이벤트
        const closeBtn = modal.querySelector('.qevel-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });

        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });

        // ESC 키로 닫기
        const escHandler = (e) => {
            if (e.key === 'Escape' && modal.parentNode) {
                modal.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // 입력 필드에 포커스
        input.focus();
        input.select();
    }

    // 전역 노출
    window.showQEVELModal = showQEVELModal;
    window.calculateQEVELBuffs = calculateBuffs;
    window.formatQEVELResult = formatBuffResult;

})();

