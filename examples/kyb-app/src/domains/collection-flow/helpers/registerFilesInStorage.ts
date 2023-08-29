import { FilePayload } from '@app/domains/collection-flow/helpers/downloadAndBuildFiles';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';

export const registerFilesInStorage = (filesPayload: FilePayload[]) => {
  filesPayload.forEach(filePayload => {
    if (!filePayload.file) return;

    collectionFlowFileStorage.registerFile(filePayload.fileId, filePayload.file);
  });
};
