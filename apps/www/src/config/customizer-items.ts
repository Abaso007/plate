import { AlignPlugin } from '@udecode/plate-alignment';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
  ExitBreakPlugin,
  SingleLinePlugin,
  SoftBreakPlugin,
} from '@udecode/plate-break/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { ParagraphPlugin } from '@udecode/plate-common';
import { CsvPlugin } from '@udecode/plate-csv';
import { DndPlugin } from '@udecode/plate-dnd';
import { EmojiPlugin } from '@udecode/plate-emoji';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { LineHeightPlugin } from '@udecode/plate-line-height';
import { LinkPlugin } from '@udecode/plate-link/react';
import { TodoListPlugin } from '@udecode/plate-list/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { MentionPlugin } from '@udecode/plate-mention/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { NormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { ResetNodePlugin } from '@udecode/plate-reset-node';
import { DeletePlugin, SelectOnBackspacePlugin } from '@udecode/plate-select';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { DocxPlugin } from '@udecode/plate-serializer-docx';
import { TabbablePlugin } from '@udecode/plate-tabbable';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import {
  type CustomizerBadge,
  customizerBadges,
} from '@/config/customizer-badges';
import { customizerComponents } from '@/config/customizer-components';
import { customizerPlugins } from '@/config/customizer-plugins';
import { DragOverCursorPlugin } from '@/plate/demo/plugins/DragOverCursorPlugin';

export type SettingPlugin = {
  badges?: CustomizerBadge[];
  cnImports?: string[];
  components?: {
    cnImports?: string[];
    customImports?: string[];
    filename?: string; // e.g. 'blockquote-element' (default: id)
    id: string; // e.g. 'blockquote-element'
    import?: string;
    label: string; // e.g. 'Blockquote'
    noImport?: boolean;
    plateImports?: string[];
    pluginKey?: string; // Plugin components only, e.g. 'BlockquotePlugin.key'
    pluginOptions?: string[];
    registry?: string;
    route?: string;
    usage: string; // e.g. 'BlockquoteElement'
  }[];
  conflicts?: string[];
  customImports?: string[];
  dependencies?: string[];
  disablePlugins?: string[];
  id: string;
  label?: string;
  npmPackage?: string;
  packageImports?: string[];
  plateImports?: string[];
  pluginFactory?: string;
  pluginOptions?: string[];
  route?: string;
};

export const customizerItems: Record<string, SettingPlugin> = {
  [AlignPlugin.key]: {
    badges: [customizerBadges.style],
    id: AlignPlugin.key,
    label: 'Align',
    npmPackage: '@udecode/plate-alignment',
    pluginFactory: 'createAlignPlugin',
    pluginOptions: [
      `inject: {`,
      `  targetPlugins: [`,
      `    ParagraphPlugin.key,`,
      `    // HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.align.route,
  },
  // Functionality
  [AutoformatPlugin.key]: {
    badges: [customizerBadges.handler],
    id: AutoformatPlugin.key,
    label: 'Autoformat',
    npmPackage: '@udecode/plate-autoformat',
    pluginFactory: 'createAutoformatPlugin',
    pluginOptions: [
      `options: {`,
      `  rules: [`,
      `    // Usage: https://platejs.org/docs/autoformat`,
      `  ],`,
      `  enableUndoOnDelete: true,`,
      `},`,
    ],
    route: customizerPlugins.autoformat.route,
  },
  [BlockSelectionPlugin.key]: {
    badges: [customizerBadges.ui],
    dependencies: [NodeIdPlugin.key],
    id: BlockSelectionPlugin.key,
    label: 'Block Selection',
    npmPackage: '@udecode/plate-selection',
    pluginFactory: 'createBlockSelectionPlugin',
    pluginOptions: [
      `options: {`,
      `  sizes: {`,
      `    top: 0,`,
      `    bottom: 0,`,
      `  },`,
      `},`,
    ],
    route: customizerPlugins.blockselection.route,
  },
  [BlockquotePlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'blockquote-element',
        label: 'BlockquoteElement',
        pluginKey: 'BlockquotePlugin.key',
        route: customizerComponents.blockquoteElement.href,
        usage: 'BlockquoteElement',
      },
    ],
    id: BlockquotePlugin.key,
    label: 'Blockquote',
    npmPackage: '@udecode/plate-block-quote',
    pluginFactory: 'createBlockquotePlugin',
    route: customizerPlugins.basicnodes.route,
  },
  [BoldPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'bold',
        label: 'BoldLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'BoldPlugin.key',
        usage: `withProps(PlateLeaf, { as: 'strong' })`,
      },
    ],
    id: BoldPlugin.key,
    label: 'Bold',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createBoldPlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [CaptionPlugin.key]: {
    badges: [customizerBadges.handler],
    id: CaptionPlugin.key,
    label: 'Caption',
    npmPackage: '@udecode/plate-caption',
    pluginFactory: 'createCaptionPlugin',
    pluginOptions: [
      `options: {`,
      `  pluginKeys: [`,
      `    // ImagePlugin.key, MediaEmbedPlugin.key`,
      `  ]`,
      `},`,
    ],
    route: customizerPlugins.media.route,
  },
  [CodeBlockPlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'code-block-element',
        label: 'CodeBlockElement',
        pluginKey: 'CodeBlockPlugin.key',
        route: customizerComponents.codeBlockElement.href,
        usage: 'CodeBlockElement',
      },
      {
        id: 'code-line-element',
        label: 'CodeLineElement',
        pluginKey: 'CodeLinePlugin.key',
        route: customizerComponents.codeLineElement.href,
        usage: 'CodeLineElement',
      },
      {
        id: 'code-syntax-leaf',
        label: 'CodeSyntaxLeaf',
        pluginKey: 'CodeSyntaxPlugin.key',
        route: customizerComponents.codeSyntaxLeaf.href,
        usage: 'CodeSyntaxLeaf',
      },
    ],
    id: CodeBlockPlugin.key,
    label: 'Code block',
    npmPackage: '@udecode/plate-code-block',
    pluginFactory: 'createCodeBlockPlugin',
    route: customizerPlugins.basicnodes.route,
  },
  [CodePlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        id: 'code-leaf',
        label: 'CodeLeaf',
        pluginKey: 'CodePlugin.key',
        route: customizerComponents.codeLeaf.href,
        usage: `CodeLeaf`,
      },
    ],
    id: CodePlugin.key,
    label: 'Code',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createCodePlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [CommentsPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        id: 'comment-leaf',
        label: 'CommentLeaf',
        pluginKey: 'CommentsPlugin.key',
        route: customizerComponents.commentLeaf.href,
        usage: 'CommentLeaf',
      },
      {
        id: 'comments-popover',
        label: 'CommentsPopover',
        route: customizerComponents.commentsPopover.href,
        usage: 'CommentsPopover',
      },
    ],
    id: CommentsPlugin.key,
    label: 'Comments',
    npmPackage: '@udecode/plate-comments',
    packageImports: ['CommentsProvider'],
    pluginFactory: 'createCommentsPlugin',
    route: customizerPlugins.comment.route,
  },
  // Deserialization
  [CsvPlugin.key]: {
    badges: [customizerBadges.handler],
    id: CsvPlugin.key,
    label: 'Deserialize CSV',
    npmPackage: '@udecode/plate-csv',
    pluginFactory: 'createCsvPlugin',
    route: customizerPlugins.csv.route,
  },
  [DeletePlugin.key]: {
    badges: [customizerBadges.handler],
    id: DeletePlugin.key,
    label: 'Delete',
    npmPackage: '@udecode/plate-select',
    pluginFactory: 'createDeletePlugin',
  },
  [DndPlugin.key]: {
    badges: [customizerBadges.handler, customizerBadges.ui],
    components: [
      {
        filename: 'with-draggables',
        id: 'draggable',
        label: 'Draggable',
        registry: 'draggable',
        route: customizerComponents.draggable.href,
        usage: 'withDraggables',
      },
    ],
    customImports: [
      `import { DndProvider } from 'react-dnd';`,
      `import { HTML5Backend } from 'react-dnd-html5-backend';`,
    ],
    dependencies: [NodeIdPlugin.key],
    id: DndPlugin.key,
    label: 'Drag & Drop',
    npmPackage: '@udecode/plate-dnd',
    pluginFactory: 'createDndPlugin',
    pluginOptions: ['  options: { enableScroller: true },'],
    route: customizerPlugins.dnd.route,
  },
  [DocxPlugin.key]: {
    badges: [customizerBadges.handler],
    dependencies: [JuicePlugin.key],
    id: DocxPlugin.key,
    label: 'Deserialize DOCX',
    npmPackage: '@udecode/plate-serializer-docx',
    pluginFactory: 'createDocxPlugin',
    route: customizerPlugins.docx.route,
  },
  [DragOverCursorPlugin.key]: {
    badges: [customizerBadges.handler, customizerBadges.ui],
    id: DragOverCursorPlugin.key,
    // npmPackage: '@udecode/plate-cursor',
    label: 'Drag Cursor',
    route: customizerPlugins.cursoroverlay.route,
  },
  [EmojiPlugin.key]: {
    badges: [customizerBadges.handler],
    components: [
      {
        id: 'emoji-input-element',
        label: 'EmojiInputElement',
        route: customizerComponents.emojiInputElement.href,
        usage: 'EmojiInputElement',
      },
    ],
    id: EmojiPlugin.key,
    label: 'Emoji',
    npmPackage: '@udecode/plate-emoji',
    pluginFactory: 'createEmojiPlugin',
    route: customizerPlugins.emoji.route,
  },
  [ExcalidrawPlugin.key]: {
    badges: [customizerBadges.element, customizerBadges.void],
    components: [
      {
        id: 'excalidraw-element',
        label: 'ExcalidrawElement',
        pluginKey: 'ExcalidrawPlugin.key',
        route: customizerComponents.excalidrawElement.href,
        usage: 'ExcalidrawElement',
      },
    ],
    id: ExcalidrawPlugin.key,
    label: 'Excalidraw',
    npmPackage: '@udecode/plate-excalidraw',
    pluginFactory: 'createExcalidrawPlugin',
    route: customizerPlugins.excalidraw.route,
  },
  [ExitBreakPlugin.key]: {
    badges: [customizerBadges.handler],
    id: ExitBreakPlugin.key,
    label: 'Exit Break',
    npmPackage: '@udecode/plate-break',
    pluginFactory: 'createExitBreakPlugin',
    pluginOptions: [
      `options: {`,
      `  rules: [`,
      `    {`,
      `      hotkey: 'mod+enter',`,
      `    },`,
      `    {`,
      `      hotkey: 'mod+shift+enter',`,
      `      before: true,`,
      `    },`,
      `    {`,
      `      hotkey: 'enter',`,
      `      query: {`,
      `        start: true,`,
      `        end: true,`,
      `        // allow: KEYS_HEADING,`,
      `      },`,
      `      relative: true,`,
      `      level: 1,`,
      `    },`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.exitbreak.route,
  },
  [FontBackgroundColorPlugin.key]: {
    badges: [customizerBadges.style],
    id: FontBackgroundColorPlugin.key,
    label: 'Font Background',
    npmPackage: '@udecode/plate-font',
    pluginFactory: 'createFontBackgroundColorPlugin',
    route: customizerPlugins.font.route,
  },
  [FontColorPlugin.key]: {
    badges: [customizerBadges.style],
    id: FontColorPlugin.key,
    label: 'Font Color',
    npmPackage: '@udecode/plate-font',
    pluginFactory: 'createFontColorPlugin',
    route: customizerPlugins.font.route,
  },
  [FontSizePlugin.key]: {
    badges: [customizerBadges.style],
    id: FontSizePlugin.key,
    label: 'Font Size',
    npmPackage: '@udecode/plate-font',
    pluginFactory: 'createFontSizePlugin',
    route: customizerPlugins.font.route,
  },
  [HighlightPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        id: 'highlight-leaf',
        label: 'HighlightLeaf',
        pluginKey: 'HighlightPlugin.key',
        route: customizerComponents.highlightLeaf.href,
        usage: 'HighlightLeaf',
      },
    ],
    id: HighlightPlugin.key,
    label: 'Highlight',
    npmPackage: '@udecode/plate-highlight',
    pluginFactory: 'createHighlightPlugin',
    route: customizerPlugins.highlight.route,
  },
  [HorizontalRulePlugin.key]: {
    badges: [customizerBadges.element, customizerBadges.void],
    components: [
      {
        id: 'hr-element',
        label: 'HrElement',
        pluginKey: 'HorizontalRulePlugin.key',
        route: customizerComponents.hrElement.href,
        usage: 'HrElement',
      },
    ],
    id: HorizontalRulePlugin.key,
    label: 'Horizontal Rule',
    npmPackage: '@udecode/plate-horizontal-rule',
    pluginFactory: 'createHorizontalRulePlugin',
    route: customizerPlugins.hr.route,
  },
  [ImagePlugin.key]: {
    badges: [customizerBadges.element, customizerBadges.void],
    components: [
      {
        id: 'image-element',
        label: 'ImageElement',
        pluginKey: 'ImagePlugin.key',
        route: customizerComponents.imageElement.href,
        usage: 'ImageElement',
      },
    ],
    id: ImagePlugin.key,
    label: 'Image',
    npmPackage: '@udecode/plate-media',
    pluginFactory: 'createImagePlugin',
    route: customizerPlugins.media.route,
  },
  [IndentListPlugin.key]: {
    badges: [customizerBadges.style],
    conflicts: ['list'],
    dependencies: [IndentPlugin.key],
    id: IndentListPlugin.key,
    label: 'Indent List',
    npmPackage: '@udecode/plate-indent-list',
    pluginFactory: 'createIndentListPlugin',
    pluginOptions: [
      `inject: {`,
      `  targetPlugins: [`,
      `    ParagraphPlugin.key,`,
      `    // HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3, BlockquotePlugin.key, CodeBlockPlugin.key`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.indentlist.route,
  },
  [IndentPlugin.key]: {
    badges: [customizerBadges.style],
    id: IndentPlugin.key,
    label: 'Indent',
    npmPackage: '@udecode/plate-indent',
    pluginFactory: 'createIndentPlugin',
    pluginOptions: [
      `inject: {`,
      `  targetPlugins: [`,
      `    ParagraphPlugin.key,`,
      `    // HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3, BlockquotePlugin.key, CodeBlockPlugin.key`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.indent.route,
  },
  [ItalicPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'italic',
        label: 'ItalicLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'ItalicPlugin.key',
        usage: `withProps(PlateLeaf, { as: 'em' })`,
      },
    ],
    id: ItalicPlugin.key,
    label: 'Italic',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createItalicPlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [JuicePlugin.key]: {
    badges: [customizerBadges.handler],
    id: JuicePlugin.key,
    label: 'Juice',
    npmPackage: '@udecode/plate-juice',
    pluginFactory: 'createJuicePlugin',
    route: customizerPlugins.docx.route,
  },
  [KbdPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        id: 'kbd-leaf',
        label: 'KbdLeaf',
        pluginKey: 'KbdPlugin.key',
        route: customizerComponents.kbdLeaf.href,
        usage: 'KbdLeaf',
      },
    ],
    id: KbdPlugin.key,
    label: 'Keyboard Input',
    npmPackage: '@udecode/plate-kbd',
    pluginFactory: 'createKbdPlugin',
    route: customizerPlugins.kbd.route,
  },
  [LineHeightPlugin.key]: {
    badges: [customizerBadges.style],
    id: LineHeightPlugin.key,
    label: 'Line Height',
    npmPackage: '@udecode/plate-line-height',
    pluginFactory: 'createLineHeightPlugin',
    pluginOptions: [
      `inject: {`,
      `  targetPlugins: [`,
      `    ParagraphPlugin.key,`,
      `    // HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3`,
      `  ],`,
      `  props: {`,
      `    defaultNodeValue: 1.5,`,
      `    validNodeValues: [1, 1.2, 1.5, 2, 3],`,
      `  },`,
      `},`,
    ],
    route: customizerPlugins.lineheight.route,
  },
  [LinkPlugin.key]: {
    badges: [customizerBadges.element, customizerBadges.inline],
    components: [
      {
        id: 'link-element',
        label: 'LinkElement',
        pluginKey: 'LinkPlugin.key',
        route: customizerComponents.linkElement.href,
        usage: 'LinkElement',
      },
      {
        id: 'link-floating-toolbar',
        label: 'LinkFloatingToolbar',
        plateImports: ['RenderAfterEditable'],
        pluginOptions: [
          `renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,`,
        ],
        route: customizerComponents.linkFloatingToolbar.href,
        usage: 'LinkFloatingToolbar',
      },
    ],
    id: LinkPlugin.key,
    label: 'Link',
    npmPackage: '@udecode/plate-link',
    pluginFactory: 'createLinkPlugin',
    route: customizerPlugins.link.route,
  },
  [MarkdownPlugin.key]: {
    badges: [customizerBadges.handler],
    id: MarkdownPlugin.key,
    label: 'Deserialize MD',
    npmPackage: '@udecode/plate-markdown',
    pluginFactory: 'createMarkdownPlugin',
    route: customizerPlugins.markdown.route,
  },
  [MediaEmbedPlugin.key]: {
    badges: [customizerBadges.element, customizerBadges.void],
    components: [
      {
        id: 'media-embed-element',
        label: 'MediaEmbedElement',
        pluginKey: 'MediaEmbedPlugin.key',
        route: customizerComponents.mediaEmbedElement.href,
        usage: 'MediaEmbedElement',
      },
    ],
    id: MediaEmbedPlugin.key,
    label: 'Media Embed',
    npmPackage: '@udecode/plate-media',
    pluginFactory: 'createMediaEmbedPlugin',
    route: customizerPlugins.media.route,
  },

  [MentionPlugin.key]: {
    badges: [
      customizerBadges.element,
      customizerBadges.inline,
      customizerBadges.void,
    ],
    components: [
      {
        id: 'mention-element',
        label: 'MentionElement',
        pluginKey: 'MentionPlugin.key',
        route: customizerComponents.mentionElement.href,
        usage: 'MentionElement',
      },
      {
        id: 'mention-input-element',
        label: 'MentionInputElement',
        pluginKey: 'MentionInputPlugin.key',
        route: customizerComponents.mentionInputElement.href,
        usage: 'MentionInputElement',
      },
    ],
    id: MentionPlugin.key,
    label: 'Mention',
    npmPackage: '@udecode/plate-mention',
    pluginFactory: 'createMentionPlugin',
    route: customizerPlugins.mention.route,
  },
  [NodeIdPlugin.key]: {
    badges: [customizerBadges.normalizer],
    id: NodeIdPlugin.key,
    label: 'Id',
    npmPackage: '@udecode/plate-node-id',
    pluginFactory: 'createNodeIdPlugin',
    // route: settingValues.nodeid.route,
  },
  [NormalizeTypesPlugin.key]: {
    badges: [customizerBadges.normalizer],
    id: NormalizeTypesPlugin.key,
    label: 'Normalize Types',
    npmPackage: '@udecode/plate-normalizers',
    pluginFactory: 'createNormalizeTypesPlugin',
    route: customizerPlugins.forcedlayout.route,
  },
  [ParagraphPlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'paragraph-element',
        label: 'ParagraphElement',
        pluginKey: 'ParagraphPlugin.key',
        route: customizerComponents.paragraphElement.href,
        usage: 'ParagraphElement',
      },
    ],
    id: ParagraphPlugin.key,
    label: 'Paragraph',
    npmPackage: '@udecode/plate-common',
    pluginFactory: 'createParagraphPlugin',
    route: customizerPlugins.basicnodes.route,
  },
  [ResetNodePlugin.key]: {
    badges: [customizerBadges.handler],
    id: ResetNodePlugin.key,
    label: 'Reset Node',
    npmPackage: '@udecode/plate-reset-node',
    pluginFactory: 'createResetNodePlugin',
    pluginOptions: [
      `options: {`,
      `  rules: [`,
      `    // Usage: https://platejs.org/docs/reset-node`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.resetnode.route,
  },
  [SelectOnBackspacePlugin.key]: {
    badges: [customizerBadges.handler],
    id: SelectOnBackspacePlugin.key,
    label: 'Select on Backspace',
    npmPackage: '@udecode/plate-select',
    pluginFactory: 'createSelectOnBackspacePlugin',
    pluginOptions: [
      `options: {`,
      `  query: {`,
      `    allow: [`,
      `      // ImagePlugin.key, HorizontalRulePlugin.key`,
      `    ],`,
      `  },`,
      `},`,
    ],
    route: customizerPlugins.media.route,
  },
  [SingleLinePlugin.key]: {
    badges: [customizerBadges.normalizer],
    conflicts: [TrailingBlockPlugin.key],
    disablePlugins: [TrailingBlockPlugin.key],
    id: SingleLinePlugin.key,
    label: 'Single Line',
    npmPackage: '@udecode/plate-break',
    pluginFactory: 'createSingleLinePlugin',
    route: customizerPlugins.singleline.route,
  },
  [SoftBreakPlugin.key]: {
    badges: [customizerBadges.handler],
    id: SoftBreakPlugin.key,
    label: 'Soft Break',
    // options: {
    //         rules: [
    //           { hotkey: 'shift+enter' },
    //           {
    //             hotkey: 'enter',
    //             query: {
    //               allow: [CodeBlockPlugin.key, BlockquotePlugin.key, TableCellPlugin.key],
    //             },
    //           },
    //         ],
    npmPackage: '@udecode/plate-break',
    pluginFactory: 'createSoftBreakPlugin',
    //       },
    pluginOptions: [
      `options: {`,
      `  rules: [`,
      `    { hotkey: 'shift+enter' },`,
      `    {`,
      `      hotkey: 'enter',`,
      `      query: {`,
      `        allow: [`,
      `          // CodeBlockPlugin.key, BlockquotePlugin.key, TableCellPlugin.key`,
      `        ],`,
      `      },`,
      `    },`,
      `  ],`,
      `},`,
    ],
    route: customizerPlugins.softbreak.route,
  },
  [StrikethroughPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'strikethrough',
        label: 'StrikethroughLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'StrikethroughPlugin.key',
        usage: `withProps(PlateLeaf, { as: 's' })`,
      },
    ],
    id: StrikethroughPlugin.key,
    label: 'Strikethrough',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createStrikethroughPlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [SubscriptPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'subscript',
        label: 'SubscriptLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'SubscriptPlugin.key',
        usage: `withProps(PlateLeaf, { as: 'sub' })`,
      },
    ],
    id: SubscriptPlugin.key,
    label: 'Subscript',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createSubscriptPlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [SuperscriptPlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'superscript',
        label: 'SuperscriptLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'SuperscriptPlugin.key',
        usage: `withProps(PlateLeaf, { as: 'sup' })`,
      },
    ],
    id: SuperscriptPlugin.key,
    label: 'Superscript',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createSuperscriptPlugin',
    route: customizerPlugins.basicmarks.route,
  },
  [TabbablePlugin.key]: {
    badges: [customizerBadges.handler],
    id: TabbablePlugin.key,
    label: 'Tabbable',
    npmPackage: '@udecode/plate-tabbable',
    pluginFactory: 'createTabbablePlugin',
    route: customizerPlugins.tabbable.route,
  },
  [TablePlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'table-element',
        label: 'TableElement',
        pluginKey: 'TablePlugin.key',
        route: customizerComponents.tableElement.href,
        usage: 'TableElement',
      },
      {
        id: 'table-row-element',
        label: 'TableRowElement',
        pluginKey: 'TableRowPlugin.key',
        route: customizerComponents.tableRowElement.href,
        usage: 'TableRowElement',
      },
      {
        filename: 'table-cell-element',
        id: 'td',
        label: 'TableCellElement',
        pluginKey: 'TableCellPlugin.key',
        route: customizerComponents.tableCellElement.href,
        usage: 'TableCellElement',
      },
      {
        filename: 'table-cell-element',
        id: 'th',
        label: 'TableCellHeaderElement',
        pluginKey: 'TableCellHeaderPlugin.key',
        route: customizerComponents.tableCellElement.href,
        usage: 'TableCellHeaderElement',
      },
    ],
    id: TablePlugin.key,
    label: 'Table',
    npmPackage: '@udecode/plate-table',
    pluginFactory: 'createTablePlugin',
    route: customizerPlugins.table.route,
  },
  [TodoListPlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'todo-list-element',
        label: 'TodoListElement',
        pluginKey: 'TodoListPlugin.key',
        route: customizerComponents.todoListElement.href,
        usage: 'TodoListElement',
      },
    ],
    id: TodoListPlugin.key,
    label: 'Todo List',
    npmPackage: '@udecode/plate-list',
    pluginFactory: 'createTodoListPlugin',
    route: customizerPlugins.todoli.route,
  },
  [TogglePlugin.key]: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'toggle-element',
        label: 'ToggleElement',
        pluginKey: 'TogglePlugin.key',
        route: customizerComponents.toggleElement.href,
        usage: 'ToggleElement',
      },
    ],
    id: TogglePlugin.key,
    label: 'Toggle',
    npmPackage: '@udecode/plate-toggle',
    pluginFactory: 'createTogglePlugin',
    route: customizerPlugins.toggle.route,
  },
  [TrailingBlockPlugin.key]: {
    badges: [customizerBadges.normalizer],
    conflicts: [SingleLinePlugin.key],
    disablePlugins: [SingleLinePlugin.key],
    id: TrailingBlockPlugin.key,
    label: 'Trailing Block',
    npmPackage: '@udecode/plate-trailing-block',
    pluginFactory: 'createTrailingBlockPlugin',
    pluginOptions: [`options: { type: ParagraphPlugin.key },`],
    route: customizerPlugins.trailingblock.route,
  },
  [UnderlinePlugin.key]: {
    badges: [customizerBadges.leaf],
    components: [
      {
        cnImports: ['withProps'],
        id: 'underline',
        label: 'UnderlineLeaf',
        noImport: true,
        plateImports: ['PlateLeaf'],
        pluginKey: 'UnderlinePlugin.key',
        usage: `withProps(PlateLeaf, { as: 'u' })`,
      },
    ],
    id: UnderlinePlugin.key,
    label: 'Underline',
    npmPackage: '@udecode/plate-basic-marks',
    pluginFactory: 'createUnderlinePlugin',
    route: customizerPlugins.basicmarks.route,
  },

  column: {
    badges: [customizerBadges.element],
    components: [
      {
        id: 'column-group-element',
        label: 'ColumnGroupElement',
        pluginKey: 'ColumnPlugin.key',
        route: customizerComponents.columnGroupElement.href,
        usage: 'ColumnGroupElement',
      },
      {
        id: 'column-element',
        label: 'ColumnElement',
        pluginKey: 'ColumnItemPlugin.key',
        route: customizerComponents.columnElement.href,
        usage: 'ColumnElement',
      },
    ],
    id: 'column',
    label: 'Column',
    npmPackage: '@udecode/plate-layout',
    pluginFactory: 'createColumnPlugin',
    route: customizerPlugins.column.route,
  },
  components: {
    badges: [customizerBadges.ui],
    components: [
      {
        id: 'editor',
        label: 'Editor',
        route: customizerComponents.editor.href,
        usage: 'Editor',
      },
      {
        id: 'fixed-toolbar',
        label: 'FixedToolbar',
        route: customizerComponents.fixedToolbar.href,
        usage: 'FixedToolbar',
      },
      {
        id: 'fixed-toolbar-buttons',
        label: 'FixedToolbarButtons',
        route: customizerComponents.fixedToolbarButtons.href,
        usage: 'FixedToolbarButtons',
      },
      {
        id: 'floating-toolbar',
        label: 'FloatingToolbar',
        route: customizerComponents.floatingToolbar.href,
        usage: 'FloatingToolbar',
      },
      {
        id: 'floating-toolbar-buttons',
        label: 'FloatingToolbarButtons',
        route: customizerComponents.floatingToolbarButtons.href,
        usage: 'FloatingToolbarButtons',
      },
      {
        id: 'placeholder',
        label: 'Placeholder',
        registry: 'placeholder',
        route: customizerComponents.placeholder.href,
        usage: 'withPlaceholders',
      },
    ],
    id: 'components',
    label: 'Components',
  },
  heading: {
    badges: [customizerBadges.element],
    components: [
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h1',
        import: 'HeadingElement',
        label: 'H1Element',
        pluginKey: 'HEADING_KEYS.h1',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h1' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h2',
        import: 'HeadingElement',
        label: 'H2Element',
        pluginKey: 'HEADING_KEYS.h2',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h2' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h3',
        import: 'HeadingElement',
        label: 'H3Element',
        pluginKey: 'HEADING_KEYS.h3',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h3' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h4',
        import: 'HeadingElement',
        label: 'H4Element',
        pluginKey: 'HEADING_KEYS.h4',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h4' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h5',
        import: 'HeadingElement',
        label: 'H5Element',
        pluginKey: 'HEADING_KEYS.h5',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h5' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'heading-element',
        id: 'h6',
        import: 'HeadingElement',
        label: 'H6Element',
        pluginKey: 'HEADING_KEYS.h6',
        route: customizerComponents.headingElement.href,
        usage: `withProps(HeadingElement, { variant: 'h6' })`,
      },
    ],
    id: 'heading',
    label: 'Heading',
    npmPackage: '@udecode/plate-heading',
    pluginFactory: 'createHeadingPlugin',
    route: customizerPlugins.basicnodes.route,
  },
  list: {
    badges: [customizerBadges.element],
    components: [
      {
        cnImports: ['withProps'],
        filename: 'list-element',
        id: 'ul',
        import: 'ListElement',
        label: 'BulletedListElement',
        pluginKey: 'BulletedListPlugin.key',
        route: customizerComponents.listElement.href,
        usage: `withProps(ListElement, { variant: 'ul' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'list-element',
        id: 'ol',
        import: 'ListElement',
        label: 'NumberedListElement',
        noImport: true,
        pluginKey: 'NumberedListPlugin.key',
        route: customizerComponents.listElement.href,
        usage: `withProps(ListElement, { variant: 'ol' })`,
      },
      {
        cnImports: ['withProps'],
        filename: 'list-element',
        id: 'li',
        label: 'ListItemElement',
        noImport: true,
        plateImports: ['PlateElement'],
        pluginKey: 'ListItemPlugin.key',
        usage: `withProps(PlateElement, { as: 'li' })`,
      },
    ],
    conflicts: [IndentListPlugin.key],
    id: 'list',
    label: 'List',
    npmPackage: '@udecode/plate-list',
    pluginFactory: 'createListPlugin',
    route: customizerPlugins.list.route,
  },
};
