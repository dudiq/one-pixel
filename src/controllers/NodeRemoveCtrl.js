import { NODE_TYPES } from '@/constants';

export default class NodeRemoveCtrl {
  constructor(context) {
    this.context = context;
    this.dropNodesMap = {};
  }

  init() {
    this.context.nodes.hooks.onSetStart.on(this.onSetStart);
    this.context.nodes.hooks.onSetEnd.on(this.clearRemoved);
    this.context.nodes.hooks.onAdd.on(this.onAddNode);
  }

  onSetStart = () => {
    this.dropNodesMap = {};
  };

  onAddNode = node => {
    if (node.t === NODE_TYPES.NODE_REMOVE) {
      this.dropNodesMap[node.v] = true;
    }
  };

  clearRemoved = () => {
    const nodes = this.context.nodes.getNodes();
    const dropNodesMap = this.dropNodesMap;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (dropNodesMap[node.i]) {
        nodes.splice(i, 1);
      }
    }
    this.dropNodesMap = {};
  };
}
