import Context from '@/class/Context';
import CanvasLevel from '@/class/CanvasLevel';
import Touch from '@/class/Touch';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import Images from '@/class/Images';
import Hook from '@/class/Hook';

import DrawCtrl from '@/controllers/DrawCtrl';
import TransformCtrl from '@/controllers/TransformCtrl';
import DragZoomCtrl from '@/controllers/DragZoomCtrl';
import WheelCtrl from '@/controllers/WheelCtrl';
import Container from '@/class/Container';
import CrossingRulers from '@/class/CrossingRulers';
import BBox from '@/class/BBox';
import NodeRemoveCtrl from '@/controllers/NodeRemoveCtrl';
import CrossCtrl from '@/controllers/CrossCtrl';

export default class OnePixel {
  constructor(config) {
    this.config = config;

    const context = new Context({
      config,
      container: Container,
      hook: Hook,
    });

    this.context = context;

    context.registerModules({
      canvasLevel: CanvasLevel,
      touch: Touch,
      mouse: Mouse,
      nodes: Nodes,
      images: Images,
      crossingRulers: CrossingRulers,
      bbox: BBox,
    });

    context.registerModules({
      drawCtrl: DrawCtrl,
      transformCtrl: TransformCtrl,
      dragZoomCtrl: DragZoomCtrl,
      wheelCtrl: WheelCtrl,
      nodeRemoveCtrl: NodeRemoveCtrl,
      crossCtrl: CrossCtrl,
    });

    const plugins = {};

    (config.plugins || []).forEach(plugin => {
      const pluginName = plugin.pluginName;
      context.register(pluginName, plugin);
      plugins[pluginName] = context[pluginName];
    });

    this.plugins = plugins;

    context.init();
  }

  setData(nodes) {
    const context = this.context;
    context.drawCtrl.stopDraw();
    context.nodes.clearNodes();
    context.images.clearImages();
    context.nodes.setNodes(nodes);
  }

  redraw() {
    // TODO: rename to render
    // wait images loaded
    if (!this.context.images.isLoaded) {
      this.context.images.hookLoaded.one(() => {
        this.redraw();
      });
      return;
    }

    this.context.drawCtrl.redraw();
  }

  destroy() {
    this.context.destroy();
  }
}
