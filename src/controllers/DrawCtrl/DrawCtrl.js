import { NODE_TYPES } from '@/constants';

import LineTo from './nodeTypes/LineTo';
import ImageNode from './nodeTypes/ImageNode';
import BaseNode from './nodeTypes/BaseNode';

const PORTION_LENGTH = 2000;

export default class DrawCtrl {
  constructor(context) {
    this.context = context;
    this.timerId = null;
    this.meta = {
      currentIndex: 0,
    };

    this.drawTypes = {
      [NODE_TYPES.NODE_LINE]: new LineTo(context),
      [NODE_TYPES.NODE_IMAGE]: new ImageNode(context),
      [NODE_TYPES.NODE_REMOVE]: new BaseNode(context),
    };

    window.addEventListener('resize', this.onResize, false);
  }

  drawNode = node => {
    const drawType = this.drawTypes[node.t];
    if (!drawType) {
      throw new Error(`not defined draw type ${drawType}`);
    }

    drawType.render(node);
  };

  asyncDrawPortion = () => {
    this.context.nodes.processNodes(
      this.meta.currentIndex,
      PORTION_LENGTH,
      this.drawNode,
    );
  };

  drawPortionsList() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.asyncDrawPortion, 0);
  }

  startDraw() {
    this.context.canvas.clearCanvas();
    clearTimeout(this.timerId);
    this.meta.currentIndex = 0;
    this.drawPortionsList();
  }

  redraw() {
    this.startDraw();
  }

  stopDraw() {
    clearTimeout(this.timerId);
  }

  onResize = () => {
    const element = this.context.element;
    const canvasElement = this.context.canvas.canvasElement;
    if (
      element.clientWidth === canvasElement.width
      && canvasElement.height === element.clientHeight
    ) {
      return;
    }

    // const ctx = this.canvasContext;
    // ctx.translate(offset.x, offset.y);
    // const scaleVal = scale.val;
    // const normalScale = 1 / scaleVal;
    // ctx.scale(normalScale, normalScale);

    this.context.canvas.setSize(element.clientWidth, element.clientHeight);

    // ctx.scale(scaleVal, scaleVal);
    // ctx.translate(-offset.x, -offset.y);
    this.redraw();
  };

  destroy() {
    window.removeEventListener('resize', this.onResize, false);
  }
}
