import { MainRepresentative, TUser } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';

export const selectMainRepresentative = (
  { flowData }: WorkflowFlowData,
  user: TUser,
): MainRepresentative => {
  const data: MainRepresentative = {
    firstName: traverseObjectAndPickValue('firstName', flowData, ''),
    lastName: traverseObjectAndPickValue('lastName', flowData, ''),
    phone: traverseObjectAndPickValue('personalPhoneNumber', flowData, ''),
    dateOfBirth: traverseObjectAndPickValue('birthDate', flowData, ''),
    companyName: traverseObjectAndPickValue('companyName', flowData, ''),
    email: user.email || '',
    title: traverseObjectAndPickValue('title', flowData, ''),
  };

  return data;
};
