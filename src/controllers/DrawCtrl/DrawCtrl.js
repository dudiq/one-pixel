import Canvas from '@/class/Canvas';

import renderNodes from './renderNodes';

const PORTION_LENGTH = 2000;

export default class DrawCtrl {
  constructor(context) {
    this.context = context;
    this.drawPlace = new Canvas(context);
    this.timerId = null;
    this.hookDrawEnd = context.hook.createHook();
    this.hookResize = context.hook.createHook();
    this.meta = {
      w: 0,
      h: 0,
      renderNodeIndex: 0,
    };

    this.renderNodes = renderNodes(context);

    window.addEventListener('resize', this.onResize, false);
  }

  init() {
    const el = this.context.element;
    const canvas = this.drawPlace.canvasElement;
    el.appendChild(canvas);
    const w = el.clientWidth;
    const h = el.clientHeight;
    this.meta.w = w;
    this.meta.h = h;
    this.drawPlace.setSize(w, h);
    this.context.canvas.setSize(w, h);
  }

  renderNode = node => {
    const renderer = this.renderNodes[node.t];
    if (!renderer) {
      throw new Error(`not defined draw type ${renderer}`);
    }

    renderer.render(node);
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
      this.onDrawEnd();
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

  drawBuffer() {
    this.drawPlace.clearCanvas(0, 0, this.meta.w, this.meta.h);
    this.drawPlace.canvasContext.drawImage(
      this.context.canvas.canvasElement,
      0,
      0,
    );
  }

  onDrawEnd() {
    this.drawBuffer();
    this.hookDrawEnd();
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
    this.context.canvas.clearCanvas(x, y, w, h);

    this.renderNext();
  }

  stopDraw() {
    clearTimeout(this.timerId);
  }

  onResize = () => {
    const element = this.context.element;
    const canvasElement = this.context.canvas.canvasElement;
    const w = element.clientWidth;
    const h = element.clientHeight;
    if (w === canvasElement.width && h === canvasElement.height) {
      return;
    }
    this.meta.w = w;
    this.meta.h = h;

    const offset = this.context.transformCtrl.offset();
    const x = offset.x;
    const y = offset.y;
    const scale = this.context.transformCtrl.scale();
    this.context.transformCtrl.transform(0, 0, 1);
    this.context.canvas.setSize(w, h);
    this.context.transformCtrl.transform(x, y, scale);

    this.drawPlace.setSize(w, h);
    this.drawBuffer();
    this.hookResize(w, h);

    this.redraw();
  };

  destroy() {
    window.removeEventListener('resize', this.onResize, false);
  }
}
