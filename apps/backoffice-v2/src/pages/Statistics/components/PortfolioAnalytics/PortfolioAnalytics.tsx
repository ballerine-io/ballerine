import { z } from 'zod';
import { ComponentProps, FunctionComponent } from 'react';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

const MerchantsStatsCard: FunctionComponent<{
  prefix?: string;
  count: number;
  title: string;
  description: string;
}> = ({ prefix = '', count, title, description }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-3xl font-bold">
          {count > 0 ? `${prefix}${Intl.NumberFormat('en').format(count)}` : 0}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const PortfolioAnalyticsContent: FunctionComponent<ComponentProps<typeof PortfolioAnalytics>> = ({
  totalActiveMerchants,
  addedMerchantsCount,
  removedMerchantsCount,
}) => {
  const { data: customer } = useCustomerQuery();

  if (!customer?.config?.isMerchantMonitoringEnabled) {
    return (
      <MerchantsStatsCard
        prefix="+"
        count={addedMerchantsCount}
        title="New Merchants"
        description="Merchants added within the selected time range"
      />
    );
  }

  return (
    <>
      <MerchantsStatsCard
        count={totalActiveMerchants}
        title="Total Active Merchants"
        description="Merchants currently subscribed to monitoring"
      />

      <MerchantsStatsCard
        prefix="+"
        count={addedMerchantsCount}
        title="New Merchants"
        description="Merchants added within the selected time range"
      />

      <MerchantsStatsCard
        count={removedMerchantsCount}
        title="Merchants Removed"
        description="Merchants removed from monitoring within the selected time range"
      />
    </>
  );
};

export const PortfolioAnalytics: FunctionComponent<
  Pick<
    z.infer<typeof MetricsResponseSchema>,
    'totalActiveMerchants' | 'addedMerchantsCount' | 'removedMerchantsCount'
  >
> = props => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
      <div className="grid grid-cols-4 gap-6">
        <PortfolioAnalyticsContent {...props} />
      </div>
    </div>
  );
};
