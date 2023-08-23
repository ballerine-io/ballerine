import { Document, DocumentConfiguration } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';

type FileInputName = string;
interface FileHelpers {
  getProperties: (context: WorkflowFlowData) => object;
  fileType: string;
  fileCategory: string;
}

const fileHelpers: Record<FileInputName, FileHelpers> = {
  addressProof: {
    getProperties: ({ flowData }) => {
      return {
        userAddress: buildCompanyAddress(flowData.headquarters),
      };
    },
    fileType: 'water_bill',
    fileCategory: 'proof_of_address',
  },
  bankStatement: {
    getProperties: ({ flowData }) => {
      return {
        country: flowData?.bankInformation?.country,
        name: flowData?.bankInformation?.bankName,
        holderName: flowData?.bankInformation?.holder,
        accountNumber: flowData?.bankInformation?.account,
        currency: flowData?.bankInformation?.currency,
      };
    },
    fileType: 'bank_statement',
    fileCategory: 'proof_of_bank_account',
  },
  registrationCertificate: {
    getProperties: ({ flowData }) => {
      return {
        companyName: flowData?.companyInformation?.companyName,
        country: getFullCountryNameByCode(flowData?.companyInformation?.companyCountry || ''),
        state: flowData?.companyInformation?.state,
        vat: flowData?.companyInformation?.vat,
        companyType: flowData?.companyInformation?.companyType,
        establishmentDate: flowData?.companyInformation?.registrationDate,
      };
    },
    fileType: 'certificate_of_incorporation',
    fileCategory: 'registration_document',
  },
  companyStructure: {
    getProperties: ({ flowData }) => {
      return flowData?.ubos?.shareholders && flowData?.ubos.shareholders.length
        ? {
            firstName: flowData?.ubos.shareholders.at(-1).name.firstName,
            lastName: flowData?.ubos.shareholders.at(-1).name.lastName,
          }
        : {};
    },
    fileType: 'shareholders',
    fileCategory: 'company_structure',
  },
};

const extractFilesFromPayload = (
  documentConfigurations: DocumentConfiguration[],
  payload: object,
) => {
  return documentConfigurations
    .map(config => {
      const fileInPayload = payload[config.name];
      if (!fileInPayload) return null;

      return { file: fileInPayload as File, fileKey: config.name };
    })
    .filter(Boolean);
};

export const selectDocuments = (
  flowData: WorkflowFlowData,
  existingDocuments: Document[],
  documentConfigurations: DocumentConfiguration[],
): Document[] => {
  const { companyDocuments } = flowData.flowData;

  try {
    const filesMetadata: { fileKey: FileInputName; file: File }[] = extractFilesFromPayload(
      documentConfigurations,
      companyDocuments,
    );

    const documents = filesMetadata
      .filter(file => file.file instanceof File)
      .map((filePayload): Document => {
        const fileId = collectionFlowFileStorage.getFileId(filePayload.file);
        const helpers = fileHelpers[filePayload.fileKey];

        const document: Document = {
          fileId,
          type: helpers ? helpers.fileType : 'unknown',
          category: helpers ? helpers.fileCategory : 'unknown',
          properties: helpers ? helpers.getProperties(flowData) : {},
        };

        return document;
      });

    return documents.map(doc => {
      const existingDocument = existingDocuments.find(
        existingDocument =>
          existingDocument.type === doc.type && existingDocument.category === doc.category,
      );
      if (existingDocument) {
        return {
          ...doc,
          id: existingDocument.id,
          decision:
            existingDocument?.decision?.status === 'approved'
              ? existingDocument.decision
              : undefined,
        };
      }

      return doc;
    });
  } catch (error) {
    console.log('error', error);
    return [];
  }
};
