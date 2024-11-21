import React, { FunctionComponent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { camelCase } from 'string-ts';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { Select_ } from '@/common/components/atoms/Select_/Select_';
import { ctw } from '@/common/utils/ctw/ctw';

export const RiskSelect: FunctionComponent<{
  label: string;
  defaultValue: 'lowRisk' | 'moderateRisk' | 'highRisk' | 'criticalRisk';
  disabled?: boolean;
}> = ({ label, defaultValue, disabled }) => {
  const { control } = useForm();

  const riskOptions = useMemo(
    () =>
      [
        {
          label: 'Low Risk',
          value: 'lowRisk',
        },
        {
          label: 'Moderate Risk',
          value: 'moderateRisk',
        },
        {
          label: 'High Risk',
          value: 'highRisk',
        },
        {
          label: 'Critical Risk',
          value: 'criticalRisk',
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
          <FormLabel
            className={ctw({
              'opacity-50': disabled,
            })}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Select_
              options={riskOptions}
              defaultValue={defaultValue}
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
