import type { SlateEditor } from 'platejs';

import { getListItemEntry } from '../index';

export const someList = (editor: SlateEditor, type: string) => {
  return getListItemEntry(editor)?.list?.[0].type === type;
};
