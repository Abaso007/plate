'use client';

import React, { useState } from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate-common/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { ListStyleType } from '@udecode/plate-indent-list';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  KeyboardIcon,
  MoreHorizontalIcon,
  PaintBucketIcon,
  SparklesIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';
import { AIToolbarButton } from './ai-toolbar-button';
import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { IndentListToolbarButton } from './indent-list-toolbar-button';
import { IndentTodoToolbarButton } from './indent-todo-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaDropdownMenu } from './media-dropdown-menu';
import { ModeDropdownMenu } from './mode-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarButton, ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';

export function FixedToolbarButtons() {
  const [value, setValue] = useState('');
  const expanded = value === 'toolbar';

  return (
    <Accordion
      className="w-full"
      onValueChange={setValue}
      type="single"
      collapsible
    >
      <AccordionItem className="border-b-0" value="toolbar">
        <PrimaryButtons expanded={expanded} />
        <AccordionContent className="p-0">
          <ExpandedButtons />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PrimaryButtons({ expanded }: { expanded: boolean }) {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <AIToolbarButton
              className="gap-1.5 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-500"
              tooltip="Edit, generate, and more"
            >
              <SparklesIcon className="!size-3.5" />
              Ask AI
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <InsertDropdownMenu />
            <TurnIntoDropdownMenu />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={ItalicPlugin.key}
              tooltip="Italic (⌘+I)"
            >
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={UnderlinePlugin.key}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={StrikethroughPlugin.key}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
              <Code2Icon />
            </MarkToolbarButton>

            <ColorDropdownMenu
              nodeType={FontColorPlugin.key}
              tooltip="Text color"
            >
              <BaselineIcon />
            </ColorDropdownMenu>

            <ColorDropdownMenu
              nodeType={FontBackgroundColorPlugin.key}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </ColorDropdownMenu>
          </ToolbarGroup>

          <ToolbarGroup>
            <AlignDropdownMenu />

            <IndentListToolbarButton nodeType={ListStyleType.Disc} />
            <IndentListToolbarButton nodeType={ListStyleType.Decimal} />
            <IndentTodoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <LinkToolbarButton />
            <ToggleToolbarButton />
            <TableDropdownMenu />
            <EmojiDropdownMenu />
          </ToolbarGroup>

          <ToolbarGroup>
            <MediaDropdownMenu nodeType={ImagePlugin.key} />
            <MediaDropdownMenu nodeType={VideoPlugin.key} />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      <ToolbarGroup>
        <CommentToolbarButton />
        <ModeDropdownMenu />
        <AccordionTrigger className="p-0" hideIcon>
          <ToolbarButton pressed={expanded} tooltip="More">
            <MoreHorizontalIcon />
          </ToolbarButton>
        </AccordionTrigger>
      </ToolbarGroup>
    </div>
  );
}

function ExpandedButtons() {
  return (
    <div className="mt-1 flex w-full">
      <ToolbarGroup>
        <LineHeightDropdownMenu />
        <OutdentToolbarButton />
        <IndentToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MediaDropdownMenu nodeType={AudioPlugin.key} />
        <MediaDropdownMenu nodeType={FilePlugin.key} />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkToolbarButton nodeType={HighlightPlugin.key} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>

        <MarkToolbarButton nodeType={KbdPlugin.key} tooltip="Keyboard input">
          <KeyboardIcon />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={SuperscriptPlugin.key}
          tooltip="Superscript"
        >
          <SuperscriptIcon />
        </MarkToolbarButton>

        <MarkToolbarButton nodeType={SubscriptPlugin.key} tooltip="Subscript">
          <SubscriptIcon />
        </MarkToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
