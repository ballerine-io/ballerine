import { MainRepresentative, TUser } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const selectMainRepresentative = (
  { flowData }: WorkflowFlowData,
  user: TUser,
): MainRepresentative => {
  const data: MainRepresentative = {
    firstName: flowData.personalInformation?.name?.firstName || '',
    lastName: flowData.personalInformation?.name?.lastName || '',
    phone: flowData.personalInformation?.phoneNumber || '',
    dateOfBirth: flowData.personalInformation?.birthDate || '',
    companyName: flowData.companyInformation?.companyName || '',
    email: user.email,
    title: flowData.personalInformation?.title,
  };

  return data;
};
