export default function applyData(el, data) {
    let $el = $(el);
    $el.find('.card-md-close-btn').on('click', () => {
        $el.hide(); // Hide the help card (replace with your preferred close logic)
        // set local storage 'viewed-help-card' to true
    });
}