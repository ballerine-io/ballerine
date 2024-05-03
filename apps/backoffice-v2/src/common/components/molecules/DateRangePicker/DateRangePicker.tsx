import React, { useState, ComponentProps } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/common/utils/format-date';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '../../atoms/Button/Button';
import { Calendar } from '../../organisms/Calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';

type TDateRangePickerProps = {
  onChange: ComponentProps<typeof Calendar>['onSelect'];
  value: ComponentProps<typeof Calendar>['value'];
  className: ComponentProps<'div'>['className'];
};

export function DateRangePicker({ onChange, value, className }: TDateRangePickerProps) {
  const currentDate = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
    to: dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 1))
      .add(1, 'month')
      .toDate(),
  });

  const handleDateChange = (selection: DateRange | undefined) => {
    setDate(selection);
    onChange(selection);
  };

  return (
    <div className={ctw('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={ctw('w-[300px] justify-start text-left font-normal', {
              'text-muted-foreground': !date,
            })}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from && date?.to && (
              <>
                {formatDate(date.from, 'LLL dd, y')} - {formatDate(date.to, 'LLL dd, y')}
              </>
            )}
            {date?.from && !date?.to && formatDate(date.from, 'LLL dd, y')}
            {!date?.from && !date?.to && <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
