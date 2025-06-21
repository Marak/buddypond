export default function setupInputEvents(windowType, contextName, chatWindow) {
    const $input = $(".aim-input", chatWindow.content);
    const $form = $(".message_form", chatWindow.content);
    const $sendButton = $(".aim-send-btn", chatWindow.content);

    
    // Trigger autocomplete manually on input
    let that = this;
    $input.on("input", function (event) {
        that.handleEmojiInput(event);
        const cursorPos = this.selectionStart;
        const inputValue = $input.val();
        const context = that.getInputContext(inputValue, cursorPos);

        if (context && ((context.type === 'emoji' && context.text.length >= 2) || context.type === 'command')) {
            $(this).autocomplete("search", context.text);
        } else {
            $(this).autocomplete("close");
        }
    });

    $input.on("keydown", (e) => {
        if (e.which === 13 && e.shiftKey) {
            const inputValue = $input.val();
            const cursorPosition = $input[0].selectionStart;
            const newValue = inputValue.slice(0, cursorPosition) + "\n" + inputValue.slice(cursorPosition);
            $input.val(newValue);
            $input[0].setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            $sendButton.css("opacity", newValue.length > 0 ? 1 : 0.5);
            return false;
        }

        // Prevent form submission on Enter when autocomplete is visible
        if (e.which === 13 && $input.autocomplete("widget").is(":visible")) {
            // check if this is a BS command, if so we do need to submit the form
            const inputValue = $input.val();
            // check if inputValue starts with / or \, if so, run it
            if (inputValue.startsWith("/") || inputValue.startsWith("\\")) {
                $form.submit();
                e.preventDefault();
                return false;
            }
            e.preventDefault();
            return false; // Let jQuery UI handle selection
        }

        // Prevent focus change on Tab ( with or without autocomplete visible )
        if (e.which === 9) {
            e.preventDefault();
            return false; // Let jQuery UI handle selection
        }

        if (e.which === 13) {
            let message = $input.val().replace(/\n/g, "<br>");
            message = that.replaceShortcodes(message);

            $input.val(message);
            $form.submit();
            e.preventDefault();
            return false;
        }

        let activeContext = chatWindow.currentActiveContext || contextName;

        this.bp.emit("buddy::typing", {
            from: this.bp.me,
            to: activeContext,
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