function parentHandler(args) {
  const cbs = this.cbs;
  for (let i = 0, l = cbs.length; i < l; i++) {
    // eslint-disable-next-line
    cbs[i].apply(cbs, args);
  }
}

const methods = {
  on(cb) {
    this.cbs.push(cb);
  },
  one(cb) {
    const cbs = this.cbs;
    let one = (...args) => {
      cb.apply(cbs, args);
      this.off(one);
      one = null;
    };
    cbs.push(one);
  },
  off(cb) {
    if (!cb) {
      this.clean();
      return;
    }
    const pos = this.cbs.indexOf(cb);
    pos != -1 && this.cbs.splice(pos, 1);
  },
  length() {
    return this.cbs.length;
  },
  clean() {
    this.cbs.length = 0;
  },
};

export default class Hook {
  createHook(/* options */) {
    function handler(...args) {
      parentHandler.call(handler, args);
    }

    handler.cbs = [];

    Object.setPrototypeOf(handler, methods);

    return handler;
  }

  createHooks(names) {
    for (const key in names) {
      names[key] = this.createHook(names[key]);
    }
    return names;
  }
}
