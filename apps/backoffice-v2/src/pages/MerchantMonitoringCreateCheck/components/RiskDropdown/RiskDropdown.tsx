import React, { FunctionComponent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { camelCase } from 'string-ts';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { Dropdown } from '@/common/components/molecules/Dropdown/Dropdown';
import { ChevronDown } from 'lucide-react';

export const RiskDropdown: FunctionComponent<{
  label: string;
  disabled?: boolean;
}> = ({ label, disabled }) => {
  const { control } = useForm();

  const riskOptions = useMemo(
    () =>
      [
        {
          id: 'lowRisk',
          value: 'Low Risk',
        },
        {
          id: 'ModerateRisk',
          value: 'Moderate Risk',
        },
        {
          id: 'highRisk',
          value: 'High Risk',
        },
        {
          id: 'criticalRisk',
          value: 'Critical Risk',
        },
      ] as const,
    [],
  );

  return (
    <FormField
      control={control}
      name={camelCase(label)}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Dropdown
              options={riskOptions}
              trigger={
                <>
                  Select risk...
                  <ChevronDown size={18} className={`text-slate-400`} />
                </>
              }
              props={{
                trigger: {
                  className:
                    'flex w-full items-center justify-between gap-x-4 rounded-lg border border-neutral/10 px-4 py-1.5 text-sm disabled:opacity-50 dark:border-neutral/60',
                  disabled,
                },
                content: {
                  className: 'w-full',
                  align: 'start',
                },
              }}
              {...field}
            >
              {({ item, DropdownItem }) => <DropdownItem key={item.id}>{item.value}</DropdownItem>}
            </Dropdown>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
