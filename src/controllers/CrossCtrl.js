import { NODE_AVAILABLE_SELECT } from '@/constants';

export default class CrossCtrl {
  constructor(context) {
    this.context = context;
  }

  findCrossedByPoint(x, y, dimension) {
    const nodes = this.context.nodes.getNodes();
    let ret;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (!NODE_AVAILABLE_SELECT[node.t]) continue;
      if (this.context.crossingRulers.isPointCrossNode(x, y, node, dimension)) {
        ret = node;
        break;
      }
    }
    return ret;
  }
}
