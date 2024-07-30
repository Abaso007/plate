import type { PlateEditor, TElement } from '@udecode/plate-common/server';

export interface TriggerComboboxPluginOptions {
  createComboboxInput?: (trigger: string) => TElement;
  trigger?: RegExp | string | string[];
  triggerPreviousCharPattern?: RegExp;
  triggerQuery?: (editor: PlateEditor) => boolean;
}

export type ComboboxInputCursorState = {
  atEnd: boolean;
  atStart: boolean;
};

export type CancelComboboxInputCause =
  | 'arrowLeft'
  | 'arrowRight'
  | 'backspace'
  | 'blur'
  | 'deselect'
  | 'escape'
  | 'manual';
