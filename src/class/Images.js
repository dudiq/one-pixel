export default class Images {
  constructor(context) {
    this.context = context;
    this.images = {};
    this.isLoaded = false;
    this.events = context.radio.events('images', {
      loaded: 'loaded',
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

    this.context.radio.trig(this.events.loaded);
  }

  addImage(node) {
    const image = new Image();

    const meta = {
      image,
      width: 0,
      height: 0,
    };
    image.src = node.s;
    image.onload = () => {
      meta.width = image.width;
      meta.height = image.height;
      meta.isLoaded = true;
      this.processLoading();
    };
    image.onerror = () => {
      meta.isLoaded = true;
      this.processLoading();
    };
    this.images[node.i] = meta;
  }
}
