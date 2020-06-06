export default class BaseTool {
  constructor(context, editor) {
    if (!editor) throw new Error('editor is not passed to new Tool for Editor');
    this.context = context;
    this.editor = editor;
    this.points = [];
  }

  getPoint(point) {
    return this.context.transformCtrl.getTransPoint(point);
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
}
