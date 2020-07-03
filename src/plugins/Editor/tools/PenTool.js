import { NODE_TYPES } from '@/constants';
import BaseTool from './BaseTool';
import simplify from '../simplify';

const THRESHOLD_DISTANCE = 10;

const SIMPLIFY_K = 1;

const toXY = points => {
  let pointIndex = -1;
  const res = points.reduce((pointsList, point, index) => {
    if (index % 2 === 0) {
      pointIndex++;
      pointsList.push({x: 0, y: 0});
      pointsList[pointIndex].x = point;
    }
    pointsList[pointIndex].y = point;
    return pointsList;
  }, []);

  return res;
};

const toList = (points) => {
  return points.reduce((pointsList, point) => {
    pointsList.push(point.x);
    pointsList.push(point.y);
    return pointsList;
  }, []);
};

export default class PenTool extends BaseTool {
  constructor(context, editor) {
    super(context, editor);
    this.config = context.config;
  }

  onMouseStart(point) {
    point = this.getPoint(point);
    this.points = [];
    this.points.push(point.x, point.y);

    const ctx = this.editor.editorCanvas.canvasContext;
    ctx.beginPath();
    ctx.strokeStyle = this.config.penColor;
    ctx.lineWidth = this.config.penWidth;
    ctx.lineCap = this.config.lineCap;
    ctx.moveTo(point.x, point.y);
    this.editor.render();
  }

  onMouseMove(point) {
    point = this.getPoint(point);
    const prevY = this.points[this.points.length - 1];
    const prevX = this.points[this.points.length - 2];

    const isPassedX = Math.abs(prevX - point.x) > THRESHOLD_DISTANCE;
    const isPassedY = Math.abs(prevY - point.y) > THRESHOLD_DISTANCE;
    if (!(isPassedX || isPassedY)) {
      return;
    }

    this.points.push(point.x, point.y);

    const ctx = this.editor.editorCanvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    this.editor.render();
  }

  onMouseEnd(point) {
    point = this.getPoint(point);
    this.points.push(point.x, point.y);
    const ctx = this.editor.editorCanvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.closePath();

    const newPointsXY = simplify(toXY(this.points), SIMPLIFY_K, true);
    const newPoints = toList(newPointsXY);

    const newNode = {
      i: this.getNewId(),
      t: NODE_TYPES.NODE_LINE,
      p: newPoints,
    };
    this.context.editor.createNewNode(newNode);
    this.context.renderCtrl.render();
  }
}
