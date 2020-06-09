export default class Container {
  constructor(context) {
    this.context = context;
    const config = context.config;

    const childElement = document.createElement('div');
    childElement.style = 'position:absolute; left:0; right:0; top:0; bottom:0; overflow:hidden;';
    this.childElement = childElement;

    this.appendTo(config.container);
  }

  appendTo(el) {
    const buffer = typeof el === 'string' ? document.querySelector(el) : el;
    this.buffer = buffer || document.createDocumentFragment();
    buffer.appendChild(this.childElement);
  }

  getPlace() {
    return this.childElement;
  }

  getWidth() {
    return this.buffer.clientWidth;
  }

  getHeight() {
    return this.buffer.clientHeight;
  }

  destroy() {
    const node = this.buffer;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
}
