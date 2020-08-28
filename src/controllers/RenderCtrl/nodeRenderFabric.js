import { NODE_TYPES } from '@/constants';
// import LineTo from './renderNode/LineTo';
import LineToTwoColors from './renderNode/LineToTwoColors';
import ImageNode from './renderNode/ImageNode';
import BaseNode from './renderNode/BaseNode';

export default function nodeRenderFabric(context) {
  return {
    [NODE_TYPES.NODE_LINE]: new LineToTwoColors(context),
    [NODE_TYPES.NODE_IMAGE]: new ImageNode(context),
    [NODE_TYPES.NODE_REMOVE]: new BaseNode(context),
  };
}
