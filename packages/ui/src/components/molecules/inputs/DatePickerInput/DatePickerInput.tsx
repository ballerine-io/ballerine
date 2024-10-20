import { ctw } from '@/common';
import { muiTheme } from '@/common/mui-theme';
import { Paper } from '@/components/atoms';
import { TextField, TextFieldProps, ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { FocusEvent, FunctionComponent, useCallback, useMemo, useState } from 'react';

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
}: DatePickerProps) => {
  const {
    outputValueFormat = 'iso',
    inputDateFormat = 'MM/DD/YYYY',
    disableFuture = false,
    disablePast = false,
  } = params || {};
  const [isFocused, setFocused] = useState(false);

  const serializeValue = useCallback(
    (value: Dayjs): string => {
      if (outputValueFormat.toLowerCase() === 'iso') {
        return value.toISOString();
      }

      const date = value.format(outputValueFormat);

      if (!dayjs(date).isValid()) {
        console.warn(
          `Invalid outputValueFormat: "${outputValueFormat}" provided. iso will be used.`,
        );

        return value.toISOString();
      }

      return date;
    },
    [outputValueFormat],
  );

  const deserializeValue = useCallback((value: DatePickerValue) => {
    return dayjs(value);
  }, []);

  const handleChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) return onChange({ target: { value: null, name } });

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
    if (!_value) return null;

    return deserializeValue(_value);
  }, [_value, deserializeValue]);

  const Field = useMemo(() => {
    const Component: FunctionComponent<TextFieldProps> = props => {
      return (
        <TextField
          {...props}
          variant="standard"
          fullWidth
          size="small"
          onFocus={e => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          error={!isFocused ? props.error : false}
          FormHelperTextProps={{
            classes: {
              root: 'pl-2 text-destructive font-inter text-[0.8rem]',
            },
          }}
          helperText={!isFocused && props.error ? 'Please enter valid date.' : undefined}
          InputProps={{
            ...props.InputProps,
            classes: {
              root: ctw(
                'bg-background border-input rounded-md border text-sm shadow-sm transition-colors px-3 py-0',
                textInputClassName,
              ),
              focused: 'border-input ring-ring ring-1',
              disabled: 'opacity-50 cursor-not-allowed',
            },
            disableUnderline: true,
          }}
          inputProps={{
            ...props.inputProps,
            'data-testid': testId,
            className: 'py-0 px-0 h-9',
          }}
        />
      );
    };

    return Component;
  }, [isFocused, onBlur, testId]);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disablePast={disablePast}
          disableFuture={disableFuture}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          reduceAnimations
          format={inputDateFormat}
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
            dialog: {
              className: 'pointer-events-auto',
            },
            popper: {
              className: 'pointer-events-auto',
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
