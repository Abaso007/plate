import type { DropTargetMonitor } from 'react-dnd';

import { collapseSelection, isExpanded } from '@udecode/plate-common';
import { type TReactEditor, focusEditor } from '@udecode/plate-common/react';

import type { UseDropNodeOptions } from '../hooks/useDropNode';
import type { DragItemNode } from '../types';

import { getHoverDirection, getNewDirection } from '../utils';

/** Callback called when dragging a node and hovering nodes. */
export const onHoverNode = (
  editor: TReactEditor,
  {
    dragItem,
    dropLine,
    id,
    monitor,
    nodeRef,
    onChangeDropLine,
  }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<
    UseDropNodeOptions,
    'dropLine' | 'id' | 'nodeRef' | 'onChangeDropLine'
  >
) => {
  const direction = getHoverDirection({
    dragItem,
    id,
    monitor,
    nodeRef,
  });
  const dropLineDir = getNewDirection(dropLine, direction);

  if (dropLineDir) onChangeDropLine(dropLineDir);
  if (direction && isExpanded(editor.selection)) {
    focusEditor(editor);
    collapseSelection(editor);
  }
};
