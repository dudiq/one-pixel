import radio from '@/system/radio';
import Context from '@/class/Context';
import Canvas from '@/class/Canvas';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import DrawCtrl from '@/controllers/DrawCtrl';

export default class OnePixel {
  constructor(elementId, config) {
    this.config = config;
    const element = document.querySelector(elementId);
    const context = new Context({
      config,
      radio: radio('core:one-pixel'),
    });

    context.registerModules({
      canvas: new Canvas(context, element),
      mouse: new Mouse(context, element),
      nodes: new Nodes(context),
      drawCtrl: new DrawCtrl(context),
    });

    this.context = context;
  }

  setData(nodes) {
    this.context.nodes.addNodes(nodes);
  }

  startDraw() {
    this.context.drawCtrl.startDraw();
  }

  destroy() {
    this.context.destroy();
  }
}
