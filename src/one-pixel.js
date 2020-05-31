import radio from '@/system/radio';
import Context from '@/class/Context';
import Canvas from '@/class/Canvas';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import DrawCtrl from '@/controllers/DrawCtrl';
import Images from '@/class/Images';
import PaintCtrl from '@/controllers/PaintCtrl';
import MoveCtrl from '@/controllers/MoveCtrl';
import ScaleCtrl from '@/controllers/ScaleCtrl';

export default class OnePixel {
  constructor(elementId, config) {
    this.config = config;
    const element = document.querySelector(elementId);
    const context = new Context({
      config,
      radio: radio('core:one-pixel'),
    });

    this.context = context;

    context.registerModules({
      canvas: new Canvas(context, element),
      mouse: new Mouse(context, element),
      nodes: new Nodes(context),
      images: new Images(context),
    });

    context.registerModules({
      moveCtrl: new MoveCtrl(context),
      scaleCtrl: new ScaleCtrl(context),
      drawCtrl: new DrawCtrl(context),
      paintCtrl: new PaintCtrl(context),
    });
  }

  setData(nodes) {
    this.context.nodes.addNodes(nodes);
  }

  startDraw() {
    // wait images loaded
    if (!this.context.images.isLoaded) {
      this.context.radio.one(this.context.images.events.loaded, () => {
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
