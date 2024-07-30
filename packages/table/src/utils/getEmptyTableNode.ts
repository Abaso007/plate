import { type PlateEditor, getPluginType } from '@udecode/plate-common/server';

import type { TTableElement } from '../types';

import { ELEMENT_TABLE } from '../TablePlugin';
import {
  type GetEmptyRowNodeOptions,
  getEmptyRowNode,
} from './getEmptyRowNode';

export interface GetEmptyTableNodeOptions extends GetEmptyRowNodeOptions {
  rowCount?: number;
}

export const getEmptyTableNode = (
  editor: PlateEditor,
  {
    colCount,
    header,
    rowCount = 0,
    ...cellOptions
  }: GetEmptyTableNodeOptions = {}
): TTableElement => {
  const rows = Array.from({ length: rowCount })
    .fill(rowCount)
    .map((_, index) =>
      getEmptyRowNode(editor, {
        colCount,
        ...cellOptions,
        header: header && index === 0,
      })
    );

  return {
    children: rows,
    type: getPluginType(editor, ELEMENT_TABLE),
  };
};
