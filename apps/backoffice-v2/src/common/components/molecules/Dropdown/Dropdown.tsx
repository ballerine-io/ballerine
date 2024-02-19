import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { isNonEmptyArray } from '@ballerine/common';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import React from 'react';
import { DropdownProps } from '@/common/components/molecules/Dropdown/interfaces';

export const Dropdown = <TItem,>({ options, trigger, props, children }: DropdownProps<TItem>) => {
  return (
    <DropdownMenu {...props?.menu}>
      <DropdownMenuTrigger {...props?.trigger}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent {...props?.content}>
        <>
          {isNonEmptyArray(options) &&
            options.map(item => children?.({ item, DropdownItem: DropdownMenuItem }))}
          {!isNonEmptyArray(options) && <DropdownMenuItem>No options</DropdownMenuItem>}
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
