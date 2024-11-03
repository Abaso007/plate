import type { Registry } from '@/registry/schema';

const plugins: Registry = [
  {
    dependencies: [
      '@udecode/plate-ai',
      '@udecode/plate-basic-marks',
      '@udecode/plate-block-quote',
      '@udecode/plate-code-block',
      '@udecode/plate-font',
      '@udecode/plate-heading',
      '@udecode/plate-horizontal-rule',
      '@udecode/plate-indent',
      '@udecode/plate-indent-list',
      '@udecode/plate-link',
      '@udecode/plate-markdown',
      '@udecode/plate-selection',
      'prismjs',
    ],
    files: ['components/editor/plugins/ai-plugins.tsx'],
    name: 'ai-plugins',
    type: 'registry:component',
  },
  {
    dependencies: [
      '@udecode/plate-autoformat',
      '@udecode/plate-basic-marks',
      '@udecode/plate-block-quote',
      '@udecode/plate-code-block',
      '@udecode/plate-heading',
      '@udecode/plate-highlight',
      '@udecode/plate-horizontal-rule',
      '@udecode/plate-indent-list',
      '@udecode/plate-list',
      '@udecode/plate-toggle',
    ],
    files: ['components/editor/plugins/autoformat-plugin.ts'],
    name: 'autoformat-plugin',
    type: 'registry:component',
  },
  {
    dependencies: ['@udecode/plate-ai', '@udecode/plate-markdown'],
    files: ['components/editor/plugins/copilot-plugins.tsx'],
    name: 'copilot-plugins',
    registryDependencies: ['ghost-text'],
    type: 'registry:component',
  },
];

export const components: Registry = [
  ...plugins,
  {
    dependencies: [
      '@udecode/plate-callout',
      '@udecode/plate-code-block',
      '@udecode/plate-date',
      '@udecode/plate-heading',
      '@udecode/plate-indent-list',
      '@udecode/plate-layout',
      '@udecode/plate-link',
      '@udecode/plate-math',
      '@udecode/plate-media',
      '@udecode/plate-table',
    ],
    files: ['components/editor/transforms.ts'],
    name: 'transforms',
    type: 'registry:component',
  },
];
