import { base64ToFile } from '@app/common/utils/base64-to-file';
import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { getFilesId } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/get-file-ids';
import { createPageFieldName } from '@app/components/organisms/KYBView/views/RevisionView/helpers/page-utils';
import { RunWorkflowDto, Workflow } from '@app/domains/workflows/types';
import { AnyObject } from '@ballerine/ui';

type FileIdsByDocumentType = Record<string, Record<string, string>>;

const transformFormDataFilesToFileIds = async (
  formData: Record<string, AnyObject>,
): Promise<FileIdsByDocumentType> => {
  const pendingFiles = Object.entries(formData).reduce(
    (object, [documentType, documentFileRefs]) => {
      object[documentType] = Object.entries(documentFileRefs).reduce((refs, [key, fileData]) => {
        const { type, name, file } = parseBase64FileWithMetadata(fileData as string);
        const fileElement = base64ToFile(file, name, type);
        refs[key] = getFilesId(fileElement) as Promise<string>;

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
): Promise<RunWorkflowDto> => {
  const formDataWithFileIds = await transformFormDataFilesToFileIds(formData);

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
