import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, TextField, ThemeProvider } from '@mui/material';
import { Paper } from '@components/atoms/Paper';

const getCSSVariableValue = (variableName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(variableName);

const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    primary: {
      main: `hsla(${getCSSVariableValue('--primary')})`,
      contrastText: '#fff',
    },
  },
});

export interface DatePickerChangeEvent {
  target: {
    value: number | null;
    name?: string;
  };
}

export interface DatePickerProps {
  value?: number | null;
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

  const deserializeValue = useCallback((value: number) => {
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
    <ThemeProvider theme={theme}>
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
                    root: 'border-input bg-background placeholder:text-muted-foreground rounded-md border text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 px-3 py-0',
                    focused: 'border-input ring-ring ring-1',
                  },
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  className: 'py-0 px-0 h-9',
                }}
              />
            ),
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
