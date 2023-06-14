import { TDropdownOption } from './types';

export interface IEditableDetails {
  data: Array<{
    title: string;
    value: unknown;
    isEditable: boolean;
    type: string;
    format?: string;
    pattern?: string;
    dropdownOptions?: Array<TDropdownOption>;
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
