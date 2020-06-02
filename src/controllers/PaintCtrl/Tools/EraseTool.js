import { NODE_TYPES } from '@/constants';
import BaseTool from './BaseTool';

export default class PenTool extends BaseTool {
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
    const clip = this.context.mouse.currentClip;
    const node = this.context.nodes.findCrossedByClip(clip);
    if (node) {
      this.currentNodeId = node.i;
      this.context.paintCtrl.handleTool();
      this.currentNodeId = '';
    }
  }

  getNewNode() {
    if (!this.currentNodeId) return null;
    return {
      i: this.getNewId(),
      t: NODE_TYPES.NODE_REMOVE,
      v: this.currentNodeId,
    };
  }
}
