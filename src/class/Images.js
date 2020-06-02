export default class Images {
  constructor(context) {
    this.context = context;
    this.images = {};
    this.isLoaded = false;
    this.events = context.radio.events('images', {
      onLoaded: 'onLoaded',
    });
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

    this.context.radio.trig(this.events.onLoaded);
  }

  clearImages() {
    this.images = {};
    this.isLoaded = false;
  }

  addImage(node) {
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
  }
}
