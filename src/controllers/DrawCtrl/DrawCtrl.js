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
      currentDrawNodeIndex: 0,
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
      this.meta.currentDrawNodeIndex,
      PORTION_LENGTH,
      this.drawNode,
    );
  };

  drawPortionsList() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.asyncDrawPortion, 0);
  }

  startDraw() {
    const rect = this.context.transformCtrl.getClearRect(
      0,
      0,
      this.context.element.clientWidth,
      this.context.element.clientHeight,
    );
    this.context.canvas.clearCanvas(rect.p1, rect.p2);
    clearTimeout(this.timerId);
    this.meta.currentDrawNodeIndex = 0;
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

    const offset = this.context.transformCtrl.offset();
    const scale = this.context.transformCtrl.scale();
    this.context.transformCtrl.transform(0, 0, 1);
    this.context.canvas.setSize(element.clientWidth, element.clientHeight);
    this.context.transformCtrl.transform(offset.x, offset.y, scale);

    this.redraw();
  };

  destroy() {
    window.removeEventListener('resize', this.onResize, false);
  }
}
