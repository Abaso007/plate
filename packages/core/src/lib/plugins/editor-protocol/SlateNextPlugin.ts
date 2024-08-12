import type { Path } from 'slate';

import {
  type EAncestor,
  type GetAboveNodeOptions,
  type TEditor,
  type TElement,
  type TRange,
  type Value,
  type ValueOf,
  getAboveNode,
  getMarks,
  isExpanded,
  isStartPoint,
  removeEditorMark,
} from '@udecode/slate';

import type { WithOverride } from '../../plugin/types/PlatePlugin';

import { ELEMENT_DEFAULT } from '../../constants';
import { getPluginType } from '../../plugin';
import { createPlugin } from '../../plugin/createPlugin';
import { resetEditor } from '../../transforms';

const getBlockAbove = <
  N extends EAncestor<ValueOf<E>>,
  E extends TEditor = TEditor,
>(
  editor: E,
  options: GetAboveNodeOptions<ValueOf<E>> = {}
) =>
  getAboveNode<N, ValueOf<E>>(editor, {
    ...options,
    block: true,
  });

const isSelectionAtBlockStart = <E extends TEditor = TEditor>(
  editor: E,
  options?: GetAboveNodeOptions<ValueOf<E>>
) => {
  const { selection } = editor;

  if (!selection) return false;

  const path = getBlockAbove(editor, options)?.[1];

  if (!path) return false;

  return (
    isStartPoint(editor, selection.focus, path) ||
    (isExpanded(editor.selection) &&
      isStartPoint(editor, selection.anchor, path))
  );
};

const removeSelectionMark = (editor: TEditor) => {
  const marks = getMarks(editor);

  if (!marks) return;

  // remove all marks
  Object.keys(marks).forEach((key) => {
    removeEditorMark(editor, key);
  });
};

export const withSlateNext: WithOverride = ({ editor }) => {
  const { apply, deleteBackward, deleteForward, deleteFragment } = editor;

  editor.prevSelection = null;
  editor.currentKeyboardEvent = null;

  const resetMarks = () => {
    if (isSelectionAtBlockStart(editor)) {
      removeSelectionMark(editor);
    }
  };

  editor.deleteBackward = (unit) => {
    deleteBackward(unit);

    resetMarks();
  };

  editor.deleteForward = (unit) => {
    deleteForward(unit);

    resetMarks();
  };

  editor.deleteFragment = (direction) => {
    deleteFragment(direction);

    resetMarks();
  };

  editor.apply = (operation) => {
    if (operation.type === 'set_selection') {
      const { properties } = operation;

      editor.prevSelection = properties as TRange | null;

      apply(operation);

      editor.currentKeyboardEvent = null;

      return;
    }

    apply(operation);
  };

  return editor;
};

/** Opinionated extension of slate default behavior. */
export const SlateNextPlugin = createPlugin({
  handlers: {
    onKeyDown: ({ editor, event }: any) => {
      // React 16.x needs this event to be persistented due to it's event pooling implementation.
      // https://reactjs.org/docs/legacy-event-pooling.html
      event.persist();
      editor.currentKeyboardEvent = event;
    },
  },
  key: 'slateNext',
  withOverrides: withSlateNext,
})
  .extendApi(({ editor }) => ({
    /** Default block factory. */
    blockFactory: (node?: Partial<TElement>, _path?: Path): TElement => ({
      children: [{ text: '' }],
      type: getPluginType(editor, ELEMENT_DEFAULT),
      ...node,
    }),
  }))
  .extendApi(({ plugin: { api } }) => ({
    /** Editor children factory. */
    childrenFactory: (): Value => [api.blockFactory()],
  }))
  .extendApi(({ editor }) => ({
    reset: () => {
      resetEditor(editor);
    },
  }));
