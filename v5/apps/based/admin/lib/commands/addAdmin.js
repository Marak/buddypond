export default async function addAdmin(buddyname, ip) { // one hour default
    console.log('addAdmin called with buddyname:', buddyname, 'and ip:', ip);
   let addAdminResponse = await this.client.apiRequest('/super-admin/add-admin', 'POST', {
      buddyname: buddyname,
        ip: ip
   });

   if (addAdminResponse.error) {
      $('.api-response', '#admin-add-admin').html(addAdminResponse.error);
      console.error('Error banning buddy:', addAdminResponse.error);
      return;
   }

   $('.api-response', '#admin-add-admie').html(addAdminResponse.message);
   this.tabs.showTab('#admin-add-admin');
   console.log('addAdminResponse', addAdminResponse);
}