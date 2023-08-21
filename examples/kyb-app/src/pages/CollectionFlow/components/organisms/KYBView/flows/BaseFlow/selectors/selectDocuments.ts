import {
  FileWithMetadata,
  parseBase64FileWithMetadata,
} from '@app/common/utils/parse-base64-file-with-metadata';
import { Document } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { getFilesId } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-file-ids';
import { base64ToFile } from '@ballerine/ui';

const allowedFileslist = [
  'addressProof',
  'registrationCertificate',
  'bankStatement',
  'companyStructure',
] as const;
type FileInputName = (typeof allowedFileslist)[number];
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
      return flowData?.ubos.shareholders && flowData?.ubos.shareholders.length
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

const extractFilesFromPayload = (fileNames: typeof allowedFileslist, payload: object) => {
  return fileNames
    .map(fileName => {
      const fileInPayload = payload[fileName];
      if (!fileInPayload) return null;

      return { ...parseBase64FileWithMetadata(fileInPayload), fileKey: fileName as FileInputName };
    })
    .filter(Boolean);
};

export const selectDocuments = async (
  flowData: WorkflowFlowData,
  documents: Document[],
): Promise<Document[]> => {
  const { companyDocuments } = flowData.flowData;

  try {
    const filesMetadata: (FileWithMetadata & { fileKey: FileInputName })[] =
      extractFilesFromPayload(allowedFileslist, companyDocuments);
    const documents = await Promise.all(
      filesMetadata.map((fileWithMetadata): Promise<Document> => {
        return new Promise(async resolve => {
          const fileId = await getFilesId(
            await base64ToFile(fileWithMetadata.file, fileWithMetadata.name, fileWithMetadata.type),
          );
          const helpers = fileHelpers[fileWithMetadata.fileKey];

          const document: Document = {
            fileId,
            type: helpers.fileType,
            category: helpers.fileCategory,
            properties: helpers.getProperties(flowData),
          };

          resolve(document);
        });
      }),
    );

    return documents.map(doc => {
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
