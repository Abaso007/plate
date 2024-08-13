import {
  ListItemContentPlugin,
  ListItemPlugin,
  ListPlugin,
  ListUnorderedPlugin,
  TodoListPlugin,
} from '@udecode/plate-list';

import { serializeHtml } from '../../serializeHtml';
import { createPlateUIEditor } from '../create-plate-ui-editor';

it('serialize elements using useSlateStatic', () => {
  const plugins = [
    TodoListPlugin,
    ListPlugin.extendPlugin(ListItemPlugin.key, {
      type: 'list-item',
    })
      .extendPlugin(ListItemContentPlugin.key, {
        type: 'list-item-child',
      })
      .extendPlugin(ListUnorderedPlugin.key, {
        type: 'unordered-list',
      }),
  ];
  const editor = createPlateUIEditor({ plugins });
  const render = serializeHtml(editor, {
    nodes: [
      {
        checked: true,
        children: [{ text: 'Slide to the right.' }],
        type: TodoListPlugin.key,
      },
      {
        children: [
          {
            children: [
              {
                children: [{ text: 'Level 3' }],
                type: 'list-item-child',
              },
            ],
            type: 'list-item',
          },
        ],
        type: 'unordered-list',
      },
    ],
  });

  expect(render).toContain('type="button" role="checkbox"');
});
