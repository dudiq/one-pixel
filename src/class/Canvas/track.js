export default function trackTransforms(ctx, bbox) {
  // 10thx to http://phrogz.net/tmp/canvas_zoom_to_cursor.html for full detailed example!!!
  // Adds ctx.getTransform() - returns an SVGMatrix
  // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let xform = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  const savedTransforms = [];
  const save = ctx.save;
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };
  const restore = ctx.restore;
  ctx.restore = function () {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  const cscale = ctx.scale;
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return cscale.call(ctx, sx, sy);
  };
  const rotate = ctx.rotate;
  ctx.rotate = function (radians) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(ctx, radians);
  };
  const translate = ctx.translate;
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };
  const transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
    const m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };
  const setTransform = ctx.setTransform;
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };
  const pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };

  // var ptRe = svg.createSVGPoint();
  // ctx.retransformedPoint = function (x, y) {
  //   // :todo change this logic to matrix.
  //   // ptRe.x = 0;
  //   // ptRe.y = 0;
  //   // var p2 = pt.matrixTransform(xform.inverse());
  //
  //   // p2.x = x;
  //   // p2.y = y;
  //   // var sub = p2.matrixTransform(xform);
  //   // p2 = null;
  //   return {
  //     x: (x - bbox.minx) * scale.val,
  //     y: (y - bbox.miny) * scale.val
  //     // sx: sub.x,
  //     // sy: sub.y
  //   };
  // }
}
