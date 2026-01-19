// Object Click Handler - 오브젝트 클릭 및 획득 상태 관리

(function() {
    'use strict';

    // 적합성 아이콘 스타일 추가 (bosses.js와 완전히 일치)
    const style = document.createElement('style');
    style.textContent = `
        .elements-line { position: relative; display:inline-block; height: 40px; }
        .elements-line img.elements-sprite { height: 32px; display:block; }
        .el-mark { position:absolute; top: 24px; transform: translateX(-50%) skew(0deg); font-style: italic; font-weight:900; font-size:14px; color:#bbb; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 2px #000; }
        .el-mark.short { font-size:12px; }
        .el-mark.weak { color:#fff; }
    `;
    document.head.appendChild(style);

    window.ObjectClickHandler = {
        // 개수 세지 않을 아이콘인지 확인
        isNonCountableIcon(imageName) {
            if (window.nonInteractiveIconsData && window.nonInteractiveIconsData.non_countable_icons) {
                return window.nonInteractiveIconsData.non_countable_icons.includes(imageName);
            }
            return false;
        },

        // 오브젝트 클릭 상태 저장/로드
        getObjectClickedState(sn) {
            try {
                const clickedObjects = JSON.parse(localStorage.getItem('clickedObjects') || '{}');
                return clickedObjects[sn] === true;
            } catch (e) {
                return false;
            }
        },

        setObjectClickedState(sn, clicked) {
            try {
                const clickedObjects = JSON.parse(localStorage.getItem('clickedObjects') || '{}');
                if (clicked) {
                    clickedObjects[sn] = true;
                } else {
                    delete clickedObjects[sn];
                }
                localStorage.setItem('clickedObjects', JSON.stringify(clickedObjects));
            } catch (e) {
                console.warn('클릭 상태 저장 실패:', e);
            }
        },

        // 클릭 효과 적용 (채도 0, 어둡게)
        applyClickedEffect(sprite) {
            if (!sprite || sprite.destroyed) {
                console.warn('스프라이트가 없거나 파괴됨');
                return;
            }
            
            try {
                // PixiJS 버전에 따라 필터 경로가 다를 수 있음
                let ColorMatrixFilter;
                if (PIXI.filters && PIXI.filters.ColorMatrixFilter) {
                    ColorMatrixFilter = PIXI.filters.ColorMatrixFilter;
                } else if (PIXI.ColorMatrixFilter) {
                    ColorMatrixFilter = PIXI.ColorMatrixFilter;
                } else {
                    console.error('ColorMatrixFilter를 찾을 수 없습니다. PixiJS 필터가 로드되지 않았을 수 있습니다.');
                    return;
                }
                
                // ColorMatrixFilter를 사용하여 채도 0과 밝기 감소
                const colorMatrix = new ColorMatrixFilter();
                
                // 채도를 0으로 설정 (grayscale)
                colorMatrix.desaturate();
                
                // 밝기를 50%로 감소 (더 어둡게)
                // brightness(value, multiply) - multiply가 false면 덧셈, true면 곱셈
                // 0.5는 50% 밝기로 만들기 위해 곱셈 사용
                colorMatrix.brightness(0.5, true);
                
                // 필터 적용
                sprite.filters = [colorMatrix];
                
                // 필터가 제대로 적용되었는지 확인
                if (!sprite.filters || sprite.filters.length === 0) {
                    console.warn('필터 적용 실패 - filters 배열이 비어있음');
                } else {
                    // 필터 적용 후 렌더링 강제 업데이트
                    if (sprite.parent) {
                        sprite.parent.cacheAsBitmap = false;
                    }
                }
            } catch (e) {
                console.error('클릭 효과 적용 실패:', e);
            }
        },

        // 클릭 효과 제거
        removeClickedEffect(sprite) {
            if (!sprite || sprite.destroyed) return;
            sprite.filters = [];
        },

        // 적합성 아이콘 생성 (bosses.js 완전히 참조)
        buildAdaptSprite(adapt) {
            // 디버그: adapt 데이터 출력
            console.log('Adapt data:', adapt);
            
            // 언어 감지 함수
            function detectLang() {
                try {
                    const urlLang = new URLSearchParams(window.location.search).get('lang');
                    if (urlLang && ['kr','en','jp','cn','tw','sea'].includes(urlLang)) return urlLang;
                    const saved = localStorage.getItem('preferredLanguage');
                    if (saved && ['kr','en','jp','cn','tw','sea'].includes(saved)) return saved;
                    const nav = navigator.language || navigator.userLanguage;
                    if (nav) {
                        if (nav.startsWith('ko')) return 'kr';
                        if (nav.startsWith('ja')) return 'jp';
                        if (nav.startsWith('zh')) return 'cn';
                        if (nav.startsWith('en')) return 'en';
                    }
                } catch (e) {}
                return 'kr';
            }

            // elements sprite offsets (borrowed from cha_detail.js logic)
            function elementOffsetPx(krName) {
                const map = { '물리': 15, '총격': 43, '화염': 75, '빙결': 100, '전격': 124, '질풍': 149, '염동': 175, '핵열': 205, '축복': 235, '주원': 263 };
                return map[krName] || 0;
            }

            const elementNameMap = {
                Phys: '물리', Gun: '총격', Fire: '화염', Ice: '빙결', Electric: '전격',
                Wind: '질풍', Psychokinesis: '염동', Nuclear: '핵열', Bless: '축복', Curse: '주원'
            };

            const ADAPT_LABELS = {
                Weak:   { kr: '약', en: 'Wk',  jp: '弱',  cls: 'weak' },
                Resistant: { kr: '내', en: 'Res', jp: '耐',  cls: 'res' },
                Nullify:   { kr: '무', en: 'Nul', jp: '無',  cls: 'nul' },
                Absorb:    { kr: '흡', en: 'Abs', jp: '吸',  cls: 'abs' },
                Reflect:   { kr: '반', en: 'Rpl', jp: '反',  cls: 'rpl' },
            };

            const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
            const lang = detectLang();
            const wrap = document.createElement('div');
            wrap.className = 'elements-line';
            const img = document.createElement('img');
            img.className = 'elements-sprite';
            img.alt = 'elements';
            img.src = `${BASE}/assets/img/character-detail/elements.png`;
            
            // 이미지 로드 실패 시 대체 처리
            img.onerror = function() {
                this.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.textContent = '속성';
                fallback.style.cssText = 'height: 32px; display: flex; align-items: center; justify-content: center; background: #333; color: #999; font-size: 12px; border-radius: 4px;';
                this.parentNode.insertBefore(fallback, this);
            };
            
            wrap.appendChild(img);

            Object.keys(ADAPT_LABELS).forEach(key => {
                // 한글 키를 영문 키로 변환
                const keyMap = {
                    '약': 'Weak',
                    '내': 'Resistant', 
                    '무': 'Nullify',
                    '반': 'Reflect',
                    '흡': 'Absorb'
                };
                
                // adapt 데이터에서 한글 키로 찾아보고, 없으면 영문 키로도 찾아보기
                let list = [];
                if (adapt) {
                    // 한글 키로 먼저 시도
                    const krKey = Object.keys(keyMap).find(k => keyMap[k] === key);
                    if (krKey && adapt[krKey]) {
                        list = adapt[krKey];
                    } else if (adapt[key]) {
                        // 영문 키로 시도
                        list = adapt[key];
                    }
                }
                
                const labelInfo = ADAPT_LABELS[key];
                const text = (lang === 'en' ? labelInfo.en : (lang === 'jp' ? labelInfo.jp : labelInfo.kr));
                (list || []).forEach(enName => {
                    const kr = elementNameMap[enName] || enName;
                    const x = elementOffsetPx(kr);
                    const mark = document.createElement('span');
                    mark.className = `el-mark ${labelInfo.cls}`;
                    mark.textContent = text;
                    mark.title = `${key}: ${kr}`;
                    mark.style.left = `${x}px`;
                    if (text.length <= 3) mark.classList.add('short');
                    wrap.appendChild(mark);
                });
            });
            return wrap;
        },

        // 적 데이터 모달 표시
        showEnemyModal(enemyData, sprite) {
            if (!enemyData) return;

            // i18n 텍스트
            const i18n = {
                title: { kr: '적 정보', en: 'Enemy Info', jp: '敵情報', cn: '敌人信息', tw: '敵人資訊', sea: 'Enemy Info' },
                defeated: { kr: '처치 완료', en: 'Defeated', jp: '討伐完了', cn: '击败完成', tw: '擊敗完成', sea: 'Defeated' },
                undo: { kr: '되돌리기', en: 'Undo', jp: '元に戻す', cn: '撤销', tw: '復原', sea: 'Undo' }
            };

            // 언어 감지
            function detectLang() {
                try {
                    const urlLang = new URLSearchParams(window.location.search).get('lang');
                    if (urlLang && ['kr','en','jp','cn','tw','sea'].includes(urlLang)) return urlLang;
                    const saved = localStorage.getItem('preferredLanguage');
                    if (saved && ['kr','en','jp','cn','tw','sea'].includes(saved)) return saved;
                    const nav = navigator.language || navigator.userLanguage;
                    if (nav) {
                        if (nav.startsWith('ko')) return 'kr';
                        if (nav.startsWith('ja')) return 'jp';
                        if (nav.startsWith('zh')) return 'cn';
                        if (nav.startsWith('en')) return 'en';
                    }
                } catch (e) {}
                return 'kr';
            }
            const lang = detectLang();
            const getText = (key) => i18n[key][lang] || i18n[key]['en'];

            // 모달 오버레이 생성
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            `;

            // 모달 컨테이너 생성
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                max-width: 600px;
                max-height: 80vh;
                width: 100%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            `;

            // 모달 헤더
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #333;
            `;

            const title = document.createElement('h3');
            title.textContent = getText('title');
            title.style.cssText = `
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #fff;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: #999;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            `;
            closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
            closeBtn.onmouseout = () => closeBtn.style.color = '#999';

            header.appendChild(title);
            header.appendChild(closeBtn);

            // 모달 컨텐츠
            const content = document.createElement('div');
            content.style.cssText = `
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
            `;

            // 버튼 영역 생성 (나중에 위치 조정)
            let buttonArea = null;
            if (sprite && sprite.objectSn) {
                buttonArea = document.createElement('div');

                const isClicked = this.getObjectClickedState(sprite.objectSn);

                const actionBtn = document.createElement('button');
                actionBtn.style.cssText = `
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: ${isClicked ? '#444' : '#730000'};
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                `;

                // 오브젝트 아이콘 추가
                if (sprite.objectImage) {
                    const iconImg = document.createElement('img');
                    const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
                    iconImg.src = `${BASE}/apps/maps/yishijie-icon/${sprite.objectImage}`;
                    iconImg.style.cssText = `
                        width: 24px;
                        height: 24px;
                        object-fit: contain;
                    `;
                    iconImg.onerror = () => { iconImg.style.display = 'none'; };
                    actionBtn.appendChild(iconImg);
                }

                const btnText = document.createElement('span');
                btnText.textContent = isClicked ? getText('undo') : getText('defeated');
                actionBtn.appendChild(btnText);

                actionBtn.onmouseenter = () => {
                    actionBtn.style.background = isClicked ? '#555' : '#8a0000';
                };
                actionBtn.onmouseleave = () => {
                    actionBtn.style.background = isClicked ? '#444' : '#730000';
                };

                actionBtn.onclick = () => {
                    const newState = !isClicked;
                    this.setObjectClickedState(sprite.objectSn, newState);

                    if (newState) {
                        this.applyClickedEffect(sprite);
                    } else {
                        this.removeClickedEffect(sprite);
                    }

                    // 필터 패널 개수 업데이트
                    const isNonCountable = this.isNonCountableIcon(sprite.objectImage || '');
                    if (!isNonCountable && window.ObjectFilterPanel && sprite.objectType) {
                        window.ObjectFilterPanel.updateTypeCount(sprite.objectType, sprite.objectSn, newState);
                    }

                    // 모달 닫기
                    document.body.removeChild(overlay);
                };

                buttonArea.appendChild(actionBtn);
            }

            // 1. 튜토리얼 정보 (상단)
            if (enemyData.tutorial) {
                const tutorialDiv = document.createElement('div');
                tutorialDiv.style.cssText = `
                    order: 0;
                    margin-bottom: 16px;
                    padding: 16px;
                    background: rgb(15,15,15);
                    border-radius: 8px;
                    border-bottom: 3px solid #730000;
                `;

                const tutorialTitle = document.createElement('h4');
                tutorialTitle.textContent = enemyData.tutorial.title;
                tutorialTitle.style.cssText = `
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                `;
                tutorialDiv.appendChild(tutorialTitle);

                const tutorialContent = document.createElement('div');
                tutorialContent.innerHTML = enemyData.tutorial.content.replace(/\n/g, '<br>');
                tutorialContent.style.cssText = `
                    font-size: 14px;
                    color: #ccc;
                    line-height: 1.5;
                `;
                tutorialDiv.appendChild(tutorialContent);

                content.appendChild(tutorialDiv);
            }

            // 2. 적 정보 렌더링
            const enemiesWrapper = document.createElement('div');
            enemiesWrapper.style.cssText = `
                order: 1;
            `;
            enemyData.enemies.forEach((enemyGroup, groupIndex) => {
                if (Array.isArray(enemyGroup)) {
                    enemyGroup.forEach(enemy => {
                        const enemyDiv = document.createElement('div');
                        enemyDiv.style.cssText = `
                            margin-bottom: 20px;
                            padding: 16px;
                            background: #0f0f0f;
                            border-radius: 8px;
                        `;

                        // 적 이름, 레벨, HP (PC에서는 같은 행)
                        const infoRow = document.createElement('div');
                        infoRow.style.cssText = `
                            display: flex;
                            flex-wrap: wrap;
                            align-items: baseline;
                            gap: 8px 16px;
                            margin-bottom: 12px;
                        `;

                        const nameSpan = document.createElement('span');
                        nameSpan.style.cssText = `
                            font-size: 16px;
                            font-weight: 600;
                            color: #fff;
                        `;
                        nameSpan.textContent = `${enemy.name} (Lv.${enemy.level})`;
                        infoRow.appendChild(nameSpan);

                        const hpSpan = document.createElement('span');
                        hpSpan.style.cssText = `
                            font-size: 14px;
                            color: #ccc;
                        `;
                        hpSpan.textContent = `HP: ${Math.round(enemy.stat.HP).toLocaleString()}`;
                        infoRow.appendChild(hpSpan);

                        enemyDiv.appendChild(infoRow);

                        // 적합성
                        if (enemy.adapt) {
                            const adaptDiv = document.createElement('div');
                            adaptDiv.style.cssText = `
                                margin-bottom: 0px;
                            `;
                            const adaptSprite = this.buildAdaptSprite(enemy.adapt);
                            adaptDiv.appendChild(adaptSprite);
                            enemyDiv.appendChild(adaptDiv);
                        }

                        enemiesWrapper.appendChild(enemyDiv);
                    });
                }
            });
            content.appendChild(enemiesWrapper);

            // 3. 버튼 영역 추가 (PC: 맨 아래, 모바일: 맨 위)
            if (buttonArea) {
                // PC (768px 이상): order 2로 맨 아래, 모바일: order -1로 맨 위
                const isMobile = window.innerWidth < 1200;
                buttonArea.style.order = isMobile ? '-1' : '2';
                buttonArea.style.marginBottom = isMobile ? '16px' : '0';
                buttonArea.style.marginTop = isMobile ? '0' : '16px';
                content.appendChild(buttonArea);
            }

            // 조립
            modal.appendChild(header);
            modal.appendChild(content);
            overlay.appendChild(modal);

            // 이벤트 핸들러
            closeBtn.onclick = () => document.body.removeChild(overlay);
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            };

            // 모달 표시
            document.body.appendChild(overlay);
        },

        // 모든 적의 레벨이 1인지 확인
        isAllEnemiesLevel1(enemyData) {
            if (!enemyData || !enemyData.enemies || !Array.isArray(enemyData.enemies)) {
                return false;
            }

            // enemies 배열의 모든 웨이브(그룹)를 순회
            for (const wave of enemyData.enemies) {
                if (!Array.isArray(wave)) continue;
                for (const enemy of wave) {
                    // 레벨이 "1"이 아니면 false 반환
                    if (enemy.level !== "1" && enemy.level !== 1) {
                        return false;
                    }
                }
            }
            return true;
        },

        // 오브젝트 클릭 토글 (수정)
        toggleObjectClicked(sprite) {
            if (!sprite || !sprite.objectSn) {
                console.warn('스프라이트 또는 SN이 없음:', { sprite: !!sprite, sn: sprite?.objectSn });
                return;
            }

            // 개수 세지 않는 아이콘인지 확인
            const isNonCountable = this.isNonCountableIcon(sprite.objectImage || '');

            // enemy_data가 있는 경우 처리
            if (sprite.debugInfo && sprite.debugInfo.enemyData) {
                const enemyData = sprite.debugInfo.enemyData;

                // 모든 적의 레벨이 1이면 모달 없이 바로 토글
                if (this.isAllEnemiesLevel1(enemyData)) {
                    const isClicked = this.getObjectClickedState(sprite.objectSn);
                    const newState = !isClicked;

                    this.setObjectClickedState(sprite.objectSn, newState);

                    if (newState) {
                        this.applyClickedEffect(sprite);
                    } else {
                        this.removeClickedEffect(sprite);
                    }

                    // 필터 패널 개수 업데이트
                    if (!isNonCountable && window.ObjectFilterPanel && sprite.objectType) {
                        window.ObjectFilterPanel.updateTypeCount(sprite.objectType, sprite.objectSn, newState);
                    }
                    return;
                }

                // 레벨 1이 아닌 적이 있으면 모달 표시
                this.showEnemyModal(enemyData, sprite);
                return;
            }

            // 기존 로직 (일반 오브젝트 및 non_countable 아이콘)
            const isClicked = this.getObjectClickedState(sprite.objectSn);
            const newState = !isClicked;

            this.setObjectClickedState(sprite.objectSn, newState);

            if (newState) {
                this.applyClickedEffect(sprite);
            } else {
                this.removeClickedEffect(sprite);
            }

            // 필터 패널 개수 업데이트 (non_countable 아이콘은 개수 업데이트 제외)
            if (!isNonCountable && window.ObjectFilterPanel && sprite.objectType) {
                window.ObjectFilterPanel.updateTypeCount(sprite.objectType, sprite.objectSn, newState);
            }
        },

        // 오브젝트 로드 시 저장된 상태 복원
        restoreClickedState(sprite) {
            if (!sprite || !sprite.objectSn) return;
            
            const clickedState = this.getObjectClickedState(sprite.objectSn);
            if (clickedState) {
                this.applyClickedEffect(sprite);
            }
        }
    };
})();
