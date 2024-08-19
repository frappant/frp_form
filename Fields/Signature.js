import Input from "./Input";
import SignaturePad from 'signature_pad';

export default class Signature extends Input {

    /**
     * Select initialization
     * @param input
     * @param form
     * @param options
     */
    constructor(input, form, options = {}) {
        options.eventListeners = false;
        super(input, form, options);
        this.pad.onEnd = () => this.setValue();
    }

    setup() {
        this.$parent = document.createElement('div');
        this.$parent.id = 'input-signature-' + Date.now()
        this.$parent.style.position = "relative";

        this.$el.parentElement.appendChild(this.$parent);
        this.$parent.appendChild(this.$el);

        if(this.$el.dataset.placeholder) {
            this.$placeholder = document.createElement('span');
            this.$placeholder.id = 'input-signature-placeholder-' + Date.now();
            this.$placeholder.style.position = "absolute";
            this.$placeholder.style.padding = "10px";
            this.$placeholder.style.zIndex = "-1";
            this.$placeholder.innerHTML = this.$el.dataset.placeholder;
            this.$parent.appendChild(this.$placeholder);
        }

        this.$canvas = document.createElement('canvas');
        this.$canvas.style.border = "1px solid black";
        this.$canvas.style.width = "100%";
        this.$canvas.style.height = "330px";
        this.$parent.appendChild(this.$canvas);

        this.$clear = document.createElement('button');
        this.$clear.id = 'input-signature-clear-' + Date.now();
        this.$clear.type = 'button';
        this.$clear.innerHTML = this.$el.dataset.clear ?? '';
        this.$parent.appendChild(this.$clear);

        this.$el.type = 'text';
        this.$el.style.height = '0px';
        this.$el.style.padding = '0px';
        this.$el.style.border = 'none';
        this.$el.style.boxShadow = 'none';

        this.pad = new SignaturePad(this.$canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)',
        });

        this.resizeCanvas();
        this.setEventListeners();

        this.$targetCanvas = document.createElement('canvas');
        this.$targetCanvas.style.width = "33.3333%";
        this.$targetCanvas.style.height = "110px";
        this.resizeTargetCanvas();
    }

    /**
     * Adds focus to the input
     */
    focus(event) {
        this.$el.dispatchEvent(new Event('field:focus:before'));

        this.$label.classList.add('focused');
        this.$el.classList.remove('is-invalid');
        this.$el.classList.add('focused');
        this.$placeholder.style.display = 'none';

        this.$el.dispatchEvent(new Event('field:focus:after'));
    }

    clear() {
        this.$label.classList.remove('focused');
        this.$el.classList.remove('focused');
        this.$placeholder.style.display = 'inline';
        this.pad.clear();
    }

    setEventListeners() {
        this.$clear.addEventListener('click', event => this.clear(event));
        this.pad.addEventListener('beginStroke', event => this.focus(event));
        this.pad.addEventListener('endStroke', event => this.setValue());
    }

    resizeCanvas(clear = true) {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        this.$canvas.width = this.$canvas.offsetWidth * ratio;
        this.$canvas.height = this.$canvas.offsetHeight * ratio;
        this.$canvas.getContext("2d").scale(ratio, ratio);
        if(clear) this.pad.clear(); // otherwise isEmpty() might return incorrect value
    }

    resizeTargetCanvas() {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        this.$targetCanvas.width = this.$canvas.offsetWidth * ratio / 6;
        this.$targetCanvas.height = this.$canvas.offsetHeight * ratio / 6;
        this.$targetCanvas.getContext("2d").scale(ratio, ratio);
    }

    setValue() {

        let canvas = this.$targetCanvas;
        let ctx = canvas.getContext("2d");

        const img = document.createElement('img');
        img.onload = () => {
            // set size proportional to image
            canvas.height = canvas.width * (img.height / img.width);

            // step 1 - resize to 50%
            let oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            // step 1 - resize to 50%
            let oc2 = document.createElement('canvas'),
                octx2 = oc2.getContext('2d');

            oc.width = img.width * 0.5;
            oc.height = img.height * 0.5;
            oc2.width = img.width * 0.5;
            oc2.height = img.height * 0.5;

            octx.drawImage(img, 0, 0, oc.width, oc.height);

            // step 2
            octx2.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

            // step 3, resize to final size
            ctx.drawImage(oc2, 0, 0, oc.width * 0.5, oc.height * 0.5,
                0, 0, canvas.width, canvas.height);

            const img2 = document.createElement('img');
            img2.src = canvas.toDataURL('image/png');
            img2.style.width = "auto"
            //this.$el.parentNode.appendChild(img2);

            this.$el.value = canvas.toDataURL('image/png');
        }

        img.src = this.$canvas.toDataURL('image/png');
        //this.$el.parentNode.appendChild(img);
    }
}