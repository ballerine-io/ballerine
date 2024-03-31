import { PopoverContent } from '@/components';
import React, { ComponentProps, FocusEvent } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface PlaceholdersParams {
  placeholder?: string;
  searchPlaceholder?: string;
}

export interface DropdownInputProps {
  name: string;
  value?: string;
  placeholdersParams?: PlaceholdersParams;
  options: DropdownOption[];
  notFoundText?: string;
  searchable?: boolean;
  disabled?: boolean;
  openOnFocus?: boolean;
  onChange: (value: string, inputName: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  props?: {
    trigger?: Pick<ComponentProps<typeof PopoverContent>, 'className'> & {
      icon?: React.ReactNode;
    };
    content?: Pick<ComponentProps<typeof PopoverContent>, 'align' | 'className'>;
    item?: {
      variant: string;
    };
  };
  testId?: string;
}
