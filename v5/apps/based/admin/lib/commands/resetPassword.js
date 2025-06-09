export default async function resetPassword(buddyname, newPassword) {
    console.log('resetPassword', buddyname);
    let resetResponse = await this.client.apiRequest('/super-admin/reset-password', 'POST', {
        buddyname: buddyname,
        newPassword: newPassword || buddyname // use buddyname as default if no password provided
    });
    console.log('resetResponse', resetResponse);

    if (resetResponse.error) {
        //$('.api-response', '#admin-banlist').html(resetResponse.error);
        console.error('Error resetting buddy password:', resetResponse.error);
        return;
     }
  
     // $('.api-response', '#admin-banlist').html(resetResponse.message);
     this.tabs.showTab('#admin-buddyProfile');
     console.log('resetResponse', resetResponse);

 }