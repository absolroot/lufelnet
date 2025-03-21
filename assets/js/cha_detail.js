document.addEventListener('DOMContentLoaded', () => {
    

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
                // +5 → +5심상 
                if (levels[index].endsWith('+5')) {
                    level.querySelector('.label').textContent = levels[index].slice(0, -1) + '심상 5';
                }
                const valueElement = level.querySelector('.value');
                const statValue = character.minimum_stats[levels[index]] || '-';
                
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

        // 전투 진입 시 요구 스탯 +
        const battlePlusStats = document.querySelector('.battle-plus-stats');
        if (character.battle_plus_stats && character.battle_plus_stats !== 'nan') {
            // <b> 태그의 수 확인
            const bTagCount = (character.battle_plus_stats.match(/<b>/g) || []).length;
            
            if (bTagCount >= 2) {
                // 2열 레이아웃으로 변경
                battlePlusStats.style.display = 'grid';
                battlePlusStats.style.gridTemplateColumns = 'repeat(2, 1fr)';
                battlePlusStats.style.gap = '20px';
                
                // <b> 태그로 분할하여 각 섹션을 div로 래핑
                const sections = character.battle_plus_stats.split(/<b>/).filter(Boolean);
                battlePlusStats.innerHTML = sections.map(section => {
                    const processedSection = section.trim().replace(/\//g, '<br>·');
                    const finalSection = processedSection.replace(/<<br>·b><br>/, '</b>');
                    return `<div class="battle-stat-section"><b>${finalSection}</div>`;
                }).join('');
            } else {
                // 기존 방식대로 한 열로 표시
                let content = character.battle_plus_stats
                    .split('\n').join('<br>')
                    .replace(/\//g, '<br>·');
                content = content.replace(/<<br>·b><br>/, '</b>');
                battlePlusStats.innerHTML = content;
            }
        } else {
            battlePlusStats.textContent = '-';
        }

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
                markImg.src = '/assets/img/character-detail/mark.png';
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
                markImg.src = '/assets/img/character-detail/mark.png';
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
            
            const starCount = character.rarity;
            const starType = character.rarity === 4 ? 'star4.png' : 'star5.png';
            
            // 기존 내용 제거
            raritySection.innerHTML = '';
            
            // 별 이미지 추가
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('img');
                star.src = `/assets/img/character-detail/${starType}`;
                star.alt = '★';
                star.style.width = '20px';
                star.style.height = '20px';
                raritySection.appendChild(star);
            }
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
    }

    // URL에서 캐릭터 이름을 가져와서 현재 페이지 표시
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('name');
    
    if (characterName && characterData[characterName]) {
        const character = characterData[characterName];
        fillSettingsInfo(character);
        // 아이템 개수 업데이트 함수 호출
        updateSkillLevelItems();
        updateMindItems();
        const currentPage = document.querySelector('.current-page');
        currentPage.textContent = characterData[characterName].name;

        // role과 tag 정보 채우기
        const roleElement = document.querySelector('.chracter-role');
        const tagElement = document.querySelector('.chracter-tag');

        // role 정보 채우기
        if (character.role) {
            roleElement.textContent = character.role;
        }

        // tag 정보 채우기
        if (character.tag) {
            // 기존 내용 초기화
            tagElement.innerHTML = '';
            
            // 콤마로 분리하여 각각의 태그를 생성
            const tags = character.tag.split(',').map(tag => tag.trim());
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
    document.querySelectorAll('.ritual-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // 기존 활성 탭과 이미지 비활성화
            document.querySelector('.ritual-tab.active').classList.remove('active');
            document.querySelector('.ritual-image.active').classList.remove('active');
            
            // 클릭한 탭과 해당 이미지 활성화
            tab.classList.add('active');
            const ritualLevel = tab.dataset.ritual;
            document.querySelector(`.ritual-image[src*="ritual${ritualLevel}.png"]`).classList.add('active');
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
            itemImg.src = '/assets/img/character-detail/item-goldenrose.png';
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
        img.src = `/assets/img/character-detail/${imageName}`;
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
            text.textContent = revelation;
            
            const icon = document.createElement('img');
            icon.src = `/assets/img/character-detail/revel/${revelation}.webp`;
            icon.alt = revelation;
            icon.className = 'revelation-icon';
            
            if (!isMainRevelation) {
                // 일월성진 효과 데이터
                if (revelationData.sub_effects && revelationData.sub_effects[revelation]) {
                    const subEffect = revelationData.sub_effects[revelation];
                    const tooltipText = `[${revelation}]\n2세트: ${subEffect.set2}\n4세트: ${subEffect.set4}`;
                    item.setAttribute('data-tooltip', tooltipText);
                }
            } else {
                // 주 성위 효과 데이터
                if (revelationData.set_effects && revelationData.set_effects[revelation]) {
                    const setEffects = revelationData.set_effects[revelation];
                    
                    // 현재 선택된 일월성진 계시들 가져오기 (수정된 부분)
                    const subRevelationContainer = document.querySelector('.sub-revelation .revelation-values');
                    const currentSubRevs = Array.from(subRevelationContainer?.querySelectorAll('.revelation-value-item span') || [])
                        .map(el => el.textContent.trim())
                        .filter(text => text); // 빈 문자열 제거

                    console.log(currentSubRevs);
                    // 현재 선택된 일월성진에 대한 세트 효과만 필터링
                    const tooltipText = Object.entries(setEffects)
                        .filter(([subRev]) => currentSubRevs.includes(subRev))
                        .map(([subRev, effect]) => `[${revelation} - ${subRev}]\n${effect}`)
                        .join('\n\n');

                    // 툴팁 텍스트가 비어있지 않은 경우에만 설정
                    if (tooltipText) {
                        item.setAttribute('data-tooltip', tooltipText);
                    } else {
                        // 선택된 일월성진이 없는 경우 모든 조합 효과 표시
                        const allEffectsText = Object.entries(setEffects)
                            .map(([subRev, effect]) => `[${revelation} - ${subRev}]\n${effect}`)
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

    function fillSkillsInfo(characterName) {
        const skillsGrid = document.querySelector('.skills-grid');
        const character = characterSkillsData[characterName];
        
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

        
        const levels = characterInfo.rarity === 4 
            ? ['전체', '10레벨', '10레벨+심상5', '12레벨', '12레벨+심상5']
            : ['전체', '10레벨', '10레벨+심상5', '13레벨', '13레벨+심상5'];
        
        levels.forEach((level, index) => {
            const button = document.createElement('button');
            button.className = 'skill-level-btn' + (index === 0 ? ' active' : '');
            button.textContent = level;
            button.dataset.level = index - 1; // 전체는 -1, 나머지는 0,1,2
            button.onclick = () => updateSkillDescriptions(button.dataset.level, characterName);
            buttonContainer.appendChild(button);
        });


        skillsGrid.parentElement.insertBefore(buttonContainer, skillsGrid);
        
        // 스킬 순서 정의
        const skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'passive1', 'passive2'];
        
        skillsGrid.innerHTML = ''; // 기존 내용 초기화
        
        skillTypes.forEach(type => {
            const skill = character[type];
            if (!skill) return;
            
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            
            const iconPath = skill.element ? `/assets/img/skill-element/${skill.element}.png` : '';
            
            let costText = '';
            const costParts = [];

            if (skill.sp) {
                costParts.push(`SP ${skill.sp}`);
            }
            if (skill.hp) {
                costParts.push(`HP ${skill.hp}%`);
            }
            // 캐릭터 직업이 해명인 경우 '턴' 대신 '행동'
            if (skill.cool && skill.cool > 0) {
                if (characterInfo.position === '해명') {
                    costParts.push(`${skill.cool}행동`);
                } else {
                    costParts.push(`${skill.cool}턴`);
                }
            }

            costText = costParts.join(' / ');
            
            // highlight 스킬의 경우 name이 없을 경우 "HIGHLIGHT"로 이름 표시
            let skillName = type === 'skill_highlight' && !skill.name ? 'HIGHLIGHT' : (skill.name || '');
            
            // 초기 설명에도 숫자 패턴에 skill-level-values 클래스 적용
            let description = skill.description || '';
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
            
            skillsGrid.appendChild(skillCard);
        });
        
        // 툴팁 적용
        updateSkillDescriptions('0', characterName);
        addTooltips();
    }

    function updateSkillDescriptions(levelIndex, characterName) {
        // 버튼 상태 업데이트
        document.querySelectorAll('.skill-level-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === levelIndex.toString());
        });
        
        const character = characterSkillsData[characterName];
        if (!character) return;
        
        // 모든 스킬 설명 업데이트
        document.querySelectorAll('.skill-description').forEach((descElement, index) => {
            const skillTypes = ['skill1', 'skill2', 'skill3', 'skill_highlight', 'passive1', 'passive2'];
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
        addTooltips();
    }

    if (characterName) {
        fillSkillsInfo(characterName);
    }


 
});