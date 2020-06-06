export default function Hooks() {
  const cbs = [];

  function callHandler(...args) {
    for (let i = 0, l = cbs.length; i < l; i++) {
      // eslint-disable-next-line
      cbs[i].apply(cbs, args);
    }
  }

  callHandler.on = function (cb) {
    cbs.push(cb);
  };

  callHandler.off = function (cb) {
    const pos = cbs.indexOf(cb);
    pos != -1 && cbs.splice(pos, 1);
  };

  callHandler.getLength = function () {
    return cbs.length;
  };

  callHandler.clean = function () {
    cbs.length = 0;
  };

  return callHandler;
}
