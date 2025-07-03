import { type SlateEditor, sanitizeUrl } from 'platejs';

import { BaseLinkPlugin } from '../BaseLinkPlugin';

export const validateUrl = (editor: SlateEditor, url: string): boolean => {
  const { allowedSchemes, dangerouslySkipSanitization, isUrl } =
    editor.getOptions(BaseLinkPlugin);

  // Allow internal links starting with /
  if (url.startsWith('/')) {
    return true;
  }

  // For strings starting with #, check if it's a markdown heading
  if (url.startsWith('#')) {
    // Markdown headings have a space after the # symbols
    const markdownHeadingPattern = /^#{1,6}\s+/;
    if (markdownHeadingPattern.test(url)) {
      return false; // This is a markdown heading, not a valid link
    }
    return true; // This is an anchor link
  }

  // Check custom validator first if provided
  if (isUrl && !isUrl(url)) {
    return false;
  }

  // Always sanitize unless explicitly skipped
  if (
    !dangerouslySkipSanitization &&
    !sanitizeUrl(url, {
      allowedSchemes,
      permitInvalid: true,
    })
  ) {
    return false;
  }

  return true;
};
