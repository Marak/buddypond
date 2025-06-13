import ChatWindowButtonBar from "../ChatWindowButtonBar.js";


export default function setupChatWindowButtons(windowType, contextName, chatWindow) {
    if (!this.options.chatWindowButtons) return;

    let buttons = this.options.chatWindowButtons.slice();
    if (windowType === "pond") {
        buttons = buttons.filter((button) => button.type !== "buddy-only");
    }

    if (isIOS()) {
        buttons = buttons.filter((button) => button.env !== "desktop-only");
    }

    chatWindow.buttonBar = new ChatWindowButtonBar(this.bp, {
        context: contextName,
        type: windowType,
        buttons,
    });
    $(".aim-message-controls", chatWindow.content).prepend(chatWindow.buttonBar.container);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && "ontouchend" in document;
}