import { RJSVInputProps, TextInputAdapter } from '@ballerine/ui';
import { languages } from './languages';

export const LocalePicker = (props: RJSVInputProps) => {
  props.schema.oneOf = languages;

  return <TextInputAdapter {...(props as any)} />;
};
