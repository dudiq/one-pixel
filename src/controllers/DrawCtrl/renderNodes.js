import { NODE_TYPES } from '@/constants';
import LineTo from './nodeTypes/LineTo';
import ImageNode from './nodeTypes/ImageNode';
import BaseNode from './nodeTypes/BaseNode';

export default function renderNodes(context) {
  return {
    [NODE_TYPES.NODE_LINE]: new LineTo(context),
    [NODE_TYPES.NODE_IMAGE]: new ImageNode(context),
    [NODE_TYPES.NODE_REMOVE]: new BaseNode(context),
  };
}
