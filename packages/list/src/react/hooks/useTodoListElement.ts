import type { TElement } from 'platejs';

import { useEditorRef, useReadOnly } from 'platejs/react';

export const useTodoListElementState = ({ element }: { element: TElement }) => {
  const editor = useEditorRef();
  const { checked } = element;
  const readOnly = useReadOnly();

  return {
    checked,
    editor,
    element,
    readOnly,
  };
};

export const useTodoListElement = (
  state: ReturnType<typeof useTodoListElementState>
) => {
  const { checked, editor, element, readOnly } = state;

  return {
    checkboxProps: {
      checked: !!checked,
      onCheckedChange: (value: boolean) => {
        if (readOnly) return;

        const path = editor.api.findPath(element);

        if (!path) return;

        editor.tf.setNodes({ checked: value }, { at: path });
      },
      onMouseDown: (e: any) => {
        e.preventDefault();
      },
    },
  };
};
