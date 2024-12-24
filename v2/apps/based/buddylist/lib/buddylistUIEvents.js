export default function buddylistUIEvents () {
    let api = this.bp.apps.client.api;
     // bind events
     $('.loginForm').submit((e) => {
        e.preventDefault();
        let username = $('.loginForm input[name="username"]').val();
        let password = $('.loginForm input[name="password"]').val();
        if (!password) {
            password = username;
        }
        api.authBuddy(username, password, function (err, result) {
            if (err) {
                $('.loginForm .error').text('Failed to authenticate buddy');
                console.error('Failed to authenticate buddy:', err);
                return;
            }
            console.log('authBuddy', err, result);
            if (result.success) {
                // attempt to connect for events after getting auth token
                //console.log('connecting with valid qtokenid', api.qtokenid);
                bp.emit('auth::qtoken', result.qtokenid);
                $('.loggedIn').show();
            } else {
                if (username === password) {
                    $('.password').show();
                    $('.password').focus();
                    return;
                }
                $('.loginForm .error').text('Failed to authenticate buddy');
                console.error('Failed to authenticate buddy:');
            }
        });
        return false;
    });

    $('.onlineStatusSelect').change((e) => {
        let status = $(e.target).val();
        console.log('status', status);
        bp.emit('profile::status', status);
    });


}