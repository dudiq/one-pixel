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

export default class OnePixel {
  constructor(config) {
    this.config = config;
    const buffer = typeof config.container === 'string'
      ? document.querySelector(config.container)
      : config.container;
    const childElement = document.createElement('div');
    childElement.style = 'position:absolute; left:0; right:0; top:0; bottom:0; overflow:hidden;';
    buffer.appendChild(childElement);
    let helper;
    if (config.showHelper) {
      helper = document.createElement('div');
      helper.style = 'position:absolute; top:0; right:0; border:1px solid gray;display:inline-block;';
      buffer.appendChild(helper);
    }
    const context = new Context({
      config,
      helper,
      element: childElement,
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
