import radio from '@/system/radio';
import Context from '@/class/Context';
import Canvas from '@/class/Canvas';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import DrawCtrl from '@/controllers/DrawCtrl';
import Images from '@/class/Images';
import PaintCtrl from '@/controllers/PaintCtrl';
import ConfigCtrl from '@/controllers/ConfigCtrl';
import TransformCtrl from '@/controllers/TransformCtrl';

export default class OnePixel {
  constructor(elementId, config) {
    this.config = config;
    const element = document.querySelector(elementId);
    const context = new Context({
      config,
      element,
      radio: radio('core:one-pixel'),
    });

    this.context = context;

    context.registerModules({
      canvas: Canvas,
      mouse: Mouse,
      nodes: Nodes,
      images: Images,
    });

    context.registerModules({
      drawCtrl: DrawCtrl,
      paintCtrl: PaintCtrl,
      transformCtrl: TransformCtrl,
    });

    context.registerModules({
      configCtrl: ConfigCtrl,
    });

    context.init();
  }

  setData(nodes) {
    const context = this.context;
    context.drawCtrl.stopDraw();
    context.nodes.clearNodes();
    context.images.clearImages();
    context.nodes.setNodes(nodes);
  }

  setTool(toolName) {
    this.context.paintCtrl.setTool(toolName);
  }

  undo() {
    this.context.commandCtrl.undo();
  }

  redo() {
    this.context.commandCtrl.redo();
  }

  startDraw() {
    // wait images loaded
    if (!this.context.images.isLoaded) {
      this.context.radio.one(this.context.images.events.onLoaded, () => {
        this.startDraw();
      });
      return;
    }

    this.context.drawCtrl.startDraw();
  }

  destroy() {
    this.context.destroy();
  }
}
