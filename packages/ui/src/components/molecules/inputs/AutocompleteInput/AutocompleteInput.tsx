import { muiTheme } from '@/common/mui-theme';
import { Paper } from '@/components/atoms/Paper';
import { ThemeProvider } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ComponentProps, FocusEvent, useCallback, useMemo } from 'react';

export interface AutocompleteOption {
  value: string;
}

export type AutocompleteChangeEvent = React.ChangeEvent<{
  name?: string;
  value: string;
}>;

export interface AutocompleteInputProps {
  value?: string;
  options: AutocompleteOption[];
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  testId?: string;
  onChange: (event: AutocompleteChangeEvent) => void;
  onBlur?: (event: FocusEvent<any>) => void;
}

export const AutocompleteInput = ({
  options,
  value = '',
  placeholder,
  name,
  disabled,
  testId,
  onChange,
  onBlur,
}: AutocompleteInputProps) => {
  const optionLabels = useMemo(() => options.map(option => option.value), [options]);

  const handleChange: NonNullable<ComponentProps<typeof Autocomplete>['onChange']> = useCallback(
    (_, newValue) => {
      onChange({ target: { value: newValue, name } } as AutocompleteChangeEvent);
    },
    [name, onChange],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        target: {
          name,
          value: event.target.value,
        },
      } as AutocompleteChangeEvent);
    },
    [name, onChange],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Autocomplete
        disablePortal
        options={optionLabels}
        getOptionLabel={label => label}
        freeSolo
        inputValue={value}
        PaperComponent={Paper as ComponentProps<typeof Autocomplete>['PaperComponent']}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          paper: {
            className: 'mt-2 mb-2 w-full',
          },
          clearIndicator: {
            disableRipple: true,
          },
        }}
        renderOption={(props, option) => (
          <li {...props} key={option} data-test-id={testId ? `${testId}-option` : undefined}>
            {option}
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
            size="small"
            placeholder={placeholder}
            disabled={disabled}
            onBlur={onBlur}
            //@ts-nocheck
            InputProps={{
              ...params.InputProps,
              classes: {
                root: 'border-input bg-background placeholder:text-muted-foreground rounded-md border text-sm transition-colors px-3 py-0 shadow-none',
                focused: 'border-input ring-ring ring-1',
                disabled: 'opacity-50 cursor-not-allowed',
              },
              disableUnderline: true,
            }}
            //@ts-nocheck
            inputProps={{
              ...params.inputProps,
              'data-test-id': testId,
              className: 'py-0 px-0 h-9',
            }}
            onChange={handleInputChange}
          />
        )}
      />
    </ThemeProvider>
  );
};
