import { NODE_TYPES } from '@/constants';

export default class Nodes {
  constructor(context) {
    this.context = context;
    this.nodes = [];
  }

  clearNodes() {
    this.nodes.length = 0;
  }

  addNodes(nodes) {
    nodes.forEach(node => {
      this.addNode(node);
    });
  }

  addNode(node) {
    if (node.t === NODE_TYPES.NODE_IMAGE) {
      this.context.images.addImage(node);
    }
    this.nodes.push(node);
  }

  processNodes(startIndex, processLength, cb) {
    const nodes = this.nodes;
    const len = Math.min(startIndex + processLength, nodes.length);
    if (len === 0) return;

    for (let i = startIndex; i < len; i++) {
      cb(nodes[i], i);
    }
  }
}
