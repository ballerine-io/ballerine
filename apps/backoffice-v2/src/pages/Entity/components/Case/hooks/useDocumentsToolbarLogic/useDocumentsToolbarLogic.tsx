import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useEntity } from '@/pages/Entity/hooks/useEntity/useEntity';
import { BroadcastChannel } from 'broadcast-channel';

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
      new BroadcastChannel('openImageInNewTab', {
        webWorkerSupport: false,
      }),
    [],
  );

  const isDocumentTabOpen = useRef(false);

  const handler = useCallback(({ type }: { type: string }) => {
    if (type === 'openImageInNewTabAck') {
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
      type: 'openImageInNewTab',
      data: { entityId: workflow?.id, documentId: imageId },
    });

    setTimeout(() => {
      if (isDocumentTabOpen.current) {
        isDocumentTabOpen.current = false;
      } else {
        onOpenDocumentInNewTab(imageId);
      }
    }, 100);
  }, [broadcastChannel, imageId, onOpenDocumentInNewTab, workflow?.id]);

  return { onOpenInNewTabClick };
};
