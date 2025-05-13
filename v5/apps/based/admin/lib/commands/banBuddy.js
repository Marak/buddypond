export default async function banBuddy(buddyname, banType, duration = 60) { // one hour default
   let banResponse = await this.client.apiRequest('/super-admin/ban-buddy', 'POST', {
      buddyname: buddyname,
      type: banType,
      duration: duration,
      reason: 'Inappropriate behavior' // TODO: custom message
   });

   if (banResponse.error) {
      $('.api-response', '#admin-buddyProfile').html(bankResponse.error);
      console.error('Error banning buddy:', banResponse.error);
      return;
   }

   $('.api-response', '#admin-buddyProfile').html(banResponse.message);
   this.tabs.showTab('#admin-banlist');
   console.log('banResponse', banResponse);
}