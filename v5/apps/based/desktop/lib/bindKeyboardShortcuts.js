export default function bindKeyboardShortcuts () {

    // add global keypress listener to document
    document.addEventListener('keydown', (event) => {
        // if key is 192 and shift is pressed, open the console
        // check for the ` key
        if (event.which === 192) {
            // prevent default action
            event.preventDefault();
            // open the console
            this.bp.open('console');
            return false;
        }
    });
};