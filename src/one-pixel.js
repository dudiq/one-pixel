import Context from '@/class/Context';
import CanvasLevel from '@/class/CanvasLevel';
import Touch from '@/class/Touch';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import Images from '@/class/Images';
import Hook from '@/class/Hook';

import RenderCtrl from '@/controllers/RenderCtrl';
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

    // at first, register classes
    context.registerModules({
      canvasLevel: CanvasLevel,
      touch: Touch,
      mouse: Mouse,
      nodes: Nodes,
      images: Images,
      crossingRulers: CrossingRulers,
      bbox: BBox,
    });

    // then register controllers
    context.registerModules({
      renderCtrl: RenderCtrl,
      transformCtrl: TransformCtrl,
      dragZoomCtrl: DragZoomCtrl,
      wheelCtrl: WheelCtrl,
      nodeRemoveCtrl: NodeRemoveCtrl,
      crossCtrl: CrossCtrl,
    });

    const plugins = {};

    // and at the last - plugins
    (config.plugins || []).forEach(plugin => {
      const pluginName = plugin.pluginName;
      context.register(pluginName, plugin);
      plugins[pluginName] = context[pluginName];
    });

    this.plugins = plugins;

    context.init();
  }

  appendTo(el) {
    this.context.container.appendTo(el);
  }

  setData(nodes) {
    this.context.nodes.setNodes(nodes);
  }

  rotate(angle) {
    this.context.transformCtrl.rotate(angle);
    this.context.renderCtrl.render();
  }

  zoomDelta(delta) {
    const scale = this.context.transformCtrl.scale();

    const container = this.context.container;
    const w = container.getWidth();
    const h = container.getHeight();

    const newScale = scale - delta;
    this.context.transformCtrl.transformByCenter(
      0,
      0,
      w / 2,
      h / 2,
      newScale / scale,
    );

    this.context.renderCtrl.render();
  }

  render() {
    // wait images loaded
    if (!this.context.images.isLoaded) {
      this.context.images.hooks.onLoaded.one(() => {
        this.render();
        this.context.transformCtrl.fitToScreen();
      });
      return;
    }

    this.context.renderCtrl.render();
  }

  destroy() {
    this.context.destroy();
  }
}
