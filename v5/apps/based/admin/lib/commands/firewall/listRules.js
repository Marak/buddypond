export default async function listRules() {
    console.log('listRules called');

    let result = await this.client.apiRequest('/super-admin/ip-ban', 'GET');
    let rules = result.rules || [];
    console.log('rules', rules);

    let rulesTable = document.querySelector('#firewall-rules-table');

    // Clear existing rows
    rulesTable.innerHTML = '';

    // Create header row
    let header = rulesTable.insertRow();
    ['#', 'IP Address', 'Created On', 'Actions'].forEach(text => {
        let th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });

    // Populate the table with rules
    rules.forEach((rule, index) => {
        let row = rulesTable.insertRow();

        // Extract IP from expression (e.g. (ip.src eq 147.81.46.172))
        let ipMatch = rule.filter?.expression?.match(/\((ip\.src eq )([^\)]+)\)/);
        let ipAddress = ipMatch ? ipMatch[2] : 'Unknown';

        row.insertCell(0).textContent = index + 1; // Rule number
        row.insertCell(1).textContent = ipAddress; // Extracted IP
        row.insertCell(2).textContent = new Date(rule.created_on).toLocaleString(); // Created On

        // Actions cell with delete button
        let actionCell = row.insertCell(3);
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-rule-button';
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete rule for IP ${ipAddress}?`)) {
                await this.client.apiRequest(`/super-admin/ip-ban/${rule.id}`, 'DELETE');
                listRules.call(this); // Refresh list after deletion
            }
        });
        actionCell.appendChild(deleteButton);
    });

    if (rules.length === 0) {
        let row = rulesTable.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = 'No firewall rules found.';
    }

    console.log('Firewall rules listed:', rules);
}
