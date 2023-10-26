import { FieldProps } from '@rjsf/utils';

export type RJSVInputProps = FieldProps;
export type RJSVInputAdapter<TValueType = string> = React.ComponentType<FieldProps<TValueType>>;
