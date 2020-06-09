export default class Container {
  constructor(context) {
    this.context = context;
    const config = context.config;

    const childElement = document.createElement('div');
    childElement.style = 'position:absolute; left:0; right:0; top:0; bottom:0; overflow:hidden;';
    this.childElement = childElement;

    this.appendTo(config.container);

    this.meta = {
      w: 0,
      h: 0,
    };
    this.recalc();
  }

  appendTo(el) {
    const buffer = typeof el === 'string' ? document.querySelector(el) : el;
    this.buffer = buffer || document.createDocumentFragment();
    buffer.appendChild(this.childElement);
  }

  getPlace() {
    return this.childElement;
  }

  recalc() {
    this.meta.w = this.buffer.clientWidth;
    this.meta.h = this.buffer.clientHeight;
  }

  getWidth() {
    return this.meta.w;
  }

  getHeight() {
    return this.meta.h;
  }

  destroy() {
    const node = this.buffer;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
}
