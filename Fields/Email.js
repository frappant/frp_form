import Input from "./Input";

export default class Email extends Input {

    /**
     * Select initialization
     * @param email
     * @param form
     * @param options
     */
    constructor(email, form, options = {}) {
        super(email, form, options);
    }
}
