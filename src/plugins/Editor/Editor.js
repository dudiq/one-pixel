import BaseTool from './tools/BaseTool';
import PenTool from './tools/PenTool';
import EraseTool from './tools/EraseTool';
import MoveTool from './tools/MoveTool';

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
  move: 'move',
  pen: 'pen',
  erase: 'erase',
};

const toolClasses = {
  base: BaseTool,
  [TOOLS.pen]: PenTool,
  [TOOLS.erase]: EraseTool,
  [TOOLS.move]: MoveTool,
};

export default class Editor {
  static pluginName = 'editor';

  static TOOLS = TOOLS;

  constructor(context) {
    this.context = context;
    this.hookAddNode = context.hook.createHook();

    this.editorCanvas = context.canvasLevel.createCanvas();
    context.canvasLevel.addCanvas(this.editorCanvas);

    this.tools = toolsFabric(context, this, toolClasses);

    this.tool = this.tools.move;
    this.isClicked = false;

    this.bindMouse();
  }

  setTool(toolName) {
    if (this.tools[toolName]) this.tool = this.tools[toolName];
  }

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
