import Input from './Fields/Input';
import Select from "./Fields/Select";
import Checkbox from "./Fields/Checkbox";
import CustomSelect from "./Fields/CustomSelect";
import Signature from "./Fields/Signature";
import Radio from "./Fields/Radio";
import Email from "./Fields/Email";
import Tel from "./Fields/Tel";
import FileUpload from "./Fields/FileUpload";
import Spinner from "./Utilities/Spinner";

export default class Form {

    options = {
        /* callback(event) */
        onSubmit: Function,

        /* callback(event) */
        onSubmitError: Function,

        /* show spinner on submit */
        onSubmitSpinner: false,

        /* shouldn't the form be validated by the browser */
        novalidate: true,

        /* enable custom select */
        customSelect: true,

        /* custom required message */
        customRequired: null,

        /* custom invalid feedback message */
        customFeedback: null,

        /* pushes events into dataLayer */
        tracking: false,

        /* validate initially */
        validateOnLoad: false,

        /* enable submit button when all fields are valid */
        enableSubmitButtonOnValid: false,

        /* The default classes for the input types */
        type: {
            Signature: Signature,
            Checkbox: Checkbox,
            Radio: Radio,
            Email: Email,
            Tel: Tel,
            Select: Select,
            Input: Input,
            FileUpload: FileUpload,
        },

        /* paging (used with powermail) */
        paging: {
            /* enable paging */
            enabled: false,
            /* page selector to select all Pages in a form */
            pageSelector:'',
            /* Button selector to go back one page (invisible on the first page) */
            btnPrevSelector:'',
            /* Button selector to go to the next page (invisible when a submit button is on the page) */
            btnNextSelector:'',
            /* Define the Startpage on load */
            currentStep: 0,
            /* Define a negative offset to avoid header overlay when it is position:fixed */
            scrollOffset: 0,
            /* callback(event) */
            onStepChange: Function
        }
    };


    /**
     * Form initialization
     * @param selector
     * @param options
     */
    constructor(selector, options = {}) {
        const that = this;
        this.selector = selector;
        this.options = Object.assign(this.options, options);

        if(this.options.customSelect) this.options.type.Select = CustomSelect;

        this.errors = false;

        this.$el = document.querySelector(selector);
        if(!this.$el) {
            console.error('FORM DOES NOT EXIST');
            return;
        }

        this.$el.setAttribute('novalidate', this.options.novalidate);
        this.$el.addEventListener('submit', event => this.submitEvent(event))

        this.inputs = {};
        const inputElements = this.$el.querySelectorAll('input:not([type=hidden]):not([type=email]):not([type=tel]):not([readonly]):not([disabled])');
        const hiddenElements = this.$el.querySelectorAll('input[type=hidden]');
        const emailElements = this.$el.querySelectorAll('input[type=email]');
        const telElements = this.$el.querySelectorAll('input[type=tel]');
        const selectElements = this.$el.querySelectorAll('select');
        const textAreaElements = this.$el.querySelectorAll('textarea');

        inputElements.forEach(input => this.initializeInput(input, input.getAttribute("type")));
        hiddenElements.forEach(input => this.initializeInput(input, input.dataset.type));
        emailElements.forEach(input => this.initializeInput(input, input.getAttribute("type")));
        telElements.forEach(input => this.initializeInput(input, input.getAttribute("type")));
        selectElements.forEach(select => this.initializeInput(select, 'select'));
        textAreaElements.forEach(textarea => this.initializeInput(textarea, 'textarea'));

        if(this.options.enableSubmitButtonOnValid) this.toggleSubmitButton();

        if(this.options.paging.enabled) {
            this.paging = {
                pages: null,
                currentStep: 0
            };

            if(this.paging.type == 'powermail') {
              this.paging.pages = this.$el.querySelectorAll(this.options.paging.pageSelector);
            } else {
              // form extension makes paging automatically controlled by PHP
              this.paging.pages = [];
            }

            this.paging.pages.forEach((page, pageIndex) => {

                const pageInputs = page.querySelectorAll('input, select, textarea');
                this.paging.pages[pageIndex].fields = {};

                pageInputs.forEach(field => {
                    if(field.Input) {
                        this.paging.pages[pageIndex].fields[field.id] = field.Input
                    }
                });

                // hide inactive pages
                if(that.paging.currentStep !== pageIndex) {
                    page.style.display = 'none';
                }

                let prevButton = page.querySelector(that.options.paging.btnPrevSelector);
                let nextButton = page.querySelector(that.options.paging.btnNextSelector);

                //add previous button if user is not on first page
                if(pageIndex > 0) {
                    prevButton.style.display = 'inline-block';
                    //add eventlistener to this button
                    prevButton.addEventListener('click', function() {
                        that.changeStep(pageIndex - 1);
                    })
                }

                //add next if no submit button is on current page
                if(page.querySelectorAll("input[type='submit']").length == 0 && pageIndex < that.paging.pages.length) {
                    nextButton.style.display = 'inline-block';
                    nextButton.addEventListener('click', function() {
                        that.changeStep(pageIndex + 1);
                    })
                }

                if(pageIndex == (that.paging.pages.length - 1)) {
                    const submitBtn = page.querySelector('input[type="submit"]');
                    nextButton.style.display = 'inline-block';

                    submitBtn.style = nextButton.getAttribute('style');
                    nextButton.parentNode.replaceChild(submitBtn, nextButton);
                }
            })
        }

        if(this.options.validateOnLoad) {
            this.validate();
        }

        //add event form:initialized
        this.$el.dispatchEvent(new CustomEvent('form:initialized'));
    }

    /**
     * Toggles the submit button
     */
    toggleSubmitButton() {
        const submitButtons = this.$el.querySelectorAll('[type="submit"]');

        const visibleInputs = Object.values(this.inputs).filter(input => input.$el.type !== "hidden");
        const isFormValid = visibleInputs.every(input => input.$el.required ? input.valid : true);

        submitButtons.forEach(button => {
            button.disabled = !isFormValid;
        });
    }


    /**
     * Fires on submit
     * @param event
     */
    submitEvent(event) {
        // show spinner on submit
        if(this.options.onSubmitSpinner) {
            const $submitButton = this.$el.querySelector('[type="submit"]');
            if($submitButton) Spinner.show($submitButton);
        }

        // multistep forms with EXT:form has a button with type submit to go back to the previous page
        if(!event.submitter.classList.contains('btn-cancel')) {
          event.preventDefault();

          this.validate();

          if (!this.errors) {
            this.options.onSubmit(event);
          } else if (this.options.onSubmitError.toString() !== Function.toString()) {
            this.options.onSubmitError(event);
          }

          if (this.errors && this.options.paging.enabled) {
            window.scrollTo({
              top: this.$el - this.options.paging.scrollOffset,
              behavior: 'smooth'
            });
          }
        }
    }

    validate(inputs = null) {
        inputs = inputs ?? this.inputs;

        this.errors = false;
        for (const id in inputs) {
            const input = inputs[id];
            input.validate();
            if(!input.valid && !this.errors) {
                const box = input.$el.getBoundingClientRect();
                this.errors = true;
                window.scrollTo({
                    top: box.top - 100 - input.$label.offsetHeight - input.$feedback.offsetHeight + window.scrollY,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Used to change Page when Paging is enabled
     * @param {int} step
     * @return void
     */
    changeStep(step) {

        if(this.paging.currentStep < step) {
            this.validate(this.paging.pages[this.paging.currentStep].fields);
        }

        if(this.paging.pages[step] && (!this.errors || this.paging.currentStep > step)) {
            // hide current step and display prev or next step
            this.paging.pages.item(this.paging.currentStep).style.display = 'none';
            this.paging.pages.item(step).style.display = 'flex';
            this.paging.currentStep = step;

            // execute event if one is set
            if(this.options.paging.onStepChange.toString() !== Function.toString()) {
                this.options.paging.onStepChange(step);
            }

            // scroll to top of the form
            window.scrollTo({
                top: this.$el.offsetTop - this.options.paging.scrollOffset,
                behavior: 'smooth'
            });

            if(this.options.tracking) this.event('step-change', {step: step+1});
        }
    }

    initializeInput(input, type) {
        if(typeof type !== "undefined" && type !== "hidden") {
            if (typeof input.id === "undefined" || input.id === "") {
                console.error('INPUTS NEED AN ID');
            }
        }

        switch (type) {
            case 'signature':
                this.inputs[input.id] = new this.options.type.Signature(input, this);
                break;
            case 'select':
                this.inputs[input.id] = new this.options.type.Select(input, this);
                break;
            case 'checkbox':
                this.inputs[input.id] = new this.options.type.Checkbox(input, this);
                break;
            case 'radio':
                this.inputs[input.id] = new this.options.type.Radio(input, this);
                break;
            case 'email':
                this.inputs[input.id] = new this.options.type.Email(input, this);
                break;
            case 'tel':
                this.inputs[input.id] = new this.options.type.Tel(input, this);
                break;
            case 'file':
                this.inputs[input.id] = new this.options.type.FileUpload(input, this);
                break;
            default:
                this.inputs[input.id] = new this.options.type.Input(input, this);
                break;
        }

        input.addEventListener('focus', () => this.$el.dispatchEvent(new Event('fields:focus')));
        if(this.options.enableSubmitButtonOnValid) {
            input.addEventListener('field:validated', () => {
                this.toggleSubmitButton();
            });
        }
    }

    /**
     * Return the input value of given input id
     * @param id
     * @returns {*}
     */
    get(id) {
        return this.inputs[id].value;
    }

    /**
     * Hides the form
     */
    hide() {
        this.$el.classList.add('hidden');
    }

    event(name, attributes) {
        dataLayer.push({
            event: name,
            ...attributes
        })
    }
}
