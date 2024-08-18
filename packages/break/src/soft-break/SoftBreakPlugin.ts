import {
  type PluginConfig,
  type QueryNodeOptions,
  createTSlatePlugin,
} from '@udecode/plate-common';

import { onKeyDownSoftBreak } from './onKeyDownSoftBreak';

export interface SoftBreakRule {
  hotkey: string;

  /** Filter the block types where the rule applies. */
  query?: QueryNodeOptions;
}

export type SoftBreakConfig = PluginConfig<
  'softBreak',
  {
    rules?: SoftBreakRule[];
  }
>;

/**
 * Insert soft break following configurable rules. Each rule specifies a hotkey
 * and query options.
 */
export const SoftBreakPlugin = createTSlatePlugin<SoftBreakConfig>({
  handlers: {
    onKeyDown: onKeyDownSoftBreak,
  },
  key: 'softBreak',
  options: {
    rules: [{ hotkey: 'shift+enter' }],
  },
});
