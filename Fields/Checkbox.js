import Input from "./Input";

export default class Checkbox extends Input {

  /**
   * Select initialization
   * @param checkbox
   * @param form
   * @param options
   */
  constructor(checkbox, form, options = {}) {
    super(checkbox, form, options);
  }

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

        if (this.$feedback && !this.$feedback.innerHTML) {
          this.$feedback.innerHTML = this.$el.validationMessage;
        }
        this.valid = false;

        this.$el.dispatchEvent(new Event('field:error'));
      } else {

        this.elements.forEach($el => {
          $el.classList.remove('is-invalid');
        });

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
    if (this.$el.checked) {
      this.$label.classList.add('focused');
      this.$el.classList.add('focused');
    } else {
      this.$label.classList.remove('focused');
      this.$el.classList.remove('focused');
    }
  }


  setEventListeners() {
    this.$el.addEventListener('click', event => this.focus(event));
    this.$el.addEventListener('change', event => this.validate(event));
  }



  /**
   * Setting the feedback element
   */
  setFeedbackElement() {
    //get all inputs with the same name
    this.elements = document.querySelectorAll('input[name="' + this.$el.name + '"]');
    this.$lastEl = this.elements[this.elements.length - 1];

    this.$feedback = this.findClosest(this.$el, '.invalid-feedback', 0);

    if (!this.$feedback) {
      this.$feedback = document.createElement('div');
      this.$feedback.classList.add('invalid-feedback');
      if (this.form.options.customRequired) this.$feedback.innerHTML = this.form.options.customRequired;

      this.$lastEl.parentNode.appendChild(this.$feedback);
    }
  }
}
