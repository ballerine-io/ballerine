import { TRegistryInformationData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/registry-information.schema';
import { IRegistryInformationItem } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/types';
import { valueOrNone } from '@/pages/Entity/pdfs/case-information/utils/value-or-none';

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
      value: valueOrNone(companyName),
    },
    {
      key: 'registrationNumber',
      title: 'Registration number',
      value: valueOrNone(registrationNumber),
    },
    {
      key: 'incorporationDate',
      title: 'Incorporation date',
      value: valueOrNone(incorporationDate),
    },
    {
      key: 'companyType',
      title: 'Company type',
      value: valueOrNone(companyType),
    },
    {
      key: 'currentStatus',
      title: 'Current status',
      value: valueOrNone(companyStatus),
    },
    {
      key: 'lastUpdate',
      title: 'Last update',
      value: valueOrNone(lastUpdate?.toISOString()),
    },
    {
      key: 'registeredAt',
      title: 'Registered At',
      value: valueOrNone(registeredAt),
    },
    {
      key: 'registeredAddress',
      title: 'Registered Address',
      value: valueOrNone(registrationAddress),
    },
    {
      key: 'createdAt',
      title: 'Created at',
      value: valueOrNone(creationDate?.toISOString()),
    },
    {
      key: 'registryPage',
      title: 'Registry page',
      value: valueOrNone(registryPage),
      valueType: 'link',
    },
  ];
};
