import { FunctionComponent, lazy, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PostHogPageView } from './components/PostHogRootEvents';

import { BallerineLogo } from '@/common/components/atoms/icons';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { WelcomeModal } from '@/common/components/molecules/WelcomeModal/WelcomeModal';
import { Providers } from '@/common/components/templates/Providers/Providers';
import { env } from '@/common/env/env';
import { useMobileBreakpoint } from '@/common/hooks/useMobileBreakpoint/useMobileBreakpoint';
import Chatbot from '@/domains/chat/chatbot-opengpt';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

const ReactQueryDevtools = lazy(() =>
  process.env.NODE_ENV !== 'production'
    ? import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
);

const ChatbotLayout: FunctionComponent = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const toggleIsWebchatOpen = () => {
    setIsWebchatOpen(prevState => !prevState);
  };

  if (isLoadingCustomer) {
    return <FullScreenLoader />;
  }

  if (!customer?.features?.chatbot?.enabled) {
    return null;
  }

  const botpressClientId = customer?.features?.chatbot?.clientId || env.VITE_BOTPRESS_CLIENT_ID;

  return (
    <Chatbot
      isWebchatOpen={isWebchatOpen}
      toggleIsWebchatOpen={toggleIsWebchatOpen}
      botpressClientId={botpressClientId}
    />
  );
};

export const Root: FunctionComponent = () => {
  const { isMobile } = useMobileBreakpoint();

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-8 text-center">
        <BallerineLogo />
        <h2>If you’re on a mobile device, please switch to a desktop for the best experience.</h2>
      </div>
    );
  }

  return (
    <Providers>
      <Outlet />
      <PostHogPageView />
      <ChatbotLayout />
      <WelcomeModal />
    </Providers>
  );
};
