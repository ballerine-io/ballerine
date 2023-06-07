export interface IEditableDetails {
  data: Array<{
    title: string;
    value: unknown;
    isEditable: boolean;
    type: string;
    format?: string;
    pattern?: string;
    pickerOptions?: Array<{label: string, value: string}>;
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
