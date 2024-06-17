import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { Switch } from '@/common/components/atoms/Switch';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';

export const SwitchesList: FunctionComponent<{
  label: string;
  options: Array<{ name: string; label: string; disabled?: boolean; defaultChecked: boolean }>;
}> = ({ label, options }) => {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className={`mb-8 font-bold`}>{label}</h3>
      <ul className={`space-y-10`}>
        {options.map(option => (
          <li key={option.name}>
            <FormField
              control={control}
              name={option.name}
              render={({ field }) => (
                <FormItem className={`flex max-w-md items-center space-x-4`}>
                  <FormControl>
                    <Switch
                      className={`data-[state=checked]:bg-blue-500`}
                      {...field}
                      disabled={option.disabled}
                      // checked={field.value}
                      defaultChecked={option.defaultChecked}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className={`!mt-0 text-slate-500`}>{option.label}</FormLabel>
                </FormItem>
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
