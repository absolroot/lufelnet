import { colors } from "./tier_colors.js";

const settingsModal = document.querySelector(".settings-modal");
const colorsContainer = settingsModal.querySelector(".colors");
const positionTiersContainer = document.querySelector(".position-tiers-container");
const cardsContainer = document.querySelector(".cards");

let activeTier;

// 티어 데이터 로딩 상태 관리
let isTierDataLoading = false;

// 티어 리스트 모드 (true: 보기 모드, false: 편집 모드)
let isTierListMode = false;

// 글로벌 언어(en/jp)에서 KR 티어 파일 강제 사용 여부
let forceUseKRTierInGlobal = false;

const getTierI18nText = (key, fallback = '') => {
  if (typeof window.t === 'function') {
    return window.t(key, fallback);
  }
  return fallback || key;
};

const getTierPageMode = () => {
  const forcedMode = String(window.__TIER_PAGE_MODE__ || '').toLowerCase();
  if (forcedMode === 'list' || forcedMode === 'maker') {
    return forcedMode;
  }

  const path = String(window.location.pathname || '').toLowerCase();
  if (/^\/(kr|en|jp|cn)\/tier-maker\/?$/.test(path)) return 'maker';
  if (/^\/(kr|en|jp|cn)\/tier\/?$/.test(path)) return 'list';
  if (/^\/tier-maker\/?$/.test(path)) return 'maker';
  if (/^\/tier\/?$/.test(path)) return 'list';

  return (new URLSearchParams(window.location.search).get('list') === 'false')
    ? 'maker'
    : 'list';
};

const getCurrentCharacterLinkLang = () => {
  try {
    const seoLang = String(window.__SEO_PATH_LANG__ || '').toLowerCase();
    if (['kr', 'en', 'jp', 'cn'].includes(seoLang)) return seoLang;

    if (typeof LanguageRouter !== 'undefined' && typeof LanguageRouter.getCurrentLanguage === 'function') {
      const lang = String(LanguageRouter.getCurrentLanguage() || '').toLowerCase();
      if (['kr', 'en', 'jp', 'cn'].includes(lang)) return lang;
    }

    const pathLangMatch = String(window.location.pathname || '').match(/^\/(kr|en|jp|cn)(\/|$)/i);
    if (pathLangMatch && pathLangMatch[1]) {
      const lang = String(pathLangMatch[1]).toLowerCase();
      if (['kr', 'en', 'jp', 'cn'].includes(lang)) return lang;
    }

    const queryLang = String(new URLSearchParams(window.location.search || '').get('lang') || '').toLowerCase();
    if (['kr', 'en', 'jp', 'cn'].includes(queryLang)) return queryLang;
  } catch (_) { }

  return 'kr';
};

const resolveCharacterSlug = (characterName) => {
  try {
    const map = window.__CHARACTER_SLUG_MAP;
    if (!map || typeof map !== 'object') return null;

    const entry = map[characterName];
    if (entry && entry.slug) return entry.slug;

    const keys = Object.keys(map);
    for (let i = 0; i < keys.length; i += 1) {
      const info = map[keys[i]];
      if (!info || !info.slug || !Array.isArray(info.aliases)) continue;
      if (info.aliases.includes(characterName)) return info.slug;
    }
  } catch (_) {
    // no-op
  }
  return null;
};

const buildCharacterDetailHref = (characterName, lang) => {
  const safeLang = ['kr', 'en', 'jp', 'cn'].includes(String(lang || '').toLowerCase())
    ? String(lang).toLowerCase()
    : 'kr';
  const slug = resolveCharacterSlug(characterName);
  const base = String(window.BASE_URL || '').replace(/\/+$/, '');

  if (slug) {
    return `${base}/${safeLang}/character/${encodeURIComponent(slug)}/`;
  }

  const legacyPath = `${base || ''}/character.html`;
  const url = new URL(legacyPath.startsWith('/') ? legacyPath : `/${legacyPath}`, window.location.origin);
  url.searchParams.set('name', characterName);
  url.searchParams.set('lang', safeLang);
  return url.pathname + url.search;
};

const getNewTierLabel = () => getTierI18nText('newTierLabel', 'New');

// 필터링된 캐릭터들의 원래 위치를 저장하는 맵 (parent와 nextSibling 정보 포함)
const originalPositions = new Map();

// 이미지와 wrapper에 클래스를 설정하는 공통 함수
const applyCharacterClasses = (img, wrapper = null) => {
  if (!img || img.classList.contains('character-ritual-icon') || img.classList.contains('character-core-icon')) return;

  // 이미지에 character-img 클래스 추가
  img.classList.add('character-img');

  // rarity에 따라 이미지에 star4/star5 클래스 추가
  const rarity = parseInt(img.dataset.rarity, 10);
  if (rarity === 4) {
    img.classList.add('star4');
    img.classList.remove('star5');
  } else if (rarity === 5) {
    img.classList.add('star5');
    img.classList.remove('star4');
  }

  // wrapper가 있으면 wrapper에도 클래스 추가
  if (wrapper) {
    if (rarity === 4) {
      wrapper.classList.add('star4');
      wrapper.classList.remove('star5');
    } else if (rarity === 5) {
      wrapper.classList.add('star5');
      wrapper.classList.remove('star4');
    }
  }
};

const wrapCharacterImage = (img) => {
  if (!img || img.classList.contains('character-ritual-icon') || img.classList.contains('character-core-icon')) return img;
  const existingWrapper = img.closest('.character-wrapper');
  if (existingWrapper) return existingWrapper;

  const wrapper = document.createElement('div');
  wrapper.className = 'character-wrapper';
  wrapper.draggable = true;

  wrapper.alt = img.alt || '';
  ['element', 'position', 'rarity', 'tags', 'ritual', 'core'].forEach((key) => {
    if (img.dataset[key] !== undefined) {
      wrapper.dataset[key] = img.dataset[key];
    }
  });

  // 공통 함수로 클래스 적용
  applyCharacterClasses(img, wrapper);

  img.draggable = false;

  const parent = img.parentElement;
  if (parent) {
    parent.insertBefore(wrapper, img);
  }
  wrapper.appendChild(img);
  return wrapper;
};

const getCharacterContainer = (img) => {
  if (!img) return null;
  return img.closest('.character-wrapper') || img;
};

const TIER_CHARACTER_DETAIL_ANCHOR_CLASS = 'character-detail-anchor';

const getPrimaryCharacterImage = (element) => {
  if (!element) return null;
  if (element.tagName === 'IMG' &&
    !element.classList.contains('character-ritual-icon') &&
    !element.classList.contains('character-core-icon')) {
    return element;
  }
  return element.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
};

const removeCharacterDetailAnchor = (img) => {
  if (!img || !img.parentElement) return;
  const parent = img.parentElement;
  if (!parent.matches || !parent.matches(`a.${TIER_CHARACTER_DETAIL_ANCHOR_CLASS}`)) return;
  const grandParent = parent.parentElement;
  if (!grandParent) return;
  grandParent.insertBefore(img, parent);
  grandParent.removeChild(parent);
};

const syncCharacterDetailAnchorForMode = (element) => {
  const targetImage = getPrimaryCharacterImage(element);
  if (!targetImage || !targetImage.alt) return;

  if (!isTierListMode) {
    removeCharacterDetailAnchor(targetImage);
    return;
  }

  const lang = getCurrentCharacterLinkLang();
  const href = buildCharacterDetailHref(targetImage.alt, lang);
  const currentParent = targetImage.parentElement;

  if (currentParent && currentParent.matches && currentParent.matches(`a.${TIER_CHARACTER_DETAIL_ANCHOR_CLASS}`)) {
    currentParent.href = href;
    currentParent.draggable = false;
    return;
  }

  if (!currentParent) return;

  const anchor = document.createElement('a');
  anchor.className = TIER_CHARACTER_DETAIL_ANCHOR_CLASS;
  anchor.href = href;
  anchor.draggable = false;
  anchor.addEventListener('dragstart', (event) => event.preventDefault());
  currentParent.insertBefore(anchor, targetImage);
  anchor.appendChild(targetImage);
};

// 7개의 직업 포지션 정의
const positions = [
  { id: '지배', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_지배.png` },
  { id: '반항', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_반항.png` },
  { id: '우월', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_우월.png` },
  { id: '굴복', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_굴복.png` },
  { id: '방위', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_방위.png` },
  { id: '구원', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_구원.png` },
  { id: '해명', name: '', icon: `${BASE_URL}/assets/img/character-cards/직업_해명.png` }
];

const resetTierImages = (tierRow) => {
  const images = tierRow.querySelectorAll(".position-cell img");
  images.forEach((img) => {
    cardsContainer.appendChild(img);
  });
};

const handleDeleteTier = () => {
  if (activeTier) {
    const isMobile = window.innerWidth <= 1200;

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
      const newTierLabel = getNewTierLabel();
      const tierColor = getTierColor(newTierLabel);
      const isMobile = window.innerWidth <= 1200;

      if (isMobile) {
        // For mobile, just create the mobile tier row normally
        createMobileTierRow(newTierLabel, tierColor);
      } else {
        // For desktop, we need to insert elements at the correct positions
        const newElements = [];

        // Create tier label cell
        const tierLabelCell = document.createElement("div");
        tierLabelCell.className = "tier-label-cell";
        tierLabelCell.contentEditable = "plaintext-only";
        tierLabelCell.style.setProperty("--color", tierColor);
        tierLabelCell.innerHTML = `<span>${newTierLabel}</span>`;
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
      const newTierLabel = getNewTierLabel();
      const tierColor = getTierColor(newTierLabel);
      const isMobile = window.innerWidth <= 1200;

      if (isMobile) {
        // For mobile, just create the mobile tier row normally
        createMobileTierRow(newTierLabel, tierColor);
      } else {
        // For desktop, we need to insert elements at the correct positions
        const newElements = [];

        // Create tier label cell
        const tierLabelCell = document.createElement("div");
        tierLabelCell.className = "tier-label-cell";
        tierLabelCell.contentEditable = "plaintext-only";
        tierLabelCell.style.setProperty("--color", tierColor);
        tierLabelCell.innerHTML = `<span>${newTierLabel}</span>`;
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
  // 티어 데이터 로딩 중이거나 티어 리스트 모드일 때는 설정 창을 열지 않음
  if (isTierDataLoading || isTierListMode) {
    return;
  }

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

  const isMobile = window.innerWidth <= 1200;

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

  const isMobile = window.innerWidth <= 1200;

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

  const isMobile = window.innerWidth <= 1200;

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
  const isMobile = window.innerWidth <= 1200;
  const newLayout = isMobile ? 'mobile' : 'desktop';

  if (currentLayout !== newLayout) {
    //console.log(`Layout changed to: ${newLayout}`);
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
    // hierarchy 오류 방지: draggedImage가 target의 부모이거나 target이 draggedImage의 부모인 경우 방지
    if (draggedImage.contains(target) || target.contains(draggedImage)) {
      return; // hierarchy 충돌 방지
    }

    // Find the appropriate container to insert the dragged image
    // If target is inside a character-wrapper, use the wrapper as reference
    let referenceElement = target;
    const targetWrapper = target.closest('.character-wrapper');

    if (targetWrapper) {
      // If target is inside a wrapper, use the wrapper as reference point
      referenceElement = targetWrapper;
    }

    // Get the parent container (position-cell or cards container)
    const parentContainer = referenceElement.parentElement;

    // Only proceed if we have a valid parent container
    if (!parentContainer) {
      return;
    }

    const { left, width } = referenceElement.getBoundingClientRect();
    const midPoint = left + width / 2;

    try {
      // Insert relative to the reference element (wrapper or image)
      if (event.clientX < midPoint) {
        referenceElement.before(draggedImage);
      } else {
        referenceElement.after(draggedImage);
      }
    } catch (error) {
      // HierarchyRequestError 발생 시 무시
      console.warn('Hierarchy error prevented during drag operation:', error);
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

const createTierRow = (label) => {
  const tierLabel = label || getNewTierLabel();
  const tierColor = getTierColor(tierLabel);
  const isMobile = window.innerWidth <= 1200;

  if (isMobile) {
    return createMobileTierRow(tierLabel, tierColor);
  } else {
    return createDesktopTierRow(tierLabel, tierColor);
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

const dedupeCharacterPool = () => {
  const poolItems = Array.from(cardsContainer.querySelectorAll('.character-wrapper, img:not(.character-ritual-icon):not(.character-core-icon)'))
    .filter(item => item.classList.contains('character-wrapper') || !item.closest('.character-wrapper'));
  const seen = new Set();

  poolItems.forEach(item => {
    const img = item.tagName === 'IMG' ? item : item.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
    if (!img) return;
    const rawSrc = img.getAttribute('src') || '';
    const key = `${(img.alt || '').trim()}|${rawSrc.trim()}`;
    if (!key || key === '|') return;
    if (seen.has(key)) {
      item.remove();
      return;
    }
    seen.add(key);
  });
};

const loadCharacterImages = () => {
  // 데이터 로딩 확인
  if (!window.characterData || !window.characterList) {
    console.error('Character data not loaded yet');
    return;
  }

  // 기존 카드 풀에 이미 존재하는 캐릭터 이름 (중복 append 방지)
  const existingPoolNames = new Set(
    Array.from(cardsContainer.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)'))
      .map(img => img.alt)
      .filter(Boolean)
  );

  // 정렬: release_order 내림차순, 같으면 rarity 내림차순
  const allCharacters = [...window.characterList.mainParty, ...window.characterList.supportParty]
    .filter(character => character !== "원더" && window.characterData[character]);

  // 캐릭터 리스트 내 중복 키 방지
  const uniqueCharacters = Array.from(new Set(allCharacters));

  uniqueCharacters.sort((a, b) => {
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

  uniqueCharacters.forEach(character => {
    // 이미 카드 풀에 있으면 재생성하지 않음
    if (existingPoolNames.has(character)) return;

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
    const wrapper = wrapCharacterImage(img);
    cardsContainer.appendChild(wrapper);
    existingPoolNames.add(character);
  });

  // 비동기 호출 순서가 겹쳐도 카드 풀에는 동일 캐릭터가 1개만 남도록 보정
  dedupeCharacterPool();
};

// 티어 메이커용: 스포일러 토글에 따라 카드 풀만 다시 로드 (티어 행은 건드리지 않음)
window.reloadPositionTierCharacterPool = async function (useKROverride) {
  try {
    // 캐릭터 데이터 다시 로드 (listLangOverride: 'kr' 사용 시 KR 전체 리스트)
    if (typeof window.loadCharacterDataForTierSource === 'function') {
      const override = useKROverride ? 'kr' : undefined;
      await window.loadCharacterDataForTierSource(override);
    }
    // 카드 풀만 초기화 후 재구성
    cardsContainer.innerHTML = '';
    loadCharacterImages();
    initDraggables();
    dedupeCharacterPool();
  } catch (e) {
    console.error('Failed to reload character pool for spoiler toggle:', e);
  }
};

// 주어진 캐릭터 이름들이 DOM에 없으면 카드 풀에 보강 생성
const ensurePoolHasCharacters = (characterNames) => {
  if (!Array.isArray(characterNames) || characterNames.length === 0) return;
  const allImgs = Array.from(document.querySelectorAll('img'));
  characterNames.forEach(name => {
    try {
      const exists = allImgs.some(img => img.alt === name);
      if (exists) return;
      if (!window.characterData || !window.characterData[name]) return;
      const img = document.createElement('img');
      img.src = `${BASE_URL}/assets/img/tier/${name}.webp`;
      img.alt = name;
      img.draggable = true;
      img.dataset.element = window.characterData[name].element;
      img.dataset.position = window.characterData[name].position;
      img.dataset.rarity = window.characterData[name].rarity;
      img.dataset.tags = window.characterData[name].tag || '';
      if (window.characterData[name].rarity == 4) img.classList.add('star4');
      else if (window.characterData[name].rarity == 5) img.classList.add('star5');
      const wrapper = wrapCharacterImage(img);
      cardsContainer.appendChild(wrapper);
      attachDragListeners(wrapper);
    } catch (_) { /* ignore single entry */ }
  });
};

// 개별 이미지 또는 wrapper에 드래그 이벤트 리스너 추가하는 함수
const attachDragListeners = (element, force = false) => {
  if (!element) return null;

  // 드래그 중인 요소는 절대로 건드리지 않음
  if (element.classList.contains('dragging')) {
    return element;
  }

  // 이미 리스너가 부착되어 있고 강제 업데이트가 아니면 스킵
  if (!force && element.dataset.dragListenersAttached === 'true') {
    return element;
  }

  // 기존 이벤트 리스너 제거 (완전히 새로 시작)
  let newElement;
  if (element && element.parentNode) {
    // DOM에 붙어있는 경우에만 교체
    newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
  } else {
    // 부모가 없으면 그대로 사용
    newElement = element;
  }

  // 티어 리스트 모드에서는 드래그 비활성화 및 클릭 스타일 적용
  if (isTierListMode) {
    newElement.draggable = false;
    newElement.style.cursor = 'pointer';
    newElement.classList.add('clickable-character');
  } else {
    newElement.draggable = true;
    newElement.style.cursor = 'grab';
    newElement.classList.remove('clickable-character');
  }
  syncCharacterDetailAnchorForMode(newElement);

  // 새로운 이벤트 리스너 추가
  newElement.addEventListener("dragstart", (e) => {
    // 티어 데이터 로딩 중이거나 티어 리스트 모드일 때는 드래그를 막음
    if (isTierDataLoading || isTierListMode) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.effectAllowed = "move";
    newElement.classList.add("dragging");

    // 포지션 하이라이트 추가 (안전하게)
    setTimeout(() => {
      highlightPositionMatch(newElement);
    }, 0);
  });

  newElement.addEventListener("dragend", (e) => {
    newElement.classList.remove("dragging");
    // Remove all drag-over classes and position highlights
    document.querySelectorAll('.position-cell').forEach(el => {
      el.classList.remove('drag-over');
    });
    cardsContainer.classList.remove('drag-over');
    clearPositionHighlights();

    // 드래그 완료 후 리스너 재확인
    setTimeout(() => {
      if (!newElement.dataset.dragListenersAttached) {
        attachDragListeners(newElement);
      }
    }, 100);
  });

  const getTargetImage = () => getPrimaryCharacterImage(newElement);

  const openCharacterDetail = (openInNewTab = false) => {
    const targetImage = getTargetImage();
    if (!targetImage || !targetImage.alt) return;
    const characterName = targetImage.alt;
    const lang = getCurrentCharacterLinkLang();
    const href = buildCharacterDetailHref(characterName, lang);

    if (openInNewTab) {
      window.open(href, '_blank', 'noopener');
      return;
    }

    window.location.href = href;
  };

  let clickNavigateTimeout = null;

  // 더블클릭 이벤트는 이미지 또는 wrapper에 모두 적용
  newElement.addEventListener("dblclick", (e) => {
    e.preventDefault();
    if (clickNavigateTimeout) {
      clearTimeout(clickNavigateTimeout);
      clickNavigateTimeout = null;
    }
    const targetImage = getTargetImage();
    if (targetImage) {
      openRitualModal(targetImage);
    }
  });

  // 캐릭터 클릭 시 상세 페이지로 이동 (티어 리스트 모드에서만)
  newElement.addEventListener("click", (e) => {
    if (!isTierListMode || e.button !== 0) {
      return;
    }
    const clickedLink = e.target && typeof e.target.closest === 'function'
      ? e.target.closest(`a.${TIER_CHARACTER_DETAIL_ANCHOR_CLASS}`)
      : null;
    if (clickedLink) {
      e.preventDefault();
    }

    if (clickNavigateTimeout) {
      clearTimeout(clickNavigateTimeout);
      clickNavigateTimeout = null;
    }

    clickNavigateTimeout = setTimeout(() => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        openCharacterDetail(true);
      } else {
        openCharacterDetail(false);
      }
      clickNavigateTimeout = null;
    }, 200);
  });

  // 가운데 클릭 새 탭
  newElement.addEventListener("auxclick", (e) => {
    if (!isTierListMode || e.button !== 1) return;
    e.preventDefault();
    openCharacterDetail(true);
  });

  // 이벤트 리스너 추가 완료 표시
  newElement.dataset.dragListenersAttached = 'true';

  return newElement;
};

// 모든 이미지에 드래그 기능 초기화
const initDraggables = () => {
  // 캐릭터 풀의 wrapper/이미지들
  const poolWrappers = Array.from(cardsContainer.querySelectorAll('.character-wrapper'));
  const poolImages = Array.from(cardsContainer.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)'))
    .filter(img => !img.closest('.character-wrapper'));
  poolWrappers.concat(poolImages).forEach(el => attachDragListeners(el));

  // 티어에 배치된 wrapper/이미지들
  const tierWrappers = Array.from(document.querySelectorAll('.position-cell .character-wrapper'));
  const tierImages = Array.from(document.querySelectorAll('.position-cell img:not(.character-ritual-icon):not(.character-core-icon)'))
    .filter(img => !img.closest('.character-wrapper'));
  tierWrappers.concat(tierImages).forEach(el => attachDragListeners(el));

  // DOM 변화 감지 옵저버 초기화
  initDragListenerObserver();
};

// 새로 추가되거나 이동된 이미지에 드래그 기능 재적용
const refreshDragListeners = () => {
  initDraggables();
};

// 모든 캐릭터의 드래그 리스너를 모드에 맞게 업데이트
const updateAllDragListenersForMode = () => {
  // 모든 캐릭터 이미지와 wrapper 찾기
  const allCharacters = document.querySelectorAll('.main-wrapper img, .character-wrapper');

  allCharacters.forEach(element => {
    // 이미 드래그 리스너가 있는 요소만 업데이트 (강제 업데이트)
    if (element.dataset.dragListenersAttached === 'true') {
      attachDragListeners(element, true);
    }
  });
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
  const poolItems = Array.from(cardsContainer.querySelectorAll('.character-wrapper, img:not(.character-ritual-icon):not(.character-core-icon)'))
    .filter(item => item.classList.contains('character-wrapper') || !item.closest('.character-wrapper'));
  poolItems.forEach(item => {
    if (!item.closest('.cards') || item.closest('.cards') !== cardsContainer) return;
    const img = item.tagName === 'IMG' ? item : item.querySelector('img');
    if (!img) return;

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
      switch (tag) {
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

    item.style.display = elementMatch && positionMatch && rarityMatch && tagMatch ? 'block' : 'none';
  });

  // 티어에 배치된 캐릭터들도 필터링
  const tierItems = Array.from(document.querySelectorAll('.position-cell .character-wrapper, .position-cell img:not(.character-ritual-icon):not(.character-core-icon)'))
    .filter(item => item.classList.contains('character-wrapper') || !item.closest('.character-wrapper'));
  tierItems.forEach(item => {
    const img = item.tagName === 'IMG' ? item : item.querySelector('img');
    if (!img) return;
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
      switch (tag) {
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
      if (!originalPositions.has(item)) {
        originalPositions.set(item, item.parentElement);
      }
      cardsContainer.appendChild(item);
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
const loadTierDataFromFile = async (useKROverride = false) => {
  try {
    // 현재 언어에 따라 파일 선택
    const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
    const fileName = (useKROverride || currentLang === 'kr') ? 'kr_tier.json' : 'global_tier.json';
    const filePath = `${BASE_URL}/apps/tier/${fileName}`;

    //console.log('Loading tier data from file:', filePath);

    const response = await fetch(filePath);
    if (!response.ok) {
      //console.log('Tier file not found:', filePath);
      return null;
    }

    const jsonData = await response.text();
    if (!jsonData.trim()) {
      //console.log('Tier file is empty');
      return null;
    }

    // 단순히 JSON 파싱
    const tierData = JSON.parse(jsonData);

    //console.log('Tier data loaded from file:', tierData);
    return tierData;
  } catch (error) {
    //console.error('Failed to load tier data from file:', error);
    return null;
  }
};

// 티어 소스 전환 API (전역 노출)
// source: 'global' | 'kr' | 'kr_spoiler'
window.setTierSource = async (source) => {
  try {
    const src = source || 'global';
    forceUseKRTierInGlobal = (src !== 'global');
    if (!isTierListMode) {
      // 리스트 모드가 아닌 경우엔 동작하지 않음
      return;
    }
    isTierDataLoading = true;
    // 0) 캐릭터 리스트/데이터 재로딩
    // - global, kr: 현재 언어의 characterList 사용 (listLangOverride undefined)
    // - kr_spoiler: KR characterList 강제 사용 (listLangOverride='kr')
    if (typeof window.loadCharacterDataForTierSource === 'function') {
      const override = (src === 'kr_spoiler') ? 'kr' : undefined;
      await window.loadCharacterDataForTierSource(override);
    }
    // 기존 티어를 초기 상태로 재구성하여 깔끔히 교체
    // 1) 모든 포지션 셀 초기화 및 카드 풀 초기화 후 재구성
    document.querySelectorAll('.position-cell').forEach(cell => { cell.innerHTML = ''; });
    cardsContainer.innerHTML = '';
    loadCharacterImages();
    initDraggables();
    // 2) 파일에서 원하는 소스로 재로딩
    const tierData = await loadTierDataFromFile(forceUseKRTierInGlobal);
    if (tierData) {
      // 캐릭터 이미지들이 준비되었다고 가정하고 바로 적용
      loadTierDataFromURL(tierData);
      // 안전장치: 티어 데이터에 포함된 이름이 풀에 없으면 보강 생성
      try {
        if (src === 'kr_spoiler') {
          const names = [];
          tierData.forEach(t => {
            Object.values(t.positions || {}).forEach(list => {
              (list || []).forEach(cd => {
                const n = typeof cd === 'string' ? cd : cd?.name; if (n) names.push(n);
              });
            });
          });
          ensurePoolHasCharacters(Array.from(new Set(names)));
        }
      } catch (_) { }
    }
  } catch (e) {
    console.error('Failed to switch tier source:', e);
  } finally {
    isTierDataLoading = false;
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

  // 티어 데이터 로딩 시작
  isTierDataLoading = true;

  const isMobile = window.innerWidth <= 1200;

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
          characters.forEach(charData => {
            // 캐릭터 데이터가 문자열인지 객체인지 확인 (하위 호환성)
            const charName = typeof charData === 'string' ? charData : charData.name;
            let ritualType = 'none';
            let hasCore = false;

            if (typeof charData === 'object') {
              // 새로운 JSON 형식: { "name": "...", "Awareness": 1, "core": true }
              if (charData.Awareness) {
                ritualType = `num${charData.Awareness}`;
              }
              // 이전 형식 호환성: { "name": "...", "ritual": "Awareness 1" }
              else if (charData.ritual && charData.ritual !== 'none') {
                const match = charData.ritual.match(/Awareness (\d+)/);
                if (match) {
                  ritualType = `num${match[1]}`;
                }
              }
              // Core 속성 처리
              if (charData.core === true) {
                hasCore = true;
              }
            }

            // 캐릭터 이미지를 찾아서(또는 생성해서) 해당 포지션 셀에 배치
            let charImage = null;
            // CSS 선택자에서 특수문자 이스케이프를 위한 헬퍼 함수
            const escapeCSSSelector = (str) => {
              return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
            };

            // 1) 카드 풀에 남아있는 동일 이름 이미지 우선 사용
            // 특수문자가 포함된 이름을 안전하게 찾기 위해 모든 이미지를 순회
            const allImages = Array.from(document.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)'));
            const fromPool = allImages.find(img => {
              return img.alt === charName && img.closest('.cards') === cardsContainer;
            });

            if (fromPool) {
              // fromPool이 wrapper인지 이미지인지 확인
              if (fromPool.tagName === 'IMG') {
                // 이미지인 경우
                charImage = fromPool;
              } else {
                // wrapper인 경우, 내부 이미지를 찾음
                const innerImg = fromPool.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
                if (innerImg) {
                  charImage = innerImg;
                  // wrapper에서 이미지를 제거 (나중에 새로운 위치에 배치하기 위해)
                  innerImg.remove();
                } else {
                  // wrapper 안에 이미지가 없으면 새로 생성
                  charImage = null;
                }
              }
            } else {
              // 2) 이미 배치된 것이 있다면 첫 번째 것을 복제
              const existingImage = allImages.find(img => img.alt === charName);
              if (existingImage) {
                // 복제할 때 wrapper 안의 이미지인지 확인
                const actualImage = existingImage.tagName === 'IMG' ? existingImage : existingImage.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
                if (actualImage) {
                  charImage = actualImage.cloneNode(true);
                } else {
                  charImage = existingImage.cloneNode(true);
                }
                attachDragListeners(charImage, true);
              } else if (window.characterData && window.characterData[charName]) {
                // 3) 전혀 없는 경우 새로 생성
                const data = window.characterData[charName];
                const img = document.createElement('img');
                img.src = `${BASE_URL}/assets/img/tier/${charName}.webp`;
                img.alt = charName;
                img.draggable = true;
                img.dataset.element = data.element;
                img.dataset.position = data.position;
                img.dataset.rarity = data.rarity;
                img.dataset.tags = data.tag || '';
                img.classList.add('character-img');
                if (Number(data.rarity) === 4) img.classList.add('star4');
                else if (Number(data.rarity) === 5) img.classList.add('star5');
                attachDragListeners(img);
                charImage = img;
              }
            }

            // charImage가 없으면 새로 생성
            if (!charImage && window.characterData && window.characterData[charName]) {
              const data = window.characterData[charName];
              const img = document.createElement('img');
              img.src = `${BASE_URL}/assets/img/tier/${charName}.webp`;
              img.alt = charName;
              img.draggable = true;
              img.dataset.element = data.element;
              img.dataset.position = data.position;
              img.dataset.rarity = data.rarity;
              img.dataset.tags = data.tag || '';
              img.classList.add('character-img');
              if (Number(data.rarity) === 4) img.classList.add('star4');
              else if (Number(data.rarity) === 5) img.classList.add('star5');
              attachDragListeners(img);
              charImage = img;
            }

            if (!charImage) return;

            // 이미지가 wrapper 안에 있는지 확인 (이미지가 wrapper 자체일 수도 있음)
            let existingWrapper = null;
            if (charImage.tagName === 'IMG') {
              existingWrapper = charImage.closest('.character-wrapper');
              // 기존 wrapper가 있으면 제거 (새로운 위치에 배치하기 위해)
              if (existingWrapper && existingWrapper.parentElement === cardsContainer) {
                existingWrapper.remove();
              }
            }

            // rarity 정보가 없으면 characterData에서 가져오기
            let rarity = parseInt(charImage.dataset.rarity, 10);
            if (isNaN(rarity) && window.characterData && window.characterData[charName]) {
              rarity = parseInt(window.characterData[charName].rarity, 10);
              charImage.dataset.rarity = rarity;
            }

            // 공통 함수로 클래스 적용 (list=false일 때와 동일한 방식)
            applyCharacterClasses(charImage, existingWrapper);

            // ::after 가상 요소가 작동하려면 position: relative가 필요
            if (charImage.tagName === 'IMG') {
              charImage.style.position = 'relative';
            }
            if (existingWrapper) {
              existingWrapper.style.position = 'relative';
            }

            // ritual 및 core 데이터 설정
            charImage.dataset.ritual = ritualType;
            charImage.dataset.core = hasCore ? 'true' : 'false';

            if ((ritualType && ritualType !== 'none') || hasCore) {
              // ritual이나 core가 있으면 wrapper 생성하여 배치
              const wrapper = document.createElement('div');
              wrapper.className = 'character-wrapper';
              wrapper.draggable = true;
              // ::after 가상 요소가 작동하려면 position: relative가 필요
              wrapper.style.position = 'relative';
              // 이미지의 데이터셋을 wrapper에도 복사
              wrapper.alt = charImage.alt;
              wrapper.dataset.element = charImage.dataset.element;
              wrapper.dataset.position = charImage.dataset.position;
              wrapper.dataset.rarity = charImage.dataset.rarity;
              wrapper.dataset.tags = charImage.dataset.tags;
              wrapper.dataset.ritual = ritualType;
              wrapper.dataset.core = hasCore ? 'true' : 'false';

              // 공통 함수로 클래스 적용 (list=false일 때와 동일한 방식)
              applyCharacterClasses(charImage, wrapper);

              // 이미지에도 position: relative 설정
              charImage.style.position = 'relative';

              // wrapper로 드래그 위임
              charImage.draggable = false;

              // 최종 배치
              positionCell.appendChild(wrapper);
              wrapper.appendChild(charImage);

              // ritual 아이콘 추가 (우측 하단)
              if (ritualType && ritualType !== 'none') {
                const ritualIcon = document.createElement('img');
                ritualIcon.src = `${BASE_URL}/assets/img/ritual/${ritualType}.png`;
                ritualIcon.className = 'character-ritual-icon';
                ritualIcon.alt = `Ritual ${ritualType}`;
                wrapper.appendChild(ritualIcon);
              }

              // core 아이콘 추가 (좌측 하단)
              if (hasCore) {
                const coreIcon = document.createElement('img');
                coreIcon.src = `${BASE_URL}/assets/img/character-detail/innate/core.png`;
                coreIcon.className = 'character-core-icon';
                coreIcon.alt = 'Core';
                wrapper.appendChild(coreIcon);
              }

              // 드래그 리스너는 wrapper에
              attachDragListeners(wrapper);
            } else {
              const wrapper = wrapCharacterImage(charImage);
              positionCell.appendChild(wrapper);
              attachDragListeners(wrapper);
            }
          });
        }
      });
    }
  });

  // 티어 데이터 로딩 완료
  isTierDataLoading = false;
};

// 포지션별 티어 메이커 초기화 함수 (전역에서 접근 가능하도록)
window.initPositionTierMaker = () => {
  console.log('Initializing position tier maker...');

  // URL/경로 기반 모드 확인 및 제목 설정
  const shouldLoadList = getTierPageMode() === 'list';

  // 티어 리스트 모드 설정 (list=false가 아니면 티어 리스트 모드)
  isTierListMode = shouldLoadList;

  // 티어 리스트 모드에 따라 CSS 클래스 적용
  if (isTierListMode) {
    document.body.classList.add('tier-list-mode');
  } else {
    document.body.classList.remove('tier-list-mode');
  }

  // 모드 변경 후 모든 드래그 리스너 업데이트 (초기화 완료 후 실행)
  setTimeout(() => {
    updateAllDragListenersForMode();
  }, 1000);

  // 제목과 설명 동적 변경 (언어별 제목은 여기서 설정하지 않음 - updateLanguageContent에서 처리)
    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
    window.SeoEngine.setContextHint({
      domain: 'tier',
      mode: shouldLoadList ? 'list' : 'maker'
    }, { rerun: true });
  } else if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
    window.SeoEngine.run();
  }

  // 이미 초기화된 경우 중복 실행 방지
  if (document.querySelector('.position-header')) {
    //console.log('Position tier maker already initialized');
    return;
  }

  loadCharacterImages();
  initDraggables();
  initPositionTiers();
  initColorOptions();
  initRitualModal();
  initFilters();

  // Initialize responsive layout
  currentLayout = window.innerWidth <= 1200 ? 'mobile' : 'desktop';

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
        //console.log('Loading tier data from URL...');
      } else {
        // URL에 없으면 파일에서 로드
        //console.log('No URL data, trying to load from file...');
        tierData = await loadTierDataFromFile(forceUseKRTierInGlobal);
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

  //console.log('🎮 Console commands available:');
  //console.log('  shareTierList() - Copy tier data to clipboard');
  //console.log('  exportTierList() - Show tier data in console');
};

// position-tier.html 에서 characterData 로딩 이후
// 명시적으로 window.initPositionTierMaker()를 호출하므로
// 여기서는 자동 초기화를 수행하지 않는다.

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

// 리추얼 데이터를 JSON 형식으로 변환하는 함수
const convertRitualToJSON = (ritualType) => {
  if (!ritualType || ritualType === 'none') {
    return null;
  }
  const ritualMap = {
    'num1': { "Awareness": 1 },
    'num2': { "Awareness": 2 },
    'num3': { "Awareness": 3 },
    'num4': { "Awareness": 4 },
    'num5': { "Awareness": 5 },
    'num6': { "Awareness": 6 }
  };
  return ritualMap[ritualType] || null;
};

// 리추얼 JSON 데이터를 내부 형식으로 역변환하는 함수 (import용)
const convertRitualFromJSON = (ritualData) => {
  if (!ritualData || typeof ritualData !== 'object') {
    return 'none';
  }
  if (ritualData.Awareness) {
    return `num${ritualData.Awareness}`;
  }
  return 'none';
};

// 티어 리스트 결과를 JSON으로 내보내는 함수 (인코딩 없이)
const exportTierListAsJSON = () => {
  //console.log('Exporting tier list as JSON...');

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
          const wrappers = nextElement.querySelectorAll('.character-wrapper');
          const images = nextElement.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)');

          // DOM 순서대로 모든 캐릭터 수집 (wrapper와 일반 이미지 순서 유지)
          const allElements = Array.from(nextElement.children);

          allElements.forEach(element => {
            let img = null;
            let ritualType = 'none';
            let hasCore = false;

            if (element.classList.contains('character-wrapper')) {
              // wrapper 안의 이미지 처리
              img = element.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
              ritualType = element.dataset.ritual || 'none';
              hasCore = element.dataset.core === 'true';
            } else if (element.tagName === 'IMG' && !element.classList.contains('character-ritual-icon') && !element.classList.contains('character-core-icon')) {
              // 일반 이미지 처리
              img = element;
              ritualType = element.dataset.ritual || 'none';
              hasCore = element.dataset.core === 'true';
            }

            if (img) {
              const characterData = {
                name: img.alt
              };
              const ritualData = convertRitualToJSON(ritualType);
              if (ritualData) {
                Object.assign(characterData, ritualData);
              }
              if (hasCore) {
                characterData.core = true;
              }
              characters.push(characterData);
            }
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
          const wrappers = nextElement.querySelectorAll('.character-wrapper');
          const images = nextElement.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)');

          // DOM 순서대로 모든 캐릭터 수집 (wrapper와 일반 이미지 순서 유지)
          const allElements = Array.from(nextElement.children);

          allElements.forEach(element => {
            let img = null;
            let ritualType = 'none';
            let hasCore = false;

            if (element.classList.contains('character-wrapper')) {
              // wrapper 안의 이미지 처리
              img = element.querySelector('img:not(.character-ritual-icon):not(.character-core-icon)');
              ritualType = element.dataset.ritual || 'none';
              hasCore = element.dataset.core === 'true';
            } else if (element.tagName === 'IMG' && !element.classList.contains('character-ritual-icon') && !element.classList.contains('character-core-icon')) {
              // 일반 이미지 처리
              img = element;
              ritualType = element.dataset.ritual || 'none';
              hasCore = element.dataset.core === 'true';
            }

            if (img) {
              const characterData = {
                name: img.alt
              };
              const ritualData = convertRitualToJSON(ritualType);
              if (ritualData) {
                Object.assign(characterData, ritualData);
              }
              if (hasCore) {
                characterData.core = true;
              }
              characters.push(characterData);
            }
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

// Ritual Modal Functionality
let currentRitualImage = null;
function getRitualModal() { return document.querySelector('.ritual-modal'); }

// Core toggle functionality
function setCharacterCore(hasCore) {
  if (!currentRitualImage) return;

  // Check if image is already in a wrapper
  let existingWrapper = currentRitualImage.closest('.character-wrapper');

  if (existingWrapper) {
    // Remove existing core icon from wrapper
    const existingIcon = existingWrapper.querySelector('.character-core-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // Update wrapper core data
    existingWrapper.dataset.core = hasCore ? 'true' : 'false';
    currentRitualImage.dataset.core = hasCore ? 'true' : 'false';

    // Add new core icon if enabled
    if (hasCore) {
      const coreIcon = document.createElement('img');
      coreIcon.src = `${BASE_URL}/assets/img/character-detail/innate/core.png`;
      coreIcon.className = 'character-core-icon';
      coreIcon.alt = 'Core';
      existingWrapper.appendChild(coreIcon);
    }
  } else {
    // Set core data on image
    currentRitualImage.dataset.core = hasCore ? 'true' : 'false';

    // Add core icon if enabled
    if (hasCore) {
      const coreIcon = document.createElement('img');
      coreIcon.src = `${BASE_URL}/assets/img/character-detail/innate/core.png`;
      coreIcon.className = 'character-core-icon';
      coreIcon.alt = 'Core';

      // Create a wrapper for proper positioning
      const parent = currentRitualImage.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'character-wrapper';
      wrapper.draggable = true;

      // Copy all attributes from image to wrapper for drag functionality
      wrapper.alt = currentRitualImage.alt;
      wrapper.dataset.element = currentRitualImage.dataset.element;
      wrapper.dataset.position = currentRitualImage.dataset.position;
      wrapper.dataset.rarity = currentRitualImage.dataset.rarity;
      wrapper.dataset.tags = currentRitualImage.dataset.tags;
      wrapper.dataset.ritual = currentRitualImage.dataset.ritual || 'none';
      wrapper.dataset.core = 'true';

      // Remove draggable from image since wrapper will handle it
      currentRitualImage.draggable = false;

      // Insert wrapper and move image into it
      parent.insertBefore(wrapper, currentRitualImage);
      wrapper.appendChild(currentRitualImage);
      wrapper.appendChild(coreIcon);

      // Attach drag listeners to wrapper instead of image
      attachDragListeners(wrapper);
    }
  }

  // Update toggle button state in modal
  const coreToggle = document.getElementById('core-toggle');
  if (coreToggle) {
    if (hasCore) {
      coreToggle.classList.add('active');
    } else {
      coreToggle.classList.remove('active');
    }
  }
}

// Open ritual modal for character image
function openRitualModal(img) {
  currentRitualImage = img;

  // Show current ritual selection
  const currentRitual = img.dataset.ritual || 'none';
  const modal = getRitualModal();
  if (!modal) return;
  const ritualOptions = modal.querySelectorAll('.ritual-option');
  ritualOptions.forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.ritual === currentRitual) {
      option.classList.add('selected');
    }
  });

  // Show current core state
  const currentCore = img.dataset.core === 'true';
  const coreToggle = document.getElementById('core-toggle');
  if (coreToggle) {
    if (currentCore) {
      coreToggle.classList.add('active');
    } else {
      coreToggle.classList.remove('active');
    }
  }

  modal.showModal();
}

// Close ritual modal
function closeRitualModal() {
  const modal = getRitualModal();
  if (modal) modal.close();
  currentRitualImage = null;
}

// Set ritual for character
function setCharacterRitual(ritualType) {
  if (!currentRitualImage) return;

  // Check if image is already in a wrapper
  const existingWrapper = currentRitualImage.closest('.character-wrapper');

  if (existingWrapper) {
    // Remove existing ritual icon from wrapper
    const existingIcon = existingWrapper.querySelector('.character-ritual-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // Update wrapper ritual data
    existingWrapper.dataset.ritual = ritualType;
    currentRitualImage.dataset.ritual = ritualType;

    // Add new ritual icon if not 'none'
    if (ritualType !== 'none') {
      const ritualIcon = document.createElement('img');
      ritualIcon.src = `${BASE_URL}/assets/img/ritual/${ritualType}.png`;
      ritualIcon.className = 'character-ritual-icon';
      ritualIcon.alt = `Ritual ${ritualType}`;
      existingWrapper.appendChild(ritualIcon);
    }
  } else {
    // wrapper가 없는 경우는 해당 이미지와 연결된 리추얼 아이콘이 없으므로 제거할 필요 없음
    // 다른 캐릭터의 리추얼 아이콘을 제거하지 않도록 주의

    // Set ritual data on image
    currentRitualImage.dataset.ritual = ritualType;

    // Add ritual icon if not 'none'
    if (ritualType !== 'none') {
      const ritualIcon = document.createElement('img');
      ritualIcon.src = `${BASE_URL}/assets/img/ritual/${ritualType}.png`;
      ritualIcon.className = 'character-ritual-icon';
      ritualIcon.alt = `Ritual ${ritualType}`;

      // Create a wrapper for proper positioning
      const parent = currentRitualImage.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'character-wrapper';
      wrapper.draggable = true;

      // Copy all attributes from image to wrapper for drag functionality
      wrapper.alt = currentRitualImage.alt;
      wrapper.dataset.element = currentRitualImage.dataset.element;
      wrapper.dataset.position = currentRitualImage.dataset.position;
      wrapper.dataset.rarity = currentRitualImage.dataset.rarity;
      wrapper.dataset.tags = currentRitualImage.dataset.tags;
      wrapper.dataset.ritual = ritualType;

      // Remove draggable from image since wrapper will handle it
      currentRitualImage.draggable = false;

      // Insert wrapper and move image into it
      parent.insertBefore(wrapper, currentRitualImage);
      wrapper.appendChild(currentRitualImage);
      wrapper.appendChild(ritualIcon);

      // Attach drag listeners to wrapper instead of image
      attachDragListeners(wrapper);
    }
  }

  closeRitualModal();
}

// Initialize ritual modal event listeners
function initRitualModal() {
  const ritualModal = getRitualModal();
  if (!ritualModal) return;

  // Close button
  const closeBtn = ritualModal.querySelector('.ritual-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeRitualModal);
  }

  // Core toggle click
  const coreToggle = document.getElementById('core-toggle');
  if (coreToggle) {
    coreToggle.addEventListener('click', () => {
      const isActive = coreToggle.classList.contains('active');
      setCharacterCore(!isActive);
    });
  }

  // Ritual option clicks
  const ritualOptions = ritualModal.querySelectorAll('.ritual-option');
  ritualOptions.forEach(option => {
    option.addEventListener('click', () => {
      const ritualType = option.dataset.ritual;
      setCharacterRitual(ritualType);
    });
  });

  // Copy character button
  const copyBtn = ritualModal.querySelector('.ritual-copy-button');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!currentRitualImage) return;

      // 현재 선택된 이미지 기준으로 복제 생성
      const sourceImg = currentRitualImage;
      const clone = document.createElement('img');
      clone.src = sourceImg.src;
      clone.alt = sourceImg.alt || '';
      clone.draggable = true;

      // 데이터셋 복사
      ['element', 'position', 'rarity', 'tags', 'ritual'].forEach(key => {
        if (sourceImg.dataset[key] !== undefined) {
          clone.dataset[key] = sourceImg.dataset[key];
        }
      });

      // 등급별 클래스 유지
      const rarity = parseInt(clone.dataset.rarity);
      if (rarity === 4) clone.classList.add('star4');
      else if (rarity === 5) clone.classList.add('star5');

      // 하단 카드 풀에 추가 후 드래그 리스너 연결
      const wrapper = wrapCharacterImage(clone);
      cardsContainer.appendChild(wrapper);
      attachDragListeners(wrapper);
    });
  }

  // Close on backdrop click
  ritualModal.addEventListener('click', (e) => {
    if (e.target === ritualModal) {
      closeRitualModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ritualModal.open) {
      closeRitualModal();
    }
  });
};

// 전역 함수 노출 (capture.js에서 사용)
window.loadTierDataFromURL = loadTierDataFromURL;
window.exportTierListAsJSON = exportTierListAsJSON;
