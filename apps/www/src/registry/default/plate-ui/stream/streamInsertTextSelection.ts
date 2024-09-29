'use client';
import { AIPlugin } from '@udecode/plate-ai/react';
import { resetEditor } from '@udecode/plate-core';
import { type PlateEditor, ParagraphPlugin } from '@udecode/plate-core/react';
import { deserializeMd } from '@udecode/plate-markdown';
import { getEndPoint, insertText, withMerging } from '@udecode/slate';
import { insertEmptyElement, replaceNode } from '@udecode/slate-utils';

import { getNextPathByNumber } from '@/registry/default/plate-ui/utils/getNextPathByNumber';

import { getSelectionMenuSystem } from './getSystemMessage';
import { streamTraversal } from './streamTraversal';

interface StreamInsertTextSelectionOptions {
  prompt: string;
  system?: string;
}

export const streamInsertTextSelection = async (
  editor: PlateEditor,
  aiEditor: PlateEditor,
  {
    prompt,
    system = getSelectionMenuSystem(),
  }: StreamInsertTextSelectionOptions
) => {
  editor.setOptions(AIPlugin, {
    aiState: 'requesting',
    lastPrompt: prompt,
  });

  // const { output } = await generate(prompt, getSelectionMenuSystem());

  let workPath = [0];
  let matchStartCodeblock = false;
  let matchEndCodeblock = false;
  let chuck = '';

  aiEditor.children = [{ children: [{ text: '' }], type: 'p' }];
  resetEditor(aiEditor);

  await streamTraversal(
    editor,
    (delta, done) => {
      if (typeof delta !== 'string') return;
      // match code block
      if (delta.includes('``') && matchStartCodeblock) {
        matchEndCodeblock = true;
      }
      if (delta.includes('```') && !matchEndCodeblock) {
        matchStartCodeblock = true;
      }

      const matchParagraph = !matchStartCodeblock && delta.match(/\n+/g);
      const matchCodeblock = matchStartCodeblock && matchEndCodeblock;

      if (matchParagraph || matchCodeblock) {
        const parts = delta.split(/\n+/);
        const nextChunkStart = parts[1] ?? '';
        const previousChunkEnd = parts[0] ?? '';

        if (previousChunkEnd.length > 0) {
          insertText(aiEditor, previousChunkEnd, {
            at: getEndPoint(aiEditor, workPath),
          });
          chuck += previousChunkEnd;
        }

        matchStartCodeblock = false;
        matchEndCodeblock = false;

        const v = deserializeMd(aiEditor, chuck);

        const nextWorkPath = getNextPathByNumber(workPath, v.length);

        const replace = () => {
          replaceNode(aiEditor, {
            at: workPath,
            nodes: v,
          });

          if (!done) {
            insertEmptyElement(aiEditor, ParagraphPlugin.key, {
              at: nextWorkPath,
            });
          }
        };

        withMerging(aiEditor, replace);

        workPath = nextWorkPath;

        chuck = nextChunkStart;

        return;
      } else {
        chuck += delta;
      }
      if (delta) {
        insertText(aiEditor, delta, {
          at: getEndPoint(aiEditor, workPath),
        });
      }
    },
    // streamInsertTextSelectionOptions
    {
      prompt,
      system,
    }
  );

  editor.setOptions(AIPlugin, {
    aiState: 'done',
    lastPrompt: prompt,
    lastWorkPath: workPath,
  });
  editor.getApi(AIPlugin).ai.focusMenu();
};
