import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { Select } from '@/common/components/atoms/Select/Select';
import { FunctionComponent } from 'react';
import { ISelect_Props } from '@/common/components/atoms/Select_/interfaces';

export const Select_: FunctionComponent<ISelect_Props> = ({ options }) => {
  return (
    <Select defaultValue={options?.[0]?.value}>
      <SelectTrigger
        className={
          'h-8 w-full border-[#F0F0F0] py-0 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] data-[state=closed]:font-semibold'
        }
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options?.map(({ label, value }) => {
          return (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
