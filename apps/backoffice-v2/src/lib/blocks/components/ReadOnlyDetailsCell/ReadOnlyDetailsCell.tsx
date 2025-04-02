import { FunctionComponent, useMemo } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';
import { ReadOnlyDetail } from '@/common/components/atoms/ReadOnlyDetail/ReadOnlyDetail';
import { titleCase } from 'string-ts';
import { TextWithNAFallback } from '@ballerine/ui';
import { sortData } from '../../utils/sort-data';

export const ReadOnlyDetailsCell: FunctionComponent<ExtractCellProps<'readOnlyDetails'>> = ({
  value,
  props,
}) => {
  const { config, className, ...restProps } = props ?? {};
  const sortedData = useMemo(
    () =>
      sortData({
        data: value,
        direction: config?.sort?.direction,
        predefinedOrder: config?.sort?.predefinedOrder,
        sortBy: 'label',
      }),
    [value, config?.sort?.direction, config?.sort?.predefinedOrder],
  );

  if (!value?.length) {
    return;
  }

  return (
    <div
      {...restProps}
      className={ctw(`grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3`, className)}
    >
      {sortedData.map(({ label, value, props }) => {
        return (
          <div key={label} className="flex flex-col">
            <TextWithNAFallback as={'h4'} className={'mb-2 text-sm font-medium leading-none'}>
              {titleCase(label ?? '')}
            </TextWithNAFallback>
            <ReadOnlyDetail
              {...props}
              parse={config?.parse}
              className={ctw('max-w-[35ch] justify-start break-all text-sm', props?.className)}
            >
              {value}
            </ReadOnlyDetail>
          </div>
        );
      })}
    </div>
  );
};
