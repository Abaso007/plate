import { useEditorRef, useHotkeys } from '@udecode/plate-common/react';

import { submitFloatingLink } from '../../transforms/submitFloatingLink';
import { useFloatingLinkSelectors } from './floatingLinkStore';

export const useFloatingLinkEnter = () => {
  const editor = useEditorRef();

  const open = useFloatingLinkSelectors().isOpen(editor.id);

  useHotkeys(
    '*',
    (e) => {
      if (e.key !== 'Enter') return;
      if (submitFloatingLink(editor)) {
        e.preventDefault();
      }
    },
    {
      enableOnFormTags: ['INPUT'],
      enabled: open,
    },
    []
  );
};
