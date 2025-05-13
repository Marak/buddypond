export default async function unbanUserbanBuddy(buddyname, type) {
    console.log('unbanUserbanBuddy', buddyname, type);
    let unbanResponse = await this.client.apiRequest('/super-admin/unban-buddy', 'POST', {
        buddyname: buddyname,
        type: type
    });
    console.log('unbanResponse', unbanResponse);


    if (unbanResponse.error) {
        $('.api-response', '#admin-banlist').html(unbanResponse.error);
        console.error('Error banning buddy:', unbanResponse.error);
        return;
     }
  
     $('.api-response', '#admin-banlist').html(unbanResponse.message);
     this.tabs.showTab('#admin-banlist');
     console.log('unbanResponse', unbanResponse);

 }