import React from 'react';
import { CaseState, TCaseState } from '../../../enums';
import { DropdownMenuItem } from '../../molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '../../molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenu } from '../../molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '../../molecules/DropdownMenu/DropdownMenu.Content';
import { Button } from '../Button/Button';
import { TAuthenticatedUser } from '../../../../domains/auth/types';

export type Assignee = {
  id: string;
  fullName: string;
};

interface IUserItemProps {
  assignee: Assignee;
  onAssigneeSelect: (id: string) => void;
}

const AssigneeItem: React.FC<IUserItemProps> = ({ assignee, onAssigneeSelect }) => (
  <DropdownMenuItem key={assignee?.id} onClick={() => onAssigneeSelect(assignee?.id)}>
    {assignee?.fullName}
  </DropdownMenuItem>
);

interface IAssignButtonProps {
  caseState: TCaseState;
  buttonType: 'Assign' | 'Re-Assign';
  assignees: Assignee[];
  onAssigneeSelect: (id: string) => void;
  authenticatedUser: TAuthenticatedUser;
}
export const AssignButton: React.FC<IAssignButtonProps> = ({
  buttonType,
  assignees,
  onAssigneeSelect,
  caseState,
}) => {
  const isAssignButtonType = buttonType === 'Assign';
  const isUnassignEnabled = caseState !== CaseState.UNASSIGNED;
  const onClick = () => (isAssignButtonType ? onAssigneeSelect(assignees?.[0]?.id) : undefined);

  return (
    <div>
      {isAssignButtonType ? (
        <Button disabled={!caseState.assignToMeEnabled} onClick={onClick}>
          Assign Me
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={`outline`} disabled={!caseState.assignToOtherEnabled}>
              {buttonType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`min-w-[16rem]`} align={'start'}>
            {isUnassignEnabled ? (
              <DropdownMenuItem
                className={`text-cyan-950 border-b-2`}
                onClick={() => onAssigneeSelect(null)}
              >
                Unassign
              </DropdownMenuItem>
            ) : null}
            {Array.isArray(assignees)
              ? assignees.map(assignee => (
                  <AssigneeItem
                    key={assignee?.id}
                    assignee={assignee}
                    onAssigneeSelect={id => onAssigneeSelect(id)}
                  />
                ))
              : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
