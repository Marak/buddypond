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
    if (this.opened) return;

    this.opened = true;
    this.$container = $('<div>').html(this.html);
    $(document.body).append(this.$container);

    const $form = $('.password-form', this.$container);
    const $email = $('.email-input', this.$container);
    const $password = $('.password-main', this.$container);
    const $confirm = $('.password-confirm', this.$container);
    const $status = $('.form-status', this.$container);
    const $overlay = $('.password-overlay', this.$container);

    const $errors = {
      email: $('.email-error', this.$container),
      password: $('.password-error', this.$container),
      confirm: $('.confirm-error', this.$container)
    };

    // Pre-fill email if available
    const emailFromProfile = this.bp.apps?.buddylist?.data?.profileState?.email;
    if (emailFromProfile) {
      $email.val(emailFromProfile);
    }

    // Save button handler
    $('.save-btn', this.$container).on('click', async () => {
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
        $overlay.hide();

        if (emailFromProfile) {
          this.bp.apps.buddylist.data.profileState.email = email;
        }

      } catch (err) {
        console.error('Failed to save password:', err);
        $status.text('Failed to update account. Please try again.');
      }
    });

    // Cancel button handler
    $('.cancel-btn', this.$container).on('click', () => {
      $overlay.hide();
    });

    // Public show method
    window.showPasswordDialog = () => {
      $overlay.show();
      if ($email.val().trim()) {
        $password.focus();
      } else {
        $email.focus();
      }
    };

    // Auto-show
    showPasswordDialog();
  }
}
