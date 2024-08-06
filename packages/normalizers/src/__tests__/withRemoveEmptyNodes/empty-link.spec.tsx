/** @jsx jsx */

import { type PlateEditor, createPlateEditor } from '@udecode/plate-common';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { jsx } from '@udecode/plate-test-utils';

import { RemoveEmptyNodesPlugin } from '../../RemoveEmptyNodesPlugin';

jsx;

const input = (
  <editor>
    <hp>
      <ha url="http://google.com">
        <htext />
      </ha>
      <cursor />
    </hp>
  </editor>
) as any as PlateEditor;

const output = (
  <editor>
    <hp>
      <htext />
    </hp>
  </editor>
) as any;

it('should be', () => {
  const editor = createPlateEditor({
    editor: input,
    plugins: [
      RemoveEmptyNodesPlugin.configure({
        types: ELEMENT_LINK,
      }),
    ],
  });

  editor.normalizeNode([(input.children[0] as any).children[0], [0, 0]]);

  expect(input.children).toEqual(output.children);
});
