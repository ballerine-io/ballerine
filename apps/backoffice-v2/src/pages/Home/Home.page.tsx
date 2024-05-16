import React, { FunctionComponent } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';

export const Home: FunctionComponent = () => {
  const {
    handleDateRangeChange,
    from,
    to,
    t,
    firstName,
    fullName,
    avatarUrl,
    statisticsLink,
    workflowsLink,
    defaultTabValue,
  } = useHomeLogic();

  return (
    <div className={`flex flex-col gap-10 p-10`}>
      <div className={`flex items-center justify-between`}>
        <div className={`flex items-center`}>
          <UserAvatar
            fullName={fullName ?? ''}
            className={`mr-2 d-6`}
            avatarUrl={avatarUrl ?? undefined}
          />
          <h3 className={`flex max-w-[45ch] break-all text-2xl font-semibold`}>
            {t(`home.greeting`)}
            {firstName && ` ${firstName}`}
          </h3>
        </div>
        <DateRangePicker
          onChange={handleDateRangeChange}
          value={{ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined }}
        />
      </div>
      <div>
        <Tabs defaultValue={defaultTabValue} key={defaultTabValue}>
          <TabsList>
            <TabsTrigger asChild={true} value={statisticsLink}>
              <NavLink to={statisticsLink}>Statistics</NavLink>
            </TabsTrigger>
            <TabsTrigger asChild={true} value={workflowsLink}>
              <NavLink to={workflowsLink}>Workflows</NavLink>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={defaultTabValue}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
