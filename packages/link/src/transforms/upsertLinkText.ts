import {
  type PlateEditor,
  type TText,
  getAboveNode,
  getEditorString,
  getPluginType,
  replaceNodeChildren,
} from '@udecode/plate-common';

import type { TLinkElement } from '../types';
import type { UpsertLinkOptions } from './upsertLink';

import { ELEMENT_LINK } from '../LinkPlugin';

/**
 * If the text is different than the link above text, replace link children by a
 * new text. The new text has the same marks than the first text replaced.
 */
export const upsertLinkText = (
  editor: PlateEditor,
  { text }: UpsertLinkOptions
) => {
  const newLink = getAboveNode<TLinkElement>(editor, {
    match: { type: getPluginType(editor, ELEMENT_LINK) },
  });

  if (newLink) {
    const [newLinkNode, newLinkPath] = newLink;

    if (text?.length && text !== getEditorString(editor, newLinkPath)) {
      const firstText = newLinkNode.children[0];

      // remove link children
      replaceNodeChildren<TText>(editor, {
        at: newLinkPath,
        insertOptions: {
          select: true,
        },
        nodes: { ...firstText, text },
      });
    }
  }
};
