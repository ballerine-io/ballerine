import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/domains/collection-flow';
import { getCountryStates } from '@ballerine/common';
import { RJSFInputProps, TextInputAdapter } from '@ballerine/ui';
import get from 'lodash/get';
import { useMemo } from 'react';
import { injectIndexToDestinationIfNeeded } from '../../hocs/withDynamicUIInput';

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
    const countryCode = get(
      payload,
      injectIndexToDestinationIfNeeded(countryCodePath, props.inputIndex),
    ) as string | null;

    return countryCode
      ? getCountryStates(countryCode).map(state => ({ title: state.name, const: state.isoCode }))
      : [];
  }, [payload, countryCodePath, props.inputIndex]);

  const schema = useMemo(() => {
    return {
      ...baseSchema,
      oneOf: options,
    };
  }, [baseSchema, options]);

  return <TextInputAdapter {...(props as any)} schema={schema} />;
};
