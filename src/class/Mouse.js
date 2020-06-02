const CLIP_WIDTH = 3;

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
    };
    this.currentClip = {};
    this.addEvents(element);
  }

  init() {
    this.currentClip = this.context.bbox.createBbox();
    this.currentClip.w = CLIP_WIDTH * 2;
    this.currentClip.h = CLIP_WIDTH * 2;
  }

  updateCurrentPoint(ev) {
    let lastX;
    let lastY;
    const evTouch = (ev.changedTouches && ev.changedTouches[0])
      || (ev.touches && ev.touches[0]);

    if (evTouch) {
      lastX = Math.floor(evTouch.pageX - this.element.offsetLeft);
      lastY = Math.floor(evTouch.pageY - this.element.offsetTop);
    } else {
      lastX = ev.offsetX || ev.pageX - this.element.offsetLeft;
      lastY = ev.offsetY || ev.pageY - this.element.offsetTop;
    }

    const currentClip = this.currentClip;
    currentClip.minx = lastX - CLIP_WIDTH;
    currentClip.maxx = lastX + CLIP_WIDTH;
    currentClip.miny = lastY - CLIP_WIDTH;
    currentClip.maxy = lastY + CLIP_WIDTH;
    this.currentPoint.x = lastX;
    this.currentPoint.y = lastY;
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
