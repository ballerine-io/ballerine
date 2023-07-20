export interface INestedComponentProps {
  id?: string;
  value: {
    data: Array<{
      title: string;
      value: unknown;
      showNull?: boolean;
      showUndefined?: boolean;
      /**
       * If true wraps valid URL strings with the `a` html tag.
       */
      anchorUrls?: boolean;
    }>;
  };
  isNested?: boolean;
}

export interface INestedContainerProps {
  isNested?: boolean;
}
