import type React from 'react';

import type { PlateProps, TDescendant } from '@udecode/plate-common';

import { type PlateEditor, isText } from '@udecode/plate-common/server';
import { encode } from 'html-entities';

import { elementToHtml } from './elementToHtml';
import { leafToHtml } from './leafToHtml';
import { newLinesToHtmlBr } from './utils/newLinesToHtmlBr';
import { stripSlateDataAttributes } from './utils/stripSlateDataAttributes';
import { trimWhitespace } from './utils/trimWhitespace';

/** Convert Slate Nodes into HTML string. */
export const serializeHtml = (
  editor: PlateEditor,
  {
    convertNewLinesToHtmlBr = false,
    dndWrapper,
    nodes,
    plateProps,
    preserveClassNames,
    stripDataAttributes = true,
    stripWhitespace = true,
  }: {
    /**
     * Optionally convert new line chars (\n) to HTML <br /> tags
     *
     * @default false
     */
    convertNewLinesToHtmlBr?: boolean;

    /** Drag and drop component */
    dndWrapper?: React.ComponentClass | React.FC | string;

    /** Slate nodes to convert to HTML. */
    nodes: TDescendant[];

    /** Slate props to provide if the rendering depends on plate/slate hooks */
    plateProps?: Partial<PlateProps>;

    /** List of className prefixes to preserve from being stripped out */
    preserveClassNames?: string[];

    /** Enable stripping data attributes */
    stripDataAttributes?: boolean;

    /**
     * Whether stripping whitespaces from serialized HTML
     *
     * @default true
     */
    stripWhitespace?: boolean;
  }
): string => {
  let result = nodes
    .map((node) => {
      if (isText(node)) {
        const children = encode(node.text);

        return leafToHtml(editor, {
          plateProps,
          preserveClassNames,
          props: {
            attributes: { 'data-slate-leaf': true },
            children: convertNewLinesToHtmlBr
              ? newLinesToHtmlBr(children)
              : children,
            editor,
            leaf: node as any,
            text: node as any,
          },
        });
      }

      return elementToHtml(editor, {
        dndWrapper,
        plateProps,
        preserveClassNames,
        props: {
          attributes: { 'data-slate-node': 'element', ref: null },
          children: serializeHtml(editor, {
            convertNewLinesToHtmlBr,
            nodes: node.children as TDescendant[],
            preserveClassNames,
            stripWhitespace,
          }),
          editor,
          element: node,
        },
      });
    })
    .join('');

  if (stripWhitespace) {
    result = trimWhitespace(result);
  }
  if (stripDataAttributes) {
    result = stripSlateDataAttributes(result);
  }

  return result;
};
