import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Command, CommandGroup, CommandInput, CommandItem } from '@components/atoms/Command';
import { Badge } from '@components/atoms/Badge';
import keyBy from 'lodash/keyBy';
import { Popover, PopoverContent, ScrollArea, PopoverTrigger } from '@components/atoms';

interface MultiSelectOtion {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  name?: string;
  value?: string[] | null;
  options: MultiSelectOtion[];
  searchPlaceholder?: string;
  onChange: (selected: string[] | null, inputName: string) => void;
}

export const MultiSelect = ({
  name,
  value,
  options,
  searchPlaceholder = 'Select more...',
  onChange,
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    if (!value) return [];

    const optionsMap = keyBy(options, 'value');

    return value.map(value => optionsMap[value]);
  }, [value, options]);

  const [inputValue, setInputValue] = useState('');

  const handleSelect = useCallback(
    (option: MultiSelectOtion) => {
      setInputValue('');
      onChange(value ? [...value, option.value] : [option.value], name);
    },
    [value, name, onChange],
  );

  const handleUnselect = useCallback(
    (option: MultiSelectOtion) => {
      onChange(
        selected
          .filter(selectedOption => selectedOption.value !== option.value)
          .map(option => option.value),
        name,
      );
    },
    [selected, name, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            selected.pop();
            onChange(
              selected.map(option => option.value),
              name,
            );
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [selected, name, onChange],
  );

  const selectables = useMemo(() => {
    const selectedMap = keyBy(selected, 'value');

    return options
      .filter(option => !selectedMap[option.value])
      .filter(option =>
        inputValue
          ? option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
          : true,
      );
  }, [options, selected, inputValue]);

  useEffect(() => {
    const outsideClickHandler = (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as HTMLDivElement)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', outsideClickHandler);

    return () => {
      document.removeEventListener('mousedown', outsideClickHandler);
    };
  }, [containerRef, open]);

  return (
    <Popover open={open}>
      <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
        <PopoverTrigger asChild>
          <div className="border-input ring-offset-background focus-within:ring-ring min-10 group flex items-center rounded-md border py-2 text-sm focus-within:ring-1 focus-within:ring-offset-1">
            <div className="flex flex-wrap gap-2 px-2">
              {selected.map(option => {
                return (
                  <Badge key={option.value} className="h-6">
                    {option.label}
                    <button
                      className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleUnselect(option);
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(option)}
                    >
                      <X className="hover:text-muted-foreground h-3 w-3 text-white" />
                    </button>
                  </Badge>
                );
              })}
              <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                placeholder={searchPlaceholder}
                style={{ border: 'none' }}
                className="h-6"
                onFocus={() => setOpen(true)}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent style={{ width: 'var(--radix-popover-trigger-width)' }}>
          {selectables.length ? (
            <ScrollArea orientation="both" className="h-[200px]">
              <CommandGroup className="h-full p-0">
                {selectables.map(option => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(option)}
                      className={'cursor-pointer'}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground text-center text-xs">
              Options not found or already selected.
            </p>
          )}
        </PopoverContent>
      </Command>
    </Popover>
  );
};
