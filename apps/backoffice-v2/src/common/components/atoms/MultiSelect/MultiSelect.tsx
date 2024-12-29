import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ReactNode, useCallback } from 'react';
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  ctw,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ballerine/ui';

import { Separator } from '@/common/components/atoms/Separator/Separator';

interface IMultiSelectProps<
  TOption extends {
    label: string;
    value: unknown;
    icon?: ReactNode;
  },
> {
  title: string;
  isLoading?: boolean;
  selectedValues: Array<TOption['value']>;
  onSelect: (value: Array<TOption['value']>) => void;
  onClearSelect: () => void;
  options: TOption[];
  props?: {
    content?: {
      className?: string;
    };
    trigger?: {
      leftIcon?: JSX.Element;
      rightIcon?: JSX.Element;
      className?: string;
      title?: {
        className?: string;
      };
    };
  };
}

export const MultiSelect = <
  TOption extends {
    label: string;
    value: unknown;
    icon?: ReactNode;
  },
>({
  title,
  isLoading,
  selectedValues: selected,
  onSelect,
  onClearSelect,
  options,
  props,
}: IMultiSelectProps<TOption>) => {
  const onSelectChange = useCallback(
    (value: TOption['value']) => {
      const isSelected = selected.some(selectedValue => selectedValue === value);
      const nextSelected = isSelected
        ? selected.filter(selectedValue => selectedValue !== value)
        : [...selected, value];

      onSelect(nextSelected);
    },
    [onSelect, selected],
  );

  const TriggerLeftIcon = props?.trigger?.leftIcon ?? <PlusCircledIcon className="mr-2 h-4 w-4" />;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={ctw(`h-8 border`, props?.trigger?.className)}
        >
          {TriggerLeftIcon}
          <span className={ctw(props?.trigger?.title?.className)}>{title}</span>
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
                        key={`${option.value}`}
                        variant="secondary"
                        className="max-w-[20ch] truncate rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
          {props?.trigger?.rightIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={ctw(`w-[200px] p-0`, props?.content?.className)} align="start">
        <Command filter={(value, search) => (value.includes(search) ? 1 : 0)}>
          <CommandInput placeholder={title} />
          <CommandList>
            {isLoading && (
              <CommandLoading className={`flex items-center justify-center pb-3 text-sm`}>
                Loading...
              </CommandLoading>
            )}
            {!isLoading && options.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
            {!isLoading && options.length > 0 && (
              <CommandGroup>
                <div className={`max-h-[250px] overflow-y-auto`}>
                  {options.map(option => {
                    const isSelected = selected.some(value => value === option.value);

                    return (
                      <CommandItem
                        value={option.label}
                        key={`${option.value}`}
                        className={`cursor-pointer`}
                        onSelect={() => onSelectChange(option.value)}
                      >
                        <div
                          className={ctw(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckIcon className={ctw('h-4 w-4')} />
                        </div>
                        {option.icon}
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </div>
              </CommandGroup>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={onClearSelect}
              className={ctw(
                `cursor-pointer justify-center text-center`,
                selected.length === 0 && 'pointer-events-none opacity-50',
              )}
            >
              Clear filters
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
