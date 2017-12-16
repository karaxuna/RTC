import EventTarget from '@lib/EventTarget';

class ConsoleInput extends EventTarget {
    element;

    constructor() {
        super();

        let self = this;
        let input = this.element = document.createElement('input');
        input.className = 'ConsoleInput';
        input.spellcheck = false;
        input.placeholder = 'Type here...';
        
        input.addEventListener('change', function () {
            self.trigger('change', this.value);
        });
    }
}

export default ConsoleInput;
