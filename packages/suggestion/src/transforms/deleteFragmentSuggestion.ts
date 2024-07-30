import {
  type PlateEditor,
  collapseSelection,
  getEdgePoints,
  withoutNormalizing,
} from '@udecode/plate-common/server';

import { deleteSuggestion } from './deleteSuggestion';

export const deleteFragmentSuggestion = (
  editor: PlateEditor,
  { reverse }: { reverse?: boolean } = {}
) => {
  withoutNormalizing(editor, () => {
    const selection = editor.selection!;

    const [start, end] = getEdgePoints(editor, selection);

    if (reverse) {
      collapseSelection(editor, { edge: 'end' });
      deleteSuggestion(
        editor,
        { anchor: end, focus: start },
        { reverse: true }
      );
    } else {
      collapseSelection(editor, { edge: 'start' });
      deleteSuggestion(editor, { anchor: start, focus: end });
    }
  });
};
