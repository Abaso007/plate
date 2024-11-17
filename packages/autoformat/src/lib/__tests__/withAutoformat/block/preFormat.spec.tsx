/** @jsx jsxt */

import { createSlateEditor } from '@udecode/plate-common';
import { jsxt } from '@udecode/plate-test-utils';
import { getAutoformatOptions } from 'www/src/lib/plate/demo/plugins/autoformatOptions';

import { BaseAutoformatPlugin } from '../../../BaseAutoformatPlugin';

jsxt;

const input = (
  <fragment>
    <hul>
      <hli>
        <hp>
          #
          <cursor />
          hello
        </hp>
      </hli>
    </hul>
  </fragment>
) as any;

const output = (
  <fragment>
    <hh1>hello</hh1>
  </fragment>
) as any;

it('should autoformat', () => {
  const editor = createSlateEditor({
    plugins: [
      BaseAutoformatPlugin.configure({ options: getAutoformatOptions() }),
    ],
    value: input,
  });

  editor.insertText(' ');

  expect(input.children).toEqual(output.children);
});
