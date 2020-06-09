import BaseTool from './tools/BaseTool';
import PenTool from './tools/PenTool';
import EraseTool from './tools/EraseTool';

// http://perfectionkills.com/exploring-canvas-drawing-techniques/

function toolsFabric(context, editor, tools) {
  const res = {};
  for (const key in tools) {
    const ToolClass = tools[key];
    res[key] = new ToolClass(context, editor);
  }
  return res;
}

const TOOLS = {
  pen: 'pen',
  erase: 'erase',
};

export default class Editor {
  static pluginName = 'editor';

  static TOOLS = TOOLS;

  constructor(context) {
    this.context = context;
    this.hookAddNode = context.hook.createHook();

    this.editorCanvas = context.canvasLevel.createCanvas();
    context.canvasLevel.addCanvas(this.editorCanvas);

    this.tools = toolsFabric(context, this, {
      base: BaseTool,
      [TOOLS.pen]: PenTool,
      [TOOLS.erase]: EraseTool,
    });

    this.tool = this.tools.pen;
    this.isClicked = false;
    this.isEnabled = true;

    this.bindMouse();
  }

  setTool(toolName) {
    if (this.tools[toolName]) this.tool = this.tools[toolName];
  }

  enable(val) {
    this.isEnabled = !!val;
  }

  bindMouse() {
    const context = this.context;
    const hooks = context.mouse.hooks;
    hooks.onStart.on(this.onMouseStart);
    hooks.onMove.on(this.onMouseMove);
    hooks.onStop.on(this.onMouseEnd);
  }

  onMouseStart = point => {
    if (!this.isEnabled) return;
    if (this.isClicked) return;
    this.tool.onMouseStart(point);
    this.isClicked = true;
  };

  onMouseMove = point => {
    if (!this.isEnabled) return;
    if (!this.isClicked) return;
    this.tool.onMouseMove(point);
  };

  onMouseEnd = point => {
    if (!this.isEnabled) return;
    if (!this.isClicked) return;
    this.isClicked = false;
    this.tool.onMouseEnd(point);
  };

  render() {
    this.context.renderCtrl.renderToScreen();
  }

  createNewNode(node) {
    if (!node) return;

    this.context.nodes.addNode(node);
    this.context.nodeRemoveCtrl.clearRemoved();
    this.hookAddNode(node);
  }

  destroy() {
    this.hookAddNode.clean();
  }
}
