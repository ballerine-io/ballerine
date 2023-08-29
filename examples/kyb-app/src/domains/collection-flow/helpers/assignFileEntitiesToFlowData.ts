import { FlowData } from '@app/domains/collection-flow';
import { FilePayload } from '@app/domains/collection-flow/helpers/downloadAndBuildFiles';
import { traverseObjectAndSetValue } from '@app/utils/traverse-object-and-set-value';

export const assignFileEntitiesToFlowData = (filesPayload: FilePayload[], flowData: FlowData) => {
  filesPayload.forEach(filePayload => {
    traverseObjectAndSetValue(filePayload.fieldName, filePayload.file, flowData);
  });

  return flowData;
};
