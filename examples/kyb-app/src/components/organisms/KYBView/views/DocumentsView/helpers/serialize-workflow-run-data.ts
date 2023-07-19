import { FileStorage } from '@app/common/utils/file-storage';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { getFilesId } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/get-file-ids';
import { RunWorkflowDto } from '@app/domains/workflows/types';

export const serializeWorkflowRunData = async (
  context: KYBContext,
  storage: FileStorage,
): Promise<RunWorkflowDto> => {
  const [proofOfAddressFileId, registrationDocumentFileId] = await getFilesId([
    storage.get(context.documents.documents.addressProof),
    storage.get(context.documents.documents.registrationCertificate),
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
