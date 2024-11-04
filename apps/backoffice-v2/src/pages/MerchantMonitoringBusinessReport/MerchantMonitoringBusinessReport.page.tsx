import React, { FunctionComponent } from 'react';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/atoms/Button/Button';
import { Badge, TextWithNAFallback } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import dayjs from 'dayjs';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';
import { titleCase } from 'string-ts';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    activeTab,
  } = useMerchantMonitoringBusinessReportLogic();

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-4">
      <div>
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'mb-6 flex items-center space-x-px pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>Back</span>
        </Button>
      </div>
      <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
        {websiteWithNoProtocol}
      </TextWithNAFallback>
      <div className={`flex space-x-8`}>
        <div className={`flex items-center pb-4`}>
          <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
          <Badge
            variant={
              statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.variant
            }
            className={ctw(`text-sm font-bold`, {
              'bg-info/20 text-info':
                businessReport?.status === MERCHANT_REPORT_STATUSES_MAP.completed,
              'bg-violet-500/20 text-violet-500': [
                MERCHANT_REPORT_STATUSES_MAP['in-progress'],
                MERCHANT_REPORT_STATUSES_MAP['quality-control'],
              ].includes(businessReport?.status ?? ''),
            })}
          >
            {statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.text ??
              titleCase(businessReport?.status ?? '')}
          </Badge>
        </div>
        <div>
          <span className={`me-2 text-sm leading-6 text-slate-400`}>Created at</span>
          {businessReport?.createdAt &&
            dayjs(new Date(businessReport?.createdAt)).format('HH:mm MMM Do, YYYY')}
        </div>
      </div>
      <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
        <TabsList className={'mb-4'}>
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
        <ScrollArea orientation={'vertical'} className={'h-[75vh]'}>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </section>
  );
};
