import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import { TextField, ThemeProvider } from '@mui/material';
import { Paper } from '@components/atoms/Paper';
import { muiTheme } from '@common/mui-theme';

export interface DatePickerChangeEvent {
  target: {
    value: number | null;
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
  const [isOpen, setOpen] = useState(false);

  const serializeValue = useCallback((value: Dayjs): number => {
    return +value.toDate();
  }, []);

  const deserializeValue = useCallback((value: DatePickerValue) => {
    if (value instanceof Date) {
      return dayjs(value);
    }

    if (typeof value === 'string' && value) {
      return dayjs(new Date(value));
    }

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
    if (!_value) return undefined;

    return deserializeValue(_value);
  }, [_value, deserializeValue]);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          open={isOpen}
          disabled={disabled}
          value={value}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={handleChange}
          slots={{
            textField: params => (
              <TextField
                {...params}
                variant="standard"
                fullWidth
                size="small"
                InputProps={{
                  ...params.InputProps,
                  classes: {
                    root: 'shadow-none bg-background border-input rounded-md border text-sm shadow-sm transition-colors px-3 py-0',
                    focused: 'border-input ring-ring ring-1',
                    disabled: 'opacity-50 cursor-not-allowed',
                  },
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  className: 'py-0 px-0 h-9',
                }}
              />
            ),
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
              className: 'mt-2',
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
