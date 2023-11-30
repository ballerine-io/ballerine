import { TWorkflowById } from '@/domains/workflows/fetchers';
import { AnyObject } from '@ballerine/ui';

export interface IDetailsProps {
  id: string;
  hideSeparator?: boolean;
  documents?: AnyObject[];
  contextUpdateMethod?: 'base' | 'director';
  workflow: TWorkflowById;
  selectDocuments?: (workflow: TWorkflowById) => AnyObject[];
  value: {
    id: string;
    title: string;
    subtitle: string;
    data: Array<{
      title: string;
      isEditable: boolean;
      type: string;
      format?: string;
      pattern?: string;
      value: unknown;
      dropdownOptions?: Array<{ label: string; value: string }>;
      dependantOn?: string;
      dependantValue?: string;
      minimum?: string;
      maximum?: string;
    }>;
  };
  onSubmit?: (document: AnyObject) => void;
}
