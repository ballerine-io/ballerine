import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/domains/collection-flow';
import { getCountryStates } from '@/helpers/get-countries-list';
import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import { useMemo } from 'react';
import get from 'lodash/get';

export interface StatePickerParams {
  countryCodePath: string;
}

export const StatePicker = (
  props: RJSFInputProps & { definition: UIElement<StatePickerParams> },
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
