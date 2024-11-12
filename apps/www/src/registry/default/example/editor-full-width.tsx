'use client';

import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { Plate, usePlateEditor } from '@udecode/plate-common/react';

import { PlateUI } from '@/plate/demo/plate-ui';
import { FloatingToolbarPlugin } from '@/registry/default/components/editor/plugins/floating-toolbar-plugin';
import { Editor, EditorContainer } from '@/registry/default/plate-ui/editor';

export default function EditorDefault() {
  const editor = usePlateEditor({
    override: { components: PlateUI },
    plugins: [BasicElementsPlugin, BasicMarksPlugin, FloatingToolbarPlugin],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="fullWidth" placeholder="Type your message here." />
      </EditorContainer>
    </Plate>
  );
}
