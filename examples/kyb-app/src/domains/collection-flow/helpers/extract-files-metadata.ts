import { isFileId } from '@app/domains/collection-flow/helpers/is-file-id';
import { DocumentConfiguration, FlowData } from '@app/domains/collection-flow/types';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';

export type FilePropertyKey = string;

export interface WorkflowFileMetadata {
  fieldName: FilePropertyKey;
  fileId: string;
  file: File | null;
}

export const extractFilesMetadata = (
  flowData: FlowData,
  config: DocumentConfiguration[],
): WorkflowFileMetadata[] => {
  const filesMetadata = config.reduce((filesPayload, config) => {
    const value = traverseObjectAndPickValue(config.name, flowData, null) as unknown;

    if (isFileId(value)) {
      filesPayload[config.name] = {
        fieldName: config.name,
        fileId: value,
        file: null,
      };

      return filesPayload;
    }

    return filesPayload;
  }, {} as Record<FilePropertyKey, WorkflowFileMetadata>);

  return Object.values(filesMetadata);
};
