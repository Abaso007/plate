import type { ExtendConfig } from '@udecode/plate-common';

import { toTPlatePlugin } from '@udecode/plate-common/react';

import {
  type BaseMediaEmbedConfig,
  BaseMediaEmbedPlugin,
  insertImage,
} from '../../lib';

type MediaEmbedConfig = ExtendConfig<
  BaseMediaEmbedConfig,
  {
    isFloatingOpen?: boolean;
    mediaType?: string | null;
    url?: string;
  },
  {
    media_embed: MediaEmbedApi;
  }
>;

export type MediaEmbedApi = {
  hideFloating: () => void;
  openFloating: (mediaType: string) => void;
};

export const MediaEmbedPlugin = toTPlatePlugin<MediaEmbedConfig>(
  BaseMediaEmbedPlugin,
  {
    options: {
      isFloatingOpen: false,
      mediaType: null,
      url: '',
    },
  }
).extendTransforms(({ api, editor, getOptions, setOptions }) => ({
  embed: (url: string) => {
    setOptions({ isFloatingOpen: false, url });

    const isUrl = getOptions().isUrl;

    if (!isUrl?.(url)) return;

    insertImage(editor, url);

    api.media_embed.hideFloating();
  },
}));
