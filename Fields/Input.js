export default class Input {

    options = {
        /* should the label be focused */
        eventListeners: true,
    };

    /**
     * Input initialization
     * @param input
     * @param form
     * @param options
     */
    constructor(input, form, options = {}) {
        this.$el = input;
        this.form = form;
        this.options = Object.assign(this.options, options);
        this.$el.Input = this;
        this.max = this.$el.max

        this.setup();

        this.$label = this.findClosest(this.$el, 'label');
        this.setFeedbackElement();
        if (this.form.options.customRequired || this.$el.dataset.customvalidity) {
            this.feedbackMessage = this.form.options.customRequired ? this.form.options.customRequired : this.$feedback.innerHTML;
            this.feedbackMessage = this.$el.dataset.customvalidity ? this.$el.dataset.customvalidity : this.feedbackMessage;
        }

        this.valid = this.$el.checkValidity();
        this.valid = this.valid ? this.valid : !this.$el.required;
        this.value = input.value;
        this.data = input.dataset;

        if (this.options.eventListeners) this.setEventListeners();
    }

    /**
     * Validates the Input
     */
    validate() {
        this.value = this.$el.value;
        if (this.$el.required || this.value.length) {
            this.value.length;
            this.$el.setCustomValidity('');
            if (!this.$el.checkValidity()) {
                if (this.$el.dataset.customvalidity) {
                    this.$el.setCustomValidity(this.$el.dataset.customvalidity);
                }
                this.$el.classList.add('is-invalid');
                this.$el.classList.remove('is-valid');
                if (this.$feedback && !this.$feedback.innerHTML) {
                    this.$feedback.innerHTML = this.$el.validationMessage;
                }
                this.valid = false;

                this.$el.dispatchEvent(new Event('field:error'));
            } else {
                this.$el.classList.remove('is-invalid');
                this.$el.classList.add('is-valid');
                this.valid = true;

                this.$el.dispatchEvent(new Event('field:success'));
            }
        }

        this.$el.dispatchEvent(new Event('field:validated'));
    }

    /**
     * Adds focus to the input
     */
    focus(event) {
        this.$el.dispatchEvent(new Event('field:focus:before'));

        if (document.activeElement === this.$el || this.$el.value.length) {
            this.$label.classList.add('focused');
            this.$el.classList.add('focused');
        } else {
            this.$label.classList.remove('focused');
            this.$el.classList.remove('focused');
        }

        this.$el.dispatchEvent(new Event('field:focus:after'));
    }

    blur(event) {
        this.focus(event);
        this.$feedback.innerHTML = this.$el.value.length ? this.form.options.customFeedback : this.feedbackMessage;
        this.validate();
    }

    /**
     * Setting all Eventlisteners
     */
    setEventListeners() {
        this.$el.addEventListener('focus', event => this.focus(event));
        this.$el.addEventListener('focusout', event => this.blur(event));
        this.$el.addEventListener('change', event => this.validate(event));
    }

    /**
     * Setting the feedback element
     */
    setFeedbackElement() {
        this.$feedback = this.findClosest(this.$el, '.invalid-feedback', 0);

        if (!this.$feedback) {
            this.$feedback = document.createElement('div');
            this.$feedback.classList.add('invalid-feedback');
            if (this.form.options.customRequired) this.$feedback.innerHTML = this.form.options.customRequired;
            this.$el.parentNode.appendChild(this.$feedback);
        }
    }

    /**
     * Looks for the closest target element
     * @param sourceElement
     * @param targetSelector
     * @param levels
     * @returns {null|any}
     */
    findClosest(sourceElement, targetSelector, levels = 5) {
        const parentElement = sourceElement.parentElement;
        const targetElement = parentElement.querySelector(targetSelector);

        if (targetElement) return targetElement;
        if (levels >= 0) return this.findClosest(parentElement, targetSelector, levels - 1);
        return null
    }

    setError(message) {
        this.$feedback.innerHTML = message;
    }

    /**
     * A function that can be used to setup custom fields
     */
    setup(){};
}
