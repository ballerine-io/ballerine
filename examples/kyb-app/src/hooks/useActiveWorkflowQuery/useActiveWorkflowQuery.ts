import {
  DocumentConfiguration,
  FlowData,
  collectionFlowQuerykeys,
} from '@app/domains/collection-flow';
import { fetchFile } from '@app/domains/storage/storage.api';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';
import { traverseObjectAndSetValue } from '@app/utils/traverse-object-and-set-value';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

export const useActiveWorkflowQuery = (documentConfigurations: DocumentConfiguration[]) => {
  const { user } = useSessionQuery();
  const [isLoading, setLoading] = useState(false);
  const { data: _flowData, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getFlowData({ endUserId: user?.id }),
    enabled: Boolean(user),
    staleTime: Infinity,
  });

  const [flowData, setFlowData] = useState(_flowData);

  useEffect(() => {
    if (!_flowData || isLoading) return;

    const filesOrIds = documentConfigurations.map(config =>
      traverseObjectAndPickValue(config.name, _flowData),
    );
    if (
      filesOrIds.every(
        file => file instanceof File || file === undefined || (file && !Object.keys(file).length),
      )
    )
      return;

    const loadFilesAndAssignToFlowData = async () => {
      setLoading(true);
      const filesPayload = await Promise.all(
        documentConfigurations.map(config => {
          const fileId = traverseObjectAndPickValue(config.name, _flowData, '') as any;

          if (!fileId) return Promise.resolve(null);
          if (fileId instanceof File) return Promise.resolve(null);
          if (fileId && !Object.keys(fileId).length) return Promise.resolve(null);

          return fetchFile(fileId);
        }),
      );

      documentConfigurations.forEach((config, index) => {
        const filePayload = filesPayload[index];
        if (!filePayload) return;

        const fileId = filePayload.id;

        const documentFile = new File(
          [''],
          filesPayload[index].fileNameInBucket || filesPayload[index].fileNameOnDisk,
          { type: 'text/plain' },
        );

        collectionFlowFileStorage.registerFile(fileId, documentFile);

        traverseObjectAndSetValue(config.name, documentFile, _flowData);
      });

      setFlowData({ ..._flowData });
      setLoading(false);
    };

    loadFilesAndAssignToFlowData().catch(() => setLoading(false));
  }, [documentConfigurations, flowData, isLoading]);

  console.log('FLOW DATA', flowData);

  return {
    flowData,
    isFetching: isFetching || isLoading,
    workflow: _flowData ? _flowData.workflow : null,
  };
};
