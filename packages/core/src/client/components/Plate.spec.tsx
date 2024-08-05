import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import {
  createPlateEditor,
  useEditorRef,
  usePlateSelectors,
} from '@udecode/plate-common';

import { createPlugin } from '../../shared';
import { PlateController, usePlateEditorStore } from '../stores';
import { Plate } from './Plate';

describe('Plate', () => {
  describe('useEditorRef()', () => {
    describe('when editor is defined', () => {
      it('should be initialValue', async () => {
        const editor = createPlateEditor();

        const wrapper = ({ children }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { result } = renderHook(() => useEditorRef(), {
          wrapper,
        });

        expect(result.current).toBe(editor);
      });
    });

    describe('when editor is not defined', () => {
      it('should be default', async () => {
        const editor1 = createPlateEditor({ id: 'test1' });
        const editor2 = createPlateEditor({ id: 'test2' });

        const wrapper = ({ children }: any) => (
          <Plate editor={editor1}>
            <Plate editor={editor2}>{children}</Plate>
          </Plate>
        );

        const { result } = renderHook(() => useEditorRef(), {
          wrapper,
        });

        expect(result.current.id).toBe('test2');
      });
    });

    describe('when id is defined', () => {
      it('should be id', async () => {
        const editor1 = createPlateEditor({ id: 'test1' });
        const editor2 = createPlateEditor({ id: 'test2' });

        const wrapper = ({ children }: any) => (
          <Plate editor={editor1}>
            <Plate editor={editor2}>{children}</Plate>
          </Plate>
        );

        const { result: result1 } = renderHook(() => useEditorRef('test1'), {
          wrapper,
        });
        const { result: result2 } = renderHook(() => useEditorRef('test2'), {
          wrapper,
        });

        expect(result1.current.id).toBe('test1');
        expect(result2.current.id).toBe('test2');
      });
    });
  });

  describe('usePlateSelectors().value()', () => {
    describe('when initialValue is defined', () => {
      it('should be initialValue', async () => {
        const initialValue = [{ children: [{ text: 'test' }], type: 'p' }];
        const editor = createPlateEditor();

        const wrapper = ({ children }: any) => (
          <Plate editor={editor} initialValue={initialValue}>
            {children}
          </Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().value(), {
          wrapper,
        });

        expect(result.current).toBe(initialValue);
      });
    });

    describe('when value is defined', () => {
      it('should be value', async () => {
        const value = [{ children: [{ text: 'value' }], type: 'p' }];
        const editor = createPlateEditor();

        const wrapper = ({ children }: any) => (
          <Plate editor={editor} value={value}>
            {children}
          </Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().value(), {
          wrapper,
        });

        expect(result.current).toBe(value);
      });
    });

    describe('when editor with children is defined', () => {
      it('should be editor.children', async () => {
        const editor = createPlateEditor();
        editor.children = [{ children: [{ text: 'value' }], type: 'p' }];

        const wrapper = ({ children }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().value(), {
          wrapper,
        });

        expect(result.current).toBe(editor.children);
      });
    });

    describe('when editor without children is defined', () => {
      it('should be default', async () => {
        const editor = createPlateEditor();

        const wrapper = ({ children }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().value(), {
          wrapper,
        });

        expect(result.current).toEqual(editor.childrenFactory());
      });
    });
  });

  describe('usePlateSelectors().editor().plugins', () => {
    describe('when plugins is updated', () => {
      it('should be updated', () => {
        const editor = createPlateEditor({
          plugins: [createPlugin({ key: 'test' })],
        });

        const wrapper = ({ children, editor }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { rerender, result } = renderHook(
          () => usePlateSelectors().editor().plugins,
          {
            initialProps: {
              editor,
            },
            wrapper,
          }
        );

        expect(result.current.at(-1)!.key).toBe('test');

        editor.plugins = [createPlugin({ key: 'test2' })];

        rerender({
          editor,
        });

        expect(result.current.at(-1)!.key).toBe('test2');
      });
    });

    it('should use plugins from editor', () => {
      const _plugins = [createPlugin({ key: 'test' })];
      const editor = createPlateEditor({ plugins: _plugins });

      const wrapper = ({ children }: any) => (
        <Plate editor={editor}>{children}</Plate>
      );

      const { result } = renderHook(
        () => usePlateSelectors().editor().plugins,
        {
          wrapper,
        }
      );

      expect(result.current.some((p: any) => p.key === 'test')).toBe(true);
    });
  });

  describe('when id updates', () => {
    it('should remount Plate', () => {
      const _plugins1 = [createPlugin({ key: 'test1' })];
      const _plugins2 = [createPlugin({ key: 'test2' })];
      const editor1 = createPlateEditor({ id: '1', plugins: _plugins1 });
      const editor2 = createPlateEditor({ id: '2', plugins: _plugins2 });

      const wrapper = ({ children, editor }: any) => (
        <Plate editor={editor}>{children}</Plate>
      );
      const { rerender, result } = renderHook(
        ({ editor }) => usePlateSelectors(editor.id).editor().plugins,
        {
          initialProps: { editor: editor1 },
          wrapper,
        }
      );

      expect(result.current.at(-1)!.key).toBe('test1');

      rerender({ editor: editor2 });

      expect(result.current.at(-1)!.key).toBe('test2');
    });
  });

  describe('usePlateSelectors().editor().id', () => {
    describe('when Plate has an id', () => {
      it('should be editor id', async () => {
        const editor = createPlateEditor({ id: 'test' });

        const wrapper = ({ children }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().editor().id, {
          wrapper,
        });

        expect(result.current).toBe('test');
      });
    });

    describe('when Plate without id > Plate with id', () => {
      it('should be the closest one', () => {
        const wrapper = ({ children }: any) => (
          <Plate editor={createPlateEditor()}>
            <Plate editor={createPlateEditor({ id: 'test' })}>{children}</Plate>
          </Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().editor().id, {
          wrapper,
        });

        expect(result.current).toBe('test');
      });
    });

    describe('when Plate with id > Plate without id > select id', () => {
      it('should be that id', () => {
        const wrapper = ({ children }: any) => (
          <Plate editor={createPlateEditor({ id: 'test' })}>
            <Plate editor={createPlateEditor()}>{children}</Plate>
          </Plate>
        );
        const { result } = renderHook(
          () => usePlateSelectors('test').editor().id,
          {
            wrapper,
          }
        );

        expect(result.current).toBe('test');
      });
    });

    describe('when Plate has an editor', () => {
      it('should be editor id', async () => {
        const editor = createPlateEditor({ id: 'test' });

        const wrapper = ({ children }: any) => (
          <Plate editor={editor}>{children}</Plate>
        );
        const { result } = renderHook(() => usePlateSelectors().editor().id, {
          wrapper,
        });

        expect(result.current).toBe('test');
      });
    });
  });

  describe('usePlateEditorStore', () => {
    const getStore = (wrapper: any) =>
      renderHook(() => usePlateEditorStore(), { wrapper }).result.current;

    const getId = (wrapper: any) =>
      renderHook(() => usePlateSelectors().editor().id, { wrapper }).result
        .current;

    const getIsFallback = (wrapper: any) =>
      renderHook(() => useEditorRef().isFallback, { wrapper }).result.current;

    describe('when Plate exists', () => {
      describe('when editor is defined', () => {
        it('returns the store', async () => {
          const editor = createPlateEditor({ id: 'test' });

          const wrapper = ({ children }: any) => (
            <Plate editor={editor}>{children}</Plate>
          );
          expect(getStore(wrapper)).toBeDefined();
          expect(getId(wrapper)).toBe('test');
          expect(getIsFallback(wrapper)).toBe(false);
        });
      });

      describe('when editor is not defined', () => {
        it('returns the store', async () => {
          const editor = createPlateEditor({ id: 'test' });

          const wrapper = ({ children }: any) => (
            <Plate editor={editor}>{children}</Plate>
          );
          expect(getStore(wrapper)).toBeDefined();
          expect(getId(wrapper)).toBe('test');
          expect(getIsFallback(wrapper)).toBe(false);
        });
      });
    });

    describe('when Plate does not exist', () => {
      describe('when PlateController exists', () => {
        describe('when PlateController returns a store', () => {
          it('returns the store', () => {
            const EXPECTED_STORE = 'expected store' as any;

            const wrapper = ({ children }: any) => (
              <PlateController
                activeId="test"
                editorStores={{
                  test: EXPECTED_STORE,
                }}
              >
                {children}
              </PlateController>
            );

            expect(getStore(wrapper)).toBe(EXPECTED_STORE);
          });
        });

        describe('when PlateController returns null', () => {
          it('returns the fallback store', () => {
            const wrapper = ({ children }: any) => (
              <PlateController
                activeId="test"
                editorStores={{
                  test: null,
                }}
              >
                {children}
              </PlateController>
            );

            expect(getStore(wrapper)).toBeDefined();
            expect(getIsFallback(wrapper)).toBe(true);
          });
        });
      });

      describe('when PlateController does not exist', () => {
        it('throws an error', () => {
          const wrapper = ({ children }: any) => <>{children}</>;
          expect(() => getStore(wrapper)).toThrow();
        });
      });
    });
  });
});
