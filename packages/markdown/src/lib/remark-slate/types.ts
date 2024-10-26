import type { SlateEditor, TElement } from '@udecode/plate-common';

export type MdastElementType =
  | 'blockquote'
  | 'code'
  | 'heading'
  | 'image'
  | 'link'
  | 'list'
  | 'listItem'
  | 'paragraph'
  | 'thematicBreak';

export type MdastTextType =
  | 'delete'
  | 'emphasis'
  | 'html'
  | 'inlineCode'
  | 'strong'
  | 'text';

export type MdastNodeType = MdastElementType | MdastTextType;

export interface TextPosition {
  column: number;
  line: number;
  offset: number;
}

export interface MdastNode {
  // mdast metadata
  position?: {
    end: TextPosition;
    start: TextPosition;
  };
  alt?: string;
  checked?: any;
  children?: MdastNode[];
  depth?: 1 | 2 | 3 | 4 | 5 | 6;
  indent?: any;
  lang?: string;
  ordered?: boolean;
  spread?: any;
  text?: string;
  type?: MdastNodeType;
  url?: string;
  value?: string;
}

export type RemarkElementRule = {
  transform: (
    node: MdastNode,
    options: RemarkPluginOptions
  ) => TElement | TElement[];
};

export type RemarkElementRules = {
  [key in MdastElementType]?: RemarkElementRule;
};

export type RemarkTextRule = {
  mark?: (options: RemarkPluginOptions) => string;
  transform?: (text: string) => string;
};

export type RemarkTextRules = {
  [key in MdastTextType]?: RemarkTextRule;
};

export type RemarkPluginOptions = {
  editor: SlateEditor;
  elementRules: RemarkElementRules;
  textRules: RemarkTextRules;
  indentList?: boolean;
};
