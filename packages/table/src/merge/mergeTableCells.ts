import {
  type PlateEditor,
  type TDescendant,
  type TNodeEntry,
  collapseSelection,
  getBlockAbove,
  getPluginOptions,
  getPluginType,
  insertElements,
  isElementEmpty,
  removeNodes,
  withoutNormalizing,
} from '@udecode/plate-common/server';
import cloneDeep from 'lodash/cloneDeep.js';

import type {
  TTableCellElement,
  TTableElement,
  TablePluginOptions,
} from '../types';

import { ELEMENT_TABLE, ELEMENT_TH } from '../TablePlugin';
import { getTableGridAbove } from '../queries';
import { getColSpan } from '../queries/getColSpan';
import { getRowSpan } from '../queries/getRowSpan';
import { computeCellIndices } from './computeCellIndices';
import { getCellIndices } from './getCellIndices';

/** Merges multiple selected cells into one. */
export const mergeTableCells = (editor: PlateEditor) => {
  withoutNormalizing(editor, () => {
    const { _cellIndices, cellFactory, getCellChildren } =
      getPluginOptions<TablePluginOptions>(editor, ELEMENT_TABLE);
    const tableEntry = getBlockAbove(editor, {
      at: editor.selection?.anchor.path,
      match: { type: getPluginType(editor, ELEMENT_TABLE) },
    })!;

    const cellEntries = getTableGridAbove(editor, {
      format: 'cell',
    }) as TNodeEntry<TTableCellElement>[];

    // calculate the colSpan which is the number of horizontal cells that a cell should span.
    let colSpan = 0;

    for (const entry of cellEntries) {
      const [cell, path] = entry;

      const rowIndex = path.at(-2)!;

      // count only those cells that are in the first selected row.
      if (rowIndex === cellEntries[0][1].at(-2)!) {
        const cellColSpan = getColSpan(cell as TTableCellElement);
        colSpan += cellColSpan;
      }
    }

    // calculate the rowSpan which is the number of vertical cells that a cell should span.
    let rowSpan = 0;
    const { col } = getCellIndices(
      _cellIndices!,
      cellEntries[0][0] as TTableCellElement
    )!;
    cellEntries.forEach((entry) => {
      const cell = entry[0] as TTableCellElement;
      const { col: curCol } =
        _cellIndices?.get(cell) ||
        computeCellIndices(editor, tableEntry[0] as TTableElement, cell)!;

      if (col === curCol) {
        rowSpan += getRowSpan(cell);
      }
    });

    // This will store the content of all cells we are merging
    const mergingCellChildren: TDescendant[] = [];

    for (const cellEntry of cellEntries) {
      const [el] = cellEntry;

      const cellChildren = getCellChildren!(el);

      if (
        cellChildren.length !== 1 ||
        !isElementEmpty(editor, cellChildren[0] as any)
      ) {
        mergingCellChildren.push(...cloneDeep(cellChildren));
      }
    }

    // Create a hash map where keys are col paths,
    // and values are an array of all paths with that column
    const cols: Record<string, number[][]> = {};

    cellEntries.forEach(([_entry, path]) => {
      const rowIndex = path.at(-2)!;

      if (cols[rowIndex]) {
        cols[rowIndex].push(path);
      } else {
        cols[rowIndex] = [path];
      }
    });

    // removes multiple cells with on same path.
    // once cell removed, next cell in the row will settle down on that path
    Object.values(cols).forEach((paths) => {
      paths?.forEach(() => {
        removeNodes(editor, { at: paths[0] });
      });
    });

    // Create a new cell to replace the merged cells, with
    // calculated colSpan and rowSpan attributes and combined content
    const mergedCell = {
      ...cellFactory!({
        children: mergingCellChildren,
        header: cellEntries[0][0].type === getPluginType(editor, ELEMENT_TH),
      }),
      colSpan,
      rowSpan,
    };

    // insert the new merged cell in place of the first cell in the selection
    insertElements(editor, mergedCell, { at: cellEntries[0][1] });
    collapseSelection(editor);
  });
};
