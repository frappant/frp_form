import Input from "./Input";

export default class fileUpload extends Input {

    /**
     * Select initialization
     * @param fileUpload
     * @param form
     * @param options
     */
    constructor(fileUpload, form, options = {}) {
        super(fileUpload, form, options);

        const selectionMessage = this.form.$el.dataset.upload;
        this.$feedback.innerHTML = selectionMessage ?? this.$feedback.innerHTML;
        const maxFileSize = this.$el.dataset.maxfilesize;
        const maxNumOfFiles = this.$el.dataset.maxnumoffiles;

        this.maxNumOfFiles = maxNumOfFiles || 10;
        this.maxFileSize = maxFileSize || 10000000 // 100mb
    }



    checkNumUploadedFiles(filelist) {
        let validNumFileList = true;
        if (filelist.length > this.maxNumOfFiles) {
            validNumFileList = false;
        }
        return validNumFileList;
    }

    checkMaxAccumulatedFileSize(filelist) {
        let validAccumulatedFileSize = true;
        let accumulatedFileSize = 0;
        for (let i = 0; i < filelist.length; i++) {
            accumulatedFileSize += filelist[i].size;
        }
        if(accumulatedFileSize > this.maxFileSize) {
            validAccumulatedFileSize = false;
        }
        return validAccumulatedFileSize;
    }

    /**
     * Validates the Input
     */
    validate(e) {
        let filelist = this.$el.files;
        if(!this.$el.checkValidity()) {
            this.$el.classList.add('is-invalid');
            this.$el.classList.remove('is-valid');
            if(this.$feedback && !this.$feedback.innerHTML) {
                this.$feedback.innerHTML = this.$el.validationMessage;
            }
            this.valid = false;
            this.$el.dispatchEvent(new Event('field:error'));
        }else if (!this.checkNumUploadedFiles(filelist) || !this.checkMaxAccumulatedFileSize(filelist)) {
            this.$el.classList.add('is-invalid');
            this.$el.classList.remove('is-valid');
            this.$feedback.innerHTML = this.$el.dataset.uploadfilesizefeedback;
            this.$el.value = "";
            this.valid = false;
        } else {
            this.$el.classList.remove('is-invalid');
            this.valid = true;

            this.$el.dispatchEvent(new Event('field:success'));
        }

        this.$el.dispatchEvent(new Event('field:validated'));
    }
}
