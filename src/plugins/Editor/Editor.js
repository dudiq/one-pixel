import BaseTool from './Tools/BaseTool';
import PenTool from './Tools/PenTool';
import EraseTool from './Tools/EraseTool';

// http://perfectionkills.com/exploring-canvas-drawing-techniques/

export default class Editor {
  static pluginName = 'editor';

  constructor(context) {
    this.context = context;
    this.events = context.radio.events('editor', {
      onAddNode: 'onAddNode',
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
    if (this.tools[toolName]) this.tool = this.tools[toolName];
  }

  bindMouse() {
    const context = this.context;
    const radio = context.radio;
    const events = context.mouse.events;
    radio.on(events.onStart, this.onMouseStart);
    radio.on(events.onMove, this.onMouseMove);
    radio.on(events.onStop, this.onMouseEnd);
  }

  onMouseStart = point => {
    if (this.isClicked) return;
    this.tool.onMouseStart(point);
    this.isClicked = true;
  };

  onMouseMove = point => {
    if (!this.isClicked) return;
    this.tool.onMouseMove(point);
  };

  onMouseEnd = point => {
    if (!this.isClicked) return;
    this.isClicked = false;
    this.tool.onMouseEnd(point);
    this.context.drawCtrl.redraw();
  };

  createNewNode(node) {
    if (!node) return;

    this.context.nodes.addNode(node);
    this.context.nodes.clearRemoved();
    this.context.radio.trig(this.events.onAddNode, node);
  }
}
