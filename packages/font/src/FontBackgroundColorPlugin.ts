import { createPlugin } from '@udecode/plate-common';

export const MARK_BG_COLOR = 'backgroundColor';

export const FontBackgroundColorPlugin = createPlugin({
  inject: {
    props: {
      nodeKey: MARK_BG_COLOR,
    },
  },
  key: MARK_BG_COLOR,
}).extend(({ plugin: { type } }) => ({
  deserializeHtml: {
    getNode: ({ element }) => ({ [type]: element.style.backgroundColor }),
    isLeaf: true,
    rules: [
      {
        validStyle: {
          backgroundColor: '*',
        },
      },
    ],
  },
}));
