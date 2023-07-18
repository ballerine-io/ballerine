/// <reference types="react" />
declare const _default: {
  component: import('react').ForwardRefExoticComponent<
    Omit<
      import('@radix-ui/react-label').LabelProps & import('react').RefAttributes<HTMLLabelElement>,
      'ref'
    > &
      import('class-variance-authority').VariantProps<
        (props?: import('class-variance-authority/dist/types').ClassProp) => string
      > &
      import('react').RefAttributes<HTMLLabelElement>
  >;
};
export default _default;
export declare const Default: {
  render: () => JSX.Element;
};
