import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { FunctionComponent } from 'react';

interface INoDataCellProps {
  type: 'noData';
  props: {
    title: string;
    description: string;
    icon: JSX.Element;
    className?: string;
  };
}

export const NoDataCell: FunctionComponent<INoDataCellProps> = ({ props }) => {
  const { title, description, icon, className } = props;

  return (
    <Card className={ctw('shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex justify-center">{icon}</div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm leading-[28px]">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
