import type { TNodeEntry } from '@udecode/slate';
import type { TEditableProps } from '@udecode/slate-react';
import type { Range } from 'slate';

import type { PlateEditor } from '../editor';

/**
 * @see {@link Decorate} .
 * Optimization: return undefined if empty list so Editable uses a memo.
 */
export const pipeDecorate = (
  editor: PlateEditor,
  decorateProp?:
    | ((ctx: { editor: PlateEditor; entry: TNodeEntry }) => Range[] | undefined)
    | null
): TEditableProps['decorate'] => {
  const relevantPlugins = editor.plugins.filter((plugin) => plugin.decorate);

  if (relevantPlugins.length === 0 && !decorateProp) return;

  return (entry: TNodeEntry) => {
    let ranges: Range[] = [];

    const addRanges = (newRanges?: Range[]) => {
      if (newRanges?.length) ranges = [...ranges, ...newRanges];
    };

    relevantPlugins.forEach((plugin) => {
      addRanges(
        plugin.decorate!({
          editor,
          entry,
          plugin,
        })
      );
    });

    if (decorateProp) {
      addRanges(
        decorateProp({
          editor,
          entry,
        })
      );
    }

    return ranges;
  };
};
