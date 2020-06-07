import { NODE_TYPES } from '@/constants';

type NodePoint = number[];

type NodeBase = {
  i: string; // generated id
  t: typeof NODE_TYPES;
  p?: NodePoint[];
}

type NodeLine = NodeBase | {
  c: string; // color
};

type NodeImage = NodeBase | {
  s: string; // path to file
};

type NodeRemove = NodeBase | {
  v: string; // id of removed node
}
