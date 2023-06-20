import { IDropdownOption } from './types';

export interface IEditableDetails {
  data: Array<{
    title: string;
    value: unknown;
    isEditable: boolean;
    type: string;
    format?: string;
    pattern?: string;
    dropdownOptions?: Array<IDropdownOption> | Record<string, Array<IDropdownOption>>;
  }>;
  valueId: string;
  id: string;
  documents: Array<{
    id: string;
    properties: Record<string, string>;
  }>;
  title: string;
  workflowId: string;
}
