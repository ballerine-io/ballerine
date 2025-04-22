import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { CommunicationChannel, CommunicationChannelEvent } from '@/common/enums';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { BroadcastChannel } from 'broadcast-channel';
import { useParams } from 'react-router-dom';

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
  const { data: workflow } = useWorkflowByIdQuery({ workflowId: workflowId ?? '' });

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
