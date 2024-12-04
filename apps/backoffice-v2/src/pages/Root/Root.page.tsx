import React, { FunctionComponent, lazy, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { ServerDownLayout } from './ServerDown.layout';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import Chatbot from '@/domains/chat/chatbot-opengpt';
import { RenderChildrenInIFrame } from '@/common/components/organisms/RenderChildrenInIFrame/RenderChildrenInIFrame';
import { ctw } from '@/common/utils/ctw/ctw';
import { env } from '@/common/env/env';

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
    <RenderChildrenInIFrame
      className={ctw('fixed bottom-right-0', {
        'h-[700px] w-[400px]': isWebchatOpen,
        'd-[80px]': !isWebchatOpen,
      })}
    >
      <Chatbot
        isWebchatOpen={isWebchatOpen}
        toggleIsWebchatOpen={toggleIsWebchatOpen}
        botpressClientId={botpressClientId}
      />
    </RenderChildrenInIFrame>
  );
};

export const Root: FunctionComponent = () => {
  return (
    <Providers>
      <ServerDownLayout>
        <Outlet />
      </ServerDownLayout>
      <ChatbotLayout />
      {/*<Suspense>*/}
      {/*  <ReactQueryDevtools  />*/}
      {/*</Suspense>*/}
    </Providers>
  );
};
