import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Paper } from '@components/atoms/Paper';
import { useCallback, useMemo } from 'react';

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
  onChange: (event: AutocompleteChangeEvent) => void;
}

export const AutocompleteInput = ({
  options,
  value,
  placeholder,
  name,
  onChange,
}: AutocompleteInputProps) => {
  const optionLabels = useMemo(() => options.map(option => option.value), [options]);

  const handleChange = useCallback(
    (_, newValue: string) => {
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
    <Autocomplete
      disablePortal
      options={optionLabels}
      freeSolo
      PaperComponent={Paper}
      onChange={handleChange}
      slotProps={{
        paper: {
          className: 'mt-2',
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          variant="standard"
          fullWidth
          size="small"
          placeholder={placeholder}
          value={value}
          //@ts-nocheck
          InputProps={{
            ...params.InputProps,
            classes: {
              root: 'border-input bg-background placeholder:text-muted-foreground rounded-md border text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 px-3 py-0',
              focused: 'border-input ring-ring ring-1',
            },
            disableUnderline: true,
          }}
          //@ts-nocheck
          inputProps={{
            ...params.inputProps,
            className: 'py-0 px-0 h-9',
          }}
          onChange={handleInputChange}
        />
      )}
    />
  );
};
