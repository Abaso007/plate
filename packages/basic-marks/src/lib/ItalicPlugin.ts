import {
  type ToggleMarkPluginOptions,
  createSlatePlugin,
  someHtmlElement,
} from '@udecode/plate-common';

/** Enables support for italic formatting. */
export const ItalicPlugin = createSlatePlugin<
  'italic',
  ToggleMarkPluginOptions
>({
  deserializeHtml: {
    query: ({ element }) =>
      !someHtmlElement(element, (node) => node.style.fontStyle === 'normal'),
    rules: [
      { validNodeName: ['EM', 'I'] },
      { validStyle: { fontStyle: 'italic' } },
    ],
  },
  isLeaf: true,
  key: 'italic',
});
