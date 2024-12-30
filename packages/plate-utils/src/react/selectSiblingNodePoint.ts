import type { Path } from 'slate';

import { type TEditor, type TNode, setSelection } from '@udecode/slate';
import { getNextNodeStartPoint, getPreviousNodeEndPoint } from '@udecode/slate';

export const selectSiblingNodePoint = (
  editor: TEditor,
  {
    at,
    focus = true,
    node,
    reverse,
  }: {
    at?: Path;
    focus?: boolean;
    node?: TNode;
    reverse?: boolean;
  } = {}
) => {
  if (node) {
    at = editor.findPath(node);
  }
  if (!at) return;

  const point = reverse
    ? getPreviousNodeEndPoint(editor, at)
    : getNextNodeStartPoint(editor, at);

  if (!point) return;

  setSelection(editor, {
    anchor: point,
    focus: point,
  });

  if (focus) {
    editor.focus();
  }
};
