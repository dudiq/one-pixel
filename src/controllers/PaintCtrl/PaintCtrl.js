import { PAINT_MODE_TYPES } from '@/constants';
import BaseTool from './Tools/BaseTool';
import PenTool from './Tools/PenTool';

// http://perfectionkills.com/exploring-canvas-drawing-techniques/

export default class PaintCtrl {
  constructor(context) {
    this.context = context;
    this.mode = PAINT_MODE_TYPES.MOVE;

    this.tools = {
      base: new BaseTool(context),
      pen: new PenTool(context),
    };

    this.tool = this.tools.pen;
    this.isClicked = false;

    this.bindMouse();
  }

  bindMouse() {
    const context = this.context;
    const radio = context.radio;
    radio.on(context.mouse.events.start, this.onMouseStart);
    radio.on(context.mouse.events.move, this.onMouseMove);
    radio.on(context.mouse.events.stop, this.onMouseEnd);
  }

  onMouseStart = point => {
    this.tool.onMouseStart(point);
    this.isClicked = true;
  };

  onMouseMove = point => {
    if (!this.isClicked) return;
    this.tool.onMouseMove(point);
  };

  onMouseEnd = point => {
    if (!this.isClicked) return;
    this.tool.onMouseEnd(point);
    this.isClicked = false;
  };

  switchMode(mode) {
    this.mode = mode;
  }
}
