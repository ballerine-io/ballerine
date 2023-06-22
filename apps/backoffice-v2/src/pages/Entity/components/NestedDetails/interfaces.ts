export interface INestedDetailsProps {
  id?: string;
  value: {
    data: Array<{
      title: string;
      value: unknown;
    }>;
  };
}
