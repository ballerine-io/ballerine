import { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';
import { ReadOnlyDetail } from '@/common/components/atoms/ReadOnlyDetail/ReadOnlyDetail';
import { titleCase } from 'string-ts';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';

export const ReadOnlyDetailsCell: FunctionComponent<ExtractCellProps<'readOnlyDetails'>> = ({
  value,
  props,
}) => {
  const { parse, className, ...restProps } = props ?? {};

  if (!value?.length) {
    return;
  }

  return (
    <div
      {...restProps}
      className={ctw(`grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3`, className)}
    >
      {value?.map(({ label, value }) => {
        return (
          <div key={label} className="flex flex-col">
            <TextWithNAFallback as={'h4'} className={'mb-2 text-sm font-medium leading-none'}>
              {titleCase(label)}
            </TextWithNAFallback>
            <ReadOnlyDetail
              parse={parse}
              className={'max-w-[35ch] justify-start break-all text-sm'}
            >
              {value}
            </ReadOnlyDetail>
          </div>
        );
      })}
    </div>
  );
};
