
export default async function banList() {

    let banList = await this.client.apiRequest('/super-admin/ban-list', 'GET');
    console.log('banList', banList);

    const tbody = document.querySelector('#admin-banlist tbody');
    tbody.innerHTML = '';
    banList.forEach(ban => {

        let currentCurses = [];
        if (ban.curses) {
            currentCurses = JSON.parse(ban.curses);
        }
        // for each ban.curses create a unique button to insert in cell
        let curseButtons = currentCurses.map(curse => {
            console.log('cursecursecurse', curse);
            let curseType = curse.type;
            return `<button class="admin-remove-ban-link" data-username="${ban.buddyname}" data-curse="${curseType}">${curseType}</button>`;
        });
        console.log('curseButtons', curseButtons);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="admin-username-link" data-username="${ban.buddyname}">${ban.buddyname}</span></td>
            <td>${ban.ip}</td>
            <td>${ban.curses}</td>
            <td>${new Date(ban.utime).toLocaleString()}</td>
            <td>${curseButtons.join(' ')}</td>
        `;
        // <td class="admin-remove-ban-link" data-username="${ban.buddyname}"><button>Unban</td>

        tbody.appendChild(row);
    });
}