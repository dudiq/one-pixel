export default class BaseTool {
  constructor(context) {
    this.context = context;
    this.points = [];
  }

  onMouseStart(point) {}

  onMouseMove(point) {}

  onMouseEnd() {}

  getNewId() {
    const length = this.context.nodes.nodes.length;
    const uuid = this.context.config.uuid || 'un';
    const date = new Date();
    const lastId = `${date.getTime()}`.slice(6);
    return `${length}-${uuid}-${lastId}`;
  }

  getNewNode() {
    throw new Error('tool node is not implemented');
  }
}
