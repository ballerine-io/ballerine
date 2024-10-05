import { UIElementV2 } from '@/components/providers/Validator/types';

export interface IFieldComponentProps<TValueType, TOptions = {}> {
  options: TOptions;
  definition: UIElementV2;
  stack?: number[];
  children?: React.ReactNode | React.ReactNode[];
  fieldProps: {
    onChange: (value: TValueType) => void;
    onBlur: () => void;
    isTouched?: boolean;
    value: TValueType;
    disabled?: boolean;
  };
}
