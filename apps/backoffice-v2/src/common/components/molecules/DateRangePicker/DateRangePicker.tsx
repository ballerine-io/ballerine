import React, { ComponentProps } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '../../../../../../../packages/ui/src/common/utils/format-date';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '../../atoms/Button/Button';
import { Calendar } from '../../organisms/Calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';

type TDateRangePickerProps = {
  onChange: NonNullable<ComponentProps<typeof Calendar>['onSelect']>;
  value: NonNullable<ComponentProps<typeof Calendar>['selected']>;
  className?: ComponentProps<'div'>['className'];
};

export const DateRangePicker = ({ onChange, value, className }: TDateRangePickerProps) => {
  return (
    <div className={ctw('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={ctw('w-[300px] justify-start text-left font-normal', {
              'text-muted-foreground': !value,
            })}
          >
            <CalendarIcon className="size-4 mr-2" />
            {value?.from && value?.to && (
              <>
                {formatDate(value.from, 'LLL dd, y')} - {formatDate(value.to, 'LLL dd, y')}
              </>
            )}
            {value?.from && !value?.to && formatDate(value.from, 'LLL dd, y')}
            {!value?.from && !value?.to && <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
