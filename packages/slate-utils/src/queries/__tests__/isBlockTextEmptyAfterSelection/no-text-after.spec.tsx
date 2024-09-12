/** @jsx jsx */

import type { SlateEditor } from '@udecode/plate-common';

import { createPlateEditor } from '@udecode/plate-common/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { jsx } from '@udecode/plate-test-utils';

import { isBlockTextEmptyAfterSelection } from '../../isBlockTextEmptyAfterSelection';

jsx;

const input = (
  <editor>
    <hp>
      <htext>first</htext>
      <ha>
        test
        <cursor />
      </ha>
    </hp>
  </editor>
) as any as SlateEditor;

const output = true;

it('should be', () => {
  const editor = createPlateEditor({
    editor: input,
    plugins: [LinkPlugin],
  });

  expect(isBlockTextEmptyAfterSelection(editor)).toEqual(output);
});
