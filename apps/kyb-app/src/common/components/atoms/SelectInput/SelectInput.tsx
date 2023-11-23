import { SelectInputOption } from '@/common/components/atoms/SelectInput/types';
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
} from '@ballerine/ui';
import { CaretSortIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
  name: string;
  value?: string;
  placeholder: string;
  options: SelectInputOption[];
  notFoundText?: string;
  onChange: (value: string, inputName: string) => void;
}

export const SelectInput = ({
  name,
  options,
  value,
  placeholder,
  notFoundText,
  onChange,
}: Props) => {
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
      <PopoverContent className={'w-full'}>
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{notFoundText || ''}</CommandEmpty>
          <ScrollArea orientation="both" className="h-[200px]">
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  value={option.value}
                  key={option.value}
                  onSelect={(value: string) => {
                    const option = options.find(
                      option => option.value.toLocaleLowerCase() === value.toLocaleLowerCase(),
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
