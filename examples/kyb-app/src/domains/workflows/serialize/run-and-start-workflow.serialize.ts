import { TRunWorkflowDto, WorkflowUpdatePayload } from '@app/domains/workflows/types';

export const serializeWorkflowUpdatePayload = (data: WorkflowUpdatePayload): TRunWorkflowDto => {
  const payload: TRunWorkflowDto = {
    workflowId: data.workflowId,
    context: {
      entity: {
        endUserId: data.endUserId,
        ballerineEntityId: data.businessId,
        type: 'business',
        data: {
          website: data.entity.website,
          registrationNumber: data.entity.registrationNumber,
          companyName: data.entity.companyName,
          countryOfIncorporation: data.entity.country, // TODO: this needs to be extracted from address
          address: {
            text: data.entity.address,
          },
          additionalInfo: {
            mainRepresentative: data.entity.mainRepresentative,
            ubos: data.entity.ubos.map(ubo => {
              ubo.entity.data.additionalInfo = {
                ...(ubo.entity.data.additionalInfo || {}),
                companyName: data.entity.companyName,
                customerCompany: 'PayLink',
              };

              return ubo;
            }),
          },
        },
      },
      documents: data.documents.map(({ category, country, type, pages }) => ({
        category,
        type,
        issuer: {
          country,
        },
        decision: { status: '', revisionReason: '', rejectionReason: '' },
        pages: pages.map(({ fileId }) => ({ ballerineFileId: fileId })),
        properies: {},
        version: '1',
        issuingVersion: 1,
      })),
    },
  };

  return payload;
};
