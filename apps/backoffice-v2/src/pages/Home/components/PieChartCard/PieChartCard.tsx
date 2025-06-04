import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { ctw } from '@/common/utils/ctw/ctw';
import { CasePieChart, CasePieChartProps } from '../CasePieChart/CasePieChart';

export const PieChartCard = ({
  title,
  centeredTitle = true,
  ...pieChartProps
}: CasePieChartProps & { title: string; centeredTitle?: boolean }) => {
  return (
    <Card className={'flex h-full flex-col px-3'}>
      <CardHeader className={ctw('pb-1 font-bold', centeredTitle && 'text-center')}>
        {title}
      </CardHeader>
      <CardContent>
        <div className={'flex flex-col items-center space-y-4 pt-3'}>
          <CasePieChart {...pieChartProps} />
        </div>
      </CardContent>
    </Card>
  );
};
