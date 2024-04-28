import React, { useEffect, useState, useRef } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/common/utils/format-date';
import { DateRange } from 'react-day-picker';
import { addMonths } from 'date-fns';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '../../atoms/Button/Button';
import { Calendar } from '../../organisms/Calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';

type DateRangePickerProps = {
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  value: { start: Date | null; end: Date | null };
};

export function DateRangePicker(
  { onChange, value }: DateRangePickerProps,
  { className }: React.HTMLAttributes<HTMLDivElement>,
) {
  const currentDate = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
    to: addMonths(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 1),
      1,
    ),
  });
  const prevDateRef = useRef<DateRange | undefined>(date);

  useEffect(() => {
    if (date !== prevDateRef.current) {
      onChange({
        start: date?.from || null,
        end: date?.to || null,
      });
      prevDateRef.current = date;
    }
  }, [date, onChange]);

  return (
    <div className={ctw('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={ctw(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from, 'LLL dd, y')} - {formatDate(date.to, 'LLL dd, y')}
                </>
              ) : (
                formatDate(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
