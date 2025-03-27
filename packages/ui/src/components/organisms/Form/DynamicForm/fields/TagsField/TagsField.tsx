import { TagsInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { ICommonFieldParams, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export type ITagsFieldParams = ICommonFieldParams;

export const TagsField: TDynamicFormField<ITagsFieldParams> = ({ element }) => {
  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<string[] | undefined>(
    element,
    stack,
  );

  return (
    <FieldLayout element={element}>
      <TagsInput
        value={value}
        placeholder={element.params?.placeholder}
        testId={createTestId(element, stack)}
        onChange={tags => onChange(tags.length ? tags : undefined)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
      />
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
