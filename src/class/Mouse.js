export default class Mouse {
  constructor(context, element) {
    this.context = context;
    this.element = element;
    this.events = context.radio.events('mouse', {
      start: 'start',
      stop: 'stop',
      move: 'move',
    });
    this.addEvents(element);
  }

  getPosition(ev) {
    let lastX;
    let lastY;
    if (ev.touches) {
      const evTouch = ev.touches[0];
      lastX = Math.floor(evTouch.pageX - this.element.offsetLeft);
      lastY = Math.floor(evTouch.pageY - this.element.offsetTop);
    } else {
      lastX = ev.offsetX || ev.pageX - this.element.offsetLeft;
      lastY = ev.offsetY || ev.pageY - this.element.offsetTop;
    }

    return {
      x: lastX,
      y: lastY,
    };
  }

  onMouseStart = ev => {
    const point = this.getPosition(ev);
    this.context.radio.trig(this.events.start, point);
  };

  onMouseMove = ev => {
    const point = this.getPosition(ev);

    this.context.radio.trig(this.events.move, point);
  };

  onMouseEnd = ev => {
    const point = this.getPosition(ev);
    this.context.radio.trig(this.events.stop, point);
  };

  addEvents() {
    this.element.addEventListener('touchstart', this.onMouseStart, false);
    this.element.addEventListener('mousedown', this.onMouseStart, false);
    this.element.addEventListener('mousemove', this.onMouseMove, false);
    this.element.addEventListener('touchmove', this.onMouseMove, false);
    this.element.addEventListener('mouseup', this.onMouseEnd, false);
    this.element.addEventListener('touchend', this.onMouseEnd, false);
  }

  removeEvents() {
    this.element.removeEventListener('touchstart', this.onMouseStart, false);
    this.element.removeEventListener('mousedown', this.onMouseStart, false);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('touchmove', this.onMouseMove, false);
    this.element.removeEventListener('mouseup', this.onMouseEnd, false);
    this.element.removeEventListener('touchend', this.onMouseEnd, false);
  }

  destroy() {
    this.removeEvents();
  }
}
