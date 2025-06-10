const client = {};

client.incrementAppInstallCount = async function (appName) {
    if (!appName) {
        console.error('No app name provided for incrementing install count');
        return;
    }

    // if appName is not an array, wrap it in an array
    if (!Array.isArray(appName)) {
        appName = [appName];
    }

    // Simulate an API call to increment the install count
    try {
        await fetch(`${buddypond.appsEndpoint}/apps/install`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appIds: appName }),
        });
        console.log(`Install count for app ${appName} incremented successfully.`);
    } catch (error) {
        console.error(`Failed to increment install count for app ${appName}:`, error);
    }
}

client.getAppsStats = async function () {
    try {
        const response = await fetch(`${buddypond.appsEndpoint}/apps/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch app stats:', error);
        return null;
    }
}

export default client;