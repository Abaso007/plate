import { type PlateEditor, sanitizeUrl } from '@udecode/plate-common';

import { LinkPlugin } from '../LinkPlugin';

export const validateUrl = (editor: PlateEditor, url: string): boolean => {
  const { allowedSchemes, dangerouslySkipSanitization, isUrl } =
    editor.getOptions(LinkPlugin);

  if (isUrl && !isUrl(url)) return false;
  if (
    !dangerouslySkipSanitization &&
    !sanitizeUrl(url, {
      allowedSchemes,
      permitInvalid: true,
    })
  )
    return false;

  return true;
};
