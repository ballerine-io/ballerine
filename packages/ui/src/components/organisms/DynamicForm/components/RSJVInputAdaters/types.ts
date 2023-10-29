import { FieldProps } from '@rjsf/utils';

export type RJSFInputProps = FieldProps;
export type RJSFInputAdapter<TValueType = string> = React.ComponentType<FieldProps<TValueType>>;
