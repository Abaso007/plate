import type { Path, Point, Range } from 'slate';

import {
  type PlateEditor,
  type TElement,
  type TElementEntry,
  getAboveNode,
  getPluginType,
} from '@udecode/plate-common';

import { ListOrderedPlugin, ListUnorderedPlugin } from '../ListPlugin';

/** Searches upward for the root list element */
export const getListRoot = (
  editor: PlateEditor,
  at: Path | Point | Range | null = editor.selection
): TElementEntry | undefined => {
  if (!at) return;

  const parentList = getAboveNode<TElement>(editor, {
    at,
    match: {
      type: [
        getPluginType(editor, ListUnorderedPlugin.key),
        getPluginType(editor, ListOrderedPlugin.key),
      ],
    },
  });

  if (parentList) {
    const [, parentListPath] = parentList;

    return getListRoot(editor, parentListPath) ?? parentList;
  }
};
