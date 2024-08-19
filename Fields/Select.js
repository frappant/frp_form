import Input from "./Input";

export default class Select extends Input {

    /**
     * Select initialization
     * @param select
     * @param form
     * @param options
     */
    constructor(select, form, options = {}) {
        super(select, form, options);
    }
}
