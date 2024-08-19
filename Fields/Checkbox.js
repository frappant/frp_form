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


    /**
     * Adds focus to the input
     */
    focus(event) {
        if(this.$el.checked) {
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
}
