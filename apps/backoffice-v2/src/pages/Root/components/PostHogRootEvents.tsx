// https://posthog.com/tutorials/single-page-app-pageviews#tracking-pageviews-in-react-router
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { env } from '@/common/env/env';

export const PostHogPageView = () => {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        environment: env.VITE_ENVIRONMENT_NAME,
      });
    }
  }, [posthog, location]);

  return null;
};
