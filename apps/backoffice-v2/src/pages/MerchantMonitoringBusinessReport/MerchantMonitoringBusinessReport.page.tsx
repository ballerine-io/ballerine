import dayjs from 'dayjs';
import { titleCase } from 'string-ts';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import React, { FunctionComponent } from 'react';
import { Badge, TextWithNAFallback } from '@ballerine/ui';

import { ctw } from '@/common/utils/ctw/ctw';
import { Notes } from '@/domains/notes/Notes';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { Button } from '@/common/components/atoms/Button/Button';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { NotesButton } from '@/common/components/molecules/NotesButton/NotesButton';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';
import { SidebarInset, SidebarProvider } from '@/common/components/organisms/Sidebar/Sidebar';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    activeTab,
    notes,
    isNotesOpen,
  } = useMerchantMonitoringBusinessReportLogic();

  return (
    <SidebarProvider
      open={isNotesOpen}
      style={{
        '--sidebar-width': '25rem',
        '--sidebar-width-mobile': '20rem',
      }}
    >
      <SidebarInset>
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
          <div className={`flex items-center space-x-8 pb-4`}>
            <div className={`flex items-center`}>
              <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
              <Badge
                variant={
                  statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]
                    ?.variant
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
                {statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]
                  ?.text ?? titleCase(businessReport?.status ?? '')}
              </Badge>
            </div>
            <div>
              <span className={`me-2 text-sm leading-6 text-slate-400`}>Created at</span>
              {businessReport?.createdAt &&
                dayjs(new Date(businessReport?.createdAt)).format('HH:mm MMM Do, YYYY')}
            </div>
            <NotesButton numberOfNotes={notes?.length} />
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
      </SidebarInset>
      <Notes
        notes={notes ?? []}
        noteData={{
          entityId: businessReport?.merchantId || '',
          entityType: `Business`,
          noteableId: businessReport?.id || '',
          noteableType: `Report`,
        }}
      />
    </SidebarProvider>
  );
};
