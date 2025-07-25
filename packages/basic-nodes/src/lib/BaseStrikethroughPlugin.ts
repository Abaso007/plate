import { createSlatePlugin, KEYS, someHtmlElement } from 'platejs';

/** Enables support for strikethrough formatting. */
export const BaseStrikethroughPlugin = createSlatePlugin({
  key: KEYS.strikethrough,
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ['S', 'DEL', 'STRIKE'] },
          { validStyle: { textDecoration: 'line-through' } },
        ],
        query: ({ element }) =>
          !someHtmlElement(
            element,
            (node) => node.style.textDecoration === 'none'
          ),
      },
    },
  },
  render: { as: 's' },
  rules: { selection: { affinity: 'directional' } },
}).extendTransforms(({ editor, type }) => ({
  toggle: () => {
    editor.tf.toggleMark(type);
  },
}));
