import { DropdownInputProps } from './types';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@components/atoms';
import { CaretSortIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export const DropdownInput = ({
  name,
  options,
  value,
  placeholder,
  notFoundText,
  searchable = false,
  onChange,
}: DropdownInputProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={clsx(
            'w-full justify-between bg-white',
            !selectedOption && 'text-muted-foreground',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: 'var(--radix-popover-trigger-width)' }} className="p-2">
        <Command className="w-full">
          {searchable ? <CommandInput placeholder={placeholder} className="h-9" /> : null}
          <CommandEmpty>{notFoundText || ''}</CommandEmpty>
          <ScrollArea orientation="both" className="max-h-[200px]">
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={(label: string) => {
                    const option = options.find(
                      option => option.label.toLocaleLowerCase() === label.toLocaleLowerCase(),
                    );

                    onChange(option?.value || '', name);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={clsx(
                      'ml-auto h-4 w-4',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
