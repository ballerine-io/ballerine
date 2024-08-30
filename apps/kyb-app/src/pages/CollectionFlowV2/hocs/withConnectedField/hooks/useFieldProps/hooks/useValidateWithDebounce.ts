import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { useRefValue } from '@/hooks/useRefValue';
import debounce from 'lodash/debounce';
import { useMemo } from 'react';

export const useValidateWithDebounce = (delay: number) => {
  const { validate: _validate } = useValidator();
  const validateRef = useRefValue(_validate);

  const validate = useMemo(() => debounce(() => validateRef.current(), delay), [validateRef]);

  return validate;
};
