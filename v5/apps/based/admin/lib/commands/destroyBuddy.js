export default async function destroyBuddy(buddyname) {
    console.log('destroyBuddy', buddyname);
    let removeResponse = await this.client.apiRequest('/super-admin/destroy-buddy', 'POST', {
        buddyname: buddyname
    });
    console.log('removeResponse', removeResponse);


    if (removeResponse.error) {
        //$('.api-response', '#admin-banlist').html(removeResponse.error);
        console.error('Error banning buddy:', removeResponse.error);
        return;
     }
  
     // $('.api-response', '#admin-banlist').html(removeResponse.message);
     this.tabs.showTab('#admin-buddyProfile');
     console.log('removeResponse', removeResponse);

 }