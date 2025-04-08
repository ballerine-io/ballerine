import { ComponentProps, FunctionComponent } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue } from '../Select';
import { CountrySelectContent } from './CountrySelect.Content';

export const CountrySelect: FunctionComponent<
  Omit<ComponentProps<typeof Select>, 'onValueChange'> & {
    onChange: ComponentProps<typeof Select>['onValueChange'];
  }
> & {
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Content: typeof CountrySelectContent;
  Item: typeof SelectItem;
} = ({ value, onChange, children, ...props }) => {
  return (
    <Select {...props} value={value} onValueChange={onChange}>
      {children}
    </Select>
  );
};

CountrySelect.displayName = 'CountrySelect';

CountrySelect.Trigger = SelectTrigger;
CountrySelect.Value = SelectValue;
CountrySelect.Content = CountrySelectContent;
CountrySelect.Item = SelectItem;
