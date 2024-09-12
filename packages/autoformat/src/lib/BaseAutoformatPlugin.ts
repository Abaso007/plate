import { type PluginConfig, createTSlatePlugin } from '@udecode/plate-common';

import type { AutoformatPluginOptions } from './types';

import { withAutoformat } from './withAutoformat';

export type AutoformatConfig = PluginConfig<
  'autoformat',
  AutoformatPluginOptions
>;

/** @see {@link withAutoformat} */
export const BaseAutoformatPlugin = createTSlatePlugin<AutoformatConfig>({
  extendEditor: withAutoformat,
  key: 'autoformat',
  options: {
    rules: [],
  },
});
