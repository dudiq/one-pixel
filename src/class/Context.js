import Hook from '@/class/Hook';

export default class Context {
  constructor(modules = {}) {
    this.modulesKeys = {};
    this.registerModules(modules);
  }

  register(moduleName, Module) {
    if (!moduleName) throw new Error('not defined module name');
    if (this[moduleName]) throw new Error('module already registered');

    this[moduleName] = typeof Module === 'function' ? new Module(this) : Module;
    this.modulesKeys[moduleName] = true;
  }

  registerModules(modules) {
    for (const key in modules) {
      this.register(key, modules[key]);
    }
  }

  init() {
    const modules = this.modulesKeys;
    for (const key in modules) {
      this[key].init && this[key].init();
    }
  }

  destroy() {
    const modules = this.modulesKeys;
    for (const key in modules) {
      this[key].destroy();
    }
  }
}
