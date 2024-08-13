import { AlignPlugin } from '@udecode/plate-alignment';
import { AutoformatPlugin } from '@udecode/plate-autoformat';
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
  ExitBreakPlugin,
  SingleLinePlugin,
  SoftBreakPlugin,
} from '@udecode/plate-break';
import { CommentsPlugin } from '@udecode/plate-comments';
import { ParagraphPlugin } from '@udecode/plate-common';
import { DndPlugin } from '@udecode/plate-dnd';
import { EmojiPlugin } from '@udecode/plate-emoji';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font';
import { HighlightPlugin } from '@udecode/plate-highlight';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { IndentPlugin } from '@udecode/plate-indent';
import { IndentListPlugin } from '@udecode/plate-indent-list';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd';
import { LineHeightPlugin } from '@udecode/plate-line-height';
import { LinkPlugin } from '@udecode/plate-link';
import { TodoListPlugin } from '@udecode/plate-list';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media';
import { MentionPlugin } from '@udecode/plate-mention';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { NormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { ResetNodePlugin } from '@udecode/plate-reset-node';
import { DeletePlugin, SelectOnBackspacePlugin } from '@udecode/plate-select';
import { BlockSelectionPlugin } from '@udecode/plate-selection';
import { DeserializeCsvPlugin } from '@udecode/plate-serializer-csv';
import { DeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { DeserializeMdPlugin } from '@udecode/plate-serializer-md';
import { TabbablePlugin } from '@udecode/plate-tabbable';
import { TablePlugin } from '@udecode/plate-table';
import { TogglePlugin } from '@udecode/plate-toggle';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { DragOverCursorPlugin } from '@/plate/demo/plugins/DragOverCursorPlugin';

export const descriptions: Record<string, string> = {
  [AlignPlugin.key]: 'Align your content to different positions.',
  [AutoformatPlugin.key]: 'Apply formatting automatically using shortcodes.',
  [BlockSelectionPlugin.key]: 'Select and manipulate entire text blocks.',
  [BlockquotePlugin.key]: 'Highlight important text or citations.',
  [BoldPlugin.key]: 'Make your text stand out.',
  [CodePlugin.key]: 'Embed code into your text.',
  [CommentsPlugin.key]: 'Add comments to text as marks.',
  [DeletePlugin.key]:
    'Remove the current block if empty when pressing delete forward',
  [DeserializeCsvPlugin.key]: 'Copy paste from CSV to Slate.',
  [DeserializeDocxPlugin.key]: 'Copy paste from DOCX to Slate.',
  [DeserializeMdPlugin.key]: 'Copy paste from MD to Slate.',
  [DndPlugin.key]: 'Move blocks within the editor.',
  [DragOverCursorPlugin.key]: 'Customize the cursor when dragging.',
  [EmojiPlugin.key]: 'Enhance your text with emojis.',
  [ExcalidrawPlugin.key]: 'Create drawings and diagrams as block nodes.',
  [ExitBreakPlugin.key]: 'Exit a large block using a shortcut.',
  [FontBackgroundColorPlugin.key]: 'Add color to text backgrounds.',
  [FontColorPlugin.key]: 'Highlight text with a specific color.',
  [FontSizePlugin.key]: 'Adjust the size of the text.',
  [HighlightPlugin.key]: 'Mark and reference text for review.',
  [HorizontalRulePlugin.key]: 'Insert horizontal lines.',
  [ImagePlugin.key]: 'Embed images into your document.',
  [IndentListPlugin.key]:
    'Turn any block into a list item. Alternative to List.',
  [IndentPlugin.key]: 'Customize text indentation.',
  [ItalicPlugin.key]: 'Emphasize your text.',
  [JuicePlugin.key]:
    'Inline CSS properties into the `style` attribute when pasting HTML.',
  [KbdPlugin.key]: 'Indicate keyboard inputs or commands.',
  [LineHeightPlugin.key]: 'Adjust the height between lines of text.',
  [LinkPlugin.key]: 'Insert and manage hyperlinks.',
  [MediaEmbedPlugin.key]:
    'Embed medias like videos or tweets into your document.',
  [MentionPlugin.key]: 'Enable autocompletion for user mentions.',
  [NodeIdPlugin.key]:
    'Assign unique identifiers to nodes within your document.',
  [NormalizeTypesPlugin.key]: 'Enforce block types using rules.',
  [ParagraphPlugin.key]:
    'The foundational block in your editor, serving as the default block for text entry',
  [ResetNodePlugin.key]: 'Reset the block type using rules.',
  [SelectOnBackspacePlugin.key]:
    'Select the preceding block instead of deleting when pressing backspace.',
  [SingleLinePlugin.key]: 'Restrict the editor to a single block.',
  [SoftBreakPlugin.key]:
    'Insert line breaks within a block of text without starting a new block.',
  [StrikethroughPlugin.key]:
    'Cross out text to indicate deletion or correction.',
  [SubscriptPlugin.key]: 'Lower portions of your text.',
  [SuperscriptPlugin.key]: 'Elevate portions of your text.',
  [TabbablePlugin.key]:
    'Maintain a consistent tab order for tabbable elements.',
  [TablePlugin.key]:
    'Organize and display data in a structured and resizable tabular format.',
  [TodoListPlugin.key]: 'Manage tasks within your document.',
  [TogglePlugin.key]: 'Add toggles to your document.',
  [TrailingBlockPlugin.key]:
    'Automatically add a new paragraph after the final block.',
  [UnderlinePlugin.key]: 'Emphasize specific words or phrases in your text.',
  caption: 'Add captions to your blocks.',
  code_block: 'Encapsulate blocks of code.',
  column: 'Add column plugins',
  components: 'Components.',
  heading: 'Organize your document with up to 6 headings.',
  list: 'Organize nestable items in a bulleted or numbered list.',
};
