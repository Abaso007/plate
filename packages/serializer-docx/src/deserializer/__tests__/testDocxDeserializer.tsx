/** @jsx jsx */

import type { PlatePluginList } from '@udecode/plate-common';

import { AlignPlugin } from '@udecode/plate-alignment';
import { BasicElementsPlugin } from '@udecode/plate-basic-elements';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks';
import {
  type OverridePlugins,
  createPlateEditor,
} from '@udecode/plate-common/server';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { IndentPlugin } from '@udecode/plate-indent';
import { JuicePlugin } from '@udecode/plate-juice';
import { LineHeightPlugin } from '@udecode/plate-line-height';
import { LinkPlugin } from '@udecode/plate-link';
import { ImagePlugin } from '@udecode/plate-media';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { TablePlugin } from '@udecode/plate-table';
import { jsx } from '@udecode/plate-test-utils';
import { alignPlugin } from 'www/src/lib/plate/demo/plugins/alignPlugin';
import { lineHeightPlugin } from 'www/src/lib/plate/demo/plugins/lineHeightPlugin';

import { readTestFile } from '../../__tests__/readTestFile';
import { DeserializeDocxPlugin } from '../DeserializeDocxPlugin';

jsx;

export const createClipboardData = (html: string, rtf?: string): DataTransfer =>
  ({
    getData: (format: string) => (format === 'text/html' ? html : rtf),
  }) as any;

export const getDocxTestName = (name: string) => `when pasting docx ${name}`;

export const testDocxDeserializer = ({
  expected,
  filename,
  input = (
    <editor>
      <hp>
        <cursor />
      </hp>
    </editor>
  ),
  overridePlugins,
  plugins = [],
}: {
  expected: any;
  filename: string;
  input?: any;
  overridePlugins?: OverridePlugins;
  plugins?: PlatePluginList;
}) => {
  it('should deserialize', () => {
    const actual = createPlateEditor({
      editor: input,
      override: {
        plugins: overridePlugins,
      },
      plugins: [
        ...plugins,
        ImagePlugin,
        HorizontalRulePlugin,
        LinkPlugin,
        TablePlugin,
        BasicElementsPlugin,
        BasicMarksPlugin,
        TablePlugin,
        LineHeightPlugin.extend(lineHeightPlugin),
        AlignPlugin.extend(alignPlugin),
        IndentPlugin.extend({
          inject: {
            props: {
              validTypes: [
                ELEMENT_PARAGRAPH,
                ELEMENT_H1,
                ELEMENT_H2,
                ELEMENT_H3,
              ],
            },
          },
        }),
        DeserializeDocxPlugin,
        JuicePlugin,
      ],
    });

    actual.insertData(
      createClipboardData(
        readTestFile(`../deserializer/__tests__/${filename}.html`)
      )
    );

    expect(actual.children).toEqual(expected.children);
  });
};
