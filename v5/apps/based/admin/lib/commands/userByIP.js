// Populate user by IP table
export default async function userByIp(ip) {
    console.log('userByIp', ip);
    let userByIpData = {
        '192.168.1.1': [{ username: 'alice', ip: '192.168.1.1' }],
        '192.168.1.2': [{ username: 'bob', ip: '192.168.1.2' }],
    };

    userByIpData = await this.client.apiRequest(`/super-admin/user-by-ip?ip=${ip}`, 'GET');

    // check if userByIpData is an array
    if (!Array.isArray(userByIpData)) {
        console.log('userByIpData is not an array:', userByIpData);
        // update the UI to show an error message
        $('.api-response', '#admin-userbyIP').text(userByIpData.message);
        return;
    }
    $('.api-response', '#admin-userbyIP').text('');

    console.log('userByIp userByIpData', userByIpData);
    const tbody = document.querySelector('#user-by-ip-table tbody');
    tbody.innerHTML = '';
    userByIpData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="admin-username-link" data-username="${user.buddyname}">${user.buddyname}</span></td>
            <td>${user.lastKnownIP}</td>
            <td>${user.knownIps}</td>
        `;
        tbody.appendChild(row);
    });
}