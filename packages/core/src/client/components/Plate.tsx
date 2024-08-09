import React from 'react';

import type {
  PlateEditor,
  PlateStoreState,
  TEditableProps,
} from '../../shared/types';

import { PlateStoreProvider } from '../stores';

export interface PlateProps<E extends PlateEditor = PlateEditor>
  extends Partial<
    Pick<
      PlateStoreState<E>,
      | 'decorate'
      | 'onChange'
      | 'onSelectionChange'
      | 'onValueChange'
      | 'primary'
      | 'readOnly'
    >
  > {
  children: React.ReactNode;

  editor: E;

  renderElement?: TEditableProps['renderElement'];

  renderLeaf?: TEditableProps['renderLeaf'];
}

function PlateInner({
  children,
  decorate,
  editor,
  onChange,
  onSelectionChange,
  onValueChange,
  primary,
  readOnly,
  renderElement,
  renderLeaf,
}: PlateProps) {
  return (
    <PlateStoreProvider
      decorate={decorate}
      editor={editor}
      onChange={onChange as PlateStoreState['onChange']}
      onSelectionChange={
        onSelectionChange as PlateStoreState['onSelectionChange']
      }
      onValueChange={onValueChange as PlateStoreState['onValueChange']}
      primary={primary}
      readOnly={readOnly}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      scope={editor.id}
    >
      {children}
    </PlateStoreProvider>
  );
}

export function Plate<E extends PlateEditor = PlateEditor>(
  props: PlateProps<E>
) {
  return <PlateInner key={props.editor.id?.toString()} {...(props as any)} />;
}
