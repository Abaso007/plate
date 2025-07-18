import React from 'react';

import clsx from 'clsx';

import type { EditableProps } from '../../lib';
import type { PlateEditor } from '../editor/PlateEditor';
import type { AnyEditorPlatePlugin } from '../plugin';

import { PlateLeaf } from '../components';
import { useReadOnly } from '../slate-react';
import { getRenderNodeProps } from './getRenderNodeProps';
import { type RenderLeaf, pluginRenderLeaf } from './pluginRenderLeaf';

/** @see {@link RenderLeaf} */
export const pipeRenderLeaf = (
  editor: PlateEditor,
  renderLeafProp?: EditableProps['renderLeaf']
): EditableProps['renderLeaf'] => {
  const renderLeafs: RenderLeaf[] = [];
  const leafPropsPlugins: AnyEditorPlatePlugin[] = [];

  editor.meta.pluginCache.node.isLeaf.forEach((key) => {
    const plugin = editor.getPlugin({ key });

    if (plugin) {
      renderLeafs.push(pluginRenderLeaf(editor, plugin as any));
    }
  });

  editor.meta.pluginCache.node.leafProps.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) {
      leafPropsPlugins.push(plugin as any);
    }
  });

  return function render({ attributes, ...props }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const readOnly = useReadOnly();

    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props as any);

      if (newChildren !== undefined) {
        props.children = newChildren;
      }
    });

    leafPropsPlugins.forEach((plugin) => {
      if (props.leaf[plugin.node.type]) {
        const pluginLeafProps =
          typeof plugin.node.leafProps === 'function'
            ? plugin.node.leafProps(props as any)
            : (plugin.node.leafProps ?? {});

        if (pluginLeafProps.className) {
          pluginLeafProps.className = clsx(
            (props as any).className,
            pluginLeafProps.className
          );
        }

        attributes = {
          ...attributes,
          ...pluginLeafProps,
        };
      }
    });

    if (renderLeafProp) {
      return renderLeafProp({ attributes, ...props } as any);
    }

    const ctxProps = getRenderNodeProps({
      editor,
      props: { attributes, ...props } as any,
      readOnly,
    }) as any;

    return <PlateLeaf {...ctxProps}>{props.children}</PlateLeaf>;
  };
};
