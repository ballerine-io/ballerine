import { TagsInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
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
        testId={createTestId(element, stack)}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
      />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
