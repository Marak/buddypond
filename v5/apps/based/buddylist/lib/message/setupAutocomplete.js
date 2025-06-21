export default function setupAutocomplete(chatWindow) {
    if (!this.options.autocomplete) return;

    const $input = $(".aim-input", chatWindow.content);
    const $form = $(".message_form", chatWindow.content);
    const $sendButton = $(".aim-send-btn", chatWindow.content);

    this.replaceShortcodes = replaceShortcodes.bind(this);

    // Create a lookup map for faster emoji shortcode to Unicode conversion
    if (!this.emojiMap) {
         const usedShortcodes = new Set(); // Track used shortcodes to avoid duplicates
        this.emojiMap = Object.keys(EMOJIS).reduce((map, emoji) => {
            const aliases = EMOJIS[emoji].filter(isValidShortcode);
            aliases.forEach(alias => {
                const shortcode = `:${alias}:`;
                // Only add if shortcode hasn't been used (prioritize first emoji)
                if (!usedShortcodes.has(shortcode)) {
                    map[shortcode] = emoji;
                    usedShortcodes.add(shortcode);
                }
            });
            return map;
        }, {});
    }

    // Prepare autocomplete data for emojis: array of { label, value, emoji, type }
    if (!this.emojiSuggestions) {
        this.emojiSuggestions = Object.keys(EMOJIS).reduce((suggestions, emoji) => {
            const aliases = EMOJIS[emoji].filter(isValidShortcode);
            aliases.forEach(alias => {
                suggestions.push({
                    label: `${emoji} :${alias}:`, // Display: "🏴‍☠️ :skull_and_crossbones:"
                    value: `:${alias}:`, // Insert: ":skull_and_crossbones:"
                    emoji: emoji,
                    type: 'emoji'
                });
            });
            return suggestions;
        }, []);
    }

    if (!this.commands) {
        // Prepare autocomplete data for commands
        this.commands = Object.keys(this.options.autocomplete).map(command => ({
            label: `/${command}`,
            value: `/${command}`,
            type: 'command'
        }));
    }

    this.handleEmojiInput = handleEmojiInput.bind(this);

    // Function to get the partial shortcode or command at the cursor position
    function getInputContext(text, cursorPos) {
        const textBeforeCursor = text.slice(0, cursorPos);
        const textAfterCursor = text.slice(cursorPos);

        // Check for partial or complete emoji shortcode (e.g., ":sku" or ":skull_and_crossbones:")
        const lastColonIndex = textBeforeCursor.lastIndexOf(':');
        if (lastColonIndex !== -1) {
            // Extract potential shortcode from last ":" to next ":" or cursor
            let endIndex = cursorPos;
            const nextColonIndex = text.indexOf(':', cursorPos);
            if (nextColonIndex !== -1) {
                // Include trailing ":" if it forms a valid shortcode
                const potentialShortcode = text.slice(lastColonIndex, nextColonIndex + 1);
                if (/^:[a-z0-9_+]+:$/.test(potentialShortcode)) {
                    endIndex = nextColonIndex + 1;
                }
            }
            const potentialShortcode = text.slice(lastColonIndex, endIndex);
            // Match partial (":sku") or complete (":skull_and_crossbones:") shortcode
            if (/^:[a-z0-9_+]*(?::|$)/.test(potentialShortcode)) {
                return {
                    type: 'emoji',
                    text: potentialShortcode,
                    startIndex: lastColonIndex,
                    endIndex: endIndex
                };
            }
        }

        // Check for command (starts with "/" or "\")
        const firstChar = textBeforeCursor.charAt(0);
        if (["/", "\\"].includes(firstChar)) {
            return {
                type: 'command',
                text: textBeforeCursor,
                startIndex: 0,
                endIndex: cursorPos
            };
        }
        return null;
    }

    this.getInputContext = getInputContext.bind(this);

    let that = this;

    // Initialize autocomplete for both commands and emojis
    $input.autocomplete({

        focus: function (event, ui) {
            // Prevent jQuery UI from inserting `.label` automatically
            event.preventDefault();
            return false;
        },

        source: function (request, response) {
            const cursorPos = $input[0].selectionStart;
            const inputValue = $input.val();
            const context = getInputContext(inputValue, cursorPos);

            if (!context) {
                response([]);
                return;
            }

            if (context.type === 'emoji' && context.text.length >= 2) {
                const query = context.text.replace(/^:|:$/g, '').toLowerCase();
                const matches = that.emojiSuggestions.filter(suggestion =>
                    suggestion.value.toLowerCase().includes(query)
                ).slice(0, 10);
                response(matches);
            } else if (context.type === 'command') {
                const query = context.text.slice(1).toLowerCase();
                console.log('Command query:', query);
                console.log('Available commands:', that.commands);
                const matches = that.commands.filter(suggestion =>
                    suggestion.value.toLowerCase().includes(query)
                ).slice(0, 10);
                response(matches);
            } else {
                response([]);
            }
        },
        select: function (event, ui) {
            const textarea = $input[0];
            const cursorPos = textarea.selectionStart;
            const inputValue = $input.val();
            const context = getInputContext(inputValue, cursorPos);

            if (context) {
                // Replace from startIndex to endIndex
                const before = inputValue.slice(0, context.startIndex);
                const after = inputValue.slice(context.endIndex);
                const newValue = before + (ui.item.emoji || ui.item.value) + after;
                $input.val(newValue);

                // Set cursor after the inserted value
                const newCursorPos = context.startIndex + ui.item.value.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);

                // Trigger input event for emoji replacement (if emoji)
                if (ui.item.type === 'emoji') {
                    $input.trigger('input');
                }

                // Update send button
                $sendButton.css("opacity", newValue.length > 0 ? 1 : 0.5);

                // Close autocomplete
                $input.autocomplete("close");

                return false;
            }
        },
        minLength: 0,
        position: { my: "left bottom", at: "left top", collision: "none" },
        open: function () {
            $('.ui-autocomplete').css({
                'max-height': '200px',
                'overflow-y': 'auto',
                'z-index': 1000
            });
        }
    });
}

// Function to validate and normalize a shortcode name
function isValidShortcode(name) {
    return /^[a-z0-9_+]+$/.test(name) && !name.startsWith(':') && !name.includes(' ');
}

// Function to replace shortcodes in a string with emojis
function replaceShortcodes(text) {
    const shortcodeRegex = /:[a-z0-9_+]+:/g;
    return text.replace(shortcodeRegex, match => this.emojiMap[match] || match);
}

// Function to handle text area input and replace shortcodes
function handleEmojiInput(event) {
    const textarea = event.target;
    const $textarea = $(textarea);
    const cursorPos = textarea.selectionStart;
    const originalText = $textarea.val();
    const newText = replaceShortcodes(originalText);

    if (newText !== originalText) {
        $textarea.val(newText);
        const offset = newText.length - originalText.length;
        const newCursorPos = cursorPos + offset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        $sendButton.css("opacity", newText.length > 0 ? 1 : 0.5);
    }
}