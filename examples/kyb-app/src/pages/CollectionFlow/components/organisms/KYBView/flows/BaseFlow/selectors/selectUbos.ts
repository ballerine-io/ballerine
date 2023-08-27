import { TUser, UBO } from '@app/domains/collection-flow';
import { UBOSContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { v4 } from 'uuid';

export const selectUbos = ({ flowData }: WorkflowFlowData, user: TUser) => {
  const ubosData = flowData.ubos as UBOSContext;
  const list: UBO[] = [];

  if (ubosData?.check) {
    list.push({
      id: v4(),
      firstName: flowData?.personalInformation?.name?.firstName,
      lastName: flowData?.personalInformation?.name?.lastName,
      email: user.email,
      birthDate: flowData?.personalInformation?.birthDate,
      title: flowData?.personalInformation?.title,
    });
  }

  (ubosData?.shareholders || []).forEach(uboData => {
    list.push({
      id: v4(),
      firstName: uboData.name.firstName,
      lastName: uboData.name.lastName,
      title: uboData.title,
      birthDate: uboData.birthDate,
      email: uboData.email,
    });
  });

  return list;
};
