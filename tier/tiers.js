import { colors } from "./tier_colors.js";

const settingsModal = document.querySelector(".settings-modal");
const colorsContainer = settingsModal.querySelector(".colors");
const tiersContainer = document.querySelector(".tiers-container");
const cardsContainer = document.querySelector(".cards");

let activeTier;

const resetTierImages = (tier) => {
  const images = tier.querySelectorAll(".items img");
  images.forEach((img) => {
    cardsContainer.appendChild(img);
  });
};

const handleDeleteTier = () => {
  if (activeTier) {
    resetTierImages(activeTier);
    activeTier.remove();
    settingsModal.close();
  }
};

const handleClearTier = () => {
  if (activeTier) {
    resetTierImages(activeTier);
    settingsModal.close();
  }
};

const handlePrependTier = () => {
  if (activeTier) {
    tiersContainer.insertBefore(createTier(), activeTier);
    settingsModal.close();
  }
};

const handleAppendTier = () => {
  if (activeTier) {
    tiersContainer.insertBefore(createTier(), activeTier.nextSibling);
    settingsModal.close();
  }
};

const handleSettingsClick = (tier) => {
  activeTier = tier;

  // populate the textarea
  const label = tier.querySelector(".label");
  settingsModal.querySelector(".tier-label").value = label.innerText;

  // select the color
  const color = getComputedStyle(label).getPropertyValue("--color");
  settingsModal.querySelector(`input[value="${color}"]`).checked = true;

  settingsModal.showModal();
};

const handleMoveTier = (tier, direction) => {
  const sibling =
    direction === "up" ? tier.previousElementSibling : tier.nextElementSibling;

  if (sibling) {
    const position = direction === "up" ? "beforebegin" : "afterend";
    sibling.insertAdjacentElement(position, tier);
  }
};

const handleDragover = (event) => {
  event.preventDefault(); // allow drop

  const draggedImage = document.querySelector(".dragging");
  const target = event.target;

  if (target.classList.contains("items")) {
    target.appendChild(draggedImage);
  } else if (target.tagName === "IMG" && target !== draggedImage) {
    const { left, width } = target.getBoundingClientRect();
    const midPoint = left + width / 2;

    if (event.clientX < midPoint) {
      target.before(draggedImage);
    } else {
      target.after(draggedImage);
    }
  }
};

const handleDrop = (event) => {
  event.preventDefault(); // prevent default browser handling
};

const createTier = (label = "Change me") => {
  const tierColor = colors[tiersContainer.children.length % colors.length];

  const tier = document.createElement("div");
  tier.className = "tier";
  tier.innerHTML = `
  <div class="label" contenteditable="plaintext-only" style="--color: ${tierColor}">
    <span>${label}</span>
  </div>
  <div class="items"></div>
  <div class="controls">
    <button class="settings"><i class="bi bi-gear-fill"></i></button>
    <button class="moveup"><i class="bi bi-chevron-up"></i></button>
    <button class="movedown"><i class="bi bi-chevron-down"></i></button>
  </div>`;

  // Attach event listeners
  tier
    .querySelector(".settings")
    .addEventListener("click", () => handleSettingsClick(tier));
  tier
    .querySelector(".moveup")
    .addEventListener("click", () => handleMoveTier(tier, "up"));
  tier
    .querySelector(".movedown")
    .addEventListener("click", () => handleMoveTier(tier, "down"));
  tier.querySelector(".items").addEventListener("dragover", handleDragover);
  tier.querySelector(".items").addEventListener("drop", handleDrop);

  return tier;
};

const initColorOptions = () => {
  colors.forEach((color) => {
    const label = document.createElement("label");
    label.style.setProperty("--color", color);
    label.innerHTML = `<input type="radio" name="color" value="${color}" />`;
    colorsContainer.appendChild(label);
  });
};

const initDefaultTierList = () => {
  ["S", "A", "B", "C", "D"].forEach((label) => {
    tiersContainer.appendChild(createTier(label));
  });
};

const loadCharacterImages = () => {
  // 데이터 로딩 확인
  if (!window.characterData || !window.characterList) {
    console.error('Character data not loaded yet');
    return;
  }
  
  const allCharacters = [...window.characterList.mainParty, ...window.characterList.supportParty];
  
  allCharacters.forEach(character => {
    if (character === "원더") return; // 원더 제외
    
    // 캐릭터 데이터 존재 확인
    if (!window.characterData[character]) {
      console.warn(`Character data not found for: ${character}`);
      return;
    }
    
    const img = document.createElement('img');
    img.src = `${BASE_URL}/assets/img/character-half/${character}.webp`;
    img.alt = character;
    img.draggable = true;
    img.dataset.element = window.characterData[character].element;
    img.dataset.position = window.characterData[character].position;
    img.dataset.rarity = window.characterData[character].rarity;
    img.dataset.tags = window.characterData[character].tag || '';
    cardsContainer.appendChild(img);
  });
};

const initDraggables = () => {
  const images = cardsContainer.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "");
      img.classList.add("dragging");
    });

    img.addEventListener("dragend", () => img.classList.remove("dragging"));

    img.addEventListener("dblclick", () => {
      if (img.parentElement !== cardsContainer) {
        cardsContainer.appendChild(img);
        cardsContainer.scrollLeft = cardsContainer.scrollWidth;
      }
    });
  });
};

// 필터 기능 구현
const applyFilters = () => {
  const selectedElements = Array.from(document.querySelectorAll('input[name="element"]:checked')).map(cb => cb.value);
  const selectedPositions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value);
  const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => parseInt(cb.value));
  const selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked')).map(cb => cb.value);
  
  const images = cardsContainer.querySelectorAll('img');
  images.forEach(img => {
    if (img.parentElement !== cardsContainer) return; // 이미 티어에 배치된 이미지는 건너뜀
    
    const element = img.dataset.element;
    const position = img.dataset.position;
    const rarity = parseInt(img.dataset.rarity);
    const tags = img.dataset.tags;
    
    // 속성 필터링 (질풍빙결 특수 처리)
    const elementMatch = selectedElements.length === 0 || 
      selectedElements.includes(element) || 
      (element === "질풍빙결" && (selectedElements.includes("질풍") || selectedElements.includes("빙결")));
    
    const positionMatch = selectedPositions.length === 0 || selectedPositions.includes(position);
    const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(rarity);
    
    // 태그 필터링
    const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => {
      switch(tag) {
        case 'TECHNICAL':
          return tags.includes('TECHNICAL') || tags.includes('스킬마스터');
        case '추가효과':
          return tags.includes('추가 효과') || tags.includes('추가효과');
        case '지속대미지':
          return tags.includes('지속 대미지') || tags.includes('화상') || tags.includes('주원');
        case '화상':
          return tags.includes('화상') || (tags.includes('원소 이상') && !tags.includes('원소 이상 제거'));
        case '풍습':
          return tags.includes('풍습') || (tags.includes('원소 이상') && !tags.includes('원소 이상 제거'));
        case '감전':
          return tags.includes('감전') || (tags.includes('원소 이상') && !tags.includes('원소 이상 제거'));
        case '동결':
          return tags.includes('동결') || (tags.includes('원소 이상') && !tags.includes('원소 이상 제거'));
        case '실드':
          return tags.includes('실드');
        case '효과명중':
          return tags.includes('효과 명중');
        case '방어력감소':
          return tags.includes('방어력 감소');
        case '관통':
          return tags.includes('관통');
        default:
          return false;
      }
    });
    
    img.style.display = elementMatch && positionMatch && rarityMatch && tagMatch ? 'block' : 'none';
  });
};

// 필터 이벤트 리스너 설정
const initFilters = () => {
  const filterToggleBtn = document.querySelector('.filter-toggle-btn');
  const filterContent = document.querySelector('.filter-content');
  const filterResetBtn = document.querySelector('.filter-reset-btn');
  const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
  
  filterContent.style.display = 'block';
  filterToggleBtn.style.display = 'none';
  filterResetBtn.style.display = 'none';
  
  // 체크박스 변경 감지
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      applyFilters();
    });
  });
  
  // 필터 초기화 버튼
  filterResetBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = false);
    filterResetBtn.style.display = 'none';
    applyFilters();
  });
};

// 티어 메이커 초기화 함수 (전역에서 접근 가능하도록)
window.initTierMaker = () => {
  console.log('Initializing tier maker...');
  
  // 이미 초기화된 경우 중복 실행 방지
  if (document.querySelector('.tier')) {
    console.log('Tier maker already initialized');
    return;
  }
  
  loadCharacterImages();
  initDraggables();
  initDefaultTierList();
  initColorOptions();
  initFilters();
};

// 페이지 로드 시 초기화 시도 (데이터가 없으면 대기)
const tryInitialize = () => {
  if (window.characterData && window.characterList) {
    window.initTierMaker();
  } else {
    console.log('Character data not ready, waiting...');
    setTimeout(tryInitialize, 100);
  }
};

// 데이터가 준비되면 초기화 시작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryInitialize);
} else {
  tryInitialize();
}

//* event listeners

document.getElementById('add-tier-button').addEventListener('click', () => {
  tiersContainer.appendChild(createTier());
});

settingsModal.addEventListener("click", (event) => {
  // if the clicked element is the settings modal then close it
  if (event.target === settingsModal) {
    settingsModal.close();
  } else {
    const action = event.target.id;
    const actionMap = {
      delete: handleDeleteTier,
      clear: handleClearTier,
      prepend: handlePrependTier,
      append: handleAppendTier,
    };

    if (action && actionMap[action]) {
      actionMap[action]();
    }
  }
});

settingsModal.addEventListener("close", () => (activeTier = null));

settingsModal
  .querySelector(".tier-label")
  .addEventListener("input", (event) => {
    if (activeTier) {
      activeTier.querySelector(".label span").textContent = event.target.value;
    }
  });

colorsContainer.addEventListener("change", (event) => {
  if (activeTier) {
    activeTier
      .querySelector(".label")
      .style.setProperty("--color", event.target.value);
  }
});

cardsContainer.addEventListener("dragover", (event) => {
  event.preventDefault();

  const draggedImage = document.querySelector(".dragging");
  if (draggedImage) {
    cardsContainer.appendChild(draggedImage);
  }
});

cardsContainer.addEventListener("drop", (event) => {
  event.preventDefault();
  cardsContainer.scrollLeft = cardsContainer.scrollWidth;
});