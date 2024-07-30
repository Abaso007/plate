import type { KeyboardHandler } from '@udecode/plate-common';

import {
  getBlockAbove,
  isHotkey,
  queryNode,
} from '@udecode/plate-common/server';

import type { ExitBreakPluginOptions } from './types';

import { exitBreak } from './transforms/exitBreak';

export const onKeyDownExitBreak: KeyboardHandler<ExitBreakPluginOptions> =
  (editor, { options: { rules = [] } }) =>
  (event) => {
    if (event.defaultPrevented) return;

    const entry = getBlockAbove(editor);

    if (!entry) return;

    rules.forEach(({ hotkey, ...rule }) => {
      if (
        isHotkey(hotkey, event as any) &&
        queryNode(entry, rule.query) &&
        exitBreak(editor as any, rule)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  };
