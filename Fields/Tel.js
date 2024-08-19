import Input from "./Input";
import TomSelect from "tom-select";

export default class Tel extends Input {

    /**
     * Select initialization
     * @param tel
     * @param form
     * @param options
     */
    constructor(tel, form, options = {}) {
        super(tel, form, options);
    }
}
