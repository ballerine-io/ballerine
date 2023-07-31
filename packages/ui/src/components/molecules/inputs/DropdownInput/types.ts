export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownInputProps {
  name: string;
  value?: string;
  placeholder: string;
  options: DropdownOption[];
  notFoundText?: string;
  searchable?: boolean;
  onChange: (value: string, inputName: string) => void;
}
