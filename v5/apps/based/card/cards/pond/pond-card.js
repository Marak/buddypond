export default function applyData(el, data) {
    if (data.pondNames) {
        const pondList = el.querySelector('.pond-list');
        data.pondNames.forEach(pondName => {
            const pondLink = document.createElement('a');
            pondLink.href = "#";
            pondLink.className = "card-pond-pond-name";
            pondLink.textContent = '#' + pondName;
            pondLink.title = `Join the ${pondName} pond`;
            pondLink.onclick = () => bp.open('buddylist', { context: pondName, type: 'pond' });
            pondList.appendChild(pondLink);
        });
    }
}
