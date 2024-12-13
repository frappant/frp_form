import Captcha from "@frappant/frp_form/Captcha/Captcha";

export default class MosparoCaptcha extends Captcha {
  /**
   * Initialize Mosparo CAPTCHA
   * @param {Object} config - Configuration options
   * @param {string} config.apiUrl - Verification endpoint
   * @param {string} config.projectKey - Mosparo project key
   * @param {string} config.publicKey - Mosparo public key
   * @param {boolean} config.loadCssResource - Whether to load Mosparo's CSS (default true)
   * @param {HTMLFormElement} form - The form element
   */
  constructor({ apiUrl, projectKey, publicKey, loadCssResource = true, language = '' }, form) {
    super(form);

    if (!apiUrl || !projectKey || !publicKey) {
      console.error('Mosparo requires a API URL, project key, and public key.');
      return;
    }

    this.apiUrl = apiUrl;
    this.projectKey = projectKey;
    this.publicKey = publicKey;
    this.loadCssResource = loadCssResource;
    this.language = language;
    this.$mosparoBox = null;

    this.valid = false;

    this.load();
  }

  /**
   * Load Mosparo script and initialize
   */
  load() {
    const script = document.createElement('script');
    script.src = `${this.apiUrl}/build/mosparo-frontend.js`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      this.createWidget();
    };
  }

  /**
   * Create a Mosparo widget
   */
  createWidget() {
    const submitButton = this.form.$el.querySelector('[type="submit"]');
    if (!submitButton) {
      console.error('Submit button not found in the form.');
      return;
    }

    let $container = this.form.$el.querySelector('#mosparo-box-container');
    if (!$container) {
      $container = document.createElement('div');
      $container.id = 'mosparo-box-container';
      $container.style.marginBottom = '1rem'; // Add some space below the widget
      submitButton.parentNode.insertBefore($container, submitButton);

      this.$mosparoBox = document.createElement('div');
      this.$mosparoBox.id = 'mosparo-box';
      $container.appendChild(this.$mosparoBox);

      // Initialize Mosparo
      new mosparo(
        'mosparo-box',
        this.apiUrl,
        this.projectKey,
        this.publicKey,
        {
          loadCssResource: this.loadCssResource,
          language: this.language,
          onCheckForm: (valid) => {
            this.valid = valid;
            if (valid) {
              this.$mosparoBox.classList.remove('mosparo__invalid');
              this.clearError();
            }
          },
        },
      );

      this.form.$el.setAttribute('novalidate', this.form.options.novalidate);

      // Create feedback element
      this.setFeedbackElement($container);
    }
  }

  /**
   * Create or get the feedback element
   */
  setFeedbackElement($container) {
    if (!this.$feedback) {
      console.log('Creating feedback element');
      this.$feedback = document.createElement('div');
      this.$feedback.classList.add('invalid-feedback', 'captcha-feedback');
      this.$feedback.style.display = 'none'; // Initially hidden
      if ($container) {
        $container.appendChild(this.$feedback);
      }
    }
  }

  /**
   * Validate the Mosparo token
   * @returns {Promise<boolean>} - Whether validation succeeded
   */
  async validate() {
    if (!this.valid) {
      this.setError('Please complete the CAPTCHA to proceed.');
      this.$mosparoBox.classList.add('mosparo__invalid');
      return false;
    }

    this.$mosparoBox.classList.remove('mosparo__invalid');
    this.clearError();
    return true;
  }
}
