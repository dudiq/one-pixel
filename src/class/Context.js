export default class Context {
  constructor(modules = {}) {
    this.modules = {};
    this.registerModules(modules);
  }

  register(moduleName, module) {
    if (this[moduleName]) {
      throw new Error('module already registered');
    }
    this[moduleName] = module;
    this.modules[moduleName] = true;
  }

  registerModules(modules) {
    for (const key in modules) {
      this.register(key, modules[key]);
    }
  }

  destroy() {
    const modules = this.modules;
    for (const key in modules) {
      modules[key].destroy();
    }
  }
}
