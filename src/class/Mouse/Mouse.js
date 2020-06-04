import Touches from './Touches';

const THRESHOLD_MOVE = 2;

function getWindowScrollX() {
  const ret = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
  return ret;
}

function getWindowScrollY() {
  const ret = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  return ret;
}

function preventEvent(e) {
  e.preventManipulation && e.preventManipulation(); // ie10
  e.preventDefault && e.preventDefault(); // others browsers
}

function inThreshold(x, y, startX, startY) {
  return (
    Math.abs(x - startX) > THRESHOLD_MOVE
    || Math.abs(y - startY) > THRESHOLD_MOVE
  );
}

export default class Mouse {
  constructor(context) {
    this.context = context;
    const element = context.element;
    this.element = element;

    this.touches = new Touches();

    this.events = context.radio.events('mouse', {
      onStart: 'onStart',
      onStop: 'onStop',
      onMove: 'onMove',
      onWheel: 'onWheel',
      onGestureStart: 'onGestureStart',
      onGestureMove: 'onGestureMove',
    });

    this.isDown = false;
    this.isMouseEvents = true;

    this.pointFirst = {
      x: 0,
      y: 0,
    };

    this.pointSecond = {
      x: 0,
      y: 0,
    };

    this.pointStart = {
      x: 0,
      y: 0,
      downId: null,
    };

    this.addEvents(element);
  }

  /**
   * @private
   * @param {Event} ev
   */
  updatePoints(ev) {
    this.touches.processTouchByIndex(ev, 0, this.setPointFirst);
    this.touches.processTouchByIndex(ev, 1, this.setPointSecond);
  }

  setPointFirst = (x, y) => {
    this.pointFirst.x = x;
    this.pointFirst.y = y;
    this.pointSecond.x = x;
    this.pointSecond.y = y;
  };

  setPointSecond = (x, y) => {
    this.pointSecond.x = x;
    this.pointSecond.y = y;
  };

  onMouseStart = ev => {
    preventEvent(ev);
    this.touches.collectTouches(ev);
    this.updatePoints(ev);
    this.startPointAdd();
    this.isDown = true;
  };

  onMouseMove = ev => {
    preventEvent(ev);
    this.updatePoints(ev);

    if (this.isDown) {
      this.isMouseEvents
        && this.context.radio.trig(this.events.onStart, this.pointFirst);
    }

    this.isMouseEvents
      && this.context.radio.trig(this.events.onMove, this.pointFirst);
  };

  onMouseEnd = ev => {
    preventEvent(ev);
    this.updatePoints(ev);
    this.startPointRemove();

    this.touches.removeTouches(ev);
    if (this.touches.isEmpty()) {
      this.isDown = false;
      this.isMouseEvents
        && this.context.radio.trig(this.events.onStop, this.pointFirst);
    }
  };

  onGestureStart = ev => {
    preventEvent(ev);
    this.isMouseEvents = false;
    this.context.radio.trig(this.events.onGestureStart, ev.pageX, ev.pageY);
  };

  onGestureChange = ev => {
    preventEvent(ev);
    this.context.radio.trig(
      this.events.onGestureStart,
      ev.scale,
      ev.pageX,
      ev.pageY,
    );
  };

  onGestureEnd = ev => {
    preventEvent(ev);
    this.isMouseEvents = true;
  };

  onWheel = ev => {
    preventEvent(ev);
    const isScale = ev.ctrlKey || ev.metaKey;
    const scaleDx = isScale ? ev.deltaY * 0.01 : 0;
    const posX = isScale ? 0 : ev.deltaX * 2;
    const posY = isScale ? 0 : ev.deltaY * 2;

    this.context.radio.trig(this.events.onWheel, scaleDx, posX, posY);
  };

  startPointAdd() {
    if (this.pointStart.downId) return;
    this.pointStart.downId = this.touches.touchesList[0];
    this.pointStart.x = this.pointFirst.x;
    this.pointStart.y = this.pointFirst.y;
  }

  startPointRemove() {
    if (!this.pointStart.downId) return;
    if (this.pointStart.downId !== this.touches.touchesList[0]) return;
    this.pointStart.downId = null;
    this.pointStart.x = 0;
    this.pointStart.y = 0;
  }

  addEvents() {
    this.element.addEventListener('touchstart', this.onMouseStart, false);
    this.element.addEventListener('touchmove', this.onMouseMove, false);
    this.element.addEventListener('touchend', this.onMouseEnd, false);
    this.element.addEventListener('touchleave', this.onMouseEnd, false);
    this.element.addEventListener('touchcancel', this.onMouseEnd, false);

    this.element.addEventListener('mousedown', this.onMouseStart, false);
    this.element.addEventListener('mousemove', this.onMouseMove, false);
    this.element.addEventListener('mouseup', this.onMouseEnd, false);
    this.element.addEventListener('mouseleave', this.onMouseEnd, false);

    window.addEventListener('gesturestart', this.onGestureStart, {
      passive: false,
    });
    window.addEventListener('gesturechange', this.onGestureChange, {
      passive: false,
    });
    window.addEventListener('gestureend', this.onGestureEnd, {
      passive: false,
    });
    window.addEventListener('wheel', this.onWheel, { passive: false });
  }

  removeEvents() {
    this.element.removeEventListener('touchstart', this.onMouseStart, false);
    this.element.removeEventListener('touchmove', this.onMouseMove, false);
    this.element.removeEventListener('touchend', this.onMouseEnd, false);
    this.element.removeEventListener('touchleave', this.onMouseEnd, false);
    this.element.removeEventListener('touchcancel', this.onMouseEnd, false);

    this.element.removeEventListener('mousedown', this.onMouseStart, false);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('mouseup', this.onMouseEnd, false);
    this.element.removeEventListener('mouseleave', this.onMouseEnd, false);

    window.removeEventListener('gesturestart', this.onGestureStart);
    window.removeEventListener('gesturechange', this.onGestureChange);
    window.removeEventListener('gestureend', this.onGestureEnd);
    window.removeEventListener('wheel', this.onWheel);
  }

  destroy() {
    this.removeEvents();
  }
}
