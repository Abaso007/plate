import { type PluginConfig, createTSlatePlugin } from '@udecode/plate-common';

import type { AutoformatPluginOptions } from './types';

import { onKeyDownAutoformat } from './onKeyDownAutoformat';
import { withAutoformat } from './withAutoformat';

export type AutoformatConfig = PluginConfig<
  'autoformat',
  AutoformatPluginOptions
>;

/** @see {@link withAutoformat} */
export const AutoformatPlugin = createTSlatePlugin<AutoformatConfig>({
  handlers: {
    onKeyDown: onKeyDownAutoformat,
  },
  key: 'autoformat',
  options: {
    rules: [],
  },
  withOverrides: withAutoformat,
});
