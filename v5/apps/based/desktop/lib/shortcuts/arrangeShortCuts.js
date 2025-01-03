export default function arrangeShortcuts(cols = 4, options = {
    rowWidth: 74,
    rowHeight: 100
}) {
    const containerWidth = this.shortCutsContainer.offsetWidth || 800; // Get the container's width
    const maxCols = Math.floor(containerWidth / options.rowWidth); // Calculate the maximum number of columns
    const actualCols = cols < maxCols ? cols : maxCols; // Choose the lesser to avoid overflow

    Array.from(this.shortCutsContainer.children).forEach((icon, index) => {
        let x = (index % actualCols) * options.rowWidth; // Calculate x position
        let y = Math.floor(index / actualCols) * options.rowHeight; // Calculate y position

        let offSetY = 100;
        if (this.bp.isMobile()) { // TODO: remove
            y += offSetY; // Add an offset to the y position

        }
        let offsetX = 15;
        x += offsetX; // Add an offset to the x position
        // console.log('x:', x, 'y:', y);
        icon.style.position = 'absolute'; // Corrected typo here
        icon.style.left = `${x}px`; // Set left position
        icon.style.top = `${y}px`; // Set top position
    });
}