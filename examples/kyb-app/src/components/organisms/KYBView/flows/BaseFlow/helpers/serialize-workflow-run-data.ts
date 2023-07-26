import { base64ToFile } from '@app/common/utils/base64-to-file';
import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { getFilesId } from '@app/components/organisms/KYBView/helpers/get-file-ids';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { RunWorkflowDto } from '@app/domains/workflows/types';
import { v4 as uuidv4 } from 'uuid';

export const serializeWorkflowRunData = async (
  context: WorkflowFlowData,
): Promise<RunWorkflowDto> => {
  const { endUserId, businessId } = context.shared;
  const { businessAddress, businessInformation, personalInformation, ubos, documents } =
    context.flowData;

  const proofOfAddressFileData = parseBase64FileWithMetadata(documents.addressProof);
  const registrationDocumentFileData = parseBase64FileWithMetadata(
    documents.registrationCertificate,
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

  const data: RunWorkflowDto = {
    workflowId: import.meta.env.VITE_KYB_DEFINITION_ID as string,
    endUserId,
    businessId,
    entity: {
      type: 'business',
      website: businessInformation.website,
      companyName: personalInformation.companyName,
      address: businessAddress.address,
      registrationNumber: businessInformation.registrationNumber,
      customerCompany: 'Ballerine',
      ubos: (Array.from(ubos) || []).map(({ firstName, lastName, email }) => ({
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
