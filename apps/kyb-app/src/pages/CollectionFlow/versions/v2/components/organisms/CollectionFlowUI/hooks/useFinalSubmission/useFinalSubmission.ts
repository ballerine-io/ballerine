import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { finalSubmissionRequest } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { CollectionFlowEvents } from '@/hooks/useFlowTracking/enums';
import { useLanguage } from '@/hooks/useLanguage';
import { useRedirectUrls } from '@/hooks/useRedirectUrls/useRedirectUrls';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { getOrderedSteps } from '@ballerine/common';
import { useCallback, useMemo, useState } from 'react';

export const useFinalSubmission = <TValues extends object = CollectionFlowContext>(
  context: TValues,
  state: string,
) => {
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const language = useLanguage();
  const { data: schema } = useUISchemasQuery(language);
  const redirectUrls = useRedirectUrls();
  const { stateApi } = useStateManagerContext();
  const { trackEvent } = useFlowTracking();

  const collectionFlowSteps = useMemo(
    () =>
      schema
        ? getOrderedSteps(schema.definition.definition, {
            finalStates: ['done', 'completed', 'failed'],
          })
        : [],
    [schema],
  );

  const isFinalSubmissionAvailable = useMemo(() => state === collectionFlowSteps.at(-1), [state]);

  const handleFinalSubmission = useCallback(
    async (values?: CollectionFlowContext) => {
      try {
        await finalSubmissionRequest(values);

        setIsFinalSubmitted(true);
        trackEvent(CollectionFlowEvents.FLOW_COMPLETED);

        if (redirectUrls?.success) {
          location.href = redirectUrls.success;
          return;
        }

        await stateApi.sendEvent('NEXT');
        await stateApi.sendEvent('COMPLETED');
      } catch (error) {
        trackEvent(CollectionFlowEvents.FLOW_FAILED);
        throw error;
      }
    },
    [stateApi, redirectUrls, trackEvent],
  );

  return {
    isFinalSubmissionAvailable,
    isFinalSubmitted,
    handleFinalSubmission,
  };
};
