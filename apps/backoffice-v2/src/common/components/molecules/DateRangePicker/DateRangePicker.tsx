import React, { ComponentProps } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate, Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '../../atoms/Button/Button';
import { Calendar } from '../../organisms/Calendar/Calendar';

type TDateRangePickerProps = {
  onChange: NonNullable<ComponentProps<typeof Calendar>['onSelect']>;
  value: NonNullable<ComponentProps<typeof Calendar>['selected']>;
  placeholder?: string;
  className?: ComponentProps<'div'>['className'];
};

export const DateRangePicker = ({
  onChange,
  value,
  placeholder,
  className,
}: TDateRangePickerProps) => {
  return (
    <div className={ctw('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={ctw('h-8 w-[250px] justify-start text-left font-normal', {
              'text-muted-foreground': !value,
            })}
          >
            <CalendarIcon className="mr-2 d-4" />
            {value?.from && value?.to && (
              <>
                {formatDate(value.from, 'LLL dd, y')} - {formatDate(value.to, 'LLL dd, y')}
              </>
            )}
            {value?.from && !value?.to && formatDate(value.from, 'LLL dd, y')}
            {!value?.from && !value?.to && <span>{placeholder ?? 'Pick a date'}</span>}
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
