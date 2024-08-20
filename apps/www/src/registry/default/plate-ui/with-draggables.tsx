import type { FC } from 'react';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import {
  ParagraphPlugin,
  createNodesWithHOC,
} from '@udecode/plate-common/react';
import {
  type WithDraggableOptions,
  withDraggable as withDraggablePrimitive,
} from '@udecode/plate-dnd';
import { HEADING_KEYS } from '@udecode/plate-heading';
import {
  ListOrderedPlugin,
  ListUnorderedPlugin,
} from '@udecode/plate-list/react';

import { Draggable, type DraggableProps } from './draggable';

export const withDraggable = (
  Component: FC,
  options?: WithDraggableOptions<
    Partial<Omit<DraggableProps, 'children' | 'editor' | 'element'>>
  >
) =>
  withDraggablePrimitive<DraggableProps>(Draggable, Component, options as any);

export const withDraggablesPrimitive = createNodesWithHOC(withDraggable);

export const withDraggables = (components: any) => {
  return withDraggablesPrimitive(components, [
    {
      keys: [
        ParagraphPlugin.key,
        ListUnorderedPlugin.key,
        ListOrderedPlugin.key,
      ],
      level: 0,
    },
    {
      draggableProps: {
        classNames: {
          blockToolbarWrapper: 'h-[1.3em]',
          gutterLeft: 'px-0 pb-1 text-[1.875em]',
        },
      },
      key: HEADING_KEYS.h1,
    },
    {
      draggableProps: {
        classNames: {
          blockToolbarWrapper: 'h-[1.3em]',
          gutterLeft: 'px-0 pb-1 text-[1.5em]',
        },
      },
      key: HEADING_KEYS.h2,
    },
    {
      draggableProps: {
        classNames: {
          blockToolbarWrapper: 'h-[1.3em]',
          gutterLeft: 'pt-[2px] px-0 pb-1 text-[1.25em]',
        },
      },
      key: HEADING_KEYS.h3,
    },
    {
      draggableProps: {
        classNames: {
          blockToolbarWrapper: 'h-[1.3em]',
          gutterLeft: 'pt-[3px] px-0 pb-0 text-[1.1em]',
        },
      },
      keys: [HEADING_KEYS.h4, HEADING_KEYS.h5],
    },
    {
      draggableProps: {
        classNames: {
          gutterLeft: 'pt-[3px] px-0 pb-0',
        },
      },
      keys: [ParagraphPlugin.key],
    },
    {
      draggableProps: {
        classNames: {
          gutterLeft: 'px-0 pb-0',
        },
      },
      keys: [HEADING_KEYS.h6, ListUnorderedPlugin.key, ListOrderedPlugin.key],
    },
    {
      draggableProps: {
        classNames: {
          gutterLeft: 'px-0 pb-0',
        },
      },
      key: BlockquotePlugin.key,
    },
    {
      draggableProps: {
        classNames: {
          gutterLeft: 'pt-8 px-0 pb-0',
        },
      },
      key: CodeBlockPlugin.key,
    },
  ]);
};
