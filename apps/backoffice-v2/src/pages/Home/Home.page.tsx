import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';

export const Home: FunctionComponent = () => {
  const { firstName, fullName, avatarUrl, isLoadingCustomer } = useHomeLogic();

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  return (
    <DemoAccessWrapper firstName={firstName} fullName={fullName} avatarUrl={avatarUrl}>
      <div className={`p-10 pt-0`}>
        <Outlet />
      </div>
    </DemoAccessWrapper>
  );
};
