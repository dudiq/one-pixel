import { NODE_TYPES } from '@/constants';
import LineTo from './LineTo';
import ImageNode from './ImageNode';
import BaseNode from './BaseNode';

export default function (context) {
  return {
    [NODE_TYPES.NODE_LINE]: new LineTo(context),
    [NODE_TYPES.NODE_IMAGE]: new ImageNode(context),
    [NODE_TYPES.NODE_REMOVE]: new BaseNode(context),
  };
}
