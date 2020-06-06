import Canvas from '@/class/Canvas';
import BaseTool from './Tools/BaseTool';
import PenTool from './Tools/PenTool';
import EraseTool from './Tools/EraseTool';

// http://perfectionkills.com/exploring-canvas-drawing-techniques/

export default class Editor {
  static pluginName = 'editor';

  constructor(context) {
    this.context = context;
    this.hookAddNode = context.hook.createHook();

    this.editorCanvas = new Canvas(context);

    this.tools = {
      base: new BaseTool(context),
      pen: new PenTool(context),
      erase: new EraseTool(context),
    };

    this.tool = this.tools.pen;
    this.isClicked = false;

    this.bindMouse();
  }

  init() {
    this.context.drawCtrl.hookResize.on(this.onResize);
  }

  setTool(toolName) {
    if (this.tools[toolName]) this.tool = this.tools[toolName];
  }

  onResize = (w, h) => {
    this.editorCanvas.setSize(w, h);
  };

  bindMouse() {
    const context = this.context;
    const hooks = context.mouse.hooks;
    hooks.onStart.on(this.onMouseStart);
    hooks.onMove.on(this.onMouseMove);
    hooks.onStop.on(this.onMouseEnd);
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
    this.hookAddNode(node);
  }
}
