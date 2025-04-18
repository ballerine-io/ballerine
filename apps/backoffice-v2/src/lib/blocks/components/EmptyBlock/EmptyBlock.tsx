import { ctw } from '@/common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent } from 'react';

export const EmptyPlaceholderCell: FunctionComponent<ExtractCellProps<'emptyPlaceholder'>> = ({
  props,
}) => {
  const { title, icon, description, className } = props;

  return (
    <div className={ctw('flex flex-col flex-nowrap pt-8', className)}>
      <div className="mb-4 flex flex-row flex-nowrap justify-center">
        <div className="flex flex-row flex-nowrap">{icon}</div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
