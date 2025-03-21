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
  const allCharacters = [...characterList.mainParty, ...characterList.supportParty];
  
  allCharacters.forEach(character => {
    const img = document.createElement('img');
    img.src = `{{ site.baseurl }}/assets/img/character-half/${character}.webp`;
    img.alt = character;
    img.draggable = true;
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

loadCharacterImages();
initDraggables();
initDefaultTierList();
initColorOptions();

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