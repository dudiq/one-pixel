export default class Context {
  constructor(modules = {}) {
    this.modulesKeys = [];
    this.registerModules(modules);
  }

  register(moduleName, Module) {
    if (!moduleName) throw new Error('not defined module name');
    if (this[moduleName]) throw new Error('module already registered');

    this[moduleName] = typeof Module === 'function' ? new Module(this) : Module;
    this.modulesKeys.push(moduleName);
  }

  registerModules(modules) {
    for (const key in modules) {
      this.register(key, modules[key]);
    }
  }

  init() {
    const modules = this.modulesKeys;
    for (let i = 0, l = modules.length; i < l; i++) {
      const key = modules[i];
      const mod = this[key];
      mod && mod.init && mod.init();
    }
  }

  destroy() {
    const modules = this.modulesKeys;
    for (let i = 0, l = modules.length; i < l; i++) {
      const key = modules[i];
      const mod = this[key];
      mod && mod.destroy && mod.destroy();
    }
  }
}
