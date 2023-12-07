import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { relationshipOptions } from '@/components/organisms/UIRenderer/elements/JSONForm/components/RelationshipDropdown/relationship-options';
import { UIElement } from '@/domains/collection-flow';
import { AutocompleteTextInputAdapter, RJSFInputProps } from '@ballerine/ui';
import { useMemo } from 'react';
import get from 'lodash/get';
import { UISchema } from '@/components/organisms/UIRenderer/types/ui-schema.types';

export interface RelationshipDropdownParams {
  companyNameDestination: string;
}

const COMPANY_NAME_PLACEHOLDER = '{company_name}';

export const RelationshipDropdown = (
  props: RJSFInputProps<string> & { definition: UIElement<RelationshipDropdownParams> } & {
    inputIndex: number | null;
  },
) => {
  //@ts-ignore
  const { definition, ...restProps } = props;
  const { payload } = useStateManagerContext();
  const options = useMemo(() => {
    const companyName = get(payload, definition?.options?.companyNameDestination);

    return relationshipOptions.map(option => ({
      title: option.title.replace(COMPANY_NAME_PLACEHOLDER, companyName),
      const: option.const.replace(COMPANY_NAME_PLACEHOLDER, companyName),
    }));
  }, [payload, definition]);

  //@ts-ignore
  const uiSchema = useMemo(() => {
    const uiSchemaCopy = structuredClone(props.uiSchema || {});

    uiSchemaCopy.options = options;

    return uiSchemaCopy as UISchema;
  }, [props.uiSchema, options]);

  return <AutocompleteTextInputAdapter {...restProps} uiSchema={uiSchema} />;
};
