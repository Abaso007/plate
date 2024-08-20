import type { ExtendConfig, HotkeyPluginOptions } from '@udecode/plate-common';

import {
  type PlateRenderElementProps,
  toTPlatePlugin,
} from '@udecode/plate-common/react';

import {
  type IndentListConfig as BaseIndentListConfig,
  IndentListPlugin as BaseIndentListPlugin,
} from '../lib';
import { injectIndentListComponent } from './injectIndentListComponent';
import { onKeyDownIndentList } from './onKeyDownIndentList';

export type IndentListConfig = ExtendConfig<
  BaseIndentListConfig,
  {
    listStyleTypes?: Record<
      string,
      {
        isOrdered?: boolean;
        liComponent?: React.FC<PlateRenderElementProps>;
        markerComponent?: React.FC<Omit<PlateRenderElementProps, 'children'>>;
        type: string;
      }
    >;
  } & HotkeyPluginOptions
>;

/** Enables support for indented lists with React-specific features. */
export const IndentListPlugin = toTPlatePlugin<IndentListConfig>(
  BaseIndentListPlugin,
  {
    handlers: {
      onKeyDown: onKeyDownIndentList,
    },
    inject: {
      belowComponent: injectIndentListComponent,
    },
  }
);
