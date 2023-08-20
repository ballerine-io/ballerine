import { parseBase64FileWithMetadata } from '@app/common/utils/parse-base64-file-with-metadata';
import { Document } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { getFilesId } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-file-ids';
import { base64ToFile } from '@ballerine/ui';

export const selectDocuments = async (
  { flowData }: WorkflowFlowData,
  documents: Document[],
): Promise<Document[]> => {
  const { companyDocuments } = flowData;

  try {
    const files = [
      parseBase64FileWithMetadata(companyDocuments?.addressProof),
      parseBase64FileWithMetadata(companyDocuments?.registrationCertificate),
      parseBase64FileWithMetadata(companyDocuments?.bankStatement),
      parseBase64FileWithMetadata(companyDocuments?.companyStructure),
    ];

    if (!files.every(Boolean)) return [];

    const [
      proofOfAddressFileData,
      registrationDocumentFileData,
      bankStatementFileData,
      companyStructureFileData,
    ] = files;

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

    return [
      {
        fileId: proofOfAddressFileId,
        properties: {
          userAddress: buildCompanyAddress(flowData.headquarters),
        },
        type: 'water_bill',
        category: 'proof_of_address',
      },
      {
        fileId: registrationDocumentFileId,
        type: 'certificate_of_incorporation',
        category: 'registration_document',
        properties: {
          companyName: flowData?.companyInformation?.companyName,
          country: getFullCountryNameByCode(flowData?.companyInformation?.companyCountry || ''),
          state: flowData?.companyInformation.state,
          vat: flowData?.companyInformation.vat,
          companyType: flowData?.companyInformation.companyType,
          establishmentDate: flowData?.companyInformation.registrationDate,
        },
      },
      {
        type: 'bank_statement',
        category: 'proof_of_bank_account',
        fileId: bankStatementFileId,
        properties: {
          country: flowData?.bankInformation.country,
          name: flowData?.bankInformation.bankName,
          holderName: flowData?.bankInformation.holder,
          accountNumber: flowData?.bankInformation.account,
          currency: flowData?.bankInformation.currency,
        },
      },
      {
        type: 'shareholders',
        category: 'company_structure',
        fileId: companyStructureFileId,
        properties:
          flowData?.ubos.shareholders && flowData?.ubos.shareholders.length
            ? {
                firstName: flowData?.ubos.shareholders.at(-1).name.firstName,
                lastName: flowData?.ubos.shareholders.at(-1).name.lastName,
              }
            : {},
      },
    ].map(doc => {
      const existingDocument = documents.find(
        existingDocument =>
          existingDocument.type === doc.type && existingDocument.category === doc.category,
      );
      if (existingDocument) {
        return {
          ...doc,
          id: existingDocument.id,
        };
      }

      return doc;
    });
  } catch (error) {
    console.log('error', error);
    return [];
  }
};
