import React from 'react';

import type { TEditableProps } from '@udecode/slate-react';

import type { PlateEditor } from '../plugin/PlateEditor';
import type { PlateRenderLeafProps } from '../plugin/PlateRenderLeafProps';

import { pipeInjectProps } from '../../lib/utils/pipeInjectProps';
import { DefaultLeaf } from '../components';
import { type RenderLeaf, pluginRenderLeaf } from './pluginRenderLeaf';

/** @see {@link RenderLeaf} */
export const pipeRenderLeaf = (
  editor: PlateEditor,
  renderLeafProp?: TEditableProps['renderLeaf']
): TEditableProps['renderLeaf'] => {
  const renderLeafs: RenderLeaf[] = [];

  editor.pluginList.forEach((plugin) => {
    if (plugin.isLeaf && plugin.key) {
      renderLeafs.push(pluginRenderLeaf(editor, plugin));
    }
  });

  return function render(nodeProps) {
    const props = pipeInjectProps(editor, nodeProps) as PlateRenderLeafProps;

    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props as any);

      if (newChildren !== undefined) {
        props.children = newChildren;
      }
    });

    if (renderLeafProp) {
      return renderLeafProp(props);
    }

    return <DefaultLeaf {...props} />;
  };
};
