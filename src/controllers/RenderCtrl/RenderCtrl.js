import nodeRenderFabric from './nodeRenderFabric';

const PORTION_LENGTH = 2000;

export default class RenderCtrl {
  constructor(context) {
    this.context = context;
    const canvasLevel = context.canvasLevel;
    this.screenCanvas = canvasLevel.createCanvas();
    this.nodeCanvas = canvasLevel.createCanvas();
    canvasLevel.addCanvas(this.nodeCanvas);

    this.timerId = null;
    this.hooks = context.hook.createHooks({
      onRenderEnd: 'onRenderEnd',
    });
    this.meta = {
      w: 0,
      h: 0,
      renderNodeIndex: 0,
    };

    this.nodeRendersMap = nodeRenderFabric(context);

    window.addEventListener('resize', this.onResize, false);
  }

  init() {
    const el = this.context.container.getPlace();
    el.appendChild(this.screenCanvas.canvasElement);
    this.updateSize();
  }

  renderNode(node) {
    const renderer = this.nodeRendersMap[node.t];
    if (!renderer) {
      throw new Error(`not defined draw type ${renderer}`);
    }

    const canvas = this.nodeCanvas;
    renderer.render(canvas, node);
  }

  asyncDrawPortion = () => {
    const nodes = this.context.nodes;
    const startIndex = this.meta.renderNodeIndex;

    const nodeList = nodes.getNodes();
    const len = nodeList.length;
    const endIndex = Math.min(startIndex + PORTION_LENGTH, len);

    for (let i = this.meta.renderNodeIndex; i < endIndex; i++) {
      this.renderNode(nodeList[i], i);
    }

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
    this.hooks.onRenderEnd();
  }

  render() {
    clearTimeout(this.timerId);
    this.meta.renderNodeIndex = 0;

    const rect = this.context.transformCtrl.getClearRect(
      0,
      0,
      this.context.container.getWidth(),
      this.context.container.getHeight(),
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
    this.render();
  };

  isDimensionChanged() {
    const container = this.context.container;
    const canvasElement = this.screenCanvas.canvasElement;
    const w = container.getWidth();
    const h = container.getHeight();
    if (w === canvasElement.width && h === canvasElement.height) {
      return false;
    }
    return true;
  }

  updateSize() {
    const context = this.context;
    const transformCtrl = context.transformCtrl;
    const container = context.container;
    const w = container.getWidth();
    const h = container.getHeight();

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
    clearTimeout(this.timerId);
    this.context.hook.cleanHooks(this.hooks);
    window.removeEventListener('resize', this.onResize, false);
  }
}
