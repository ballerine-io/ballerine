import { PhoneNumberInput } from '@/components/atoms';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TDynamicFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IPhoneFieldParams {
  defaultCountry?: string;
}

export const PhoneField: TDynamicFormElement<string, IPhoneFieldParams> = ({ element }) => {
  const { defaultCountry = 'us' } = element.params || {};
  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus } = useField<string | undefined>(element, stack);

  return (
    <FieldLayout element={element}>
      <PhoneNumberInput
        country={defaultCountry}
        testId={createTestId(element, stack)}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
