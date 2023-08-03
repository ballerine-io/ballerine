export interface INestedComponentProps {
  id?: string;
  value: {
    data: Array<{
      title: string;
      value: unknown;
    }>;
  };
  isNested?: boolean;
}
