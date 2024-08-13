import type { PlateEditor, TEditor } from '@udecode/plate-common';
import type { Location } from 'slate';

import { type SetIndentOptions, setIndent } from '@udecode/plate-indent';

import { KEY_LIST_CHECKED, KEY_LIST_STYLE_TYPE } from '../IndentListPlugin';
import { ListStyleType } from '../types';

export interface IndentListOptions<E extends TEditor>
  extends SetIndentOptions<E> {
  at?: Location;
  listStyleType?: ListStyleType | string;
}

/** Increase the indentation of the selected blocks. */
export const indentList = <E extends PlateEditor>(
  editor: E,
  { listStyleType = ListStyleType.Disc, ...options }: IndentListOptions<E> = {}
) => {
  setIndent(editor, {
    offset: 1,
    setNodesProps: () => ({
      [KEY_LIST_STYLE_TYPE]: listStyleType,
    }),
    ...options,
  });
};

export const indentTodo = <E extends PlateEditor>(
  editor: E,
  { listStyleType = ListStyleType.Disc, ...options }: IndentListOptions<E> = {}
) => {
  setIndent(editor, {
    offset: 1,
    setNodesProps: () => ({
      [KEY_LIST_CHECKED]: false,
      [KEY_LIST_STYLE_TYPE]: listStyleType,
    }),
    ...options,
  });
};
