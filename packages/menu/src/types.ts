import type React from 'react';

import type * as Ariakit from '@ariakit/react';

export interface Action {
  group?: string;
  groupName?: string;
  icon?: React.ReactNode;
  items?: Action[];
  keywords?: string[];
  label?: string;
  shortcut?: string;
  value?: string;
}

export type actionGroup = {
  group?: string;
  value?: string;
};

export type setAction = (actionGroup: actionGroup) => void;

export interface MenuProps extends Ariakit.MenuButtonProps<'div'> {
  combobox?: Ariakit.ComboboxProps['render'];
  comboboxClassName?: string;
  comboboxListClassName?: string;
  comboboxSubmitButton?: React.ReactElement;
  dragButton?: Ariakit.MenuButtonProps['render'];
  flip?: boolean;
  getAnchorRect?: (anchor: HTMLElement | null) => AnchorRect | null;
  icon?: React.ReactNode;
  injectAboveMenu?: React.ReactElement;
  label?: React.ReactNode;
  loading?: boolean;
  loadingPlaceholder?: React.ReactNode;
  onClickOutside?: (event: MouseEvent) => void;
  onOpenChange?: (open: boolean) => void;
  onRootMenuClose?: () => void;
  onValueChange?: (value: string) => void;
  onValuesChange?: Ariakit.MenuProviderProps['setValues'];
  open?: boolean;
  placement?: Ariakit.MenuProviderProps['placement'];
  portal?: Ariakit.MenuProps['portal'];
  searchValue?: string;
  setAction?: setAction;
  values?: Ariakit.MenuProviderProps['values'];
}

export interface AnchorRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}
