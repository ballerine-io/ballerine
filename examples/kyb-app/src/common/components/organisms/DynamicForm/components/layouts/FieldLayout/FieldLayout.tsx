import { Label } from '@ballerine/ui';
import { FieldTemplateProps } from '@rjsf/utils';

export const FieldLayout = ({ id, label, children }: FieldTemplateProps) => {
  return (
    <div className="flex flex-col gap-2 pb-2 pt-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};
