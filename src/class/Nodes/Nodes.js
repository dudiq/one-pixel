import { NODE_TYPES, NODE_AVAILABLE_SELECT } from '@/constants';
import BBox from './BBox';
import CrossingRulers from './CrossingRulers';

export default class Nodes {
  constructor(context) {
    this.context = context;
    this.nodes = [];
    this.dropNodesMap = {};
    context.registerModules({
      bbox: BBox,
      crossingRulers: CrossingRulers,
    });
  }

  clearNodes() {
    this.nodes.length = 0;
  }

  setNodes(nodes) {
    this.clearNodes();
    nodes.forEach(node => {
      this.addNode(node);
    });
    this.clearRemoved();
  }

  clearRemoved() {
    const nodes = this.nodes;
    const dropNodesMap = this.dropNodesMap;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (dropNodesMap[node.i]) {
        nodes.splice(i, 1);
      }
    }
    this.dropNodesMap = {};
  }

  addNode(node) {
    if (node.t === NODE_TYPES.NODE_IMAGE) {
      this.context.images.addImage(node);
    }
    if (node.t === NODE_TYPES.NODE_REMOVE) {
      this.dropNodesMap[node.v] = true;
    }
    this.context.bbox.addBbox(node);
    this.nodes.push(node);
  }

  findCrossedByClip(clip) {
    const nodes = this.nodes;
    let ret;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (!NODE_AVAILABLE_SELECT[node.t]) continue;
      if (this.context.crossingRulers.isClipCrossNode(clip, node)) {
        ret = node;
        break;
      }
    }
    return ret;
  }

  processNodes(startIndex, processLength, cb) {
    const nodes = this.nodes;
    const len = Math.min(startIndex + processLength, nodes.length);
    if (len === 0) return;

    for (let i = startIndex; i < len; i++) {
      cb(nodes[i], i);
    }
  }
}
