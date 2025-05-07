import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CasePieChart, CasePieChartProps } from '../CasePieChart/CasePieChart';

export const PieChartCard = ({
  title,
  ...pieChartProps
}: CasePieChartProps & { title: string }) => {
  return (
    <Card className={'flex h-full flex-col px-3'}>
      <CardHeader className={'pb-1 text-center font-bold'}>{title}</CardHeader>
      <CardContent>
        <div className={'flex flex-col items-center space-y-4 pt-3'}>
          <CasePieChart {...pieChartProps} />
        </div>
      </CardContent>
    </Card>
  );
};
