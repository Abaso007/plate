import {
  type EElementOrText,
  type TEditor,
  type Value,
  insertNodes,
  removeNodes,
  withoutNormalizing,
} from '@udecode/slate';

import type { ReplaceNodeChildrenOptions } from './replaceNodeChildren';

export const replaceNode = <
  N extends EElementOrText<V>,
  V extends Value = Value,
>(
  editor: TEditor<V>,
  { at, insertOptions, nodes, removeOptions }: ReplaceNodeChildrenOptions<N, V>
) => {
  withoutNormalizing(editor, () => {
    removeNodes(editor, { ...removeOptions, at });

    insertNodes(editor, nodes, {
      ...insertOptions,
      at,
    });
  });
};
