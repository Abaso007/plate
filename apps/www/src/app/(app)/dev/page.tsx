import React from 'react';

import { withProps } from '@udecode/cn';
import { BaseAlignPlugin } from '@udecode/plate-alignment';
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote';
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { BaseCommentsPlugin } from '@udecode/plate-comments';
import {
  BaseParagraphPlugin,
  SlateLeaf,
  createSlateEditor,
  serializeHtml,
} from '@udecode/plate-common';
import { BaseDatePlugin } from '@udecode/plate-date';
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from '@udecode/plate-font';
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from '@udecode/plate-heading';
import { BaseHighlightPlugin } from '@udecode/plate-highlight';
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { BaseIndentPlugin } from '@udecode/plate-indent';
import { BaseIndentListPlugin } from '@udecode/plate-indent-list';
import { BaseKbdPlugin } from '@udecode/plate-kbd';
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout';
import { BaseLineHeightPlugin } from '@udecode/plate-line-height';
import { BaseLinkPlugin } from '@udecode/plate-link';
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from '@udecode/plate-media';
import { BaseMentionPlugin } from '@udecode/plate-mention';
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table';
import { BaseTogglePlugin } from '@udecode/plate-toggle';
import { cookies } from 'next/headers';
import fs from 'node:fs/promises';
import path from 'node:path';
import Prism from 'prismjs';

import { ExportHtmlButton, HtmlIframe } from '@/app/(app)/dev/html-client';
import { alignValue } from '@/registry/default/example/values/align-value';
import { basicElementsValue } from '@/registry/default/example/values/basic-elements-value';
import { basicMarksValue } from '@/registry/default/example/values/basic-marks-value';
import { columnValue } from '@/registry/default/example/values/column-value';
import { commentsValue } from '@/registry/default/example/values/comments-value';
import { dateValue } from '@/registry/default/example/values/date-value';
import { fontValue } from '@/registry/default/example/values/font-value';
import { highlightValue } from '@/registry/default/example/values/highlight-value';
import { horizontalRuleValue } from '@/registry/default/example/values/horizontal-rule-value';
import { indentListValue } from '@/registry/default/example/values/indent-list-value';
import { indentValue } from '@/registry/default/example/values/indent-value';
import { kbdValue } from '@/registry/default/example/values/kbd-value';
import { lineHeightValue } from '@/registry/default/example/values/line-height-value';
import { linkValue } from '@/registry/default/example/values/link-value';
import { todoListValue } from '@/registry/default/example/values/list-value';
import { mediaValue } from '@/registry/default/example/values/media-value';
import { mentionValue } from '@/registry/default/example/values/mention-value';
import { tableValue } from '@/registry/default/example/values/table-value';
import { tocPlaygroundValue } from '@/registry/default/example/values/toc-value';
import { createHtmlDocument } from '@/registry/default/lib/create-html-document';
import { BlockquoteElementStatic } from '@/registry/default/plate-ui/blockquote-element-static';
import { CodeBlockElementStatic } from '@/registry/default/plate-ui/code-block-element-static';
import { CodeLeafStatic } from '@/registry/default/plate-ui/code-leaf-static';
import { CodeLineElementStatic } from '@/registry/default/plate-ui/code-line-element-static';
import { CodeSyntaxLeafStatic } from '@/registry/default/plate-ui/code-syntax-leaf-static';
import { ColumnElementStatic } from '@/registry/default/plate-ui/column-element-static';
import { ColumnGroupElementStatic } from '@/registry/default/plate-ui/column-group-element-staic';
import { CommentLeafStatic } from '@/registry/default/plate-ui/comment-leaf-static';
import { DateElementStatic } from '@/registry/default/plate-ui/date-element-static';
import { EditorStatic } from '@/registry/default/plate-ui/editor-static';
import { HeadingElementStatic } from '@/registry/default/plate-ui/heading-element-static';
import { HrElementStatic } from '@/registry/default/plate-ui/hr-element-static';
import { ImageElementStatic } from '@/registry/default/plate-ui/image-element-static';
import {
  FireLiComponent,
  FireMarker,
} from '@/registry/default/plate-ui/indent-fire-marker';
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from '@/registry/default/plate-ui/indent-todo-marker-static';
import { KbdLeafStatic } from '@/registry/default/plate-ui/kbd-leaf-static';
import { LinkElementStatic } from '@/registry/default/plate-ui/link-element-static';
import { MediaAudioElementStatic } from '@/registry/default/plate-ui/media-audio-element-static';
import { MediaFileElementStatic } from '@/registry/default/plate-ui/media-file-element-static';
import { MediaVideoElementStatic } from '@/registry/default/plate-ui/media-video-element-static';
import { MentionElementStatic } from '@/registry/default/plate-ui/mention-element-static';
import { ParagraphElementStatic } from '@/registry/default/plate-ui/paragraph-element-static';
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@/registry/default/plate-ui/table-cell-element-static';
import { TableElementStatic } from '@/registry/default/plate-ui/table-element-static';
import { TableRowElementStatic } from '@/registry/default/plate-ui/table-row-element-static';
import { TocElementStatic } from '@/registry/default/plate-ui/toc-element-static';
import { ToggleElementStatic } from '@/registry/default/plate-ui/toggle-element-static';

export const getCachedTailwindCss = React.cache(async () => {
  const cssPath = path.join(process.cwd(), 'public', 'tailwind.css');

  return await fs.readFile(cssPath, 'utf8');
});

export default async function DevPage() {
  const components = {
    [BaseAudioPlugin.key]: MediaAudioElementStatic,
    [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
    [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
    [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
    [BaseCodeLinePlugin.key]: CodeLineElementStatic,
    [BaseCodePlugin.key]: CodeLeafStatic,
    [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
    [BaseColumnItemPlugin.key]: ColumnElementStatic,
    [BaseColumnPlugin.key]: ColumnGroupElementStatic,
    [BaseCommentsPlugin.key]: CommentLeafStatic,
    [BaseDatePlugin.key]: DateElementStatic,
    [BaseFilePlugin.key]: MediaFileElementStatic,
    [BaseHorizontalRulePlugin.key]: HrElementStatic,
    [BaseImagePlugin.key]: ImageElementStatic,
    [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
    [BaseKbdPlugin.key]: KbdLeafStatic,
    [BaseLinkPlugin.key]: LinkElementStatic,
    // [BaseMediaEmbedPlugin.key]: MediaEmbedElementStatic,
    [BaseMentionPlugin.key]: MentionElementStatic,
    [BaseParagraphPlugin.key]: ParagraphElementStatic,
    [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
    [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
    [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
    [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
    [BaseTableCellPlugin.key]: TableCellElementStatic,
    [BaseTablePlugin.key]: TableElementStatic,
    [BaseTableRowPlugin.key]: TableRowElementStatic,
    [BaseTocPlugin.key]: TocElementStatic,
    [BaseTogglePlugin.key]: ToggleElementStatic,
    [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
    [BaseVideoPlugin.key]: MediaVideoElementStatic,
    [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
    [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
    [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
    [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
    [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
    [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
  };

  const editor = createSlateEditor({
    plugins: [
      BaseColumnPlugin,
      BaseColumnItemPlugin,
      BaseTocPlugin,
      BaseVideoPlugin,
      BaseAudioPlugin,
      BaseParagraphPlugin,
      BaseHeadingPlugin,
      BaseMediaEmbedPlugin,
      BaseBoldPlugin,
      BaseCodePlugin,
      BaseItalicPlugin,
      BaseStrikethroughPlugin,
      BaseSubscriptPlugin,
      BaseSuperscriptPlugin,
      BaseUnderlinePlugin,
      BaseBlockquotePlugin,
      BaseDatePlugin,
      BaseCodeBlockPlugin.configure({
        options: {
          prism: Prism,
        },
      }),
      BaseIndentPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            BaseBlockquotePlugin.key,
            BaseCodeBlockPlugin.key,
          ],
        },
      }),
      BaseIndentListPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            ...HEADING_LEVELS,
            BaseBlockquotePlugin.key,
            BaseCodeBlockPlugin.key,
            BaseTogglePlugin.key,
          ],
        },
        options: {
          listStyleTypes: {
            fire: {
              liComponent: FireLiComponent,
              markerComponent: FireMarker,
              type: 'fire',
            },
            todo: {
              liComponent: TodoLiStatic,
              markerComponent: TodoMarkerStatic,
              type: 'todo',
            },
          },
        },
      }),
      BaseLinkPlugin,
      BaseTableRowPlugin,
      BaseTablePlugin,
      BaseTableCellPlugin,
      BaseHorizontalRulePlugin,
      BaseFontColorPlugin,
      BaseFontBackgroundColorPlugin,
      BaseFontSizePlugin,
      BaseKbdPlugin,
      BaseAlignPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            BaseMediaEmbedPlugin.key,
            ...HEADING_LEVELS,
            BaseImagePlugin.key,
          ],
        },
      }),
      BaseLineHeightPlugin,
      BaseHighlightPlugin,
      BaseFilePlugin,
      BaseImagePlugin,
      BaseMentionPlugin,
      BaseCommentsPlugin,
      BaseTogglePlugin,
    ],
    value: [
      ...basicElementsValue,
      ...basicMarksValue,
      ...tocPlaygroundValue,
      ...todoListValue,
      ...linkValue,
      ...horizontalRuleValue,
      ...tableValue,
      ...mediaValue,
      ...columnValue,
      ...mentionValue,
      ...dateValue,
      ...fontValue,
      ...highlightValue,
      ...kbdValue,
      ...commentsValue,
      ...alignValue,
      ...lineHeightValue,
      ...indentValue,
      ...indentListValue,
    ],
  });

  const tailwindCss = await getCachedTailwindCss();
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  // Get the editor content HTML
  const editorHtml = await serializeHtml(editor, { components });

  // Create the full HTML document
  const html = createHtmlDocument({
    editorHtml,
    tailwindCss,
    theme,
  });

  return (
    <div>
      <ExportHtmlButton html={html} serverTheme={theme} />

      <div className="grid grid-cols-2 overflow-y-auto">
        <EditorStatic
          variant="none"
          className="p-2"
          components={components}
          editor={editor}
        />

        <HtmlIframe
          className="size-full min-h-[500px] p-2"
          html={html}
          serverTheme={theme}
        />
      </div>
    </div>
  );
}
