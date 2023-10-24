import { FocusEvent } from 'react';

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
  onChange: (value: string, inputName: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}
