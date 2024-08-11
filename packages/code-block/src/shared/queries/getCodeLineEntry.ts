import type { ValueOf } from '@udecode/plate-common';
import type { Location } from 'slate';

import {
  type EElement,
  type PlateEditor,
  type TElement,
  type TNodeEntry,
  getAboveNode,
  getParentNode,
  isElement,
  someNode,
} from '@udecode/plate-common/server';

import { getCodeLineType } from '../options';

/** If at (default = selection) is in ul>li>p, return li and ul node entries. */
export const getCodeLineEntry = <
  N extends EElement<ValueOf<E>>,
  E extends PlateEditor,
>(
  editor: E,
  { at = editor.selection }: { at?: Location | null } = {}
) => {
  if (
    at &&
    someNode(editor, {
      at,
      match: { type: getCodeLineType(editor) },
    })
  ) {
    const selectionParent = getParentNode(editor, at);

    if (!selectionParent) return;

    const [, parentPath] = selectionParent;

    const codeLine =
      getAboveNode<TElement>(editor, {
        at,
        match: { type: getCodeLineType(editor) },
      }) || getParentNode<N>(editor, parentPath);

    if (!codeLine) return;

    const [codeLineNode, codeLinePath] = codeLine;

    if (
      isElement(codeLineNode) &&
      codeLineNode.type !== getCodeLineType(editor)
    )
      return;

    const codeBlock = getParentNode<N>(editor, codeLinePath);

    if (!codeBlock) return;

    return {
      codeBlock,
      codeLine: codeLine as TNodeEntry<N>,
    };
  }
};
