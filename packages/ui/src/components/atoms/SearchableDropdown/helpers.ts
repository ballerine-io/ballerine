import { ISearchableDropdownOption } from './SearchableDropdown';

export const findOptionByValue = (
  options: ISearchableDropdownOption[],
  value: string | undefined,
) => {
  if (!value) {
    return undefined;
  }

  return options.find(option => option.value === value);
};

export const findValueInOptions = (
  options: ISearchableDropdownOption[],
  value: string | undefined,
) => {
  const option = findOptionByValue(options, value);

  if (option) {
    return option.value;
  }

  return undefined;
};
