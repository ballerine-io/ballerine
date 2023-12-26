import { useEffect } from 'react';
import { TDropdownOption } from '../types';

export const useWatchDropdownOptions = ({ form, data, setFormData }) => {
  const watch = form.watch;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!['category'].includes(name)) return subscription.unsubscribe();
      const newData = structuredClone(data);

      newData
        .filter(item => !!item.dropdownOptions)
        .filter(item =>
          item.dropdownOptions.find(dropdownOption => dropdownOption.dependantOn === name),
        )
        .forEach(item => {
          item.dropdownOptions = item.dropdownOptions.filter(
            (dropdownOption: TDropdownOption) => dropdownOption.dependantValue === value[name],
          );
          item.value = item.dropdownOptions.find(
            dropDownOption => dropDownOption.value == value,
          )?.value;

          if (item.value) {
            form.setValue(item.title, `${item.value}`);
          }

          return (newData[newData.indexOf(item)] = item);
        });

      setFormData(newData);
    });

    return () => subscription.unsubscribe();
  }, [watch, data, setFormData]);
};
