import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardTitle } from '@/common/components/atoms/Card/Card.Title';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { UserMinus, UserPlus, Users } from 'lucide-react';
import { FunctionComponent } from 'react';
import { z } from 'zod';

export const PortfolioAnalytics: FunctionComponent<
  Pick<
    z.infer<typeof MetricsResponseSchema>,
    'totalActiveMerchants' | 'addedMerchantsCount' | 'removedMerchantsCount'
  >
> = ({ totalActiveMerchants, addedMerchantsCount, removedMerchantsCount }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-tight">Portfolio Analytics</h3>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p>
            Total Active Merchants: <span className="font-semibold">{totalActiveMerchants}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Merchants Added</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addedMerchantsCount > 0 ? `+${addedMerchantsCount}` : `0`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merchants Removed</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {removedMerchantsCount > 0 ? `-${removedMerchantsCount}` : `0`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
