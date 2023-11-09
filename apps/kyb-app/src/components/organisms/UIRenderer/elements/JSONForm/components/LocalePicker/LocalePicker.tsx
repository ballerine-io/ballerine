import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import { languages } from './languages';

export const LocalePicker = (props: RJSFInputProps) => {
  props.schema.oneOf = languages;

  return <TextInputAdapter {...(props as any)} />;
};
