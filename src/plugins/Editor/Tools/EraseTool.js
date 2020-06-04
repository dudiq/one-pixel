import { NODE_TYPES } from '@/constants';
import BaseTool from './BaseTool';

const CLIP_WIDTH = 6;
const CLIP_WIDTH_HALF = CLIP_WIDTH / 2;

export default class EraseTool extends BaseTool {
  constructor(context) {
    super(context);
    this.config = context.config;
    this.currentNodeId = '';
  }

  onMouseStart() {
    this.eraseNode();
  }

  onMouseMove() {
    this.eraseNode();
  }

  onMouseEnd() {
    this.eraseNode();
  }

  eraseNode() {
    const context = this.context;
    const point = this.getPoint(context.mouse.pointFirst);
    const x = point.x - CLIP_WIDTH_HALF;
    const y = point.y - CLIP_WIDTH_HALF;
    const node = context.nodes.findCrossedByPoint(x, y, CLIP_WIDTH);
    if (!node) return;

    context.editor.createNewNode({
      i: this.getNewId(),
      t: NODE_TYPES.NODE_REMOVE,
      v: node.i,
    });

    this.context.drawCtrl.redraw();
  }
}
