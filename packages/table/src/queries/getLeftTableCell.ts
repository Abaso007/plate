import {
  type PlateEditor,
  findNode,
  getNodeEntry,
} from '@udecode/plate-common/server';
import { Path } from 'slate';

import type { TTableCellElement } from '../types';

import { getCellTypes } from '../utils/index';

// Get cell to the left of the current cell
export const getLeftTableCell = (
  editor: PlateEditor,
  {
    at: cellPath,
  }: {
    at?: Path;
  } = {}
) => {
  if (!cellPath) {
    cellPath = findNode<TTableCellElement>(editor, {
      match: { type: getCellTypes(editor) },
    })?.[1];

    if (!cellPath) return;
  }

  const cellIndex = cellPath.at(-1);

  if (!cellIndex) return;

  const prevCellPath = Path.previous(cellPath);

  return getNodeEntry<TTableCellElement>(editor, prevCellPath);
};
