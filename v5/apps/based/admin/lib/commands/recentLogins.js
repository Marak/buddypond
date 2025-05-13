
// Populate recent logins table
export default async function recentLogins() {

    let recentLogins = [
        { username: 'alice', ip: '192.168.1.1', time: '2025-05-11 10:00:00' },
        { username: 'bob', ip: '192.168.1.2', time: '2025-05-11 09:30:00' },
    ];
    
    recentLogins = await this.client.apiRequest('/super-admin/recent-logins', 'GET');

    console.log('recent logins', recentLogins);

    const tbody = document.querySelector('#recent-logins-table tbody');
    tbody.innerHTML = '';
    recentLogins.forEach(login => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="admin-username-link" data-username="${login.buddyname}">${login.buddyname}</span></td>
            <td>${login.lastKnownIP}</td>
            <td>${login.utime}</td>
            <td>${login.knownIps}</td>
        `;
        tbody.appendChild(row);
    });
}