import BaseTool from './BaseTool';

export default class EraseTool extends BaseTool {
  constructor(context, editor) {
    super(context, editor);
    this.config = context.config;
  }

  onMouseStart() {
    this.context.dragZoomCtrl.onDragZoomStart({
      isMultiTouch: false,
    });
  }

  onMouseMove() {
    this.context.dragZoomCtrl.onDragZoom();
  }

  onMouseEnd() {
    this.context.dragZoomCtrl.onDragZoomEnd();
  }
}
