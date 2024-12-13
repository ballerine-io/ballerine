import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { relationshipOptions } from '@/pages/CollectionFlowV2/components/ui/fields/RelationshipField/relationship-options';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import get from 'lodash/get';
import { FunctionComponent, useMemo } from 'react';

export interface IRelationshipFieldOptions {
  placeholder?: string;
  companyNameDestination?: string;
  companyName?: string;
}

const COMPANY_NAME_PLACEHOLDER = '{company_name}';

export const RelationshipField: FunctionComponent<
  IFieldComponentProps<string, IRelationshipFieldOptions>
> = ({ fieldProps, definition, options: _options, stack }) => {
  const { value, onChange, onBlur } = fieldProps;
  const {
    placeholder = '',
    companyNameDestination = '',
    companyName: _companyName = 'N/A',
  } = _options || {};

  const { payload } = useStateManagerContext();
  const dropdownOptions = useMemo(() => {
    const companyName = get(payload, companyNameDestination, _companyName);

    return relationshipOptions.map(option => ({
      label: option.label.replace(COMPANY_NAME_PLACEHOLDER, companyName),
      value: option.value.replace(COMPANY_NAME_PLACEHOLDER, companyName),
    }));
  }, [payload, companyNameDestination, _companyName]);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name={createTestId(definition, stack)}
        searchable
        options={dropdownOptions}
        placeholdersParams={{ placeholder }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
