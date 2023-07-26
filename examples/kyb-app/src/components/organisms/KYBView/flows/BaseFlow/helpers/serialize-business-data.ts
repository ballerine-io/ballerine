import { UpdateBusinessDto } from '@app/domains/business';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const serializeBusinessData = (
  context: WorkflowFlowData,
  businessId: string,
): UpdateBusinessDto => {
  const { businessAddress, businessInformation } = context.flowData;

  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: businessInformation.registrationNumber,
    address: businessAddress.address,
    website: businessInformation.website,
  };

  return dto;
};
