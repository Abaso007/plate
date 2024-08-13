import {
  type PlateEditor,
  getPluginOptions,
  isUrl,
  setNodes,
} from '@udecode/plate-common';
import { focusEditor } from '@udecode/plate-common/react';

import type { MediaPluginOptions, TMediaElement } from '../types';

import {
  floatingMediaActions,
  floatingMediaSelectors,
} from './floatingMediaStore';

export const submitFloatingMedia = (
  editor: PlateEditor,
  {
    element,
    pluginKey,
  }: {
    element: TMediaElement;
    pluginKey: string;
  }
) => {
  let url = floatingMediaSelectors.url();

  if (url === element.url) {
    floatingMediaActions.reset();

    return true;
  }

  const { isUrl: _isUrl = isUrl, transformUrl } =
    getPluginOptions<MediaPluginOptions>(editor, pluginKey);
  const isValid = _isUrl(url);

  if (!isValid) return;
  if (transformUrl) {
    url = transformUrl(url);
  }

  setNodes<TMediaElement>(editor, {
    url,
  });

  floatingMediaActions.reset();

  focusEditor(editor, editor.selection!);

  return true;
};
