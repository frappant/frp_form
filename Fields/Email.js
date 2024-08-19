import Input from "./Input";
import TomSelect from "tom-select";

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
