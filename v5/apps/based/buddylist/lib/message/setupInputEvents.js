export default function setupInputEvents(windowType, contextName, chatWindow) {
    const $input = $(".aim-input", chatWindow.content);
    const $form = $(".message_form", chatWindow.content);
    const $sendButton = $(".aim-send-btn", chatWindow.content);

    $input.keydown((e) => {
        if (e.which === 13 && e.shiftKey) {
            const inputValue = $input.val();
            const cursorPosition = $input[0].selectionStart;
            const newValue = inputValue.slice(0, cursorPosition) + "\n" + inputValue.slice(cursorPosition);
            $input.val(newValue);
            $input[0].setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            return false;
        }

        if (e.which === 13) {
            const message = $input.val().replace(/\n/g, "<br>");
            $input.val(message);
            $form.submit();
            e.preventDefault();
            return false;
        }

        this.bp.emit("buddy::typing", {
            from: this.bp.me,
            to: contextName,
            type: windowType,
            isTyping: true,
            ctime: Date.now(),
        });
    });

    $input.on("keyup", (e) => {
        const inputValue = $input.val();
        $sendButton.css("opacity", inputValue.length > 0 ? 1 : 0.5);
    });
}
