import EventTarget from '@lib/EventTarget';
import ConsoleInput from './ConsoleInput';

function escapeHTML(html) {
    let text = document.createTextNode(html);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

class Console extends EventTarget {
    element: HTMLDivElement;
    line: HTMLDivElement;

    constructor() {
        super();
        let container = this.element = document.createElement('div');
        container.className = 'Console';
        this.newLine();
    }

    newLine() {
        let line = this.line = document.createElement('div');
        line.style.display = 'flex';
        this.element.appendChild(line);
    }

    /* Improve this method */
    getNode(item) {
        let element;

        if (item instanceof Error) {
            item = item.name + '\n' + item.stack;
        }

        if (typeof item === 'string') {
            element = document.createElement('span');
            element.innerHTML = escapeHTML(item).split('\n').join('<br/>').split(' ').join('&nbsp;');
        }
        else {
            element = item;
        }

        return element;
    }

    write(item) {
        this.line.appendChild(this.getNode(item));
    }

    writeLine(item) {
        this.write(item);
        this.newLine();
    }

    async read(input = new ConsoleInput) {
        return new Promise((resolve, reject) => {
            this.write(input.element);
            input.element.focus();

            input.on('change', value => {
                input.element.parentNode.replaceChild(this.getNode(value), input.element);
                resolve(value);
            });
        });
    }

    async readLine(text = '$ ') {
        this.write(text);
        let pr = this.read();
        this.newLine();
        return pr;
    }

    log(...items) {
        items.forEach(item => this.writeLine(item));
    }

    async ask(question) {
        let accept;
        while (accept = await this.readLine(question + ' (y/n) ')) {
            if (accept === 'y') {
                return true;
            }
            else if (accept === 'n') {
                return false;
            }
        }
    }
}

export default Console;
