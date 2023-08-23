import { Document, DocumentConfiguration } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { collectionFlowFileStorage } from '@app/pages/CollectionFlow/collection-flow.file-storage';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';

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
  payload: WorkflowFlowData,
) => {
  return documentConfigurations
    .map(config => {
      const fileInPayload: string | File | null = traverseObjectAndPickValue(
        config.name,
        payload,
        null,
      );
      if (!fileInPayload) return null;

      return {
        file: fileInPayload instanceof File ? fileInPayload : null,
        fileKey: config.name,
        fileUrl: typeof fileInPayload === 'string' ? fileInPayload : null,
      };
    })
    .filter(Boolean);
};

export const selectDocuments = (
  flowData: WorkflowFlowData,
  existingDocuments: Document[],
  documentConfigurations: DocumentConfiguration[],
): Document[] => {
  try {
    const filesMetadata: { fileKey: FileInputName; file: File | string; fileUrl: string | null }[] =
      extractFilesFromPayload(documentConfigurations, flowData);

    const documents = filesMetadata.map((filePayload): Document => {
      const file =
        filePayload.file instanceof File
          ? collectionFlowFileStorage.getFileId(filePayload.file)
          : filePayload.file;
      const helpers = fileHelpers[filePayload.fileKey];
      const config = documentConfigurations.find(config => config.name === filePayload.fileKey);

      const document: Document = {
        fileId: filePayload.file instanceof File ? file : undefined,
        type: helpers ? helpers.fileType : config.properties?.type || 'unknown',
        category: helpers ? helpers.fileCategory : config.properties?.category || 'unknown',
        properties: helpers ? helpers.getProperties(flowData) : {},
        uri: filePayload.fileUrl ?? undefined,
        provider: config?.provider,
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
