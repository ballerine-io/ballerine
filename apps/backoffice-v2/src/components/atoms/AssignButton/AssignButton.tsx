import React, { useState } from 'react';
import { TAuthenticatedUser, TCaseManagementState } from '../../../api/types';
import { CaseState } from '../../../enums';
import { ctw } from '../../../utils/ctw/ctw';
import styles from './AssignButton.module.css';
import { DropdownMenuItem } from 'components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from 'components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenu } from 'components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from 'components/molecules/DropdownMenu/DropdownMenu.Content';

export type Assignee = {
  id: string;
  fullName: string;
};

interface IUserItemProps {
  assignee: Assignee;
  onAssigneeSelect: (id: string) => void;
};

const AssigneeItem: React.FC<IUserItemProps> = ({ assignee, onAssigneeSelect }) => (
  <DropdownMenuItem key={assignee.id} onClick={() => onAssigneeSelect(assignee.id)}>
    {assignee.fullName}
  </DropdownMenuItem>
);

interface IAssignButtonProps{
  caseState: TCaseManagementState;
  buttonType: 'Assign' | 'Re-Assign';
  assignees: Assignee[];
  onAssigneeSelect: (id: string) => void;
  authenticatedUser: TAuthenticatedUser;
};
const AssignButton: React.FC<IAssignButtonProps> = ({
  buttonType,
  assignees,
  onAssigneeSelect,
  caseState,
}) => {
  const isAssignButtonType = buttonType === 'Assign';
  const unassignEnabled = caseState !== CaseState.UNASSIGNED
  const buttonColorClass = isAssignButtonType ? 'bg-black' : 'bg-white border-gray-200';

  return (
    <div>
      {isAssignButtonType ? (
        <button
          className={ctw(`btn-sm btn ${buttonColorClass}`)}
          disabled={!caseState.assignToMeEnabled}
          onClick={_event =>
            isAssignButtonType ? onAssigneeSelect((assignees[0]).id) : undefined
          }
        >
          Assign Me
        </button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={ctw(`btn-sm btn ${buttonColorClass}`)}
              disabled={!caseState.assignToOtherEnabled}
            >
              {buttonType}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`min-w-[16rem]`} align={'start'}>
            { unassignEnabled ?
              <DropdownMenuItem className={`text-cyan-950 border-b-2`} key={'unassigne'} onClick={() => onAssigneeSelect(null)}>
              Unassign
            </DropdownMenuItem>
              : null
            }
            {Array.isArray(assignees)
              ? assignees
                .map(assignee => (
                  <AssigneeItem
                    key={assignee.id}
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

export default AssignButton;
