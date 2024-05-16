import React, { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';

import { DropdownOption } from '@/common/components/molecules/Dropdown/types';

export interface DropdownProps<TItem> {
  options: Array<DropdownOption<TItem>>;
  trigger: ReactNode;
  props?: {
    menu?: ComponentProps<typeof DropdownMenu>;
    trigger?: ComponentProps<typeof DropdownMenuTrigger>;
    content?: ComponentProps<typeof DropdownMenuContent>;
  };
  children: ({
    item,
    DropdownItem,
  }: {
    item: DropdownOption<TItem>;
    DropdownItem: FunctionComponent<ComponentProps<typeof DropdownMenuItem>>;
  }) => React.JSX.Element;
}
