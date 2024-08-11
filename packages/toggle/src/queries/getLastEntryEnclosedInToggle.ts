import type { PlateEditor, TNodeEntry } from '@udecode/plate-common/server';

import last from 'lodash/last.js';

import { buildToggleIndex } from '../toggle-controller-store';

export const getLastEntryEnclosedInToggle = (
  editor: PlateEditor,
  toggleId: string
): TNodeEntry | undefined => {
  const toggleIndex = buildToggleIndex(editor.children);
  const entriesInToggle = editor.children
    .map((node, index) => [node, [index]] as TNodeEntry)
    .filter(([node]) => {
      return (toggleIndex.get(node.id) || []).includes(toggleId);
    });

  return last(entriesInToggle);
};
