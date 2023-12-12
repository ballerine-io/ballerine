import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useEntity } from '@/pages/Entity/hooks/useEntity/useEntity';
import { BroadcastChannel } from 'broadcast-channel';
import { CommunicationChannelEvent, CommunicationChannel } from '@/common/enums';

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
  const { workflow } = useEntity();

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
