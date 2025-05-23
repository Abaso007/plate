import type { Editor, NodeEntry } from '@udecode/plate';

import { KEYS } from '@udecode/plate';

import { ListStyleType } from '../types';
import { type ListOptions, indentList, indentTodo } from './indentList';

/** Set indent list if not set. */
export const toggleListSet = (
  editor: Editor,
  [node, _path]: NodeEntry,
  { listStyleType = ListStyleType.Disc, ...options }: ListOptions
) => {
  if (node.hasOwnProperty(KEYS.listChecked) || node[KEYS.listType]) return;
  if (listStyleType === 'todo') {
    indentTodo(editor as any, {
      listStyleType,
      ...options,
    });
  } else {
    indentList(editor as any, {
      listStyleType,
      ...options,
    });
  }

  return true;
};
