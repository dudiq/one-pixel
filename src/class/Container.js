export default class Container {
  constructor(context) {
    this.context = context;
    const config = context.config;

    const buffer = typeof config.container === 'string'
      ? document.querySelector(config.container)
      : config.container;
    this.buffer = buffer;

    const childElement = document.createElement('div');
    childElement.style = 'position:absolute; left:0; right:0; top:0; bottom:0; overflow:hidden;';
    buffer.appendChild(childElement);

    let helper;
    if (config.showHelper) {
      helper = document.createElement('div');
      helper.style = 'position:absolute; top:0; right:0; border:1px solid gray;display:inline-block;';
      buffer.appendChild(helper);
      // TODO: move helper to separated class
      context.register('helper', helper);
    }
  }

  getPlace() {
    return this.buffer;
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
