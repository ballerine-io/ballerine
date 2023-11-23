import { Check, LucideIcon, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
// import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/Popover';
import { Button } from '@/components/atoms/Button';
import { Separator } from '@/components/atoms/Separator';
import { Badge } from '@/components/atoms/Badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/atoms/Command';

export interface FacetedFilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface Props {
  title?: string;
  options: FacetedFilterOption[];
  value: string[];
  onChange: (values: string[]) => void;
}

export function FacetedFilter({ title, options, value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-inter h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {value.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {value.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {value.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {value.length} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => value.includes(option.value))
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
        <Command className="font-inter">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        onChange(value.filter(selectedValue => selectedValue !== option.value));
                      } else {
                        onChange([...value, option.value]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {value.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem className="justify-center text-center" onSelect={() => onChange([])}>
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
}
