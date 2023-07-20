import { base64ToFile } from '@app/common/utils/base64-to-file';
import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { getFilesId } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/get-file-ids';
import { createPageFieldName } from '@app/components/organisms/KYBView/views/RevisionView/helpers/page-utils';
import { Workflow } from '@app/domains/workflows/types';
import { AnyObject } from '@ballerine/ui';
import cloneDeep from 'lodash/cloneDeep';

type FileIdsByDocumentType = Record<string, Record<string, string>>;

const transformFormDataFilesToFileIds = async (
  formData: Record<string, AnyObject>,
): Promise<FileIdsByDocumentType> => {
  const pendingFiles = Object.entries(formData).reduce(
    (object, [documentType, documentFileRefs]) => {
      object[documentType] = Object.entries(documentFileRefs).reduce((refs, [key, fileData]) => {
        const { type, name, file } = parseBase64FileWithMetadata(fileData as string);
        const fileElement = base64ToFile(file, name, type);
        refs[key] = getFilesId(fileElement).then(val => (refs[key] = val)) as Promise<string>;

        return refs;
      }, {});

      return object;
    },
    {} as FileIdsByDocumentType,
  );

  await Promise.all(
    Object.values(pendingFiles).reduce(
      (pendingList, files) => pendingList.concat(Object.values(files) as []),
      [] as Promise<string>[],
    ),
  );

  return pendingFiles;
};

export const buildUpdatePayload = async (
  _workflow: Workflow,
  formData: Record<string, AnyObject>,
): Promise<Workflow> => {
  const workflow = cloneDeep(_workflow);

  const formDataWithFileIds = await transformFormDataFilesToFileIds(formData);

  workflow.context.documents = workflow.context.documents.map(document => {
    const updatedDocumentPages = formDataWithFileIds[document.type];

    if (!updatedDocumentPages) return document;

    document.pages = document.pages.map((page, index) => {
      const pageName = createPageFieldName({ ...page, index });

      const updatedPageFileId = updatedDocumentPages[pageName];

      if (!updatedPageFileId) return page;

      return {
        ...page,
        ballerineFileId: updatedPageFileId,
      };
    });

    return document;
  });

  return workflow;
};
