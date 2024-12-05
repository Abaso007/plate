import React from 'react';

import {
  type TDescendant,
  type TElement,
  type TText,
  isElement,
} from '@udecode/slate';

import type { SlateEditor } from '../../editor';
import type { RenderStaticElement, RenderStaticLeaf } from '../type';

import { pipeRenderStaticElement } from '../pipeRenderStaticElement';
import { pipeRenderStaticLeaf } from '../pipeRenderStaticLeaf';
import { createStaticString } from '../utils/createStaticString';

export type ChildrenProps = {
  children: TDescendant[];
  editor: SlateEditor;
};

export type ElementProps = {
  editor: SlateEditor;
  element: TElement;
};

export type LeafProps = {
  editor: SlateEditor;
  leaf: TText;
};

export type PlateViewProps = {
  editor: SlateEditor;
  renderElement?: RenderStaticElement;
  renderLeaf?: RenderStaticLeaf;
};

function Element({
  editor,
  element = { children: [], type: '' },
}: ElementProps) {
  const renderElement = pipeRenderStaticElement(editor);

  return (
    <React.Fragment>
      {renderElement?.({
        attributes: { 'data-slate-node': 'element', ref: null },
        children: (
          <PlateViewContent editor={editor}>
            {element.children}
          </PlateViewContent>
        ),
        element,
      })}
    </React.Fragment>
  );
}

function Leaf({ editor, leaf = { text: '' } }: LeafProps) {
  const renderLeaf = pipeRenderStaticLeaf(editor);

  return renderLeaf!({
    attributes: { 'data-slate-leaf': true },
    children: createStaticString({ text: leaf.text }),
    leaf,
    text: leaf,
  });
}

function PlateViewContent({ children = [], editor }: ChildrenProps) {
  return (
    <React.Fragment>
      {children.map((child, i) => {
        return isElement(child) ? (
          <Element key={i} editor={editor} element={child} />
        ) : (
          <Leaf key={i} editor={editor} leaf={child} />
        );
      })}
    </React.Fragment>
  );
}

export function PlateStatic(props: PlateViewProps) {
  const { editor } = props;

  return <PlateViewContent editor={editor}>{editor.children}</PlateViewContent>;
}
