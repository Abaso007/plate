import type { DOMNode } from 'slate-react/dist/utils/dom';

import { ReactEditor } from 'slate-react';

import type { TReactEditor } from '../types/TReactEditor';

/** Check if a DOM node is within the editor. */
export const hasEditorDOMNode = (
  editor: TReactEditor,
  target: DOMNode,
  options?: Parameters<typeof ReactEditor.hasDOMNode>[2]
) => {
  try {
    return ReactEditor.hasDOMNode(editor as any, target, options);
  } catch (error) {}

  return false;
};
