import { BaseParagraphPlugin } from '@udecode/plate';
import {
  BaseBlockquotePlugin,
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseHorizontalRulePlugin,
} from '@udecode/plate-basic-nodes';

import { BlockquoteElementStatic } from '@/registry/ui/blockquote-node-static';
import {
  H1ElementStatic,
  H2ElementStatic,
  H3ElementStatic,
} from '@/registry/ui/heading-node-static';
import { HrElementStatic } from '@/registry/ui/hr-node-static';
import { ParagraphElementStatic } from '@/registry/ui/paragraph-node-static';

export const BaseBasicElementsKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),
  BaseH1Plugin.withComponent(H1ElementStatic),
  BaseH2Plugin.withComponent(H2ElementStatic),
  BaseH3Plugin.withComponent(H3ElementStatic),
  BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
  BaseHorizontalRulePlugin.withComponent(HrElementStatic),
];
