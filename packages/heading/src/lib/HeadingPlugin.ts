import {
  type PluginConfig,
  type SlatePlugin,
  createSlatePlugin,
  createTSlatePlugin,
} from '@udecode/plate-common';

import { HEADING_LEVELS } from './constants';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingConfig = PluginConfig<
  'heading',
  {
    /** Heading levels supported from 1 to `levels` */
    levels?: HeadingLevel | HeadingLevel[];
  }
>;

/** Enables support for headings with configurable levels (from 1 to 6). */
export const HeadingPlugin = createTSlatePlugin<HeadingConfig>({
  key: 'heading',
  options: {
    levels: [1, 2, 3, 4, 5, 6],
  },
}).extend(({ plugin }) => {
  const {
    options: { levels },
  } = plugin;

  const plugins: SlatePlugin[] = [];

  const headingLevels = Array.isArray(levels)
    ? levels
    : Array.from({ length: levels || 6 }, (_, i) => i + 1);

  headingLevels.forEach((level) => {
    const plugin: SlatePlugin = createSlatePlugin({
      deserializeHtml: {
        rules: [
          {
            validNodeName: `H${level}`,
          },
        ],
      },
      isElement: true,
      key: HEADING_LEVELS[level - 1],
    });

    plugins.push(plugin);
  });

  return {
    plugins,
  };
});
