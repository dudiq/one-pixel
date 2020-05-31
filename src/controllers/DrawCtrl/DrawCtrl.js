import { NODE_TYPES } from '@/constants';

import LineTo from './nodeTypes/LineTo';
import ImageNode from './nodeTypes/ImageNode';

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
    };
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
    clearTimeout(this.timerId);
    this.meta.currentIndex = 0;
    this.drawPortionsList();
  }

  stopDraw() {
    clearTimeout(this.timerId);
  }
}
