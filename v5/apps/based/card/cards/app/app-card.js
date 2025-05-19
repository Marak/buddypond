export default function applyData(el, data) {
    const $el = $(el);

    // Extract app data (expecting name, description, image URL)
    const { name = 'Unnamed App', description = 'No description available', image = '' } = data || {};
    // console.log('App data:', data);

    let appIcon = this.bp.apps.desktop.apps[data.context]?.icon;
    let appLabel = this.bp.apps.desktop.apps[data.context]?.label;
    let appDescription = this.bp.apps.desktop.apps[data.context]?.description;

    // Update card elements with data
    $el.find('.card-app-name').text(appLabel);
    $el.find('.card-app-description').text(appDescription);

    $el.find('.card-app-image').attr('src', appIcon);

    // Add click handler to open the app
    $el.on('click', () => {
        // Stub action: Log app open (replace with actual app open logic)
        console.log(`Opening app: ${data.context}`);
        this.bp.open(data.context);
        // Visual feedback
        $el.addClass('card-app-clicked');
        setTimeout(() => $el.removeClass('card-app-clicked'), 200);
    });
}