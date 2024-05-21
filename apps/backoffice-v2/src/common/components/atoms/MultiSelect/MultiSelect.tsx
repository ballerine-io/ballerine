import { Separator } from '@/common/components/atoms/Separator/Separator';
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ctw,
} from '@ballerine/ui';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ReactNode, useCallback, useState } from 'react';

interface IMultiSelectProps<
  TOption extends {
    label: string;
    value: unknown;
    icon?: ReactNode;
  },
> {
  title: string;
  selectedValues: Array<TOption['value']>;
  onSelect: (value: Array<TOption['value']>) => void;
  onClearSelect: () => void;
  options: TOption[];
}

export const MultiSelect = <
  TOption extends {
    label: string;
    value: unknown;
    icon?: ReactNode;
  },
>({
  title,
  selectedValues,
  onSelect,
  onClearSelect,
  options,
}: IMultiSelectProps<TOption>) => {
  const [selected, setSelected] = useState(selectedValues);

  const onSelectChange = useCallback(
    (value: TOption['value']) => {
      const isSelected = selected.some(selectedValue => selectedValue === value);
      const nextSelected = isSelected
        ? selected.filter(selectedValue => selectedValue !== value)
        : [...selected, value];

      setSelected(nextSelected);
      onSelect(nextSelected);
    },
    [onSelect, selected],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          <PlusCircledIcon className="mr-2 size-4" />
          {title}
          {selected?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selected.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selected.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selected.length} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => selected.some(value => value === option.value))
                    .map(option => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.some(value => value === option.value);

                return (
                  <CommandItem key={option.value} onSelect={() => onSelectChange(option.value)}>
                    <div
                      className={ctw(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={ctw('size-4')} />
                    </div>
                    {option.icon}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected?.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onClearSelect();
                      setSelected([]);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
