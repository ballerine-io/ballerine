import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent } from 'react';

export const NoDataCell: FunctionComponent<ExtractCellProps<'noData'>> = ({ value, props }) => {
  const { className } = props;
  const { title, description, icon } = value;

  return (
    <Card className={ctw('shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex justify-center">{icon}</div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <h4 className="text-sm leading-[28px]">{description}</h4>
        </div>
      </CardContent>
    </Card>
  );
};
