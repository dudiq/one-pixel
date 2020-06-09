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

  render() {
    // wait images loaded
    if (!this.context.images.isLoaded) {
      this.context.images.hookLoaded.one(() => {
        this.render();
      });
      return;
    }

    this.context.renderCtrl.render();
  }

  destroy() {
    this.context.destroy();
  }
}
