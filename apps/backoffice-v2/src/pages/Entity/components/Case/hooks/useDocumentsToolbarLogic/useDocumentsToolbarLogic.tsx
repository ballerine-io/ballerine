import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { BroadcastChannel } from 'broadcast-channel';
import { CommunicationChannelEvent, CommunicationChannel } from '@/common/enums';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';

interface IUseDocumentsToolbarProps {
  imageId: string;
  hideOpenExternalButton?: boolean;
  onOpenDocumentInNewTab: (id: string) => void;
}

export const useDocumentsToolbarLogic = ({
  imageId,
  hideOpenExternalButton,
  onOpenDocumentInNewTab,
}: IUseDocumentsToolbarProps) => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: workflowId, filterId });

  const broadcastChannel = useMemo(
    () =>
      new BroadcastChannel(CommunicationChannel.OPEN_DOCUMENT_IN_NEW_TAB, {
        webWorkerSupport: false,
      }),
    [],
  );

  const isDocumentTabOpen = useRef(false);

  const handler = useCallback(({ type }: { type: keyof typeof CommunicationChannelEvent }) => {
    if (type === CommunicationChannelEvent.OPEN_DOCUMENT_IN_NEW_TAB_ACK) {
      isDocumentTabOpen.current = true;
    }
  }, []);

  useLayoutEffect(() => {
    if (hideOpenExternalButton) {
      return;
    }

    broadcastChannel.addEventListener('message', handler);

    return () => {
      broadcastChannel.removeEventListener('message', handler);
    };
  }, [broadcastChannel, handler, hideOpenExternalButton]);

  const onOpenInNewTabClick = useCallback(() => {
    broadcastChannel.postMessage({
      type: CommunicationChannelEvent.OPEN_DOCUMENT_IN_NEW_TAB,
      data: { entityId: workflow?.id, documentId: imageId },
    });

    setTimeout(() => {
      if (isDocumentTabOpen.current) {
        isDocumentTabOpen.current = false;

        return;
      }

      onOpenDocumentInNewTab(imageId);
    }, 100);
  }, [broadcastChannel, imageId, onOpenDocumentInNewTab, workflow?.id]);

  return { onOpenInNewTabClick };
};
