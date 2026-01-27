export function handlePersonaRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const personaName = urlParams.get('persona') || urlParams.get('name');

    if (!personaName) return;

    // Decode in case of encoded characters
    const targetName = decodeURIComponent(personaName).trim();
    if (!targetName) return;

    // Try to find the card by data-name
    // Note: The cards might be rendered in chunks, but usually the first chunk is rendered quickly.
    // However, if the target is far down, it might not be in the DOM yet?
    // Persona page usually renders all cards but lazy loads images?
    // Let's check if cards exist.

    // Actually, initializePageContent renders sortedPersonas in chunks.
    // We might need to wait or force find.
    // But typically for deep linking, we want specific content.

    // Strategy:
    // 1. Find card with data-name="targetName" (or check if it matches English/JP name?)
    //    The data-name attribute usually holds the Key (Korean name).
    //    If the user passes english name, we might need to map it.

    // Let's assume input matches the key or we try to map it using window.personaFiles if needed.
    // But for now, simple matching.

    // Helper to find card
    const findCard = () => {
        // Try strict match on data-name
        let card = document.querySelector(`.persona-detail-container[data-name="${targetName}"]`);

        // If not found, maybe it's in English/JP and we need to look it up in window.personaFiles
        if (!card && window.personaFiles) {
            const key = Object.keys(window.personaFiles).find(k => {
                const p = window.personaFiles[k];
                return (p.name_en === targetName) || (p.name_jp === targetName) || (k === targetName);
            });
            if (key) {
                card = document.querySelector(`.persona-detail-container[data-name="${key}"]`);
            }
        }
        return card;
    }

    const attemptSelect = () => {
        const cardContainer = findCard();
        if (cardContainer) {
            // Check if interactive card element exists inside
            const card = cardContainer.querySelector('.card');
            if (card) {
                // Scroll into view
                cardContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Trigger click to select
                card.click();
            }
        } else {
            // Retry a few times in case of async rendering?
            // initializePageContent uses requestIdleCallback/setTimeout
        }
    };

    // Attempt immediately and then shortly after ensuring render
    // Since this is called after initializePageContent promise resolves in index.html,
    // DOM should be mostly ready or at least started.
    // If chunked rendering is slow, might miss it.
    // But typically chunks are fast.

    // We can use a MutationObserver if really needed, but let's try simple timeout first.
    setTimeout(attemptSelect, 200);
}
