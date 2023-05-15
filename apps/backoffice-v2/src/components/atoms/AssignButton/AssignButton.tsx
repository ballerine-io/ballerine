import React, {useState} from 'react';
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
  fullName: string;
  isCaseAssignedToMe?: boolean;
};

type UserItemProps = {
  assignee: Assignee;
  onAssigneeSelect: (id: number) => void;
};

const AssigneeItem: React.FC<UserItemProps> = ({assignee, onAssigneeSelect}) => (
  <DropdownMenuItem key={assignee.id} onClick={() => onAssigneeSelect(assignee.id)}>
    {assignee.fullName}
  </DropdownMenuItem>
);

type AssignButtonProps = {
  caseState: TCaseManagementState;
  buttonType: "Assign" | "Re-Assign";
  assignees: Assignee | Assignee[];
  onAssigneeSelect: (id: number) => void;
  authenticatedUser: TAuthenticatedUser;
};
const AssignButton: React.FC<AssignButtonProps> = ({
                                                     buttonType,
                                                     assignees,
                                                     onAssigneeSelect,
                                                     caseState
                                                   }) => {

  const isAssignButtonType = buttonType === "Assign";

  return (
    <div>
      {
        isAssignButtonType ?
          (<button
            className={ctw(`btn-sm btn ${isAssignButtonType ? 'bg-black' : 'bg-white'}`)}
            disabled={!caseState.assignToMeEnabled}
            onClick={(_event) => isAssignButtonType ? onAssigneeSelect((assignees as Assignee).id) : undefined}
          >
            {buttonType}
          </button>) :
          (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={ctw(`btn-sm btn ${isAssignButtonType ? 'bg-black' : 'bg-white'}`)}
              disabled={!caseState.assignToOther}
            >
              {buttonType}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`min-w-[16rem]`}>
            {Array.isArray(assignees)
              ? assignees.map(assignee => (
                <AssigneeItem
                  key={assignee.id}
                  assignee={assignee}
                  onAssigneeSelect={(id) => onAssigneeSelect(id)}
                />
              )) : null
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AssignButton;
