export interface IDetailsProps {
  id: string;
  hideSeparator?: boolean;
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
}
