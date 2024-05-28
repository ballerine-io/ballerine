import { ComponentProps } from 'react';
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
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface IComboboxProps {
  items: Array<{ value: string; label: string }>;
  /**
   * Used for the component's placeholders. E.g. "Select a framework..." or "Select a framework..."
   */
  resource: string;
  value: string;
  onChange: (value: string) => void;
  props?: {
    container?: ComponentProps<'div'>;
    popover?: ComponentProps<typeof Popover>;
    popoverTrigger?: ComponentProps<typeof PopoverTrigger>;
    button?: ComponentProps<typeof Button>;
    popoverContent?: ComponentProps<typeof PopoverContent>;
    command?: ComponentProps<typeof Command>;
    commandInput?: ComponentProps<typeof CommandInput>;
    commandEmpty?: ComponentProps<typeof CommandEmpty>;
    scrollArea?: ComponentProps<typeof ScrollArea>;
    commandGroup?: ComponentProps<typeof CommandGroup>;
    commandItem?: ComponentProps<typeof CommandItem>;
    chevronsUpDown?: ComponentProps<typeof ChevronsUpDown>;
    check?: ComponentProps<typeof Check>;
    placeholder?: ComponentProps<'span'>;
  };
}
