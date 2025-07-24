import { colors } from "./tier_colors.js";

const settingsModal = document.querySelector(".settings-modal");
const colorsContainer = settingsModal.querySelector(".colors");
const positionTiersContainer = document.querySelector(".position-tiers-container");
const cardsContainer = document.querySelector(".cards");

let activeTier;

// 필터링된 캐릭터들의 원래 위치를 저장하는 맵 (parent와 nextSibling 정보 포함)
const originalPositions = new Map();

// 7개의 직업 포지션 정의
const positions = [
  { id: '지배', name: '', icon: '/assets/img/character-cards/직업_지배.png' },
  { id: '반항', name: '', icon: '/assets/img/character-cards/직업_반항.png' },
  { id: '우월', name: '', icon: '/assets/img/character-cards/직업_우월.png' },
  { id: '굴복', name: '', icon: '/assets/img/character-cards/직업_굴복.png' },
  { id: '방위', name: '', icon: '/assets/img/character-cards/직업_방위.png' },
  { id: '구원', name: '', icon: '/assets/img/character-cards/직업_구원.png' },
  { id: '해명', name: '', icon: '/assets/img/character-cards/직업_해명.png' }
];

const resetTierImages = (tierRow) => {
  const images = tierRow.querySelectorAll(".position-cell img");
  images.forEach((img) => {
    cardsContainer.appendChild(img);
  });
};

const handleDeleteTier = () => {
  if (activeTier) {
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
      // Mobile layout: find and remove the entire mobile container
      const mobileContainer = activeTier.closest('.tier-mobile-container');
      if (mobileContainer) {
        // Move all images back to cards container
        const images = mobileContainer.querySelectorAll('img');
        images.forEach(img => cardsContainer.appendChild(img));
        
        // Remove the entire mobile container
        mobileContainer.remove();
      }
    } else {
      // Desktop layout: remove tier label + 7 position cells + settings cell
      const tierLabelCell = activeTier;
      const allTierLabels = Array.from(positionTiersContainer.querySelectorAll('.tier-label-cell'));
      const currentTierIndex = allTierLabels.indexOf(tierLabelCell);
      
      if (currentTierIndex >= 0) {
        // Calculate the positions of all elements in this tier row
        const elementsPerRow = 9; // 1 label + 7 positions + 1 settings
        const startPosition = (currentTierIndex + 1) * elementsPerRow; // +1 to account for header row
        const endPosition = startPosition + elementsPerRow;
        
        // Get all elements in the container
        const allElements = Array.from(positionTiersContainer.children);
        
        // Find all elements that belong to this tier row
        const tierRowElements = allElements.slice(startPosition, endPosition);
        
        // Move all images from position cells back to cards container
        tierRowElements.forEach(element => {
          if (element && element.classList.contains('position-cell')) {
            const images = element.querySelectorAll('img');
            images.forEach(img => cardsContainer.appendChild(img));
          }
        });
        
        // Remove all elements of this tier row
        tierRowElements.forEach(element => {
          if (element) {
            element.remove();
          }
        });
      }
    }
    
    settingsModal.close();
  }
};

const handleClearTier = () => {
  if (activeTier) {
    // activeTier는 tierLabelCell이므로, 전체 티어 행의 모든 position-cell들을 찾아서 이미지 제거
    const tierLabelCell = activeTier;
    
    // 같은 행의 모든 position-cell들을 찾기
    let nextElement = tierLabelCell.nextElementSibling;
    while (nextElement && !nextElement.classList.contains('tier-label-cell')) {
      if (nextElement.classList.contains('position-cell')) {
        const images = nextElement.querySelectorAll('img');
        images.forEach(img => cardsContainer.appendChild(img));
      }
      nextElement = nextElement.nextElementSibling;
    }
    
    settingsModal.close();
  }
};

const handlePrependTier = () => {
  if (activeTier) {
    // Find the index of the current tier row in the grid
    const allTierLabels = Array.from(positionTiersContainer.querySelectorAll('.tier-label-cell'));
    const currentTierIndex = allTierLabels.indexOf(activeTier);
    
    if (currentTierIndex >= 0) {
      // Calculate the grid position (each tier row has 9 elements: 1 label + 7 positions + 1 settings)
      const elementsPerRow = 9;
      const insertPosition = (currentTierIndex + 1) * elementsPerRow; // +1 to account for header row
      
      // Get all current elements
      const allElements = Array.from(positionTiersContainer.children);
      
      // Create new tier row elements
      const tierColor = getTierColor("New");
      const isMobile = window.innerWidth <= 480;
      
      if (isMobile) {
        // For mobile, just create the mobile tier row normally
        createMobileTierRow("New", tierColor);
      } else {
        // For desktop, we need to insert elements at the correct positions
        const newElements = [];
        
        // Create tier label cell
        const tierLabelCell = document.createElement("div");
        tierLabelCell.className = "tier-label-cell";
        tierLabelCell.contentEditable = "plaintext-only";
        tierLabelCell.style.setProperty("--color", tierColor);
        tierLabelCell.innerHTML = `<span>New</span>`;
        newElements.push(tierLabelCell);
        
        // Create position cells
        positions.forEach(position => {
          const positionCell = document.createElement("div");
          positionCell.className = "position-cell";
          positionCell.dataset.position = position.id;
          
          // Add drag and drop event listeners
          positionCell.addEventListener("dragover", handleDragover);
          positionCell.addEventListener("drop", handleDrop);
          positionCell.addEventListener("dragleave", handleDragLeave);
          positionCell.addEventListener("dragenter", (e) => {
            e.preventDefault();
            const draggedImage = document.querySelector(".dragging");
            if (draggedImage) {
              highlightPositionMatch(draggedImage);
            }
          });
          
          newElements.push(positionCell);
        });
        
        // Create settings cell
        const settingsCell = document.createElement("div");
        settingsCell.className = "settings-cell";
        settingsCell.innerHTML = `
          <button class="settings"><i class="bi bi-gear-fill"></i></button>
          <button class="moveup"><i class="bi bi-chevron-up"></i></button>
          <button class="movedown"><i class="bi bi-chevron-down"></i></button>
        `;
        
        // Attach event listeners
        settingsCell.querySelector(".settings").addEventListener("click", () => handleSettingsClick(tierLabelCell));
        settingsCell.querySelector(".moveup").addEventListener("click", () => handleMoveTier(tierLabelCell, "up"));
        settingsCell.querySelector(".movedown").addEventListener("click", () => handleMoveTier(tierLabelCell, "down"));
        
        newElements.push(settingsCell);
        
        // Insert all new elements at the correct position
        const referenceElement = allElements[insertPosition];
        newElements.forEach(element => {
          if (referenceElement) {
            positionTiersContainer.insertBefore(element, referenceElement);
          } else {
            positionTiersContainer.appendChild(element);
          }
        });
      }
    }
    
    settingsModal.close();
  }
};

const handleAppendTier = () => {
  if (activeTier) {
    // Find the index of the current tier row in the grid
    const allTierLabels = Array.from(positionTiersContainer.querySelectorAll('.tier-label-cell'));
    const currentTierIndex = allTierLabels.indexOf(activeTier);
    
    if (currentTierIndex >= 0) {
      // Calculate the grid position (each tier row has 9 elements: 1 label + 7 positions + 1 settings)
      const elementsPerRow = 9;
      const insertPosition = (currentTierIndex + 2) * elementsPerRow; // +2 to insert after current row (+1 for header, +1 for after current)
      
      // Get all current elements
      const allElements = Array.from(positionTiersContainer.children);
      
      // Create new tier row elements
      const tierColor = getTierColor("New");
      const isMobile = window.innerWidth <= 480;
      
      if (isMobile) {
        // For mobile, just create the mobile tier row normally
        createMobileTierRow("New", tierColor);
      } else {
        // For desktop, we need to insert elements at the correct positions
        const newElements = [];
        
        // Create tier label cell
        const tierLabelCell = document.createElement("div");
        tierLabelCell.className = "tier-label-cell";
        tierLabelCell.contentEditable = "plaintext-only";
        tierLabelCell.style.setProperty("--color", tierColor);
        tierLabelCell.innerHTML = `<span>New</span>`;
        newElements.push(tierLabelCell);
        
        // Create position cells
        positions.forEach(position => {
          const positionCell = document.createElement("div");
          positionCell.className = "position-cell";
          positionCell.dataset.position = position.id;
          
          // Add drag and drop event listeners
          positionCell.addEventListener("dragover", handleDragover);
          positionCell.addEventListener("drop", handleDrop);
          positionCell.addEventListener("dragleave", handleDragLeave);
          positionCell.addEventListener("dragenter", (e) => {
            e.preventDefault();
            const draggedImage = document.querySelector(".dragging");
            if (draggedImage) {
              highlightPositionMatch(draggedImage);
            }
          });
          
          newElements.push(positionCell);
        });
        
        // Create settings cell
        const settingsCell = document.createElement("div");
        settingsCell.className = "settings-cell";
        settingsCell.innerHTML = `
          <button class="settings"><i class="bi bi-gear-fill"></i></button>
          <button class="moveup"><i class="bi bi-chevron-up"></i></button>
          <button class="movedown"><i class="bi bi-chevron-down"></i></button>
        `;
        
        // Attach event listeners
        settingsCell.querySelector(".settings").addEventListener("click", () => handleSettingsClick(tierLabelCell));
        settingsCell.querySelector(".moveup").addEventListener("click", () => handleMoveTier(tierLabelCell, "up"));
        settingsCell.querySelector(".movedown").addEventListener("click", () => handleMoveTier(tierLabelCell, "down"));
        
        newElements.push(settingsCell);
        
        // Insert all new elements at the correct position
        const referenceElement = allElements[insertPosition];
        newElements.forEach(element => {
          if (referenceElement) {
            positionTiersContainer.insertBefore(element, referenceElement);
          } else {
            positionTiersContainer.appendChild(element);
          }
        });
      }
    }
    
    settingsModal.close();
  }
};

const handleSettingsClick = (tierLabelCell) => {
  activeTier = tierLabelCell;

  // populate the textarea
  settingsModal.querySelector(".tier-label").value = tierLabelCell.querySelector('span').innerText;

  // select the color
  const color = getComputedStyle(tierLabelCell).getPropertyValue("--color");
  const colorInput = settingsModal.querySelector(`input[value="${color}"]`);
  if (colorInput) {
    colorInput.checked = true;
  }

  settingsModal.showModal();
};

// Helper function to get the next tier label cell
const getNextTierRow = (currentTierLabelCell) => {
  if (!currentTierLabelCell) return null;
  
  const isMobile = window.innerWidth <= 480;
  
  if (isMobile) {
    // In mobile layout, find the next mobile container
    const currentContainer = currentTierLabelCell.closest('.tier-mobile-container');
    if (currentContainer) {
      const nextContainer = currentContainer.nextElementSibling;
      if (nextContainer && nextContainer.classList.contains('tier-mobile-container')) {
        return nextContainer.querySelector('.tier-label-cell');
      }
    }
  } else {
    // Desktop layout
    let nextElement = currentTierLabelCell.nextElementSibling;
    while (nextElement) {
      if (nextElement.classList.contains('tier-label-cell')) {
        return nextElement;
      }
      nextElement = nextElement.nextElementSibling;
    }
  }
  return null;
};

// Helper function to get tier row elements from tier label cell
const getTierRowFromElement = (tierLabelCell) => {
  if (!tierLabelCell || !tierLabelCell.classList.contains('tier-label-cell')) {
    return null;
  }
  
  const isMobile = window.innerWidth <= 480;
  
  if (isMobile) {
    // In mobile layout, the tier container includes the label and positions container
    const mobileContainer = tierLabelCell.closest('.tier-mobile-container');
    if (mobileContainer) {
      return [mobileContainer];
    }
  } else {
    // Desktop layout: Get all elements from tier-label-cell until the next tier-label-cell
    const tierRowElements = [tierLabelCell];
    let currentElement = tierLabelCell.nextElementSibling;
    
    while (currentElement && !currentElement.classList.contains('tier-label-cell')) {
      tierRowElements.push(currentElement);
      currentElement = currentElement.nextElementSibling;
    }
    
    return tierRowElements;
  }
  
  return null;
};

const handleMoveTier = (tierLabelCell, direction) => {
  const tierRowElements = getTierRowFromElement(tierLabelCell);
  if (!tierRowElements) return;
  
  const targetTierLabelCell = direction === "up" ? 
    getPreviousTierRow(tierLabelCell) : 
    getNextTierRow(tierLabelCell);
  
  if (targetTierLabelCell) {
    const targetElements = getTierRowFromElement(targetTierLabelCell);
    if (targetElements) {
      const insertPosition = direction === "up" ? targetElements[0] : targetElements[targetElements.length - 1].nextElementSibling;
      
      // Move all elements of the tier row
      tierRowElements.forEach(element => {
        positionTiersContainer.insertBefore(element, insertPosition);
      });
    }
  }
};

// Helper function to get previous tier label cell
const getPreviousTierRow = (tierLabelCell) => {
  if (!tierLabelCell) return null;
  
  const isMobile = window.innerWidth <= 480;
  
  if (isMobile) {
    // In mobile layout, find the previous mobile container
    const currentContainer = tierLabelCell.closest('.tier-mobile-container');
    if (currentContainer) {
      const prevContainer = currentContainer.previousElementSibling;
      if (prevContainer && prevContainer.classList.contains('tier-mobile-container')) {
        return prevContainer.querySelector('.tier-label-cell');
      }
    }
  } else {
    // Desktop layout
    let prevElement = tierLabelCell.previousElementSibling;
    while (prevElement) {
      if (prevElement.classList.contains('tier-label-cell')) {
        return prevElement;
      }
      prevElement = prevElement.previousElementSibling;
    }
  }
  return null;
};

// Responsive handler to rebuild layout when screen size changes
let currentLayout = null;
const handleResponsiveLayout = () => {
  const isMobile = window.innerWidth <= 480;
  const newLayout = isMobile ? 'mobile' : 'desktop';
  
  if (currentLayout !== newLayout) {
    console.log(`Layout changed to: ${newLayout}`);
    currentLayout = newLayout;
    
    // Store current tier data
    const tierData = [];
    const tierLabelCells = document.querySelectorAll('.tier-label-cell');
    
    tierLabelCells.forEach(tierLabelCell => {
      const tierLabel = tierLabelCell.querySelector('span').textContent;
      const tierColor = getComputedStyle(tierLabelCell).getPropertyValue('--color');
      
      const positionData = {};
      
      // Find position cells for this tier
      const positionCells = isMobile && currentLayout === 'mobile' 
        ? tierLabelCell.closest('.tier-mobile-container')?.querySelectorAll('.position-cell') || []
        : document.querySelectorAll('.position-cell');
        
      positions.forEach(position => {
        const positionCell = Array.from(positionCells).find(cell => 
          cell.dataset.position === position.id
        );
        
        if (positionCell) {
          const characters = [];
          const images = positionCell.querySelectorAll('img');
          images.forEach(img => {
            characters.push({
              element: img,
              name: img.alt,
              position: img.dataset.position
            });
          });
          positionData[position.id] = characters;
        }
      });
      
      tierData.push({
        label: tierLabel,
        color: tierColor,
        positions: positionData
      });
    });
    
    // Clear existing tiers
    positionTiersContainer.innerHTML = '';
    
    // Rebuild layout
    initPositionTiers();
    
    // Restore tier data
    tierData.forEach(tierInfo => {
      const tierLabelCell = createTierRow(tierInfo.label);
      
      if (tierInfo.color) {
        tierLabelCell.style.setProperty('--color', tierInfo.color);
      }
      
      // Restore characters to their positions
      Object.keys(tierInfo.positions).forEach(positionId => {
        const characters = tierInfo.positions[positionId];
        
        // Find the position cell for this tier and position
        let positionCell;
        if (isMobile) {
          const mobileContainer = tierLabelCell.closest('.tier-mobile-container');
          positionCell = mobileContainer?.querySelector(`[data-position="${positionId}"]`);
        } else {
          // Desktop: find position cell in the same tier row
          let nextElement = tierLabelCell.nextElementSibling;
          while (nextElement && !nextElement.classList.contains('tier-label-cell')) {
            if (nextElement.classList.contains('position-cell') && nextElement.dataset.position === positionId) {
              positionCell = nextElement;
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
        
        if (positionCell && characters) {
          characters.forEach(charInfo => {
            if (charInfo.element) {
              positionCell.appendChild(charInfo.element);
            }
          });
        }
      });
    });
  }
};

const handleDragover = (event) => {
  event.preventDefault(); // allow drop

  const draggedImage = document.querySelector(".dragging");
  const target = event.target;

  // Handle dropping on position cell
  if (target.classList.contains("position-cell")) {
    target.classList.add("drag-over");
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

// 포지션 매칭 하이라이트 함수
const highlightPositionMatch = (draggedImage) => {
  if (!draggedImage) return;
  
  const characterPosition = draggedImage.dataset.position;
  const positionCells = document.querySelectorAll('.position-cell');
  
  positionCells.forEach(cell => {
    const cellPosition = cell.dataset.position;
    
    if (cellPosition === characterPosition) {
      cell.classList.add('highlight-match');
    } else {
      cell.classList.add('highlight-mismatch');
    }
  });
};

// 하이라이트 제거 함수
const clearPositionHighlights = () => {
  document.querySelectorAll('.position-cell').forEach(cell => {
    cell.classList.remove('highlight-match', 'highlight-mismatch');
  });
};

const handleDrop = (event) => {
  event.preventDefault(); // prevent default browser handling
  
  // Remove drag-over class and position highlights
  document.querySelectorAll('.position-cell').forEach(el => {
    el.classList.remove('drag-over');
  });
  cardsContainer.classList.remove('drag-over');
  clearPositionHighlights();
};

const handleDragLeave = (event) => {
  const target = event.target;
  if (target.classList.contains("position-cell")) {
    target.classList.remove("drag-over");
  }
};

// 드래그 시작 시 포지션 하이라이트 추가
const handleDragStart = (event) => {
  const draggedImage = event.target;
  draggedImage.classList.add("dragging");
  
  // 포지션 매칭 하이라이트 시작
  highlightPositionMatch(draggedImage);
};

// 티어 라벨에 따른 고정 색상 반환 함수
const getTierColor = (label) => {
  const tierColors = {
    'T0': '#f0293d',     // 빨간색
    'T0.5': '#7c3aed',   // 보라색
    'T1': '#ffd761',     // 노란색
    'T2': '#8267db',     // 초록색
    'T3': '#4769ff',     // 파란색
    'T4': '#6b7280'      // 회색
  };
  
  // 라벨에서 티어 이름 추출 (대소문자 구분 없이)
  const upperLabel = label.toUpperCase();
  for (const [tierName, color] of Object.entries(tierColors)) {
    if (upperLabel.includes(tierName)) {
      return color;
    }
  }
  
  // 기본색상 (매칭되지 않는 경우)
  return colors[Math.floor(Math.random() * colors.length)];
};

const createTierRow = (label = "New") => {
  const tierColor = getTierColor(label);
  const isMobile = window.innerWidth <= 480;

  if (isMobile) {
    return createMobileTierRow(label, tierColor);
  } else {
    return createDesktopTierRow(label, tierColor);
  }
};

const createMobileTierRow = (label, tierColor) => {
  // Create mobile tier container
  const mobileContainer = document.createElement("div");
  mobileContainer.className = "tier-mobile-container";

  // Create tier label cell (no settings on mobile)
  const tierLabelCell = document.createElement("div");
  tierLabelCell.className = "tier-label-cell";
  tierLabelCell.contentEditable = "plaintext-only";
  tierLabelCell.style.setProperty("--color", tierColor);
  tierLabelCell.innerHTML = `<span>${label}</span>`;
  
  // Create positions container
  const positionsContainer = document.createElement("div");
  positionsContainer.className = "tier-mobile-positions";

  // Create position cells for each position
  positions.forEach(position => {
    const positionCell = document.createElement("div");
    positionCell.className = "position-cell";
    positionCell.dataset.position = position.id;
    
    // Add drag and drop event listeners
    positionCell.addEventListener("dragover", handleDragover);
    positionCell.addEventListener("drop", handleDrop);
    positionCell.addEventListener("dragleave", handleDragLeave);
    positionCell.addEventListener("dragenter", (e) => {
      e.preventDefault();
      const draggedImage = document.querySelector(".dragging");
      if (draggedImage) {
        highlightPositionMatch(draggedImage);
      }
    });
    
    positionsContainer.appendChild(positionCell);
  });

  // Assemble mobile container
  mobileContainer.appendChild(tierLabelCell);
  mobileContainer.appendChild(positionsContainer);
  
  // Add to main container
  positionTiersContainer.appendChild(mobileContainer);

  return tierLabelCell;
};

const createDesktopTierRow = (label, tierColor) => {
  const tierRowElements = [];

  // Create tier label cell
  const tierLabelCell = document.createElement("div");
  tierLabelCell.className = "tier-label-cell";
  tierLabelCell.contentEditable = "plaintext-only";
  tierLabelCell.style.setProperty("--color", tierColor);
  tierLabelCell.innerHTML = `<span>${label}</span>`;
  tierRowElements.push(tierLabelCell);

  // Create position cells for each position
  positions.forEach(position => {
    const positionCell = document.createElement("div");
    positionCell.className = "position-cell";
    positionCell.dataset.position = position.id;
    
    // Add drag and drop event listeners
    positionCell.addEventListener("dragover", handleDragover);
    positionCell.addEventListener("drop", handleDrop);
    positionCell.addEventListener("dragleave", handleDragLeave);
    positionCell.addEventListener("dragenter", (e) => {
      e.preventDefault();
      const draggedImage = document.querySelector(".dragging");
      if (draggedImage) {
        highlightPositionMatch(draggedImage);
      }
    });
    
    tierRowElements.push(positionCell);
  });

  // Create settings cell
  const settingsCell = document.createElement("div");
  settingsCell.className = "settings-cell";
  settingsCell.innerHTML = `
    <button class="settings"><i class="bi bi-gear-fill"></i></button>
    <button class="moveup"><i class="bi bi-chevron-up"></i></button>
    <button class="movedown"><i class="bi bi-chevron-down"></i></button>
  `;

  // Attach event listeners to settings cell buttons
  settingsCell
    .querySelector(".settings")
    .addEventListener("click", () => handleSettingsClick(tierLabelCell));
  settingsCell
    .querySelector(".moveup")
    .addEventListener("click", () => handleMoveTier(tierLabelCell, "up"));
  settingsCell
    .querySelector(".movedown")
    .addEventListener("click", () => handleMoveTier(tierLabelCell, "down"));

  tierRowElements.push(settingsCell);

  // Add all elements to the container
  tierRowElements.forEach(element => {
    positionTiersContainer.appendChild(element);
  });

  return tierLabelCell;
};

const initPositionTiers = () => {
  // Add position headers after tier header
  const tierHeaderCell = positionTiersContainer.querySelector('.tier-header-cell');
  const settingsHeaderCell = positionTiersContainer.querySelector('.settings-header-cell');
  
  positions.forEach(position => {
    const positionHeader = document.createElement("div");
    positionHeader.className = `position-header ${position.id}`;
    positionHeader.innerHTML = `
      <div class="position-icon">
        <img src="${position.icon}" alt="${position.name}" />
      </div>
      <div>${position.name}</div>
    `;
    
    // Insert before settings header
    positionTiersContainer.insertBefore(positionHeader, settingsHeaderCell);
  });

  // Create default tier rows (T0, T0.5, T1, T2, T3, T4)
  ["T0", "T0.5", "T1", "T2", "T3", "T4"].forEach((label) => {
    createTierRow(label);
  });
};

const initColorOptions = () => {
  colors.forEach((color) => {
    const label = document.createElement("label");
    label.style.setProperty("--color", color);
    label.innerHTML = `<input type="radio" name="color" value="${color}" />`;
    colorsContainer.appendChild(label);
  });
};

const loadCharacterImages = () => {
  // 데이터 로딩 확인
  if (!window.characterData || !window.characterList) {
    console.error('Character data not loaded yet');
    return;
  }
  
  // 정렬: release_order 내림차순, 같으면 rarity 내림차순
  const allCharacters = [...window.characterList.mainParty, ...window.characterList.supportParty]
    .filter(character => character !== "원더" && window.characterData[character]);

  allCharacters.sort((a, b) => {
    const aData = window.characterData[a];
    const bData = window.characterData[b];
    const aRarity = Number(aData.rarity) || 0;
    const bRarity = Number(bData.rarity) || 0;
    const aOrder = Number(aData.release_order) || 0;
    const bOrder = Number(bData.release_order) || 0;
    if (bRarity !== aRarity) {
      return bRarity - aRarity;
    }
    return bOrder - aOrder;
  });

  allCharacters.forEach(character => {
    // 캐릭터 데이터 존재 확인
    if (!window.characterData[character]) {
      console.warn(`Character data not found for: ${character}`);
      return;
    }
    const img = document.createElement('img');
    img.src = `${BASE_URL}/assets/img/tier/${character}.webp`;
    img.alt = character;
    img.draggable = true;
    img.dataset.element = window.characterData[character].element;
    img.dataset.position = window.characterData[character].position;
    img.dataset.rarity = window.characterData[character].rarity;
    img.dataset.tags = window.characterData[character].tag || '';
    // 등급별 클래스 추가
    if (window.characterData[character].rarity == 4) {
      img.classList.add('star4');
    } else if (window.characterData[character].rarity == 5) {
      img.classList.add('star5');
    }
    cardsContainer.appendChild(img);
  });
};

// 개별 이미지에 드래그 이벤트 리스너 추가하는 함수
const attachDragListeners = (img) => {
  // 기존 이벤트 리스너 제거 (완전히 새로 시작)
  const newImg = img.cloneNode(true);
  img.parentNode.replaceChild(newImg, img);
  
  // 새로운 이벤트 리스너 추가
  newImg.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.effectAllowed = "move";
    newImg.classList.add("dragging");
    
    // 포지션 하이라이트 추가 (안전하게)
    setTimeout(() => {
      highlightPositionMatch(newImg);
    }, 0);
  });

  newImg.addEventListener("dragend", (e) => {
    newImg.classList.remove("dragging");
    // Remove all drag-over classes and position highlights
    document.querySelectorAll('.position-cell').forEach(el => {
      el.classList.remove('drag-over');
    });
    cardsContainer.classList.remove('drag-over');
    clearPositionHighlights();
    
    // 드래그 완료 후 리스너 재확인
    setTimeout(() => {
      if (!newImg.dataset.dragListenersAttached) {
        attachDragListeners(newImg);
      }
    }, 100);
  });

  newImg.addEventListener("dblclick", (e) => {
    e.preventDefault();
    if (newImg.parentElement !== cardsContainer) {
      cardsContainer.appendChild(newImg);
      cardsContainer.scrollLeft = cardsContainer.scrollWidth;
      // 더블클릭 후 리스너 재확인
      setTimeout(() => {
        if (!newImg.dataset.dragListenersAttached) {
          attachDragListeners(newImg);
        }
      }, 100);
    }
  });
  
  // 이벤트 리스너 추가 완료 표시
  newImg.dataset.dragListenersAttached = 'true';
  
  return newImg;
};

// 모든 이미지에 드래그 기능 초기화
const initDraggables = () => {
  // 캐릭터 풀의 이미지들
  const poolImages = cardsContainer.querySelectorAll("img");
  poolImages.forEach(attachDragListeners);
  
  // 티어에 배치된 이미지들
  const tierImages = document.querySelectorAll('.position-cell img');
  tierImages.forEach(attachDragListeners);
  
  // DOM 변화 감지 옵저버 초기화
  initDragListenerObserver();
};

// 새로 추가되거나 이동된 이미지에 드래그 기능 재적용
const refreshDragListeners = () => {
  const allImages = document.querySelectorAll('img[draggable="true"]');
  allImages.forEach(attachDragListeners);
};

// DOM 변화를 감지하여 자동으로 드래그 리스너를 새로고침하는 MutationObserver
let dragListenerObserver = null;

const initDragListenerObserver = () => {
  if (dragListenerObserver) {
    dragListenerObserver.disconnect();
  }
  
  dragListenerObserver = new MutationObserver((mutations) => {
    let needsRefresh = false;
    
    mutations.forEach((mutation) => {
      // 노드가 추가되거나 제거된 경우
      if (mutation.type === 'childList') {
        // 캐릭터 이미지가 포함된 변화인지 확인
        const hasCharacterImages = 
          Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.tagName === 'IMG' && node.dataset.character || 
             node.querySelector && node.querySelector('img[data-character]'))
          ) ||
          Array.from(mutation.removedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.tagName === 'IMG' && node.dataset.character || 
             node.querySelector && node.querySelector('img[data-character]'))
          );
        
        if (hasCharacterImages) {
          needsRefresh = true;
        }
      }
    });
    
    if (needsRefresh) {
      // 짧은 지연 후 리스너 새로고침 (DOM 변화가 완료된 후)
      setTimeout(() => {
        refreshDragListeners();
      }, 50);
    }
  });
  
  // 캐릭터 풀과 티어 컨테이너를 모두 관찰
  const observeTargets = [cardsContainer, positionTiersContainer];
  observeTargets.forEach(target => {
    if (target) {
      dragListenerObserver.observe(target, {
        childList: true,
        subtree: true
      });
    }
  });
};

// 필터 기능 구현
const applyFilters = () => {
  const selectedElements = Array.from(document.querySelectorAll('input[name="element"]:checked')).map(cb => cb.value);
  const selectedPositions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value);
  const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => parseInt(cb.value));
  const selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked')).map(cb => cb.value);
  
  // 필터가 모두 해제된 경우, 원래 위치로 복원
  const hasActiveFilters = selectedElements.length > 0 || selectedPositions.length > 0 || selectedRarities.length > 0 || selectedTags.length > 0;
  
  if (!hasActiveFilters) {
    // 모든 필터가 해제되면 원래 위치로 복원
    originalPositions.forEach((originalParent, img) => {
      if (img.parentElement === cardsContainer && originalParent !== cardsContainer) {
        originalParent.appendChild(img);
      }
    });
    originalPositions.clear();
    
    // 캐릭터 풀의 모든 이미지 표시
    const poolImages = cardsContainer.querySelectorAll('img');
    poolImages.forEach(img => {
      img.style.display = 'block';
    });
    return;
  }
  
  // 캐릭터 풀의 이미지들 필터링
  const poolImages = cardsContainer.querySelectorAll('img');
  poolImages.forEach(img => {
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
  
  // 티어에 배치된 캐릭터들도 필터링
  const tierImages = document.querySelectorAll('.position-cell img');
  tierImages.forEach(img => {
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
    
    // 필터에 맞지 않는 캐릭터는 캐릭터 풀로 되돌림
    if (!(elementMatch && positionMatch && rarityMatch && tagMatch)) {
      // 원래 위치를 저장 (아직 저장되지 않은 경우에만)
      if (!originalPositions.has(img)) {
        originalPositions.set(img, img.parentElement);
      }
      cardsContainer.appendChild(img);
    }
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

// 파일에서 티어 데이터를 가져오는 함수 (단순 JSON)
const loadTierDataFromFile = async () => {
  try {
    // 현재 언어에 따라 파일 선택
    const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
    const fileName = currentLang === 'kr' ? 'kr_tier.json' : 'global_tier.json';
    const filePath = `../${fileName}`;
    
    console.log('Loading tier data from file:', filePath);
    
    const response = await fetch(filePath);
    if (!response.ok) {
      console.log('Tier file not found:', filePath);
      return null;
    }
    
    const jsonData = await response.text();
    if (!jsonData.trim()) {
      console.log('Tier file is empty');
      return null;
    }
    
    // 단순히 JSON 파싱
    const tierData = JSON.parse(jsonData);
    
    console.log('Tier data loaded from file:', tierData);
    return tierData;
  } catch (error) {
    console.error('Failed to load tier data from file:', error);
    return null;
  }
};

// URL 파라미터에서 티어 데이터를 가져오는 함수 (기존 유지)
const getTierDataFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');
  
  if (!encodedData) return null;
  
  try {
    const decodedString = atob(encodedData);
    const jsonString = decodeURIComponent(decodedString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode tier data from URL:', error);
    return null;
  }
};

// URL 파라미터의 티어 데이터로 티어를 구성하는 함수
const loadTierDataFromURL = (tierData) => {
  if (!tierData || !Array.isArray(tierData)) return;
  
  const isMobile = window.innerWidth <= 480;
  
  // 기존 티어 행들을 모두 제거
  const existingTierLabels = document.querySelectorAll('.tier-label-cell');
  existingTierLabels.forEach(label => {
    const tierRowElements = getTierRowFromElement(label);
    if (tierRowElements) {
      tierRowElements.forEach(element => element.remove());
    }
  });
  
  // URL 데이터로 티어 행들을 생성
  tierData.forEach(tierInfo => {
    const tierLabelCell = createTierRow(tierInfo.label);
    
    // 색상 설정
    if (tierInfo.color) {
      tierLabelCell.style.setProperty('--color', tierInfo.color);
    }
    
    // 각 포지션에 캐릭터 배치
    if (tierInfo.positions) {
      Object.keys(tierInfo.positions).forEach(positionId => {
        const characters = tierInfo.positions[positionId];
        
        // 포지션 셀 찾기 (모바일과 데스크톱 구조가 다름)
        let positionCell;
        
        if (isMobile) {
          // 모바일: tier-mobile-container 내에서 찾기
          const mobileContainer = tierLabelCell.closest('.tier-mobile-container');
          if (mobileContainer) {
            positionCell = mobileContainer.querySelector(`[data-position="${positionId}"]`);
          }
        } else {
          // 데스크톱: 다음 형제 요소들 중에서 찾기
          let nextElement = tierLabelCell.nextElementSibling;
          while (nextElement && !nextElement.classList.contains('tier-label-cell')) {
            if (nextElement.classList.contains('position-cell') && nextElement.dataset.position === positionId) {
              positionCell = nextElement;
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
        
        if (positionCell && characters) {
          characters.forEach(charName => {
            // 캐릭터 이미지를 찾아서 해당 포지션 셀에 배치
            const charImage = document.querySelector(`img[alt="${charName}"]`);
            if (charImage) {
              positionCell.appendChild(charImage);
            }
          });
        }
      });
    }
  });
};

// 포지션별 티어 메이커 초기화 함수 (전역에서 접근 가능하도록)
window.initPositionTierMaker = () => {
  console.log('Initializing position tier maker...');
  
  // URL 파라미터 확인 및 제목 설정
  const urlParams = new URLSearchParams(window.location.search);
  const shouldLoadList = urlParams.get('list') !== 'false';
  
  // 현재 언어 확인
  const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
  
  // 언어별 제목 데이터
  const titleData = {
    'kr': {
      tierList: '티어 리스트',
      tierMaker: '티어 메이커',
      metaPrefix: '페르소나5 더 팬텀 X 루페르넷 - ',
      listDesc: 'P5X 캐릭터 티어 리스트를 확인하세요.',
      makerDesc: 'P5X 캐릭터 티어 리스트를 만들어 보세요.'
    },
    'en': {
      tierList: 'Tier List',
      tierMaker: 'Tier Maker',
      metaPrefix: 'Persona 5: The Phantom X LufelNet - ',
      listDesc: 'Check P5X character tier list by position.',
      makerDesc: 'Create your own P5X character tier list by position.'
    },
    'jp': {
      tierList: 'ティアリスト',
      tierMaker: 'ティアメーカー',
      metaPrefix: 'ペルソナ5 ザ・ファントム X LufelNet - ',
      listDesc: 'P5Xキャラクターのポジション別ティアリストを確認してください。',
      makerDesc: 'ポジション別にP5Xキャラクターティアを作ってみましょう。'
    }
  };
  
  const currentTitleData = titleData[currentLang] || titleData['kr'];
  
  // 제목과 설명 동적 변경 (언어별 제목은 여기서 설정하지 않음 - updateLanguageContent에서 처리)
  const metaTitle = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');
  
  if (shouldLoadList) {
    // 기본: 티어 리스트 모드
    if (metaTitle) metaTitle.textContent = currentTitleData.metaPrefix + currentTitleData.tierList;
    if (metaDescription) metaDescription.setAttribute('content', currentTitleData.listDesc);
  } else {
    // list=false: 티어 메이커 모드
    if (metaTitle) metaTitle.textContent = currentTitleData.metaPrefix + currentTitleData.tierMaker;
    if (metaDescription) metaDescription.setAttribute('content', currentTitleData.makerDesc);
  }
  
  // 이미 초기화된 경우 중복 실행 방지
  if (document.querySelector('.position-header')) {
    console.log('Position tier maker already initialized');
    return;
  }
  
  loadCharacterImages();
  initDraggables();
  initPositionTiers();
  initColorOptions();
  initFilters();
  
  // Initialize responsive layout
  currentLayout = window.innerWidth <= 480 ? 'mobile' : 'desktop';
  
  // Add resize event listener for responsive layout
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(handleResponsiveLayout, 250);
  });
  
  if (shouldLoadList) {
    // 티어 데이터 로드 (URL 파라미터 우선, 없으면 파일에서)
    const loadTierData = async () => {
      // 먼저 URL 파라미터 확인
      let tierData = getTierDataFromURL();
      
      if (tierData) {
        console.log('Loading tier data from URL...');
      } else {
        // URL에 없으면 파일에서 로드
        console.log('No URL data, trying to load from file...');
        tierData = await loadTierDataFromFile();
      }
      
      if (tierData) {
        // 캐릭터 이미지들이 로드된 후에 티어 데이터를 로드
        setTimeout(() => {
          loadTierDataFromURL(tierData);
        }, 500);
      }
    };
    
    loadTierData();
  } else {
    console.log('list=false parameter detected, skipping tier data loading');
  }
  
  // 콘솔 명령어 등록
  window.shareTierList = () => {
    console.log('Share command executed!');
    handleShareClick();
  };

  window.exportTierList = () => {
    console.log('Export command executed!');
    const tierData = exportTierListAsJSON();
    console.log('Tier data:', tierData);
    return tierData;
  };
  
  console.log('🎮 Console commands available:');
  console.log('  shareTierList() - Copy tier data to clipboard');
  console.log('  exportTierList() - Show tier data in console');
};

// 페이지 로드 시 초기화 시도 (데이터가 없으면 대기)
const tryInitialize = () => {
  if (window.characterData && window.characterList) {
    window.initPositionTierMaker();
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

// Event listeners

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
      activeTier.querySelector("span").textContent = event.target.value;
    }
  });

colorsContainer.addEventListener("change", (event) => {
  if (activeTier) {
    activeTier.style.setProperty("--color", event.target.value);
  }
});

cardsContainer.addEventListener("dragover", (event) => {
  event.preventDefault();

  const draggedImage = document.querySelector(".dragging");
  if (draggedImage) {
    cardsContainer.classList.add("drag-over");
    cardsContainer.appendChild(draggedImage);
  }
});

cardsContainer.addEventListener("drop", (event) => {
  event.preventDefault();
  cardsContainer.classList.remove("drag-over");
  cardsContainer.scrollLeft = cardsContainer.scrollWidth;
});

cardsContainer.addEventListener("dragleave", (event) => {
  // Only remove drag-over if we're actually leaving the cards container
  if (!cardsContainer.contains(event.relatedTarget)) {
    cardsContainer.classList.remove("drag-over");
  }
}); 

// 티어 리스트 결과를 JSON으로 내보내는 함수 (인코딩 없이)
const exportTierListAsJSON = () => {
  console.log('Exporting tier list as JSON...');
  
  // 표준 티어 목록 (항상 포함되어야 함)
  const standardTiers = ['T0', 'T0.5', 'T1', 'T2', 'T3', 'T4'];
  const tierData = [];
  
  // 각 표준 티어에 대해 데이터 수집
  standardTiers.forEach(tierLabel => {
    // 해당 티어가 DOM에 존재하는지 확인
    const tierLabelCell = Array.from(document.querySelectorAll('.tier-label-cell'))
      .find(cell => cell.querySelector('span').textContent.trim() === tierLabel);
    
    let tierColor = getTierColor(tierLabel); // 기본 색상
    const positionData = {};
    
    // 모든 포지션에 대해 빈 배열로 초기화
    positions.forEach(position => {
      positionData[position.id] = [];
    });
    
    if (tierLabelCell) {
      // DOM에 존재하는 경우, 실제 색상과 캐릭터 데이터 수집
      tierColor = getComputedStyle(tierLabelCell).getPropertyValue('--color');
      
      // 같은 행의 모든 position-cell들을 찾기
      let nextElement = tierLabelCell.nextElementSibling;
      while (nextElement && !nextElement.classList.contains('tier-label-cell')) {
        if (nextElement.classList.contains('position-cell')) {
          const positionId = nextElement.dataset.position;
          const characters = [];
          
          // 해당 셀의 모든 캐릭터 이미지 수집 (이름만 저장)
          const images = nextElement.querySelectorAll('img');
          images.forEach(img => {
            characters.push(img.alt); // 이름만 저장
          });
          
          positionData[positionId] = characters;
        }
        nextElement = nextElement.nextElementSibling;
      }
    }
    
    tierData.push({
      label: tierLabel,
      color: tierColor,
      positions: positionData
    });
  });
  
  // 추가로 DOM에만 존재하는 커스텀 티어들도 포함
  const tierLabelCells = document.querySelectorAll('.tier-label-cell');
  tierLabelCells.forEach(tierLabelCell => {
    const tierLabel = tierLabelCell.querySelector('span').textContent.trim();
    
    // 표준 티어가 아닌 경우에만 추가
    if (!standardTiers.includes(tierLabel)) {
      const tierColor = getComputedStyle(tierLabelCell).getPropertyValue('--color');
      const positionData = {};
      
      // 모든 포지션에 대해 빈 배열로 초기화
      positions.forEach(position => {
        positionData[position.id] = [];
      });
      
      // 같은 행의 모든 position-cell들을 찾기
      let nextElement = tierLabelCell.nextElementSibling;
      while (nextElement && !nextElement.classList.contains('tier-label-cell')) {
        if (nextElement.classList.contains('position-cell')) {
          const positionId = nextElement.dataset.position;
          const characters = [];
          
          // 해당 셀의 모든 캐릭터 이미지 수집 (이름만 저장)
          const images = nextElement.querySelectorAll('img');
          images.forEach(img => {
            characters.push(img.alt); // 이름만 저장
          });
          
          positionData[positionId] = characters;
        }
        nextElement = nextElement.nextElementSibling;
      }
      
      tierData.push({
        label: tierLabel,
        color: tierColor,
        positions: positionData
      });
    }
  });
  
  // 단순한 JSON 문자열로 반환 (인코딩 없이)
  const jsonString = JSON.stringify(tierData, null, 2); // 예쁘게 포맷팅
  console.log('JSON string:', jsonString);
  
  return jsonString;
};

// URL 파라미터에서 티어 리스트를 디코딩하는 함수
const decodeTierList = (encodedData) => {
  try {
    const decodedString = atob(encodedData);
    const jsonString = decodeURIComponent(decodedString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode tier list:', error);
    return null;
  }
};

// 공유 버튼 클릭 핸들러
const handleShareClick = () => {
  console.log('Share button clicked!');
  
  const jsonData = exportTierListAsJSON();
  console.log('JSON data:', jsonData);
  
  // 클립보드에 JSON 데이터 복사
  navigator.clipboard.writeText(jsonData).then(() => {
    alert('티어 리스트 데이터가 클립보드에 복사되었습니다!\n\n이 데이터를 tier 폴더의 kr_tier.json 또는 global_tier.json 파일에 저장하세요.');
  }).catch(() => {
    // 클립보드 복사 실패 시 데이터를 직접 표시
    prompt('티어 리스트 데이터 (이것을 파일에 저장하세요):', jsonData);
  });
}; 