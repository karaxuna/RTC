import EventTarget from '@lib/EventTarget';

function Bash(container) {
    var self = this;
    self.container = container;
    EventTarget.call(self);

    // Add class
    container.className = 'bash';

    // Add command input
    var cmdInputContainer = self.cmdInputContainer = document.createElement('div');
    cmdInputContainer.className = 'bash-input';
    container.appendChild(cmdInputContainer);

    var cmdInput = self.cmdInput = document.createElement('input');
    cmdInput.type = 'text';
    cmdInput.placeholder = 'Type here...';
    cmdInput.spellcheck = false;
    cmdInputContainer.appendChild(cmdInput);

    // Listen for command
    cmdInput.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            self.trigger('stdin', this.value);
            this.value = null;
        }
    });
}

// Inherit from EventTarget
Bash.prototype.__proto__ = EventTarget.prototype;

// Methods
Bash.prototype.write = function (command) {
    var self = this,
        container = self.container,
        cmdInputContainer = self.cmdInputContainer;

    var cmdText = typeof command === 'string' ? createSpan(command) : command;
    container.insertBefore(cmdText, cmdInputContainer);
    window.scrollTo(0, document.body.scrollHeight);
};

function createSpan(text) {
    var span = document.createElement('span');
    text = escapeHtml(text);
    text = replaceAll(text, ' ', '&nbsp;');
    text = replaceAll(text, '\n', '<br/>');
    span.innerHTML = text;
    return span;
}

function escapeHtml(html) {
    var text = document.createTextNode(html);
    var div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function replaceAll(text, a, b) {
    while (text.indexOf(a) !== -1) {
        text = text.replace(a, b);
    }
    return text;
}

export default Bash;
