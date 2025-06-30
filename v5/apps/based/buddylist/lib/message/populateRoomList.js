// Populates or updates the pond room list in the chat window
// Maintains sort order by connection_count (descending) without full re-render
// Manages .aim-room-active class only when an activeContext is specified
export default function populateRoomList(hotPonds, chatWindow, activeContext = null) {
    // console.log('populateRoomList called with hotPonds:', hotPonds, 'chatWindow:', chatWindow, 'activeContext:', activeContext);
    const roomList = $(".aim-room-list-items", chatWindow.content);
    if (!roomList.length) return;

    if (!hotPonds || !Array.isArray(hotPonds)) return;

    // Sort ponds by connection count (descending)
    const sortedPonds = [...hotPonds].sort((a, b) => b.connection_count - a.connection_count);
    // console.log('Sorted ponds:', sortedPonds);

    // Track user-opened ponds
    const userOpenedPonds = this.data.activePonds || [];

    // Track existing room items by pond_id
    const existingItems = new Map();
    const existingPondIds = new Set();
    roomList.find(".aim-room-item").each((_, item) => {
        const pondId = $(item).data("pond");
        if (pondId) {
            existingItems.set(pondId, $(item));
            existingPondIds.add(pondId);
        }
    });

    // Update or add room items
    sortedPonds.forEach((pond) => {
        const pondId = pond.pond_id;
        const pondName = pondId.replace("pond/", "");
        const isUserOpened = userOpenedPonds.includes(pondId);
        const isActive = pondId === activeContext;

        const existingItem = existingItems.get(pondId);
        if (existingItem) {
            // Update existing item only if data has changed
            const $scoreElement = existingItem.find(".aim-room-list-item-score");
            if ($scoreElement.text() !== String(pond.connection_count)) {
                console.log(`Updating connection_count for ${pondId}: ${pond.connection_count}`);
                $scoreElement.text(pond.connection_count);
            }

            const $closeButton = existingItem.find(".aim-room-close-btn");
            if (isUserOpened) {
                if (!$closeButton.length) {
                    console.log(`Adding close button for ${pondId}`);
                    existingItem.append(`<button class="aim-room-close-btn" data-context="${pondId}">X</button>`);
                }
            } else if ($closeButton.length) {
                console.log(`Removing close button for ${pondId}`);
                $closeButton.remove();
            }

            // Update active class only if activeContext is specified
            if (activeContext !== null) {
                const shouldBeActive = isActive;
                if (existingItem.hasClass("aim-room-active") !== shouldBeActive) {
                    console.log(`Updating active class for ${pondId}: ${shouldBeActive}`);
                    existingItem.toggleClass("aim-room-active", shouldBeActive);
                }
            }

            existingPondIds.delete(pondId); // Mark as processed
        } else {
            // Create new room item
            // console.log(`Adding new room item for ${pondId}`);
            const closeButton = isUserOpened
                ? `<button class="aim-room-close-btn" data-context="${pondId}">X</button>`
                : "";
            const $newItem = $(`
                <li class="aim-room-item aim-room-list-item${isActive && activeContext !== null ? " aim-room-active" : ""}" data-pond="${pondId}" data-context="${pondId}">
                    <span class="aim-room-list-item-name">#${pondName}</span>
                    <span class="aim-room-list-item-score">${pond.connection_count}</span>
                    ${closeButton}
                </li>
            `);
            roomList.append($newItem); // Append temporarily; will reorder later
            existingItems.set(pondId, $newItem); // Track for reordering
        }

        // Ensure messages container exists for active or opened ponds
        // TODO: we don't have a scope to ensureMessagesContainer here,
        // do we need to ensureMessagesContainer here? if so, it needs to be scoped to buddylist or chatWindow
        /*
        if (isActive || isUserOpened) {
            ensureMessagesContainer.call(this, pondId, chatWindow, this.bp.apps.client);
        }
        */
    });

    // Remove room items for ponds no longer in hotPonds
    existingPondIds.forEach((pondId) => {
        console.log(`Removing room item for ${pondId}`);
        existingItems.get(pondId)?.remove();
        existingItems.delete(pondId);
    });

    // Reorder room items to match sortedPonds
    // console.log('Reordering room items to match sortedPonds');
    let previousItem = null;
    sortedPonds.forEach((pond) => {
        const $item = existingItems.get(pond.pond_id);
        if ($item) {
            if (previousItem) {
                // Insert after the previous item
                const $nextSibling = previousItem.next();
                if (!$nextSibling.length || $nextSibling.data("pond") !== pond.pond_id) {
                    console.log(`Moving ${pond.pond_id} after ${previousItem.data("pond")}`);
                    $item.insertAfter(previousItem);
                }
            } else {
                // Move to the top if it's the first item
                const $firstItem = roomList.children().first();
                if (!$firstItem.length || $firstItem.data("pond") !== pond.pond_id) {
                    console.log(`Moving ${pond.pond_id} to top`);
                    $item.prependTo(roomList);
                }
            }
            previousItem = $item;
        }
    });

    // Ensure only the active room has .aim-room-active if activeContext is specified
    if (activeContext !== null) {
        console.log(`Ensuring only ${activeContext} has .aim-room-active`);
        roomList.find(".aim-room-item").not(`[data-pond="${activeContext}"]`).removeClass("aim-room-active");
        if (existingItems.get(activeContext)) {
            existingItems.get(activeContext).addClass("aim-room-active");
        }
    }
}