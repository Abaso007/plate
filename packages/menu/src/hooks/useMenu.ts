import React, { useEffect, useLayoutEffect, useRef } from 'react';

import * as Ariakit from '@ariakit/react';

import type { MenuProps, setAction } from '../types';

export const SearchableContext = React.createContext(false);

export const ActionContext = React.createContext<setAction | null>(null);

export const useMenu = ({
  children,
  combobox,
  comboboxClassName,
  comboboxListClassName,
  comboboxSubmitButton,
  dragButton,
  flip = true,
  getAnchorRect,
  icon,
  injectAboveMenu,
  label,
  loading,
  loadingPlaceholder,
  open,
  placement,
  portal,
  ref,
  searchValue,
  setAction,
  store,
  values,
  onClickOutside,
  onOpenChange,
  onRootMenuClose,
  onValueChange,
  onValuesChange,
  ...props
}: MenuProps & { ref: React.ForwardedRef<HTMLDivElement> }) => {
  const parent = Ariakit.useMenuContext();
  const searchable = searchValue != null || !!onValueChange || !!combobox;
  const ParentSetAction = React.useContext(ActionContext);

  const isRootMenu = !parent;
  const isDraggleButtonMenu = !!dragButton;
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  useOnClickOutside(menuRef, onClickOutside);

  const menuProviderProps = {
    open,
    placement: isRootMenu ? placement : 'right',
    setOpen: (v: boolean) => {
      onOpenChange?.(v);

      if (!v && !parent && !dragButton) onRootMenuClose?.();
    },
    setValues: onValuesChange,
    showTimeout: 100,
    store,
    values,
  };

  const menuButtonProps = {
    ref,
    ...props,
  };

  const menuProps = {
    flip,
    getAnchorRect,
    gutter: isRootMenu ? 0 : 4,
    portal,
    ref: isRootMenu ? menuRef : undefined,
    unmountOnHide: true,
  };

  return {
    ParentSetAction,
    isDraggleButtonMenu,
    isRootMenu,
    menuButtonProps,
    menuProps,
    menuProviderProps,
    searchable,
  };
};

/**
 * Determines the appropriate effect hook to use based on the environment. If
 * the code is running on the client-side (browser), it uses the
 * `useLayoutEffect` hook, otherwise, it uses the `useEffect` hook.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: React.RefObject<MediaQueryList>,
  options?: AddEventListenerOptions | boolean
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: AddEventListenerOptions | boolean
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: AddEventListenerOptions | boolean
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: AddEventListenerOptions | boolean
): void;

// https://usehooks-ts.com/react-hook/use-event-listener
function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void,
>(
  eventName: KH | KM | KW,
  handler: (
    event:
      | Event
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | WindowEventMap[KW]
  ) => void,
  element?: React.RefObject<T>,
  options?: AddEventListenerOptions | boolean
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

type Handler = (event: MouseEvent) => void;

/**
 * Attaches an event listener to detect clicks that occur outside a given
 * element.
 *
 * @template T - The type of HTMLElement that the ref is referring to.
 * @param {RefObject<T>} ref - A React ref object that points to the element to
 *   listen for clicks outside of.
 * @param {Handler} handler - The callback function to be executed when a click
 *   occurs outside the element.
 * @param {string} [mouseEvent='mousedown'] - The type of mouse event to listen
 *   for (e.g., 'mousedown', 'mouseup'). Default is `'mousedown'`
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler?: Handler,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void => {
  useEventListener(mouseEvent, (event) => {
    if (!handler) return;

    const el = ref?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  });
};

export * as Ariakit from '@ariakit/react';
