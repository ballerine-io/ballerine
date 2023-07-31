import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AnyObject } from '@common/types';
import { useCallback, useMemo, useState } from 'react';
import { Field } from '@components/molecules/inputs/DatePickerInput/components/Field';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarWrapper } from '@components/molecules/inputs/DatePickerInput/components/CalendarWrapper';
import createTheme from '@mui/system/createTheme';
import ThemeProvider from '@mui/system/ThemeProvider';
import dayjs, { Dayjs } from 'dayjs';

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

  const toggleOpen = useCallback(() => setOpen(prev => !prev), []);

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
            field: Field as React.ComponentType<AnyObject>,
            rightArrowIcon: () => (
              <ChevronRight size="18" className="hover:text-muted-foreground cursor-pointer" />
            ),
            leftArrowIcon: () => (
              <ChevronLeft size="18" className="hover:text-muted-foreground cursor-pointer" />
            ),
          }}
          slotProps={{
            field: { onAdornmentClick: toggleOpen } as AnyObject,
            nextIconButton: { disableRipple: true },
            previousIconButton: { disableRipple: true },
            switchViewButton: {
              disableRipple: true,
            },
            desktopPaper: {
              //@ts-ignore
              component: CalendarWrapper,
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
