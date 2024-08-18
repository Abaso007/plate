import type { SlateEditor } from '@udecode/plate-common';

import { useEditorRef } from '@udecode/plate-common/react';

import type { SuggestionEditorProps } from '../../lib';

import { useSuggestionActions } from './SuggestionProvider';

export const useSetActiveSuggestionId = () => {
  const editor = useEditorRef<SlateEditor & SuggestionEditorProps>();
  const setActiveSuggestionId = useSuggestionActions().activeSuggestionId();

  return (value: null | string) => {
    setActiveSuggestionId(value);
    editor.activeSuggestionId = value;
  };
};
