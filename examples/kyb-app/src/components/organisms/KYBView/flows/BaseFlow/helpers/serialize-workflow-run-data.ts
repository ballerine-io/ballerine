import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { buildCompanyAddress } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
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
    personalInformation,
    ubos,
    companyDocuments,
    companyInformation,
    companyActivity,
    headquarters,
    bankInformation,
  } = context.flowData;

  const [
    proofOfAddressFileData,
    registrationDocumentFileData,
    bankStatementFileData,
    companyStructureFileData,
  ] = [
    parseBase64FileWithMetadata(companyDocuments.addressProof),
    parseBase64FileWithMetadata(companyDocuments.registrationCertificate),
    parseBase64FileWithMetadata(companyDocuments.bankStatement),
    parseBase64FileWithMetadata(companyDocuments.companyStructure),
  ];

  const [
    proofOfAddressFileId,
    registrationDocumentFileId,
    bankStatementFileId,
    companyStructureFileId,
  ] = await getFilesId([
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
    await base64ToFile(
      bankStatementFileData.file,
      bankStatementFileData.name,
      bankStatementFileData.type,
    ),
    await base64ToFile(
      companyStructureFileData.file,
      companyStructureFileData.name,
      companyStructureFileData.type,
    ),
  ]);

  const data: WorkflowUpdatePayload = {
    workflowId: import.meta.env.VITE_KYB_DEFINITION_ID as string,
    endUserId,
    businessId,
    entity: {
      type: 'business',
      website: companyActivity.website,
      companyName: companyInformation.companyName,
      address: buildCompanyAddress(headquarters),
      country: companyInformation.companyCountry,
      registrationNumber: companyInformation.registrationNumber,
      mainRepresentative: context.flowData.personalInformation,
      customerCompany: 'Ballerine',
      birthDate: personalInformation.birthDate,
      email: context.flowData.signin.email,
      additionalInfo: {
        company: {
          vat: companyInformation.vat,
          type: companyInformation.companyType,
          incorporationDate: +companyInformation.registrationDate,
          industry: companyActivity.industry,
          model: companyActivity.model,
          estimateAnnualVolume: companyActivity.volumeAmount,
          averageTransactionValue: companyActivity.transactionValue,
        },
        headquarters: {
          state: headquarters.state,
          zip: headquarters.postalCode,
          phone: headquarters.phone,
          street: headquarters.street,
          country: headquarters.country,
          city: headquarters.city,
        },
        bank: {
          country: bankInformation.country,
          name: bankInformation.bankName,
          holder: bankInformation.holder,
          currencyCode: bankInformation.currency,
          accountNumber: bankInformation.account,
        },
        __kyb_snapshot: JSON.stringify(context),
      },
      ubos: (Array.from(ubos.shareholders) || []).map(({ name, email, birthDate, title }) => ({
        entity: {
          type: 'individual',
          id: uuidv4(),
          data: {
            firstName: name.firstName,
            lastName: name.lastName,
            email,
            dateOfBirth: +birthDate,
            additionalInfo: {
              role: title,
            },
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
      {
        country: 'GH',
        type: 'bank_statement',
        category: 'proof_of_address',
        pages: [{ fileId: bankStatementFileId }],
      },
      {
        country: 'GH',
        type: 'company_structure',
        category: 'financial_information',
        pages: [{ fileId: companyStructureFileId }],
      },
    ],
  };

  return data;
};
