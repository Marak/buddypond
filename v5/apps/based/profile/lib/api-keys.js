export default async function apiKeys() {
    let roles = ['deploy', 'read', 'write', 'admin'];

    // Populate role checkboxes
    const roleBox = $('#bp-api-keys-roles');
    roles.forEach(role => {
        const id = `bp-api-role-${role}`;
        let checked = '';

        if (role === 'deploy') {
            checked = 'checked'; // Default to deploy role being checked
        }

        roleBox.append(`
      <label for="${id}" class="bp-api-keys-role-label">
        <input type="checkbox" name="roles" value="${role}" id="${id}" ${checked} />
        ${role}
      </label>
    `);
    });

    // Handle form submission
    $('.bp-api-keys-form').on('submit', async function (e) {
        e.preventDefault();
        const form = $(this);
        const name = form.find('input[name="name"]').val();
        const expiry = form.find('input[name="expiry"]').val();
        const roles = form.find('input[name="roles"]:checked')
            .map(function () { return this.value; })
            .get();

        if (!name || roles.length === 0) {
            alert('Please provide a name and at least one role.');
            return false;
        }

        try {
            const newKey = await client.addApiKey(name, roles, expiry || null);

            console.log('New API key created:', newKey);
            renderApiKeys(); // Refresh key list
        } catch (err) {
            alert('Failed to create API key');
            console.error(err);
        }
        return false;
    });

    async function renderApiKeys() {
        const list = $('#bp-api-keys-list');
        list.empty();
        const apiKeys = await client.getApiKeys();

        apiKeys.forEach((key) => {
            const keyPrefix = 'Hidden, click "Reveal" to show API Key';
            const roles = Array.isArray(key.roles) ? key.roles : (key.role ? [key.role] : []);
            const created = new Date(key.ctime || key.created_at).toLocaleString();
            const expiry = key.expiry ? new Date(key.expiry).toLocaleDateString() : 'Never';
            const usage = key.usage ? `${key.usage} times` : 'Not used yet';

            const li = $(`
  <li class="bp-api-keys-list-item">
    <div class="bp-api-keys-card">
      <div class="bp-api-keys-header">
        <strong class="bp-api-keys-name">${key.name}</strong>
        <button class="bp-api-keys-revoke" data-id="${key.id}">Revoke</button>
      </div>

      <div class="bp-api-keys-keybox" data-full="${key.key || key.id}">
        <code class="bp-api-keys-code">${keyPrefix}</code>
        <div class="bp-api-keys-buttons">
          <button class="bp-api-keys-reveal">Reveal</button>
          <button class="bp-api-keys-copy">Copy</button>
          <button class="bp-api-keys-verify">Verify</button>
        </div>
        <div class="bp-api-keys-status"></div>
      </div>

      <div class="bp-api-keys-meta">
        <div><strong>Roles:</strong> ${roles.join(', ')}</div>
        <div><strong>Created:</strong> ${created}</div>
        <div><strong>Expiry:</strong> ${expiry}</div>
        <div><strong>Used:</strong> <span class="usage-count">${usage}</span></div>

      </div>
    </div>
  </li>
`);


            list.append(li);
        });

        // Handle key reveal
        $('.bp-api-keys-reveal').on('click', function () {
            const box = $(this).closest('.bp-api-keys-keybox');
            const fullKey = box.data('full');
            box.find('code').text(fullKey);
            $(this).remove(); // Remove the button after revealing
        });

        // Handle copy to clipboard
        $('.bp-api-keys-copy').on('click', function () {
            const box = $(this).closest('.bp-api-keys-keybox');
            const fullKey = box.data('full');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(fullKey).then(() => {
                    $(this).text('Copied!');
                    setTimeout(() => $(this).text('Copy'), 1500);
                });
            } else {
                alert('Clipboard API not supported in this browser.');
            }
        });

        // Handle API key verification
        $('.bp-api-keys-verify').on('click', async function () {
            const box = $(this).closest('.bp-api-keys-keybox');
            const fullKey = box.data('full');
            const statusBox = box.find('.bp-api-keys-status');

            // Get roles from meta block
            const rolesText = box.closest('.bp-api-keys-card').find('.bp-api-keys-meta')
                .find('div:contains("Roles:")').text().replace('Roles:', '').trim();
            const roles = rolesText.split(',').map(r => r.trim()).filter(Boolean);

            statusBox.text('Verifying…');

            try {
                const result = await client.validateApiKey(fullKey, roles);
                if (result.valid) {
                    statusBox.text('✅ Valid').css('color', 'green');
                    // update usage count
                    const usageCount = box.closest('.bp-api-keys-card').find('.usage-count');
                    usageCount.text(result.usage + ' times' || '0 times');
                } else {
                    statusBox.text(`❌ Invalid (${result.reason || 'unknown'})`).css('color', 'red');
                }
            } catch (err) {
                console.error('Validation failed', err);
                statusBox.text('❌ Error validating key').css('color', 'red');
            }
        });


        // Handle revoke
        $('.bp-api-keys-revoke').on('click', async function () {
            const keyId = $(this).data('id');
            if (!confirm('Are you sure you want to revoke this API key?')) return;
            await client.revokeApiKey(keyId);
            renderApiKeys(); // Refresh list
        });
    }


    renderApiKeys(); // Initial load
}


const client = {};

client.endpoint = buddypond.apiKeysEndpoint;

client.addApiKey = async function (name, roles, expiry) {
    return await client.apiRequest('/api-keys', 'POST', {
        name,
        roles,
        expiry
    });
};

client.revokeApiKey = async function (keyId) {
    return await client.apiRequest(`/api-keys/${keyId}`, 'DELETE');
};

client.getApiKeys = async function () {
    const keys = await client.apiRequest('/api-keys', 'GET');
    if (Array.isArray(keys)) return keys;
    throw new Error('Invalid API key list');
};

client.validateApiKey = async function (key, requireRole) {
    if (!key || !requireRole || !Array.isArray(requireRole) || requireRole.length === 0) {
        throw new Error('Invalid key or requireRole parameter');
    }
    return await client.apiRequest('/api-keys/validate', 'POST', {
        key,
        requireRole
    });
};


client.apiRequest = async (uri, method = 'GET', data = null) => {

    const options = {
        method: method
    };

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-Me": buddypond.me
    };
    if (buddypond.qtokenid) {
        headers["Authorization"] = `Bearer ${buddypond.qtokenid}`; // ✅ Use Authorization header
    }


    if (data) {
        options.body = JSON.stringify(data);
    }

    options.headers = headers;

    let url = `${client.endpoint}${uri}`;
    console.log('admin client making api request', url, options);


    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in API request:', error);
        throw error;
    }

};