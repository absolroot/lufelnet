  // 파티 이미지 업데이트 함수
  function updatePartyImages() {
    const partyImagesContainer = document.querySelector(".party-images-container");
    if (!partyImagesContainer) return;
    partyImagesContainer.innerHTML = "";

    // 현재 언어 감지 함수
    function getCurrentLanguage() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
        return urlLang;
      }
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
        return savedLang;
      }
      return 'kr';
    }

    // 캐릭터 이름 번역 함수
    function getCharacterDisplayName(charName) {
      // 전역 함수가 있으면 사용, 없으면 로컬 구현
      if (typeof window.getCharacterDisplayName === 'function') {
        return window.getCharacterDisplayName(charName);
      }
      const currentLang = getCurrentLanguage();
      if (currentLang === 'kr' || !charName) {
        return charName;
      }
      
      // window.characterData 우선 확인 (characters.js가 여기에 할당)
      const charData = (typeof window !== 'undefined' && window.characterData) 
        ? window.characterData 
        : (typeof characterData !== 'undefined' ? characterData : null);
      
      if (!charData || !charData[charName]) {
        return charName;
      }
      
      const char = charData[charName];
      if (currentLang === 'en' && char.name_en) {
        return char.name_en;
      } else if (currentLang === 'jp' && char.name_jp) {
        return char.name_jp;
      }
      return charName;
    }

    // 파티 이미지 컨테이너
    const partyImagesDiv = document.createElement("div");
    partyImagesDiv.className = "party-images";

    // 기존 파티 이미지 로직
    const orderedParty = partyMembers
      .filter(pm => pm.name !== "")
      .sort((a, b) => {
        if (a.order === "-") return 1;
        if (b.order === "-") return -1;
        return parseInt(a.order, 10) - parseInt(b.order, 10);
      });
    
    orderedParty.forEach((member) => {
      const container = document.createElement("div");
      container.className = "character-container";

      if (characterData[member.name]) {
        const charImg = document.createElement("img");
        charImg.className = "character-img";
        const imagePath = `${BASE_URL}/assets/img/character-half/${member.name}.webp`;
        charImg.src = imagePath;
        // 언어별 번역된 이름 사용
        const displayName = getCharacterDisplayName(member.name);
        charImg.alt = displayName;
        charImg.title = displayName;
        
        // 원더가 아닌 경우에만 클릭 이벤트 추가
        if (member.name !== "원더") {
          container.style.cursor = "pointer";
          container.addEventListener("click", () => {
            const currentLang = getCurrentLanguage();
            const characterUrl = `${BASE_URL}/character.html?name=${encodeURIComponent(member.name)}&lang=${currentLang}&v=${APP_VERSION}`;
            window.open(characterUrl, '_blank');
          });
        }
        
        container.appendChild(charImg);

        // 원더일 경우 무기 이미지 추가
        if (member.name === "원더") {
          const weaponInput = document.querySelector(".wonder-weapon-input");
          const selectedWeapon = weaponInput.value;
          if (selectedWeapon && getWonderWeaponOptions().includes(selectedWeapon)) {
            const weaponImg = document.createElement("img");
            weaponImg.className = "weapon-img";
            weaponImg.src = `${BASE_URL}/assets/img/wonder-weapon/${selectedWeapon}.webp`;
            weaponImg.alt = selectedWeapon;
            weaponImg.title = selectedWeapon;
            container.appendChild(weaponImg);
          }
        }
      } else {
        // 이미지가 없는 경우 텍스트 원형으로 대체
        const textCircle = document.createElement("div");
        textCircle.className = "character-text-circle";
        const displayName = getCharacterDisplayName(member.name);
        textCircle.textContent = displayName;
        textCircle.title = displayName;
        container.appendChild(textCircle);
      }
      
      // 순서 이미지 (+ 5 폴백 배지)
      if (["1", "2", "3", "4", "5"].includes(member.order)) {
        const orderImg = document.createElement("img");
        orderImg.className = "order-img";
        orderImg.src = `${BASE_URL}/assets/img/ui/num0${member.order}.png`;
        orderImg.alt = `순서 ${member.order}`;
        orderImg.onerror = function() {
          this.style.display = 'none';
          const badge = document.createElement('div');
          badge.className = 'order-badge';
          badge.textContent = String(member.order);
          container.appendChild(badge);
        };
        container.appendChild(orderImg);
      }
      
      // 의식 이미지
      const ritualLevel = parseInt(member.ritual);
      if (ritualLevel >= 1 && ritualLevel <= 6) {
        const ritualImg = document.createElement("img");
        ritualImg.className = "ritual-img";
        ritualImg.src = `${BASE_URL}/assets/img/ritual/num${ritualLevel}.png`;
        ritualImg.alt = `의식 ${ritualLevel}`;
        container.appendChild(ritualImg);
      }
      
      // 계시 이미지 추가
      const partyDiv = document.querySelector(`.party-member[data-index="${member.index}"]`);
      if (partyDiv) {
        const mainRev = partyDiv.querySelector(".main-revelation").value;
        const subRev = partyDiv.querySelector(".sub-revelation").value;
        
        if (mainRev && subRev) {
          const revelationsContainer = document.createElement("div");
          revelationsContainer.className = "revelations-container";

          const mainRevImg = document.createElement("img");
          mainRevImg.className = "revelation-img main-rev";
          mainRevImg.src = `${BASE_URL}/assets/img/revelation/${mainRev}.webp`;
          mainRevImg.alt = mainRev;
          revelationsContainer.appendChild(mainRevImg);

          const subRevImg = document.createElement("img");
          subRevImg.className = "revelation-img sub-rev";
          subRevImg.src = `${BASE_URL}/assets/img/revelation/${subRev}.webp`;
          subRevImg.alt = subRev;
          revelationsContainer.appendChild(subRevImg);

          container.appendChild(revelationsContainer);
        }
      }


      partyImagesDiv.appendChild(container);
    });

    partyImagesContainer.appendChild(partyImagesDiv);

    // 원더의 페르소나 이미지 컨테이너: 항상 렌더하여 DOM 변동 최소화
    const personaImagesDiv = document.createElement("div");
    personaImagesDiv.className = "persona-images";
    // 필요 시 최소 높이로 행 높이 고정 (CSS에 이미 정의되어 있으면 제거 가능)
    // personaImagesDiv.style.minHeight = '64px';

    wonderPersonas.forEach((persona) => {
      if (persona) {
        const container = document.createElement("div");
        container.className = "persona-container";

        const personaImg = document.createElement("img");
        personaImg.className = "persona-img";
        personaImg.src = `${BASE_URL}/assets/img/tactic-persona/${persona}.webp`;
        // 언어별 번역된 이름 사용
        const displayPersonaNameForAlt = getPersonaDisplayName(persona);
        personaImg.alt = displayPersonaNameForAlt;
        personaImg.title = displayPersonaNameForAlt;
        
        // 커스텀 툴팁 div 생성
        const tooltip = document.createElement("div");
        tooltip.className = "persona-tooltip";
        
        // 현재 언어 감지 함수
        function getCurrentLanguage() {
          const urlParams = new URLSearchParams(window.location.search);
          const urlLang = urlParams.get('lang');
          if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
          }
          const savedLang = localStorage.getItem('preferredLanguage');
          if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
            return savedLang;
          }
          return 'kr';
        }

        // 공통 페르소나 데이터 소스 (window.personaFiles 우선)
        // ※ 캐시는 두지 않고, 호출 시점마다 최신 window.personaFiles를 읽어온다.
        function getPersonaStore() {
          const w = (typeof window !== 'undefined') ? window : globalThis;
          if (w.personaFiles && Object.keys(w.personaFiles).length) return w.personaFiles;
          if (typeof personaData !== 'undefined' && personaData) return personaData;
          if (w.persona && w.persona.personaData) return w.persona.personaData;
          return {};
        }

        // 페르소나 이름 번역 함수
        function getPersonaDisplayName(personaName) {
          const currentLang = getCurrentLanguage();
          const store = getPersonaStore() || {};
          if (currentLang === 'kr' || !store[personaName]) {
            return personaName;
          }
          
          const personaObj = store[personaName];
          if (currentLang === 'en' && personaObj.name_en) {
            return personaObj.name_en;
          } else if (currentLang === 'jp' && personaObj.name_jp) {
            return personaObj.name_jp;
          }
          return personaName;
        }
        
        // 툴팁 내용 구성 (번역 적용)
        const currentLang = getCurrentLanguage();
        const store = getPersonaStore() || {};
        const personaObj = store[persona];
        const displayPersonaName = getPersonaDisplayName(persona);

        let instinctName = "";
        let instinctEffects = [];

        if (personaObj) {
          // 새 구조: passive_skill 배열에서 마지막 1개(야노식은 마지막 2개)만 사용
          if (Array.isArray(personaObj.passive_skill) && personaObj.passive_skill.length > 0) {
            const arr = personaObj.passive_skill;
            let selected = [];
            //if (persona === '야노식') {
            //  selected = arr.slice(-2); // 마지막 2개
            //} else {
            selected = [arr[arr.length - 1]]; // 마지막 1개
            //}

            const names = [];
            const effectLines = [];

            selected.forEach(ps => {
              if (!ps) return;
              let n = ps.name;
              let d = ps.desc;
              if (currentLang === 'en') {
                n = ps.name_en || n;
                d = ps.desc_en || d;
              } else if (currentLang === 'jp') {
                n = ps.name_jp || n;
                d = ps.desc_jp || d;
              }
              if (n) names.push(n);
              if (d) {
                if (Array.isArray(d)) {
                  effectLines.push(...d);
                } else {
                  effectLines.push(...String(d).split('\n'));
                }
              }
            });

            instinctName = names.join(' / ');
            instinctEffects = effectLines;
          }
          // 구 구조 fallback: persona.instinct 사용
          else if (personaObj.instinct) {
            const instinct = personaObj.instinct;
            instinctName = instinct.name || "";
            instinctEffects = Array.isArray(instinct.effects) ? instinct.effects.slice() : (instinct.effects ? [instinct.effects] : []);

            // 본능 이름 번역
            if (currentLang === 'en' && instinct.name_en) {
              instinctName = instinct.name_en;
            } else if (currentLang === 'jp' && instinct.name_jp) {
              instinctName = instinct.name_jp;
            }

            // 본능 효과 번역
            if (currentLang === 'en' && instinct.effects_en) {
              instinctEffects = Array.isArray(instinct.effects_en) ? instinct.effects_en.slice() : [instinct.effects_en];
            } else if (currentLang === 'jp' && instinct.effects_jp) {
              instinctEffects = Array.isArray(instinct.effects_jp) ? instinct.effects_jp.slice() : [instinct.effects_jp];
            }
          }
        }
        
        let tooltipText = `${displayPersonaName}\n${instinctName}\n`;
        if (instinctEffects.length > 0) {
          tooltipText += "\n" + instinctEffects.join("\n");
        }
        tooltip.textContent = tooltipText;

        container.appendChild(personaImg);
        container.appendChild(tooltip);
        personaImagesDiv.appendChild(container);
      }
    });

    // 항상 추가 (비어있어도 유지)
    partyImagesContainer.appendChild(personaImagesDiv);
  }

  // 전역 노출 (library-loader, import.js에서 호출 가능하도록)
  window.updatePartyImages = updatePartyImages;

  // characterData 준비 후 자동 실행
  if (typeof window.whenCharacterDataReady === 'function') {
    window.whenCharacterDataReady(updatePartyImages);
  }

