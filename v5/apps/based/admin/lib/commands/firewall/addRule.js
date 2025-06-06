import listRules from "./listRules.js";

export default async function addRule(ip = "147.81.46.172") {
    try {
    await this.client.apiRequest('/super-admin/ip-ban', 'POST', {
        ip: ip
    });
    //console.log('addRule result', result);

    } catch (error) {
        $('#admin-firewall .api-response').text('Error adding firewall rule: ' + error.message);
        console.error('Error adding firewall rule:', error);
        throw error; // Re-throw the error for further handling if needed
    }
    // console.log('addRule result', result);
    listRules.call(this); // Refresh list after deletion
}