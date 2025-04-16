import { formatDate, Popover, PopoverContent, PopoverTrigger } from '@ballerine/ui';
import { CalendarIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { ComponentProps, useMemo } from 'react';

import { Button } from '@/common/components/atoms/Button/Button';
import { Calendar } from '@/common/components/molecules/Calendar/Calendar';
import { ctw } from '@/common/utils/ctw/ctw';

type TDateRangePickerProps = {
  onChange: NonNullable<ComponentProps<typeof Calendar>['onSelect']>;
  value: ComponentProps<typeof Calendar>['selected'];
  placeholder?: string;
  className?: ComponentProps<'div'>['className'];
};

export const DateRangePicker = ({
  onChange,
  value,
  placeholder,
  className,
  ...props
}: TDateRangePickerProps & Partial<ComponentProps<typeof Calendar>>) => {
  return (
    <div className={ctw('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={ctw('h-8 justify-start px-2 py-1 text-left font-normal', {
              'text-muted-foreground': !value,
            })}
          >
            <CalendarIcon className="mr-2 d-4" />
            <DateRangePickerPlaceholder placeholder={placeholder} value={value} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...props}
            initialFocus
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            bottomActions={
              <div className={`flex space-x-2 p-2 pt-0`}>
                <Button
                  variant={`ghost`}
                  className={`!mt-0 h-8 select-none px-4 font-normal`}
                  disabled={
                    value?.from &&
                    value.to &&
                    dayjs(value.from).isSame(dayjs().subtract(1, 'month'), 'day') &&
                    dayjs().isSame(dayjs(value.to), 'day')
                  }
                  onClick={e =>
                    onChange(
                      { from: dayjs().subtract(1, 'month').toDate(), to: dayjs().toDate() },
                      new Date(),
                      {},
                      e,
                    )
                  }
                >
                  Last 30 days
                </Button>

                <Button
                  variant={`ghost`}
                  className={`!mt-0 h-8 select-none px-4 font-normal`}
                  disabled={!value?.from || !value.to}
                  onClick={e => {
                    onChange({ from: undefined, to: undefined }, new Date(), {}, e);
                  }}
                >
                  All Dates
                </Button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DateRangePickerPlaceholder = ({
  placeholder,
  value,
}: Pick<TDateRangePickerProps, 'placeholder' | 'value'>) => {
  const { text, shouldStyle } = useMemo(() => {
    if (!value || !value?.from) {
      return { text: placeholder ?? 'All Dates', shouldStyle: true };
    }

    if (
      dayjs(value.from).isSame(dayjs().subtract(1, 'month'), 'day') &&
      value.to &&
      dayjs().isSame(value.to, 'day')
    ) {
      return { text: 'Last 30 days', shouldStyle: true };
    }

    if (value.from && value.to) {
      return {
        text: `${formatDate(value.from, 'LLL dd, y')} - ${formatDate(value.to, 'LLL dd, y')}`,
        shouldStyle: false,
      };
    }

    return { text: formatDate(value.from, 'LLL dd, y'), shouldStyle: false };
  }, [value, placeholder]);

  return (
    <span
      className={ctw(
        'whitespace-nowrap',
        shouldStyle && 'rounded-md bg-gray-100 px-1 py-0.5 font-semibold text-blue-500',
      )}
    >
      {text}
    </span>
  );
};
