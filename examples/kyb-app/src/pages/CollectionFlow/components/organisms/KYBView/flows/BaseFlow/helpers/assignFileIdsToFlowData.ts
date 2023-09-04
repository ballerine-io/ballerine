import { DocumentConfiguration } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';
import { traverseObjectAndSetValue } from '@app/utils/traverse-object-and-set-value';
import cloneDeep from 'lodash/cloneDeep';

export const assignFileIdsToFlowData = (
  flowData: WorkflowFlowData,
  documentConfigurations: DocumentConfiguration[],
) => {
  const flowDataCopy = cloneDeep(flowData);

  documentConfigurations.forEach(config => {
    if (config.type !== 'file') return;

    const file = traverseObjectAndPickValue(config.name, flowData);

    if (!(file instanceof File)) {
      return;
    }

    traverseObjectAndSetValue(config.name, collectionFlowFileStorage.getFileId(file), flowDataCopy);
  });

  return flowDataCopy;
};
