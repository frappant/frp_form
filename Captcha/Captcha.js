export default class Captcha {
  /**
   * Initialize Captcha
   * @param {HTMLFormElement} form - The form element
   */
  constructor(form) {
    if (!form) {
      throw new Error('Form element is required for Captcha.');
    }

    this.form = form;
    this.$feedback = null;
  }

  /**
   * Create or get the feedback element
   */
  setFeedbackElement() {
    if (!this.$feedback) {
      console.log('Creating feedback element');
      this.$feedback = document.createElement('div');
      this.$feedback.classList.add('invalid-feedback', 'captcha-feedback');
      this.$feedback.style.display = 'none'; // Initially hidden
      const submitButton = this.form.$el.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.parentNode.insertBefore(this.$feedback, submitButton.nextSibling);
      }
    }
  }

  /**
   * Display an error message in the feedback element
   * @param {string} message - Error message to display
   */
  setError(message) {
    if (this.$feedback) {
      this.$feedback.innerHTML = message;
      this.$feedback.style.display = 'block'; // Make it visible
      this.$feedback.classList.add('is-invalid');
    }
  }

  /**
   * Hide the feedback element
   */
  clearError() {
    if (this.$feedback) {
      this.$feedback.innerHTML = '';
      this.$feedback.style.display = 'none'; // Hide the feedback
      this.$feedback.classList.remove('is-invalid');
    }
  }
}
