import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElementDefinition } from '@/domains/collection-flow';
import { getCountryStates } from '@/helpers/countries-data';
import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import get from 'lodash/get';
import { useMemo } from 'react';

export interface StatePickerParams {
  countryCodePath: string;
}

export const StatePicker = (
  props: RJSFInputProps & { definition: UIElementDefinition<StatePickerParams> },
) => {
  const { schema: baseSchema, definition } = props;

  const { countryCodePath } = definition.options;

  const { payload } = useStateManagerContext();
  const options = useMemo(() => {
    const countryCode = get(payload, countryCodePath) as string | null;

    return countryCode
      ? getCountryStates(countryCode).map(state => ({ title: state.name, const: state.isoCode }))
      : [];
  }, [payload, countryCodePath]);

  const schema = useMemo(() => {
    return {
      ...baseSchema,
      oneOf: options,
    };
  }, [baseSchema, options]);

  return <TextInputAdapter {...(props as any)} schema={schema} />;
};
