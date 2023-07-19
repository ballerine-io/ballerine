import { FileStorage } from '@app/common/utils/file-storage';
import { getFilesId } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/get-file-ids';
import { createPageFieldName } from '@app/components/organisms/KYBView/views/RevisionView/helpers/page-utils';
import { RunWorkflowDto, Workflow } from '@app/domains/workflows/types';
import { AnyObject } from '@ballerine/ui';

type FileIdsByDocumentType = Record<string, Record<string, string>>;

const transformFormDataFileRefsToFileIds = async (
  formData: Record<string, AnyObject>,
  storage: FileStorage,
): Promise<FileIdsByDocumentType> => {
  const pendingFiles = Object.entries(formData).reduce(
    (object, [documentType, documentFileRefs]) => {
      object[documentType] = Object.entries(documentFileRefs).reduce((refs, [key, fileRef]) => {
        const file = storage.get(fileRef as string);
        refs[key] = getFilesId(file) as Promise<string>;

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

export const buildRunPayload = async (
  workflow: Workflow,
  formData: Record<string, AnyObject>,
  storage: FileStorage,
): Promise<RunWorkflowDto> => {
  const formDataWithFileIds = await transformFormDataFileRefsToFileIds(formData, storage);

  const payload: RunWorkflowDto = {
    workflowId: workflow.workflowDefinitionId,
    businessId: workflow.businessId,
    endUserId: workflow.endUserId,
    entity: {
      type: 'business',
      website: workflow.context.entity.data.website,
      companyName: workflow.context.entity.data.companyName,
      address: workflow.context.entity.data.address.text,
      registrationNumber: workflow.context.entity.data.registrationNumber,
      customerCompany: 'Ballerine',
      ubos: workflow.context.entity.data.additionalInfo?.ubos || [],
    },
    documents: workflow.context.documents.map(workflowDocument => {
      return {
        type: workflowDocument.type,
        category: workflowDocument.category,
        country: workflowDocument.issuer.country,
        pages: workflowDocument.pages.map((page, index) => {
          const pageName = createPageFieldName({ ...page, index });
          const documentPages = formDataWithFileIds[workflowDocument.type];
          const pageFileId = documentPages[pageName];

          return {
            fileId: pageFileId,
          };
        }),
      };
    }),
  };

  return payload;
};
