import { PAINT_MODE_TYPES } from '@/constants';
import BaseTool from './Tools/BaseTool';
import PenTool from './Tools/PenTool';
import EraseTool from './Tools/EraseTool';

// http://perfectionkills.com/exploring-canvas-drawing-techniques/

export default class PaintCtrl {
  constructor(context) {
    this.context = context;
    this.mode = PAINT_MODE_TYPES.PAINT;
    this.events = context.radio.events('paintCtrl', {
      addNode: 'addNode',
    });

    this.tools = {
      base: new BaseTool(context),
      pen: new PenTool(context),
      erase: new EraseTool(context),
    };

    this.tool = this.tools.pen;
    this.isClicked = false;

    this.bindMouse();
  }

  setTool(toolName) {
    switch (toolName) {
      case 'pen':
        this.tool = this.tools.pen;
        break;
      case 'erase':
        this.tool = this.tools.erase;
        break;
      default:
        break;
    }
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
    const node = this.tool.getNewNode();

    this.context.nodes.addNode(node);
    this.context.radio.trig(this.events.addNode, node);
    this.isClicked = false;
  };

  switchMode(mode) {
    this.mode = mode;
  }
}
