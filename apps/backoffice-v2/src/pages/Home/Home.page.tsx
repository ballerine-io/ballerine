import React, { FunctionComponent, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';

export const Home: FunctionComponent = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};
  const locale = useLocale();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { handleDateRangeChange, from, to } = useHomeLogic();

  useEffect(() => {
    if (pathname !== `/${locale}` && pathname !== `/${locale}/home`) {
      return;
    }

    navigate(`/${locale}/home/statistics`);
  }, [pathname, locale, navigate]);

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
          className={undefined}
        />
      </div>
      <div>
        <Tabs defaultValue={pathname} key={pathname}>
          <TabsList>
            <TabsTrigger asChild={true} value={`/${locale}/home/statistics`}>
              <NavLink to={`/${locale}/home/statistics`}>Statistics</NavLink>
            </TabsTrigger>
            <TabsTrigger asChild={true} value={`/${locale}/home/workflows`}>
              <NavLink to={`/${locale}/home/workflows`}>Workflows</NavLink>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={pathname}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
