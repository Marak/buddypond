export default function setupAutocomplete(chatWindow) {
    if (!this.options.autocomplete) return;

    const commands = Object.keys(this.options.autocomplete).map((command) => `/${command}`);
    $(".aim-input", chatWindow.content).autocomplete({
        source: commands,
        search: (event, ui) => {
            const firstChar = event.target.value.charAt(0);
            return ["/", "\\"].includes(firstChar);
        },
    });
}