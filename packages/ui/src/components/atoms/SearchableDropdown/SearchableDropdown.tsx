import { Check, ChevronsUpDown } from 'lucide-react';
import { CommandGroup } from '../Command/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { CommandEmpty } from '../Command';
import { CommandInput, CommandItem, CommandList } from '../Command/Command';
import { Button } from '../Button';
import { Command } from '../Command';
import { ctw } from '@/common';
import { useCallback, useMemo, useState } from 'react';
import { findOptionByValue, findValueInOptions } from './helpers';

export interface ISearchableDropdownOption {
  value: string;
  label: string;
}

interface ISearchableDropdownProps {
  options: ISearchableDropdownOption[];
  value: string | undefined;
  disabled?: boolean;
  placeholder?: string;
  optionNotFoundText?: string;
  testId?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const SearchableDropdown = ({
  options,
  value,
  placeholder = 'Select...',
  optionNotFoundText = 'No options found',
  testId,
  disabled = false,
  onChange,
  onBlur,
  onFocus,
}: ISearchableDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = useMemo(() => findOptionByValue(options, value), [options, value]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newValue = findValueInOptions(options, currentValue);

      onChange(newValue as string);
      setOpen(false);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    if (!isFocused) {
      onBlur?.();
    }
  }, [isFocused, onBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setIsFocused(false);
        onBlur?.();
      }
    },
    [isFocused, onBlur],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3"
          onFocus={handleFocus}
          data-testid={testId ? `${testId}-trigger` : undefined}
          disabled={disabled}
        >
          <span
            className={ctw('truncate', {
              'text-muted-foreground': !selectedOption,
            })}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onFocus={handleFocus}
            data-testid={testId ? `${testId}-search-input` : undefined}
          />
          <CommandList>
            <CommandEmpty>{optionNotFoundText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  data-testid={testId ? `${testId}-option-${option.value}` : undefined}
                  onSelect={() => handleSelect(option.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {option.label}
                  <Check
                    className={ctw('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
