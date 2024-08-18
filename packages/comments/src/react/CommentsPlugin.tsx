import type { PluginConfig } from '@udecode/plate-common';

import { extendPlatePlugin } from '@udecode/plate-common/react';

import { CommentsPlugin as BaseCommentsPlugin } from '../lib/CommentsPlugin';
import { useHooksComments } from './useHooksComments';

export type CommentsConfig = PluginConfig<
  'comment',
  {
    hotkey?: string | string[];
  }
>;

/** Enables support for comments in the editor. */
export const CommentsPlugin = extendPlatePlugin(BaseCommentsPlugin, {
  options: {
    hotkey: ['meta+shift+m', 'ctrl+shift+m'],
  },
  useHooks: useHooksComments,
});
