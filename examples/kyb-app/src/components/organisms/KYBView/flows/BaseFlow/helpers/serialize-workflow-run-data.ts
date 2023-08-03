import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { getFilesId } from '@app/components/organisms/KYBView/helpers/get-file-ids';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { WorkflowUpdatePayload } from '@app/domains/workflows/types';
import { base64ToFile } from '@ballerine/ui';
import { v4 as uuidv4 } from 'uuid';

export const serializeWorkflowRunData = async (
  context: WorkflowFlowData,
): Promise<WorkflowUpdatePayload> => {
  const { endUserId, businessId } = context.shared;
  const {
    businessAddress,
    businessInformation,
    personal: personalInformation,
    ubos,
    documents,
  } = context.flowData;

  const proofOfAddressFileData = parseBase64FileWithMetadata(documents.addressProof);
  const registrationDocumentFileData = parseBase64FileWithMetadata(
    documents.registrationCertificate,
  );

  const [proofOfAddressFileId, registrationDocumentFileId] = await getFilesId([
    await base64ToFile(
      proofOfAddressFileData.file,
      proofOfAddressFileData.name,
      proofOfAddressFileData.type,
    ),
    await base64ToFile(
      registrationDocumentFileData.file,
      registrationDocumentFileData.name,
      registrationDocumentFileData.type,
    ),
  ]);

  const data: WorkflowUpdatePayload = {
    workflowId: import.meta.env.VITE_KYB_DEFINITION_ID as string,
    endUserId,
    businessId,
    entity: {
      type: 'business',
      website: businessInformation.website,
      companyName: personalInformation.companyName,
      address: businessAddress.address,
      country: businessAddress.country,
      registrationNumber: businessInformation.registrationNumber,
      mainRepresentative: context.flowData.personal,
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
