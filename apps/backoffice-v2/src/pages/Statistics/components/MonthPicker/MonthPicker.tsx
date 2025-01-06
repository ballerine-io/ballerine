import { Button, ctw, Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';
import { format, isAfter, isBefore, setMonth, setYear, startOfMonth } from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const today = new Date();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type MonthPickerProps = {
  date: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
};

export const MonthPicker = ({ date, setDate, minDate }: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(date, currentYear), monthIndex);

    if (isBefore(newDate, today) || isSameMonth(newDate, today)) {
      setDate(newDate);
      setOpen(false);
    }
  };

  const handleYearChange = (increment: number) => {
    setCurrentYear(prevYear => prevYear + increment);
  };

  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  };

  const isMonthDisabled = (monthIndex: number) => {
    const monthDate = startOfMonth(setMonth(setYear(today, currentYear), monthIndex));

    return isAfter(monthDate, today);
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
          <span>{format(date, 'MMMM yyyy')}</span>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleYearChange(-1)}
            disabled={minDate && currentYear <= minDate.getFullYear()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentYear}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleYearChange(1)}
            disabled={currentYear >= today.getFullYear()}
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
                (minDate && currentYear === minDate.getFullYear() && index < minDate.getMonth())
              }
              variant="ghost"
              className={ctw(
                'h-9 w-full',
                isSameMonth(date, setMonth(setYear(new Date(), currentYear), index)) &&
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
