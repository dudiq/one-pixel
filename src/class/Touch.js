const TOUCH_TYPES = {
  touchstart: true,
  touchend: true,
  touchmove: true,
  touchcancel: true,

  MSPointerDown: true,
  MSPointerMove: true,
  MSPointerUp: true,
  MSPointerCancel: true,

  pointerdown: true,
  pointermove: true,
  pointerup: true,
  pointercancel: true,
  pointerleave: true,
};

const C_TOUCH_NORM = 'n';
const C_TOUCH_MS = 'o';
const C_TOUCH_MOUSE = 'a';

function getPointerId(e) {
  if (typeof e.identifier !== 'undefined') return e.identifier;
  return typeof e.pointerId !== 'undefined' ? e.pointerId : 'x1';
}

function getTouchId(touch) {
  return touch ? C_TOUCH_NORM + touch.identifier : '';
}

export default class Touch {
  constructor() {
    this.touchesMap = {};
    this.touchesList = [];
  }

  isEmpty() {
    return this.touchesList.length === 0;
  }

  isFingerOne() {
    return this.touchesList.length === 1;
  }

  getTouchByIndex(index) {
    return this.touchesList[index];
  }

  processTouchByIndex(ev, findIndex, cb) {
    let x;
    let y;
    if (TOUCH_TYPES[ev.type]) {
      const touchId = this.touchesList[findIndex];
      const touches = ev.changedTouches || ev.touches;
      for (let i = 0, l = touches.length; i < l; i++) {
        const checkTouchId = getTouchId(touches[i]);
        if (checkTouchId === touchId) {
          const evTouch = touches[i];
          x = Math.floor(evTouch.pageX);
          y = Math.floor(evTouch.pageY);
          cb(x, y);
          break;
        }
      }
    } else {
      x = ev.offsetX || ev.pageX;
      y = ev.offsetY || ev.pageY;
      cb(x, y);
    }
  }

  /**
   * @private
   * @param touchId
   */
  addTouchId(touchId) {
    if (touchId && !this.touchesMap[touchId]) {
      touchId && this.touchesList.push(touchId);
      this.touchesMap[touchId] = true;
    }
  }

  /**
   * @private
   * @param touchId
   */
  removeTouchId(touchId) {
    if (touchId && this.touchesMap[touchId]) {
      touchId && this.touchesList.pop();
      delete this.touchesMap[touchId];
    }
  }

  collectTouches(ev) {
    this.findTouches(ev, this.addTouchId);
  }

  removeTouches(ev) {
    this.findTouches(ev, this.removeTouchId);
  }

  /**
   * @private
   * @param ev
   * @param cb
   */
  findTouches(ev, cb) {
    let touchId;

    if (TOUCH_TYPES[ev.type]) {
      const changedTouches = ev.changedTouches;
      if (changedTouches) {
        for (let i = 0, l = changedTouches.length; i < l; i++) {
          const touch = changedTouches[i];
          touchId = getTouchId(touch);
          cb.call(this, touchId);
        }
      } else {
        touchId = C_TOUCH_MS + getPointerId(ev);
        cb.call(this, touchId);
      }
    } else {
      touchId = C_TOUCH_MOUSE;
      cb.call(this, touchId);
    }
  }
}
