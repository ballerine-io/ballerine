import { FileStorage } from '@app/common/utils/file-storage';
import { DocumentsContext } from '@app/components/organisms/KYBView/types';
import { UpdateBusinessDto } from '@app/domains/business';
import { uploadFile } from '@app/domains/storage/storage.api';

export const serializeViewData = async (
  context: DocumentsContext,
  businessId: string,
  fileStorage: FileStorage,
): Promise<UpdateBusinessDto> => {
  const [registrationCertificate, bill] = await Promise.all([
    uploadFile({ file: fileStorage.get(context.documents.registrationCertificate) }),
    uploadFile({ file: fileStorage.get(context.documents.bill) }),
  ]);

  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: context.information.registrationNumber,
    address: context.address.address,
    website: context.information.website,
    shareholderStructure: (context.shareholders || []).map(shareholder => ({
      name: `${shareholder.firstName} ${shareholder.lastName}`,
    })),
    documents: {
      registrationDocument: registrationCertificate.uri,
      financialStatement: bill.uri,
    },
  };

  return dto;
};
