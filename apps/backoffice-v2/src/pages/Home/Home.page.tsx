import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { WelcomeCard } from '@/pages/Home/components/WelcomeCard/WelcomeCard';

export const Home: FunctionComponent = () => {
  const { firstName, fullName, avatarUrl, isLoadingCustomer, isExample, isDemo } = useHomeLogic();

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  return (
    <DemoAccessWrapper firstName={firstName} fullName={fullName} avatarUrl={avatarUrl}>
      <div className={`p-10 pt-0`}>
        {(isDemo || isExample) && <Outlet />}
        {!isDemo && !isExample && <WelcomeCard />}
      </div>
    </DemoAccessWrapper>
  );
};
