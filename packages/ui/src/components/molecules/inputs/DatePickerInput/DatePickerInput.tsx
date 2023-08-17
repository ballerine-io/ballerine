import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import { TextField, TextFieldProps, ThemeProvider } from '@mui/material';
import { muiTheme } from '@common/mui-theme';
import { Paper } from '@components/atoms';

export interface DatePickerChangeEvent {
  target: {
    value: string | null;
    name?: string;
  };
}

export type DatePickerValue = number | string | Date | null;

export interface DatePickerProps {
  value?: DatePickerValue;
  name?: string;
  disabled?: boolean;
  onChange: (event: DatePickerChangeEvent) => void;
}

export const DatePickerInput = ({
  value: _value,
  name,
  disabled = false,
  onChange,
}: DatePickerProps) => {
  const serializeValue = useCallback((value: Dayjs): string => {
    return value.toDate().toISOString();
  }, []);

  const deserializeValue = useCallback((value: DatePickerValue) => {
    return dayjs(value);
  }, []);

  const handleChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) return onChange({ target: { value: null, name } });

      onChange({
        target: {
          value: serializeValue(value),
          name,
        },
      });
    },
    [name, onChange, serializeValue],
  );

  const value = useMemo(() => {
    if (!_value) return null;

    return deserializeValue(_value);
  }, [_value, deserializeValue]);

  const Field = useMemo(
    () => (props: TextFieldProps) => {
      return (
        <TextField
          {...props}
          variant="standard"
          fullWidth
          size="small"
          error={props.error}
          FormHelperTextProps={{
            classes: {
              root: 'pl-2 text-destructive font-inter text-[0.8rem]',
            },
          }}
          helperText={props.error ? 'Please enter valid date.' : undefined}
          InputProps={{
            ...props.InputProps,
            classes: {
              root: 'shadow-none bg-background border-input rounded-md border text-sm shadow-sm transition-colors px-3 py-0',
              focused: 'border-input ring-ring ring-1',
              disabled: 'opacity-50 cursor-not-allowed',
            },
            disableUnderline: true,
          }}
          inputProps={{
            ...props.inputProps,
            className: 'py-0 px-0 h-9',
          }}
        />
      );
    },
    [],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={disabled}
          value={value}
          onChange={handleChange}
          reduceAnimations
          slots={{
            textField: Field,
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
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
