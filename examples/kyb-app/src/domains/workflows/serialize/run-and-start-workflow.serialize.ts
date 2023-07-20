import { RunWorkflowDto, TRunWorkflowDto } from '@app/domains/workflows/types';

export const runAndStartWorkflowSerialize = (data: RunWorkflowDto): TRunWorkflowDto => {
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
          countryOfIncorporation: "Great Britain", // TODO: this needs to be extracted from address
          address: {
            text: data.entity.address,
          },
          additionalInfo: {
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
        pages: pages.map(({ fileId }) => ({ ballerineFileId: fileId })),
        properies: {},
        version: '1',
        issuingVersion: 1,
      })),
    },
  };

  return payload;
};
