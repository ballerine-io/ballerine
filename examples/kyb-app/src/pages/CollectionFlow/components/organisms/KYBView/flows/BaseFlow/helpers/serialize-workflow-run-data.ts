import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFilesId } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-file-ids';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { WorkflowUpdatePayload } from '@app/domains/workflows/types';
import { base64ToFile } from '@ballerine/ui';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@app/hooks/useSignin';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';

export const serializeWorkflowRunData = async (
  context: WorkflowFlowData,
  user: User,
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
      country: getFullCountryNameByCode(companyInformation.companyCountry),
      registrationNumber: companyInformation.registrationNumber,
      mainRepresentative: context.flowData.personalInformation,
      customerCompany: 'Ballerine',
      birthDate: personalInformation.birthDate,
      email: user.email,
      additionalInfo: {
        company: {
          vat: companyInformation.vat,
          type: companyInformation.companyType,
          incorporationDate: +companyInformation.registrationDate,
          industry: companyActivity.industry,
          model: companyActivity.model,
          state: companyInformation.state,
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
            dateOfBirth: new Date(+birthDate).toISOString(),
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
        properties: {
          userAddress: buildCompanyAddress(headquarters),
        },
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
        properties: {
          companyName: companyInformation.companyName,
          country: getFullCountryNameByCode(companyInformation.companyCountry),
          state: companyInformation.state,
          vat: companyInformation.vat,
          companyType: companyInformation.companyType,
          establishmentDate: new Date(companyInformation.registrationDate),
        },
      },
      {
        country: 'GH',
        type: 'bank_statement',
        category: 'proof_of_address',
        pages: [{ fileId: bankStatementFileId }],
        properties: {
          country: bankInformation.country,
          name: bankInformation.bankName,
          holderName: bankInformation.holder,
          accountNumber: bankInformation.account,
          currency: bankInformation.currency,
        },
      },
      {
        country: 'GH',
        type: 'shareholders',
        category: 'company_structure',
        pages: [{ fileId: companyStructureFileId }],
        properties:
          ubos.shareholders && ubos.shareholders.length
            ? {
                firstName: ubos.shareholders.at(-1).name.firstName,
                lastName: ubos.shareholders.at(-1).name.lastName,
              }
            : {},
      },
    ],
  };

  return data;
};
