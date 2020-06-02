export default class ConfigCtrl {
  constructor(context) {
    this.context = context;

    const config = context.config;

    context.radio.on(context.paintCtrl.events.onAddNode, node => {
      config.onAddNode && config.onAddNode(node);
    });
  }
}
