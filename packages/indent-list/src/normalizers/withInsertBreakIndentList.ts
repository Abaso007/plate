import {
  ParagraphPlugin,
  type TElement,
  type WithOverride,
  getAboveNode,
  insertNodes,
  isDefined,
  isEndPoint,
  isExpanded,
} from '@udecode/plate-common';

import {
  type IndentListConfig,
  IndentListPlugin,
  KEY_TODO_STYLE_TYPE,
} from '../IndentListPlugin';

export const withInsertBreakIndentList: WithOverride<IndentListConfig> = ({
  editor,
}) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const nodeEntry = getAboveNode(editor);

    if (!nodeEntry) return insertBreak();

    const [node] = nodeEntry;

    if (
      !isDefined(node[IndentListPlugin.key]) ||
      node[IndentListPlugin.key] !== KEY_TODO_STYLE_TYPE ||
      // https://github.com/udecode/plate/issues/3340
      isExpanded(editor.selection) ||
      !isEndPoint(editor, editor.selection?.focus, nodeEntry[1])
    )
      return insertBreak();

    insertNodes<TElement>(editor, {
      [IndentListPlugin.key]: KEY_TODO_STYLE_TYPE,
      checked: false,
      children: [{ text: '' }],
      indent: node.indent,
      type: ParagraphPlugin.key,
    });
  };

  return editor;
};
