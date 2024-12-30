export default function arrangeShortcuts(cols = 4) {
    const containerWidth = this.shortCutsContainer.offsetWidth || 800; // Get the container's width
    console.log('containerWidth:', containerWidth);
    const iconWidth = 74; // Assuming width + margin of icons
    const rowHeight = 100; // Assuming height + margin of icons
    const maxCols = Math.floor(containerWidth / iconWidth); // Calculate the maximum number of columns
    const actualCols = cols < maxCols ? cols : maxCols; // Choose the lesser to avoid overflow

    Array.from(this.shortCutsContainer.children).forEach((icon, index) => {
        const x = (index % actualCols) * iconWidth; // Calculate x position
        const y = Math.floor(index / actualCols) * rowHeight; // Calculate y position
        console.log('x:', x, 'y:', y);
        icon.style.position = 'absolute'; // Corrected typo here
        icon.style.left = `${x}px`; // Set left position
        icon.style.top = `${y}px`; // Set top position
    });
}