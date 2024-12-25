import {
  type SlateEditor,
  getAboveNode,
  getEditorPlugin,
  insertElements,
  isExpanded,
  removeNodes,
  setNodes,
  someNode,
} from '@udecode/plate-common';
import cloneDeep from 'lodash/cloneDeep.js';

import type { TableConfig } from '../BaseTablePlugin';

import {
  type TTableCellElement,
  type TTableElement,
  type TTableRowElement,
  findCellByIndexes,
  getCellIndices,
  getCellTypes,
  getTableColumnCount,
} from '..';
import { deleteRowWhenExpanded } from './deleteRowWhenExpanded';

export const deleteTableMergeRow = (editor: SlateEditor) => {
  const { api, tf, type } = getEditorPlugin<TableConfig>(editor, {
    key: 'table',
  });

  if (
    someNode(editor, {
      match: { type },
    })
  ) {
    const currentTableItem = getAboveNode<TTableElement>(editor, {
      match: { type },
    });

    if (!currentTableItem) return;
    if (isExpanded(editor.selection))
      return deleteRowWhenExpanded(editor, currentTableItem);

    const table = currentTableItem[0] as TTableElement;

    const selectedCellEntry = getAboveNode(editor, {
      match: { type: getCellTypes(editor) },
    });

    if (!selectedCellEntry) return;

    const selectedCell = selectedCellEntry[0] as TTableCellElement;
    const { row: deletingRowIndex } = getCellIndices(editor, {
      cellNode: selectedCell,
      tableNode: table,
    });
    const rowsDeleteNumber = api.table.getRowSpan(selectedCell);
    const endingRowIndex = deletingRowIndex + rowsDeleteNumber - 1;

    const colNumber = getTableColumnCount(table);
    const affectedCellsSet = new Set();
    // iterating by columns is important here to keep the order of affected cells
    Array.from({ length: colNumber }, (_, i) => i).forEach((cI) => {
      return Array.from({ length: rowsDeleteNumber }, (_, i) => i).forEach(
        (rI) => {
          const rowIndex = deletingRowIndex + rI;
          const found = findCellByIndexes(editor, table, rowIndex, cI);
          affectedCellsSet.add(found);
        }
      );
    });
    const affectedCells = Array.from(affectedCellsSet) as TTableCellElement[];

    const { moveToNextRowCells, squizeRowSpanCells } = affectedCells.reduce<{
      moveToNextRowCells: TTableCellElement[];
      squizeRowSpanCells: TTableCellElement[];
    }>(
      (acc, cur) => {
        if (!cur) return acc;

        const currentCell = cur as TTableCellElement;
        const { row: curRowIndex } = getCellIndices(editor, {
          cellNode: currentCell,
          tableNode: table,
        })!;
        const curRowSpan = api.table.getRowSpan(currentCell);

        // if (!curRowIndex || !curRowSpan) return acc;

        if (curRowIndex < deletingRowIndex && curRowSpan > 1) {
          acc.squizeRowSpanCells.push(currentCell);
        } else if (
          curRowSpan > 1 &&
          curRowIndex + curRowSpan - 1 > endingRowIndex
        ) {
          acc.moveToNextRowCells.push(currentCell);
        }

        return acc;
      },
      { moveToNextRowCells: [], squizeRowSpanCells: [] }
    );

    const nextRowIndex = deletingRowIndex + rowsDeleteNumber;
    const nextRow = table.children[nextRowIndex] as
      | TTableCellElement
      | undefined;

    if (nextRow === undefined && deletingRowIndex === 0) {
      tf.remove.table();

      return;
    }
    if (nextRow) {
      for (let index = 0; index < moveToNextRowCells.length; index++) {
        const curRowCell = moveToNextRowCells[index] as TTableCellElement;
        const { col: curRowCellColIndex, row: curRowCellRowIndex } =
          getCellIndices(editor, {
            cellNode: curRowCell,
            tableNode: table,
          })!;
        const curRowCellRowSpan = api.table.getRowSpan(curRowCell);

        // search for anchor cell where to place current cell
        const startingCellIndex = nextRow.children.findIndex((curC) => {
          const cell = curC as TTableCellElement;
          const { col: curColIndex } = getCellIndices(editor, {
            cellNode: cell,
            tableNode: table,
          })!;

          return curColIndex >= curRowCellColIndex;
        });

        if (startingCellIndex === -1) {
          const startingCell = nextRow.children.at(-1) as TTableCellElement;
          const startingCellPath = editor.findPath(startingCell)!;
          const tablePath = startingCellPath.slice(0, -2);
          const colPath = startingCellPath.at(-1)! + index + 1;
          const nextRowStartCellPath = [...tablePath, nextRowIndex, colPath];

          const rowsNumberAffected = endingRowIndex - curRowCellRowIndex + 1;
          const rowSpan = curRowCellRowSpan - rowsNumberAffected;
          const newCell = cloneDeep({ ...curRowCell, rowSpan });

          if (newCell.attributes?.rowspan) {
            newCell.attributes.rowspan = rowSpan.toString();
          }

          insertElements(editor, newCell, {
            at: nextRowStartCellPath,
          });

          continue;
        }

        const startingCell = nextRow.children[
          startingCellIndex
        ] as TTableCellElement;
        const { col: startingColIndex } = getCellIndices(editor, {
          cellNode: startingCell,
          tableNode: table,
        })!;

        // consider already inserted cell by adding index each time to the col path
        let incrementBy = index;

        if (startingColIndex < curRowCellColIndex) {
          // place current cell after starting cell, if placing cell col index is grather than col index of starting cell
          incrementBy += 1;
        }

        const startingCellPath = editor.findPath(startingCell)!;
        const tablePath = startingCellPath.slice(0, -2);
        const colPath = startingCellPath.at(-1)!;

        const nextRowStartCellPath = [
          ...tablePath,
          nextRowIndex,
          colPath + incrementBy,
        ];

        const rowsNumberAffected = endingRowIndex - curRowCellRowIndex + 1;
        const rowSpan = curRowCellRowSpan - rowsNumberAffected;
        const newCell = cloneDeep({ ...curRowCell, rowSpan });

        if (newCell.attributes?.rowspan) {
          newCell.attributes.rowspan = rowSpan.toString();
        }

        insertElements(editor, newCell, {
          at: nextRowStartCellPath,
        });
      }
    }

    squizeRowSpanCells.forEach((cur) => {
      const curRowCell = cur as TTableCellElement;
      const { row: curRowCellRowIndex } = getCellIndices(editor, {
        cellNode: curRowCell,
        tableNode: table,
      })!;
      const curRowCellRowSpan = api.table.getRowSpan(curRowCell);

      const curCellPath = editor.findPath(curRowCell)!;

      const curCellEndingRowIndex = Math.min(
        curRowCellRowIndex + curRowCellRowSpan - 1,
        endingRowIndex
      );
      const rowsNumberAffected = curCellEndingRowIndex - deletingRowIndex + 1;
      const rowSpan = curRowCellRowSpan - rowsNumberAffected;
      const newCell = cloneDeep({ ...curRowCell, rowSpan });

      if (newCell.attributes?.rowspan) {
        newCell.attributes.rowspan = rowSpan.toString();
      }

      setNodes<TTableCellElement>(editor, newCell, { at: curCellPath });
    });

    const rowToDelete = table.children[deletingRowIndex] as TTableRowElement;
    const rowPath = editor.findPath(rowToDelete);
    Array.from({ length: rowsDeleteNumber }).forEach(() => {
      removeNodes(editor, {
        at: rowPath,
      });
    });
  }
};
