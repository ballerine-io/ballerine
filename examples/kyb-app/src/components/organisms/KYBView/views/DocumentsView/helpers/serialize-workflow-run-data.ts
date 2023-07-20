import { base64ToFile } from '@app/common/utils/base64-to-file';
import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { getFilesId } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/get-file-ids';
import { RunWorkflowDto } from '@app/domains/workflows/types';
import { v4 as uuidv4 } from 'uuid';

export const serializeWorkflowRunData = async (context: KYBContext): Promise<RunWorkflowDto> => {
  const proofOfAddressFileData = parseBase64FileWithMetadata(
    context.documents.documents.addressProof,
  );
  const registrationDocumentFileData = parseBase64FileWithMetadata(
    context.documents.documents.registrationCertificate,
  );

  const [proofOfAddressFileId, registrationDocumentFileId] = await getFilesId([
    base64ToFile(
      proofOfAddressFileData.file,
      proofOfAddressFileData.name,
      proofOfAddressFileData.type,
    ),
    base64ToFile(
      registrationDocumentFileData.file,
      registrationDocumentFileData.name,
      registrationDocumentFileData.type,
    ),
  ]);

  const { endUserId, businessId } = context.shared;

  const data: RunWorkflowDto = {
    workflowId: import.meta.env.VITE_KYB_DEFINITION_ID as string,
    endUserId,
    businessId,
    entity: {
      type: 'business',
      website: context.documents.information.website,
      companyName: context.personalInformation.companyName,
      address: context.documents.address.address,
      registrationNumber: context.documents.information.registrationNumber,
      customerCompany: 'Ballerine',
      ubos: context.documents.shareholders.map(({ firstName, lastName, email }) => ({
        entity: {
          type: 'individual',
          id: uuidv4(),
          data: {
            firstName,
            lastName,
            email,
          },
        },
      })),
    },
    documents: [
      {
        country: 'GH',
        type: 'utility_bill',
        category: 'proof_of_address',
        pages: [
          {
            fileId: proofOfAddressFileId,
          },
        ],
      },
      {
        country: 'GH',
        type: 'certificate_of_incorporation',
        category: 'registration_document',
        pages: [
          {
            fileId: registrationDocumentFileId,
          },
        ],
      },
    ],
  };

  return data;
};
