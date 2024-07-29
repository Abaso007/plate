import React from 'react';

import type { PlateRenderLeafProps } from '../types/PlateRenderLeafProps';

export function DefaultLeaf({
  attributes,
  children,
  editor,
  leaf,
  nodeProps,
  text,
  ...props
}: PlateRenderLeafProps) {
  return (
    <span {...attributes} {...props}>
      {children}
    </span>
  );
}
