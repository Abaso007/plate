// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { PlatePluginComponent } from '@udecode/plate-common';

import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BlockquotePlugin } from '@udecode/plate-block-quote';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { CommentsPlugin } from '@udecode/plate-comments';
import { ParagraphPlugin } from '@udecode/plate-common';
import { PlateElement, PlateLeaf } from '@udecode/plate-common/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw';
import { FindReplacePlugin } from '@udecode/plate-find-replace';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
import { HighlightPlugin } from '@udecode/plate-highlight';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { KbdPlugin } from '@udecode/plate-kbd';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout';
import { LinkPlugin } from '@udecode/plate-link';
import {
  ListItemPlugin,
  ListOrderedPlugin,
  ListUnorderedPlugin,
  TodoListPlugin,
} from '@udecode/plate-list';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media';
import { MentionInputPlugin, MentionPlugin } from '@udecode/plate-mention';
import { SlashInputPlugin } from '@udecode/plate-slash-command';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table';
import { TogglePlugin } from '@udecode/plate-toggle';

import { BlockquoteElement } from '@/registry/default/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/registry/default/plate-ui/code-block-element';
import { CodeLeaf } from '@/registry/default/plate-ui/code-leaf';
import { CodeLineElement } from '@/registry/default/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/registry/default/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/registry/default/plate-ui/column-element';
import { ColumnGroupElement } from '@/registry/default/plate-ui/column-group-element';
import { CommentLeaf } from '@/registry/default/plate-ui/comment-leaf';
import { EmojiInputElement } from '@/registry/default/plate-ui/emoji-input-element';
import { ExcalidrawElement } from '@/registry/default/plate-ui/excalidraw-element';
import { HeadingElement } from '@/registry/default/plate-ui/heading-element';
import { HighlightLeaf } from '@/registry/default/plate-ui/highlight-leaf';
import { HrElement } from '@/registry/default/plate-ui/hr-element';
import { ImageElement } from '@/registry/default/plate-ui/image-element';
import { KbdLeaf } from '@/registry/default/plate-ui/kbd-leaf';
import { LinkElement } from '@/registry/default/plate-ui/link-element';
import { ListElement } from '@/registry/default/plate-ui/list-element';
import { MediaEmbedElement } from '@/registry/default/plate-ui/media-embed-element';
import { MentionElement } from '@/registry/default/plate-ui/mention-element';
import { MentionInputElement } from '@/registry/default/plate-ui/mention-input-element';
import { ParagraphElement } from '@/registry/default/plate-ui/paragraph-element';
import { withPlaceholders } from '@/registry/default/plate-ui/placeholder';
import { SearchHighlightLeaf } from '@/registry/default/plate-ui/search-highlight-leaf';
import { SlashInputElement } from '@/registry/default/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/registry/default/plate-ui/table-cell-element';
import { TableElement } from '@/registry/default/plate-ui/table-element';
import { TableRowElement } from '@/registry/default/plate-ui/table-row-element';
import { TodoListElement } from '@/registry/default/plate-ui/todo-list-element';
import { ToggleElement } from '@/registry/default/plate-ui/toggle-element';
import { withDraggables } from '@/registry/default/plate-ui/with-draggables';

export const createPlateUI = ({
  draggable,
  placeholder,
}: { draggable?: boolean; placeholder?: boolean } = {}) => {
  let components: Record<string, PlatePluginComponent> = {
    [BlockquotePlugin.key]: BlockquoteElement,
    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
    [CodeBlockPlugin.key]: CodeBlockElement,
    [CodeLinePlugin.key]: CodeLineElement,
    [CodePlugin.key]: CodeLeaf,
    [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
    [ColumnItemPlugin.key]: ColumnElement,
    [ColumnPlugin.key]: ColumnGroupElement,
    [CommentsPlugin.key]: CommentLeaf,
    [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
    [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
    [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
    [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
    [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
    [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
    [EmojiInputPlugin.key]: EmojiInputElement,
    [ExcalidrawPlugin.key]: ExcalidrawElement,
    [FindReplacePlugin.key]: SearchHighlightLeaf,
    [HighlightPlugin.key]: HighlightLeaf,
    [HorizontalRulePlugin.key]: HrElement,
    [ImagePlugin.key]: ImageElement,
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
    [KbdPlugin.key]: KbdLeaf,
    [LinkPlugin.key]: LinkElement,
    [ListItemPlugin.key]: withProps(PlateElement, { as: 'li' }),
    [ListOrderedPlugin.key]: withProps(ListElement, { variant: 'ol' }),
    [ListUnorderedPlugin.key]: withProps(ListElement, { variant: 'ul' }),
    [MediaEmbedPlugin.key]: MediaEmbedElement,
    [MentionInputPlugin.key]: MentionInputElement,
    [MentionPlugin.key]: MentionElement,
    [ParagraphPlugin.key]: ParagraphElement,
    [SlashInputPlugin.key]: SlashInputElement,
    [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
    [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
    [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
    [TableCellHeaderPlugin.key]: TableCellHeaderElement,
    [TableCellPlugin.key]: TableCellElement,
    [TablePlugin.key]: TableElement,
    [TableRowPlugin.key]: TableRowElement,
    [TodoListPlugin.key]: TodoListElement,
    [TogglePlugin.key]: ToggleElement,
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  };

  if (placeholder) {
    components = withPlaceholders(components);
  }
  if (draggable) {
    components = withDraggables(components);
  }

  return components;
};
