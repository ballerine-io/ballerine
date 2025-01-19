import { z } from 'zod';
import { FunctionComponent } from 'react';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';

export const PortfolioAnalytics: FunctionComponent<
  Pick<
    z.infer<typeof MetricsResponseSchema>,
    'totalActiveMerchants' | 'addedMerchantsCount' | 'removedMerchantsCount'
  >
> = ({ totalActiveMerchants, addedMerchantsCount, removedMerchantsCount }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Total Active Merchants</h2>
              <p className="text-3xl font-bold">
                {Intl.NumberFormat('en').format(totalActiveMerchants)}
              </p>
              <p className="text-sm text-muted-foreground">
                Merchants currently subscribed to monitoring
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">New Merchants</h2>
              <p className="text-3xl font-bold">
                {addedMerchantsCount > 0
                  ? `+${Intl.NumberFormat('en').format(addedMerchantsCount)}`
                  : 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Merchants added within the selected time range
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Merchants Removed</h2>
              <p className="text-3xl font-bold">
                {Intl.NumberFormat('en').format(removedMerchantsCount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Merchants removed from monitoring within the selected time range
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
