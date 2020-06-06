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
    });

    context.registerModules({
      drawCtrl: DrawCtrl,
      transformCtrl: TransformCtrl,
      dragZoomCtrl: DragZoomCtrl,
      wheelCtrl: WheelCtrl,
    });

    (config.plugins || []).forEach(plugin => context.register(plugin.pluginName, plugin));

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
    this.context.editor.setTool(toolName);
  }

  redraw() {
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
