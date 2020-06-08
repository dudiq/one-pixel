import { NODE_TYPES } from '@/constants';
import LineTo from './renderNode/LineTo';
import ImageNode from './renderNode/ImageNode';
import BaseNode from './renderNode/BaseNode';

export default function nodeRenderFabric(context) {
  return {
    [NODE_TYPES.NODE_LINE]: new LineTo(context),
    [NODE_TYPES.NODE_IMAGE]: new ImageNode(context),
    [NODE_TYPES.NODE_REMOVE]: new BaseNode(context),
  };
}
