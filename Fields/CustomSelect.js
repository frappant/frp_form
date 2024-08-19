import Input from "./Input";
import TomSelect from "tom-select";

export default class CustomSelect extends Input {

    /**
     * Select initialization
     * @param select
     * @param form
     * @param options
     */
    constructor(select, form, options = {}) {
        options.eventListeners = false;
        super(select, form, options);
        if(select.dataset.value) {
            const option = select.querySelector('option[value="' + select.dataset.value + '"]');
            option.selected = true;
        }
        this.customSelect = new TomSelect(select, {
            placeholder: select.dataset.placeholder,
            create: false,
            onFocus: event => this.focus(event),
            onBlur: event => this.blur(event),
            onChange: value => this.change(),
            maxOptions: 999999,
            render:{
                no_results:null,
            }
        });

        const selectionMessage = this.form.$el.dataset.selection;
        this.$feedback.innerHTML = selectionMessage ?? this.$feedback.innerHTML;
        //this.customSelect.control_input.setAttribute('disabled', true)

        if(this.customSelect.settings.maxItems === 1) {
            this.setCustomPlaceholder(select.dataset.placeholder);
        }
    }

    validate() {
        this.value = this.$el.value;

        if(this.$el.required || this.value.length) {
            if (!this.$el.checkValidity() || !this.$el.value) {
              this.$el.classList.add('is-invalid');
              this.$el.classList.remove('is-valid');
              if (this.$feedback && !this.$feedback.innerHTML) {
                this.$feedback.innerHTML = this.$el.validationMessage ? this.$el.validationMessage : this.customSelect.control_input.validationMessage;
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

    focus(event) {
        if(document.activeElement === this.customSelect.control_input || document.activeElement === this.$label || this.$el.value.length) {
            this.$label.classList.add('focused');
            this.customSelect.wrapper.classList.add('focused');
        } else {
            this.$label.classList.remove('focused');
            this.customSelect.wrapper.classList.remove('focused');
        }
    }

    blur(event) {
        if(this.$el.value.length) this.$el.classList.remove('is-invalid');
        this.focus(event)

        this.validate();
    }

    change() {
        if(this.customSelect.settings.maxItems === 1 && this.$el.value != 0) {
            this.customSelect.placeholder_element.remove();
        }
    }

    /**
     * Because mobile it opens the keyboard
     * Also only executes if the select is not a multiple select
     */
    setCustomPlaceholder(placeholder) {
        // take the placeholder from the select element and create new element to replace control_input
        const placeholderElement = document.createElement('div');
        placeholderElement.classList.add('placeholder');
        placeholderElement.style.backgroundColor = 'transparent';
        placeholderElement.style.fontWeight = 'normal';
        placeholderElement.innerHTML = placeholder;

        this.customSelect.control_input.before(placeholderElement);
        this.customSelect.control_input.remove();
        this.customSelect.placeholder_element = placeholderElement;
    }
}
