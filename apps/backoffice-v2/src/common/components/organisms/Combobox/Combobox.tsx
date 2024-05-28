'use client';

import * as React from 'react';
import { forwardRef } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ballerine/ui';
import { Button } from '@/common/components/atoms/Button/Button';
import { ctw } from '@/common/utils/ctw/ctw';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { IComboboxProps } from '@/common/components/organisms/Combobox/interfaces';
import { useToggle } from '@/common/hooks/useToggle/useToggle';

export const Combobox = forwardRef<HTMLInputElement, IComboboxProps>(
  ({ items, resource, value, onChange, props }, ref) => {
    const [isOpen, toggleIsOpen, _toggleIsOpenOn, toggleIsOpenOff] = useToggle();

    return (
      <div {...props?.container}>
        <Popover open={isOpen} onOpenChange={toggleIsOpen} {...props?.popover}>
          <PopoverTrigger asChild {...props?.popoverTrigger}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              {...props?.button}
              className={ctw('w-[200px] justify-between', props?.button?.className)}
            >
              {!!value && items.find(item => item.value === value)?.label}
              {!value && (
                <span
                  {...props?.placeholder}
                  className={ctw('text-muted-foreground', props?.placeholder?.className)}
                >
                  Select {resource}...
                </span>
              )}
              <ChevronsUpDown
                {...props?.chevronsUpDown}
                className={ctw(
                  'ml-2 h-4 w-4 shrink-0 opacity-50',
                  props?.chevronsUpDown?.className,
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            {...props?.popoverContent}
            className={ctw('w-[200px] p-0', props?.popoverContent)}
          >
            <Command {...props?.command}>
              <CommandInput
                placeholder={`Search ${resource}...`}
                {...props?.commandInput}
                ref={ref}
              />
              <CommandEmpty {...props?.commandEmpty}>No {resource} found.</CommandEmpty>
              <ScrollArea
                orientation={'vertical'}
                {...props?.scrollArea}
                className={ctw('h-[300px]', props?.scrollArea?.className)}
              >
                <CommandGroup {...props?.commandGroup}>
                  {items.map(item => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => {
                        onChange(item.value === value ? '' : item.value);
                        toggleIsOpenOff();
                      }}
                      {...props?.commandItem}
                    >
                      <Check
                        {...props?.check}
                        className={ctw(
                          'mr-2 h-4 w-4',
                          {
                            'opacity-100': value === item.value,
                            'opacity-0': value !== item.value,
                          },
                          props?.check?.className,
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
