export interface INestedComponentProps {
  id?: string;
  value: {
    data: Array<{
      title: string;
      value: unknown;
      showNull?: boolean;
      showUndefined?: boolean;
    }>;
  };
  isNested?: boolean;
}

export interface INestedContainerProps {
  isNested?: boolean;
}
