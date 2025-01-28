import { useCallback, useMemo, useState } from 'react';
import { getFieldDefinitionsFromSchema } from '../../../helpers/get-field-definitions-from-schema';
import { IFormElement } from '../../../types';
import { generateTouchedMapForAllElements } from './helpers/generate-touched-map-for-all-elements/generate-touched-map-for-all-elements';
import { ITouchedState } from './types';

export const useTouched = (_elements: Array<IFormElement<any, any>>, context: object) => {
  const elements = useMemo(() => getFieldDefinitionsFromSchema(_elements), [_elements]);

  const [touched, setTouchedState] = useState<ITouchedState>({});

  const setFieldTouched = useCallback((fieldName: string, isTouched: boolean) => {
    setTouchedState(prev => ({ ...prev, [fieldName]: isTouched }));
  }, []);

  const setTouched = useCallback((newTouched: ITouchedState) => {
    setTouchedState(newTouched);
  }, []);

  const touchAllFields = useCallback(() => {
    setTouchedState(generateTouchedMapForAllElements(elements, context));
  }, [elements, context]);

  return { touched, setTouched, setFieldTouched, touchAllFields };
};
