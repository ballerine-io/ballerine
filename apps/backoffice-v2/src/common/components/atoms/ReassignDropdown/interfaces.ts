import { TAssignee } from './types';

export interface IReassignDropdownProps {
  assignees: Array<TAssignee>;
  isDisabled: boolean;
  isUnassignDisabled: boolean;
  onAssign: (id: string) => () => void;
  onUnassign: () => void;
}
