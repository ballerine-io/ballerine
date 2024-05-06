import { FunctionComponent, useCallback, useMemo } from 'react';
import { MultiSelect } from '@/common/components/atoms/MultiSelect/MultiSelect';
import { useFilter } from '@/common/hooks/useFilter/useFilter';
import { titleCase } from 'string-ts';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import {
  KYCs,
  Roles,
  Sanctions,
} from '@/pages/Profiles/Individuals/components/ProfilesTable/columns';

export const ProfilesFilters: FunctionComponent = () => {
  const sanctionsOptions = useMemo(
    () =>
      Sanctions?.map(sanction => ({
        label: titleCase(sanction),
        value: sanction,
      })) ?? [],
    [],
  );
  const roleOptions = useMemo(
    () =>
      Roles?.map(role => ({
        label: titleCase(role),
        value: role,
      })) ?? [],
    [],
  );
  const kycOptions = useMemo(
    () =>
      KYCs?.map(kyc => ({
        label: titleCase(kyc),
        value: kyc,
      })) ?? [],
    [],
  );
  const filters = [
    {
      title: 'Sanctions',
      accessor: 'sanctions',
      options: sanctionsOptions,
    },
    {
      title: 'Role',
      accessor: 'role',
      options: roleOptions,
    },
    {
      title: 'KYC',
      accessor: 'kyc',
      options: kycOptions,
    },
  ] satisfies Array<{
    title: string;
    accessor: string;
    options: Array<{
      label: string;
      value: string | null;
    }>;
  }>;
  const { filter, onFilter } = useFilter();
  const onClearSelect = useCallback(
    (accessor: string) => () => {
      onFilter(accessor)([]);
    },
    [onFilter],
  );

  return (
    <div>
      <h4 className={'leading-0 min-h-[16px] pb-7 text-xs font-bold'}>Filters</h4>
      <div className={`flex gap-x-2`}>
        {filters.map(({ title, accessor, options }) => (
          <MultiSelect
            key={keyFactory(title, filter?.[accessor])}
            title={title}
            selectedValues={filter?.[accessor] ?? []}
            onSelect={onFilter(accessor)}
            onClearSelect={onClearSelect(accessor)}
            options={options}
          />
        ))}
      </div>
    </div>
  );
};
