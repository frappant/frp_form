import Input from "./Input";
import Checkbox from "./Checkbox";

export default class Radio extends Checkbox {

    /**
     * Select initialization
     * @param radio
     * @param form
     * @param options
     */
    constructor(radio, form, options = {}) {
        options.eventListeners = false;
        super(radio, form, options);
        this.$label = this.findClosest(this.$el, 'label:not(input ~ label):not(label ~ input)');
        this.setEventListeners()
    }



    /**
     * Adds focus to the input
     */
    focus(event) {
        const allRadios = this.$el.parentNode.querySelectorAll('input[type="radio"]');
        allRadios.forEach(radio => {
            radio.classList.remove('is-invalid');
        })

        if(this.$el.checked) {
            this.$label.classList.add('focused');
            this.$el.classList.add('focused');
        } else {
            this.$label.classList.remove('focused');
            this.$el.classList.remove('focused');
        }
    }
}