import React, { useState } from 'react';
import {TAuthenticatedUser, TCaseManagementState} from "../../../api/types";
import {CaseState} from "../../../enums";
import {ctw} from "../../../utils/ctw/ctw";
import styles from './AssignButton.module.css';
import {DropdownMenuItem} from "components/molecules/DropdownMenu/DropdownMenu.Item";
import {DropdownMenuTrigger} from "components/molecules/DropdownMenu/DropdownMenu.Trigger";
import {DropdownMenu} from "components/molecules/DropdownMenu/DropdownMenu";
import {DropdownMenuContent} from "components/molecules/DropdownMenu/DropdownMenu.Content";


type Assignee = {
  id: number;
  name: string;
  isCaseAssignedToMe?: boolean;
};

type UserItemProps = {
  assignee: Assignee;
  onAssigneeSelect: (id: number) => void;
};

const AssigneeItem: React.FC<UserItemProps> = ({ assignee, onAssigneeSelect }) => (
  <DropdownMenuItem key={assignee.id} onClick={() => onAssigneeSelect(assignee.id)}>
    {assignee.name}
  </DropdownMenuItem>
);

type AssignButtonProps = {
  caseState: TCaseManagementState;
  assignees: Assignee[];
  onAssigneeSelect: (id: number) => void;
  authenticatedUser: TAuthenticatedUser;
};
const AssignButton: React.FC<AssignButtonProps> = ({assignees, onAssigneeSelect, caseState  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAssignedToMe = caseState == CaseState.ASSIGNED_TO_ME
  const assignText = caseState === CaseState.UNASSIGNED ? "Assign" : "Re-Assign"
  const isAssignEnabled = caseState.assignToMeEnabled || caseState.assignToOther
  const toggleList = () => {
    if (isAssignEnabled) setIsOpen(!isOpen);
  };
  const handleAssigneeSelected = (id: number) => {
    setIsOpen(false);
    onAssigneeSelect(id);
  };

  return (
    <div>
      {(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={ctw(`btn-sm btn`)}
              disabled={!isAssignEnabled}>
              {assignText}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`min-w-[16rem]`}>
            {assignees.map(assignee => (
              <AssigneeItem
                key={`assignItem${assignee.id}`}
                assignee={assignee}
                onAssigneeSelect={handleAssigneeSelected}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AssignButton;
