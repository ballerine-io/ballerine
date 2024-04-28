import { TRegistryInformationData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/registry-information.schema';
import { IRegistryInformationItem } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/types';

export const createRegistryItems = (
  registryInformationData: TRegistryInformationData,
): IRegistryInformationItem[] => {
  const {
    companyName,
    registrationNumber,
    registryPage,
    registrationAddress,
    incorporationDate,
    companyType,
    companyStatus,
    lastUpdate,
    creationDate,
    registeredAt,
  } = registryInformationData;

  return [
    {
      key: 'name',
      title: 'Name',
      value: companyName || '',
    },
    {
      key: 'registrationNumber',
      title: 'Registration number',
      value: registrationNumber || '',
    },
    {
      key: 'incorporationDate',
      title: 'Incorporation date',
      value: incorporationDate || '',
    },
    {
      key: 'companyType',
      title: 'Company type',
      value: companyType || '',
    },
    {
      key: 'currentStatus',
      title: 'Current status',
      value: companyStatus || '',
    },
    {
      key: 'lastUpdate',
      title: 'Last update',
      value: lastUpdate?.toISOString() || '',
    },
    {
      key: 'registeredAt',
      title: 'Registered At',
      value: registeredAt || '',
    },
    {
      key: 'registeredAddress',
      title: 'Registered Address',
      value: registrationAddress || '',
    },
    {
      key: 'createdAt',
      title: 'Created at',
      value: creationDate?.toISOString(),
    },
    {
      key: 'registryPage',
      title: 'Registry page',
      value: registryPage || '',
      valueType: 'link',
    },
  ];
};
