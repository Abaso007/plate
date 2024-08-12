import React from 'react';

import { BasicElementsPlugin } from '@udecode/plate-basic-elements';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks';
import { Plate, usePlateEditor } from '@udecode/plate-common/react';
import { ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { ELEMENT_IMAGE, ImagePlugin } from '@udecode/plate-media';
import { SelectOnBackspacePlugin } from '@udecode/plate-select';

import { PlaygroundTurnIntoDropdownMenu } from '@/components/plate-ui/playground-turn-into-dropdown-menu';
import { PlateUI } from '@/plate/demo/plate-ui';
import { basicElementsValue } from '@/plate/demo/values/basicElementsValue';
import { basicMarksValue } from '@/plate/demo/values/basicMarksValue';
import { imageValue } from '@/plate/demo/values/mediaValue';
import { Editor } from '@/registry/default/plate-ui/editor';
import { FixedToolbar } from '@/registry/default/plate-ui/fixed-toolbar';
import { Separator } from '@/registry/default/plate-ui/separator';

export default function MultipleEditorsDemo() {
  const editor = usePlateEditor({
    override: { components: PlateUI },
    plugins: [BasicElementsPlugin, BasicMarksPlugin],
    value: basicElementsValue,
  });

  const editorMarks = usePlateEditor({
    id: 'marks',
    override: { components: PlateUI },
    plugins: [BasicElementsPlugin, BasicMarksPlugin],
    value: basicMarksValue,
  });

  const editorImage = usePlateEditor({
    id: 'marks',
    override: { components: PlateUI },
    plugins: [
      BasicElementsPlugin,
      BasicMarksPlugin,
      ImagePlugin,
      SelectOnBackspacePlugin.configure({
        query: {
          allow: [ELEMENT_IMAGE, ELEMENT_HR],
        },
      }),
    ],
    value: imageValue,
  });

  return (
    <Plate editor={editor}>
      <Plate editor={editorMarks}>
        <Plate editor={editorImage}>
          <FixedToolbar>
            <PlaygroundTurnIntoDropdownMenu />
          </FixedToolbar>

          <div>
            <Editor />
            <Separator />
            <Editor id="marks" />
            <Separator />
            <Editor id="image" />
          </div>
        </Plate>
      </Plate>
    </Plate>
  );
}
