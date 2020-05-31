const data = [
  {
    i: '1-uk2d', // id
    t: 'i', //  m - move, l - line, c - curve, i - image
    p: [1, 2], // points [x, y, x, y]...
  },
];

export default class Nodes {
  constructor(context) {
    this.context = context;
    this.nodes = [];
  }

  addNodes(nodes) {
    this.nodes = nodes;
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
