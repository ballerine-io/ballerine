import React, { FunctionComponent } from 'react';
import { DropdownMenuItem } from '../../molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '../../molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenu } from '../../molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '../../molecules/DropdownMenu/DropdownMenu.Content';
import { Button } from '../Button/Button';
import { IReassignDropdownProps } from './interfaces';

export const ReassignDropdown: FunctionComponent<IReassignDropdownProps> = ({
  assignees,
  isDisabled,
  isUnassignDisabled,
  onAssign,
  onUnassign,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={`outline`} disabled={isDisabled}>
          Re-assign
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`min-w-[16rem]`} align={'start'}>
        <DropdownMenuItem
          className={`text-cyan-950 border-b-2`}
          onClick={onUnassign}
          disabled={isUnassignDisabled}
        >
          Un-assign
        </DropdownMenuItem>
        {Array.isArray(assignees) &&
          !!assignees.length &&
          assignees?.map(({ id, fullName }) => (
            <DropdownMenuItem key={id} onClick={onAssign(id)}>
              {fullName}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
