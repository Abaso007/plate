import React from 'react';

import { EXPOSED_STORE_KEYS } from '../../lib/types/PlateStore';
import { useEditorRef, usePlateStore, useRedecorate } from '../stores';

export const EditorMethodsEffect = ({ id }: { id?: string }) => {
  const editor = useEditorRef(id);
  const redecorate = useRedecorate(id);

  const plateStore = usePlateStore(id);

  // Must be in a scope where hooks can be called.
  const storeSetters = Object.fromEntries(
    EXPOSED_STORE_KEYS.map((key) => [key, plateStore.set[key]()])
  ) as any;

  // es lint-disable-next-line react-hooks/exhaustive-deps
  const memorizedStoreSetters = React.useMemo(() => storeSetters, []);

  React.useEffect(() => {
    editor.api.redecorate = redecorate;
    editor.api.setStore = memorizedStoreSetters;
  }, [editor, redecorate, memorizedStoreSetters]);

  return null;
};
