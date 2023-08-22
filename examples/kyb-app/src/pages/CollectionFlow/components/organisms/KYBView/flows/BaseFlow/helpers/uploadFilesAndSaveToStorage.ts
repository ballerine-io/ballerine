import { DocumentConfiguration } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { getFilesId } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-file-ids';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';

export async function uploadFilesAndSaveToStorage(
  filesConfigurations: DocumentConfiguration[],
  { flowData }: WorkflowFlowData,
) {
  const files = filesConfigurations.map(config =>
    traverseObjectAndPickValue(config.name, flowData, null),
  );

  let fileIds: string[] = [];

  for (let i = 0; i < filesConfigurations.length; i++) {
    const file = files[i];

    if (!(file instanceof File)) continue;
    const fileId = collectionFlowFileStorage.getFileId(file) || (await getFilesId(file));
    fileIds.push(fileId);
  }

  filesConfigurations.forEach((_, index) => {
    const fileId = fileIds[index];
    const file = files[index];

    if (!file || !(file instanceof File)) return;

    collectionFlowFileStorage.registerFile(fileId, file);
  });
}
