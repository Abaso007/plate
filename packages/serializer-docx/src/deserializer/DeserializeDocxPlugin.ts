import { getPluginType } from '@udecode/plate-common';
import {
  type DeserializeHtml,
  KEY_DESERIALIZE_HTML,
  createPlugin,
} from '@udecode/plate-common';

import { cleanDocx } from '../docx-cleaner/cleanDocx';
import {
  getDocxIndent,
  getDocxTextIndent,
} from '../docx-cleaner/utils/getDocxIndent';
import { getDocxListContentHtml } from '../docx-cleaner/utils/getDocxListContentHtml';
import { getDocxListIndent } from '../docx-cleaner/utils/getDocxListIndent';
import { getTextListStyleType } from '../docx-cleaner/utils/getTextListStyleType';
import { isDocxContent } from '../docx-cleaner/utils/isDocxContent';
import { isDocxList } from '../docx-cleaner/utils/isDocxList';

export const KEY_DESERIALIZE_DOCX = 'deserializeDocx';

const getListNode =
  (type: string): DeserializeHtml['getNode'] =>
  ({ element }) => {
    const node: any = { type };

    if (isDocxList(element)) {
      node.indent = getDocxListIndent(element);

      const text = element.textContent ?? '';

      node.listStyleType = getTextListStyleType(text) ?? 'disc';

      element.innerHTML = getDocxListContentHtml(element);
    } else {
      const indent = getDocxIndent(element);

      if (indent) {
        node.indent = indent;
      }

      const textIndent = getDocxTextIndent(element);

      if (textIndent) {
        node.textIndent = textIndent;
      }
    }

    return node;
  };

export const DeserializeDocxPlugin = createPlugin((editor) => ({
  inject: {
    plugins: {
      [KEY_DESERIALIZE_HTML]: {
        editor: {
          insertData: {
            transformData: ({ data, dataTransfer }) => {
              const rtf = dataTransfer.getData('text/rtf');

              return cleanDocx(data, rtf);
            },
          },
        },
      },
    },
  },
  key: KEY_DESERIALIZE_DOCX,
  override: {
    plugins: {
      ...Object.fromEntries(
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((key) => [
          key,
          {
            deserializeHtml: {
              getNode: getListNode(getPluginType(editor, key)),
            },
          },
        ])
      ),
      img: {
        editor: {
          insertData: {
            query: ({ dataTransfer }) => {
              const data = dataTransfer.getData('text/html');
              const { body } = new DOMParser().parseFromString(
                data,
                'text/html'
              );

              return !isDocxContent(body);
            },
          },
        },
      },
    },
  },
}));
