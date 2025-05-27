
// Populate recent logins table
export default async function recentLogins() {

    let recentLogins = [
        { username: 'alice', ip: '192.168.1.1', time: '2025-05-11 10:00:00' },
        { username: 'bob', ip: '192.168.1.2', time: '2025-05-11 09:30:00' },
    ];
    
    recentLogins = await this.client.apiRequest('/super-admin/recent-logins', 'GET');

    const tbody = document.querySelector('#recent-logins-table tbody');
    tbody.innerHTML = '';
    recentLogins.forEach(login => {
        const row = document.createElement('tr');
        let knownIps = '';
        let _knownIps = [];
        try {
            if (login.knownIps) {
                _knownIps = JSON.parse(login.knownIps);
            }
        } catch (e) {
            console.error('Error parsing knownIPs', e);
        }
        _knownIps.forEach(ip => {
            knownIps += `<a href="https://iplocation.io/ip/${ip}" target="_blank">${ip}</a>`;
        });
        row.innerHTML = `
            <td><span class="admin-username-link" data-username="${login.buddyname}">${login.buddyname}</span></td>
            <td><a href="https://iplocation.io/ip/${login.lastKnownIP}" target="_blank">${login.lastKnownIP}</a></td>
            <td>${login.utime}</td>
            <td>${knownIps}</td>
        `;
        tbody.appendChild(row);
    });
}