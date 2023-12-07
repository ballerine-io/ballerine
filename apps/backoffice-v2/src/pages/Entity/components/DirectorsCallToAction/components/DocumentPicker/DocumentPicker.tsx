import { FunctionComponent, useCallback } from 'react';
import { Select } from '../../../../../../common/components/atoms/Select/Select';
import { SelectContent } from '../../../../../../common/components/atoms/Select/Select.Content';
import { SelectItem } from '../../../../../../common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '../../../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../../../common/components/atoms/Select/Select.Value';

import { ICallToActionDocumentOption } from '@/pages/Entity/components/DirectorsCallToAction/interfaces';

interface DocumentPickerProps {
  options: ICallToActionDocumentOption[];
  value?: string;
  onSelect: (value: string) => void;
}

export const DocumentPicker: FunctionComponent<DocumentPickerProps> = ({
  options,
  value,
  onSelect,
}) => {
  const handleChange = useCallback(
    (value: ICallToActionDocumentOption['value']) => {
      onSelect(value);
    },
    [onSelect],
  );

  return (
    <div>
      <label className={`mb-2 block font-bold`} htmlFor={`reason`}>
        Document to re-upload
      </label>
      <Select onValueChange={handleChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options?.map(option => {
            return (
              <SelectItem key={option.value} value={option.value} className={`capitalize`}>
                {option.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
