import {
  createPlugin,
  onKeyDownToggleMark,
} from '@udecode/plate-common/server';

export const MARK_KBD = 'kbd';

/** Enables support for code formatting */
export const KbdPlugin = createPlugin({
  deserializeHtml: {
    rules: [{ validNodeName: ['KBD'] }],
  },
  handlers: {
    onKeyDown: onKeyDownToggleMark,
  },
  isLeaf: true,
  key: MARK_KBD,
});
