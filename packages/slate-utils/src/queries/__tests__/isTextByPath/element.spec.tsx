/** @jsx jsx */

import type { SlateEditor } from '@udecode/plate-core';

import { jsx } from '@udecode/plate-test-utils';

import { isTextByPath } from '../../isTextByPath';

jsx;

const editor = (
  <editor>
    <hp>test</hp>
  </editor>
) as any as SlateEditor;

const path = [0];

const output = false;

it('should be', () => {
  expect(isTextByPath(editor, path)).toEqual(output);
});
