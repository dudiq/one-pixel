import { NODE_TYPES } from '@/constants';

export default class Images {
  constructor(context) {
    this.context = context;
    this.images = {};
    this.isLoaded = false;
    this.hooks = context.hook.createHooks({
      onLoaded: 'onLoaded',
    });
  }

  init() {
    this.context.nodes.hooks.onAdd.on(this.addImage);
    this.context.nodes.hooks.onSetStart.on(this.clearImages);
  }

  getImageById(id) {
    return this.images[id];
  }

  processLoading() {
    if (this.isLoaded) return;

    const images = this.images;
    for (const key in images) {
      if (!images[key].isLoaded) return;
    }

    this.isLoaded = true;

    this.hooks.onLoaded();
  }

  clearImages = () => {
    this.images = {};
    this.isLoaded = false;
  };

  addImage = node => {
    if (node.t !== NODE_TYPES.NODE_IMAGE) return;
    const id = node.i;
    if (this.images[id]) return;
    const image = new Image();

    const meta = {
      image,
      width: 0,
      height: 0,
    };
    this.images[node.i] = meta;
    image.src = node.s;
    image.onload = () => {
      if (!this.getImageById(id)) return;
      meta.width = image.width;
      meta.height = image.height;
      meta.isLoaded = true;
      this.processLoading();
    };
    image.onerror = () => {
      if (!this.getImageById(id)) return;
      meta.isLoaded = true;
      this.processLoading();
    };
  };

  destroy() {
    this.images = {};
    this.context.hook.cleanHooks(this.hooks);
  }
}
