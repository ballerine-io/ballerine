import { ctw } from '@/common';
import { muiTheme } from '@/common/mui-theme';
import { Paper } from '@/components/atoms';
import { ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { FocusEvent, useCallback, useMemo } from 'react';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface DatePickerChangeEvent {
  target: {
    value: string | null;
    name?: string;
  };
}

export type DatePickerValue = number | string | Date | null;

export interface DatePickerParams {
  disableFuture?: boolean;
  disablePast?: boolean;
  // dayjs format string or iso
  outputValueFormat?: string;
  // MUI date picker date format
  inputDateFormat?: string;
}

export interface DatePickerProps {
  value?: DatePickerValue;
  name?: string;
  disabled?: boolean;
  params?: DatePickerParams;
  testId?: string;
  textInputClassName?: string;
  onChange: (event: DatePickerChangeEvent) => void;
  onBlur?: (event: FocusEvent<any>) => void;
  onFocus?: (event: FocusEvent<any>) => void;
}

export const DatePickerInput = ({
  value: _value,
  name,
  disabled = false,
  params,
  testId,
  textInputClassName,
  onChange,
  onBlur,
  onFocus,
}: DatePickerProps) => {
  const {
    outputValueFormat,
    inputDateFormat = 'MM/DD/YYYY',
    disableFuture = false,
    disablePast = false,
  } = params || {};

  const serializeValue = useCallback(
    (value: Dayjs): string => {
      if (!dayjs(value).isValid()) {
        console.warn(
          `Invalid outputValueFormat: "${outputValueFormat}" provided. iso will be used.`,
        );

        return value.startOf('day').utc().format();
      }

      return outputValueFormat
        ? value.format(outputValueFormat)
        : value.startOf('day').utc().format();
    },
    [outputValueFormat],
  );

  const deserializeValue = useCallback(
    (value: DatePickerValue) => dayjs(value, outputValueFormat),
    [outputValueFormat],
  );

  const handleChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) {
        return onChange({ target: { value: null, name } });
      }

      try {
        const serializedDateValue = serializeValue(value);
        onChange({
          target: {
            value: serializedDateValue,
            name,
          },
        });
      } catch (error) {
        // Ignoring serialization due to partial date input
        // Attept to serialize partially entered date e.g 12/MM/YYYY will cause exception
        return null;
      }
    },
    [name, onChange, serializeValue],
  );

  const value = useMemo(() => {
    if (!_value) {
      return null;
    }

    return deserializeValue(_value);
  }, [_value, deserializeValue]);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disablePast={disablePast}
          disableFuture={disableFuture}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          reduceAnimations
          format={inputDateFormat}
          slots={{
            openPickerIcon: () => <CalendarDays size="16" color="#64748B" className="opacity-50" />,
            rightArrowIcon: () => (
              <ChevronRight size="18" className="hover:text-muted-foreground cursor-pointer" />
            ),
            leftArrowIcon: () => (
              <ChevronLeft size="18" className="hover:text-muted-foreground cursor-pointer" />
            ),
          }}
          slotProps={{
            nextIconButton: { disableRipple: true },
            previousIconButton: { disableRipple: true },
            switchViewButton: {
              disableRipple: true,
            },
            openPickerButton: {
              disableRipple: true,
            },
            desktopPaper: {
              //@ts-ignore
              component: Paper,
              className: 'mt-2 mb-2',
            },
            dialog: {
              className: 'pointer-events-auto',
            },
            popper: {
              className: 'pointer-events-auto',
            },
            textField: {
              size: 'small',
              fullWidth: true,
              className: ctw(
                'flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                '[&_.MuiOutlinedInput-notchedOutline]:border-none',
                '[&_.MuiOutlinedInput-root]:border',
                '[&_.MuiOutlinedInput-root]:border-input',
                '[&_.MuiOutlinedInput-root]:rounded-md',
                '[&_.MuiOutlinedInput-root.Mui-focused]:border-ring',
                '[&_.MuiOutlinedInput-root.Mui-focused]:ring-1',
                '[&_.MuiOutlinedInput-root.Mui-focused]:ring-ring',
                '[&_.MuiFormControl-root]:p-0',
                textInputClassName,
              ),
              inputProps: {
                'data-test-id': testId,
                onBlur: onBlur,
                onFocus: onFocus,
              },
              InputProps: {
                className: 'focus:outline-none',
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
