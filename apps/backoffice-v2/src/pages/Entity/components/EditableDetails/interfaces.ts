import { AnyObject } from '@ballerine/ui';
import { TDropdownOption } from './types';

export type IEditableDetailsDocument = {
  propertiesSchema: Record<string, unknown>;
  id: string;
  properties: Record<string, string>;
};

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
  documents: Array<IEditableDetailsDocument>;
  title: string;
  workflowId: string;
  contextUpdateMethod?: 'base' | 'director';
  onSubmit?: (document: AnyObject) => void;
  config: Record<string, unknown>;
}
