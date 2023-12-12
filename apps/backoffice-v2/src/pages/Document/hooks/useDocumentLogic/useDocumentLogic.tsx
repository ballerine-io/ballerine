import { toTitleCase } from 'string-ts';
import { BroadcastChannel } from 'broadcast-channel';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';

export const useDocumentLogic = () => {
  const { state } = useLocation();
  const filterId = useFilterId();
  const navigate = useNavigate();
  const { entityId, documentId, locale = 'en' } = useParams();

  const broadcastChannel = useMemo(
    () =>
      new BroadcastChannel('openImageInNewTab', {
        webWorkerSupport: false,
      }),
    [],
  );

  const handler = useCallback(
    ({
      type,
      data: { entityId, documentId },
    }: {
      type: string;
      data: { entityId: string; documentId: string };
    }) => {
      if (type === 'openImageInNewTab') {
        navigate(
          `/${locale}/case-management/entities/${entityId}/document/${documentId}?filterId=${filterId}`,
          {
            replace: true,
            state: {
              from: state?.from,
            },
          },
        );
      }

      broadcastChannel.postMessage({ type: 'openImageInNewTabAck' });
    },
    [broadcastChannel, filterId, navigate],
  );

  useLayoutEffect(() => {
    broadcastChannel.addEventListener('message', handler);

    return () => {
      broadcastChannel.removeEventListener('message', handler);
    };
  }, [broadcastChannel, handler]);

  const { data: workflow, isLoading: isLoadingWorkflow } = useWorkflowQuery({
    workflowId: entityId,
    filterId,
  });

  const document = useMemo(
    () =>
      workflow?.context?.documents.find(doc =>
        doc.pages.some(({ ballerineFileId }) => ballerineFileId === documentId),
      ),
    [documentId, workflow?.context?.documents],
  );

  const page = useMemo(
    () =>
      workflow?.context?.documents
        ?.flatMap(({ pages }) => pages)
        ?.find(({ ballerineFileId }) => ballerineFileId === documentId),
    [documentId, workflow?.context?.documents],
  );

  const fileIds = useMemo(
    () =>
      workflow?.context?.documents
        ?.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId))
        .filter(id => id === documentId),
    [documentId, workflow?.context?.documents],
  );

  const files = useStorageFilesQuery(fileIds);

  const title = useMemo(
    () =>
      `${valueOrNA(toTitleCase(document?.category ?? ''))} - ${valueOrNA(
        toTitleCase(document?.type ?? ''),
      )}${page?.metadata?.side ? ` - ${page?.metadata?.side}` : ''}`,
    [document, page],
  );

  const isLoading = isLoadingWorkflow || files.some(file => file.isLoading);

  return {
    isLoading,
    documents: [
      {
        title,
        fileType: page?.type,
        id: fileIds?.[0] as string,
        imageUrl: files?.[0]?.data as string,
      },
    ],
  };
};
