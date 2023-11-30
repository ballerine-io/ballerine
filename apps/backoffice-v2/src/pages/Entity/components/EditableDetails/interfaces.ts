import { TDropdownOption } from './types';

export interface IEditableDetails {
  data: Array<{
    title: string;
    value: unknown;
    valueAlias?: unknown;
    isEditable: boolean;
    type: string;
    format?: string;
    pattern?: string;
    maximum?: string;
    minimum?: string;
    dropdownOptions?: Array<TDropdownOption>;
  }>;
  valueId: string;
  id: string;
  documents: Array<{
    propertiesSchema: Record<string, unknown>;
    id: string;
    properties: Record<string, string>;
  }>;
  title: string;
  workflowId: string;
  config: Record<string, unknown>;
}
