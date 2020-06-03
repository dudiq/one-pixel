function getWindowScrollX() {
  const ret = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
  return ret;
}

function getWindowScrollY() {
  const ret = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  return ret;
}

export default class Mouse {
  constructor(context) {
    this.context = context;
    const element = context.element;
    this.element = element;
    this.events = context.radio.events('mouse', {
      start: 'start',
      stop: 'stop',
      move: 'move',
    });
    this.currentPoint = {
      x: 0,
      y: 0,
      totalTouches: 0,
    };
    this.currentClip = {};
    this.addEvents(element);
  }

  updateCurrentPoint(ev) {
    let lastX;
    let lastY;
    const touches = ev.changedTouches || ev.touches;
    const evTouch = touches && touches[0];

    if (evTouch) {
      lastX = Math.floor(evTouch.pageX);
      lastY = Math.floor(evTouch.pageY);
    } else {
      lastX = ev.offsetX || ev.pageX;
      lastY = ev.offsetY || ev.pageY;
    }

    this.currentPoint.x = lastX;
    this.currentPoint.y = lastY;
    // this.currentPoint.totalTouches = touches.length;
    // console.log(touches.length);
  }

  onMouseStart = ev => {
    this.updateCurrentPoint(ev);
    this.context.radio.trig(this.events.start, this.currentPoint);
  };

  onMouseMove = ev => {
    this.updateCurrentPoint(ev);
    this.context.radio.trig(this.events.move, this.currentPoint);
  };

  onMouseEnd = ev => {
    this.updateCurrentPoint(ev);
    this.context.radio.trig(this.events.stop, this.currentPoint);
  };

  addEvents() {
    this.element.addEventListener('touchstart', this.onMouseStart, false);
    this.element.addEventListener('mousedown', this.onMouseStart, false);
    this.element.addEventListener('mousemove', this.onMouseMove, false);
    this.element.addEventListener('touchmove', this.onMouseMove, false);
    this.element.addEventListener('mouseup', this.onMouseEnd, false);
    this.element.addEventListener('touchend', this.onMouseEnd, false);
    this.element.addEventListener('mouseleave', this.onMouseEnd, false);
    this.element.addEventListener('touchleave', this.onMouseEnd, false);
  }

  removeEvents() {
    this.element.removeEventListener('touchstart', this.onMouseStart, false);
    this.element.removeEventListener('mousedown', this.onMouseStart, false);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('touchmove', this.onMouseMove, false);
    this.element.removeEventListener('mouseup', this.onMouseEnd, false);
    this.element.removeEventListener('touchend', this.onMouseEnd, false);
    this.element.removeEventListener('mouseleave', this.onMouseEnd, false);
    this.element.removeEventListener('touchleave', this.onMouseEnd, false);
  }

  destroy() {
    this.removeEvents();
  }
}
