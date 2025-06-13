// Populates or updates the pond room list in the chat window
// Does not clear existing entries; updates connection counts and adds/removes rooms as needed
// Manages .aim-room-active class only when an activeContext is specified
export default function populateRoomList(hotPonds, chatWindow, activeContext = null) {
    // console.log('populateRoomList called with hotPonds:', hotPonds, 'chatWindow:', chatWindow, 'activeContext:', activeContext);
    const roomList = $(".aim-room-list-items", chatWindow.content);
    if (!roomList.length) return;

    if (!hotPonds || !Array.isArray(hotPonds)) return;

    // Sort ponds by connection count (descending)
    const sortedPonds = [...hotPonds].sort((a, b) => b.connection_count - a.connection_count);

    // Track user-opened ponds
    const userOpenedPonds = this.data.activePonds || [];

    // Track existing room items to determine which to remove
    const existingPondIds = new Set();
    roomList.find(".aim-room-item").each((_, item) => {
        const pondId = $(item).data("pond");
        if (pondId) existingPondIds.add(pondId);
    });

    // Update or add room items
    sortedPonds.forEach((pond) => {
        const pondId = pond.pond_id;
        const pondName = pondId.replace("pond/", "");
        const isUserOpened = userOpenedPonds.includes(pondId);
        const isActive = pondId === activeContext;

        // Check for existing room item
        const existingItem = $(`.aim-room-item[data-pond="${pondId}"]`, roomList);
        if (existingItem.length) {
            // Update existing item
            existingItem.find(".aim-room-list-item-score").text(pond.connection_count);
            const closeButton = existingItem.find(".aim-room-close-btn");
            if (isUserOpened) {
                if (!closeButton.length) {
                    existingItem.append(`<button class="aim-room-close-btn" data-context="${pondId}">X</button>`);
                }
            } else {
                closeButton.remove();
            }
            // Update active class only if activeContext is specified
            if (activeContext !== null) {
                existingItem.toggleClass("aim-room-active", isActive);
            }
            existingPondIds.delete(pondId); // Mark as processed
        } else {
            // Create new room item
            const closeButton = isUserOpened
                ? `<button class="aim-room-close-btn" data-context="${pondId}">X</button>`
                : "";
            roomList.append(`
                <li class="aim-room-item aim-room-list-item ${isActive && activeContext !== null ? "aim-room-active" : ""}" data-pond="${pondId}" data-context="${pondId}">
                    <span class="aim-room-list-item-name">#${pondName}</span>
                    <span class="aim-room-list-item-score">${pond.connection_count}</span>
                    ${closeButton}
                </li>
            `);
        }

        // Ensure messages container exists for active or opened ponds
        if (isActive || isUserOpened) {
            ensureMessagesContainer.call(this, pondId, chatWindow, this.bp.apps.client);
        }
    });

    // Remove room items for ponds no longer in hotPonds
    existingPondIds.forEach((pondId) => {
        $(`.aim-room-item[data-pond="${pondId}"]`, roomList).remove();
    });

    // If activeContext is specified, ensure only the active room has .aim-room-active
    if (activeContext !== null) {
        roomList.find(".aim-room-item").not(`[data-pond="${activeContext}"]`).removeClass("aim-room-active");
    }
}