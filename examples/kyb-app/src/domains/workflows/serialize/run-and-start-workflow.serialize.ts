import { TRunWorkflowDto, WorkflowUBO, WorkflowUpdatePayload } from '@app/domains/workflows/types';
import { v4 as uuidv4 } from 'uuid';

function createUBOFromUserInformation(data: WorkflowUpdatePayload): WorkflowUBO {
  const ubo: WorkflowUBO = {
    entity: {
      id: uuidv4(),
      type: 'individual',
      data: {
        firstName: data.entity.mainRepresentative.name.firstName,
        lastName: data.entity.mainRepresentative.name.lastName,
        email: data.entity.email,
        dateOfBirth: new Date(+data.entity.mainRepresentative.birthDate).toISOString(),
      },
    },
  };

  return ubo;
}

export const serializeWorkflowUpdatePayload = (data: WorkflowUpdatePayload): TRunWorkflowDto => {
  const ubos = data.entity.ubos.map(ubo => {
    ubo.entity.data.additionalInfo = {
      ...(ubo.entity.data.additionalInfo || {}),
      companyName: data.entity.companyName,
      customerCompany: data.entity.companyName,
    };

    return ubo;
  });

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
          countryOfIncorporation: data.entity.country,
          address: {
            text: data.entity.address,
          },
          additionalInfo: {
            ...data.entity.additionalInfo,
            mainRepresentative: {
              firstName: data.entity.mainRepresentative.name.firstName,
              lastName: data.entity.mainRepresentative.name.lastName,
              phone: data.entity.mainRepresentative.phoneNumber,
              dateOfBirth: data.entity.birthDate,
              companyName: data.entity.companyName,
              email: data.entity.email,
              title: data.entity.mainRepresentative.title,
            },
            ubos: data.isShareholder ? [createUBOFromUserInformation(data), ...ubos] : ubos,
          },
        },
      },
      documents: data.documents.map(({ category, country, type, pages, properties }) => ({
        category,
        type,
        issuer: {
          country,
        },
        decision: { status: '', revisionReason: '', rejectionReason: '' },
        pages: pages.map(({ fileId }) => ({ ballerineFileId: fileId })),
        properties,
        version: '1',
        issuingVersion: 1,
      })),
    },
  };

  return payload;
};
