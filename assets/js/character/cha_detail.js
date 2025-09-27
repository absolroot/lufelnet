document.addEventListener('DOMContentLoaded', () => {
    // 안전 실행 유틸리티: 개별 블록에서 에러가 나도 이후 로직이 계속 진행되도록 보장
    const safeRun = (name, fn) => {
        try { return fn && fn(); } catch (e) { console.warn(`[SAFE:${name}]`, e); }
    };
    const safeAddEvent = (el, evt, handler, name = 'event') => {
        try {
            if (el && el.addEventListener) {
                el.addEventListener(evt, (...args) => {
                    try { handler && handler(...args); } catch (e) { console.warn(`[SAFE:${name}:${evt}]`, e); }
                });
            }
        } catch (e) { console.warn(`[SAFE:addEvent:${name}]`, e); }
    };
    
    // 현재 언어 가져오기 함수
    function getCurrentLanguage() {
        // 먼저 쿼리 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'en') return 'en';
        if (langParam === 'jp') return 'jp';
        
        // 쿼리 파라미터가 없으면 경로 확인
        const path = window.location.pathname;
        if (path.includes('/en/')) return 'en';
        if (path.includes('/jp/')) return 'jp';
        return 'kr';
    }

    // 현재 언어별 계시 이름 번역 함수
    function translateRevelationName(koreanName, isMainRevelation = false) {
        const currentLang = getCurrentLanguage();
        
        if (currentLang === 'en' && typeof window.enRevelationData !== 'undefined') {
            if (isMainRevelation && window.enRevelationData.mainTranslated && window.enRevelationData.mainTranslated[koreanName]) {
                return window.enRevelationData.mainTranslated[koreanName];
            } else if (!isMainRevelation && window.enRevelationData.subTranslated && window.enRevelationData.subTranslated[koreanName]) {
                return window.enRevelationData.subTranslated[koreanName];
            }
        } else if (currentLang === 'jp' && typeof window.jpRevelationData !== 'undefined') {
            if (isMainRevelation && window.jpRevelationData.mainTranslated && window.jpRevelationData.mainTranslated[koreanName]) {
                return window.jpRevelationData.mainTranslated[koreanName];
            } else if (!isMainRevelation && window.jpRevelationData.subTranslated && window.jpRevelationData.subTranslated[koreanName]) {
                return window.jpRevelationData.subTranslated[koreanName];
            }
        }
        
        return koreanName; // 번역이 없으면 원본 반환
    }

    // 세팅 정보 채우기
    function fillSettingsInfo(character) {
        // 요구 스탯
        const statLevels = document.querySelectorAll('.stat-level');
        const levels = character.rarity === 4 
            ? ['LV12', 'LV12+5']  // 4성 캐릭터
            : ['LV10', 'LV10+5', 'LV13', 'LV13+5']; // 5성 캐릭터
        


        const validStats = [
            '공격력', '방어력', '효과 명중', '효과명중', '생명', 
            '크리티컬 확률', '크리티컬 확률', '크리티컬 효과', '크리티컬 효과', 
            '속도', '대미지보너스', '데미지보너스', '대미지 보너스', '데미지 보너스', 
            '관통', '치료효과', '치료 효과', 'SP회복', 'SP 회복'
        ];

        // 불필요한 레벨 요소 숨기기
        statLevels.forEach((level, index) => {
            if (index < levels.length) {
                level.style.display = '';  // 표시
                level.querySelector('.label').textContent = levels[index];

                // +5 → +5심상 (언어별 번역)
                if (levels[index].endsWith('+5')) {
                    const currentLang = getCurrentLanguage();
                    const mindTexts = {
                        'kr': '심상 5',
                        'en': 'Minds 5',
                        'jp': 'イメジャリー 5'
                    };
                    level.querySelector('.label').textContent = levels[index].slice(0, -1) + (mindTexts[currentLang] || '심상 5');
                }
                const valueElement = level.querySelector('.value');
                let statValue = character.minimum_stats[levels[index]] || '-';
                if(character.minimum_stats_glb && currentLang != 'kr'){
                    statValue = character.minimum_stats_glb[levels[index]] || '-';
                }
                
                if (statValue !== '-') {
                    // 콤마로 구분된 여러 스탯을 처리
                    const stats = statValue.split(',').map(stat => stat.trim());
                    const highlightedText = stats.map(stat => {
                        // 각 스탯 문자열에서 유효한 스탯을 찾아 강조
                        let processed = stat;
                        validStats.forEach(validStat => {
                            const regex = new RegExp(`(${validStat})`, 'g');
                            processed = processed.replace(regex, '<span class="valid-stat">$1</span>');
                        });
                        return processed;
                    }).join('<br>');
                    
                    valueElement.innerHTML = highlightedText;
                } else {
                    valueElement.textContent = '-';
                }
            } else {
                level.style.display = 'none';  // 숨김
            }
        });

        // 권장 스탯이 전부 '-'인 경우 전체 섹션 숨김
        try {
            const statValueEls = Array.from(document.querySelectorAll('.stat-level .value'))
                .filter(el => {
                    const row = el.closest('.stat-level');
                    if (!row) return false;
                    const style = window.getComputedStyle(row);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                });
            const allDash = statValueEls.length > 0 && statValueEls.every(el => (el.textContent || '').trim() === '-');
            if (allDash) {
                const statsReq = document.querySelector('.stats-requirements');
                if (statsReq) statsReq.style.display = 'none';
            }
        } catch (_) {}

        // battle-plus stats는 character.html에서 처리

        // 계시 세트
        const mainRevelationValue = document.querySelector('.main-revelation .value');
        const subRevelationValue = document.querySelector('.sub-revelation .value');

        // 메인 계시 설정
        if (character.main_revelation && Array.isArray(character.main_revelation)) {
            mainRevelationValue.textContent = '';
            mainRevelationValue.appendChild(createRevelationValue(character.main_revelation, true));
        } else {
            mainRevelationValue.textContent = '-';
        }

        // 서브 계시 설정
        if (character.sub_revelation && Array.isArray(character.sub_revelation)) {
            subRevelationValue.textContent = '';
            subRevelationValue.appendChild(createRevelationValue(character.sub_revelation, false));
        } else {
            subRevelationValue.textContent = '-';
        }

        // 계시 주옵션
        const mainOptions = [
            { label: '일', value: '생명' },
            { label: '월', values: character.sub_revel2 },
            { label: '성', values: character.sub_revel3 },
            { label: '진', values: character.sub_revel4 }
        ];

        document.querySelectorAll('.main-options .option-row').forEach((row, index) => {
            const option = mainOptions[index];
            const valueElement = row.querySelector('.value');
            if (Array.isArray(option.values)) {
                valueElement.textContent = option.values.length > 0 ? option.values.join(', ') : '-';
            } else {
                valueElement.textContent = option.value || '-';
            }
        });

        // 계시 부옵션
        const subOptionRows = document.querySelectorAll('.sub-options .option-row');
        [character.sub_option1, character.sub_option2, character.sub_option3].forEach((option, index) => {
            const valueElement = subOptionRows[index].querySelector('.value');
            valueElement.textContent = Array.isArray(option) && option.length > 0 ? option.join(', ') : '-';
        });

        // 스킬 레벨
        const skillLevels = [
            character.skill1_lv,
            character.skill2_lv,
            character.skill3_lv,
            character.skill4_lv
        ];
        document.querySelectorAll('.skill-levels .skill-level .value').forEach((element, index) => {
            let value = skillLevels[index] || '-';
            if (value.endsWith('!')) {
                value = value.slice(0, -1);
                
                // 컨테이너 생성
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '8px';
                
                // 텍스트 요소
                const textSpan = document.createElement('span');
                textSpan.textContent = value;
                textSpan.style.color = '#d3bc8e';
                
                // 마크 이미지
                const markImg = document.createElement('img');
                markImg.src = `${BASE_URL}/assets/img/character-detail/mark.png`;
                markImg.alt = '추천';
                markImg.style.width = '16px';
                markImg.style.height = '16px';
                
                // 요소들을 컨테이너에 추가
                container.appendChild(textSpan);
                container.appendChild(markImg);
                
                // 기존 element의 내용을 새 컨테이너로 교체
                element.textContent = '';
                element.appendChild(container);
            }
            else if (value.endsWith('×')) {
                value = value.slice(0, -1);
                element.style.textDecoration = 'line-through';
                element.style.color = '#777';
                element.textContent = value;
            }
            else {
                element.style.color = ''; // 기본 색상으로 복원
                element.textContent = value;
            }
        });

        // 심상
        const mindFields = [
            { element: '.mind-stats .stat-row:nth-child(1) .value', value: character.mind_stats1 },
            { element: '.mind-stats .stat-row:nth-child(2) .value', value: character.mind_stats2 },
            { element: '.mind-skills .skill-row:nth-child(1) .value', value: character.mind_skill1 },
            { element: '.mind-skills .skill-row:nth-child(2) .value', value: character.mind_skill2 }
        ];

        mindFields.forEach(field => {
            const element = document.querySelector(field.element);
            let value = field.value || '-';
            
            if (value.endsWith('!')) {
                value = value.slice(0, -1);
                element.style.color = '#d3bc8e';
                
                // 컨테이너 생성
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '8px';
                
                // 텍스트 요소
                const textSpan = document.createElement('span');
                textSpan.textContent = value;
                textSpan.style.color = '#d3bc8e';
                
                // 마크 이미지
                const markImg = document.createElement('img');
                markImg.src = `${BASE_URL}/assets/img/character-detail/mark.png`;
                markImg.alt = '추천';
                markImg.style.width = '16px';
                markImg.style.height = '16px';
                
                // 요소들을 컨테이너에 추가
                container.appendChild(textSpan);
                container.appendChild(markImg);
                
                // 기존 element의 내용을 새 컨테이너로 교체
                element.textContent = '';
                element.appendChild(container);
            }
            else if (value.endsWith('×')) {
                value = value.slice(0, -1);
                element.style.textDecoration = 'line-through';
                element.style.color = '#777';
                element.textContent = value;
            }
            else {
                element.style.color = ''; // 기본 색상으로 복원
                element.textContent = value;
            }
        });

        // 레어도 섹션 설정
        const raritySection = document.querySelector('.rarity-section');
        if (character.rarity) {
            raritySection.style.display = 'flex';
            raritySection.style.gap = '2px';
            raritySection.style.alignItems = 'center'; // 세로 가운데 정렬
            
            const starCount = character.rarity;
            const starType = character.rarity === 4 ? 'star4.png' : 'star5.png';
            
            // 기존 내용 제거
            raritySection.innerHTML = '';
            
            // 별 이미지 추가
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('img');
                star.src = `${BASE_URL}/assets/img/character-detail/${starType}`;
                star.alt = '★';
                star.style.width = '20px';
                star.style.height = '20px';
                raritySection.appendChild(star);
            }

            // 한정 여부 아이콘을 rarity-section 내부(오른쪽)에 추가
            try {
                // 기존 아이콘 제거 (중복 방지)
                const oldIcon = raritySection.querySelector('img.limit-icon');
                if (oldIcon) oldIcon.remove();

                const limitImg = document.createElement('img');
                limitImg.className = 'limit-icon';
                limitImg.src = `${BASE_URL}/assets/img/character-detail/${character.limit ? 'limit.png' : 'limit_non.png'}`;
                limitImg.alt = character.limit ? 'limit' : 'non_limit';
                limitImg.style.width = '26px';
                limitImg.style.margin = '4px 0 0 6px';

                raritySection.appendChild(limitImg);
            } catch(_) {}
        }

        // 속성 위치 계산
        function setElementPositions(elementType) {
            const elementPositions = {
                '물리': 9,
                '총격': 43,
                '화염': 86,
                '빙결': 118,
                '전격': 148,
                '질풍': 180,
                '염동': 213,
                '핵열': 251,
                '축복': 289,
                '주원': 323
            };
            return elementPositions[elementType] || 0;
        }

        // 캐릭터 데이터 로드 후 실행되는 부분에 추가
        const resistanceIcon = document.querySelector('.resistance-icon');
        const weaknessIcon = document.querySelector('.weakness-icon');

        if (resistanceIcon && character.element_resistance) {
            resistanceIcon.style.display = 'block';
            resistanceIcon.style.left = setElementPositions(character.element_resistance) + 'px';
        }

        if (weaknessIcon && character.element_weakness) {
            weaknessIcon.style.display = 'block';
            weaknessIcon.style.left = setElementPositions(character.element_weakness) + 'px';
        }

        // 계시 툴팁 적용
        if (typeof addTooltips === 'function') {
            addTooltips();
        } else {
            // addTooltips 함수가 아직 로드되지 않았으면 지연 실행
            setTimeout(() => {
                if (typeof addTooltips === 'function') {
                    addTooltips();
                }
            }, 100);
        }
    }

    // URL에서 캐릭터 이름을 가져와서 현재 페이지 표시
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('name');
    
    if (characterName && characterData[characterName]) {
        const character = characterData[characterName];
        
        // 페르소나3 캐릭터 스타일/텍스트 적용 (안전 실행)
        safeRun('persona3-css-and-text', () => {
            if (character.persona3) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `${BASE_URL}/assets/css/persona3r.css`;
                document.head.appendChild(link);
                const codeNameEl = document.querySelector('.code-name');
                if (codeNameEl) codeNameEl.style.display = 'none';
                const seesEl = document.querySelector('.sees');
                if (seesEl) seesEl.style.display = 'block';
                const hl = document.querySelector('[data-text="highlight"]');
                if (hl) hl.textContent = '테우르기아';
            } else {
                const hl = document.querySelector('[data-text="highlight"]');
                if (hl) hl.textContent = '하이라이트';
            }
        });

        // 페르소나5 콜라보 스타일 적용 (안전 실행)
        safeRun('persona5-css', () => {
            if (character.persona5) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `${BASE_URL}/assets/css/persona5r.css`;
                document.head.appendChild(link);
            }
        });

        // 주요 데이터 렌더링 호출들을 안전 실행으로 래핑
        safeRun('fillSettingsInfo', () => fillSettingsInfo(character));
        safeRun('fillOperationInfo', () => fillOperationInfo(characterName));
        safeRun('updateSkillLevelItems', updateSkillLevelItems);
        safeRun('updateMindItems', updateMindItems);
        const currentPage = document.querySelector('.current-page');
        const currentLang = getCurrentLanguage();
        let characterDisplayName = characterData[characterName].name;
        
        // 언어별 캐릭터명 설정
        if (currentLang === 'en' && characterData[characterName].name_en) {
            characterDisplayName = characterData[characterName].name_en;
        } else if (currentLang === 'jp' && characterData[characterName].name_jp) {
            characterDisplayName = characterData[characterName].name_jp;
        }
        
        currentPage.textContent = characterDisplayName;

        // role과 tag 정보 채우기
        const roleElement = document.querySelector('.chracter-role');
        const tagElement = document.querySelector('.chracter-tag');
    


        if(currentLang === 'en' && character.role_en)
        {
            roleElement.textContent = character.role_en;
        }
        else if(currentLang === 'jp' && character.role_jp)
        {
            roleElement.textContent = character.role_jp;
        }

        tagElement.textContent = character.tag;

        if (currentLang === 'en' && character.tag_en)
        {
            tagElement.textContent = character.tag_en;
        }
        else if(currentLang === 'jp' && character.tag_jp)
        {
            tagElement.textContent = character.tag_jp;
        }

        // role 정보 채우기
        if (character.role && currentLang === 'kr') {
            roleElement.textContent = character.role;
        }

        // tag 정보 채우기
        if (tagElement.textContent) {

            // 콤마로 분리하여 각각의 태그를 생성
            const tags = tagElement.textContent.split(',').map(tag => tag.trim());
            tagElement.innerHTML = '';
            tags.forEach(tag => {
                if (tag) {  // 빈 문자열이 아닌 경우에만 추가
                    const tagDiv = document.createElement('div');
                    tagDiv.className = 'tag-item';
                    tagDiv.textContent = tag;
                    tagElement.appendChild(tagDiv);
                }
            });
        }
    }
    

    // 의식 탭 기능
    safeRun('ritual-tab-events', () => {
        document.querySelectorAll('.ritual-tab').forEach(tab => {
            safeAddEvent(tab, 'click', () => {
                const activeTab = document.querySelector('.ritual-tab.active');
                if (activeTab) activeTab.classList.remove('active');
                const activeImg = document.querySelector('.ritual-image.active');
                if (activeImg) activeImg.classList.remove('active');
                tab.classList.add('active');
                const ritualLevel = tab && tab.dataset ? tab.dataset.ritual : undefined;
                const img = ritualLevel ? document.querySelector(`.ritual-image[src*="ritual${ritualLevel}.png"]`) : null;
                if (img) img.classList.add('active');
            }, 'ritualTab');
        });
    });

    // 스킬레벨 아이템 개수 표시
    function updateSkillLevelItems() {
        const skillLevels = document.querySelectorAll('.skill-levels .skill-level .value');        
        
        const maxCount = Array.from(skillLevels).filter(el => {
            // span 요소가 있는지 확인
            const span = el.querySelector('span');
            if (span) {
                const computedStyle = window.getComputedStyle(span);
                return computedStyle.color === 'rgb(211, 188, 142)';
            }
            // 직접적인 텍스트 내용 확인
            return el.textContent !== '-' && el.textContent.includes('!');
        }).length;

        const skillHeader = document.querySelector('.skill-mind-settings .setting-section:first-child h3');
        
        if (!skillHeader) return;
        
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-count';
        
        // 욕망의 나무 이미지와 개수 추가
        const goldenRoseCount = maxCount * 2;
        
        if (goldenRoseCount > 0) {
            const itemWithCount = document.createElement('div');
            itemWithCount.className = 'item-with-count';
            
            const itemImg = document.createElement('img');
            itemImg.src = `${BASE_URL}/assets/img/character-detail/item-goldenrose.png`;
            itemImg.alt = '욕망의 나무';
            
            const itemCount = document.createElement('span');
            itemCount.textContent = `${goldenRoseCount}`;
            
            itemWithCount.appendChild(itemImg);
            itemWithCount.appendChild(itemCount);
            itemContainer.appendChild(itemWithCount);
        }
        
        skillHeader.appendChild(itemContainer);
    }


    // 심상 아이템 개수 표시
    function updateMindItems() {
        const mindSkills = [
            document.querySelector('.mind-skills .skill-row:nth-child(1) .value'),
            document.querySelector('.mind-skills .skill-row:nth-child(2) .value')
        ];
        
        const mindStats = [
            document.querySelector('.mind-stats .stat-row:nth-child(1) .value'),
            document.querySelector('.mind-stats .stat-row:nth-child(2) .value')
        ];

        const skillCount = mindSkills.filter(el => 
            el && 
            el.textContent !== '-' && 
            (el.textContent.includes('!') || el.style.color === 'rgb(211, 188, 142)')
        ).length;
        
        const statCount = mindStats.filter(el => 
            el && 
            el.textContent !== '-' && 
            (el.textContent.includes('!') || el.style.color === 'rgb(211, 188, 142)')
        ).length;
        
        const mindHeader = document.querySelector('.skill-mind-settings .setting-section:last-child h3');
        
        if (!mindHeader) return;
        
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-count';
        
        // 스킬 아이템 추가
        if (skillCount > 0) {
            const skillItem1 = createItemElement('item-mind_skill1.png', skillCount * 155);
            const skillItem2 = createItemElement('item-mind_skill2.png', skillCount * 5);
            itemContainer.appendChild(skillItem1);
            itemContainer.appendChild(skillItem2);
        }
        
        // 스탯 아이템 추가
        if (statCount > 0) {
            const statItem1 = createItemElement('item-mind_stat1.png', statCount * 220);
            const statItem2 = createItemElement('item-mind_stat2.png', statCount * 21);
            itemContainer.appendChild(statItem1);
            itemContainer.appendChild(statItem2);
        }
        
        mindHeader.appendChild(itemContainer);
    }

    // 아이템 요소 생성 헬퍼 함수
    function createItemElement(imageName, count) {
        const container = document.createElement('div');
        container.className = 'item-with-count';
        
        const img = document.createElement('img');
        img.src = `${BASE_URL}/assets/img/character-detail/${imageName}`;
        img.alt = '아이템';
        
        const countSpan = document.createElement('span');
        countSpan.textContent = `${count}`;
        
        container.appendChild(img);
        container.appendChild(countSpan);
        return container;
    }

    // 계시 값을 분리하고 각각에 아이콘을 추가하도록 수정
    function createRevelationValue(revelations, isMainRevelation = false) {
        if (!revelations || revelations.length === 0) return '-';
        
        const container = document.createElement('div');
        container.className = 'revelation-values';
        
        revelations.forEach(revelation => {
            const item = document.createElement('div');
            item.className = 'revelation-value-item tooltip-text';
            
            const text = document.createElement('span');
            // 번역된 이름으로 표시
            let translatedName = translateRevelationName(revelation, isMainRevelation);
            // 6글자 넘어가면 4글자까지만 보여주고 ".." 붙여서 6글자로 만들기
            if (translatedName.length > 6) {
                translatedName = translatedName.substring(0, 4) + '..';
            }
            text.textContent = translatedName;
            
            const icon = document.createElement('img');
            // 아이콘은 항상 한국어 이름(원본)으로 경로 설정
            icon.src = `${BASE_URL}/assets/img/character-detail/revel/${revelation}.webp`;
            icon.alt = revelation;
            icon.className = 'revelation-icon';
            
            if (!isMainRevelation) {
                // 일월성진 효과 데이터
                const currentLang = getCurrentLanguage();
                let effectData, set2Text, set4Text;
                
                // 언어별 효과 데이터 사용
                // 현재 언어에 맞는 번역 데이터 가져오기
                let translationData = null;
                if (currentLang === 'en' && window.enRevelationData) {
                    translationData = window.enRevelationData;
                } else if (currentLang === 'jp' && window.jpRevelationData) {
                    translationData = window.jpRevelationData;
                }
                
                /* console.log('일월성진 효과 디버깅:', {
                    revelation: revelation,
                    currentLang: currentLang,
                    hasTranslationData: !!translationData,
                    translationDataKeys: translationData ? Object.keys(translationData.sub_effects || {}) : []
                });*/
                
                if (currentLang === 'en' && translationData && translationData.sub_effects) {
                    // 한국어 키를 영어 키로 변환
                    const englishKey = translateRevelationName(revelation, false);
                    // console.log('영어 키 변환:', revelation, '→', englishKey);
                    
                    if (translationData.sub_effects[englishKey]) {
                        effectData = translationData.sub_effects[englishKey];
                        set2Text = effectData.set2;
                        set4Text = effectData.set4;
                        setTypes = effectData.type;
                        // console.log('영어 효과 데이터 사용:', effectData);
                    } else {
                        //console.log('영어 효과 데이터 없음:', englishKey);
                        //console.log('사용 가능한 키들:', Object.keys(translationData.sub_effects));
                    }
                } else if (currentLang === 'jp' && translationData && translationData.sub_effects) {
                    // 한국어 키를 일본어 키로 변환
                    const japaneseKey = translateRevelationName(revelation, false);
                    // console.log('일본어 키 변환:', revelation, '→', japaneseKey);
                    
                    if (translationData.sub_effects[japaneseKey]) {
                        effectData = translationData.sub_effects[japaneseKey];
                        set2Text = effectData.set2;
                        set4Text = effectData.set4;
                        setTypes = effectData.type;
                        // console.log('일본어 효과 데이터 사용:', effectData);
                    } else {
                        //console.log('일본어 효과 데이터 없음:', japaneseKey);
                        //console.log('사용 가능한 키들:', Object.keys(translationData.sub_effects));
                    }
                } else if (revelationData.sub_effects && revelationData.sub_effects[revelation]) {
                    effectData = revelationData.sub_effects[revelation];
                    set2Text = effectData.set2;
                    set4Text = effectData.set4;
                    setTypes = effectData.type;
                   // console.log('한국어 효과 데이터 사용:', effectData);
                }
                
                if (effectData) {
                    const translatedTitle = translateRevelationName(revelation, false);
                    
                    // 언어별 세트 텍스트
                    const setTexts = {
                        kr: { set2: '2세트', set4: '4세트' },
                        en: { set2: '2-Set', set4: '4-Set' },
                        jp: { set2: '2セット', set4: '4セット' }
                    };
                    const setText = setTexts[currentLang] || setTexts.kr;
                    
                    let tooltipText = `[${translatedTitle}]\n${setText.set2}: ${set2Text}\n${setText.set4}: ${set4Text}`;

                    // setTypes 에 '미출시'가 있는 경우
                    if (setTypes && setTypes.includes('미출시'))
                    {
                        if(currentLang === 'en')
                        {
                            tooltipText += `\n\n#NOT RELEASED IN GLOBAL SERVER#`;
                        }
                        else if(currentLang === 'jp')
                        {
                            tooltipText += `\n\n#グローバルサーバーで未発表#`;
                        }
                    }

                    item.setAttribute('data-tooltip', tooltipText);
                }
            } else {
                // 주 성위 효과 데이터
                const currentLang = getCurrentLanguage();
                let setEffectsData;
                
                // 현재 언어에 맞는 번역 데이터 가져오기
                let translationData = null;
                if (currentLang === 'en' && window.enRevelationData) {
                    translationData = window.enRevelationData;
                } else if (currentLang === 'jp' && window.jpRevelationData) {
                    translationData = window.jpRevelationData;
                }
                
                // 언어별 세트 효과 데이터 사용
                if (currentLang === 'en' && translationData && translationData.set_effects) {
                    // 한국어 키를 영어 키로 변환
                    const englishMainKey = translateRevelationName(revelation, true);
                    if (translationData.set_effects[englishMainKey]) {
                        setEffectsData = translationData.set_effects[englishMainKey];
                    }
                } else if (currentLang === 'jp' && translationData && translationData.set_effects) {
                    // 한국어 키를 일본어 키로 변환
                    const japaneseMainKey = translateRevelationName(revelation, true);
                    if (translationData.set_effects[japaneseMainKey]) {
                        setEffectsData = translationData.set_effects[japaneseMainKey];
                    }
                } else if (revelationData.set_effects && revelationData.set_effects[revelation]) {
                    setEffectsData = revelationData.set_effects[revelation];
                }
                
                if (setEffectsData) {
                    // 현재 선택된 일월성진 계시들 가져오기
                    const subRevelationContainer = document.querySelector('.sub-revelation .revelation-values');
                    const currentSubRevs = Array.from(subRevelationContainer?.querySelectorAll('.revelation-value-item span') || [])
                        .map(el => el.textContent.trim())
                        .filter(text => text); // 빈 문자열 제거

                    // console.log(currentSubRevs);
                    
                    // 현재 선택된 일월성진에 대한 세트 효과만 필터링
                    let tooltipText = '';
                    
                    if (currentSubRevs.length > 0) {
                        // 표시된 번역 텍스트를 원본 키로 역매핑해서 매칭
                        let subRevKeys;
                        
                        //console.log(subRevKeys);
                        if (currentLang === 'en' && translationData) {
                            // 영어 데이터 사용 시: 표시된 영어 이름을 영어 키로 직접 매칭
                            subRevKeys = Object.keys(setEffectsData).filter(englishSubKey => {
                                return currentSubRevs.includes(englishSubKey);
                            });
                        } else if (currentLang === 'jp' && translationData) {
                            // 일본어 데이터 사용 시: 표시된 일본어 이름을 일본어 키로 직접 매칭
                            subRevKeys = Object.keys(setEffectsData).filter(japaneseSubKey => {
                                return currentSubRevs.includes(japaneseSubKey);
                            });
                        } else {
                            // 한국어 데이터 사용 시: 표시된 한국어 이름을 한국어 키로 매칭
                            subRevKeys = Object.keys(setEffectsData).filter(koreanSubKey => {
                                const translatedSubName = translateRevelationName(koreanSubKey, false);
                                return currentSubRevs.includes(translatedSubName);
                            });
                        }
                        tooltipText = subRevKeys.map(subRevKey => {
                            const effect = setEffectsData[subRevKey];
                            const mainTitle = translateRevelationName(revelation, true);
                            
                            let subTitle;
                            if (currentLang === 'en' && translationData) {
                                // 영어 키를 그대로 사용
                                subTitle = subRevKey;
                            } else if (currentLang === 'jp' && translationData) {
                                // 일본어 키를 그대로 사용
                                subTitle = subRevKey;
                            } else {
                                // 한국어 키를 번역
                                subTitle = translateRevelationName(subRevKey, false);
                            }
                            if (currentLang === 'en' && subTitle=='type')
                            {
                                return '#NOT RELEASED IN GLOBAL SERVER#';
                            }
                            else if (currentLang === 'jp' && subTitle=='type')
                            {
                                return '#グローバルサーバーで未発表#';
                            }
                            
                            return `[${mainTitle} - ${subTitle}]\n${effect}`;
                        }).join('\n\n');
                    }

                    // 툴팁 텍스트가 비어있지 않은 경우에만 설정
                    if (tooltipText) {
                        item.setAttribute('data-tooltip', tooltipText);
                    } else {
                        // 선택된 일월성진이 없는 경우 모든 조합 효과 표시
                        const mainTitle = translateRevelationName(revelation, true);
                        const allEffectsText = Object.entries(setEffectsData)
                            .map(([subRevKey, effect]) => {
                                let subTitle;
                                if (currentLang === 'en' && translationData) {
                                    // 영어 키를 그대로 사용
                                    subTitle = subRevKey;
                                } else if (currentLang === 'jp' && translationData) {
                                    // 일본어 키를 그대로 사용
                                    subTitle = subRevKey;
                                } else {
                                    // 한국어 키를 번역
                                    subTitle = translateRevelationName(subRevKey, false);
                                }
                                if (currentLang === 'en' && subTitle=='type')
                                {
                                    return '#NOT RELEASED IN GLOBAL SERVER#';
                                }
                                else if (currentLang === 'jp' && subTitle=='type')
                                {
                                    return '#グローバルサーバーで未発表#';
                                }
                                return `[${mainTitle} - ${subTitle}]\n${effect}`;
                            })
                            .join('\n\n');
                        item.setAttribute('data-tooltip', allEffectsText);
                    }
                }
            }
            
            item.appendChild(text);
            item.appendChild(icon);
            container.appendChild(item);
        });
        
        return container;
    }

    // 전역에서 접근 가능하도록 함수 노출
    window.createRevelationValue = createRevelationValue;
    window.translateRevelationName = translateRevelationName;

    // 스킬 정보 채우기 (전역 함수로 설정)
    window.fillSkillsInfo = function(characterName) {
        // console.log('fillSkillsInfo 호출됨:', characterName);
        
        const skillsGrid = document.querySelector('.skills-grid');
        
        // 현재 언어 확인
        const currentLang = getCurrentLanguage();
        // console.log('현재 언어:', currentLang);

        // 언어별 데이터 사용
        let character;
        if (currentLang === 'en' && typeof window.enCharacterSkillsData !== 'undefined' && window.enCharacterSkillsData[characterName]) {
            character = window.enCharacterSkillsData[characterName];
           // console.log('영어 스킬 데이터 사용:', character);
        } else if (currentLang === 'jp' && typeof window.jpCharacterSkillsData !== 'undefined' && window.jpCharacterSkillsData[characterName]) {
            character = window.jpCharacterSkillsData[characterName];
            // console.log('일본어 스킬 데이터 사용:', character);
        } else {
            character = characterSkillsData[characterName];
            // console.log('한국어 스킬 데이터 사용:', character);
        }
        
        if (!character) return;
        
        // 스킬 1,2,3의 이름이 모두 비어있는지 확인
        const hasActiveSkills = ['skill1', 'skill2', 'skill3'].some(skillType => 
            character[skillType] && character[skillType].name
        );
        

        // 스킬이 모두 비어있으면 스킬 섹션 전체를 숨김
        const skillSection = skillsGrid.closest('.skills-card');
        if (!hasActiveSkills) {
            skillSection.style.display = 'none';
            return;
        } else {
            skillSection.style.display = ''; // 스킬이 있으면 보이게
        }
        
        // 스킬 레벨 버튼 추가
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'skill-level-buttons';
        
        // characterData에서 rarity 확인
        const characterInfo = characterData[characterName];
        if (!characterInfo) return;

        //console.log(characterInfo);
        
        // 언어별 레벨 텍스트
        const levelTexts = {
            kr: characterInfo.rarity === 4 
            ? ['전체', '10레벨', '10레벨+심상5', '12레벨', '12레벨+심상5']
                : ['전체', '10레벨', '10레벨+심상5', '13레벨', '13레벨+심상5'],
            en: characterInfo.rarity === 4 
                ? ['All', 'LV10', 'LV10+Minds.5', 'LV12', 'LV12+Minds.5']
                : ['All', 'LV10', 'LV10+Minds.5', 'LV13', 'LV13+Minds.5'],
            jp: characterInfo.rarity === 4 
                ? ['全体', 'LV10', 'LV10+イメジャリー5', 'LV12', 'LV12+イメジャリー5']
                : ['全体', 'LV10', 'LV10+イメジャリー5', 'LV13', 'LV13+イメジャリー5']
        };
        
        const levels = levelTexts[currentLang] || levelTexts.kr;

        levels.forEach((level, index) => {
            const button = document.createElement('button');
            button.className = 'skill-level-btn' + (index === 0 ? ' active' : '');
            button.textContent = level;
            button.dataset.level = index - 1; // 전체는 -1, 나머지는 0,1,2
            button.onclick = () => window.updateSkillDescriptions(button.dataset.level, characterName);
            buttonContainer.appendChild(button);
        });

        skillsGrid.parentElement.insertBefore(buttonContainer, skillsGrid);
        
        // 스킬 순서 정의
        let skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'passive1', 'passive2'];
        
        // 페르소나3 캐릭터인 경우 추가 스킬 포함
        if (characterInfo.persona3 && characterInfo.name === "유키 마코토") {
            skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'skill_highlight2', 'skill_support', 'passive1', 'passive2'];
        }

        else if (characterInfo.persona3 ) {
            skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'skill_support', 'passive1', 'passive2'];
        }

        // console.log(skillTypes);
        
        skillsGrid.innerHTML = ''; // 기존 내용 초기화
        
        skillTypes.forEach(type => {
            const skill = character[type];
            if (!skill) return;
            
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            
            const iconPath = skill.element ? `${BASE_URL}/assets/img/skill-element/${skill.element}.png` : '';
            
            let costText = '';
            const costParts = [];

            if (skill.sp) {
                costParts.push(`SP ${skill.sp}`);
            }
            if (skill.hp) {
                costParts.push(`HP ${skill.hp}%`);
            }
            // 캐릭터 직업이 해명인 경우 '턴' 대신 '행동'
            const currentLang = getCurrentLanguage();
            // 직업에 따라 기본 라벨 세트 선택
            const labelSet = (characterInfo.position === '해명')
                ? { kr: '행동', en: ' Action', jp: '行動' }
                : { kr: '턴',   en: ' Turn',   jp: 'ターン' };
            if (skill.cool && skill.cool > 0) {
                const label = labelSet[currentLang] || labelSet.kr;
                costParts.push(`${skill.cool}${label}`);
            }
            costText = costParts.join(' / ');
            
            // highlight 스킬의 경우 name이 없을 경우 "HIGHLIGHT"로 이름 표시
            let skillName = type === 'skill_highlight' && !skill.name ? 'HIGHLIGHT' : (skill.name || '');
            
            // console.log(skill);
            // 각 스킬의 고유한 description 사용
            let description = skill.description || '';
            
            // 초기 설명에도 숫자 패턴에 skill-level-values 클래스 적용
            description = description.replace(/(\d+(?:\.\d+)?%?|\[제보\])(\/(\d+(?:\.\d+)?%?|\[제보\])){1,3}/g, match => {
                const values = match.split('/');
                return values.map(value => {
                    if (value === '[제보]') {
                        return `<a href="https://forms.gle/Z5SgtSNpSvnprJxAA" class="report-link" target="_blank">[제보]</a>`;
                    }
                    return `<span class="skill-level-values">${value}</span>`;
                }).join('/');
            });


            skillCard.innerHTML = `
                <img src="${iconPath}" alt="${skill.element}" class="skill-icon">
                <div class="skill-info">
                    <div class="skill-header">
                        <span class="skill-name">${skillName}</span>
                        ${costText ? `<span class="skill-cost">${costText}</span>` : ''}
                    </div>
                    <p class="skill-description">${description}</p>
                </div>
            `;

            // (<p.skill-description>) 밖에 있는 테이블만 제거
            skillCard.querySelectorAll('table').forEach(t => {
                if (!t.closest('.skill-description')) t.remove();
            });

            skillsGrid.appendChild(skillCard);
        });
        
        // 툴팁 적용
        window.updateSkillDescriptions('0', characterName);
        if (typeof addTooltips === 'function') {
            addTooltips();
        } else {
            // addTooltips 함수가 아직 로드되지 않았으면 지연 실행
            setTimeout(() => {
                if (typeof addTooltips === 'function') {
                    addTooltips();
                }
            }, 100);
        }
    };

    window.updateSkillDescriptions = function(levelIndex, characterName) {
        // 버튼 상태 업데이트
        document.querySelectorAll('.skill-level-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === levelIndex.toString());
        });
        
        // 현재 언어 확인
        const currentLang = getCurrentLanguage();
        
        // 언어별 데이터 사용
        let character;
        if (currentLang === 'en' && typeof window.enCharacterSkillsData !== 'undefined' && window.enCharacterSkillsData[characterName]) {
            character = window.enCharacterSkillsData[characterName];
        } else if (currentLang === 'jp' && typeof window.jpCharacterSkillsData !== 'undefined' && window.jpCharacterSkillsData[characterName]) {
            character = window.jpCharacterSkillsData[characterName];
        } else {
            character = characterSkillsData[characterName];
        }
        
        if (!character) return;

        // characterData에서 캐릭터 정보 가져오기
        const characterInfo = characterData[characterName];
        if (!characterInfo) return;
        
        // 스킬 타입 정의
        let skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'passive1', 'passive2'];
        
        // 페르소나3 캐릭터인 경우 추가 스킬 포함
        if (characterInfo.persona3 && characterInfo.name === "유키 마코토") {
            skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'skill_highlight2', 'skill_support', 'passive1', 'passive2'];
        }

        else if (characterInfo.persona3) {
            skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'skill_support', 'passive1', 'passive2'];
        }
        
        // 모든 스킬 설명 업데이트
        document.querySelectorAll('.skill-description').forEach((descElement, index) => {
            const skill = character[skillTypes[index]];
            
            if (skill && skill.description) {
                let description = skill.description;
                
                if (levelIndex === '-1') { // '전체' 선택 시
                    // 슬래시로 구분된 수치를 모두 표시 (4개 수치 지원)
                    description = description.replace(/(\d+(?:\.\d+)?%?|\[제보\])(\/(\d+(?:\.\d+)?%?|\[제보\])){1,3}/g, match => {
                        const values = match.split('/');
                        return values.map(value => {
                            if (value === '[제보]') {
                                return `<a href="https://forms.gle/Z5SgtSNpSvnprJxAA" class="report-link" target="_blank">[제보]</a>`;
                            }
                            return `<span class="skill-level-values">${value}</span>`;
                        }).join('/');
                    });
                } else {
                    // 특정 레벨의 수치만 표시
                    description = description.replace(/(\d+(?:\.\d+)?%?|\[제보\])(\/(\d+(?:\.\d+)?%?|\[제보\])){1,3}/g, match => {
                        const values = match.split('/');
                        const selectedValue = values[levelIndex] || values[values.length - 1];
                        if (selectedValue === '[제보]') {
                            return `<a href="https://forms.gle/Z5SgtSNpSvnprJxAA" class="report-link" target="_blank">[제보]</a>`;
                        }
                        return `<span class="skill-level-values">${selectedValue}</span>`;
                    });
                }
                
                descElement.innerHTML = description;
            }
        });
        
        // 툴팁 다시 적용
        if (typeof addTooltips === 'function') {
            addTooltips();
        } else {
            // addTooltips 함수가 아직 로드되지 않았으면 지연 실행
            setTimeout(() => {
                if (typeof addTooltips === 'function') {
                    addTooltips();
                }
            }, 100);
        }
    };

    // 운영 정보 채우기
    function fillOperationInfo(characterName) {
        const currentLang = getCurrentLanguage();
        const operationSettings = document.querySelector('.operation-settings');
        if (!operationSettings || !operationData[characterName]) return;

        const basicSection = operationSettings.querySelector('.setting-section:first-child');
        const noteSection = operationSettings.querySelector('.setting-section:last-child');
        const basicContent = operationSettings.querySelector('.operation-levels');
        const noteContent = operationSettings.querySelector('.operation-notes');

        // 현재 언어에 따른 basic 배열 선택
        let basicArray = operationData[characterName].basic; // 기본값은 한국어
        if (currentLang === 'en' && operationData[characterName].basic_en) {
            basicArray = operationData[characterName].basic_en;
        } else if (currentLang === 'jp' && operationData[characterName].basic_jp) {
            basicArray = operationData[characterName].basic_jp;
        }

        // basic 배열이 비어있거나 모든 항목이 빈 값인 경우
        const hasBasicContent = basicArray.some(item => 
            item.label && item.value && item.label.trim() !== '' && item.value.trim() !== ''
        );

        
        // 현재 언어에 따른 note 배열 선택
        let noteArray = operationData[characterName].note; // 기본값은 한국어
        
        if (currentLang === 'en' && operationData[characterName].note_en) {
            noteArray = operationData[characterName].note_en;
        } else if (currentLang === 'jp' && operationData[characterName].note_jp) {
            noteArray = operationData[characterName].note_jp;
        }
        
        // note 배열이 비어있거나 모든 항목이 빈 값인 경우
        const hasNoteContent = noteArray && noteArray.some(note => 
            note && note.trim() !== ''
        );

        // basic 섹션 처리
        if (hasBasicContent) {
            basicContent.innerHTML = basicArray
                .filter(item => item.label && item.value && item.label.trim() !== '' && item.value.trim() !== '')
                .map(item => {
                    const skills = item.value.split(' › ');
                    const skillSteps = skills.map(skill => 
                        `<div class="skill-step">${skill}</div>`
                    ).join('<div class="skill-arrow">›</div>');

                    // 의식 텍스트 번역
                    let translatedLabel = item.label;
                    if (currentLang === 'en') {
                        translatedLabel = translatedLabel.replace(/의식 /g, 'A');
                    } else if (currentLang === 'jp') {
                        translatedLabel = translatedLabel.replace(/의식/g, '意識');
                    }

                    return `
                        <div class="operation-row">
                            <div class="operation-label">${translatedLabel}</div>
                            <div class="operation-value">
                                <div class="skill-sequence">
                                    ${skillSteps}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
        } else {
            basicContent.innerHTML = ''; // 내용만 비우기
        }

        // note 섹션 처리
        if (hasNoteContent) {
            noteContent.innerHTML = noteArray
                .filter(note => note && note.trim() !== '')
                .map(note => `<div class="operation-note">${note}</div>`)
                .join('');    
        } else {
            noteContent.innerHTML = ''; // 내용만 비우기
        }

        // 두 섹션 중 하나라도 내용이 있으면 operation-settings 전체를 표시
        if (hasBasicContent || hasNoteContent) {
            // 스킬 시퀀스의 줄바꿈 여부 체크
            const skillSequences = operationSettings.querySelectorAll('.skill-sequence');
            let needsSingleColumn = false;

            // 각 스킬 시퀀스의 줄바꿈 여부 확인
            skillSequences.forEach(sequence => {
                // 임시로 flex-wrap: nowrap을 적용하여 한 줄에 표시되는지 확인
                const originalStyle = sequence.style.cssText;
                sequence.style.flexWrap = 'nowrap';
                
                // 실제 내용의 너비 계산 (자식 요소들의 너비 + 간격)
                const contentWidth = Array.from(sequence.children).reduce((width, child, index) => {
                    const childWidth = child.offsetWidth;
                    const gap = index < sequence.children.length - 1 ? 8 : 0; // gap이 8px로 설정되어 있음
                    return width + childWidth + gap;
                }, 0);
                
                // 컨테이너의 실제 너비 (operation-value의 너비)
                const containerWidth = sequence.parentElement.offsetWidth;
                
                // 원래 스타일로 복원
                sequence.style.cssText = originalStyle;
                
                // 내용이 컨테이너보다 넓으면 줄바꿈이 필요한 것으로 판단
                if (contentWidth > containerWidth) {
                    needsSingleColumn = true;
                }
            });

            // 모바일 환경이거나 줄바꿈이 발생한 경우 1열로 변경
            if (window.innerWidth <= 1200) {
                operationSettings.style.gridTemplateColumns = '1fr';
                operationSettings.style.display = 'flex';
                operationSettings.style.flexDirection = 'column';
                operationSettings.style.gap = '20px';
            } else if (needsSingleColumn) {
                operationSettings.style.gridTemplateColumns = '1fr';
                operationSettings.style.display = 'flex';
                operationSettings.style.flexDirection = 'column';
                operationSettings.style.gap = '20px';
                // 모든 skill-step 요소에 min-width 적용
                operationSettings.querySelectorAll('.skill-step').forEach(step => {
                    step.style.minWidth = '100px';
                });
            }  else {
                operationSettings.style.display = 'grid';
                operationSettings.style.gridTemplateColumns = 'repeat(2, 1fr)';
                operationSettings.style.gap = '2vw';
                operationSettings.style.alignItems = 'stretch';
            }
        } else {
            operationSettings.style.display = 'none';
        }
        
    }




});