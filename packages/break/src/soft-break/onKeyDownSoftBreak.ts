import type { KeyboardHandler } from '@udecode/plate-common';

import {
  getBlockAbove,
  isHotkey,
  queryNode,
} from '@udecode/plate-common/server';

import type { SoftBreakPluginOptions } from './types';

export const onKeyDownSoftBreak: KeyboardHandler<SoftBreakPluginOptions> =
  (editor, { options: { rules = [] } }) =>
  (event) => {
    if (event.defaultPrevented) return;

    const entry = getBlockAbove(editor);

    if (!entry) return;

    rules.forEach(({ hotkey, query }) => {
      if (isHotkey(hotkey, event as any) && queryNode(entry, query)) {
        event.preventDefault();
        event.stopPropagation();

        editor.insertText('\n');
      }
    });
  };
