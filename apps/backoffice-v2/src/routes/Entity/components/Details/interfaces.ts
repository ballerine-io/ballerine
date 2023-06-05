export interface IDetailsProps {
  id: string;
  value: {
    id: string;
    title: string;
    data: Array<{
      title: string;
      isEditable: boolean;
      type: string;
      format?: string;
      pattern?: string;
      value: unknown;
    }>;
  };
}
