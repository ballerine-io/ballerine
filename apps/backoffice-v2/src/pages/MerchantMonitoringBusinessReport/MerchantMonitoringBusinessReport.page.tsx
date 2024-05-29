import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/atoms/Button/Button';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { z } from 'zod';
import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import dayjs from 'dayjs';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      content: 'Summary content',
    },
    {
      label: "Website's Company",
      value: 'websitesCompany',
      content: 'Website content',
    },
    {
      label: 'Website Line of Business',
      value: 'lineOfBusiness',
      content: 'Line of Business content',
    },
    {
      label: 'Website Credibility',
      value: 'credibility',
      content: 'Credibility content',
    },
    {
      label: 'Ecosystem and Transactions',
      value: 'ecosystemAndTransactions',
      content: 'Ecosystem and Transactions content',
    },
    {
      label: 'Ads and Social Media',
      value: 'adsAndSocialMedia',
      content: 'Ads and Social Media content',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    value: string;
    content: ReactNode | ReactNode[];
  }>;
  const tabsValues = tabs.map(tab => tab.value);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab }] = useZodSearchParams(MerchantMonitoringBusinessReportSearchSchema);
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);
  const status = BusinessReportStatus.COMPLETED;
  const statusToBadgeData = {
    [BusinessReportStatus.COMPLETED]: { variant: 'info', text: 'Manual Review' },
    [BusinessReportStatus.IN_PROGRESS]: { variant: 'violet', text: 'In-progress' },
  };
  const createdAt = '2021-09-01T12:00:00Z';

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-4">
      <div>
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'mb-6 flex items-center space-x-[1px] pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>Back</span>
        </Button>
      </div>
      <h2 className="pb-4 text-2xl font-bold">ACME Corp.</h2>
      <div className={`flex space-x-8`}>
        <div className={`flex items-center pb-4`}>
          <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
          <Badge
            variant={statusToBadgeData[status].variant}
            className={ctw(`text-sm font-bold`, {
              'bg-info/20 text-info': status === BusinessReportStatus.COMPLETED,
            })}
          >
            {statusToBadgeData[status].text}
          </Badge>
        </div>
        <div>
          <span className={`me-2 text-sm leading-6 text-slate-400`}>Created at</span>
          {dayjs(new Date(createdAt)).format('HH:mm MMM Do, YYYY')}
        </div>
      </div>
      <Tabs defaultValue={activeTab} className="w-[400px]">
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link
                to={{
                  search: `?activeTab=${tab.value}`,
                }}
              >
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};
