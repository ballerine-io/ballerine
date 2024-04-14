import React, { FunctionComponent, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';

export const Home: FunctionComponent = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const { firstName, fullName, avatarUrl } = session?.user || {};
  const isAuthenticated = useIsAuthenticated();
  const { locale } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = pathname.includes('workflows') ? 'workflows' : 'statistics';

  useEffect(() => {
    if (pathname === `/${locale}`) {
      navigate('/en/statistics');
    }
  }, [pathname]);

  return (
    <div className={`flex flex-col gap-10 p-10`}>
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
      <div>
        <Tabs defaultValue={value}>
          <TabsList>
            <TabsTrigger asChild={true} value="statistics">
              <NavLink to={`/${locale}/statistics`}>Statistics</NavLink>
            </TabsTrigger>
            <TabsTrigger asChild={true} value="workflows">
              <NavLink to={`/${locale}/workflows`}>Workflows</NavLink>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={value}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
