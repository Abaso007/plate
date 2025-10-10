import type {
  ChatMessage,
  ToolName,
} from '@/registry/components/editor/use-chat';
import type { NextRequest } from 'next/server';

import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { getMarkdown } from '@platejs/ai';
import { serializeMd } from '@platejs/markdown';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  streamObject,
  streamText,
} from 'ai';
import dedent from 'dedent';
import { NextResponse } from 'next/server';
import { type SlateEditor, createSlateEditor, nanoid, RangeApi } from 'platejs';
import { z } from 'zod';

import { BaseEditorKit } from '@/registry/components/editor/editor-base-kit';
import { markdownJoinerTransform } from '@/registry/lib/markdown-joiner-transform';

import { buildStructuredPrompt, formatTextFromMessages } from './utils';

export async function POST(req: NextRequest) {
  const { apiKey: key, ctx, messages: messagesRaw } = await req.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    selection,
    value: children,
  });

  const apiKey = key || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OpenAI API key.' },
      { status: 401 }
    );
  }

  const isSelecting = editor.api.isExpanded();

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const chooseToolPrompt = buildStructuredPrompt({
            examples: [
              // GENERATE
              'User: "Write a paragraph about AI ethics" → Good: "generate" | Bad: "edit"',
              'User: "Create a short poem about spring" → Good: "generate" | Bad: "comment"',

              // EDIT
              'User: "Please fix grammar." → Good: "edit" | Bad: "generate"',
              'User: "Improving writing style." → Good: "edit" | Bad: "generate"',
              'User: "Making it more concise." → Good: "edit" | Bad: "generate"',
              'User: "Translate this paragraph into French" → Good: "edit" | Bad: "generate"',

              // COMMENT
              'User: "Can you review this text and give me feedback?" → Good: "comment" | Bad: "edit"',
              'User: "Add inline comments to this code to explain what it does" → Good: "comment" | Bad: "generate"',
            ],
            history: formatTextFromMessages(messagesRaw),
            rules: dedent`
              - Default is "generate". Any open question, idea request, or creation request → "generate".
              - Only return "edit" if the user provides original text (or a selection of text) AND asks to change, rephrase, translate, or shorten it.
              - Only return "comment" if the user explicitly asks for comments, feedback, annotations, or review. Do not infer "comment" implicitly.
              - Return only one enum value with no explanation.
            `,
            task: `You are a strict classifier. Classify the user's last request as "generate", "edit", or "comment".`,
          });

          const { object: AIToolName } = await generateObject({
            enum: isSelecting
              ? ['generate', 'edit', 'comment']
              : ['generate', 'comment'],
            model: google('gemini-2.5-flash'),
            output: 'enum',
            prompt: chooseToolPrompt,
          });

          writer.write({
            data: AIToolName as ToolName,
            type: 'data-toolName',
          });

          toolName = AIToolName;
        }

        if (toolName === 'generate') {
          !isMultiBlocks(editor) && addSelection(editor);

          const selectingMarkdwon = removeEscapeSelection(
            editor,
            getMarkdown(editor, { type: 'block' })
          );

          const generatePrompt = buildStructuredPrompt({
            backgroundData: selectingMarkdwon,
            examples: [
              // 1) Summarize content
              'User: Summarize the following text.\nBackground data:\nArtificial intelligence has transformed multiple industries, from healthcare to finance, improving efficiency and enabling data-driven decisions.\nOutput:\nAI improves efficiency and decision-making across many industries.',

              // 2) Generate key takeaways
              'User: List three key takeaways from this text.\nBackground data:\nRemote work increases flexibility but also requires better communication and time management.\nOutput:\n- Remote work enhances flexibility.\n- Communication becomes critical.\n- Time management determines success.',

              // 3) Generate a title
              'User: Generate a short, catchy title for this section.\nBackground data:\nThis section explains how machine learning models are trained using large datasets to recognize patterns.\nOutput:\nTraining Machines to Recognize Patterns',

              // 4) Generate action items
              'User: Generate actionable next steps based on the paragraph.\nBackground data:\nThe report suggests improving documentation and conducting user interviews before the next release.\nOutput:\n- Update all technical documentation.\n- Schedule user interviews before the next release.',

              // 5) Generate a comparison table
              'User: Generate a comparison table of the tools mentioned.\nBackground data:\nTool A: free, simple UI\nTool B: paid, advanced analytics\nOutput:\n| Tool  | Pricing | Features         |\n|-------|----------|-----------------|\n| A     | Free     | Simple UI        |\n| B     | Paid     | Advanced analytics |',

              // 6) Generate a summary table of statistics
              'User: Create a summary table of the following statistics.\nBackground data:\nSales Q1: 1200 units\nSales Q2: 1500 units\nSales Q3: 900 units\nOutput:\n| Quarter | Sales (units) |\n|----------|---------------|\n| Q1       | 1200          |\n| Q2       | 1500          |\n| Q3       | 900           |',

              // 7) Generate a question list
              'User: Generate three reflection questions based on the paragraph.\nBackground data:\nThe article discusses the role of creativity in problem-solving and how diverse perspectives enhance innovation.\nOutput:\n1. How can creativity be encouraged in structured environments?\n2. What role does diversity play in innovative teams?\n3. How can leaders balance creativity and efficiency?',

              // 8) Explain a concept (selected phrase)
              'User: Explain the meaning of the selected phrase.\nBackground data:\nDeep learning relies on neural networks to automatically extract patterns from data, a process called <Selection>feature learning</Selection>.\nOutput:\n"Feature learning" means automatically discovering useful representations or characteristics from raw data without manual intervention.',
            ],
            history: formatTextFromMessages(messagesRaw),
            rules: dedent`
              - <Selection> is the text highlighted by the user.
              - backgroundData represents the user's current Markdown context.
              - You may only use backgroundData and <Selection> as input; never ask for more data.
              - CRITICAL: DO NOT remove or alter custom MDX tags such as <u>, <callout>, <kbd>, <toc>, <sub>, <sup>, <mark>, <del>, <date>, <span>, <column>, <column_group>, <file>, <audio>, <video> unless explicitly requested.
              - CRITICAL: when writing Markdown or MDX, do NOT wrap output in code fences.
              - Preserve indentation and line breaks when editing within columns or structured layouts.
            `,
            task: dedent`
              You are an advanced content generation assistant.
              Generate content based on the user's instructions, using the background data as context.
              If the instruction requests creation or transformation (e.g., summarize, translate, rewrite, create a table), directly produce the final result using only the provided background data.
              Do not ask the user for additional content.
            `,
          });

          const gen = streamText({
            experimental_transform: markdownJoinerTransform(),
            model: openai('gpt-4o-mini'),
            prompt: generatePrompt,
          });

          writer.merge(gen.toUIMessageStream({ sendFinish: false }));
        }

        if (toolName === 'edit') {
          if (!isSelecting)
            throw new Error('Edit tool is only available when selecting');

          let editPrompt;

          if (isMultiBlocks(editor)) {
            const selectingMarkdwon = getMarkdown(editor, { type: 'block' });

            editPrompt = buildStructuredPrompt({
              backgroundData: selectingMarkdwon,
              examples: [
                // 1) Fix grammar
                'User: Fix grammar.\nbackgroundData: # User Guide\nThis guide explain how to install the app.\nOutput:\n# User Guide\nThis guide explains how to install the application.',

                // 2) Make the tone more formal and professional
                "User: Make the tone more formal and professional.\nbackgroundData: ## Intro\nHey, here's how you can set things up quickly.\nOutput:\n## Introduction\nThis section describes the setup procedure in a clear and professional manner.",

                // 3) Make it more concise without losing meaning
                'User: Make it more concise without losing meaning.\nbackgroundData: The purpose of this document is to provide an overview that explains, in detail, all the steps required to complete the installation.\nOutput:\nThis document provides a detailed overview of the installation steps.',

                // 4) Translate
                'User: Translate into French.\nbackgroundData: ## Features\n- Fast startup\n- Easy configuration\nOutput:\n## Fonctionnalités\n- Démarrage rapide\n- Configuration simple',
              ],
              history: formatTextFromMessages(messagesRaw),
              outputFormatting: 'markdown',
              rules: dedent`
                - background data represents the full blocks of text the user has selected and wants to modify or ask about.
                - Your response should be a direct replacement for the entire background data.
                - Maintain the overall structure and formatting of the background data, unless explicitly instructed otherwise.
                - CRITICAL: Provide only the content to replace background data. Do not add additional blocks or change the block structure unless specifically requested.
              `,
              task: `The following background data is user-provided Markdown content that needs improvement. Modify it according to the user's instruction.
            Unless explicitly stated otherwise, your output should be a seamless replacement of the original content.`,
            });
          } else {
            addSelection(editor);

            const selectingMarkdwon = removeEscapeSelection(
              editor,
              getMarkdown(editor, { type: 'block' })
            );

            const endIndex = selectingMarkdwon.indexOf(SELECTION_START);
            const prefilledResponse = selectingMarkdwon.slice(0, endIndex);

            editPrompt = buildStructuredPrompt({
              backgroundData: selectingMarkdwon,
              examples: [
                // 1) Improve word choice
                'User: Improve word choice.\nbackgroundData: This is a <Selection>nice</Selection> person.\nOutput: great',

                // 2) Fix grammar
                'User: Fix grammar.\nbackgroundData: He <Selection>go</Selection> to school every day.\nOutput: goes',

                // 3) Make tone more polite
                'User: Make tone more polite.\nbackgroundData: <Selection>Give me</Selection> the report.\nOutput: Please provide',

                // 4) Make tone more confident
                'User: Make tone more confident.\nbackgroundData: I <Selection>think</Selection> this might work.\nOutput: believe',

                // 5) Simplify language
                'User: Simplify the language.\nbackgroundData: The results were <Selection>exceedingly</Selection> positive.\nOutput: very',

                // 6) Translate into French
                'User: Translate into French.\nbackgroundData: <Selection>Hello</Selection>\nOutput: Bonjour',

                // 7) Expand description
                'User: Expand the description.\nbackgroundData: The view was <Selection>beautiful</Selection>.\nOutput: breathtaking and full of vibrant colors',

                // 8) Make it sound more natural
                'User: Make it sound more natural.\nbackgroundData: She <Selection>did a party</Selection> yesterday.\nOutput: had a party',
              ],
              history: formatTextFromMessages(messagesRaw),
              outputFormatting: 'markdown',
              prefilledResponse,
              rules: dedent`
                - <Selection> contains the text segment selected by the user and allowed to be modified.
                - Your response will be directly concatenated with the prefilledResponse, so please make sure the result is smooth and coherent.
                - You may only edit the content inside <Selection> and must not reference or retain any external context.
                - The output must be text that can directly replace <Selection>.
                - Do not include the <Selection> tags or any surrounding text in the output.
                - Ensure the replacement is grammatically correct and reads naturally.
                - If the input is invalid or cannot be improved, return it unchanged.
              `,
              task: dedent`
                The following background data is user-provided text that contains one or more <Selection> tags marking the editable parts.
                You must only modify the text inside <Selection>.
                Your output should be a direct replacement for the selected text, without including any tags or surrounding content.
                Ensure the replacement is grammatically correct and fits naturally when substituted back into the original text.
              `,
            });
          }

          const edit = streamText({
            experimental_transform: markdownJoinerTransform(),
            model: google('gemini-2.5-flash'),
            prompt: editPrompt,
          });

          writer.merge(edit.toUIMessageStream({ sendFinish: false }));
        }

        if (toolName === 'comment') {
          const selectingMarkdwon = getMarkdown(editor, {
            type: 'blockWithBlockId',
          });

          console.log('🚀 ~ POST ~ selectingMarkdwon:', selectingMarkdwon);

          const commentPrompt = buildStructuredPrompt({
            backgroundData: selectingMarkdwon,
            examples: [
              // 1) Basic single-block comment
              `User: Review this paragraph.

              backgroundData:
            <block id="1">AI systems are transforming modern workplaces by automating routine tasks.</block>
            
            Output:
            [
              {
                "blockId": "1",
                "content": "AI systems are transforming modern workplaces",
                "comments": "Clarify what types of systems or provide examples."
              }
            ]`,

              // 2) Multiple comments within one long block
              `User: Add comments for this section.

            backgroundData:
            <block id="2">AI models can automate customer support. However, they may misinterpret user intent if training data is biased.</block>
            
            Output:
            [
              {
                "blockId": "2",
                "content": "AI models can automate customer support.",
                "comments": "Consider mentioning limitations or scope of automation."
              },
              {
                "blockId": "2",
                "content": "they may misinterpret user intent if training data is biased",
                "comments": "Good point—expand on how bias can be detected or reduced."
              }
            ]`,

              // 3) Multi-block comment (span across two related paragraphs)
              `User: Provide comments.

            backgroundData:
            <block id="3">This policy aims to regulate AI-generated media.</block>
            <block id="4">Developers must disclose when content is synthetically produced.</block>
            
            Output:
            [
              {
                "blockId": "3",
                "content": "This policy aims to regulate AI-generated media.\\n\\nDevelopers must disclose when content is synthetically produced.",
                "comments": "You could combine these ideas into a single, clearer statement on transparency."
              }
            ]`,

              // 4) With <Selection> – user highlighted part of a sentence
              `User: Give feedback on this highlighted phrase.

            backgroundData:
            <block id="5">AI can <Selection>replace human creativity</Selection> in design tasks.</block>
            
            Output:
            [
              {
                "blockId": "5",
                "content": "replace human creativity",
                "comments": "Overstated claim—suggest using 'assist' instead of 'replace'."
              }
            ]`,

              // 5) With long <Selection> → multiple comments
              `User: Review the highlighted section.

            backgroundData:
            <block id="6">
            <Selection>
            AI tools are valuable for summarizing information and generating drafts.
            Still, human review remains essential to ensure accuracy and ethical use.
            </Selection>
            </block>
            
            Output:
            [
              {
                "blockId": "6",
                "content": "AI tools are valuable for summarizing information and generating drafts.",
                "comments": "Solid statement—consider adding specific examples of tools."
              },
              {
                "blockId": "6",
                "content": "human review remains essential to ensure accuracy and ethical use",
                "comments": "Good caution—explain briefly why ethics require human oversight."
              }
            ]`,
            ],
            history: formatTextFromMessages(messagesRaw),
            rules: dedent`
              - IMPORTANT: If a comment spans multiple blocks, use the id of the **first** block.
              - The **content** field must be the original content inside the block tag. The returned content must not include the block tags, but should retain other MDX tags.
              - IMPORTANT: The **content** field must be flexible:
                - It can cover one full block, only part of a block, or multiple blocks.  
                - If multiple blocks are included, separate them with two \\n\\n.  
                - Do NOT default to using the entire block—use the smallest relevant span instead.
              - At least one comment must be provided.
              - If a <Selection> exists, Your comments should come from the <Selection>, and if the <Selection> is too long, there should be more than one comment.
            `,
            task: dedent`
              You are a document review assistant.  
              You will receive an MDX document wrapped in <block id="..."> content </block> tags.  
              <Selection> is the text highlighted by the user.

              Your task:  
              - Read the content of all blocks and provide comments.  
              - For each comment, generate a JSON object:  
                - blockId: the id of the block being commented on.
                - content: the original document fragment that needs commenting.
                - comments: a brief comment or explanation for that fragment.
            `,
          });

          const { elementStream } = streamObject({
            model: google('gemini-2.5-flash'),
            output: 'array',
            prompt: commentPrompt,
            schema: z
              .object({
                blockId: z
                  .string()
                  .describe(
                    'The id of the starting block. If the comment spans multiple blocks, use the id of the first block.'
                  ),
                comment: z
                  .string()
                  .describe(
                    'A brief comment or explanation for this fragment.'
                  ),
                content: z
                  .string()
                  .describe(
                    String.raw`The original document fragment to be commented on.It can be the entire block, a small part within a block, or span multiple blocks. If spanning multiple blocks, separate them with two \n\n.`
                  ),
              })
              .describe('A single comment'),
          });

          // Create a single message ID for the entire comment stream

          for await (const comment of elementStream) {
            const commentDataId = nanoid();
            // Send each comment as a delta

            writer.write({
              id: commentDataId,
              data: comment,
              type: 'data-comment',
            });
          }
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

const SELECTION_START = '<Selection>';
const SELECTION_END = '</Selection>';

const addSelection = (editor: SlateEditor) => {
  if (!editor.selection) return;

  if (editor.api.isExpanded()) {
    const [start, end] = RangeApi.edges(editor.selection);

    editor.tf.withoutNormalizing(() => {
      editor.tf.insertText(SELECTION_END, {
        at: end,
      });

      editor.tf.insertText(SELECTION_START, {
        at: start,
      });
    });
  }
};

const removeEscapeSelection = (editor: SlateEditor, text: string) => {
  let newText = text
    .replace(`\\${SELECTION_START}`, SELECTION_START)
    .replace(`\\${SELECTION_END}`, SELECTION_END);

  // If the selection is on a void element, inserting the placeholder will fail, and the string must be replaced manually.
  if (!newText.includes(SELECTION_END)) {
    const [_, end] = RangeApi.edges(editor.selection!);

    const node = editor.api.block({ at: end.path });

    if (!node) return newText;

    if (editor.api.isVoid(node[0])) {
      const voidString = serializeMd(editor, { value: [node[0]] });

      const idx = newText.lastIndexOf(voidString);

      if (idx !== -1) {
        newText =
          newText.slice(0, idx) +
          voidString.trimEnd() +
          SELECTION_END +
          newText.slice(idx + voidString.length);
      }
    }
  }

  return newText;
};

/** Check if the current selection fully covers all top-level blocks. */
const isMultiBlocks = (editor: SlateEditor) => {
  const blocks = editor.api.blocks({ mode: 'highest' });

  return blocks.length > 1;
};
