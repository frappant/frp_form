import Captcha from "./Captcha";

export default class GoogleReCaptcha extends Captcha {
  /**
   * Initialize Google reCAPTCHA
   * @param {Object} config - Configuration options
   * @param {string} config.siteKey - Google reCAPTCHA site key
   * @param {string} config.validationURL - Server endpoint for token validation
   * @param {string} config.version - reCAPTCHA version ('v2' or 'v3')
   * @param {boolean} config.invisible - For v2: use invisible mode
   * @param {HTMLFormElement} form - The form element
   */
  constructor({ siteKey, validationURL, version = 'v3', invisible = false }, form) {
    super(form);

    if (!siteKey || !validationURL) {
      console.error('Google reCAPTCHA requires a site key and a validation URL.');
      return;
    }

    this.siteKey = siteKey;
    this.validationURL = validationURL;
    this.version = version;
    this.invisible = invisible;
    this.token = null;
    this.widgetId = null; // Used for v2 invisible mode

    this.load();
  }

  /**
   * Load Google reCAPTCHA script and initialize
   */
  load() {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.version === 'v3' ? this.siteKey : 'explicit'}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (this.version === 'v2' && this.invisible) {
        this.createWidget();
      }
    };

    // Create feedback element
    this.setFeedbackElement();
  }

  /**
   * Create a reCAPTCHA widget (only for v2 invisible)
   */
  createWidget() {
    const submitButton = this.form.$el.querySelector('[type="submit"]');
    if (!submitButton) {
      console.error('Submit button not found in the form.');
      return;
    }

    let container = this.form.$el.querySelector('#recaptcha-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      container.style.marginBottom = '1rem'; // Add some space below the widget
      container.style.display = 'none'; // Invisible widget doesn't need to be shown
      submitButton.parentNode.insertBefore(container, submitButton);

      this.widgetId = grecaptcha.render(container, {
        sitekey: this.siteKey,
        size: 'invisible',
        callback: (token) => {
          this.token = token;
        },
        'error-callback': () => {
          this.setError('Captcha validation failed. Please try again.');
        },
      });
    }
  }

  /**
   * Trigger execution of v2 invisible reCAPTCHA
   * @returns {Promise<string>} - The reCAPTCHA token
   */
  executeV2Invisible() {
    return new Promise((resolve) => {
      grecaptcha.execute(this.widgetId).then((token) => {
        this.token = token;
        resolve(token);
      });
    });
  }

  /**
   * Validate the reCAPTCHA token
   * @returns {Promise<boolean>} - Whether validation succeeded
   */
  async validate() {
    if (!this.validationURL) {
      console.warn('Validation URL is not provided. Skipping validation.');
      return true;
    }

    try {
      // Clear previous errors
      this.clearError();

      // Generate token for v3 or execute v2 invisible
      if (this.version === 'v3') {
        if (!window.grecaptcha) {
          this.setError('Captcha script not loaded. Please try again later.');
          return false;
        }
        this.token = await grecaptcha.execute(this.siteKey, { action: 'submit' });
      } else if (this.version === 'v2' && this.invisible) {
        if (!this.widgetId) {
          this.setError('Captcha widget not initialized. Please refresh the page.');
          return false;
        }
        this.token = await this.executeV2Invisible();
      } else {
        this.setError('Unsupported reCAPTCHA version or configuration.');
        return false;
      }

      // Send token to the validation endpoint
      const response = await fetch(this.validationURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token }),
      });

      const result = await response.json();
      if (!result.success) {
        this.setError('Captcha validation failed. Please try again.');
      }

      return result.success;
    } catch (error) {
      console.error('Google reCAPTCHA validation failed:', error);
      this.setError('An error occurred during CAPTCHA validation. Please try again.');
      return false;
    }
  }
}
