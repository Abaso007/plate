import type React from 'react';

import { pipeInjectProps } from '@udecode/plate-common';
import {
  type PlateEditor,
  type PlateProps,
  type PlateRenderElementProps,
  pluginRenderElement,
} from '@udecode/plate-common/react';
import { decode } from 'html-entities';

import { stripClassNames } from '../lib/stripClassNames';
import { createElementWithSlate } from './utils/createElementWithSlate';
import { renderToStaticMarkup } from './utils/renderToStaticMarkupClient';

export const elementToHtml = (
  editor: PlateEditor,
  {
    dndWrapper,
    plateProps,
    preserveClassNames,
    props,
  }: {
    dndWrapper?: React.ComponentClass | React.FC | string;
    plateProps?: Partial<PlateProps>;
    preserveClassNames?: string[];
    props: Omit<PlateRenderElementProps, 'plugin'>;
  }
) => {
  let html = `<div>${props.children}</div>`;

  // If no type provided we wrap children with div tag
  if (!props.element.type) {
    return html;
  }

  props = pipeInjectProps(editor, props);

  // Search for matching plugin based on element type
  editor.pluginList.some((plugin) => {
    if (
      !plugin.isElement ||
      plugin.serializeHtml === null ||
      props.element.type !== plugin.type
    )
      return false;

    // Render element using picked plugins renderElement function and ReactDOM
    html = decode(
      renderToStaticMarkup(
        createElementWithSlate(
          {
            ...plateProps,
            children:
              plugin.serializeHtml?.({ ...props, plugin } as any) ??
              pluginRenderElement(editor, plugin)({ ...props, plugin }),
          },
          dndWrapper
        )
      )
    );

    html = stripClassNames(html, { preserveClassNames });

    return true;
  });

  return html;
};
