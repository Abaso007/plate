import React from 'react';

import {
  getAboveNode,
  getEndPoint,
  getPluginOptions,
  getPluginType,
  getStartPoint,
  someNode,
} from '@udecode/plate-common';
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorVersion,
  useHotkeys,
} from '@udecode/plate-common/react';
import {
  getDefaultBoundingClientRect,
  getRangeBoundingClientRect,
} from '@udecode/plate-floating';

import { LinkPlugin, type LinkPluginOptions } from '../../LinkPlugin';
import { type LinkFloatingToolbarState, unwrapLink } from '../../index';
import { triggerFloatingLinkEdit } from '../../utils/triggerFloatingLinkEdit';
import {
  floatingLinkActions,
  floatingLinkSelectors,
  useFloatingLinkSelectors,
} from './floatingLinkStore';
import { useFloatingLinkEnter } from './useFloatingLinkEnter';
import { useFloatingLinkEscape } from './useFloatingLinkEscape';
import { useVirtualFloatingLink } from './useVirtualFloatingLink';

export const useFloatingLinkEditState = ({
  floatingOptions,
}: LinkFloatingToolbarState = {}) => {
  const editor = useEditorRef();
  const { triggerFloatingLinkHotkeys } = getPluginOptions<LinkPluginOptions>(
    editor,
    LinkPlugin.key
  );
  const readOnly = useEditorReadOnly();
  const isEditing = useFloatingLinkSelectors().isEditing();
  const version = useEditorVersion();
  const mode = useFloatingLinkSelectors().mode();
  const open = useFloatingLinkSelectors().isOpen(editor.id);

  const getBoundingClientRect = React.useCallback(() => {
    const entry = getAboveNode(editor, {
      match: { type: getPluginType(editor, LinkPlugin.key) },
    });

    if (entry) {
      const [, path] = entry;

      return getRangeBoundingClientRect(editor, {
        anchor: getStartPoint(editor, path),
        focus: getEndPoint(editor, path),
      });
    }

    return getDefaultBoundingClientRect();
  }, [editor]);

  const isOpen = open && mode === 'edit';

  const floating = useVirtualFloatingLink({
    editorId: editor.id,
    getBoundingClientRect,
    open: isOpen,
    ...floatingOptions,
  });

  return {
    editor,
    floating,
    isEditing,
    isOpen,
    readOnly,
    triggerFloatingLinkHotkeys,
    versionEditor: version,
  };
};

export const useFloatingLinkEdit = ({
  editor,
  floating,
  triggerFloatingLinkHotkeys,
  versionEditor,
}: ReturnType<typeof useFloatingLinkEditState>) => {
  React.useEffect(() => {
    if (
      editor.selection &&
      someNode(editor, {
        match: { type: getPluginType(editor, LinkPlugin.key) },
      })
    ) {
      floatingLinkActions.show('edit', editor.id);
      floating.update();

      return;
    }
    if (floatingLinkSelectors.mode() === 'edit') {
      floatingLinkActions.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, versionEditor, floating.update]);

  useHotkeys(
    triggerFloatingLinkHotkeys!,
    (e) => {
      if (
        floatingLinkSelectors.mode() === 'edit' &&
        triggerFloatingLinkEdit(editor)
      ) {
        e.preventDefault();
      }
    },
    {
      enableOnContentEditable: true,
    },
    []
  );

  useFloatingLinkEnter();

  useFloatingLinkEscape();

  return {
    editButtonProps: {
      onClick: () => {
        triggerFloatingLinkEdit(editor);
      },
    },
    props: {
      style: {
        ...floating.style,
        zIndex: 50,
      },
    },
    ref: floating.refs.setFloating,
    unlinkButtonProps: {
      onClick: () => {
        unwrapLink(editor);
      },
      onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      },
    },
  };
};
