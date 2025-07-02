import forbiddenNotes from "./forbiddenNotes.js";
import setupInputEvents from "./message/setupInputEvents.js";
import setupAutocomplete from "./message/setupAutocomplete.js";
import setupChatWindowButtons from "./message/setupChatWindowButtons.js";

// this is now handled in the pond.js file
import populateRoomList from "./message/populateRoomList.js";
import updateRoomList from "./message/updateRoomList.js";
// Updates the list of connected users for a specific pond chat
// data.chatId specifies the pond context (e.g., "pond/general")

// Updates the list of connected users for a specific pond chat
// data.chatId specifies the pond context (e.g., "pond/general")
function updatePondConnectedUsers(data) {
    const chatId = data.chatId;
    if (!chatId) {
        console.log("No chatId provided for updating pond connected users");
        return;
    }
    // console.log('updatePondConnectedUsers called with data:', data);
    let context = chatId.replace("pond/", "");

    // Select the user list for the specific pond
    const userList = $(`.aim-user-list[data-context="${context}"][data-type="pond"] .aim-user-list-items`);

    // console.log('found userList:', userList.length, 'for chatId:', chatId, userList);
    if (!userList.length) {
        console.log(`No .aim-user-list-items found for chatId: ${chatId}`);
        return;
    }

    // console.log("Updating pond connected users for chatId:", chatId, data);

    // Track existing users to identify disconnected ones
    const existingUserIds = new Set();
    userList.find(".aim-user-item").each((_, item) => {
        let userId = $(item).data("username");
        if (userId) {
            userId = userId.toString();
            existingUserIds.add(userId);
        } else {
            // console.log("Found invalid .aim-user-item without data-username, removing:", item);
            $(item).remove(); // Remove empty/invalid items
        }
    });

    // Update or add user items
    (data.users || []).forEach((user) => {
        let { userId, profilePicture } = user;
        userId = userId ? userId.toString() : null;
        if (!userId || typeof userId !== "string") {
            console.log("Skipping invalid user with missing or non-string userId:", user);
            return; // Skip invalid users
        }

        // Remark: we could also populate the this.data.activeUsers
        // Might be better to just allow user to click name and then open spellbook, less clutter in dropdown
        /*
        if (message.to && !this.data.activeUsers.includes(message.to)) {
            this.data.activeUsers.push(message.to);
            this.bp.emit('buddy::activeUserAdded', message.to);
        }
        */

        const userItem = $(`.aim-user-item[data-username="${userId}"]`, userList);

        if (userItem.length) {
            // Update existing user only if data has changed
            const $textElement = userItem.find(".aim-user-item-text");
            if ($textElement.text() !== userId) {
                // console.log(`Updating userId text for ${userId}`);
                $textElement.text(userId);
            }

            const $profileContainer = userItem.find(".aim-profile-picture");
            const $newProfileElement = createProfilePictureElement.call(this, userId, profilePicture, $profileContainer);
            if ($newProfileElement) {
                // console.log(`Updating profile picture for ${userId}`);
                $profileContainer.empty().append($newProfileElement.html());
            } else {
                // console.log(`No profile picture update needed for ${userId}`);
            }

            existingUserIds.delete(userId); // Mark as processed
        } else {
            // Create new user item
            // console.log("Adding user to aim-user-list-items:", user);
            const $userItem = $("<li>", {
                class: "aim-user-item",
                "data-username": userId,
            });
            const $profilePicture = createProfilePictureElement.call(this, userId, profilePicture);
            const $userText = $("<span>", {
                class: "aim-user-item-text",
                text: userId,
            });
            //console.log('$profilePicture', $profilePicture.html())
            //console.log('$userItem', $userItem.html())
            $userItem.append($profilePicture, $userText);
            userList.append($userItem);
        }
    });

    // Remove disconnected users
    // console.log('checking existingUserIds for removal:', existingUserIds);
    existingUserIds.forEach((userId) => {
        userId = userId.toString();
        $(`.aim-user-item[data-username="${userId}"]`, userList).remove();
    });
}

// Creates a profile picture element for a user
// Returns null if no update is needed for existing users
function createProfilePictureElement(userId, profilePicture, $existingContainer = null) {
    const $profilePicture = $("<div>", { class: "aim-profile-picture" });

    if (profilePicture) {
        const $img = $("<img>", {
            class: "aim-chat-message-profile-picture-img",
            src: profilePicture,
            alt: `${userId}'s avatar`,
        });
        $img.attr('draggable', 'false');
        $profilePicture.append($img);

        // For existing users, check if update is needed
        if ($existingContainer) {
            const $currentImg = $existingContainer.find(".aim-chat-message-profile-picture-img");
            if ($currentImg.length && $currentImg.attr("src") === profilePicture) {
                return null; // No update needed
            }
        }
    } else {
        const defaultAvatarSvg = this.defaultAvatarSvg(userId);
        $profilePicture.html(defaultAvatarSvg);

        // For existing users, check if SVG content is unchanged
        if ($existingContainer) {
            const currentHtml = $existingContainer.html().trim();
            if (currentHtml === defaultAvatarSvg.trim()) {
                return null; // No update needed
            }
        }
    }

    return $profilePicture;
}

export default function openChatWindow(data) {
    const { windowType, contextName, windowTitle } = determineWindowParameters(data);
    if (!isValidContextName(contextName)) {
        return;
    }

    // TODO: move these to prototype of buddylist...
    if (!this.populateRoomList) {
        this.populateRoomList = populateRoomList.bind(this);
    }

    if (!this.updatePondConnectedUsers) {
        this.updatePondConnectedUsers = updatePondConnectedUsers.bind(this);
    }

    if (!this.forbiddenNotes) {
        this.forbiddenNotes = forbiddenNotes;
    }

    if (!this.joinPond) {
        this.joinPond = joinPond.bind(this);
    }

    const client = this.bp.apps.client;
    const windowId = generateWindowId(windowType, contextName);
    const existingWindow = this.bp.apps.ui.windowManager.getWindow(windowId);
    if (existingWindow) {
        handleExistingWindow(existingWindow, windowType, contextName, client, this);
        return existingWindow;
    }

    return createNewChatWindow.call(this, {
        windowType,
        contextName,
        windowTitle,
        windowId,
        client,
        data,
    });
}

function determineWindowParameters(data) {
    let windowType = data.pondname ? "pond" : "buddy";
    let contextName = data.pondname || data.name;
    let windowTitle = windowType === "pond" ? "Pond Chat" : "";

    if (data.context) {
        contextName = data.context;
    }

    if (data.type) {
        windowType = data.type;
    }

    contextName = contextName.toString();

    return { windowType, contextName, windowTitle };
}

function isValidContextName(contextName) {
    const pondName = contextName.replace("pond/", "");
    if (forbiddenNotes.containsBadWord(pondName)) {
        console.error("Forbidden context name:", contextName);
        alert("Pond name not allowed, please choose a different name.");
        return false;
    }
    return true;
}

function generateWindowId(windowType, contextName) {
    return windowType === "pond"
        ? 'pond-chat'
        : `messages/${contextName}`;
}

function handleExistingWindow(chatWindow, windowType, contextName, client, context) {
    if (windowType === "pond") {
        // Remark: It seems this case never happens?
        console.log("Opening pond window", windowType, contextName);
        // Use context.data.hotPonds if available, otherwise skip population
        //const hotPonds = context.data.hotPonds || [];
        //populateRoomList.call(context, hotPonds, chatWindow, contextName);
        // Ensure the messages container exists and is subscribed
        ensureMessagesContainer.call(this, context, contextName, chatWindow, client);
        toggleMessagesContainer.call(this, contextName, chatWindow);
    }
    chatWindow.focus();
}

function createNewChatWindow({ windowType, contextName, windowTitle, windowId, client, data }) {
    const windowConfig = buildWindowConfig.call(this, windowType, contextName, windowTitle, windowId, data);
    const chatWindow = this.bp.apps.ui.windowManager.createWindow({
        ...windowConfig,
        onOpen: async (_window) => {
            await initializeChatWindow.call(this, windowType, contextName, _window, client);
        },
        onClose: (_window) => {
            if (windowType === "pond") {
                const roomList = $(".aim-room-list-items", chatWindow.content);
                roomList.find(".aim-room-item").each((_, item) => {
                    const context = $(item).data("context");
                    client.removeSubscription("pond", context);
                });
                this.data.activePonds = [];
                // Remark: This is a special case if the entire pond window is closed at once
                // It's important we close all active pond subscriptions
                if (_window.id === 'pond-chat') {
                    // alert('main pond window closed')
                    // iterate through all current subscriptions and close them all
                    for (let [key, value] of bp.apps.client.messagesWsClients) {
                        if (key.startsWith("pond/")) {
                            value.wsClient.closeConnection();
                        }
                    }
                }
            } else {
                client.removeSubscription(windowType, contextName);
            }
        },
    });

    if (windowType === "pond") {
        setupCloseButtonHandler.call(this, chatWindow, client);
        $(".no-open-ponds", chatWindow.content).hide();
        $('.aim-message-controls', chatWindow.content).flexShow();

    }

    chatWindow.loggedIn = true;
    return chatWindow;
}

function buildWindowConfig(windowType, contextName, windowTitle, windowId, data) {
    const isBuddy = windowType === "buddy";
    let iconImagePath = isBuddy ? "" : "desktop/assets/images/icons/icon_pond_64.png";

    if (isBuddy && this.bp.apps.buddylist.data.profileState?.buddylist?.[contextName]?.profile_picture) {
        iconImagePath = this.bp.apps.buddylist.data.profileState.buddylist[contextName].profile_picture;
    }

    // calculate height and width as percent of screen size
    let height = isBuddy ? 500 : Math.floor(window.innerHeight * 0.8);
    let width = isBuddy ? 600 : Math.floor(window.innerWidth * 0.75);

    if (this.bp.isMobile()) {
        height = 'calc(var(--vh) * 90)';
    }

    return {
        app: "buddylist",
        id: windowId,
        title: isBuddy ? contextName : windowTitle,
        icon: iconImagePath,
        type: windowType,
        context: contextName,
        parent: this.bp.apps.ui.parent,
        className: "chatWindow",
        //x: 0,
        //y: 0,
        x: data.x || 10,
        y: 50,
        width: width,
        height: height,
    };
}

async function initializeChatWindow(windowType, contextName, chatWindow, client) {
    console.log('initializeChatWindow', windowType, contextName, chatWindow);
    setupChatWindow.call(this, windowType, contextName, chatWindow, client);
    client.addSubscription(windowType, contextName);

    if (windowType === "buddy") {
        console.log(`Opening buddy chat window for: ${contextName}`);
        // remove the .aim-chat-area margin-top ( its the close button for tabbed ponds )
        $(".aim-chat-area", chatWindow.content).css("margin-top", "0");
        // the top to 10
        $(".aim-chat-area", chatWindow.content).css("top", "10px");
        clearBuddyNewMessages.call(this, contextName);
    }

    if (windowType === "pond") {
        // Populate room list with hot ponds if available
        // const hotPonds = this.data.hotPonds || [];
        let hotPonds = this.bp.apps?.pond?.data?.hotPonds || [];
        populateRoomList.call(this, hotPonds, chatWindow, contextName);
        // send getConnectedUsers message to the pond
        toggleMessagesContainer.call(this, contextName, chatWindow);
    }
    await renderMessages.call(this, contextName, chatWindow);
    if (!this.bp.isMobile()) {
        focusInputField(chatWindow);
    }
}

function clearBuddyNewMessages(contextName) {
    if (
        this.data.profileState?.buddylist?.[contextName]?.newMessages
    ) {
        this.data.profileState.buddylist[contextName].newMessages = false;
        this.client.receivedInstantMessage(contextName, (err, re) => {
            // console.log("receivedInstantMessage", err, re);
        });
    }
}

async function renderMessages(contextName, chatWindow) {
    this.data.processedMessages[contextName] = this.data.processedMessages[contextName] || [];
    const messagesToRender = [...this.data.processedMessages[contextName]];
    this.data.processedMessages[contextName] = [];

    for (const message of messagesToRender) {
        try {
            await this.renderChatMessage(message, chatWindow, true);
        } catch (err) {
            console.error("Error rendering message", message, err, chatWindow);
        }
    }
}

function focusInputField(chatWindow) {
    function attemptFocus() {
        const aimInput = $(".aim-input", chatWindow.content);
        if (aimInput.length === 0) {
            setTimeout(attemptFocus, 100);
            return;
        }
        aimInput.focus();
    }
    attemptFocus();
}


function ensureMessagesContainer(contextName, chatWindow, client) {
    const chatArea = $(".aim-chat-area", chatWindow.content);
    const userListArea = $(".aim-user-list-area", chatWindow.content);
    if (!chatArea.length || !userListArea.length) {
        console.log("Missing chatArea or userListArea for context:", contextName);
        return;
    }

    // Normalize context for user list (e.g., "pond/general" -> "general")
    const userListContext = contextName.replace("pond/", "");

    // Create message container if missing
    let existingContainer = $(`.aim-messages-container[data-context="${contextName}"]`, chatArea);
    if (!existingContainer.length) {
        console.log("Creating new messages container for context:", contextName);
        const newContainer = document.createElement("div");
        newContainer.className = "aim-messages-container";
        newContainer.setAttribute("data-context", contextName);
        newContainer.setAttribute("data-type", "pond");
        newContainer.style.display = "none";
        newContainer.innerHTML = `
            <div class="aim-messages-header">
                <h2 class="aim-chat-title"><span class="aim-chat-username">#${userListContext}</span></h2>
                <button class="aim-close-chat-btn" data-context="${contextName}">Close</button>
            </div>
            <div class="aim-no-messages">
                Your conversation has just started. You can send a message using the form below.
            </div>
            <div class="aim-messages"></div>
        `;
        chatArea.append(newContainer);

        client.addSubscription("pond", contextName);
        this.data.activePonds = this.data.activePonds || [];
        if (!this.data.activePonds.includes(contextName)) {
            this.data.activePonds.push(contextName);
        }
        $(".no-open-ponds", chatWindow.content).hide();
        $(".aim-message-controls", chatWindow.content).flexShow();
    } 

    // Create user list if missing
    let existingUserList = $(`.aim-user-list[data-context="${userListContext}"][data-type="pond"]`, userListArea);
    if (!existingUserList.length) {
        console.log("Creating new user list for context:", userListContext);
        const newUserList = document.createElement("div");
        newUserList.className = "aim-user-list";
        newUserList.setAttribute("data-context", userListContext);
        newUserList.setAttribute("data-type", "pond");
        newUserList.style.display = "none";
        newUserList.innerHTML = `
            <div class="aim-user-list-header">
                <h3>Buddies</h3>
            </div>
            <ul class="aim-user-list-items"></ul>
        `;
        userListArea.append(newUserList);
    }
}

function toggleMessagesContainer(contextName, chatWindow) {
    const chatArea = $(".aim-chat-area", chatWindow.content);
    const userListArea = $(".aim-user-list-area", chatWindow.content);
    if (!chatArea.length || !userListArea.length) {
        console.log("Missing chatArea or userListArea for context:", contextName);
        return;
    }

    // Hide all message containers and user lists
    $(".aim-messages-container", chatArea).hide();
    $(".aim-user-list", userListArea).hide();

    // Normalize context for user list (e.g., "pond/general" -> "general")
    const userListContext = contextName.replace("pond/", "");

    chatWindow.currentActiveContext = userListContext;

    // Select target elements
    const targetContainer = $(`.aim-messages-container[data-context="${contextName}"][data-type="pond"]`, chatArea);
    const targetUserList = $(`.aim-user-list[data-context="${userListContext}"][data-type="pond"]`, userListArea);

    if (!targetContainer.length) {
        console.log("Creating messages container for context:", contextName);
        ensureMessagesContainer.call(this, contextName, chatWindow, this.bp.apps.client);
        // Re-select after creation
        targetContainer = $(`.aim-messages-container[data-context="${contextName}"][data-type="pond"]`, chatArea);
    }

    // Show target elements
    if (targetContainer.length) {
        // console.log("Showing messages container for context:", contextName);
        targetContainer.show();
    }
    if (targetUserList.length) {
        // console.log("Showing user list for context:", userListContext);
        targetUserList.show();
    }

    // Fallback: Show first available context if target is missing
    if (!targetContainer.length || !targetUserList.length) {
        const availableContainers = $(".aim-messages-container", chatArea);
        if (availableContainers.length > 0) {
            const firstContext = availableContainers.first().data("context");
            const firstUserListContext = firstContext.replace("pond/", "");
            // console.log("Falling back to first context:", firstContext);

            $(`.aim-messages-container[data-context="${firstContext}"]`, chatArea).show();
            $(`.aim-user-list[data-context="${firstUserListContext}"][data-type="pond"]`, userListArea).show();

            $(".aim-room-item", chatWindow.content).removeClass("aim-room-active");
            $(`.aim-room-item[data-context="${firstContext}"]`, chatWindow.content).addClass("aim-room-active");
            $(".message_form .aim-to", chatWindow.content).val(firstContext);
        } else {
            console.log("No available message containers or user lists");
        }
    }

    // find the current .button-bar
    let buttonBar = $(".button-bar", chatWindow.content);
    // we need to iterate through all the first level children of the buttonBar
    // and update the data-context attribute to match the current contextName
    if (buttonBar.length) {
        buttonBar.children().each((_, child) => {
            // console.log(`Updating button bar child context for:`, child, contextName);
            $(child).attr("data-context", contextName);
        });
    }

    this.scrollToBottom(chatWindow.content);
}

function setupChatWindow(windowType, contextName, chatWindow, client) {
    const chatWindowTemplate = this.messageTemplateString;
    const cloned = document.createElement("div");
    cloned.innerHTML = chatWindowTemplate;

    const aimMessagesContainer = $(".aim-messages-container", cloned)[0];
    aimMessagesContainer.setAttribute("data-context", contextName);
    aimMessagesContainer.setAttribute("data-type", windowType);

    if (windowType === "buddy") {
        $(".aim-user-list-area", cloned).remove();
        $(".aim-room-list", cloned).remove();
        $('.aim-messages-header', cloned).remove();
        chatWindow.container.classList.add("has-droparea");
        chatWindow.content.appendChild($(".aim-window", cloned)[0]);

    } else {

        const aimUserListContainer = $(".aim-user-list", cloned)[0];
        aimUserListContainer.setAttribute("data-context", contextName);
        aimUserListContainer.setAttribute("data-type", windowType);

        if (this.bp.isMobile()) {
            $('.aim-close-chat-btn', cloned).text('Close #' + contextName.replace("pond/", ""));
            $('.aim-chat-title', cloned).remove();
        } else {
            $('.aim-chat-title', cloned).text(`#${contextName.replace("pond/", "")}`);

        }

        $('.joinPondForm', cloned).on('submit', (e) => {
            e.preventDefault();
            // get value from #customPondName
            try {
                let pondName = $('.customPondName').val();
                joinPond.call(this, pondName);

            } catch (err) {
                console.error("Error joining pond:", err);
            }
            return false;
        });

        chatWindow.container.classList.add("has-droparea");
        chatWindow.content.appendChild($(".aim-window", cloned)[0]);

        const aimWindow = $('.aim-window', chatWindow.content)[0];
        console.log('chatWindow.contentchatWindow.content', chatWindow.content)
        console.log('aimWindow', aimWindow)
        let touchStartX = 0;
        let touchEndX = 0;

        aimWindow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        aimWindow.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum swipe distance in pixels
            const deltaX = touchEndX - touchStartX;

            if (deltaX > swipeThreshold) {
                // Swipe right: show user list
                aimWindow.classList.remove('show-room-list');
                aimWindow.classList.add('show-user-list');
            } else if (deltaX < -swipeThreshold) {
                // Swipe left: show room list
                aimWindow.classList.remove('show-user-list');
                aimWindow.classList.add('show-room-list');
            } else {
                // No swipe or too small: return to chat
                aimWindow.classList.remove('show-room-list', 'show-user-list');
            }
        }

        // create button bar at top
        const buttonBar = document.createElement('div');
        buttonBar.className = 'pond-button-bar';
        buttonBar.setAttribute('data-context', contextName);
        buttonBar.setAttribute('data-type', windowType);

        // Optional: Add buttons to toggle panels for accessibility
        const toggleRoomListBtn = document.createElement('button');
        toggleRoomListBtn.textContent = 'Ponds';
        toggleRoomListBtn.className = 'toggle-room-list';

        const toggleUserListBtn = document.createElement('button');
        toggleUserListBtn.textContent = 'Buddies';
        toggleUserListBtn.className = 'toggle-user-list';

        const closePondChatBtn = document.createElement('button');
        closePondChatBtn.textContent = 'Close #' + contextName.replace("pond/", "");
        //closePondChatBtn.className = 'aim-room-close-btn';
        // add another className, aim-close-pond-chat-btn
        closePondChatBtn.classList.add('aim-close-pond-chat-btn');
        closePondChatBtn.classList.add('aim-room-close-btn');
        closePondChatBtn.setAttribute('data-context', contextName);
        closePondChatBtn.setAttribute('data-type', windowType);

        chatWindow.content.appendChild(buttonBar);

        chatWindow.content.append(toggleRoomListBtn, closePondChatBtn, toggleUserListBtn);
        // Append the button bar to the chat window content

        setupCloseButtonHandler.call(this, chatWindow, client);

        toggleRoomListBtn.addEventListener('click', () => {
            aimWindow.classList.toggle('show-room-list');
            aimWindow.classList.remove('show-user-list');
        });

        toggleUserListBtn.addEventListener('click', () => {
            aimWindow.classList.toggle('show-user-list');
            aimWindow.classList.remove('show-room-list');
        });

    }


    setupAutocomplete.call(this, chatWindow);
    setupChatWindowButtons.call(this, windowType, contextName, chatWindow);
    setupMessageForm.call(this, windowType, contextName, chatWindow);
    setupInputEvents.call(this, windowType, contextName, chatWindow);

    // update the aim-close-chat-btn with contextName
    const closeButton = $(".aim-close-chat-btn", chatWindow.content);
    if (closeButton.length) {
        closeButton.attr("data-context", contextName);
    } else {
        console.warn("No close button found in chat window for context:", contextName);
    }

    if (windowType === "pond") {
        $(".aim-user-list-items").on("click", (e) => {
            const username = $(e.target).closest('.aim-user-item').data("username");
            if (!username) {
                console.error("No username found in clicked element");
                return;
            }
            this.openChatWindow({ name: username });
        });

        setupRoomListClickHandler.call(this, chatWindow);

    }
}

function setupMessageForm(windowType, contextName, chatWindow) {
    $(".message_form .aim-to", chatWindow.content).val(contextName);

    $(".message_form", chatWindow.content).submit(async (e) => {
        e.preventDefault();
        await this.sendMessageHandler(e, chatWindow, windowType, contextName);
    });
}

function setupRoomListClickHandler(chatWindow) {
    $(".aim-room-list-items", chatWindow.content).on("click", ".aim-room-item", (e) => {
        let selectedContext = $(e.target).parent().data("context");
        if (!selectedContext) {
            console.warn("No context found for clicked room item target", e.target);
            return;
        }
        selectedContext = selectedContext.replace("pond/", "");
        //console.log("Selected context:", selectedContext);
        $(".aim-room-item", chatWindow.content).removeClass("aim-room-active");
        $(e.target).addClass("aim-room-active");
        ensureMessagesContainer.call(this, selectedContext, chatWindow, this.bp.apps.client);
        $(".message_form .aim-to", chatWindow.content).val(selectedContext);
        toggleMessagesContainer.call(this, selectedContext, chatWindow);
        // TODO: Implement logic to load messages for selectedContext
    });
}

function setupCloseButtonHandler(chatWindow, client) {
    $(chatWindow.content).on("click", ".aim-close-chat-btn, .aim-room-close-btn", (ev) => {
        ev.stopPropagation();
        const context = ev.target.getAttribute("data-context");

        // Remove subscription and container
        client.removeSubscription("pond", context);
        $(`.aim-messages-container[data-context="${context}"]`, chatWindow.content).remove();
        $(`.aim-room-item[data-context="${context}"]`, chatWindow.content).remove();
        // remove the associated .aim-user-list
        $(`.aim-user-list[data-context="${context.replace("pond/", "")}"][data-type="pond"]`, chatWindow.content).remove();
        // Update active ponds
        this.data.activePonds = this.data.activePonds.filter((pond) => pond !== context);

        // clear out this.data.processedMessages[contextName] = [];
        if (this.data.processedMessages[context]) {
            this.data.processedMessages[context] = [];
        }

        // Switch to another pond or hide all containers
        const remainingContainers = $(".aim-messages-container", chatWindow.content);
        if (remainingContainers.length > 0) {
            const nextContext = remainingContainers.first().data("context");
            toggleMessagesContainer.call(this, nextContext, chatWindow);
            $(".aim-room-item", chatWindow.content).removeClass("aim-room-active");
            $(`.aim-room-item[data-context="${nextContext}"]`, chatWindow.content).addClass("aim-room-active");
            $(".message_form .aim-to", chatWindow.content).val(nextContext);
        } else {
            $(".aim-messages-container", chatWindow.content).hide();
            $(".message_form .aim-to", chatWindow.content).val("");
        }

        // find the .aim-room-list-item with data-pond matching context
        const roomItem = $(`.aim-room-item[data-context="pond/${context}"]`, chatWindow.content);
        // find the .aim-room-list-item and remove active class
        $(".aim-room-list-item-name", roomItem).removeClass("aim-room-active");

        // get current count of .aim-chat-area, if 2 show .no-open-ponds
        const chatAreas = $(".aim-messages-container", chatWindow.content);
        if (chatAreas.length === 0) {
            $(".no-open-ponds", chatWindow.content).flexShow();
            $('.aim-message-controls', chatWindow.content).hide();
        }
        else {
            $(".no-open-ponds", chatWindow.content).hide();
            $('.aim-message-controls', chatWindow.content).flexShow();
        }

    });
}


function joinPond(pondName) {

    if (!pondName) {
        console.error("Pond name is required to join a pond.");
        return;
    }

    let invalidName = forbiddenNotes.containsBadWord(pondName);
    if (invalidName) {
        alert('Invalid pond name. Please choose a different name.');
        return;
    }

    // currently all ponds exists in the main "server" context, pond_messages_main
    let chatWindow = this.bp.apps.ui.windowManager.getWindow('pond-chat');

    if (!chatWindow) {
        // we may want to open  bp.open('buddylist', { context: pondName, type: 'pond' }); in this case
        console.error("Pond message main window not found, cannot join pond.");
        // TODO: might be easier to just open the window here instread of parent API doing it
        // see: apps/pond/pond.js for example
        /*
        const pondMainWindow = this.bp.apps.ui.windowManager.getWindow('pond_message_main');
        if (pondMainWindow) {
            this.bp.apps.buddylist.joinPond(pondName);
            pondMainWindow.focus();
        } else {
            this.bp.apps.buddylist.openChatWindow({ pondname: pondName });
        }
        */
        return;
    }
    // this.openChatWindow({ pondname: pondName });
    let selectedContext = `${pondName}`;
    ensureMessagesContainer.call(this, selectedContext, chatWindow, this.bp.apps.client);
    $(".message_form .aim-to", chatWindow.content).val(selectedContext);
    toggleMessagesContainer.call(this, selectedContext, chatWindow);

}