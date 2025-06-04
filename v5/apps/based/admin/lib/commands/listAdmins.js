export default async function listAdmins(buddyname, ip) { // one hour default
    console.log('listAdmins called with buddyname:', buddyname, 'and ip:', ip);
   let listAdminsResponse = await this.client.apiRequest('/super-admin/admin-list', 'GET');

   if (listAdminsResponse.error) {
      $('.api-response', '#admin-add-admin').html(listAdminsResponse.error);
      console.error('Error banning buddy:', listAdminsResponse.error);
      return;
   }

   $('.api-response', '#admin-add-admin').html(listAdminsResponse.message);
   // this.tabs.showTab('#admin-add-admin');
   console.log('listAdminsResponse', listAdminsResponse);

   $('#admin-list-table').html(''); // Clear the table before populating it
    if (listAdminsResponse && listAdminsResponse.length > 0) {
        listAdminsResponse.forEach(admin => {
            $('#admin-list-table').append(`
                <tr>
                    <td>${admin.buddyname}</td>
                    <td>${admin.ip}</td>
                    <td>${admin.role}</td>
                    <td>${admin.ctime}</td>
                    <td><button class="remove-admin">Remove Admin</button></td>

                </tr>
            `);
        });
    }
    else {
        $('#admin-list-table').append(`
            <tr>
                <td colspan="3">No admins found</td>
            </tr>
        `);
    }
    // this.tabs.showTab('#admin-add-admin');

}