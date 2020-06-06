import radio from '@/system/radio';
import Context from '@/class/Context';
import Canvas from '@/class/Canvas';
import Touch from '@/class/Touch';
import Mouse from '@/class/Mouse';
import Nodes from '@/class/Nodes';
import Images from '@/class/Images';

import DrawCtrl from '@/controllers/DrawCtrl';
import TransformCtrl from '@/controllers/TransformCtrl';
import DragZoomCtrl from '@/controllers/DragZoomCtrl';
import WheelCtrl from '@/controllers/WheelCtrl';

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
      this.context.radio.one(this.context.images.events.onLoaded, () => {
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
