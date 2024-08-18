import type { EXPOSED_STORE_KEYS, PlateStoreState } from '../stores';

import { DebugPlugin, createSlatePlugin } from '../../lib';

export const PlateApiPlugin = createSlatePlugin({
  dependencies: [DebugPlugin.key],
  key: 'plateApi',
}).extendApi(({ editor }) => ({
  redecorate: () => {
    editor.api.debug.warn(
      `editor.api.redecorate should have been overridden but was not. Please report this issue here: https://github.com/udecode/plate/issues`,
      'OVERRIDE_MISSING'
    );
  },
  setStoreValue: {} as {
    [K in (typeof EXPOSED_STORE_KEYS)[number]]: (
      value: PlateStoreState<any>[K]
    ) => void;
  },
}));
