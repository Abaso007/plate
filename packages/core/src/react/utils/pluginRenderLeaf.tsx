import React from 'react';

import type { PlateEditor } from '../../lib';
import type { AnyEditorPlugin } from '../../lib/plugin/types/PlatePlugin';
import type { PlateRenderLeafProps } from '../../lib/plugin/types/PlateRenderLeafProps';

import { getRenderNodeProps } from '../../lib/utils/getRenderNodeProps';
import { DefaultLeaf } from '../components/DefaultLeaf';

export type RenderLeaf = (props: PlateRenderLeafProps) => React.ReactElement;

/**
 * Get a `Editable.renderLeaf` handler for `options.type`. If the type is equals
 * to the slate leaf type, render `options.component`. Else, return `children`.
 */
export const pluginRenderLeaf = (
  editor: PlateEditor,
  plugin: AnyEditorPlugin
): RenderLeaf =>
  function render(nodeProps) {
    const { component } = plugin;
    const { children, leaf } = nodeProps;

    if (leaf[plugin.type ?? plugin.key]) {
      const Leaf = component ?? DefaultLeaf;

      nodeProps = getRenderNodeProps({
        attributes: leaf.attributes as any,
        nodeProps: nodeProps as any,
        plugin,
      }) as any;

      return <Leaf {...nodeProps}>{children}</Leaf>;
    }

    return children;
  };
