import { FunctionComponent, lazy, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { WelcomeModal } from '@/common/components/molecules/WelcomeModal/WelcomeModal';
import { Providers } from '@/common/components/templates/Providers/Providers';
import { env } from '@/common/env/env';
import Chatbot from '@/domains/chat/chatbot-opengpt';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useMobileWarning } from './hooks/useMobileWarning/useMobileWarning';

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
  useMobileWarning();

  return (
    <Providers>
      <Outlet />
      <ChatbotLayout />
      <WelcomeModal />
    </Providers>
  );
};
