import React from 'react';

import {
  findNodePath,
  useEditorRef,
  useElement,
} from '@udecode/plate-common/react';
import { getPluginOptions, setNodes } from '@udecode/plate-common';
import { useReadOnly } from 'slate-react';

import {
  type CodeBlockPluginOptions,
  ELEMENT_CODE_BLOCK,
  type TCodeBlockElement,
} from '../../lib';

export const useCodeBlockComboboxState = () => {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const element = useElement<TCodeBlockElement>();
  const [value, setValue] = React.useState(element.lang ?? 'text');

  const { syntaxPopularFirst } = getPluginOptions<CodeBlockPluginOptions>(
    editor,
    ELEMENT_CODE_BLOCK
  );

  React.useEffect(() => {
    setValue(element.lang ?? 'text');
  }, [element.lang]);

  return {
    element,
    readOnly,
    setValue,
    syntaxPopularFirst,
    value,
  };
};

export const useCodeBlockCombobox = ({
  element,
  setValue,
}: ReturnType<typeof useCodeBlockComboboxState>) => {
  const editor = useEditorRef();

  return {
    commandItemProps: {
      onSelect: (_value: string) => {
        const path = findNodePath(editor, element);
        path &&
          setNodes<TCodeBlockElement>(editor, { lang: _value }, { at: path });
        setValue(_value);
      },
    },
  };
};
