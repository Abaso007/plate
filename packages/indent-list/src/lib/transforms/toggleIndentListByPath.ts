import {
  ParagraphPlugin,
  type SlateEditor,
  type TNodeEntry,
  setNodes,
  unsetNodes,
} from '@udecode/plate-common';
import { IndentPlugin } from '@udecode/plate-indent';

import {
  BaseIndentListPlugin,
  INDENT_LIST_KEYS,
} from '../BaseIndentListPlugin';

export const toggleIndentListByPath = (
  editor: SlateEditor,
  [node, path]: TNodeEntry,
  listStyleType: string
) => {
  setNodes(
    editor,
    {
      [BaseIndentListPlugin.key]: listStyleType,
      // TODO: normalized if not todo remove this property.
      [INDENT_LIST_KEYS.checked]: false,
      [IndentPlugin.key]: node.indent ?? 1,
      type: ParagraphPlugin.key,
    },
    {
      at: path,
    }
  );
};

export const toggleIndentListByPathUnSet = (
  editor: SlateEditor,
  [, path]: TNodeEntry
) =>
  unsetNodes(
    editor,
    [BaseIndentListPlugin.key, IndentPlugin.key, INDENT_LIST_KEYS.checked],
    {
      at: path,
    }
  );
