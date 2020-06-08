export default class Nodes {
  constructor(context) {
    this.context = context;
    this.nodes = [];
    this.hooks = context.hook.createHooks({
      onAdd: 'onAdd',
      onClear: 'onClear',
      onSetStart: 'onSetStart',
      onSetEnd: 'onSetEnd',
    });
  }

  clearNodes() {
    this.nodes.length = 0;
    this.hooks.onClear();
  }

  setNodes(nodes) {
    this.hooks.onSetStart();
    this.clearNodes();
    nodes.forEach(node => {
      this.addNode(node);
    });
    this.hooks.onSetEnd();
  }

  addNode(node) {
    this.nodes.push(node);
    this.hooks.onAdd(node);
  }

  getNodes() {
    return this.nodes;
  }

  destroy() {
    this.dropNodesMap = {};
    this.clearNodes();
    this.context.hook.cleanHooks(this.hooks);
  }
}
