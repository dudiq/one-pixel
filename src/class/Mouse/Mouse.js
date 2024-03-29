const THRESHOLD_MOVE = 2;

function preventEvent(e) {
  e.preventManipulation && e.preventManipulation(); // ie10
  e.preventDefault && e.preventDefault(); // others browsers
}

function inThreshold(p1, p2) {
  return (
    Math.abs(p1.x - p2.x) > THRESHOLD_MOVE
    || Math.abs(p1.y - p2.y) > THRESHOLD_MOVE
  );
}

export default class Mouse {
  constructor(context) {
    this.context = context;

    this.hooks = context.hook.createHooks({
      onStart: 'onStart',
      onStop: 'onStop',
      onMove: 'onMove',
      onDragZoomStart: 'onDragZoomStart',
      onDragZoom: 'onDragZoom',
      onDragZoomEnd: 'onDragZoomEnd',
      onWheel: 'onWheel',
    });

    this.isDown = false;
    this.isMoved = false;
    this.isFirstMove = false;
    this.isDragAndZoom = false;
    this.isMiddleButton = false;

    this.pointFirst = {
      x: 0,
      y: 0,
    };

    this.pointSecond = {
      x: 0,
      y: 0,
    };

    this.pointInitFirst = {
      x: 0,
      y: 0,
      downId: null,
    };

    this.pointInitSecond = {
      x: 0,
      y: 0,
    };

    this.addEvents();
  }

  /**
   * @private
   * @param {Event} ev
   */
  updatePoints(ev) {
    this.isMiddleButton = ev.button === 1 || ev.which === 2;
    this.context.touch.processTouchByIndex(ev, 0, this.setPointFirst);
    this.context.touch.processTouchByIndex(ev, 1, this.setPointSecond);
  }

  setPointFirst = (x, y) => {
    this.pointFirst.x = x;
    this.pointFirst.y = y;
  };

  setPointSecond = (x, y) => {
    this.pointSecond.x = x;
    this.pointSecond.y = y;
  };

  onMouseStart = ev => {
    preventEvent(ev);
    this.context.touch.collectTouches(ev);
    this.updatePoints(ev);
    this.startPointAdd();
    if (ev.which === 3 || ev.button === 2) return;
    this.isDown = true;
  };

  onMouseMove = ev => {
    preventEvent(ev);
    this.updatePoints(ev);

    if (this.isDown && !this.isMoved) {
      if (inThreshold(this.pointFirst, this.pointInitFirst)) {
        this.isMoved = true;
      }
    }
    if (!this.isMoved) return;

    if (
      !this.isDragAndZoom
      && (this.isMiddleButton || !this.context.touch.isFingerOne())
    ) {
      this.isDragAndZoom = true;
      this.hooks.onDragZoomStart();
    }

    if (this.isDragAndZoom) {
      // do pitch and zoom
      this.isFirstMove && this.finishOnEnd();
      this.hooks.onDragZoom();
    }

    if (this.isDragAndZoom) return;

    this.trigOnStart();

    this.hooks.onMove(this.pointFirst);
    this.isMoved && (this.isFirstMove = true);
  };

  trigOnStart() {
    if (this.isDown && !this.isFirstMove) {
      this.hooks.onStart(this.pointFirst);
    }
  }

  finishOnEnd() {
    this.isDown = false;
    this.isMoved = false;
    this.isFirstMove = false;
    this.hooks.onStop(this.pointFirst);
  }

  onMouseEnd = ev => {
    preventEvent(ev);
    this.updatePoints(ev);
    this.startPointRemove();

    this.context.touch.removeTouches(ev);
    if (this.context.touch.isEmpty()) {
      this.finishDrag();
      this.finishOnEnd();
    }
  };

  finishDrag() {
    if (this.isDragAndZoom) {
      this.hooks.onDragZoomEnd();
    }
    this.isDragAndZoom = false;
  }

  onWheel = ev => {
    preventEvent(ev);
    this.updatePoints(ev);
    const isScale = ev.ctrlKey || ev.metaKey;
    const scaleDx = isScale ? ev.deltaY * 0.01 : 0;
    const posX = isScale ? 0 : ev.deltaX * 2;
    const posY = isScale ? 0 : ev.deltaY * 2;

    this.hooks.onWheel(scaleDx, posX, posY, ev.clientX, ev.clientY);
  };

  startPointAdd() {
    if (this.pointInitFirst.downId) return;
    this.pointInitFirst.downId = this.context.touch.getTouchByIndex(0);
    this.pointInitFirst.x = this.pointFirst.x;
    this.pointInitFirst.y = this.pointFirst.y;
  }

  startPointRemove() {
    if (!this.pointInitFirst.downId) return;
    if (this.pointInitFirst.downId !== this.context.touch.getTouchByIndex(0)) return;
    this.pointInitFirst.downId = null;
    this.pointInitFirst.x = 0;
    this.pointInitFirst.y = 0;
  }

  addEvents() {
    const element = this.context.container.getPlace();

    element.addEventListener('touchstart', this.onMouseStart, false);
    element.addEventListener('touchmove', this.onMouseMove, false);
    element.addEventListener('touchend', this.onMouseEnd, false);
    element.addEventListener('touchleave', this.onMouseEnd, false);
    element.addEventListener('touchcancel', this.onMouseEnd, false);

    element.addEventListener('mousedown', this.onMouseStart, false);
    element.addEventListener('mousemove', this.onMouseMove, false);
    element.addEventListener('mouseup', this.onMouseEnd, false);
    element.addEventListener('mouseleave', this.onMouseEnd, false);

    window.addEventListener('wheel', this.onWheel, { passive: false });
  }

  removeEvents() {
    const element = this.context.container.getPlace();

    element.removeEventListener('touchstart', this.onMouseStart, false);
    element.removeEventListener('touchmove', this.onMouseMove, false);
    element.removeEventListener('touchend', this.onMouseEnd, false);
    element.removeEventListener('touchleave', this.onMouseEnd, false);
    element.removeEventListener('touchcancel', this.onMouseEnd, false);

    element.removeEventListener('mousedown', this.onMouseStart, false);
    element.removeEventListener('mousemove', this.onMouseMove, false);
    element.removeEventListener('mouseup', this.onMouseEnd, false);
    element.removeEventListener('mouseleave', this.onMouseEnd, false);

    window.removeEventListener('wheel', this.onWheel);
  }

  destroy() {
    this.removeEvents();
    this.context.hook.cleanHooks(this.hooks);
  }
}
