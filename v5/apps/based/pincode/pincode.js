export default class PasswordDialog {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.options = options;
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/pincode/pincode.html');
    await this.bp.load('/v5/apps/based/pincode/pincode.css');
    return 'loaded password dialog';
  }

  async open() {
    if (!this.opened) {
      this.opened = true;
      $(document.body).append(this.html);

      const $form = $('.password-form');
      const $email = $('.email-input');
      const $password = $('.password-main');
      const $confirm = $('.password-confirm');
      const $status = $('.form-status');

      const $errors = {
        email: $('.email-error'),
        password: $('.password-error'),
        confirm: $('.confirm-error')
      };

      $('.save-btn').on('click', async () => {
        $errors.email.text('');
        $errors.password.text('');
        $errors.confirm.text('');
        $status.text('');
        $password.removeClass('error');
        $confirm.removeClass('error');

        const email = $email.val().trim();
        const pass = $password.val().trim();
        const confirm = $confirm.val().trim();

        if (!pass) {
          $errors.password.text('Password is required.');
          $password.addClass('error');
          return;
        }

        if (confirm !== pass) {
          $errors.confirm.text('Passwords do not match.');
          $confirm.addClass('error');
          return;
        }

        try {
          const result = await buddypond.updateAccount({
            buddyname: this.bp.me,
            password: pass,
            email: email || undefined
          });

          console.log('Password set successfully', result);
          $('.password-overlay').hide();

        if (bp.apps.buddylist && bp.apps.buddylist.data.profileState && bp.apps.buddylist.data.profileState.email) {
            // Update the email in buddylist if it exists
            bp.apps.buddylist.data.profileState.email = email;
            // bp.apps.buddylist.updateProfileState();
        }

        } catch (err) {
          console.error('Failed to save password:', err);
          $status.text('Failed to update account. Please try again.');
        }
      });

      $('.cancel-btn').on('click', () => {
        $('.password-overlay').hide();
      });

      window.showPasswordDialog = () => $('.password-overlay').show();
      // focus the email input
      $email.focus();
      showPasswordDialog();
    }
  }
}
