import {
  type PlateEditor,
  type PlatePluginKey,
  getBlockAbove,
  getPlugin,
  insertNodes,
  insertText,
  isEndPoint,
  moveSelection,
} from '@udecode/plate-common/server';

import type {
  MentionPluginOptions,
  TMentionElement,
  TMentionItemBase,
} from './types';

import { ELEMENT_MENTION } from './MentionPlugin';

export type MentionOnSelectItem<
  TItem extends TMentionItemBase = TMentionItemBase,
> = (editor: PlateEditor, item: TItem, search?: string) => void;

export const getMentionOnSelectItem =
  <TItem extends TMentionItemBase = TMentionItemBase>({
    key = ELEMENT_MENTION,
  }: PlatePluginKey = {}): MentionOnSelectItem<TItem> =>
  (editor, item, search = '') => {
    const {
      options: { createMentionNode, insertSpaceAfterMention },
      type,
    } = getPlugin<MentionPluginOptions>(editor as any, key);

    const props = createMentionNode!(item, search);

    insertNodes<TMentionElement>(editor, {
      children: [{ text: '' }],
      type,
      ...props,
    } as TMentionElement);

    // move the selection after the element
    moveSelection(editor, { unit: 'offset' });

    const pathAbove = getBlockAbove(editor)?.[1];

    const isBlockEnd =
      editor.selection &&
      pathAbove &&
      isEndPoint(editor, editor.selection.anchor, pathAbove);

    if (isBlockEnd && insertSpaceAfterMention) {
      insertText(editor, ' ');
    }
  };
