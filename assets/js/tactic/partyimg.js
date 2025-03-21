  // 파티 이미지 업데이트 함수
  function updatePartyImages() {
    const partyImagesContainer = document.querySelector(".party-images-container");
    partyImagesContainer.innerHTML = "";

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
        // /assets/img/characters-half/ 에서 {캐릭터이름}.webp 파일을 찾아서 src에 넣음.
        const imagePath = `/assets/img/character-half/${member.name}.webp`;
        charImg.src = imagePath;
        charImg.alt = member.name;
        charImg.title = member.name;
        container.appendChild(charImg);

        // 원더일 경우 무기 이미지 추가
        if (member.name === "원더") {
          const weaponInput = document.querySelector(".wonder-weapon-input");
          const selectedWeapon = weaponInput.value;
          if (selectedWeapon && wonderWeapons.includes(selectedWeapon)) {
            const weaponImg = document.createElement("img");
            weaponImg.className = "weapon-img";
            weaponImg.src = `/assets/img/wonder-weapon/${selectedWeapon}.webp`;
            weaponImg.alt = selectedWeapon;
            weaponImg.title = selectedWeapon;
            container.appendChild(weaponImg);
          }
        }
      } else {
        // 이미지가 없는 경우 텍스트 원형으로 대체
        const textCircle = document.createElement("div");
        textCircle.className = "character-text-circle";
        textCircle.textContent = member.name;
        textCircle.title = member.name;
        container.appendChild(textCircle);
      }
      
      // 순서 이미지
      if (["1", "2", "3", "4"].includes(member.order)) {
        const orderImg = document.createElement("img");
        orderImg.className = "order-img";
        orderImg.src = `/assets/img/ui/num0${member.order}.png`;
        orderImg.alt = `순서 ${member.order}`;
        container.appendChild(orderImg);
      }
      
      // 의식 이미지
      const ritualLevel = parseInt(member.ritual);
      if (ritualLevel >= 1 && ritualLevel <= 6) {
        const ritualImg = document.createElement("img");
        ritualImg.className = "ritual-img";
        ritualImg.src = `/assets/img/ritual/num${ritualLevel}.png`;
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
          mainRevImg.src = `/assets/img/revelation/${mainRev}.webp`;
          mainRevImg.alt = mainRev;
          revelationsContainer.appendChild(mainRevImg);

          const subRevImg = document.createElement("img");
          subRevImg.className = "revelation-img sub-rev";
          subRevImg.src = `/assets/img/revelation/${subRev}.webp`;
          subRevImg.alt = subRev;
          revelationsContainer.appendChild(subRevImg);

          container.appendChild(revelationsContainer);
        }
      }


      partyImagesDiv.appendChild(container);
    });

    partyImagesContainer.appendChild(partyImagesDiv);

    // 원더의 페르소나 이미지 추가
    if (wonderPersonas.some(persona => persona !== "")) {
      const personaImagesDiv = document.createElement("div");
      personaImagesDiv.className = "persona-images";

      wonderPersonas.forEach((persona, index) => {
        if (persona) {
          const container = document.createElement("div");
          container.className = "persona-container";

          const personaImg = document.createElement("img");
          personaImg.className = "persona-img";
          personaImg.src = `/assets/img/tactic-persona/${persona}.webp`;
          personaImg.alt = persona;
          
          // 커스텀 툴팁 div 생성
          const tooltip = document.createElement("div");
          tooltip.className = "persona-tooltip";
          
          // 툴팁 내용 구성
          const instinct = personaData[persona]?.instinct;
          let tooltipText = `${persona}\n본능: ${instinct?.name || ""}\n`;
          if (instinct?.effects) {
            tooltipText += "\n" + instinct.effects.join("\n");
          }
          tooltip.textContent = tooltipText;

          container.appendChild(personaImg);
          container.appendChild(tooltip);
          personaImagesDiv.appendChild(container);
        }
      });

      if (personaImagesDiv.children.length > 0) {
        partyImagesContainer.appendChild(personaImagesDiv);
      }
    }
  }

