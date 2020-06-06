import rendererFabric from './rendererFabric';

const PORTION_LENGTH = 2000;

export default class DrawCtrl {
  constructor(context) {
    this.context = context;
    const canvasLevel = context.canvasLevel;
    this.screenCanvas = canvasLevel.createCanvas();
    this.nodeCanvas = canvasLevel.createCanvas();
    canvasLevel.addCanvas(this.nodeCanvas);

    this.timerId = null;
    this.hookRenderEnd = context.hook.createHook();
    this.hookResize = context.hook.createHook();
    this.meta = {
      w: 0,
      h: 0,
      renderNodeIndex: 0,
    };

    this.nodeRenderers = rendererFabric(context);

    window.addEventListener('resize', this.onResize, false);
  }

  init() {
    const el = this.context.element;
    el.appendChild(this.screenCanvas.canvasElement);
    this.updateSize();
  }

  renderNode = node => {
    const renderer = this.nodeRenderers[node.t];
    if (!renderer) {
      throw new Error(`not defined draw type ${renderer}`);
    }

    const canvas = this.nodeCanvas;
    renderer.render(canvas, node);
  };

  asyncDrawPortion = () => {
    const nodes = this.context.nodes;
    const startIndex = this.meta.renderNodeIndex;
    const len = nodes.getLength();
    const endIndex = Math.min(startIndex + PORTION_LENGTH, len);

    nodes.processNodes(this.meta.renderNodeIndex, endIndex, this.renderNode);
    const nextStart = startIndex + PORTION_LENGTH;
    this.meta.renderNodeIndex += PORTION_LENGTH;
    if (nextStart >= len) {
      // done
      this.onRenderEnd();
      this.meta.renderNodeIndex = 0;
      return;
    }

    this.meta.renderNodeIndex = nextStart;
    this.renderNext();
  };

  renderNext() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.asyncDrawPortion, 0);
  }

  renderToScreen() {
    this.screenCanvas.clearCanvas(0, 0, this.meta.w, this.meta.h);

    const levels = this.context.canvasLevel.getLevels();
    for (let i = 0, l = levels.length; i < l; i++) {
      const canvasEl = levels[i].canvas.canvasElement;
      this.screenCanvas.canvasContext.drawImage(canvasEl, 0, 0);
    }
  }

  onRenderEnd() {
    // TODO: add reqAnimationFrame for remove flickering when run hooks
    this.renderToScreen();
    this.hookRenderEnd();
  }

  redraw() {
    clearTimeout(this.timerId);
    this.meta.renderNodeIndex = 0;

    const rect = this.context.transformCtrl.getClearRect(
      0,
      0,
      this.context.element.clientWidth,
      this.context.element.clientHeight,
    );
    const x = rect.p1[0];
    const y = rect.p1[1];
    const w = rect.p2[0] - rect.p1[0];
    const h = rect.p2[1] - rect.p1[1];

    const levels = this.context.canvasLevel.getLevels();
    for (let i = 0, l = levels.length; i < l; i++) {
      levels[i].canvas.clearCanvas(x, y, w, h);
    }

    this.renderNext();
  }

  stopDraw() {
    clearTimeout(this.timerId);
  }

  onResize = () => {
    if (!this.isDimensionChanged()) {
      return;
    }
    this.updateSize();
    this.renderToScreen();
    this.redraw();
    this.hookResize(this.meta.w, this.meta.h);
  };

  isDimensionChanged() {
    const element = this.context.element;
    const canvasElement = this.screenCanvas.canvasElement;
    const w = element.clientWidth;
    const h = element.clientHeight;
    if (w === canvasElement.width && h === canvasElement.height) {
      return false;
    }
    return true;
  }

  updateSize() {
    const context = this.context;
    const transformCtrl = context.transformCtrl;
    const element = context.element;
    const w = element.clientWidth;
    const h = element.clientHeight;

    this.meta.w = w;
    this.meta.h = h;

    const offset = transformCtrl.offset();
    const x = offset.x;
    const y = offset.y;
    const scale = transformCtrl.scale();
    transformCtrl.transform(0, 0, 1);
    const levels = context.canvasLevel.getLevels();
    for (let i = 0, l = levels.length; i < l; i++) {
      levels[i].canvas.setSize(w, h);
    }

    transformCtrl.transform(x, y, scale);

    this.screenCanvas.setSize(w, h);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize, false);
  }
}
