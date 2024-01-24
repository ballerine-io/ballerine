import { FieldLayout as DefaultFieldLayout } from '@ballerine/ui';
import { FieldTemplateProps } from '@rjsf/utils';

export const FieldLayout = (props: FieldTemplateProps) => {
  if (props.uiSchema?.hidden) return null;

  return <DefaultFieldLayout {...props} />;
};
