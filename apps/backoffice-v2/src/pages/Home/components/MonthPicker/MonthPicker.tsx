import { Button, ctw, Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';
import dayjs from 'dayjs';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const today = dayjs();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type MonthPickerProps = {
  date: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
};

export const MonthPicker = ({ date, setDate, minDate }: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(today.year());

  const dayjsDate = dayjs(date);
  const dayjsMinDate = minDate ? dayjs(minDate) : undefined;

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = dayjs(date).year(currentYear).month(monthIndex);

    if (newDate.isSame(today, 'month') || newDate.isBefore(today, 'month')) {
      setDate(newDate.toDate());
      setOpen(false);
    }
  };

  const handleYearChange = (increment: number) => {
    setCurrentYear(prevYear => prevYear + increment);
  };

  const isSameMonth = (date1: dayjs.Dayjs, date2: dayjs.Dayjs) => {
    return date1.isSame(date2, 'month');
  };

  const isMonthDisabled = (monthIndex: number) => {
    const monthDate = dayjs().year(currentYear).month(monthIndex).startOf('month');

    return monthDate.isAfter(today, 'month');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={ctw(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <span>{dayjsDate.format('MMMM YYYY')}</span>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleYearChange(-1)}
            disabled={dayjsMinDate && currentYear <= dayjsMinDate.year()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentYear}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleYearChange(1)}
            disabled={currentYear >= today.year()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {months.map((month, index) => (
            <Button
              key={month}
              onClick={() => handleMonthSelect(index)}
              disabled={
                isMonthDisabled(index) ||
                (dayjsMinDate &&
                  currentYear === dayjsMinDate.year() &&
                  index < dayjsMinDate.month())
              }
              variant="ghost"
              className={ctw(
                'h-9 w-full',
                isSameMonth(dayjsDate, dayjs().year(currentYear).month(index)) &&
                  'bg-primary text-primary-foreground',
              )}
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
