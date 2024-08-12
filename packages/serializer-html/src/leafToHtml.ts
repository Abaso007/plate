import {
  type PlateEditor,
  type PlateRenderLeafProps,
  pipeInjectProps,
} from '@udecode/plate-common';
import { type PlateProps, pluginRenderLeaf } from '@udecode/plate-common/react';
import { decode } from 'html-entities';

import { createElementWithSlate } from './utils/createElementWithSlate';
import { renderToStaticMarkup } from './utils/renderToStaticMarkupClient';
import { stripClassNames } from './utils/stripClassNames';

export const leafToHtml = (
  editor: PlateEditor,
  {
    plateProps,
    preserveClassNames,
    props,
  }: {
    plateProps?: Partial<PlateProps>;
    preserveClassNames?: string[];
    props: Omit<PlateRenderLeafProps, 'plugin'>;
  }
) => {
  const { children } = props;

  return editor.pluginList.reduce((result, plugin) => {
    if (!plugin.isLeaf) return result;

    props = {
      ...pipeInjectProps(editor, props),
      children: result,
      plugin,
    };

    const serialized =
      plugin.serializeHtml?.(props as any) ??
      pluginRenderLeaf(editor, plugin)(props as any);

    if (serialized === children) return result;

    let html = decode(
      renderToStaticMarkup(
        createElementWithSlate({
          ...plateProps,
          children: serialized,
        })
      )
    );

    html = stripClassNames(html, { preserveClassNames });

    return html;
  }, children);
};
