import React from 'react';

import type { PluginConfig } from '@udecode/plate-core';
import type { Path, TElement } from '@udecode/slate';

import {
  type PlatePluginContext,
  createTPlatePlugin,
  ParagraphPlugin,
  useEditorComposing,
  useEditorReadOnly,
  useEditorSelector,
  useFocused,
  usePluginOption,
} from '@udecode/plate-core/react';

import { KEYS } from '../../lib';

export type BlockPlaceholderConfig = PluginConfig<
  'blockPlaceholder',
  {
    _target: { node: TElement; placeholder: string } | null;
    placeholders: Record<string, string>;
    query: (
      context: PlatePluginContext<BlockPlaceholderConfig> & {
        node: TElement;
        path: Path;
      }
    ) => boolean;
    className?: string;
  }
>;

export const BlockPlaceholderPlugin =
  createTPlatePlugin<BlockPlaceholderConfig>({
    key: KEYS.blockPlaceholder,
    editOnly: true,
    options: {
      _target: null,
      placeholders: {
        [ParagraphPlugin.key]: 'Type something...',
      },
      query: ({ path }) => {
        return path.length === 1;
      },
    },
    useHooks: (ctx) => {
      const { editor, getOptions, setOption } = ctx;
      const focused = useFocused();

      const readOnly = useEditorReadOnly();
      const composing = useEditorComposing();
      const entry = useEditorSelector(() => {
        if (
          readOnly ||
          composing ||
          !focused ||
          !editor.selection ||
          editor.api.isExpanded()
        )
          return null;

        return editor.api.block();
      }, [readOnly, composing, focused]);

      React.useEffect(() => {
        if (!entry) {
          setOption('_target', null);
          return;
        }

        const { placeholders, query } = getOptions();

        const [element, path] = entry;

        const placeholder = Object.keys(placeholders).find(
          (key) => editor.getType(key) === element.type
        );

        if (
          query({ ...ctx, node: element, path }) &&
          placeholder &&
          editor.api.isEmpty(element) &&
          !editor.api.isEmpty()
        ) {
          setOption('_target', {
            node: element,
            placeholder: placeholders[placeholder],
          });
        } else {
          setOption('_target', null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [editor, entry, setOption, getOptions]);
    },
  })
    .extendSelectors(({ getOption }) => ({
      placeholder: (node: TElement) => {
        const target = getOption('_target');

        if (target?.node === node) {
          return target.placeholder;
        }
      },
    }))
    .extend({
      inject: {
        isBlock: true,
        nodeProps: {
          transformProps: (props) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const placeholder = usePluginOption(
              props.plugin,
              'placeholder',
              props.element!
            );

            if (placeholder) {
              return {
                className: props.getOption('className'),
                placeholder,
              };
            }
          },
        },
      },
    });
